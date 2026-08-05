import type {
	ModifierState
} from './domain/corcite.js';
import type {
	WaveConsequenceState
} from './domain/consequence.js';
import type {
	ResourceReservation
} from './domain/resources.js';
import type {
	TechnicalLogEntry,
	TechnicalLogIssue,
	TfReportingSnapshot,
	WaveReportingBundle
} from './domain/reporting.js';
import type {
	RpgJournalEntry
} from './domain/rpg.js';
import type {
	TdResolutionResult
} from './domain/td.js';
import type {
	TurnPlan
} from './domain/turn.js';
import type {
	WaveForecasts,
	WaveState
} from './domain/wave.js';

export interface CreateWaveReportingInput {
	runId: string;
	version: string;
	seed: number;
	turn: number;
	corciteId: string;
	waveForecasts: WaveForecasts;
	actualWave: WaveState;
	tdResolution:
		TdResolutionResult;
	consequence:
		WaveConsequenceState;
	turnPlan?: TurnPlan;
	reservations?:
		ResourceReservation[];
	modifiers?: ModifierState[];
	tf?: TfReportingSnapshot;
	rpgJournal?:
		RpgJournalEntry[];
	issues?: TechnicalLogIssue[];
}

function createSummary(
	consequence:
		WaveConsequenceState
) {
	if (
		consequence.defenseResult ===
		'contained'
	) {
		return {
			title:
				'Vague contenue',
			message:
				'La vague a été entièrement contenue sur les variables de défense suivies par PROTO-0.',
			defenseResult:
				consequence
					.defenseResult,
			capturedMatter:
				consequence
					.capturedMatter
		};
	}

	return {
		title:
			'Exposition résiduelle',
		message:
			'La défense a modifié la vague, mais une exposition résiduelle demeure après le passage dans le Corcite.',
		defenseResult:
			consequence
				.defenseResult,
		capturedMatter:
			consequence
				.capturedMatter
	};
}

function createEntryAppender(
	input:
		CreateWaveReportingInput,
	entries:
		TechnicalLogEntry[]
) {
	return (
		phase:
			TechnicalLogEntry['phase'],
		actor: string,
		action: string,
		inputs: unknown,
		outputs: unknown,
		details: unknown
	): void => {
		entries.push({
			sequence:
				entries.length +
				1,
			runId:
				input.runId,
			version:
				input.version,
			seed:
				input.seed,
			turn:
				input.turn,
			phase,
			actor,
			action,
			inputs:
				structuredClone(
					inputs
				),
			outputs:
				structuredClone(
					outputs
				),
			details:
				structuredClone(
					details
				)
		});
	};
}

function buildTechnicalEntries(
	input:
		CreateWaveReportingInput
): TechnicalLogEntry[] {
	const entries:
		TechnicalLogEntry[] = [];

	const append =
		createEntryAppender(
			input,
			entries
		);

	append(
		'session',
		'session',
		'wave-context',
		{
			forecasts:
				input.waveForecasts
		},
		{
			actualWave:
				input.actualWave
		},
		{
			corciteId:
				input.corciteId
		}
	);

	if (input.turnPlan) {
		append(
			'turn',
			input.corciteId,
			'turn-plan',
			{
				operations:
					input.turnPlan
						.operations
			},
			{
				phase:
					input.turnPlan
						.phase
			},
			{
				conflicts:
					input.turnPlan
						.conflicts,
				arbitrations:
					input.turnPlan
						.arbitrations,
				journal:
					input.turnPlan
						.journal
			}
		);
	}

	append(
		'turn',
		input.corciteId,
		'resource-reservations',
		input.reservations ?? [],
		null,
		null
	);

	append(
		'rpg',
		input.corciteId,
		'rpg-modifiers',
		input.modifiers ?? [],
		null,
		null
	);

	if (input.tf) {
		for (
			const event of
			input.tf.extraction
				.events
		) {
			append(
				'tf',
				input.corciteId,
				'tf-extraction',
				{
					structureId:
						event.structureId,
					sourceId:
						event.sourceId,
					requestedOutput:
						event.requestedOutput
				},
				{
					producedOutput:
						event.producedOutput,
					placements:
						event.placements,
					networkMovements:
						event.networkMovements ??
						[]
				},
				{
					resourceId:
						event.resourceId,
					status:
						event.status,
					message:
						event.message
				}
			);
		}

		for (
			const event of
			input.tf
				.transformation
				.events
		) {
			append(
				'tf',
				input.corciteId,
				'tf-transformation',
				{
					structureId:
						event.structureId,
					recipeId:
						event.recipeId,
					inputs:
						event.inputs,
					baseOutputs:
						event.baseOutputs ??
						event.outputs
				},
				{
					outputs:
						event.outputs,
					placements:
						event.placements,
					networkMovements:
						event.networkMovements ??
						[]
				},
				{
					status:
						event.status,
					consumptions:
						event.consumptions,
					bufferConsumptions:
						event.bufferConsumptions ??
						[],
					appliedModifiers:
						event.appliedModifiers ??
						[],
					message:
						event.message
				}
			);
		}

		for (
			const event of
			input.tf.fabrication
				.events
		) {
			append(
				'tf',
				input.corciteId,
				'tf-fabrication',
				{
					structureId:
						event.structureId,
					recipeId:
						event.recipeId,
					inputs:
						event.inputs,
					baseOutputs:
						event.baseOutputs ??
						event.outputs
				},
				{
					outputs:
						event.outputs,
					placements:
						event.placements,
					networkMovements:
						event.networkMovements ??
						[]
				},
				{
					status:
						event.status,
					consumptions:
						event.consumptions,
					bufferConsumptions:
						event.bufferConsumptions ??
						[],
					appliedModifiers:
						event.appliedModifiers ??
						[],
					message:
						event.message
				}
			);
		}
	}

	for (
		const journalEntry of
		input.rpgJournal ?? []
	) {
		append(
			'rpg',
			input.corciteId,
			'rpg-journal',
			{
				source:
					journalEntry.source
			},
			{
				event:
					journalEntry.event
			},
			{
				journalEntry
			}
		);
	}

	append(
		'td',
		input.corciteId,
		'td-configuration',
		{
			positions:
				input.tdResolution
					.steps.map(
						(step) => ({
							position:
								step.position,
							tower:
								step.tower
						})
					)
		},
		null,
		null
	);

	for (
		const step of
		input.tdResolution.steps
	) {
		append(
			'td',
			input.corciteId,
			'td-position',
			step.before,
			step.after,
			{
				position:
					step.position,
				tower:
					step.tower,
				effect:
					step.effect
			}
		);
	}

	append(
		'consequence',
		input.corciteId,
		'wave-consequence',
		input.consequence
			.initialWave,
		input.consequence
			.finalWave,
		{
			defenseResult:
				input.consequence
					.defenseResult,
			capturedMatter:
				input.consequence
					.capturedMatter,
			consumptions:
				input.consequence
					.consumptions,
			knowledgeProduced:
				input.consequence
					.knowledgeProduced
		}
	);

	for (
		const issue of
		input.issues ?? []
	) {
		append(
			'error',
			input.corciteId,
			issue.kind,
			null,
			null,
			issue
		);
	}

	return entries;
}

