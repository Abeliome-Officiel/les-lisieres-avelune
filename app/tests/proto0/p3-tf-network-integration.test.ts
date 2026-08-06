import assert from 'node:assert/strict';
import test from 'node:test';

import {
	connectTfStructures,
	createReferenceCorciteState,
	resolveExtractionTurn,
	resolveTfCoreTurn,
	resolveTransformationTurn,
	summarizeStoredResources
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-network-integration',
		name: 'P3-NETWORK-INTEGRATION',
		controller: 'human'
	});
}

function clearResource(
	corcite: ReturnType<
		typeof createCorcite
	>,
	resourceId:
		| 'R1'
		| 'R2'
		| 'R3'
		| 'R4'
): void {
	for (
		const storage of
		corcite.storageUnits
	) {
		storage.contents[
			resourceId
		] = 0;
	}
}

test("une sortie connectée va au tampon avant le stockage général", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'integration-r1',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

	const result =
		resolveExtractionTurn(
			corcite
		);

	assert.equal(
		summarizeStoredResources(
			result.corcite
		).R1,
		4
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		2
	);

	const event =
		result.resolution.events.find(
			(candidate) =>
				candidate.resourceId ===
					'R1'
		);

	assert.equal(
		event?.networkMovements
			?.[0].amount,
		2
	);
});

test("seul le reliquat qui ne tient pas dans le tampon rejoint le stockage général", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'integration-reliquat',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

	corcite.tfNetwork
		.buffers[0].amount = 1;

	const result =
		resolveExtractionTurn(
			corcite
		);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		2
	);

	assert.equal(
		summarizeStoredResources(
			result.corcite
		).R1,
		5
	);
});

test("un stockage général saturé n'empêche pas une sortie entièrement absorbée par un tampon", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'integration-stock-plein',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

	corcite.storageUnits[0]
		.contents = {
			R1: 12,
			R2: 0,
			R3: 0,
			R4: 0
		};

	corcite.storageUnits[1]
		.contents = {
			R1: 0,
			R2: 12,
			R3: 0,
			R4: 0
		};

	const result =
		resolveExtractionTurn(
			corcite
		);

	const eventA =
		result.resolution.events.find(
			(event) =>
				event.sourceId ===
					'source-a'
		);

	const eventB =
		result.resolution.events.find(
			(event) =>
				event.sourceId ===
					'source-b'
		);

	assert.equal(
		eventA?.status,
		'produced'
	);

	assert.equal(
		eventB?.status,
		'storage-blocked'
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		2
	);
});

test("la sortie R3 d'un transformateur connecté va dans le tampon du fabricateur", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'integration-r3',
				fromStructureId:
					'structure-transformer-1',
				toStructureId:
					'structure-fabricator-1',
				resourceId: 'R3',
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.equal(
		summarizeStoredResources(
			result.corcite
		).R3,
		4
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		2
	);
});

test("les sorties routées au tour N ne sont toujours pas consommées par l'unité aval au tour N", () => {
	let corcite =
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

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'n-plus-1-r1',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'n-plus-1-r2',
				fromStructureId:
					'structure-extractor-b-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R2',
				routing: {
					mode: 'priority',
					priority: 1
				}
			}
		);

	const result =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		result.transformation
			.events[0].status,
		'input-blocked'
	);

	const r1Buffer =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.resourceId ===
						'R1'
			);

	const r2Buffer =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.resourceId ===
						'R2'
			);

	assert.equal(
		r1Buffer?.amount,
		2
	);

	assert.equal(
		r2Buffer?.amount,
		2
	);

	assert.equal(
		summarizeStoredResources(
			result.corcite
		).R1,
		0
	);

	assert.equal(
		summarizeStoredResources(
			result.corcite
		).R2,
		0
	);
});
