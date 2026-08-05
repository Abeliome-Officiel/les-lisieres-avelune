import type {
	CorciteState
} from './domain/corcite.js';
import type {
	WaveConsequenceSnapshot,
	WaveConsequenceState,
	WaveDefenseResult,
	WaveKnowledgeProduced,
	WaveRelevantConsumption
} from './domain/consequence.js';
import type {
	TdResolutionResult
} from './domain/td.js';

export interface ApplyWaveConsequencesInput {
	runId: string;
	turn: number;
	resolution: TdResolutionResult;
	consumptions?: WaveRelevantConsumption[];
}

export interface ApplyWaveConsequencesResult {
	corcite: CorciteState;
	consequence: WaveConsequenceState;
	snapshotAfterWave: WaveConsequenceSnapshot;
}

function appendKnowledgeJournal(
	state: CorciteState,
	source: string,
	key: string
): void {
	state.rpg.journal.push({
		sequence:
			state.rpg.journal.length +
			1,
		event:
			'knowledge-updated',
		source,
		message:
			`Connaissance produite par la vague : ${key}.`
	});
}

function determineDefenseResult(
	resolution: TdResolutionResult
): WaveDefenseResult {
	const final =
		resolution.finalWave;

	return (
		final.pressure === 0 &&
		final.structure === 0 &&
		final.charge === 0
	)
		? 'contained'
		: 'residual';
}

function validateConsumptions(
	consumptions:
		readonly WaveRelevantConsumption[]
): void {
	for (
		const consumption of
		consumptions
	) {
		if (
			!Number.isFinite(
				consumption.amount
			) ||
			consumption.amount <= 0
		) {
			throw new Error(
				`Consommation de vague invalide : ${consumption.amount}.`
			);
		}

		if (
			!consumption.source.trim()
		) {
			throw new Error(
				'Une consommation de vague doit posséder une origine.'
			);
		}
	}
}

function createKnowledge(
	runId: string,
	corciteId: string
): WaveKnowledgeProduced {
	const source =
		`wave:${runId}`;

	const key =
		`wave:observation:${runId}`;

	return {
		id:
			`knowledge-wave:${runId}:${corciteId}`,
		key,
		source,
		value: 1
	};
}

export function applyWaveConsequences(
	inputState: CorciteState,
	input: ApplyWaveConsequencesInput
): ApplyWaveConsequencesResult {
	if (!input.runId.trim()) {
		throw new Error(
			'Une conséquence de vague doit posséder un identifiant de session.'
		);
	}

	if (
		!Number.isInteger(
			input.turn
		) ||
		input.turn < 1
	) {
		throw new Error(
			`Tour de conséquence invalide : ${input.turn}.`
		);
	}

	if (
		!Number.isFinite(
			input.resolution
				.capturedMatter
		) ||
		input.resolution
			.capturedMatter < 0
	) {
		throw new Error(
			'Matière captée invalide.'
		);
	}

	const consumptions =
		structuredClone(
			input.consumptions ??
				[]
		);

	validateConsumptions(
		consumptions
	);

	const state =
		structuredClone(
			inputState
		);

	const consequenceId =
		`wave-consequence:${input.runId}:${state.id}`;

	if (
		state.waveConsequences.some(
			(consequence) =>
				consequence.id ===
					consequenceId
		)
	) {
		throw new Error(
			`La vague ${input.runId} a déjà produit des conséquences pour ${state.id}.`
		);
	}

	const knowledge =
		createKnowledge(
			input.runId,
			state.id
		);

	if (
		state.rpg.knowledge.some(
			(entry) =>
				entry.id ===
					knowledge.id
		)
	) {
		throw new Error(
			`Connaissance de vague déjà présente : ${knowledge.id}.`
		);
	}

	const consequence:
		WaveConsequenceState = {
			id:
				consequenceId,
			runId:
				input.runId,
			turn:
				input.turn,
			defenseResult:
				determineDefenseResult(
					input.resolution
				),
			initialWave:
				structuredClone(
					input.resolution
						.initialWave
				),
			finalWave:
				structuredClone(
					input.resolution
						.finalWave
				),
			capturedMatter:
				input.resolution
					.capturedMatter,
			consumptions,
			knowledgeProduced: [
				structuredClone(
					knowledge
				)
			]
		};

	state.waveConsequences.push(
		structuredClone(
			consequence
		)
	);

	state.rpg.knowledge.push({
		id:
			knowledge.id,
		source:
			knowledge.source,
		key:
			knowledge.key,
		value:
			knowledge.value
	});

	appendKnowledgeJournal(
		state,
		knowledge.source,
		knowledge.key
	);

	const snapshotAfterWave:
		WaveConsequenceSnapshot = {
			corciteId:
				state.id,
			consequenceId:
				consequence.id,
			defenseResult:
				consequence
					.defenseResult,
			finalWave:
				structuredClone(
					consequence
						.finalWave
				),
			capturedMatter:
				consequence
					.capturedMatter,
			consumptions:
				structuredClone(
					consequence
						.consumptions
				),
			knowledgeProduced:
				structuredClone(
					consequence
						.knowledgeProduced
				)
		};

	return {
		corcite:
			state,
		consequence:
			structuredClone(
				consequence
			),
		snapshotAfterWave:
			structuredClone(
				snapshotAfterWave
			)
	};
}
