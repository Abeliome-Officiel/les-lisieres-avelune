import type { CorciteId, RunId, Seed, TesterCode } from './ids.js';
import type { WaveConfiguration, WaveState } from './wave.js';

export type CorciteController =
	| 'human'
	| 'simulated-tf'
	| 'simulated-td'
	| 'simulated-rpg'
	| 'simulated-limits';

export interface CorciteDescriptor {
	id: CorciteId;
	name: string;
	controller: CorciteController;
}

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
	corcites: CorciteDescriptor[];
	actualWave: WaveState;
}
