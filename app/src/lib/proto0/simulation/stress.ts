import {
	createReferenceCorciteState
} from '../corcite/state.js';
import {
	validateCorciteState
} from '../corcite/validate.js';
import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	PlayerOperation
} from '../domain/turn.js';
import type {
	TfProcessingResolution
} from '../domain/tf.js';
import {
	resolveExtractionTurn
} from '../tf/extraction.js';
import {
	getStorageLoad
} from '../tf/storage.js';
import {
	resolveTfCoreTurn
} from '../tf/turn.js';
import {
	resolveTransformationTurn
} from '../tf/transformation.js';
import {
	resolveAfterArbitration
} from '../turn/arbitration.js';
import {
	addPlayerOperation,
	createTurnPlan,
	lockTurnPlan
} from '../turn/plan.js';
import {
	resolveTurnReservations
} from '../turn/reservations.js';

export interface Proto0StressAudit {
	tfTurnsRequested: number;
	tfTurnsCompleted: number;
	allTfStatesValid: boolean;
	freeProcessingDetected: boolean;
	storageSaturationHandled: boolean;
	blockedChainHandled: boolean;
	insufficientResourceExplicit: boolean;
	humanConflictExplicit: boolean;
	humanConflictResolved: boolean;
	impossibleStateDetected: boolean;
}

function createStressCorcite(
	id: string
): CorciteState {
	return createReferenceCorciteState({
		id,
		name: id,
		controller: 'human'
	});
}

function operation(
	id: string,
	resourceCosts:
		PlayerOperation['resourceCosts']
): PlayerOperation {
	return {
		id,
		label:
			`Stress ${id}`,
		kind:
			'resource-demand',
		priority: 0,
		resourceCosts,
		status: 'pending'
	};
}

function consumedAmount(
	event:
		TfProcessingResolution['events'][number],
	resourceId: string
): number {
	const storage =
		event.consumptions
			.filter(
				(movement) =>
					movement.resourceId ===
						resourceId
			)
			.reduce(
				(total, movement) =>
					total +
					movement.amount,
				0
			);

	const buffers =
		(
			event.bufferConsumptions ??
			[]
		)
			.filter(
				(movement) =>
					movement.resourceId ===
						resourceId
			)
			.reduce(
				(total, movement) =>
					total +
					movement.amount,
				0
			);

	return storage + buffers;
}

function resolutionCreatesFreeProcessing(
	resolution:
		TfProcessingResolution
): boolean {
	for (
		const event of
		resolution.events
	) {
		if (
			event.status !==
			'produced'
		) {
			continue;
		}

		for (
			const [
				resourceId,
				required
			] of Object.entries(
				event.inputs
			)
		) {
			if (
				required === undefined ||
				required <= 0
			) {
				continue;
			}

			if (
				consumedAmount(
					event,
					resourceId
				) +
					1e-9 <
				required
			) {
				return true;
			}
		}
	}

	return false;
}

export function runProto0StressAudit(
	tfTurns = 100
): Proto0StressAudit {
	let tfState =
		createStressCorcite(
			'corcite-p9-long-run'
		);

	let completed = 0;
	let allTfStatesValid = true;
	let freeProcessingDetected =
		false;

	for (
		let turn = 1;
		turn <= tfTurns;
		turn += 1
	) {
		const result =
			resolveTfCoreTurn(
				tfState
			);

		if (
			resolutionCreatesFreeProcessing(
				result.transformation
			) ||
			resolutionCreatesFreeProcessing(
				result.fabrication
			)
		) {
			freeProcessingDetected =
				true;
		}

		tfState =
			result.corcite;

		if (
			!validateCorciteState(
				tfState
			).valid
		) {
			allTfStatesValid =
				false;
		}

		completed += 1;
	}

	const saturated =
		createStressCorcite(
			'corcite-p9-saturated'
		);

	for (
		const storage of
		saturated.storageUnits
	) {
		storage.capacity =
			getStorageLoad(
				storage
			);
	}

	const saturatedExtraction =
		resolveExtractionTurn(
			saturated
		);

	const storageSaturationHandled =
		saturatedExtraction.resolution
			.events.every(
				(event) =>
					event.status ===
						'storage-blocked'
			);

	const blockedChain =
		createStressCorcite(
			'corcite-p9-chain'
		);

	const transformer =
		blockedChain.structures.find(
			(structure) =>
				structure.kind ===
					'transformer-n1'
		);

	if (transformer) {
		transformer.status =
			'inactive';
	}

	const blockedResolution =
		resolveTransformationTurn(
			blockedChain
		);

	const blockedChainHandled =
		blockedResolution.resolution
			.events.some(
				(event) =>
					event.status ===
						'inactive'
			);

	const insufficient =
		createStressCorcite(
			'corcite-p9-insufficient'
		);

	let insufficientPlan =
		createTurnPlan(1);

	insufficientPlan =
		addPlayerOperation(
			insufficientPlan,
			operation(
				'insufficient-r4',
				{
					R4: 2
				}
			)
		);

	const insufficientResult =
		resolveTurnReservations(
			insufficient,
			lockTurnPlan(
				insufficientPlan
			)
		);

	const insufficientResourceExplicit =
		insufficientResult.plan
			.operations[0]
			?.status ===
				'blocked' &&
		insufficientResult.plan
			.conflicts.some(
				(conflict) =>
					conflict.reason ===
						'insufficient-resource'
			);

	const conflictCorcite =
		createStressCorcite(
			'corcite-p9-conflict'
		);

	let conflictPlan =
		createTurnPlan(1);

	conflictPlan =
		addPlayerOperation(
			conflictPlan,
			operation(
				'conflict-a',
				{
					R4: 1
				}
			)
		);

	conflictPlan =
		addPlayerOperation(
			conflictPlan,
			operation(
				'conflict-b',
				{
					R4: 1
				}
			)
		);

	const conflictFirst =
		resolveTurnReservations(
			conflictCorcite,
			lockTurnPlan(
				conflictPlan
			)
		);

	const conflict =
		conflictFirst.plan
			.conflicts.find(
				(candidate) =>
					candidate
						.requiresHumanArbitration
			);

	const humanConflictExplicit =
		conflictFirst.plan.phase ===
			'awaiting-arbitration' &&
		Boolean(conflict);

	let humanConflictResolved =
		false;

	if (conflict) {
		const resolved =
			resolveAfterArbitration(
				conflictCorcite,
				conflictFirst.plan,
				conflict.id,
				[
					'conflict-a'
				]
			);

		humanConflictResolved =
			resolved.plan.phase ===
				'reservations-resolved' &&
			resolved.plan.operations
				.filter(
					(candidate) =>
						candidate.status ===
							'reserved'
				)
				.length ===
				1;
	}

	const impossible =
		createStressCorcite(
			'corcite-p9-impossible'
		);

	impossible.storageUnits[0]
		.contents.R1 =
		impossible.storageUnits[0]
			.capacity +
		1;

	const impossibleStateDetected =
		!validateCorciteState(
			impossible
		).valid;

	return {
		tfTurnsRequested:
			tfTurns,
		tfTurnsCompleted:
			completed,
		allTfStatesValid,
		freeProcessingDetected,
		storageSaturationHandled,
		blockedChainHandled,
		insufficientResourceExplicit,
		humanConflictExplicit,
		humanConflictResolved,
		impossibleStateDetected
	};
}
