import assert from 'node:assert/strict';
import test from 'node:test';

import {
	connectTfStructures,
	createReferenceCorciteState,
	routeTfOutputToNetwork
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-routing',
		name: 'P3-ROUTING',
		controller: 'human'
	});
}

function addSecondTransformer(
	corcite: ReturnType<
		typeof createCorcite
	>
): void {
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
}

test("sans connexion, toute la sortie reste non routée", () => {
	const corcite =
		createCorcite();

	const result =
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			2
		);

	assert.equal(
		result.resolution.routedAmount,
		0
	);

	assert.equal(
		result.resolution.unroutedAmount,
		2
	);

	assert.deepEqual(
		result.corcite.tfNetwork,
		corcite.tfNetwork
	);
});

test("une connexion simple remplit son tampon automatique", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'route-simple',
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
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			2
		);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		2
	);

	assert.equal(
		result.resolution.routedAmount,
		2
	);

	assert.equal(
		result.resolution.unroutedAmount,
		0
	);

	assert.equal(
		corcite.tfNetwork
			.buffers[0].amount,
		0
	);
});

test("un tampon déjà plein laisse le surplus non routé", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'route-pleine',
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
		.buffers[0].amount = 2;

	const result =
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			2
		);

	assert.equal(
		result.resolution.routedAmount,
		0
	);

	assert.equal(
		result.resolution.unroutedAmount,
		2
	);

	assert.equal(
		result.corcite.tfNetwork
			.buffers[0].amount,
		2
	);
});

test("le reliquat déjà présent dans un tampon est conservé entre deux routages", () => {
	let corcite =
		createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'route-reliquat',
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

	const first =
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			1
		);

	const second =
		routeTfOutputToNetwork(
			first.corcite,
			'structure-extractor-a-1',
			'R1',
			1
		);

	assert.equal(
		second.corcite.tfNetwork
			.buffers[0].amount,
		2
	);

	assert.equal(
		second.resolution.routedAmount,
		1
	);
});

test("une bifurcation prioritaire remplit la branche la plus prioritaire d'abord", () => {
	let corcite =
		createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'prio-haute',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 10
				}
			}
		);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'prio-basse',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-2',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 5
				}
			}
		);

	const result =
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			3
		);

	const high =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.connectionId ===
						'prio-haute'
			);

	const low =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.connectionId ===
						'prio-basse'
			);

	assert.equal(
		high?.amount,
		2
	);

	assert.equal(
		low?.amount,
		1
	);
});

test("une bifurcation pondérée répartit proportionnellement la sortie", () => {
	let corcite =
		createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'poids-3',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'weighted',
					weight: 3
				}
			}
		);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'poids-1',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-2',
				resourceId: 'R1',
				routing: {
					mode: 'weighted',
					weight: 1
				}
			}
		);

	const result =
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			2
		);

	const weight3 =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.connectionId ===
						'poids-3'
			);

	const weight1 =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.connectionId ===
						'poids-1'
			);

	assert.equal(
		weight3?.amount,
		1.5
	);

	assert.equal(
		weight1?.amount,
		0.5
	);
});

test("la répartition pondérée redistribue le surplus d'une branche saturée", () => {
	let corcite =
		createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'saturee-a',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'weighted',
					weight: 1
				}
			}
		);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'saturee-b',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-2',
				resourceId: 'R1',
				routing: {
					mode: 'weighted',
					weight: 1
				}
			}
		);

	const first =
		corcite.tfNetwork.buffers.find(
			(buffer) =>
				buffer.connectionId ===
					'saturee-a'
		);

	assert.ok(first);

	first.amount = 1.5;

	const result =
		routeTfOutputToNetwork(
			corcite,
			'structure-extractor-a-1',
			'R1',
			2
		);

	const bufferA =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.connectionId ===
						'saturee-a'
			);

	const bufferB =
		result.corcite.tfNetwork
			.buffers.find(
				(buffer) =>
					buffer.connectionId ===
						'saturee-b'
			);

	assert.equal(
		bufferA?.amount,
		2
	);

	assert.equal(
		bufferB?.amount,
		1.5
	);

	assert.equal(
		result.resolution.unroutedAmount,
		0
	);
});

test("l'ordre physique des connexions et tampons ne change pas le routage", () => {
	let corciteA =
		createCorcite();

	addSecondTransformer(
		corciteA
	);

	corciteA =
		connectTfStructures(
			corciteA,
			{
				id: 'stable-a',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'weighted',
					weight: 3
				}
			}
		);

	corciteA =
		connectTfStructures(
			corciteA,
			{
				id: 'stable-b',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-2',
				resourceId: 'R1',
				routing: {
					mode: 'weighted',
					weight: 1
				}
			}
		);

	const corciteB =
		structuredClone(corciteA);

	corciteB.tfNetwork
		.connections.reverse();

	corciteB.tfNetwork
		.buffers.reverse();

	const resultA =
		routeTfOutputToNetwork(
			corciteA,
			'structure-extractor-a-1',
			'R1',
			2
		);

	const resultB =
		routeTfOutputToNetwork(
			corciteB,
			'structure-extractor-a-1',
			'R1',
			2
		);

	const bufferAmounts = (
		state:
			typeof resultA.corcite
	) =>
		[...state.tfNetwork.buffers]
			.sort(
				(a, b) =>
					a.id.localeCompare(b.id)
			)
			.map(
				(buffer) => ({
					id: buffer.id,
					amount: buffer.amount
				})
			);

	assert.deepEqual(
		bufferAmounts(
			resultA.corcite
		),
		bufferAmounts(
			resultB.corcite
		)
	);

	assert.deepEqual(
		resultA.resolution,
		resultB.resolution
	);
});
