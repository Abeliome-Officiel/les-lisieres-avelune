import type {
	ResourceId
} from './resources.js';
import type {
	WaveState
} from './wave.js';

export type WaveDefenseResult =
	| 'contained'
	| 'residual';

export interface WaveRelevantConsumption {
	resourceId: ResourceId;
	amount: number;
	source: string;
}

export interface WaveKnowledgeProduced {
	id: string;
	key: string;
	source: string;
	value: number;
}

export interface WaveConsequenceState {
	id: string;
	runId: string;
	turn: number;
	defenseResult: WaveDefenseResult;
	initialWave: WaveState;
	finalWave: WaveState;
	capturedMatter: number;
	consumptions: WaveRelevantConsumption[];
	knowledgeProduced: WaveKnowledgeProduced[];
}

export interface WaveConsequenceSnapshot {
	corciteId: string;
	consequenceId: string;
	defenseResult: WaveDefenseResult;
	finalWave: WaveState;
	capturedMatter: number;
	consumptions: WaveRelevantConsumption[];
	knowledgeProduced: WaveKnowledgeProduced[];
}
