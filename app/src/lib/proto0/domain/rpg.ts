export type RpgResearchStatus =
	| 'active'
	| 'completed';

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
