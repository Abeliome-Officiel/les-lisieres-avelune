import type {
        PlayableCaptureRecoveryState
} from '../domain/playable-capture.js';
import {
        applyPlayableCaptureEconomy
} from '../td/playable-capture.js';
import {
	PLAYABLE_WAVE_CYCLE_REFERENCE,
	type PlayableWaveForecastStageDefinition,
	type PlayableWaveProfileDefinition
} from '../config/playable-wave-cycle-reference.js';

import type {
        CorciteState,
        PlayableCorciteState,
        PlayableWaveImpactState
} from '../domain/corcite.js';

import type {
	WaveRelevantConsumption
} from '../domain/consequence.js';

import type {
	PlayableVisibleWaveForecast,
	PlayableWaveCycleState,
	PlayableWaveForecastFactors,
	PlayableWaveHistoryEntry,
	PlayableWaveOccurrenceState
} from '../domain/playable-wave.js';

import type {
	TdResolutionResult
} from '../domain/td.js';

import type {
	WaveState
} from '../domain/wave.js';

import {
	applyWaveConsequences
} from '../consequences.js';

import {
        applyPlayableWaveImpact
} from '../corcite/recovery.js';

import {
	SeededRng
} from '../random/seeded-rng.js';

import {
	resolveTdPath
} from '../td/resolution.js';

const WAVE_STATE_KEYS = [
	'pressure',
	'structure',
	'charge',
	'capturableMatter'
] as const satisfies readonly (
	keyof WaveState
)[];

export interface CreatePlayableWaveCycleInput {
	seed: number;
}

export interface ResolvePlayableWaveInput {
	runId: string;
	turn: number;
	consumptions?: WaveRelevantConsumption[];
}

export interface ResolvePlayableWaveResult {
	corcite: PlayableCorciteState;
	cycle: PlayableWaveCycleState;
	resolution: TdResolutionResult;
	historyEntry: PlayableWaveHistoryEntry;
	recoveryImpact:
	        PlayableWaveImpactState;
        captureEconomy:
                PlayableCaptureRecoveryState;
}

function round(
	value: number,
	decimals = 6
): number {
	const factor =
		10 ** decimals;

	return (
		Math.round(
			value * factor
		) / factor
	);
}

function validateSeed(
	seed: number
): void {
	if (
		!Number.isInteger(seed) ||
		seed < 0 ||
		seed > 4294967295
	) {
		throw new Error(
			`Graine de cycle invalide : ${seed}.`
		);
	}
}

function waveSeed(
	baseSeed: number,
	waveNumber: number
): number {
	/*
	 * Dérivation déterministe indépendante du runId.
	 *
	 * Chaque numéro de vague reçoit ainsi son propre flux pseudo-aléatoire
	 * tout en restant parfaitement reproductible à partir de la seed.
	 */
	return (
		(
			(baseSeed >>> 0) +
			Math.imul(
				waveNumber,
				0x9e3779b1
			)
		) >>> 0
	);
}

function profileForWave(
	waveNumber: number
): PlayableWaveProfileDefinition {
	const profiles =
		PLAYABLE_WAVE_CYCLE_REFERENCE
			.profiles;

	const profile =
		profiles[
			(waveNumber - 1) %
				profiles.length
		];

	if (!profile) {
		throw new Error(
			`Profil de vague introuvable pour la vague ${waveNumber}.`
		);
	}

	return profile;
}

function varyWaveValue(
	value: number,
	variationPercent: number,
	rng: SeededRng
): number {
	const variation =
		rng.between(
			-variationPercent,
			variationPercent
		);

	return round(
		value *
			(
				1 +
				variation / 100
			)
	);
}

