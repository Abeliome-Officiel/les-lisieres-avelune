import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	ResourceReservation
} from '../domain/resources.js';
import type {
	TfExtractionPlacement,
	TfExtractionResolution,
	TfProcessingResolution,
	TfResourceMovement
} from '../domain/tf.js';
import {
	resolveExtractionTurn
} from './extraction.js';
import {
	resolveFabricationTurn
} from './fabrication.js';
import {
	captureTfBufferInputBudget
} from './input-consumption.js';
import {
	resolveTransformationTurn
} from './transformation.js';

export interface TfCoreTurnResult {
	corcite: CorciteState;
	extraction: TfExtractionResolution;
	transformation: TfProcessingResolution;
	fabrication: TfProcessingResolution;
}

type OutputMovement =
	| TfExtractionPlacement
	| TfResourceMovement;

const OUTPUT_LOCK_PREFIX =
	'__proto0-tf-output-lock__';

function collectExtractionOutputs(
	resolution: TfExtractionResolution
): OutputMovement[] {
	return resolution.events.flatMap(
		(event) =>
			event.status === 'produced'
				? event.placements
				: []
	);
}

function collectProcessingOutputs(
	resolution: TfProcessingResolution
): OutputMovement[] {
	return resolution.events.flatMap(
		(event) =>
			event.status === 'produced'
				? event.placements
				: []
	);
}

function addTemporaryOutputLocks(
	state: CorciteState,
	stage: string,
	movements: readonly OutputMovement[]
): string[] {
	const ids: string[] = [];

	for (
		let index = 0;
		index < movements.length;
		index += 1
	) {
		const movement =
			movements[index];

		const id = [
			OUTPUT_LOCK_PREFIX,
			stage,
			String(index),
			movement.storageUnitId,
			movement.resourceId
		].join(':');

		if (
			state.reservations.some(
				(reservation) =>
					reservation.id === id
			)
		) {
			throw new Error(
				`Collision de verrou TF temporaire : ${id}.`
			);
		}

		const reservation:
			ResourceReservation = {
				id,
				operationId:
					`${OUTPUT_LOCK_PREFIX}:${stage}`,
				storageUnitId:
					movement.storageUnitId,
				resourceId:
					movement.resourceId,
				amount:
					movement.amount,
				purpose:
					`Sortie TF ${stage} indisponible jusqu'au tour suivant`,
				status: 'active'
			};

		state.reservations.push(
			reservation
		);

		ids.push(id);
	}

	return ids;
}

function removeTemporaryOutputLocks(
	state: CorciteState,
	ids: readonly string[]
): void {
	const idSet = new Set(ids);

	state.reservations =
		state.reservations.filter(
			(reservation) =>
				!idSet.has(
					reservation.id
				)
		);
}

/**
 * Résolution TF canonique d'un tour.
 *
 * Les sorties d'une étape sont bien ajoutées au stockage et
 * occupent immédiatement de la capacité, mais elles sont verrouillées
 * pour les étapes aval de CE MÊME tour.
 *
 * Elles deviennent donc utilisables au tour suivant.
 */
export function resolveTfCoreTurn(
	inputState: CorciteState
): TfCoreTurnResult {
	const turnStartBufferBudget =
		captureTfBufferInputBudget(
			inputState
		);

	const extraction =
		resolveExtractionTurn(
			inputState
		);

	let state =
		extraction.corcite;

	const temporaryLockIds: string[] = [];

	temporaryLockIds.push(
		...addTemporaryOutputLocks(
			state,
			'extraction',
			collectExtractionOutputs(
				extraction.resolution
			)
		)
	);

	const transformation =
		resolveTransformationTurn(
			state,
			undefined,
			turnStartBufferBudget
		);

	state = transformation.corcite;

	temporaryLockIds.push(
		...addTemporaryOutputLocks(
			state,
			'transformation',
			collectProcessingOutputs(
				transformation.resolution
			)
		)
	);

	const fabrication =
		resolveFabricationTurn(
			state,
			undefined,
			turnStartBufferBudget
		);

	state = fabrication.corcite;

	removeTemporaryOutputLocks(
		state,
		temporaryLockIds
	);

	return {
		corcite: state,
		extraction:
			extraction.resolution,
		transformation:
			transformation.resolution,
		fabrication:
			fabrication.resolution
	};
}
