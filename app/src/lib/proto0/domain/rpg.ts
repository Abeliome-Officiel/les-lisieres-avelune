export type RpgResearchStatus =
	| 'active'
	/*
	 * Statut historique P4 : l'ancien moteur applique
	 * immédiatement les effets à l'achèvement.
	 */
	| 'completed'
	/*
	 * Prototype jouable : recherche terminée mais découverte
	 * encore non validée par le joueur.
	 */
	| 'discovery-pending'
	| 'validated';

export interface RpgResearchState {
	id: string;
	definitionId: string;
	label: string;
	status: RpgResearchStatus;
	progressTurns: number;
	durationTurns: number;
	startedTurn: number;
	lastProgressTurn: number | null;
	completedTurn: number | null;

	/**
	 * Absent des anciens états P4.
	 *
	 * Dans le prototype jouable, il est renseigné uniquement
	 * après validation explicite de la découverte.
	 */
	validatedTurn?: number | null;
}

export interface RpgAccessState {
	id: string;
	source: string;
	key: string;
	active: boolean;
}

export interface RpgKnowledgeState {
	id: string;
	source: string;
	key: string;
	value: number;
}

export type RpgJournalEvent =
	| 'research-started'
	| 'research-progressed'
	| 'research-completed'
	| 'discovery-pending'
	| 'discovery-validated'
	| 'modifier-applied'
	| 'access-unlocked'
	| 'knowledge-updated';

export interface RpgJournalEntry {
	sequence: number;
	event: RpgJournalEvent;
	source: string;
	message: string;
}

export interface RpgState {
	researches: RpgResearchState[];
	accesses: RpgAccessState[];
	knowledge: RpgKnowledgeState[];
	journal: RpgJournalEntry[];
}
