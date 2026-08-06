import assert from 'node:assert/strict';
import test from 'node:test';

import {
	addPlayerOperation,
	commitPlayableConstruction,
	createPlayableConstructionOperation,
	createPlayableCorciteState,
	createTurnPlan,
	endTurn,
	PLAYABLE_CONSTRUCTION_CATALOG,
	previewPlayableConstruction,
	summarizeStoredResources,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createPlayableCorciteState({
		id: 'corcite-construction',
		name: 'CONSTRUCTION',
		controller: 'human'
	});
}

function reserveConstruction(
	definitionId:
		Parameters<
			typeof createPlayableConstructionOperation
		>[0],
	operationId = `build-${definitionId}`
) {
	const corcite =
		createCorcite();

	let plan =
		createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		createPlayableConstructionOperation(
			definitionId,
			operationId
		)
	);

	const prepared =
		endTurn(
			corcite,
			plan
		);

	assert.equal(
		prepared.status,
		'ready-for-resolution'
	);

	assert.equal(
		prepared.plan.operations[0].status,
		'reserved'
	);

	return {
		base: corcite,
		prepared,
		operationId
	};
}

test(
	'le catalogue contient sept constructions au rôle explicite',
	() => {
		assert.deepEqual(
			PLAYABLE_CONSTRUCTION_CATALOG.map(
				(entry) => entry.label
			),
			[
				'Extracteur organique',
				'Extracteur minéral',
				'Atelier de transformation',
				'Atelier de fabrication',
				'Stockage supplémentaire',
				'Extension énergétique',
				"Unité d'entretien"
			]
		);
	}
);

test(
	'le départ offre plusieurs constructions immédiatement possibles',
	() => {
		const corcite =
			createCorcite();

		const possible =
			PLAYABLE_CONSTRUCTION_CATALOG
				.filter(
					(definition) =>
						previewPlayableConstruction(
							corcite,
							definition.id
						).canConstruct
				)
				.map(
					(definition) =>
						definition.id
				);

		assert.ok(
			possible.includes(
				'organic-extractor'
			)
		);

		assert.ok(
			possible.includes(
				'mineral-extractor'
			)
		);

		assert.ok(
			possible.includes(
				'primary-transformer'
			)
		);

		assert.ok(
			possible.length >= 4
		);
	}
);

test(
	'un aperçu expose coûts et capacités avant/après',
	() => {
		const preview =
			previewPlayableConstruction(
				createCorcite(),
				'organic-extractor'
			);

		assert.deepEqual(
			preview.definition.resourceCosts,
			{
				R1: 2,
				R2: 1
			}
		);

		assert.equal(
			preview.before.energyUsed,
			0
		);

		assert.equal(
			preview.after.energyUsed,
			1
		);

		assert.equal(
			preview.before.workUsed,
			0
		);

		assert.equal(
			preview.after.workUsed,
			1
		);
	}
);

test(
	'construire un extracteur consomme réellement ses ressources',
	() => {
		const {
			prepared,
			operationId
		} = reserveConstruction(
			'organic-extractor'
		);

		const before =
			summarizeStoredResources(
				prepared.corcite
			);

		const result =
			commitPlayableConstruction(
				prepared.corcite,
				prepared.plan,
				operationId,
				'organic-extractor'
			);

		const after =
			summarizeStoredResources(
				result.corcite
			);

		assert.equal(
			before.R1 - after.R1,
			2
		);

		assert.equal(
			before.R2 - after.R2,
			1
		);

		assert.equal(
			result.structure.kind,
			'extractor-a-n1'
		);

		assert.equal(
			result.corcite.capacities.energy.used,
			1
		);

		assert.equal(
			result.corcite.capacities.work.used,
			1
		);
	}
);

test(
	'une construction sans réservation est refusée',
	() => {
		const corcite =
			createCorcite();

		let plan =
			createTurnPlan(1);

		plan = addPlayerOperation(
			plan,
			createPlayableConstructionOperation(
				'organic-extractor',
				'build-no-reservation'
			)
		);

		assert.throws(
			() =>
				commitPlayableConstruction(
					corcite,
					plan,
					'build-no-reservation',
					'organic-extractor'
				),
			/n'est pas réservée/
		);
	}
);