function createActualWave(
	profile: PlayableWaveProfileDefinition,
	rng: SeededRng
): WaveState {
	return {
		pressure:
			varyWaveValue(
				profile.nominal.pressure,
				profile.variationPercent,
				rng
			),

		structure:
			varyWaveValue(
				profile.nominal.structure,
				profile.variationPercent,
				rng
			),

		charge:
			varyWaveValue(
				profile.nominal.charge,
				profile.variationPercent,
				rng
			),

		capturableMatter:
			varyWaveValue(
				profile.nominal
					.capturableMatter,
				profile.variationPercent,
				rng
			)
	};
}

function createForecastFactors(
	rng: SeededRng
): PlayableWaveForecastFactors {
	return {
		pressure:
			rng.between(-1, 1),

		structure:
			rng.between(-1, 1),

		charge:
			rng.between(-1, 1),

		capturableMatter:
			rng.between(-1, 1)
	};
}

function createOccurrence(
	baseSeed: number,
	waveNumber: number,
	scheduledTurn: number
): PlayableWaveOccurrenceState {
	const profile =
		profileForWave(
			waveNumber
		);

	const rng =
		new SeededRng(
			waveSeed(
				baseSeed,
				waveNumber
			)
		);

	return {
		waveNumber,
		profileId:
			profile.id,
		label:
			profile.label,
		scheduledTurn,
		actualWave:
			createActualWave(
				profile,
				rng
			),
		forecastFactors:
			createForecastFactors(
				rng
			)
	};
}

function validateWaveState(
	wave: WaveState,
	context: string
): string[] {
	const errors: string[] = [];

	for (
		const key of
		WAVE_STATE_KEYS
	) {
		const value =
			wave[key];

		if (
			!Number.isFinite(
				value
			) ||
			value < 0
		) {
			errors.push(
				`${context} : ${key} invalide`
			);
		}
	}

	return errors;
}

function validateForecastFactors(
	factors:
		PlayableWaveForecastFactors,
	context: string
): string[] {
	const errors: string[] = [];

	for (
		const key of
		WAVE_STATE_KEYS
	) {
		const value =
			factors[key];

		if (
			!Number.isFinite(
				value
			) ||
			value < -1 ||
			value > 1
		) {
			errors.push(
				`${context} : facteur ${key} invalide`
			);
		}
	}

	return errors;
}

function knownProfile(
	profileId: string
): boolean {
	return (
		PLAYABLE_WAVE_CYCLE_REFERENCE
			.profiles
			.some(
				(profile) =>
					profile.id ===
					profileId
			)
	);
}

export interface PlayableWaveCycleValidationResult {
	valid: boolean;
	errors: string[];
}

