import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createReferenceCorciteState,
	resolveTransformationTurn,
	summarizeStoredResources
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-transform',
		name: 'P3-TRANSFORM',
		controller: 'human'
	});
}

test("le transformateur consomme 2 R1 + 2 R2 et produit 2 R3", () => {
	const corcite = createCorcite();

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 2,
			R2: 2,
			R3: 6,
			R4: 1
		}
	);

	assert.equal(
		result.resolution.events[0]
			.status,
		'produced'
	);
});

test("une transformation ne crée jamais ses intrants gratuitement", () => {
	let corcite = createCorcite();

	corcite =
		resolveTransformationTurn(
			corcite
		).corcite;

	corcite =
		resolveTransformationTurn(
			corcite
		).corcite;

	const third =
		resolveTransformationTurn(
			corcite
		);

	assert.deepEqual(
		summarizeStoredResources(
			corcite
		),
		{
			R1: 0,
			R2: 0,
			R3: 8,
			R4: 1
		}
	);

	assert.equal(
		third.resolution.events[0]
			.status,
		'input-blocked'
	);

	assert.deepEqual(
		third.corcite,
		corcite
	);
});

test("un intrant insuffisant bloque toute la transformation", () => {
	const corcite = createCorcite();

	for (const storage of corcite.storageUnits) {
		storage.contents.R2 = 0;
	}

	corcite.storageUnits[0]
		.contents.R2 = 1;

	const before =
		structuredClone(corcite);

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.equal(
		result.resolution.events[0]
			.status,
		'input-blocked'
	);

	assert.deepEqual(
		result.corcite,
		before
	);
});

test("les ressources réservées ne peuvent pas être consommées par le transformateur", () => {
	const corcite = createCorcite();

	corcite.reservations.push({
		id: 'reserve-r1',
		operationId:
			'construction-prioritaire',
		storageUnitId: 'storage-1',
		resourceId: 'R1',
		amount: 3,
		purpose:
			'construction prioritaire',
		status: 'active'
	});

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.equal(
		result.resolution.events[0]
			.status,
		'input-blocked'
	);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		summarizeStoredResources(
			corcite
		)
	);
});

test("un transformateur inactif ne consomme et ne produit rien", () => {
	const corcite = createCorcite();

	const transformer =
		corcite.structures.find(
			(structure) =>
				structure.kind ===
					'transformer-n1'
		);

	assert.ok(transformer);

	transformer.status = 'inactive';

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.equal(
		result.resolution.events[0]
			.status,
		'inactive'
	);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		summarizeStoredResources(
			corcite
		)
	);
});

test("l'ordre physique des stockages ne modifie pas le résultat logique", () => {
	const corciteA = createCorcite();
	const corciteB =
		structuredClone(corciteA);

	corciteB.storageUnits.reverse();

	const resultA =
		resolveTransformationTurn(
			corciteA
		);

	const resultB =
		resolveTransformationTurn(
			corciteB
		);

	assert.deepEqual(
		summarizeStoredResources(
			resultA.corcite
		),
		summarizeStoredResources(
			resultB.corcite
		)
	);

	assert.deepEqual(
		resultA.resolution,
		resultB.resolution
	);
});

test("deux transformateurs sont tous servis lorsque les intrants suffisent", () => {
	const corcite = createCorcite();

	const original =
		corcite.structures.find(
			(structure) =>
				structure.kind ===
					'transformer-n1'
		);

	assert.ok(original);

	const second =
		structuredClone(original);

	second.id =
		'structure-transformer-2';
	second.name =
		'Transformateur N1 — 2';

	corcite.structures.push(second);

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 0,
			R2: 0,
			R3: 8,
			R4: 1
		}
	);

	assert.equal(
		result.resolution.events.filter(
			(event) =>
				event.status === 'produced'
		).length,
		2
	);
});

test("des transformateurs concurrents ne sont pas départagés par l'ordre du code", () => {
	const corcite = createCorcite();

	const original =
		corcite.structures.find(
			(structure) =>
				structure.kind ===
					'transformer-n1'
		);

	assert.ok(original);

	const second =
		structuredClone(original);

	second.id =
		'structure-transformer-2';

	corcite.structures.push(second);

	/*
	 * Seulement assez d'intrants pour une transformation.
	 * Le moteur ne doit pas choisir arbitrairement le premier.
	 */
	for (const storage of corcite.storageUnits) {
		storage.contents.R1 = 0;
		storage.contents.R2 = 0;
	}

	corcite.storageUnits[0]
		.contents.R1 = 2;
	corcite.storageUnits[0]
		.contents.R2 = 2;

	const before =
		summarizeStoredResources(
			corcite
		);

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.equal(
		result.resolution.events.every(
			(event) =>
				event.status ===
					'input-conflict'
		),
		true
	);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		before
	);
});
