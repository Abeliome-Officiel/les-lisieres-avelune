import assert from 'node:assert/strict';
import test from 'node:test';

import {
	connectTfStructures,
	createReferenceCorciteState,
	resolveFabricationTurn,
	resolveTfCoreTurn,
	resolveTransformationTurn,
	summarizeStoredResources
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-buffer-input',
		name: 'P3-BUFFER-INPUT',
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

function connectInputsToTransformer(
	input: ReturnType<
		typeof createCorcite
	>
) {
	let corcite = input;

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'buffer-r1',
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
				id: 'buffer-r2',
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

	return corcite;
}

test("le transformateur consomme ses tampons entrants avant le stockage général", () => {
	let corcite =
		connectInputsToTransformer(
			createCorcite()
		);

	for (
		const buffer of
		corcite.tfNetwork.buffers
	) {
		buffer.amount = 2;
	}

	const result =
		resolveTransformationTurn(
			corcite
		);

	const stocks =
		summarizeStoredResources(
			result.corcite
		);

	assert.equal(
		stocks.R1,
		4
	);

	assert.equal(
		stocks.R2,
		4
	);

	assert.equal(
		stocks.R3,
		6
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers.every(
				(buffer) =>
					buffer.amount === 0
			),
		true
	);

	assert.equal(
		result.resolution.events[0]
			.bufferConsumptions
			?.reduce(
				(total, movement) =>
					total +
					movement.amount,
				0
			),
		4
	);

	assert.equal(
		result.resolution.events[0]
			.consumptions.length,
		0
	);
});

test("un tampon partiel est consommé avant de compléter dans le stockage général", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'buffer-r1-partiel',
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
		resolveTransformationTurn(
			corcite
		);

	const stocks =
		summarizeStoredResources(
			result.corcite
		);

	assert.equal(
		stocks.R1,
		3
	);

	assert.equal(
		stocks.R2,
		2
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		0
	);

	assert.equal(
		result.resolution.events[0]
			.bufferConsumptions
			?.[0].amount,
		1
	);

	assert.equal(
		result.resolution.events[0]
			.consumptions
			.filter(
				(movement) =>
					movement.resourceId ===
						'R1'
			)
			.reduce(
				(total, movement) =>
					total +
					movement.amount,
				0
			),
		1
	);
});

test("des ressources réservées en stockage n'empêchent pas l'utilisation de tampons complets", () => {
	let corcite =
		connectInputsToTransformer(
			createCorcite()
		);

	for (
		const buffer of
		corcite.tfNetwork.buffers
	) {
		buffer.amount = 2;
	}

	corcite.reservations.push(
		{
			id: 'reserve-all-r1',
			operationId: 'construction-a',
			storageUnitId:
				'storage-1',
			resourceId: 'R1',
			amount: 4,
			purpose: 'test',
			status: 'active'
		},
		{
			id: 'reserve-r2-a',
			operationId: 'construction-b',
			storageUnitId:
				'storage-1',
			resourceId: 'R2',
			amount: 2,
			purpose: 'test',
			status: 'active'
		},
		{
			id: 'reserve-r2-b',
			operationId: 'construction-c',
			storageUnitId:
				'storage-2',
			resourceId: 'R2',
			amount: 2,
			purpose: 'test',
			status: 'active'
		}
	);

	const result =
		resolveTransformationTurn(
			corcite
		);

	assert.equal(
		result.resolution.events[0]
			.status,
		'produced'
	);

	assert.equal(
		result.resolution.events[0]
			.consumptions.length,
		0
	);
});

test("le fabricateur consomme son tampon R3 avant le stockage général", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'buffer-r3',
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

	corcite.tfNetwork
		.buffers[0].amount = 2;

	const result =
		resolveFabricationTurn(
			corcite
		);

	const stocks =
		summarizeStoredResources(
			result.corcite
		);

	assert.equal(
		stocks.R3,
		4
	);

	assert.equal(
		stocks.R4,
		2
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		0
	);

	assert.equal(
		result.resolution.events[0]
			.bufferConsumptions
			?.[0].amount,
		2
	);
});

test("les tampons remplis au tour N deviennent consommables au tour N+1", () => {
	let corcite =
		connectInputsToTransformer(
			createCorcite()
		);

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

	const turnOne =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		turnOne.transformation
			.events[0].status,
		'input-blocked'
	);

	assert.equal(
		turnOne.corcite.tfNetwork
			.buffers.every(
				(buffer) =>
					buffer.amount === 2
			),
		true
	);

	const turnTwo =
		resolveTfCoreTurn(
			turnOne.corcite
		);

	assert.equal(
		turnTwo.transformation
			.events[0].status,
		'produced'
	);

	assert.equal(
		turnTwo.transformation
			.events[0]
			.bufferConsumptions
			?.reduce(
				(total, movement) =>
					total +
					movement.amount,
				0
			),
		4
	);

	assert.equal(
		turnTwo.corcite.tfNetwork
			.buffers.every(
				(buffer) =>
					buffer.amount === 0
			),
		true
	);
});

test("un ajout au tampon pendant le tour N ne dépasse jamais son budget de début de tour", () => {
	let corcite =
		connectInputsToTransformer(
			createCorcite()
		);

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

	const r1Buffer =
		corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.resourceId ===
						'R1'
			);

	const r2Buffer =
		corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.resourceId ===
						'R2'
			);

	assert.ok(r1Buffer);
	assert.ok(r2Buffer);

	r1Buffer.amount = 1;
	r2Buffer.amount = 2;

	const result =
		resolveTfCoreTurn(
			corcite
		);

	/*
	 * Extraction ajoute 1 R1 au tampon, qui passe donc physiquement
	 * à 2. Mais seul le R1 déjà présent au début du tour est éligible.
	 * Le reliquat extrait va en stockage, lui-même verrouillé pour N.
	 */
	assert.equal(
		result.transformation
			.events[0].status,
		'input-blocked'
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.resourceId ===
						'R1'
			)?.amount,
		2
	);
});

test("un R3 transformé au tour N n'est consommé par le fabricateur qu'au tour N+1", () => {
	let corcite =
		createCorcite();

	clearResource(
		corcite,
		'R3'
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'transform-vers-fabricateur-n1',
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

	const turnOne =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		turnOne.transformation
			.events[0].status,
		'produced'
	);

	assert.equal(
		turnOne.fabrication
			.events[0].status,
		'input-blocked'
	);

	assert.equal(
		turnOne.corcite.tfNetwork
			.buffers[0].amount,
		2
	);

	const turnTwo =
		resolveTfCoreTurn(
			turnOne.corcite
		);

	assert.equal(
		turnTwo.fabrication
			.events[0].status,
		'produced'
	);

	assert.equal(
		turnTwo.fabrication
			.events[0]
			.bufferConsumptions
			?.[0].amount,
		2
	);
});
