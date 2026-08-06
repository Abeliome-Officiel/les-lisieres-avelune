import assert from 'node:assert/strict';
import test from 'node:test';

import {
	REFERENCE_SESSION_CONFIGURATION,
	applyWaveConsequences,
	createEmptyTdState,
	createInitialState,
	createReferenceCorciteState,
	createTdTower,
	createWaveReporting,
	exportPlayerWaveReportReadable,
	exportWaveReportingMachine,
	placeTdTower,
	resolveTdPath,
	resolveTfCoreTurn
} from '../../src/lib/proto0/index.js';

import type {
	TurnPlan
} from '../../src/lib/proto0/domain/turn.js';

function createFixture() {
	const config =
		structuredClone(
			REFERENCE_SESSION_CONFIGURATION
		);

	const session =
		createInitialState(
			config,
			{
				runId:
					'P8-RUN'
			}
		);

	let corcite =
		createReferenceCorciteState({
			id:
				'corcite-p8',
			name:
				'P8',
			controller:
				'human'
		});

	const definitions = [
		'attenuation-n1',
		'destructuration-n1',
		'captation-n1',
		'stabilisation-n1'
	] as const;

	for (
		let index = 0;
		index <
			definitions.length;
		index += 1
	) {
		corcite.td =
			placeTdTower(
				corcite.td,
				{
					position:
						index + 1,
					tower:
						createTdTower({
							id:
								`p8-tower-${index + 1}`,
							definitionId:
								definitions[index]
						})
				}
			);
	}

	const resolution =
		resolveTdPath(
			corcite.td,
			session.actualWave
		);

	const consequences =
		applyWaveConsequences(
			corcite,
			{
				runId:
					session.runId,
				turn: 10,
				resolution,
				consumptions: [
					{
						resourceId:
							'R3',
						amount: 2,
						source:
							'td-preparation:attenuation-n1'
					},
					{
						resourceId:
							'R4',
						amount: 1,
						source:
							'td-preparation:attenuation-n1'
					}
				]
			}
		);

	const turnPlan:
		TurnPlan = {
			turn: 10,
			phase:
				'resolved',
			operations: [
				{
					id:
						'op-p8',
					label:
						'Préparation TD',
					kind:
						'resource-demand',
					priority: 10,
					resourceCosts: {
						R3: 2,
						R4: 1
					},
					status:
						'reserved'
				}
			],
			conflicts: [],
			arbitrations: [],
			journal: [
				{
					sequence: 1,
					event:
						'turn-created',
					message:
						'Tour de test créé.'
				},
				{
					sequence: 2,
					event:
						'end-turn-requested',
					message:
						'Fin du tour demandée.'
				}
			]
		};

	const tf =
		resolveTfCoreTurn(
			createReferenceCorciteState({
				id:
					'corcite-p8-tf',
				name:
					'P8-TF',
				controller:
					'human'
			})
		);

	const input = {
		runId:
			session.runId,
		version:
			'0.9.0-dev.1',
		seed:
			config.seed,
		turn: 10,
		corciteId:
			corcite.id,
		waveForecasts:
			session.waveForecasts,
		actualWave:
			session.actualWave,
		tdResolution:
			resolution,
		consequence:
			consequences
				.consequence,
		turnPlan,
		reservations: [
			{
				id:
					'reservation-p8',
				operationId:
					'op-p8',
				storageUnitId:
					'storage-p8',
				resourceId:
					'R3' as const,
				amount: 2,
				purpose:
					'Préparation TD',
				status:
					'consumed' as const
			}
		],
		modifiers: [
			{
				id:
					'modifier-p8',
				source:
					'research:p8',
				target:
					'tf.recipe.transform-r3-n1.output.R3',
				operation:
					'multiply' as const,
				value: 1.2,
				active: true
			}
		],
		tf: {
			extraction:
				tf.extraction,
			transformation:
				tf.transformation,
			fabrication:
				tf.fabrication
		},
		rpgJournal:
			consequences
				.corcite
				.rpg.journal,
		issues: [
			{
				kind:
					'impossible-decision' as const,
				message:
					'Exemple de décision impossible conservée dans le journal technique.'
			}
		]
	};

	return {
		input,
		resolution,
		consequences
	};
}

test("le rapport joueur et le journal technique sont deux objets distincts", () => {
	const { input } =
		createFixture();

	const reporting =
		createWaveReporting(
			input
		);

	assert.equal(
		reporting.playerReport
			.schema,
		'avelune.proto0.player-wave-report'
	);

	assert.equal(
		reporting.technicalLog
			.schema,
		'avelune.proto0.technical-log'
	);

	assert.notDeepEqual(
		reporting.playerReport,
		reporting.technicalLog
	);
});