test(
	'un coût réservé falsifié ne peut pas construire un autre bâtiment',
	() => {
		const {
			prepared,
			operationId
		} = reserveConstruction(
			'organic-extractor'
		);

		assert.throws(
			() =>
				commitPlayableConstruction(
					prepared.corcite,
					prepared.plan,
					operationId,
					'mineral-extractor'
				),
			/ne correspondent pas au catalogue/
		);
	}
);

test(
	'un stockage construit crée une nouvelle capacité individuelle vide',
	() => {
		const {
			prepared,
			operationId
		} = reserveConstruction(
			'storage-extension'
		);

		const result =
			commitPlayableConstruction(
				prepared.corcite,
				prepared.plan,
				operationId,
				'storage-extension'
			);

		assert.equal(
			result.corcite.storageUnits.length,
			2
		);

		assert.ok(
			result.storageUnit
		);

		assert.equal(
			result.storageUnit?.capacity,
			12
		);

		assert.deepEqual(
			result.storageUnit?.contents,
			{
				R1: 0,
				R2: 0,
				R3: 0,
				R4: 0
			}
		);
	}
);

test(
	"une extension énergétique augmente réellement les capacités d'énergie",
	() => {
		const {
			prepared,
			operationId
		} = reserveConstruction(
			'energy-extension'
		);

		const result =
			commitPlayableConstruction(
				prepared.corcite,
				prepared.plan,
				operationId,
				'energy-extension'
			);

		assert.equal(
			result.corcite.capacities
				.energy.normalCapacity,
			8
		);

		assert.equal(
			result.corcite.capacities
				.energy.reserveMaximum,
			0
		);

		assert.equal(
			result.corcite.capacities
				.energy.reserveCurrent,
			0
		);
	}
);

test(
	"une unité d'entretien augmente réellement la capacité d'entretien",
	() => {
		const {
			prepared,
			operationId
		} = reserveConstruction(
			'maintenance-unit'
		);

		const result =
			commitPlayableConstruction(
				prepared.corcite,
				prepared.plan,
				operationId,
				'maintenance-unit'
			);

		assert.equal(
			result.corcite.capacities
				.maintenance.capacity,
			9
		);

		assert.equal(
			result.corcite.capacities
				.maintenance.used,
			2
		);
	}
);

test(
	'les ressources insuffisantes bloquent explicitement une construction',
	() => {
		const corcite =
			createCorcite();

		corcite.storageUnits[0]
			.contents.R1 = 0;

		const preview =
			previewPlayableConstruction(
				corcite,
				'organic-extractor'
			);

		assert.equal(
			preview.canConstruct,
			false
		);

		assert.ok(
			preview.blockers.some(
				(blocker) =>
					blocker.includes(
						'Matière organique brute'
					)
			)
		);
	}
);

test(
	'le travail disponible peut empêcher une construction',
	() => {
		const corcite =
			createCorcite();

		corcite.population.total = 1;
		corcite.capacities.work.capacity = 1;

		corcite.structures.push({
			id: 'structure-work-test',
			kind: 'extractor-a-n1',
			name: 'Occupation travail',
			status: 'active',
			usage: {
				energy: 0,
				maintenance: 0,
				work: 1,
				space: 0
			}
		});

		corcite.capacities.work.used = 1;

		const preview =
			previewPlayableConstruction(
				corcite,
				'mineral-extractor'
			);

		assert.equal(
			preview.canConstruct,
			false
		);

		assert.ok(
			preview.blockers.some(
				(blocker) =>
					blocker.includes(
						'Travail insuffisant'
					)
			)
		);
	}
);

test(
	"l'état reste valide après une construction",
	() => {
		const {
			prepared,
			operationId
		} = reserveConstruction(
			'organic-extractor'
		);

		const result =
			commitPlayableConstruction(
				prepared.corcite,
				prepared.plan,
				operationId,
				'organic-extractor'
			);

		assert.deepEqual(
			validateCorciteState(
				result.corcite
			),
			{
				valid: true,
				errors: []
			}
		);
	}
);
