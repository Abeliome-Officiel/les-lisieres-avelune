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
	'un dépassement énergétique consomme réellement la réserve',
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

		const result =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			);

		assert.equal(
			result.resolution.energy.overload,
			2
		);

		assert.equal(
			result.resolution.energy.reserveBefore,
			3
		);

		assert.equal(
			result.resolution.energy.reserveSpent,
			2
		);

		assert.equal(
			result.resolution.energy.reserveAfter,
			1
		);

		assert.equal(
			result.resolution.energy.mustReduceLoad,
			true
		);
	}
);

test(
	'une charge devenue insoutenable bloque le tour TF suivant avant production',
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

		corcite =
			resolvePlayableTfTurn(
				corcite,
				1
			).corcite;

		assert.equal(
			corcite.capacities.energy
				.reserveCurrent,
			1
		);

		assert.throws(
			() =>
				resolvePlayableTfTurn(
					corcite,
					2
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
	'la réserve récupère progressivement lors d’un tour stable',
	() => {
		let corcite =
			createCorcite();

		addSyntheticLoad(
			corcite,
			{
				id: 'temporary-load',
				energy: 5
			}
		);

		corcite =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			).corcite;

		assert.equal(
			corcite.capacities.energy
				.reserveCurrent,
			2
		);

		corcite =
			setPlayableStructureActive(
				corcite,
				'temporary-load',
				false
			);

		const recovery =
			resolvePlayableSustainabilityTurn(
				corcite,
				2
			);

		assert.equal(
			recovery.resolution.energy
				.reserveRecovered,
			1
		);

		assert.equal(
			recovery.corcite.capacities.energy
				.reserveCurrent,
			3
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
	'la résorption d’une dette d’entretien retarde la recharge énergétique',
	() => {
		let corcite =
			createCorcite();

		/*
		 * On consomme d'abord une unité de réserve.
		 */
		addSyntheticLoad(
			corcite,
			{
				id: 'energy-load',
				energy: 5
			}
		);

		/*
		 * Puis on crée simultanément un déficit
		 * d'entretien de 1.
		 */
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

		assert.equal(
			corcite.capacities.energy
				.reserveCurrent,
			2
		);

		assert.equal(
			corcite.sustainability
				?.maintenance.debt,
			1
		);

		/*
		 * On arrête la charge énergétique.
		 */
		corcite =
			setPlayableStructureActive(
				corcite,
				'energy-load',
				false
			);

		/*
		 * On ajoute de la capacité d'entretien
		 * afin de pouvoir rembourser la dette.
		 */
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

		const repairTurn =
			resolvePlayableSustainabilityTurn(
				corcite,
				2
			);

		assert.equal(
			repairTurn.resolution
				.maintenance.debtAfter,
			0
		);

		assert.equal(
			repairTurn.resolution.energy
				.reserveRecovered,
			0
		);

		const stableTurn =
			resolvePlayableSustainabilityTurn(
				repairTurn.corcite,
				3
			);

		assert.equal(
			stableTurn.resolution.energy
				.reserveRecovered,
			1
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
				energy: 5
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
			2
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
				energy: 5,
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
