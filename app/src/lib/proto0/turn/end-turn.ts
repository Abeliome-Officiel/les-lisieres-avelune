import type { CorciteState } from '../domain/corcite.js';
import type {
	TurnJournalEntry,
	TurnPlan
} from '../domain/turn.js';
import {
	resolveAfterArbitration
} from './arbitration.js';
import { lockTurnPlan } from './plan.js';
import {
	resolveTurnReservations,
	type ReservationResolution
} from './reservations.js';

export type EndTurnStatus =
	| 'awaiting-arbitration'
	| 'ready-for-resolution';

export interface EndTurnResult
	extends ReservationResolution {
	status: EndTurnStatus;
}

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

function statusFromPlan(
	plan: TurnPlan
): EndTurnStatus {
	if (plan.phase === 'awaiting-arbitration') {
		return 'awaiting-arbitration';
	}

	if (plan.phase === 'reservations-resolved') {
		return 'ready-for-resolution';
	}

	throw new Error(
		`Phase inattendue après préparation de fin de tour : ${plan.phase}.`
	);
}

/**
 * Action explicite du joueur "Terminer le tour".
 *
 * Cette fonction :
 * 1. journalise la demande ;
 * 2. verrouille les choix ;
 * 3. résout les réservations ;
 * 4. s'arrête si un arbitrage humain est nécessaire.
 *
 * Les étapes TF/RPG/TD ultérieures ne sont volontairement
 * pas exécutées par P2.
 */
export function endTurn(
	inputState: CorciteState,
	inputPlan: TurnPlan
): EndTurnResult {
	if (inputPlan.phase !== 'player') {
		throw new Error(
			"Terminer le tour n'est possible que pendant la phase joueur."
		);
	}

	const requestedPlan = structuredClone(inputPlan);

	appendJournal(requestedPlan, {
		event: 'end-turn-requested',
		message:
			`Le joueur demande la résolution du tour ${requestedPlan.turn}.`
	});

	const lockedPlan = lockTurnPlan(
		requestedPlan
	);

	const reservationResult =
		resolveTurnReservations(
			inputState,
			lockedPlan
		);

	return {
		...reservationResult,
		status: statusFromPlan(
			reservationResult.plan
		)
	};
}

/**
 * Reprend la préparation du tour après une décision humaine.
 *
 * baseState doit être l'état antérieur aux réservations du tour.
 */
export function continueEndTurnAfterArbitration(
	baseState: CorciteState,
	inputPlan: TurnPlan,
	conflictId: string,
	selectedOperationIds: readonly string[]
): EndTurnResult {
	if (
		inputPlan.phase !==
		'awaiting-arbitration'
	) {
		throw new Error(
			"Le tour n'attend pas d'arbitrage."
		);
	}

	const reservationResult =
		resolveAfterArbitration(
			baseState,
			inputPlan,
			conflictId,
			selectedOperationIds
		);

	return {
		...reservationResult,
		status: statusFromPlan(
			reservationResult.plan
		)
	};
}