export function validatePlayableWaveCycle(
	state: PlayableWaveCycleState
): PlayableWaveCycleValidationResult {
	const errors: string[] = [];

	if (
		state.schema !==
		'avelune.proto0.playable-wave-cycle'
	) {
		errors.push(
			'Schéma de cycle jouable invalide'
		);
	}

	if (
		state.schemaVersion !== 1
	) {
		errors.push(
			'Version de schéma de cycle jouable invalide'
		);
	}

	if (
		!Number.isInteger(
			state.baseSeed
		) ||
		state.baseSeed < 0 ||
		state.baseSeed >
			4294967295
	) {
		errors.push(
			'Graine de cycle invalide'
		);
	}

	if (
		!Number.isInteger(
			state.plannedWaveCount
		) ||
		state.plannedWaveCount < 1
	) {
		errors.push(
			'Nombre de vagues prévu invalide'
		);
	}

	if (
		!Number.isInteger(
			state.lastAdvancedTurn
		) ||
		state.lastAdvancedTurn < 0
	) {
		errors.push(
			'Dernier tour avancé invalide'
		);
	}

	if (
		![
			'preparation',
			'ready',
			'complete'
		].includes(
			state.phase
		)
	) {
		errors.push(
			'Phase de cycle invalide'
		);
	}

	if (
		state.history.length >
		state.plannedWaveCount
	) {
		errors.push(
			'Historique plus long que le nombre de vagues prévu'
		);
	}

	const consequenceIds =
		new Set<string>();

	for (
		let index = 0;
		index <
			state.history.length;
		index += 1
	) {
		const entry =
			state.history[index];

		if (
			entry.waveNumber !==
			index + 1
		) {
			errors.push(
				`Historique : numéro de vague ${entry.waveNumber} inattendu à la position ${index + 1}`
			);
		}

		if (
			!knownProfile(
				entry.profileId
			)
		) {
			errors.push(
				`Historique vague ${entry.waveNumber} : profil inconnu`
			);
		}

		if (
			!entry.label.trim()
		) {
			errors.push(
				`Historique vague ${entry.waveNumber} : libellé vide`
			);
		}

		if (
			!Number.isInteger(
				entry.scheduledTurn
			) ||
			entry.scheduledTurn < 1 ||
			!Number.isInteger(
				entry.resolvedTurn
			) ||
			entry.resolvedTurn <
				entry.scheduledTurn
		) {
			errors.push(
				`Historique vague ${entry.waveNumber} : tours invalides`
			);
		}

		if (
			!entry.consequenceId.trim()
		) {
			errors.push(
				`Historique vague ${entry.waveNumber} : conséquence sans identifiant`
			);
		}

		if (
			consequenceIds.has(
				entry.consequenceId
			)
		) {
			errors.push(
				`Historique : conséquence dupliquée ${entry.consequenceId}`
			);
		}

		consequenceIds.add(
			entry.consequenceId
		);

		errors.push(
			...validateWaveState(
				entry.actualWave,
				`Historique vague ${entry.waveNumber}`
			)
		);

		errors.push(
			...validateWaveState(
				entry.finalWave,
				`Historique vague ${entry.waveNumber} final`
			)
		);

		if (
			!Number.isFinite(
				entry.capturedMatter
			) ||
			entry.capturedMatter < 0
		) {
			errors.push(
				`Historique vague ${entry.waveNumber} : matière captée invalide`
			);
		}
	}

	if (
		state.phase ===
		'complete'
	) {
		if (
			state.current !== null
		) {
			errors.push(
				'Un cycle terminé ne doit plus posséder de vague courante'
			);
		}

		if (
			state.history.length !==
			state.plannedWaveCount
		) {
			errors.push(
				'Un cycle terminé doit avoir résolu toutes ses vagues'
			);
		}
	} else {
		if (!state.current) {
			errors.push(
				'Un cycle actif doit posséder une vague courante'
			);
		}
	}

	if (state.current) {
		const current =
			state.current;

		if (
			current.waveNumber !==
			state.history.length +
				1
		) {
			errors.push(
				'Le numéro de la vague courante ne suit pas l’historique'
			);
		}

		if (
			current.waveNumber >
			state.plannedWaveCount
		) {
			errors.push(
				'La vague courante dépasse le nombre de vagues prévu'
			);
		}

		if (
			!knownProfile(
				current.profileId
			)
		) {
			errors.push(
				'Profil de vague courante inconnu'
			);
		}

		if (
			!current.label.trim()
		) {
			errors.push(
				'Libellé de vague courante vide'
			);
		}

		if (
			!Number.isInteger(
				current.scheduledTurn
			) ||
			current.scheduledTurn <
				1
		) {
			errors.push(
				'Tour prévu de vague invalide'
			);
		}

		errors.push(
			...validateWaveState(
				current.actualWave,
				'Vague courante'
			)
		);

		errors.push(
			...validateForecastFactors(
				current.forecastFactors,
				'Vague courante'
			)
		);

		if (
			state.phase ===
				'preparation' &&
			state.lastAdvancedTurn >=
				current.scheduledTurn
		) {
			errors.push(
				'Une vague arrivée ne peut pas rester en phase de préparation'
			);
		}

		if (
			state.phase ===
				'ready' &&
			state.lastAdvancedTurn !==
				current.scheduledTurn
		) {
			errors.push(
				'Une vague prête doit correspondre exactement au tour arrivé'
			);
		}
	}

	return {
		valid:
			errors.length === 0,
		errors
	};
}

