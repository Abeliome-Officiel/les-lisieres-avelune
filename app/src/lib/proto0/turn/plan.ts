import type {
	PlayerOperation,
	TurnJournalEntry,
	TurnPlan
} from '../domain/turn.js';
import { RESOURCE_IDS } from '../domain/resources.js';

function nextSequence(plan: TurnPlan): number {
	return plan.journal.length + 1;
}

function appendJournal(
	plan: TurnPlan,
	entry: Omit<TurnJournalEntry, 'sequence'>
): void {
	plan.journal.push({
		sequence: nextSequence(plan),
		...entry
	});
}

function validateOperation(operation: PlayerOperation): void {
	if (!operation.id.trim()) {
		throw new Error(
			"Une opération doit posséder un identifiant."
		);
	}

	if (!operation.label.trim()) {
		throw new Error(
			"Une opération doit posséder un libellé."
		);
	}

	if (
		!Number.isInteger(operation.priority) ||
		operation.priority < 0
	) {
		throw new Error(
			"La priorité d'une opération doit être un entier positif ou nul."
		);
	}

	for (const resourceId of RESOURCE_IDS) {
		const amount = operation.resourceCosts[resourceId];

		if (amount === undefined) continue;

		if (
			!Number.isFinite(amount) ||
			amount <= 0
		) {
			throw new Error(
				`Coût ${resourceId} invalide pour ${operation.id}.`
			);
		}
	}

	if (operation.status !== 'pending') {
		throw new Error(
			"Une nouvelle opération doit être dans l'état pending."
		);
	}
}

export function createTurnPlan(turn: number): TurnPlan {
	if (!Number.isInteger(turn) || turn < 1) {
		throw new Error(
			"Le numéro de tour doit être un entier supérieur ou égal à 1."
		);
	}

	const plan: TurnPlan = {
		turn,
		phase: 'player',
		operations: [],
		conflicts: [],
		arbitrations: [],
		journal: []
	};

	appendJournal(plan, {
		event: 'turn-created',
		message: `Tour ${turn} créé.`
	});

	return plan;
}

export function addPlayerOperation(
	plan: TurnPlan,
	operation: PlayerOperation
): TurnPlan {
	if (plan.phase !== 'player') {
		throw new Error(
			"Les choix du tour sont verrouillés."
		);
	}

	validateOperation(operation);

	if (
		plan.operations.some(
			(candidate) => candidate.id === operation.id
		)
	) {
		throw new Error(
			`Opération dupliquée : ${operation.id}.`
		);
	}

	const result = structuredClone(plan);

	result.operations.push(
		structuredClone(operation)
	);

	appendJournal(result, {
		event: 'operation-added',
		operationId: operation.id,
		message: `Opération ${operation.id} ajoutée.`
	});

	return result;
}

export function lockTurnPlan(plan: TurnPlan): TurnPlan {
	if (plan.phase !== 'player') {
		throw new Error(
			"Le tour ne peut être verrouillé que depuis la phase joueur."
		);
	}

	const result = structuredClone(plan);

	result.phase = 'locked';

	appendJournal(result, {
		event: 'turn-locked',
		message: `Choix du tour ${plan.turn} verrouillés.`
	});

	return result;
}
