import assert from 'node:assert/strict';
import test from 'node:test';

import {
	REFERENCE_SESSION_CONFIGURATION,
	createInitialState,
	validateSessionConfiguration
} from '../../src/lib/proto0/index.js';

function cloneReference() {
	return structuredClone(REFERENCE_SESSION_CONFIGURATION);
}

function assertWithinPercent(
	actual: number,
	reference: number,
	percent: number
): void {
	const delta = reference * (percent / 100);

	assert.ok(
		actual >= reference - delta && actual <= reference + delta,
		`${actual} doit rester dans ±${percent}% de ${reference}`
	);
}

test('même configuration + même seed = même simulation initiale', () => {
	const configA = cloneReference();
	const configB = cloneReference();

	const stateA = createInitialState(configA, {
		runId: 'TEST-RUN'
	});
	const stateB = createInitialState(configB, {
		runId: 'TEST-RUN'
	});

	assert.deepEqual(stateA, stateB);
});

test('deux exécutions indépendantes peuvent partager la même seed', () => {
	const config = cloneReference();

	const stateA = createInitialState(config);
	const stateB = createInitialState(config);

	assert.notEqual(stateA.runId, stateB.runId);

	assert.deepEqual(
		stateA.actualWave,
		stateB.actualWave,
		'la seed doit reproduire la même vague'
	);
});

test('une autre seed produit une autre réalisation de vague', () => {
	const configA = cloneReference();
	const configB = cloneReference();

	configB.seed = configA.seed + 1;

	const stateA = createInitialState(configA, {
		runId: 'RUN-A'
	});
	const stateB = createInitialState(configB, {
		runId: 'RUN-B'
	});

	assert.notDeepEqual(stateA.actualWave, stateB.actualWave);
});

test('la vague réalisée reste dans la variation bornée de ±2 %', () => {
	const config = cloneReference();

	for (let seed = 1; seed <= 1000; seed += 1) {
		config.seed = seed;

		const state = createInitialState(config, {
			runId: `RUN-${seed}`
		});

		assertWithinPercent(
			state.actualWave.pressure,
			config.wave.nominal.pressure,
			2
		);
		assertWithinPercent(
			state.actualWave.structure,
			config.wave.nominal.structure,
			2
		);
		assertWithinPercent(
			state.actualWave.charge,
			config.wave.nominal.charge,
			2
		);
		assertWithinPercent(
			state.actualWave.capturableMatter,
			config.wave.nominal.capturableMatter,
			2
		);
	}
});

test('la session de référence crée 1 Corcite humain et 4 simulés', () => {
	const state = createInitialState(cloneReference(), {
		runId: 'TEST-RUN'
	});

	assert.equal(state.corcites.length, 5);

	assert.deepEqual(
		state.corcites.map((corcite) => corcite.controller),
		[
			'human',
			'simulated-tf',
			'simulated-td',
			'simulated-rpg',
			'simulated-limits'
		]
	);
});

test('la configuration invalide est rejetée', () => {
	const config = cloneReference();

	config.turns = 1000;

	const validation = validateSessionConfiguration(config);

	assert.equal(validation.valid, false);
	assert.ok(validation.errors.length > 0);

	assert.throws(() =>
		createInitialState(config, {
			runId: 'INVALID'
		})
	);
});

test('la configuration de référence est valide', () => {
	const validation = validateSessionConfiguration(
		cloneReference()
	);

	assert.deepEqual(validation, {
		valid: true,
		errors: []
	});
});

test('une configuration sérialisée puis relue reste identique', async () => {
	const {
		serializeSessionConfiguration,
		deserializeSessionConfiguration
	} = await import('../../src/lib/proto0/index.js');

	const config = cloneReference();

	const serialized = serializeSessionConfiguration(config);
	const restored = deserializeSessionConfiguration(serialized);

	assert.deepEqual(restored, config);
});

test('une configuration restaurée reproduit le même état initial', async () => {
	const {
		serializeSessionConfiguration,
		deserializeSessionConfiguration
	} = await import('../../src/lib/proto0/index.js');

	const config = cloneReference();

	const restored = deserializeSessionConfiguration(
		serializeSessionConfiguration(config)
	);

	const stateA = createInitialState(config, {
		runId: 'SAME-RUN'
	});
	const stateB = createInitialState(restored, {
		runId: 'SAME-RUN'
	});

	assert.deepEqual(stateA, stateB);
});

test('un JSON syntaxiquement invalide est rejeté', async () => {
	const { deserializeSessionConfiguration } = await import(
		'../../src/lib/proto0/index.js'
	);

	assert.throws(
		() => deserializeSessionConfiguration('{ pas du json'),
		/JSON invalide/
	);
});

test('un JSON valide mais structurellement incorrect est rejeté', async () => {
	const { deserializeSessionConfiguration } = await import(
		'../../src/lib/proto0/index.js'
	);

	assert.throws(
		() =>
			deserializeSessionConfiguration(
				JSON.stringify({
					schema: 'autre-chose',
					seed: 123
				})
			),
		/structure JSON incompatible/
	);
});

test('une configuration hors bornes est rejetée après relecture', async () => {
	const {
		serializeSessionConfiguration,
		deserializeSessionConfiguration
	} = await import('../../src/lib/proto0/index.js');

	const config = cloneReference();
	const serialized = serializeSessionConfiguration(config);

	const raw = JSON.parse(serialized) as Record<string, unknown>;
	raw.turns = 999;

	assert.throws(
		() =>
			deserializeSessionConfiguration(
				JSON.stringify(raw)
			),
		/Configuration PROTO-0 invalide/
	);
});
