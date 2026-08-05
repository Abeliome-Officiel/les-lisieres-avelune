import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createReferenceCorciteState,
	resolveFabricationTurn,
	resolveTfCoreTurn,
	summarizeStoredResources
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-fabrication',
		name: 'P3-FABRICATION',
		controller: 'human'
	});
}

function clearResource(
	corcite: ReturnType<
		typeof createCorcite
	>,
	resourceId: 'R1' | 'R2' | 'R3' | 'R4'
): void {
	for (const storage of corcite.storageUnits) {
		storage.contents[resourceId] = 0;
	}
}

test("le fabricateur consomme 2 R3 et produit 1 R4", () => {
	const corcite = createCorcite();

	const result =
		resolveFabricationTurn(
			corcite
		);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 4,
			R2: 4,
			R3: 2,
			R4: 2
		}
	);

	assert.equal(
		result.resolution.events[0]
			.status,
		'produced'
	);
});

test("un manque de R3 bloque la fabrication sans consommation partielle", () => {
	const corcite = createCorcite();

	clearResource(
		corcite,
		'R3'
	);

	corcite.storageUnits[0]
		.contents.R3 = 1;

	const before =
		structuredClone(corcite);

	const result =
		resolveFabricationTurn(
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

test("du R3 réservé n'est pas consommable par le fabricateur", () => {
	const corcite = createCorcite();

	corcite.reservations.push({
		id: 'reserve-r3-fabrication',
		operationId:
			'construction-td',
		storageUnitId:
			'storage-1',
		resourceId: 'R3',
		amount: 2,
		purpose:
			'construction TD',
		status: 'active'
	});

	corcite.reservations.push({
		id: 'reserve-r3-fabrication-2',
		operationId:
			'construction-td',
		storageUnitId:
			'storage-2',
		resourceId: 'R3',
		amount: 1,
		purpose:
			'construction TD',
		status: 'active'
	});

	const result =
		resolveFabricationTurn(
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

test("un fabricateur inactif ne consomme ni ne produit", () => {
	const corcite = createCorcite();

	const fabricator =
		corcite.structures.find(
			(structure) =>
				structure.kind ===
					'fabricator-n1'
		);

	assert.ok(fabricator);

	fabricator.status =
		'inactive';

	const result =
		resolveFabricationTurn(
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

test("une extraction du tour N ne peut pas alimenter la transformation du tour N", () => {
	const corcite =
		createCorcite();

	clearResource(
		corcite,
		'R1'
	);

	clearResource(
		corcite,
		'R2'
	);

	clearResource(
		corcite,
		'R3'
	);

	const result =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		result.extraction.events.every(
			(event) =>
				event.status === 'produced'
		),
		true
	);

	assert.equal(
		result.transformation.events[0]
			.status,
		'input-blocked'
	);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 2,
			R2: 2,
			R3: 0,
			R4: 1
		}
	);
});

test("du R3 transformé au tour N ne peut pas alimenter le fabricateur au tour N", () => {
	const corcite =
		createCorcite();

	clearResource(
		corcite,
		'R3'
	);

	const result =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		result.transformation.events[0]
			.status,
		'produced'
	);

	assert.equal(
		result.fabrication.events[0]
			.status,
		'input-blocked'
	);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 4,
			R2: 4,
			R3: 2,
			R4: 1
		}
	);
});

test("une sortie du tour précédent devient utilisable au tour suivant", () => {
	let corcite =
		createCorcite();

	clearResource(
		corcite,
		'R3'
	);

	const turnOne =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		turnOne.fabrication.events[0]
			.status,
		'input-blocked'
	);

	const turnTwo =
		resolveTfCoreTurn(
			turnOne.corcite
		);

	assert.equal(
		turnTwo.fabrication.events[0]
			.status,
		'produced'
	);

	assert.equal(
		summarizeStoredResources(
			turnTwo.corcite
		).R4,
		2
	);
});

test("les verrous de sortie TF sont strictement temporaires", () => {
	const corcite =
		createCorcite();

	const result =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		result.corcite.reservations.some(
			(reservation) =>
				reservation.id.startsWith(
					'__proto0-tf-output-lock__'
				)
		),
		false
	);
});
