import assert from 'node:assert/strict';
import test from 'node:test';

import {
	PLAYABLE_START_REFERENCE,
	TF_LAB_REFERENCE,
	calculatePopulationWorkCapacity,
	createPlayableCorciteState,
	createReferenceCorciteState,
	deserializeCorciteState,
	serializeCorciteState,
	summarizeStoredResources,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createPlayable() {
	return createPlayableCorciteState({
		id: 'corcite-playable-start',
		name: 'DEPART',
		controller: 'human'
	});
}

test(
	'le Corcite jouable démarre avec uniquement son noyau et son stockage',
	() => {
		const corcite = createPlayable();

		assert.deepEqual(
			corcite.structures.map(
				(structure) => structure.kind
			),
			[
				'corcite-core-n1',
				'storage-n1'
			]
		);

		assert.equal(
			corcite.structures.some(
				(structure) =>
					structure.kind ===
						'extractor-a-n1' ||
					structure.kind ===
						'extractor-b-n1' ||
					structure.kind ===
						'transformer-n1' ||
					structure.kind ===
						'fabricator-n1'
			),
			false
		);
	}
);

test(
	'le Corcite jouable possède un seul stockage de base',
	() => {
		const corcite = createPlayable();

		assert.equal(
			corcite.storageUnits.length,
			1
		);

		assert.equal(
			corcite.storageUnits[0].name,
			'Stockage de base'
		);

		assert.equal(
			corcite.storageUnits[0].capacity,
			PLAYABLE_START_REFERENCE
				.baseStorageCapacity
		);
	}
);

test(
	'les ressources initiales correspondent au socle jouable',
	() => {
		const corcite = createPlayable();

		assert.deepEqual(
			summarizeStoredResources(corcite),
			PLAYABLE_START_REFERENCE.initialStocks
		);
	}
);

test(
	'la capacité de travail dérive de la population',
	() => {
		const corcite = createPlayable();

		assert.deepEqual(
			corcite.population,
			{
				total: 4,
				workPerPopulation: 1
			}
		);

		assert.equal(
			calculatePopulationWorkCapacity(
				corcite.population
			),
			4
		);

		assert.equal(
			corcite.capacities.work.capacity,
			4
		);

		assert.equal(
			corcite.capacities.work.used,
			0
		);
	}
);

test(
	'le socle consomme entretien et espace mais aucune production',
	() => {
		const corcite = createPlayable();

		assert.deepEqual(
			corcite.capacities,
			{
				energy: {
					normalCapacity: 4,
					used: 0,
					reserveMaximum: 3,
					reserveCurrent: 3
				},
				maintenance: {
					capacity: 5,
					used: 2
				},
				work: {
					capacity: 4,
					used: 0
				},
				space: {
					capacity: 16,
					used: 4
				}
			}
		);
	}
);

test(
	"l'état jouable de départ est valide",
	() => {
		const corcite = createPlayable();

		assert.deepEqual(
			validateCorciteState(corcite),
			{
				valid: true,
				errors: []
			}
		);
	}
);

test(
	'une capacité de travail incohérente avec la population est rejetée',
	() => {
		const corcite = createPlayable();

		corcite.capacities.work.capacity = 99;

		const validation =
			validateCorciteState(corcite);

		assert.equal(
			validation.valid,
			false
		);

		assert.ok(
			validation.errors.some(
				(error) =>
					error.includes(
						'capacité de travail'
					)
			)
		);
	}
);

test(
	"l'état jouable sérialisé puis relu conserve sa population",
	() => {
		const corcite = createPlayable();

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
	}
);

test(
	"l'ancien état de laboratoire conserve sa chaîne TF préinstallée",
	() => {
		const corcite =
			createReferenceCorciteState({
				id: 'corcite-reference-regression',
				name: 'REFERENCE',
				controller: 'human'
			});

		assert.equal(
			corcite.structures.length,
			TF_LAB_REFERENCE
				.initialStructures.length
		);

		assert.deepEqual(
			summarizeStoredResources(corcite),
			TF_LAB_REFERENCE.initialStocks
		);

		assert.equal(
			corcite.capacities.work.capacity,
			8
		);

		assert.equal(
			corcite.population?.total,
			8
		);
	}
);
