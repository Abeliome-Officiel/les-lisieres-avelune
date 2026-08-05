import assert from 'node:assert/strict';
import test from 'node:test';

import {
	TF_EXTRACTION_LAB_REFERENCE,
	createReferenceCorciteState,
	resolveExtractionTurn,
	summarizeStoredResources,
	type TfExtractionConfiguration
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3',
		name: 'P3',
		controller: 'human'
	});
}

test("les deux extracteurs actifs produisent R1 et R2", () => {
	const corcite = createCorcite();

	const result =
		resolveExtractionTurn(corcite);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 6,
			R2: 6,
			R3: 4,
			R4: 1
		}
	);

	assert.deepEqual(
		result.resolution.events.map(
			(event) => event.producedOutput
		),
		[2, 2]
	);
});

test("les sources non épuisables peuvent produire plusieurs tours", () => {
	let corcite = createCorcite();

	corcite =
		resolveExtractionTurn(
			corcite
		).corcite;

	corcite =
		resolveExtractionTurn(
			corcite
		).corcite;

	assert.deepEqual(
		summarizeStoredResources(corcite),
		{
			R1: 8,
			R2: 8,
			R3: 4,
			R4: 1
		}
	);
});

test("un extracteur inactif ne produit rien", () => {
	const corcite = createCorcite();

	const extractorA =
		corcite.structures.find(
			(structure) =>
				structure.kind ===
				'extractor-a-n1'
		);

	assert.ok(extractorA);

	extractorA.status = 'inactive';

	const result =
		resolveExtractionTurn(corcite);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 4,
			R2: 6,
			R3: 4,
			R4: 1
		}
	);

	assert.equal(
		result.resolution.events.find(
			(event) =>
				event.sourceId === 'source-a'
		)?.status,
		'inactive'
	);
});

test("la production est limitée par le potentiel de la source", () => {
	const corcite = createCorcite();

	const config:
		TfExtractionConfiguration = {
			sources: [
				{
					id: 'source-a',
					resourceId: 'R1',
					potentialPerTurn: 1,
					nonDepleting: true
				},
				{
					id: 'source-b',
					resourceId: 'R2',
					potentialPerTurn: 3,
					nonDepleting: true
				}
			],
			rules:
				TF_EXTRACTION_LAB_REFERENCE.rules
		};

	const result =
		resolveExtractionTurn(
			corcite,
			config
		);

	assert.equal(
		summarizeStoredResources(
			result.corcite
		).R1,
		5
	);
});

test("un stockage totalement saturé bloque l'extraction", () => {
	const corcite = createCorcite();

	corcite.storageUnits[0].contents = {
		R1: 12,
		R2: 0,
		R3: 0,
		R4: 0
	};

	corcite.storageUnits[1].contents = {
		R1: 0,
		R2: 12,
		R3: 0,
		R4: 0
	};

	const result =
		resolveExtractionTurn(corcite);

	assert.equal(
		result.resolution.events.every(
			(event) =>
				event.status ===
				'storage-blocked'
		),
		true
	);

	assert.deepEqual(
		summarizeStoredResources(
			result.corcite
		),
		{
			R1: 12,
			R2: 12,
			R3: 0,
			R4: 0
		}
	);
});

test("une capacité libre insuffisante ne provoque pas de production partielle", () => {
	const corcite = createCorcite();

	corcite.storageUnits[0].contents = {
		R1: 12,
		R2: 0,
		R3: 0,
		R4: 0
	};

	corcite.storageUnits[1].contents = {
		R1: 0,
		R2: 10,
		R3: 0,
		R4: 1
	};

	const result =
		resolveExtractionTurn(corcite);

	assert.equal(
		result.resolution.events[0].status,
		'storage-blocked'
	);

	assert.equal(
		result.resolution.events[0]
			.producedOutput,
		0
	);
});

test("l'ordre physique des stockages ne change pas le résultat d'extraction", () => {
	const corciteA = createCorcite();
	const corciteB =
		structuredClone(corciteA);

	corciteB.storageUnits.reverse();

	const resultA =
		resolveExtractionTurn(corciteA);

	const resultB =
		resolveExtractionTurn(corciteB);

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