function assertValidCycle(
	state: PlayableWaveCycleState,
	context: string
): void {
	const validation =
		validatePlayableWaveCycle(
			state
		);

	if (!validation.valid) {
		throw new Error(
			`${context} : ${validation.errors.join(' | ')}`
		);
	}
}

export function createPlayableWaveCycle(
	input: CreatePlayableWaveCycleInput
): PlayableWaveCycleState {
	validateSeed(
		input.seed
	);

	const state:
		PlayableWaveCycleState = {
		schema:
			'avelune.proto0.playable-wave-cycle',
		schemaVersion: 1,
		baseSeed:
			input.seed,
		plannedWaveCount:
			PLAYABLE_WAVE_CYCLE_REFERENCE
				.plannedWaveCount,
		lastAdvancedTurn: 0,
		phase:
			'preparation',
		current:
			createOccurrence(
				input.seed,
				1,
				PLAYABLE_WAVE_CYCLE_REFERENCE
					.firstWaveTurn
			),
		history: []
	};

	assertValidCycle(
		state,
		'Cycle initial invalide'
	);

	return state;
}

function precisionMultiplier(
	corcite: CorciteState
): number {
	let additive = 0;
	let multiplicative = 1;

	for (
		const modifier of
		corcite.modifiers
	) {
		if (
			!modifier.active ||
			modifier.target !==
				'wave.forecast.precision'
		) {
			continue;
		}

		if (
			modifier.operation ===
			'add'
		) {
			additive +=
				modifier.value;
		} else {
			multiplicative *=
				modifier.value;
		}
	}

	return Math.max(
		0.01,
		(1 + additive) *
			multiplicative
	);
}

function forecastStage(
	turnsUntilWave: number
): PlayableWaveForecastStageDefinition {
	const stages =
		[
			...PLAYABLE_WAVE_CYCLE_REFERENCE
				.forecastStages
		].sort(
			(a, b) =>
				b.minimumTurnsBeforeArrival -
				a.minimumTurnsBeforeArrival
		);

	const stage =
		stages.find(
			(candidate) =>
				turnsUntilWave >=
				candidate
					.minimumTurnsBeforeArrival
		) ??
		stages.at(-1);

	if (!stage) {
		throw new Error(
			'Aucun palier de prévision jouable configuré.'
		);
	}

	return stage;
}

function forecastWave(
	actualWave: WaveState,
	factors:
		PlayableWaveForecastFactors,
	uncertaintyPercent: number
): WaveState {
	return {
		pressure:
			round(
				actualWave.pressure *
					(
						1 +
						factors.pressure *
							uncertaintyPercent /
							100
					)
			),

		structure:
			round(
				actualWave.structure *
					(
						1 +
						factors.structure *
							uncertaintyPercent /
							100
					)
			),

		charge:
			round(
				actualWave.charge *
					(
						1 +
						factors.charge *
							uncertaintyPercent /
							100
					)
			),

		capturableMatter:
			round(
				actualWave.capturableMatter *
					(
						1 +
						factors
							.capturableMatter *
							uncertaintyPercent /
							100
					)
			)
	};
}

