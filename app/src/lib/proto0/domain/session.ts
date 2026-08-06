import type { CorciteState } from './corcite.js';
import type { RunId, Seed, TesterCode } from './ids.js';
import type {
	WaveConfiguration,
	WaveForecasts,
	WaveState
} from './wave.js';

export interface Proto0SessionConfiguration {
	schema: 'avelune.proto0.session';
	schemaVersion: 1;
	testerCode: TesterCode;
	seed: Seed;
	turns: number;
	waves: 1;
	internalPathPositions: 8;
	humanControlledCorcites: 1;
	simulatedCorcites: 4;
	wave: WaveConfiguration;
}

export interface Proto0InitialState {
	runId: RunId;
	configuration: Proto0SessionConfiguration;
	currentTurn: 1;
	corcites: CorciteState[];
	waveForecasts: WaveForecasts;
	actualWave: WaveState;
}
