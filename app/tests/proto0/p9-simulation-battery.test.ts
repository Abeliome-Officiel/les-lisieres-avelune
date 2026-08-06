import assert from 'node:assert/strict';
import test from 'node:test';

import {
	PROTO0_P9_SEEDS,
	PROTO0_REFERENCE_TD_CONFIGURATIONS,
	createProto0SimulationAudit,
	formatProto0SimulationAuditMarkdown,
	runProto0StressAudit,
	runTdReferenceBattery
} from '../../src/lib/proto0/index.js';

test("la nouvelle référence moteur contient exactement 60 configurations TD uniques", () => {
	assert.equal(
		PROTO0_REFERENCE_TD_CONFIGURATIONS
			.length,
		60
	);

	assert.equal(
		new Set(
			PROTO0_REFERENCE_TD_CONFIGURATIONS.map(
				(configuration) =>
					configuration.order.join(
						'|'
					)
			)
		).size,
		60
	);

	assert.equal(
		PROTO0_REFERENCE_TD_CONFIGURATIONS
			.filter(
				(configuration) =>
					configuration.kind ===
						'four-family-permutation'
			)
			.length,
		24
	);

	assert.equal(
		PROTO0_REFERENCE_TD_CONFIGURATIONS
			.filter(
				(configuration) =>
					configuration.kind ===
						'paired-family-order'
			)
			.length,
		36
	);
});

test("le scénario nominal réexécute les 60 configurations avec la même vague de référence", () => {
	const battery =
		runTdReferenceBattery({
			scenario:
				'nominal'
		});

	assert.equal(
		battery.results.length,
		60
	);

	assert.deepEqual(
		battery.inputWave,
		{
			pressure: 50,
			structure: 60,
			charge: 20,
			capturableMatter: 16
		}
	);

	assert.equal(
		battery.results.every(
			(result) =>
				result.scenario ===
					'nominal' &&
				result.seed ===
					null
		),
		true
	);
});

test("les ordonnancements TD produisent plusieurs résultats distincts", () => {
	const battery =
		runTdReferenceBattery({
			scenario:
				'nominal'
		});

	assert.ok(
		battery.distinctResultCount >
			1
	);
});

test("aucune configuration n'est universellement dominante dans le scénario nominal", () => {
	const battery =
		runTdReferenceBattery({
			scenario:
				'nominal'
		});

	assert.deepEqual(
		battery
			.universallyDominantConfigurationIds,
		[]
	);

	assert.ok(
		battery
			.paretoFrontConfigurationIds
			.length >
			1
	);
});

test("64 graines bornées exécutent 3840 configurations et restent dans ±2 %", () => {
	const audit =
		createProto0SimulationAudit(
			PROTO0_P9_SEEDS
		);

	assert.equal(
		audit.seeded
			.batteriesExecuted,
		64
	);

	assert.equal(
		audit.seeded
			.configurationsExecuted,
		3840
	);

	assert.equal(
		audit.seeded
			.allInputWavesWithinBounds,
		true
	);

	assert.equal(
		audit.seeded
			.distinctSeedsProduceVariation,
		true
	);
});

test("une batterie rejouée avec la même graine est exactement reproductible", () => {
	const first =
		runTdReferenceBattery({
			scenario:
				'seeded',
			seed: 37
		});

	const second =
		runTdReferenceBattery({
			scenario:
				'seeded',
			seed: 37
		});

	assert.deepEqual(
		first,
		second
	);
});

test("les graines testées ne font apparaître aucune domination universelle", () => {
	const audit =
		createProto0SimulationAudit(
			[
				1,
				7,
				13,
				29,
				47,
				64
			]
		);

	assert.equal(
		audit.seeded
			.seedsWithUniversalDominance
			.length,
		0
	);

	assert.equal(
		audit.conclusions
			.noUniversalDominanceObserved,
		true
	);
});

test("100 tours TF de stress terminent sans état impossible ni transformation gratuite", () => {
	const stress =
		runProto0StressAudit(
			100
		);

	assert.equal(
		stress.tfTurnsCompleted,
		100
	);

	assert.equal(
		stress.allTfStatesValid,
		true
	);

	assert.equal(
		stress.freeProcessingDetected,
		false
	);

	assert.equal(
		stress.storageSaturationHandled,
		true
	);

	assert.equal(
		stress.blockedChainHandled,
		true
	);
});

test("les ressources insuffisantes et conflits humains restent explicites", () => {
	const stress =
		runProto0StressAudit(
			5
		);

	assert.equal(
		stress.insufficientResourceExplicit,
		true
	);

	assert.equal(
		stress.humanConflictExplicit,
		true
	);

	assert.equal(
		stress.humanConflictResolved,
		true
	);

	assert.equal(
		stress.impossibleStateDetected,
		true
	);
});

test("le rapport P9 distingue la nouvelle référence moteur de la liste historique non conservée", () => {
	const audit =
		createProto0SimulationAudit(
			[
				1,
				2,
				3
			]
		);

	const report =
		formatProto0SimulationAuditMarkdown(
			audit
		);

	assert.match(
		report,
		/liste exacte/
	);

	assert.match(
		report,
		/60 configurations/
	);

	assert.match(
		report,
		/24 permutations/
	);

	assert.match(
		report,
		/36 ordonnancements/
	);

	assert.match(
		report,
		/Conclusions moteur/
	);
});