export function getPlayableWaveForecast(
	cycle: PlayableWaveCycleState,
	currentTurn: number,
	corcite: CorciteState
): PlayableVisibleWaveForecast | null {
	assertValidCycle(
		cycle,
		'Cycle invalide avant lecture de vague'
	);

	if (
		!Number.isInteger(
			currentTurn
		) ||
		currentTurn < 1
	) {
		throw new Error(
			`Tour de lecture invalide : ${currentTurn}.`
		);
	}

	if (
		cycle.phase ===
			'complete' ||
		!cycle.current
	) {
		return null;
	}

	const turnsUntilWave =
		Math.max(
			0,
			cycle.current
				.scheduledTurn -
				currentTurn
		);

	if (
		turnsUntilWave >
		PLAYABLE_WAVE_CYCLE_REFERENCE
			.forecastHorizonTurns
	) {
		return null;
	}

	const stage =
		forecastStage(
			turnsUntilWave
		);

	const multiplier =
		precisionMultiplier(
			corcite
		);

	/*
	 * Une meilleure précision réduit l'incertitude.
	 *
	 * Le modificateur de recherche à 1.15 signifie donc
	 * "15 % de précision supplémentaire", et non 15 %
	 * d'incertitude supplémentaire.
	 */
	const effectiveUncertaintyPercent =
		round(
			stage.uncertaintyPercent /
				multiplier
		);

	return {
		waveNumber:
			cycle.current
				.waveNumber,
		profileId:
			cycle.current
				.profileId,
		label:
			cycle.current.label,
		scheduledTurn:
			cycle.current
				.scheduledTurn,
		turnsUntilWave,
		stage:
			stage.id,
		stageLabel:
			stage.label,
		baseUncertaintyPercent:
			stage
				.uncertaintyPercent,
		effectiveUncertaintyPercent,
		precisionMultiplier:
			round(
				multiplier
			),
		estimatedWave:
			forecastWave(
				cycle.current
					.actualWave,
				cycle.current
					.forecastFactors,
				effectiveUncertaintyPercent
			)
	};
}

export function advancePlayableWaveCycleAfterTurn(
	inputState: PlayableWaveCycleState,
	resolvedTurn: number
): PlayableWaveCycleState {
	assertValidCycle(
		inputState,
		'Cycle invalide avant avancement'
	);

	if (
		inputState.phase ===
		'complete'
	) {
		throw new Error(
			'Le cycle de vagues est terminé.'
		);
	}

	if (
		inputState.phase ===
		'ready'
	) {
		throw new Error(
			'La vague arrivée doit être résolue avant de poursuivre le temps.'
		);
	}

	if (
		!Number.isInteger(
			resolvedTurn
		) ||
		resolvedTurn !==
			inputState.lastAdvancedTurn +
				1
	) {
		throw new Error(
			`Avancement de cycle invalide : le tour attendu est ${inputState.lastAdvancedTurn + 1}, reçu ${resolvedTurn}.`
		);
	}

	if (!inputState.current) {
		throw new Error(
			'Cycle actif sans vague courante.'
		);
	}

	if (
		resolvedTurn >
		inputState.current
			.scheduledTurn
	) {
		throw new Error(
			`La vague ${inputState.current.waveNumber} aurait dû être résolue au tour ${inputState.current.scheduledTurn}.`
		);
	}

	const state =
		structuredClone(
			inputState
		);

	state.lastAdvancedTurn =
		resolvedTurn;

	if (
		resolvedTurn ===
		state.current
			?.scheduledTurn
	) {
		state.phase =
			'ready';
	}

	assertValidCycle(
		state,
		'Cycle invalide après avancement'
	);

	return state;
}

