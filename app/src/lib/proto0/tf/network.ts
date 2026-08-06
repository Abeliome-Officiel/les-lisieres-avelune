import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfConnectionRouting,
	TfConnectionState,
	TfBufferState
} from '../domain/tf.js';
import {
	getTfDownstreamBatchRequirement,
	validateTfNetworkState
} from './network-validate.js';

export interface ConnectTfStructuresInput {
	id: string;
	fromStructureId: string;
	toStructureId: string;
	resourceId: ResourceId;
	routing: TfConnectionRouting;
}

export function connectTfStructures(
	inputState: CorciteState,
	input: ConnectTfStructuresInput
): CorciteState {
	if (!input.id.trim()) {
		throw new Error(
			"Une connexion TF doit posséder un identifiant."
		);
	}

	const state =
		structuredClone(inputState);

	if (
		state.tfNetwork.connections.some(
			(connection) =>
				connection.id === input.id
		)
	) {
		throw new Error(
			`Connexion TF déjà existante : ${input.id}.`
		);
	}

	const capacity =
		getTfDownstreamBatchRequirement(
			state.structures,
			input.toStructureId,
			input.resourceId
		);

	const connection:
		TfConnectionState = {
			id: input.id,
			fromStructureId:
				input.fromStructureId,
			toStructureId:
				input.toStructureId,
			resourceId:
				input.resourceId,
			routing:
				structuredClone(
					input.routing
				)
		};

	const buffer:
		TfBufferState = {
			id: `buffer:${input.id}`,
			connectionId:
				input.id,
			resourceId:
				input.resourceId,
			capacity,
			amount: 0
		};

	state.tfNetwork.connections.push(
		connection
	);

	state.tfNetwork.buffers.push(
		buffer
	);

	const validation =
		validateTfNetworkState(
			state.tfNetwork,
			state.structures
		);

	if (!validation.valid) {
		throw new Error(
			`Réseau TF invalide : ${validation.errors.join(' | ')}`
		);
	}

	return state;
}
