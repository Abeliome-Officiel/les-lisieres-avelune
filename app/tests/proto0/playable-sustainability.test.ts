import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createPlayableCorciteState,
	getPlayableSustainabilityState,
	previewPlayableConstruction,
	recalculatePlayableCapacities,
	resolvePlayableSustainabilityTurn,
	resolvePlayableTfTurn,
	serializeCorciteState,
	deserializeCorciteState,
	setPlayableStructureActive,
	validateCorciteState,
	type PlayableCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createPlayableCorciteState({
		id: 'corcite-sustainability',
		name: 'SUSTAINABILITY',
		controller: 'human'
	});
}

function addSyntheticLoad(
	state: PlayableCorciteState,
	input: {
		id: string;
		energy?: number;
		maintenance?: number;
		work?: number;
		space?: number;
	}
): void {
	state.structures.push({
		id: input.id,
		kind: 'fabricator-n1',
		name: input.id,
		status: 'active',
		usage: {
			energy:
				input.energy ?? 0,
			maintenance:
				input.maintenance ?? 0,
			work:
				input.work ?? 0,
			space:
				input.space ?? 0
		}
	});

	recalculatePlayableCapacities(
		state
	);
}

test(
	'le Corcite de départ possède une soutenabilité instantanée stable',
	() => {
		const corcite =
			createCorcite();

		const status =
			getPlayableSustainabilityState(
				corcite
			);

		assert.equal(
			status.energy.overload,
			0
		);

		assert.equal(
			status.maintenance.deficit,
			0
		);

		assert.equal(
			status.maintenance.debt,
			0
		);

		assert.equal(
			status.work.free,
			4
		);
	}
);

test(
	'un dépassement énergétique est refusé sans réserve courte',
	() => {
		const corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-a',
				energy: 3
			}
		);

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-b',
				energy: 3
			}
		);

		assert.equal(
			corcite.capacities.energy.used,
			6
		);

		assert.throws(
			() => resolvePlayableSustainabilityTurn(corcite, 1),
			/Capacité énergétique insuffisante/
		);
	}
);

test(
	'une charge supérieure à la capacité bloque immédiatement la production',
	() => {
		let corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-a',
				energy: 3
			}
		);

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-b',
				energy: 3
			}
		);

		assert.throws(
			() =>
				resolvePlayableTfTurn(
					corcite,
					1
				),
			/Déficit énergétique/
		);
	}
);

test(
	'le joueur peut désactiver une fonction même si une seule désactivation ne réparait pas encore tout',
	() => {
		const corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-a',
				energy: 4
			}
		);

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-b',
				energy: 4
			}
		);

		/*
		 * 8 utilisés pour 4 + 3 disponibles :
		 * état déjà déficitaire.
		 */
		assert.equal(
			corcite.capacities.energy.used,
			8
		);

		const afterFirstStop =
			setPlayableStructureActive(
				corcite,
				'energy-load-a',
				false
			);

		assert.equal(
			afterFirstStop.structures.find(
				(structure) =>
					structure.id ===
					'energy-load-a'
			)?.status,
			'inactive'
		);

		assert.equal(
			afterFirstStop.capacities
				.energy.used,
			4
		);
	}
);

test(
	'une nouvelle construction est interdite tant que le Corcite est déjà en déficit énergétique',
	() => {
		const corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-a',
				energy: 4
			}
		);

		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load-b',
				energy: 4
			}
		);

		const preview =
			previewPlayableConstruction(
				corcite,
				'energy-extension'
			);

		assert.equal(
			preview.canConstruct,
			false
		);

		assert.ok(
			preview.blockers.some(
				(message) =>
					message.includes(
						'déficit énergétique'
					)
			)
		);
	}
);

