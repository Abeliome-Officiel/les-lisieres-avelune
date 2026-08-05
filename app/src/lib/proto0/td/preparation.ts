import {
	TD_PREPARATION_LAB_REFERENCE
} from '../config/td-preparation-reference.js';
import type {
	PlayerOperation
} from '../domain/turn.js';

export interface CreateTdPreparationOperationInput {
	operationId: string;
	priority: number;
}

export function createReferenceTdPreparationOperation(
	input: CreateTdPreparationOperationInput
): PlayerOperation {
	if (!input.operationId.trim()) {
		throw new Error(
			"Une préparation TD doit posséder un identifiant d'opération."
		);
	}

	if (
		!Number.isInteger(
			input.priority
		) ||
		input.priority < 0
	) {
		throw new Error(
			"La priorité TD doit être un entier positif ou nul."
		);
	}

	return {
		id: input.operationId,
		label:
			TD_PREPARATION_LAB_REFERENCE
				.label,
		kind: 'resource-demand',
		priority: input.priority,
		resourceCosts:
			structuredClone(
				TD_PREPARATION_LAB_REFERENCE
					.resourceCosts
			),
		status: 'pending'
	};
}
