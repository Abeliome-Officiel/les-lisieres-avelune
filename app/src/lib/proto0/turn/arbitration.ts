import type { CorciteState } from '../domain/corcite.js';
import type {
	TurnArbitrationDecision,
	TurnJournalEntry,
	TurnPlan
} from '../domain/turn.js';
import {
	resolveTurnReservations,
	type ReservationResolution
} from './reservations.js';

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

function preparePlanForRecalculation(
	inputPlan: TurnPlan,
	decision: TurnArbitrationDecision
): TurnPlan {
	const plan = structuredClone(inputPlan);

	plan.arbitrations = [
		...plan.arbitrations.filter(
			(candidate) =>
				candidate.conflictId !== decision.conflictId
		),
		structuredClone(decision)
	];

	/*
	 * Le calcul des réservations est intégralement rejoué.
	 * On conserve les choix du joueur, le verrouillage et les
	 * arbitrages, mais pas les résultats intermédiaires du
	 * précédent calcul.
	 */
	plan.conflicts = [];

	for (const operation of plan.operations) {
		if (operation.status !== 'cancelled') {
			operation.status = 'pending';
		}
	}

	plan.journal = plan.journal.filter(
		(entry) =>
			entry.event !== 'reservation-created' &&
			entry.event !== 'operation-reserved' &&
			entry.event !== 'resource-conflict' &&
			entry.event !== 'operation-blocked'
	);

	plan.phase = 'locked';

	appendJournal(plan, {
		event: 'arbitration-recorded',
		message:
			`Arbitrage ${decision.conflictId} enregistré : ` +
			(
				decision.selectedOperationIds.length > 0
					? decision.selectedOperationIds.join(', ')
					: 'aucune opération retenue'
			) +
			'.'
	});

	return plan;
}

export function recordArbitrationDecision(
	inputPlan: TurnPlan,
	conflictId: string,
	selectedOperationIds: readonly string[]
): TurnPlan {
	if (inputPlan.phase !== 'awaiting-arbitration') {
		throw new Error(
			"Un arbitrage ne peut être enregistré que lorsqu'un conflit attend une décision."
		);
	}

	const conflict = inputPlan.conflicts.find(
		(candidate) =>
			candidate.id === conflictId &&
			candidate.requiresHumanArbitration
	);

	if (!conflict) {
		throw new Error(
			`Conflit arbitrable introuvable : ${conflictId}.`
		);
	}

	const selected = [...new Set(selectedOperationIds)].sort();

	if (selected.length !== selectedOperationIds.length) {
		throw new Error(
			"Une opération ne peut pas être sélectionnée plusieurs fois dans le même arbitrage."
		);
	}

	for (const operationId of selected) {
		if (!conflict.operationIds.includes(operationId)) {
			throw new Error(
				`L'opération ${operationId} ne participe pas au conflit ${conflictId}.`
			);
		}
	}

	const selectedDemand = selected.reduce(
		(total, operationId) => {
			const operation = inputPlan.operations.find(
				(candidate) =>
					candidate.id === operationId
			);

			if (!operation) {
				throw new Error(
					`Opération ${operationId} introuvable.`
				);
			}

			return (
				total +
				(
					operation.resourceCosts[
						conflict.resourceId
					] ?? 0
				)
			);
		},
		0
	);

	if (selectedDemand > conflict.available) {
		throw new Error(
			`Arbitrage impossible : ${selectedDemand} ${conflict.resourceId} sélectionné pour ${conflict.available} disponible.`
		);
	}

	return preparePlanForRecalculation(
		inputPlan,
		{
			conflictId,
			selectedOperationIds: selected
		}
	);
}

export function resolveAfterArbitration(
	baseState: CorciteState,
	inputPlan: TurnPlan,
	conflictId: string,
	selectedOperationIds: readonly string[]
): ReservationResolution {
	const turnReservationPrefix =
		`reservation-turn-${inputPlan.turn}-`;

	if (
		baseState.reservations.some(
			(reservation) =>
				reservation.id.startsWith(
					turnReservationPrefix
				)
		)
	) {
		throw new Error(
			"L'arbitrage doit être recalculé depuis l'état du Corcite antérieur aux réservations du tour."
		);
	}

	const revisedPlan = recordArbitrationDecision(
		inputPlan,
		conflictId,
		selectedOperationIds
	);

	return resolveTurnReservations(
		baseState,
		revisedPlan
	);
}