test("le rapport joueur contient un résumé par défaut et les détails à la demande", () => {
	const reporting =
		createWaveReporting(
			createFixture()
				.input
		);

	assert.ok(
		reporting.playerReport
			.summary.title
			.length > 0
	);

	assert.ok(
		reporting.playerReport
			.summary.message
			.length > 0
	);

	assert.equal(
		reporting.playerReport
			.details
			.towerEffects.length,
		8
	);
});

test("le rapport distingue prévision, vague réelle et quatre variables avant/après", () => {
	const { input } =
		createFixture();

	const report =
		createWaveReporting(
			input
		).playerReport;

	assert.deepEqual(
		report.details
			.forecastWave,
		input.waveForecasts
			.tMinus1
			.estimatedWave
	);

	assert.deepEqual(
		report.details
			.actualWave,
		input.actualWave
	);

	assert.deepEqual(
		Object.keys(
			report.details
				.variables
		).sort(),
		[
			'capturableMatter',
			'charge',
			'pressure',
			'structure'
		]
	);
});

test("les effets successifs des huit positions TD sont conservés sans recalcul", () => {
	const {
		input,
		resolution
	} = createFixture();

	const report =
		createWaveReporting(
			input
		).playerReport;

	assert.deepEqual(
		report.details
			.towerEffects,
		resolution.steps
	);
});

test("matière captée, consommations, conséquence, résultat et connaissance figurent dans le rapport", () => {
	const {
		input,
		consequences
	} = createFixture();

	const report =
		createWaveReporting(
			input
		).playerReport;

	assert.equal(
		report.details
			.capturedMatter,
		consequences
			.consequence
			.capturedMatter
	);

	assert.equal(
		report.details
			.consumptions.length,
		2
	);

	assert.deepEqual(
		report.details
			.consequence,
		consequences
			.consequence
	);

	assert.equal(
		report.summary
			.defenseResult,
		consequences
			.consequence
			.defenseResult
	);

	assert.equal(
		report.details
			.knowledgeProduced
			.length,
		1
	);
});

test("le journal technique conserve les métadonnées nécessaires à la reproductibilité", () => {
	const { input } =
		createFixture();

	const log =
		createWaveReporting(
			input
		).technicalLog;

	assert.equal(
		log.runId,
		input.runId
	);

	assert.equal(
		log.version,
		input.version
	);

	assert.equal(
		log.seed,
		input.seed
	);

	assert.equal(
		log.turn,
		10
	);

	assert.equal(
		log.corciteId,
		input.corciteId
	);
});

test("le journal technique couvre tour, réservations, TF, RPG, TD, conséquences et erreurs", () => {
	const log =
		createWaveReporting(
			createFixture()
				.input
		).technicalLog;

	const actions =
		new Set(
			log.entries.map(
				(entry) =>
					entry.action
			)
		);

	for (
		const required of [
			'wave-context',
			'turn-plan',
			'resource-reservations',
			'rpg-modifiers',
			'tf-extraction',
			'tf-transformation',
			'tf-fabrication',
			'rpg-journal',
			'td-configuration',
			'td-position',
			'wave-consequence',
			'impossible-decision'
		]
	) {
		assert.equal(
			actions.has(
				required
			),
			true,
			`action technique absente : ${required}`
		);
	}
});

test("le journal TD comporte huit entrées ordonnées avec états entrants et sortants", () => {
	const log =
		createWaveReporting(
			createFixture()
				.input
		).technicalLog;

	const tdSteps =
		log.entries.filter(
			(entry) =>
				entry.action ===
					'td-position'
		);

	assert.equal(
		tdSteps.length,
		8
	);

	assert.deepEqual(
		tdSteps.map(
			(entry) =>
				(
					entry.details as {
						position: number;
					}
				).position
		),
		[1, 2, 3, 4, 5, 6, 7, 8]
	);

	for (
		const entry of
		tdSteps
	) {
		assert.ok(
			entry.inputs
		);

		assert.ok(
			entry.outputs
		);
	}
});

test("l'export machine restitue exactement le bundle de reporting", () => {
	const reporting =
		createWaveReporting(
			createFixture()
				.input
		);

	const restored =
		JSON.parse(
			exportWaveReportingMachine(
				reporting
			)
		);

	assert.deepEqual(
		restored,
		reporting
	);
});

test("l'export lisible explique le résultat sans exposer le journal technique", () => {
	const reporting =
		createWaveReporting(
			createFixture()
				.input
		);

	const readable =
		exportPlayerWaveReportReadable(
			reporting
				.playerReport
		);

	assert.match(
		readable,
		/Rapport de fin de vague/
	);

	assert.match(
		readable,
		/Prévision la plus précise/
	);

	assert.match(
		readable,
		/Vague réellement rencontrée/
	);

	assert.match(
		readable,
		/Effets successifs/
	);

	assert.match(
		readable,
		/Matière captée/
	);

	assert.match(
		readable,
		/Connaissance produite/
	);

	assert.doesNotMatch(
		readable,
		/technical-log/
	);
});
