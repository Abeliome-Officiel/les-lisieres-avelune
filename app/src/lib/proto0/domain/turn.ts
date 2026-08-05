import type { ResourceId } from './resources.js';

export type TurnPhase =
	| 'player'
	| 'locked'
	| 'awaiting-arbitration'
	| 'reservations-resolved'
	| 'resolved';

export type PlayerOperationStatus =
	| 'pending'
	| 'reserved'
	| 'blocked'
	| 'cancelled';

export type ResourceCosts = Partial<Record<ResourceId, number>>;

export interface PlayerOperation {
	id: string;
	label: string;
	kind: 'resource-demand';
	/**
	 * Une valeur plus élevée signifie une priorité plus forte.
	 * La priorité vient explicitement du joueur/configurateur.
	 */
	priority: number;
	resourceCosts: ResourceCosts;
	status: PlayerOperationStatus;
}

export type ResourceConflictReason =
	| 'insufficient-resource'
	| 'competing-equal-priority'
	| 'blocked-by-higher-priority';

export interface ResourceConflict {
	id: string;
	resourceId: ResourceId;
	priority: number;
	available: number;
	requestedTotal: number;
	operationIds: string[];
	reason: ResourceConflictReason;
	requiresHumanArbitration: boolean;
	selectedOperationIds?: string[];
}

export interface TurnArbitrationDecision {
	conflictId: string;
	selectedOperationIds: string[];
}

export type TurnJournalEvent =
	| 'turn-created'
	| 'operation-added'
	| 'end-turn-requested'
	| 'turn-locked'
	| 'reservation-created'
	| 'operation-reserved'
	| 'resource-conflict'
	| 'operation-blocked'
	| 'arbitration-recorded';

export interface TurnJournalEntry {
	sequence: number;
	event: TurnJournalEvent;
	operationId?: string;
	resourceId?: ResourceId;
	message: string;
}

export interface TurnPlan {
	turn: number;
	phase: TurnPhase;
	operations: PlayerOperation[];
	conflicts: ResourceConflict[];
	arbitrations: TurnArbitrationDecision[];
	journal: TurnJournalEntry[];
}
