import type {
	CorciteState,
	PlayableCorciteState,
	StructureState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfConnectionRouting
} from '../domain/tf.js';
import {
	connectTfStructures
} from './network.js';
import {
	validateTfNetworkState
} from './network-validate.js';
import {
	validateCorciteState
} from '../corcite/validate.js';

export interface PlayableConnectionPreview {
	fromStructureId: string;
	fromStructureName: string;
	toStructureId: string;
	toStructureName: string;
	resourceId: ResourceId;
	canConnect: boolean;
	error?: string;
}

function requirePlayableState(
	state: CorciteState
): PlayableCorciteState {
	if (state.population === undefined) {
		throw new Error(
			"Le réseau jouable nécessite un Corcite avec une population."
		);
	}

	return state as PlayableCorciteState;
}

function getStructure(
	state: CorciteState,
	id: string
): StructureState {
	const structure =
		state.structures.find(
			(candidate) =>
				candidate.id === id
		);

	if (!structure) {
		throw new Error(
			`Structure inconnue : ${id}.`
		);
	}

	return structure;
}

export function previewPlayableTfConnection(
	inputState: CorciteState,
	fromStructureId: string,
	toStructureId: string,
	resourceId: ResourceId
): PlayableConnectionPreview {
	const from =
		getStructure(
			inputState,
			fromStructureId
		);

	const to =
		getStructure(
			inputState,
			toStructureId
		);

	const connectionId =
		[
			'preview',
			fromStructureId,
			toStructureId,
			resourceId
		].join(':');

	try {
		connectTfStructures(
			inputState,
			{
				id: connectionId,
				fromStructureId,
				toStructureId,
				resourceId,
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

		return {
			fromStructureId,
			fromStructureName:
				from.name,
			toStructureId,
			toStructureName:
				to.name,
			resourceId,
			canConnect: true
		};
	} catch (error) {
		return {
			fromStructureId,
			fromStructureName:
				from.name,
			toStructureId,
			toStructureName:
				to.name,
			resourceId,
			canConnect: false,
			error:
				error instanceof Error
					? error.message
					: String(error)
		};
	}
}

export function connectPlayableTfStructures(
	inputState: CorciteState,
	input: {
		id: string;
		fromStructureId: string;
		toStructureId: string;
		resourceId: ResourceId;
		routing?: TfConnectionRouting;
	}
): PlayableCorciteState {
	requirePlayableState(
		inputState
	);

	const result =
		connectTfStructures(
			inputState,
			{
				id: input.id,
				fromStructureId:
					input.fromStructureId,
				toStructureId:
					input.toStructureId,
				resourceId:
					input.resourceId,
				routing:
					input.routing ?? {
						mode: 'priority',
						priority: 1
					}
			}
		);

	const playable =
		requirePlayableState(
			result
		);

	const networkValidation =
		validateTfNetworkState(
			playable.tfNetwork,
			playable.structures
		);

	if (!networkValidation.valid) {
		throw new Error(
			`Réseau TF invalide après connexion : ${networkValidation.errors.join(' | ')}`
		);
	}

	const validation =
		validateCorciteState(
			playable
		);

	if (!validation.valid) {
		throw new Error(
			`Etat Corcite invalide après connexion : ${validation.errors.join(' | ')}`
		);
	}

	return playable;
}
