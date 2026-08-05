import type {
	WaveState
} from './wave.js';

export type PlayableWaveCyclePhase =
	| 'preparation'
	| 'ready'
	| 'complete';

export type PlayableWaveProfileId =
	| 'pressure-front'
	| 'charged-fracture'
	| 'dense-front';

export type PlayableWaveForecastStageId =
	| 'distant'
	| 'approaching'
	| 'near';

export interface PlayableWaveForecastFactors {
	pressure: number;
	structure: number;
	charge: number;
	capturableMatter: number;
}

export interface PlayableWaveOccurrenceState {
	waveNumber: number;
	profileId: PlayableWaveProfileId;
	label: string;
	scheduledTurn: number;
	actualWave: WaveState;

	/**
	 * Facteurs déterministes cachés utilisés pour produire
	 * les lectures successives d'une même vague.
	 */
	forecastFactors: PlayableWaveForecastFactors;
}

export interface PlayableWaveHistoryEntry {
	waveNumber: number;
	profileId: PlayableWaveProfileId;
	label: string;
	scheduledTurn: number;
	resolvedTurn: number;
	consequenceId: string;
	defenseResult:
		| 'contained'
		| 'residual';
	actualWave: WaveState;
	finalWave: WaveState;
	capturedMatter: number;
}

export interface PlayableWaveCycleState {
	schema:
		'avelune.proto0.playable-wave-cycle';
	schemaVersion: 1;

	baseSeed: number;
	plannedWaveCount: number;

	/**
	 * Dernier tour de jeu effectivement résolu.
	 *
	 * Le cycle interdit de sauter des tours ou de poursuivre
	 * lorsque la vague arrivée doit être traitée.
	 */
	lastAdvancedTurn: number;

	phase: PlayableWaveCyclePhase;

	current:
		| PlayableWaveOccurrenceState
		| null;

	history: PlayableWaveHistoryEntry[];
}

export interface PlayableVisibleWaveForecast {
	waveNumber: number;
	profileId: PlayableWaveProfileId;
	label: string;
	scheduledTurn: number;
	turnsUntilWave: number;

	stage: PlayableWaveForecastStageId;
	stageLabel: string;

	baseUncertaintyPercent: number;
	effectiveUncertaintyPercent: number;
	precisionMultiplier: number;

	estimatedWave: WaveState;
}
