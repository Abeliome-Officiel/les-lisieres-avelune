import type {
	WaveState
} from './wave.js';

export const TD_TOWER_FAMILIES = [
	'attenuation',
	'destructuration',
	'captation',
	'stabilisation'
] as const;

export type TdTowerFamily =
	typeof TD_TOWER_FAMILIES[number];

export const TD_TOWER_DEFINITION_IDS = [
	'attenuation-n1',
	'destructuration-n1',
	'captation-n1',
	'stabilisation-n1'
] as const;

export type TdTowerDefinitionId =
	typeof TD_TOWER_DEFINITION_IDS[number];

export type TdTowerLevel = 'n1';

export type TdPathPosition =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8;

export interface TdTowerState {
	id: string;
	definitionId: TdTowerDefinitionId;
	family: TdTowerFamily;
	level: TdTowerLevel;
	label: string;
}

export interface TdPathPositionState {
	position: TdPathPosition;
	tower: TdTowerState | null;
}

export interface TdState {
	positions: TdPathPositionState[];
}

export interface TdWaveDelta {
	pressure: number;
	structure: number;
	charge: number;
	capturableMatter: number;
	capturedMatter: number;
}

export interface TdResolutionStep {
	position: TdPathPosition;
	tower: TdTowerState | null;
	before: WaveState;
	effect: TdWaveDelta;
	after: WaveState;
}

export interface TdResolutionResult {
	initialWave: WaveState;
	finalWave: WaveState;
	capturedMatter: number;
	steps: TdResolutionStep[];
}
