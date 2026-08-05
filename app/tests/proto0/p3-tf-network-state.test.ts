import assert from 'node:assert/strict';
import test from 'node:test';

import {
	connectTfStructures,
	createReferenceCorciteState,
	deserializeCorciteState,
	serializeCorciteState,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-network',
		name: 'P3-NETWORK',
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

test("l'état Corcite de référence contient un réseau TF vide", () => {
	const corcite = createCorcite();

	assert.deepEqual(
		corcite.tfNetwork,
		{
			connections: [],
			buffers: []
		}
	);

	assert.equal(
		validateCorciteState(
			corcite
		).valid,
		true
	);
});

test("une connexion extracteur vers transformateur crée automatiquement un tampon d'un lot aval", () => {
	const corcite = createCorcite();

	const connected =
		connectTfStructures(
			corcite,
			{
				id: 'a-vers-transform',
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

	assert.equal(
		connected.tfNetwork
			.connections.length,
		1
	);

	assert.deepEqual(
		connected.tfNetwork.buffers[0],
		{
			id:
				'buffer:a-vers-transform',
			connectionId:
				'a-vers-transform',
			resourceId: 'R1',
			capacity: 2,
			amount: 0
		}
	);

	assert.deepEqual(
		corcite.tfNetwork,
		{
			connections: [],
			buffers: []
		}
	);
});

test("une connexion transformateur vers fabricateur reçoit un tampon R3 de capacité 2", () => {
	const corcite = createCorcite();

	const connected =
		connectTfStructures(
			corcite,
			{
				id: 'transform-vers-fabrication',
				fromStructureId:
					'structure-transformer-1',
				toStructureId:
					'structure-fabricator-1',
				resourceId: 'R3',
				routing: {
					mode: 'priority',
					priority: 10
				}
			}
		);

	assert.equal(
		connected.tfNetwork
			.buffers[0].capacity,
		2
	);
});

test("le réseau TF survit à la sérialisation et au rechargement", () => {
	let corcite = createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'persist-r1',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 3
				}
			}
		);

	corcite.tfNetwork
		.buffers[0].amount = 1;

	const restored =
		deserializeCorciteState(
			serializeCorciteState(
				corcite
			)
		);

	assert.deepEqual(
		restored,
		corcite
	);
});

test("un tampon ne peut pas dépasser sa capacité", () => {
	let corcite = createCorcite();

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'overflow-test',
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
		.buffers[0].amount = 3;

	const validation =
		validateCorciteState(
			corcite
		);

	assert.equal(
		validation.valid,
		false
	);

	assert.ok(
		validation.errors.some(
			(error) =>
				error.includes(
					'contenu 3'
				)
		)
	);
});

test("une connexion vers une structure inconnue est rejetée", () => {
	const corcite = createCorcite();

	assert.throws(
		() =>
			connectTfStructures(
				corcite,
				{
					id: 'destination-absente',
					fromStructureId:
						'structure-extractor-a-1',
					toStructureId:
						'structure-inconnue',
					resourceId: 'R1',
					routing: {
						mode: 'priority',
						priority: 1
					}
				}
			),
		/Structure destination inconnue/
	);
});

test("une connexion avec une ressource incompatible est rejetée", () => {
	const corcite = createCorcite();

	assert.throws(
		() =>
			connectTfStructures(
				corcite,
				{
					id: 'mauvaise-ressource',
					fromStructureId:
						'structure-extractor-a-1',
					toStructureId:
						'structure-transformer-1',
					resourceId: 'R2',
					routing: {
						mode: 'priority',
						priority: 1
					}
				}
			),
		/Réseau TF invalide/
	);
});

test("une bifurcation par priorités explicites est valide", () => {
	let corcite = createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'branche-prio-a',
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
				id: 'branche-prio-b',
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

	assert.equal(
		validateCorciteState(
			corcite
		).valid,
		true
	);
});

test("une bifurcation par répartition pondérée est valide", () => {
	let corcite = createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'branche-poids-a',
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
				id: 'branche-poids-b',
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

	assert.equal(
		validateCorciteState(
			corcite
		).valid,
		true
	);
});

test("une même bifurcation ne mélange pas priorité et répartition pondérée", () => {
	let corcite = createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'mixte-a',
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

	assert.throws(
		() =>
			connectTfStructures(
				corcite,
				{
					id: 'mixte-b',
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
			),
		/ne peuvent pas être mélangés/
	);
});

test("deux branches prioritaires ne peuvent pas avoir exactement la même priorité", () => {
	let corcite = createCorcite();

	addSecondTransformer(
		corcite
	);

	corcite =
		connectTfStructures(
			corcite,
			{
				id: 'egalite-a',
				fromStructureId:
					'structure-extractor-a-1',
				toStructureId:
					'structure-transformer-1',
				resourceId: 'R1',
				routing: {
					mode: 'priority',
					priority: 7
				}
			}
		);

	assert.throws(
		() =>
			connectTfStructures(
				corcite,
				{
					id: 'egalite-b',
					fromStructureId:
						'structure-extractor-a-1',
					toStructureId:
						'structure-transformer-2',
					resourceId: 'R1',
					routing: {
						mode: 'priority',
						priority: 7
					}
				}
			),
		/priorités doivent être uniques/
	);
});