test(
	'un déficit d’entretien crée une dette progressive au lieu de bloquer immédiatement',
	() => {
		let corcite =
			createCorcite();

		for (
			let index = 1;
			index <= 4;
			index += 1
		) {
			addSyntheticLoad(
				corcite,
				{
					id:
						`maintenance-load-${index}`,
					maintenance: 1
				}
			);
		}

		assert.equal(
			corcite.capacities.maintenance
				.used,
			6
		);

		assert.equal(
			corcite.capacities.maintenance
				.capacity,
			5
		);

		const first =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			);

		assert.equal(
			first.resolution.maintenance
				.deficit,
			1
		);

		assert.equal(
			first.resolution.maintenance
				.debtAfter,
			1
		);

		assert.equal(
			first.resolution.maintenance
				.condition,
			'strained'
		);

		const second =
			resolvePlayableSustainabilityTurn(
				first.corcite,
				2
			);

		assert.equal(
			second.resolution.maintenance
				.debtAfter,
			2
		);

		assert.equal(
			second.resolution.maintenance
				.condition,
			'degraded'
		);
	}
);

test(
	'un déficit d’entretien n’interdit plus artificiellement une construction matériellement soutenable',
	() => {
		const corcite =
			createCorcite();

		for (
			let index = 1;
			index <= 4;
			index += 1
		) {
			addSyntheticLoad(
				corcite,
				{
					id:
						`maintenance-load-${index}`,
					maintenance: 1
				}
			);
		}

		const preview =
			previewPlayableConstruction(
				corcite,
				'storage-extension'
			);

		assert.equal(
			preview.blockers.some(
				(message) =>
					message.includes(
						'Entretien insuffisant'
					)
			),
			false
		);
	}
);

test(
	'un surplus d’entretien résorbe la dette accumulée',
	() => {
		let corcite =
			createCorcite();

		for (
			let index = 1;
			index <= 4;
			index += 1
		) {
			addSyntheticLoad(
				corcite,
				{
					id:
						`maintenance-load-${index}`,
					maintenance: 1
				}
			);
		}

		corcite =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			).corcite;

		corcite =
			resolvePlayableSustainabilityTurn(
				corcite,
				2
			).corcite;

		assert.equal(
			corcite.sustainability
				?.maintenance.debt,
			2
		);

		corcite.structures.push({
			id:
				'maintenance-recovery-unit',
			kind:
				'maintenance-extension-n1',
			name:
				'Unité entretien test',
			status:
				'active',
			usage: {
				energy: 0,
				maintenance: 0,
				work: 0,
				space: 0
			}
		});

		recalculatePlayableCapacities(
			corcite
		);

		const recovery =
			resolvePlayableSustainabilityTurn(
				corcite,
				3
			);

		assert.equal(
			recovery.resolution.maintenance
				.capacity,
			9
		);

		assert.equal(
			recovery.resolution.maintenance
				.surplus,
			3
		);

		assert.equal(
			recovery.resolution.maintenance
				.debtAfter,
			0
		);

		assert.equal(
			recovery.resolution.maintenance
				.condition,
			'stable'
		);
	}
);

test(
	'le travail disponible reste directement dérivé de la population',
	() => {
		const corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'worker-a',
				work: 1
			}
		);

		addSyntheticLoad(
			corcite,
			{
				id: 'worker-b',
				work: 1
			}
		);

		const status =
			getPlayableSustainabilityState(
				corcite
			);

		assert.equal(
			corcite.population.total,
			4
		);

		assert.equal(
			corcite.capacities.work.capacity,
			4
		);

		assert.equal(
			corcite.capacities.work.used,
			2
		);

		assert.equal(
			status.work.free,
			2
		);

		assert.equal(
			status.work.shortage,
			0
		);
	}
);

test(
	'l’état de soutenabilité survit à la sérialisation',
	() => {
		let corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'serialization-load',
				energy: 4
			}
		);

		corcite =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			).corcite;

		const restored =
			deserializeCorciteState(
				serializeCorciteState(
					corcite
				)
			);

		assert.deepEqual(
			restored.sustainability,
			corcite.sustainability
		);

		assert.equal(
			restored.capacities.energy
				.reserveCurrent,
			0
		);
	}
);

test(
	'l’état reste valide après résolution de la soutenabilité',
	() => {
		let corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'validation-load',
				energy: 4,
				maintenance: 1,
				work: 1
			}
		);

		corcite =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			).corcite;

		assert.deepEqual(
			validateCorciteState(
				corcite
			),
			{
				valid: true,
				errors: []
			}
		);
	}
);
