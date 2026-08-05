import {
	REFERENCE_SESSION_CONFIGURATION
} from './config/reference.js';
import {
	TD_PREPARATION_LAB_REFERENCE
} from './config/td-preparation-reference.js';
import type {
	CorciteState
} from './domain/corcite.js';
import type {
	WaveRelevantConsumption
} from './domain/consequence.js';
import type {
	PlayerWaveReport,
	Proto0TechnicalLog,
	TfReportingSnapshot
} from './domain/reporting.js';
import type {
	Proto0InitialState
} from './domain/session.js';
import type {
	TdPathPosition,
	TdTowerDefinitionId
} from './domain/td.js';
import type {
	TurnPlan
} from './domain/turn.js';
import type {
	WaveForecastState
} from './domain/wave.js';
import type {
	TesterCode
} from './domain/ids.js';
import {
	applyWaveConsequences
} from './consequences.js';
import {
	createWaveReporting
} from './reporting.js';
import {
	advanceActiveRpgResearch,
	startRpgResearch
} from './rpg/research.js';
import {
	createInitialState
} from './session.js';
import {
	resolveTdPath
} from './td/resolution.js';
import {
	createTdTower,
	placeTdTower
} from './td/state.js';
import {
	createReferenceTdPreparationOperation
} from './td/preparation.js';
import {
	resolveTfCoreTurn
} from './tf/turn.js';
import {
	addPlayerOperation,
	createTurnPlan
} from './turn/plan.js';
import {
	endTurn
} from './turn/end-turn.js';
import {
	commitOperationReservations
} from './turn/commit.js';

export const PROTO0_BROWSER_VERSION =
	'0.9.0-dev.1';

export interface CreateBrowserSessionInput {
	testerCode: TesterCode;
	seed: number;
	runId?: string;
}

export interface BrowserVisibleForecast {
	label: 'T−3' | 'T−2' | 'T−1';
	forecast: WaveForecastState;
}

export interface Proto0BrowserState {
	session: Proto0InitialState;
	currentTurn: number;
	corcite: CorciteState;
	lastResolvedTurn:
		number | null;
	lastTf:
		TfReportingSnapshot | null;
	lastTurnPlan:
		TurnPlan | null;
	waveConsumptions:
		WaveRelevantConsumption[];
	waveReady: boolean;
	waveResolved: boolean;
	playerReport:
		PlayerWaveReport | null;
	technicalLog:
		Proto0TechnicalLog | null;
	statusMessage: string;
}

function humanCorcite(
	session: Proto0InitialState
): CorciteState {
	const corcite =
		session.corcites.find(
			(candidate) =>
				candidate.controller ===
					'human'
		);

	if (!corcite) {
		throw new Error(
			'Session PROTO-0 sans Corcite humain.'
		);
	}

	return structuredClone(
		corcite
	);
}

export function createBrowserSession(
	input: CreateBrowserSessionInput
): Proto0BrowserState {
	const configuration =
		structuredClone(
			REFERENCE_SESSION_CONFIGURATION
		);

	configuration.testerCode =
		input.testerCode;

	configuration.seed =
		input.seed;

	const session =
		createInitialState(
			configuration,
			{
				runId:
					input.runId
			}
		);

	return {
		session,
		currentTurn: 1,
		corcite:
			humanCorcite(
				session
			),
		lastResolvedTurn:
			null,
		lastTf: null,
		lastTurnPlan: null,
		waveConsumptions: [],
		waveReady: false,
		waveResolved: false,
		playerReport: null,
		technicalLog: null,
		statusMessage:
			`Session ${session.runId} créée.`
	};
}

export function getBrowserVisibleForecast(
	state: Proto0BrowserState
): BrowserVisibleForecast | null {
	const turns =
		state.session.configuration
			.turns;

	if (
		state.currentTurn <
		turns - 2
	) {
		return null;
	}

	if (
		state.currentTurn ===
		turns - 2
	) {
		return {
			label: 'T−3',
			forecast:
				structuredClone(
					state.session
						.waveForecasts
						.tMinus3
				)
		};
	}

	if (
		state.currentTurn ===
		turns - 1
	) {
		return {
			label: 'T−2',
			forecast:
				structuredClone(
					state.session
						.waveForecasts
						.tMinus2
				)
		};
	}

	return {
		label: 'T−1',
		forecast:
			structuredClone(
				state.session
					.waveForecasts
					.tMinus1
			)
	};
}

export function startBrowserResearch(
	inputState:
		Proto0BrowserState
): Proto0BrowserState {
	if (
		inputState.waveResolved
	) {
		throw new Error(
			'La vague est déjà résolue.'
		);
	}

	const state =
		structuredClone(
			inputState
		);

	state.corcite =
		startRpgResearch(
			state.corcite,
			state.currentTurn
		);

	state.statusMessage =
		'Recherche RPG démarrée.';

	return state;
}

function aggregatePreparationConsumptions(
	input:
		ReturnType<
			typeof commitOperationReservations
		>['consumptions']
): WaveRelevantConsumption[] {
	const totals =
		new Map<
			string,
			WaveRelevantConsumption
		>();

	for (
		const movement of
		input
	) {
		const key =
			movement.resourceId;

		const current =
			totals.get(key);

		if (current) {
			current.amount +=
				movement.amount;
			continue;
		}

		totals.set(key, {
			resourceId:
				movement.resourceId,
			amount:
				movement.amount,
			source:
				`td-preparation:${TD_PREPARATION_LAB_REFERENCE.id}`
		});
	}

	return [
		...totals.values()
	];
}