export function createWaveReporting(
	input:
		CreateWaveReportingInput
): WaveReportingBundle {
	if (
		!input.runId.trim() ||
		!input.version.trim() ||
		!input.corciteId.trim()
	) {
		throw new Error(
			'Le reporting exige des identifiants et une version non vides.'
		);
	}

	if (
		!Number.isFinite(
			input.seed
		) ||
		!Number.isInteger(
			input.turn
		) ||
		input.turn < 1
	) {
		throw new Error(
			'Métadonnées de reporting invalides.'
		);
	}

	const initialWave =
		input.tdResolution
			.initialWave;

	const finalWave =
		input.tdResolution
			.finalWave;

	const playerReport = {
		schema:
			'avelune.proto0.player-wave-report' as const,
		schemaVersion:
			1 as const,
		runId:
			input.runId,
		turn:
			input.turn,
		corciteId:
			input.corciteId,
		summary:
			createSummary(
				input.consequence
			),
		details: {
			forecasts:
				structuredClone(
					input.waveForecasts
				),
			forecastWave:
				structuredClone(
					input.waveForecasts
						.tMinus1
						.estimatedWave
				),
			actualWave:
				structuredClone(
					input.actualWave
				),
			initialWave:
				structuredClone(
					initialWave
				),
			finalWave:
				structuredClone(
					finalWave
				),
			variables: {
				pressure: {
					before:
						initialWave
							.pressure,
					after:
						finalWave
							.pressure
				},
				structure: {
					before:
						initialWave
							.structure,
					after:
						finalWave
							.structure
				},
				charge: {
					before:
						initialWave
							.charge,
					after:
						finalWave
							.charge
				},
				capturableMatter: {
					before:
						initialWave
							.capturableMatter,
					after:
						finalWave
							.capturableMatter
				}
			},
			towerEffects:
				structuredClone(
					input.tdResolution
						.steps
				),
			capturedMatter:
				input.consequence
					.capturedMatter,
			consumptions:
				structuredClone(
					input.consequence
						.consumptions
				),
			consequence:
				structuredClone(
					input.consequence
				),
			knowledgeProduced:
				structuredClone(
					input.consequence
						.knowledgeProduced
				)
		}
	};

	const technicalLog = {
		schema:
			'avelune.proto0.technical-log' as const,
		schemaVersion:
			1 as const,
		runId:
			input.runId,
		version:
			input.version,
		seed:
			input.seed,
		turn:
			input.turn,
		corciteId:
			input.corciteId,
		source: {
			waveForecasts:
				structuredClone(
					input.waveForecasts
				),
			actualWave:
				structuredClone(
					input.actualWave
				),
			turnPlan:
				input.turnPlan
					? structuredClone(
							input.turnPlan
						)
					: null,
			reservations:
				structuredClone(
					input.reservations ??
						[]
				),
			modifiers:
				structuredClone(
					input.modifiers ??
						[]
				),
			tf:
				input.tf
					? structuredClone(
							input.tf
						)
					: null,
			rpgJournal:
				structuredClone(
					input.rpgJournal ??
						[]
				),
			tdResolution:
				structuredClone(
					input.tdResolution
				),
			consequence:
				structuredClone(
					input.consequence
				),
			issues:
				structuredClone(
					input.issues ??
						[]
				)
		},
		entries:
			buildTechnicalEntries(
				input
			)
	};

	return {
		playerReport:
			structuredClone(
				playerReport
			),
		technicalLog:
			structuredClone(
				technicalLog
			)
	};
}
