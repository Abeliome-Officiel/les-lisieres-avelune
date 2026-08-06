import assert from 'node:assert/strict';
import test from 'node:test';

import {
	REFERENCE_SESSION_CONFIGURATION,
	TF_LAB_REFERENCE,
	createInitialState,
	createReferenceCorciteState,
	getAvailableAmount,
	snapshotCorciteState,
	summarizeStoredResources,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createHumanCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-test',
		name: 'TEST',
		controller: 'human'
	});
}

test('les stocks initiaux correspondent aux valeurs de laboratoire', () => {
	const corcite = createHumanCorcite();

	assert.deepEqual(
		summarizeStoredResources(corcite),
		TF_LAB_REFERENCE.initialStocks
	);
});

test('les stocks sont répartis dans des unités individuelles', () => {
	const corcite = createHumanCorcite();

	assert.equal(corcite.storageUnits.length, 2);

	for (const storage of corcite.storageUnits) {
		const load = Object.values(storage.contents).reduce(
			(sum, amount) => sum + amount,
			0
		);

		assert.ok(load <= storage.capacity);
		assert.equal(
			storage.capacity,
			TF_LAB_REFERENCE.storageUnitCapacityN1
		);
	}
});

test("l'état initial respecte les capacités de laboratoire", () => {
	const corcite = createHumanCorcite();

	assert.deepEqual(corcite.capacities, {
		energy: {
			normalCapacity: 8,
			used: 6,
			reserveMaximum: 6,
			reserveCurrent: 6
		},
		maintenance: {
			capacity: 12,
			used: 6
		},
		work: {
			capacity: 8,
			used: 4
		},
		space: {
			capacity: 30,
			used: 14
		}
	});
});

test("l'état Corcite initial est valide", () => {
	const corcite = createHumanCorcite();

	assert.deepEqual(
		validateCorciteState(corcite),
		{
			valid: true,
			errors: []
		}
	);
});

test("un snapshot est indépendant de l'état original", () => {
	const corcite = createHumanCorcite();
	const snapshot = snapshotCorciteState(corcite);

	snapshot.storageUnits[0].contents.R1 = 0;

	assert.equal(
		corcite.storageUnits[0].contents.R1,
		4
	);
});

test("les cinq Corcites d'une session ont des états indépendants", () => {
	const state = createInitialState(
		structuredClone(REFERENCE_SESSION_CONFIGURATION),
		{
			runId: 'P1-INDEPENDENCE'
		}
	);

	state.corcites[0].storageUnits[0].contents.R1 = 0;

	for (const corcite of state.corcites.slice(1)) {
		assert.equal(
			summarizeStoredResources(corcite).R1,
			4
		);
	}
});

test('un stockage surchargé est rejeté', () => {
	const corcite = createHumanCorcite();

	corcite.storageUnits[0].contents.R1 = 100;

	const validation = validateCorciteState(corcite);

	assert.equal(validation.valid, false);
	assert.ok(
		validation.errors.some((error) =>
			error.includes('dépasse sa capacité')
		)
	);
});

test('une réservation supérieure au stock local est rejetée', () => {
	const corcite = createHumanCorcite();

	corcite.reservations.push({
		id: 'reservation-test',
		operationId: 'operation-test',
		storageUnitId: 'storage-2',
		resourceId: 'R4',
		amount: 2,
		purpose: 'test',
		status: 'active'
	});

	const validation = validateCorciteState(corcite);

	assert.equal(validation.valid, false);
	assert.ok(
		validation.errors.some((error) =>
			error.includes(
				'Réservations R4 supérieures au stock'
			)
		)
	);
});

test('une réservation active réduit la quantité disponible', () => {
	const corcite = createHumanCorcite();

	corcite.reservations.push({
		id: 'reservation-test',
		operationId: 'operation-test',
		storageUnitId: 'storage-2',
		resourceId: 'R4',
		amount: 1,
		purpose: 'construction-test',
		status: 'active'
	});

	assert.equal(
		getAvailableAmount(corcite, 'R4'),
		0
	);

	assert.equal(
		validateCorciteState(corcite).valid,
		true
	);
});

test("un état Corcite sérialisé puis relu reste identique", async () => {
	const {
		serializeCorciteState,
		deserializeCorciteState
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createHumanCorcite();

	const restored = deserializeCorciteState(
		serializeCorciteState(corcite)
	);

	assert.deepEqual(restored, corcite);
});

test("un état Corcite restauré est indépendant de l'original", async () => {
	const {
		serializeCorciteState,
		deserializeCorciteState
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createHumanCorcite();

	const restored = deserializeCorciteState(
		serializeCorciteState(corcite)
	);

	restored.storageUnits[0].contents.R1 = 1;

	assert.equal(
		corcite.storageUnits[0].contents.R1,
		4
	);
});

test("un JSON Corcite syntaxiquement invalide est rejeté", async () => {
	const { deserializeCorciteState } = await import(
		'../../src/lib/proto0/index.js'
	);

	assert.throws(
		() => deserializeCorciteState('{ mauvais json'),
		/JSON invalide/
	);
});

test("un JSON Corcite structurellement incomplet est rejeté", async () => {
	const { deserializeCorciteState } = await import(
		'../../src/lib/proto0/index.js'
	);

	assert.throws(
		() =>
			deserializeCorciteState(
				JSON.stringify({
					id: 'corcite-incomplet',
					name: 'INCOMPLET'
				})
			),
		/structure JSON incompatible/
	);
});

test("un état Corcite structurellement valide mais impossible est rejeté au chargement", async () => {
	const {
		serializeCorciteState,
		deserializeCorciteState
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createHumanCorcite();

	const raw = JSON.parse(
		serializeCorciteState(corcite)
	) as {
		storageUnits: Array<{
			contents: {
				R1: number;
			};
		}>;
	};

	raw.storageUnits[0].contents.R1 = 100;

	assert.throws(
		() =>
			deserializeCorciteState(
				JSON.stringify(raw)
			),
		/Etat Corcite invalide/
	);
});
