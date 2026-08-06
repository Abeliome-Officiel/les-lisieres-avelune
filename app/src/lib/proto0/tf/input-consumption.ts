import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfBufferConsumptionMovement,
	TfBufferInputBudget,
	TfResourceMovement
} from '../domain/tf.js';
import {
	consumeResourceDeterministically,
	getTotalAvailableResource
} from './storage.js';

export interface TfInputConsumptionResult {
	storageConsumptions:
		TfResourceMovement[];
	bufferConsumptions:
		TfBufferConsumptionMovement[];
}

export function captureTfBufferInputBudget(
	state: CorciteState
): TfBufferInputBudget {
	const budget:
		TfBufferInputBudget = {};

	for (
		const buffer of
		state.tfNetwork.buffers
	) {
		budget[buffer.id] =
			buffer.amount;
	}

	return budget;
}

function incomingConnections(
	state: CorciteState,
	toStructureId: string,
	resourceId: ResourceId
) {
	return state.tfNetwork.connections
		.filter(
			(connection) =>
				connection.toStructureId ===
					toStructureId &&
				connection.resourceId ===
					resourceId
		)
		.sort(
			(a, b) =>
				a.id.localeCompare(
					b.id
				)
		);
}

export function getEligibleIncomingBufferAmount(
	state: CorciteState,
	budget: Readonly<TfBufferInputBudget>,
	toStructureId: string,
	resourceId: ResourceId
): number {
	let total = 0;

	for (
		const connection of
		incomingConnections(
			state,
			toStructureId,
			resourceId
		)
	) {
		const buffer =
			state.tfNetwork.buffers.find(
				(candidate) =>
					candidate.connectionId ===
						connection.id
			);

		if (!buffer) {
			throw new Error(
				`Connexion ${connection.id} sans tampon TF.`
			);
		}

		const eligible =
			Math.max(
				0,
				Math.min(
					buffer.amount,
					budget[buffer.id] ?? 0
				)
			);

		total += eligible;
	}

	return total;
}

export function getTotalAvailableTfInput(
	state: CorciteState,
	budget: Readonly<TfBufferInputBudget>,
	toStructureId: string,
	resourceId: ResourceId
): number {
	return (
		getEligibleIncomingBufferAmount(
			state,
			budget,
			toStructureId,
			resourceId
		) +
		getTotalAvailableResource(
			state,
			resourceId
		)
	);
}

export function consumeTfInputDeterministically(
	state: CorciteState,
	budget: TfBufferInputBudget,
	toStructureId: string,
	resourceId: ResourceId,
	amount: number
): TfInputConsumptionResult {
	if (
		!Number.isFinite(amount) ||
		amount < 0
	) {
		throw new Error(
			`Quantité TF à consommer invalide : ${amount}.`
		);
	}

	if (
		getTotalAvailableTfInput(
			state,
			budget,
			toStructureId,
			resourceId
		) < amount
	) {
		throw new Error(
			`Intrant ${resourceId} insuffisant pour ${toStructureId}.`
		);
	}

	let remaining = amount;

	const bufferConsumptions:
		TfBufferConsumptionMovement[] = [];

	for (
		const connection of
		incomingConnections(
			state,
			toStructureId,
			resourceId
		)
	) {
		if (remaining <= 0) {
			break;
		}

		const buffer =
			state.tfNetwork.buffers.find(
				(candidate) =>
					candidate.connectionId ===
						connection.id
			);

		if (!buffer) {
			throw new Error(
				`Connexion ${connection.id} sans tampon TF.`
			);
		}

		const eligible =
			Math.max(
				0,
				Math.min(
					buffer.amount,
					budget[buffer.id] ?? 0
				)
			);

		if (eligible <= 0) {
			continue;
		}

		const consumed =
			Math.min(
				eligible,
				remaining
			);

		buffer.amount -=
			consumed;

		budget[buffer.id] =
			Math.max(
				0,
				(budget[buffer.id] ?? 0) -
					consumed
			);

		bufferConsumptions.push({
			bufferId: buffer.id,
			connectionId:
				connection.id,
			fromStructureId:
				connection.fromStructureId,
			resourceId,
			amount: consumed
		});

		remaining -= consumed;
	}

	const storageConsumptions =
		remaining > 0
			? consumeResourceDeterministically(
					state,
					resourceId,
					remaining
			  )
			: [];

	return {
		storageConsumptions,
		bufferConsumptions
	};
}