export function resolvePlayableWave(
	inputCorcite: CorciteState,
	inputCycle: PlayableWaveCycleState,
	input: ResolvePlayableWaveInput
): ResolvePlayableWaveResult {
	assertValidCycle(
		inputCycle,
		'Cycle invalide avant résolution de vague'
	);

	if (
		inputCycle.phase !==
		'ready' ||
		!inputCycle.current
	) {
		throw new Error(
			'Aucune vague n’est actuellement prête à être résolue.'
		);
	}

	if (
		!input.runId.trim()
	) {
		throw new Error(
			'La résolution jouable exige un identifiant de partie.'
		);
	}

	if (
		input.turn !==
		inputCycle.current
			.scheduledTurn ||
		input.turn !==
		inputCycle.lastAdvancedTurn
	) {
		throw new Error(
			`La vague ${inputCycle.current.waveNumber} doit être résolue au tour ${inputCycle.current.scheduledTurn}.`
		);
	}

	const occurrence =
		inputCycle.current;

	const resolution =
		resolveTdPath(
			inputCorcite.td,
			occurrence.actualWave
		);

	/*
	 * applyWaveConsequences identifie historiquement une vague par runId.
	 *
	 * En multi-vagues, chaque passage reçoit donc un identifiant
	 * stable et unique à l'intérieur de la partie.
	 */
	const waveRunId =
		`${input.runId}:wave:${occurrence.waveNumber}`;

	const consequences =
		applyWaveConsequences(
			inputCorcite,
			{
				runId:
					waveRunId,
				turn:
					input.turn,
				resolution,
				consumptions:
					input.consumptions
			}
		);

	const recovery =
	        applyPlayableWaveImpact(
	                consequences.corcite,
	                consequences.consequence.id
	        );

	const captureEconomy =
	        applyPlayableCaptureEconomy(
	                recovery.corcite,
	                consequences.consequence.id
	        );

	const historyEntry:
		PlayableWaveHistoryEntry = {
		waveNumber:
			occurrence.waveNumber,
		profileId:
			occurrence.profileId,
		label:
			occurrence.label,
		scheduledTurn:
			occurrence.scheduledTurn,
		resolvedTurn:
			input.turn,
		consequenceId:
			consequences
				.consequence.id,
		defenseResult:
			consequences
				.consequence
				.defenseResult,
		actualWave:
			structuredClone(
				occurrence.actualWave
			),
		finalWave:
			structuredClone(
				consequences
					.consequence
					.finalWave
			),
		capturedMatter:
			consequences
				.consequence
				.capturedMatter
	};

	const cycle =
		structuredClone(
			inputCycle
		);

	cycle.history.push(
		structuredClone(
			historyEntry
		)
	);

	if (
		occurrence.waveNumber >=
		cycle.plannedWaveCount
	) {
		cycle.phase =
			'complete';

		cycle.current =
			null;
	} else {
		const nextWaveNumber =
			occurrence.waveNumber +
				1;

		const nextScheduledTurn =
			input.turn +
			PLAYABLE_WAVE_CYCLE_REFERENCE
				.turnsBetweenWaves;

		cycle.phase =
			'preparation';

		cycle.current =
			createOccurrence(
				cycle.baseSeed,
				nextWaveNumber,
				nextScheduledTurn
			);
	}

	assertValidCycle(
		cycle,
		'Cycle invalide après résolution de vague'
	);

	return {
		corcite:
		        captureEconomy.corcite,
		cycle,
		resolution,
		recoveryImpact:
		        structuredClone(
		                recovery.impact
		        ),
		captureEconomy:
		        structuredClone(
		                captureEconomy.recovery
		        ),
		historyEntry:
			structuredClone(
				historyEntry
			)
	};
}

export function serializePlayableWaveCycle(
	state: PlayableWaveCycleState
): string {
	assertValidCycle(
		state,
		'Cycle impossible à sérialiser'
	);

	return JSON.stringify(
		state,
		null,
		2
	);
}

export function deserializePlayableWaveCycle(
	serialized: string
): PlayableWaveCycleState {
	let parsed: unknown;

	try {
		parsed =
			JSON.parse(
				serialized
			) as unknown;
	} catch {
		throw new Error(
			'Cycle de vagues : JSON invalide.'
		);
	}

	if (
		typeof parsed !==
			'object' ||
		parsed === null ||
		Array.isArray(parsed)
	) {
		throw new Error(
			'Cycle de vagues : structure JSON incompatible.'
		);
	}

	const candidate =
		parsed as
			PlayableWaveCycleState;

	const validation =
		validatePlayableWaveCycle(
			candidate
		);

	if (!validation.valid) {
		throw new Error(
			`Cycle de vagues invalide : ${validation.errors.join(' | ')}`
		);
	}

	return structuredClone(
		candidate
	);
}
