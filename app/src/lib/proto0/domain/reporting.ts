import type {
	WaveConsequenceState,
	WaveKnowledgeProduced,
	WaveRelevantConsumption
} from './consequence.js';
import type {
	ModifierState
} from './corcite.js';
import type {
	ResourceReservation
} from './resources.js';
import type {
	RpgJournalEntry
} from './rpg.js';
import type {
	TdResolutionResult,
	TdResolutionStep
} from './td.js';
import type {
	TfExtractionResolution,
	TfProcessingResolution
} from './tf.js';
import type {
	TurnPlan
} from './turn.js';
import type {
	WaveForecasts,
	WaveState
} from './wave.js';

export type TechnicalLogPhase =
	| 'session'
	| 'turn'
	| 'tf'
	| 'rpg'
	| 'td'
	| 'consequence'
	| 'error';

export interface TechnicalLogIssue {
	kind:
		| 'error'
		| 'impossible-decision';
	message: string;
}

export interface TechnicalLogEntry {
	sequence: number;
	runId: string;
	version: string;
	seed: number;
	turn: number;
	phase: TechnicalLogPhase;
	actor: string;
	action: string;
	inputs: unknown;
	outputs: unknown;
	details: unknown;
}

export interface TfReportingSnapshot {
	extraction: TfExtractionResolution;
	transformation: TfProcessingResolution;
	fabrication: TfProcessingResolution;
}

export interface TechnicalLogSourceSnapshot {
	waveForecasts: WaveForecasts;
	actualWave: WaveState;
	turnPlan: TurnPlan | null;
	reservations: ResourceReservation[];
	modifiers: ModifierState[];
	tf: TfReportingSnapshot | null;
	rpgJournal: RpgJournalEntry[];
	tdResolution: TdResolutionResult;
	consequence: WaveConsequenceState;
	issues: TechnicalLogIssue[];
}

export interface Proto0TechnicalLog {
	schema:
		'avelune.proto0.technical-log';
	schemaVersion: 1;
	runId: string;
	version: string;
	seed: number;
	turn: number;
	corciteId: string;
	source:
		TechnicalLogSourceSnapshot;
	entries:
		TechnicalLogEntry[];
}

export interface WaveBeforeAfter {
	before: number;
	after: number;
}

export interface PlayerWaveVariableSummary {
	pressure: WaveBeforeAfter;
	structure: WaveBeforeAfter;
	charge: WaveBeforeAfter;
	capturableMatter:
		WaveBeforeAfter;
}

export interface PlayerWaveReportSummary {
	title: string;
	message: string;
	defenseResult:
		WaveConsequenceState['defenseResult'];
	capturedMatter: number;
}

export interface PlayerWaveReportDetails {
	forecasts: WaveForecasts;
	forecastWave: WaveState;
	actualWave: WaveState;
	initialWave: WaveState;
	finalWave: WaveState;
	variables:
		PlayerWaveVariableSummary;
	towerEffects:
		TdResolutionStep[];
	capturedMatter: number;
	consumptions:
		WaveRelevantConsumption[];
	consequence:
		WaveConsequenceState;
	knowledgeProduced:
		WaveKnowledgeProduced[];
}

export interface PlayerWaveReport {
	schema:
		'avelune.proto0.player-wave-report';
	schemaVersion: 1;
	runId: string;
	turn: number;
	corciteId: string;
	summary:
		PlayerWaveReportSummary;
	details:
		PlayerWaveReportDetails;
}

export interface WaveReportingBundle {
	playerReport:
		PlayerWaveReport;
	technicalLog:
		Proto0TechnicalLog;
}