export function prepareBrowserTower(
	inputState:
		Proto0BrowserState,
	position: TdPathPosition,
	definitionId:
		TdTowerDefinitionId
): Proto0BrowserState {
	if (
		inputState.waveResolved
	) {
		throw new Error(
			'La vague est déjà résolue.'
		);
	}

	const state =
		structuredClone(
			inputState
		);

	let corcite =
		state.corcite;

	if (
		definitionId ===
		'attenuation-n1'
	) {
		const operationId =
			[
				'ui-prepare',
				String(
					state.currentTurn
				),
				String(position),
				definitionId
			].join(':');

		let plan =
			createTurnPlan(
				state.currentTurn
			);

		plan =
			addPlayerOperation(
				plan,
				createReferenceTdPreparationOperation({
					operationId,
					priority: 0
				})
			);

		const prepared =
			endTurn(
				corcite,
				plan
			);

		state.lastTurnPlan =
			prepared.plan;

		const operation =
			prepared.plan
				.operations.find(
					(candidate) =>
						candidate.id ===
							operationId
				);

		if (
			operation?.status !==
			'reserved'
		) {
			state.statusMessage =
				'Préparation Atténuation bloquée : ressources insuffisantes.';

			return state;
		}

		const committed =
			commitOperationReservations(
				prepared.corcite,
				operationId
			);

		corcite =
			committed.corcite;

		state.waveConsumptions.push(
			...aggregatePreparationConsumptions(
				committed
					.consumptions
			)
		);
	}

	corcite.td =
		placeTdTower(
			corcite.td,
			{
				position,
				tower:
					createTdTower({
						id:
							[
								state.session
									.runId,
								'td',
								String(
									position
								),
								definitionId
							].join(':'),
						definitionId
					})
			}
		);

	state.corcite =
		corcite;

	state.statusMessage =
		`Tour ${definitionId} préparée en position ${position}.`;

	return state;
}

export function resolveBrowserTurn(
	inputState:
		Proto0BrowserState
): Proto0BrowserState {
	if (
		inputState.waveResolved
	) {
		throw new Error(
			'La vague est déjà résolue.'
		);
	}

	if (
		inputState.waveReady
	) {
		throw new Error(
			'Les dix tours sont terminés : la vague doit maintenant être résolue.'
		);
	}

	if (
		inputState.lastResolvedTurn ===
		inputState.currentTurn
	) {
		throw new Error(
			`Le tour ${inputState.currentTurn} a déjà été résolu.`
		);
	}

	const state =
		structuredClone(
			inputState
		);

	const tf =
		resolveTfCoreTurn(
			state.corcite
		);

	let corcite =
		tf.corcite;

	const rpg =
		advanceActiveRpgResearch(
			corcite,
			state.currentTurn
		);

	corcite =
		rpg.corcite;

	state.corcite =
		corcite;

	state.lastTf = {
		extraction:
			tf.extraction,
		transformation:
			tf.transformation,
		fabrication:
			tf.fabrication
	};

	state.lastResolvedTurn =
		state.currentTurn;

	const finalTurn =
		state.currentTurn ===
		state.session.configuration
			.turns;

	if (finalTurn) {
		state.waveReady = true;
		state.statusMessage =
			'Tour final résolu. La vague peut être lancée.';
	} else {
		state.currentTurn += 1;
		state.statusMessage =
			`Tour ${state.lastResolvedTurn} résolu. Passage au tour ${state.currentTurn}.`;
	}

	return state;
}

export function resolveBrowserWave(
	inputState:
		Proto0BrowserState
): Proto0BrowserState {
	if (
		!inputState.waveReady
	) {
		throw new Error(
			'La vague ne peut être résolue qu’après le dixième tour.'
		);
	}

	if (
		inputState.waveResolved
	) {
		throw new Error(
			'La vague est déjà résolue.'
		);
	}

	const state =
		structuredClone(
			inputState
		);

	const resolution =
		resolveTdPath(
			state.corcite.td,
			state.session.actualWave
		);

	const consequence =
		applyWaveConsequences(
			state.corcite,
			{
				runId:
					state.session.runId,
				turn:
					state.currentTurn,
				resolution,
				consumptions:
					state.waveConsumptions
			}
		);

	const reporting =
		createWaveReporting({
			runId:
				state.session.runId,
			version:
				PROTO0_BROWSER_VERSION,
			seed:
				state.session
					.configuration.seed,
			turn:
				state.currentTurn,
			corciteId:
				state.corcite.id,
			waveForecasts:
				state.session
					.waveForecasts,
			actualWave:
				state.session
					.actualWave,
			tdResolution:
				resolution,
			consequence:
				consequence
					.consequence,
			turnPlan:
				state.lastTurnPlan ??
				undefined,
			reservations:
				consequence
					.corcite
					.reservations,
			modifiers:
				consequence
					.corcite
					.modifiers,
			tf:
				state.lastTf ??
				undefined,
			rpgJournal:
				consequence
					.corcite
					.rpg.journal
		});

	state.corcite =
		consequence.corcite;

	state.playerReport =
		reporting.playerReport;

	state.technicalLog =
		reporting.technicalLog;

	state.waveResolved = true;

	state.statusMessage =
		reporting.playerReport
			.summary.title;

	return state;
}
