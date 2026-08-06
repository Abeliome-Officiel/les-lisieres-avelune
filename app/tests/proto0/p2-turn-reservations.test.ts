import assert from 'node:assert/strict';
import test from 'node:test';

import {
	addPlayerOperation,
	createReferenceCorciteState,
	createTurnPlan,
	lockTurnPlan,
	resolveTurnReservations,
	type PlayerOperation
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p2',
		name: 'P2',
		controller: 'human'
	});
}

function operation(
	id: string,
	resourceCosts: PlayerOperation['resourceCosts'],
	priority = 0
): PlayerOperation {
	return {
		id,
		label: `Opération ${id}`,
		kind: 'resource-demand',
		priority,
		resourceCosts,
		status: 'pending'
	};
}

test("la phase joueur n'impose pas de quota arbitraire d'actions", () => {
	let plan = createTurnPlan(1);

	for (let index = 0; index < 100; index += 1) {
		plan = addPlayerOperation(
			plan,
			operation(`operation-${index}`, {})
		);
	}

	assert.equal(plan.operations.length, 100);
	assert.equal(plan.phase, 'player');
});

test("le verrouillage interdit l'ajout de nouvelles opérations", () => {
	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('operation-a', { R1: 1 })
	);

	const locked = lockTurnPlan(plan);

	assert.throws(
		() =>
			addPlayerOperation(
				locked,
				operation('operation-b', { R1: 1 })
			),
		/verrouillés/
	);
});

test("le verrouillage ne modifie pas le plan joueur original", () => {
	const plan = createTurnPlan(1);
	const locked = lockTurnPlan(plan);

	assert.equal(plan.phase, 'player');
	assert.equal(locked.phase, 'locked');
});

test('une demande couverte réserve réellement les ressources', () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('build-a', {
			R3: 3,
			R4: 1
		})
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	assert.equal(
		result.plan.operations[0].status,
		'reserved'
	);

	assert.equal(
		result.corcite.reservations
			.filter(
				(reservation) =>
					reservation.status === 'active'
			)
			.reduce(
				(total, reservation) =>
					total + reservation.amount,
				0
			),
		4
	);
});

test('les réservations existantes sont respectées', () => {
	const corcite = createCorcite();

	corcite.reservations.push({
		id: 'existing-r4',
		operationId: 'old-operation',
		storageUnitId: 'storage-2',
		resourceId: 'R4',
		amount: 1,
		purpose: 'déjà réservé',
		status: 'active'
	});

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('new-operation', {
			R4: 1
		})
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	assert.equal(
		result.plan.operations[0].status,
		'blocked'
	);

	assert.equal(
		result.plan.conflicts[0].reason,
		'insufficient-resource'
	);
});

test("deux opérations concurrentes de même priorité déclenchent un arbitrage humain", () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('operation-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('operation-b', { R4: 1 })
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	assert.equal(
		result.plan.conflicts.length,
		1
	);

	assert.equal(
		result.plan.conflicts[0].reason,
		'competing-equal-priority'
	);

	assert.equal(
		result.plan.conflicts[0]
			.requiresHumanArbitration,
		true
	);

	assert.deepEqual(
		result.plan.operations.map(
			(candidate) => candidate.status
		),
		['blocked', 'blocked']
	);

	assert.equal(
		result.corcite.reservations.length,
		0
	);
});

test('une priorité explicite est respectée avant une priorité inférieure', () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation(
			'operation-haute',
			{ R4: 1 },
			10
		)
	);

	plan = addPlayerOperation(
		plan,
		operation(
			'operation-basse',
			{ R4: 1 },
			1
		)
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const high = result.plan.operations.find(
		(candidate) =>
			candidate.id === 'operation-haute'
	);

	const low = result.plan.operations.find(
		(candidate) =>
			candidate.id === 'operation-basse'
	);

	assert.equal(high?.status, 'reserved');
	assert.equal(low?.status, 'blocked');

	assert.ok(
		result.plan.conflicts.some(
			(conflict) =>
				conflict.reason ===
				'blocked-by-higher-priority'
		)
	);
});

test("une opération impossible n'obtient aucune réservation partielle", () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('operation-atomique', {
			R1: 1,
			R4: 2
		})
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	assert.equal(
		result.plan.operations[0].status,
		'blocked'
	);

	assert.equal(
		result.corcite.reservations.length,
		0
	);
});

test("l'ordre physique des stockages ne modifie pas le résultat logique", () => {
	const corciteA = createCorcite();
	const corciteB = structuredClone(corciteA);

	corciteB.storageUnits.reverse();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('operation-stable', {
			R3: 3
		})
	);

	const locked = lockTurnPlan(plan);

	const resultA = resolveTurnReservations(
		corciteA,
		locked
	);

	const resultB = resolveTurnReservations(
		corciteB,
		locked
	);

	assert.deepEqual(
		resultA.corcite.reservations,
		resultB.corcite.reservations
	);

	assert.deepEqual(
		resultA.plan,
		resultB.plan
	);
});

test('la résolution des réservations est reproductible', () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(3);

	plan = addPlayerOperation(
		plan,
		operation(
			'operation-a',
			{ R1: 2, R3: 1 },
			5
		)
	);

	plan = addPlayerOperation(
		plan,
		operation(
			'operation-b',
			{ R2: 2 },
			2
		)
	);

	const locked = lockTurnPlan(plan);

	const first = resolveTurnReservations(
		corcite,
		locked
	);

	const second = resolveTurnReservations(
		corcite,
		locked
	);

	assert.deepEqual(first, second);
});

test("une opération prioritaire impossible ne bloque pas inutilement une priorité inférieure", () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation(
			'operation-haute-impossible',
			{ R4: 2 },
			10
		)
	);

	plan = addPlayerOperation(
		plan,
		operation(
			'operation-basse-possible',
			{ R4: 1 },
			1
		)
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const high = result.plan.operations.find(
		(candidate) =>
			candidate.id === 'operation-haute-impossible'
	);

	const low = result.plan.operations.find(
		(candidate) =>
			candidate.id === 'operation-basse-possible'
	);

	assert.equal(high?.status, 'blocked');
	assert.equal(low?.status, 'reserved');

	assert.ok(
		result.plan.conflicts.some(
			(conflict) =>
				conflict.operationIds.includes(
					'operation-haute-impossible'
				) &&
				conflict.reason ===
					'insufficient-resource'
		)
	);

	assert.equal(
		result.corcite.reservations.some(
			(reservation) =>
				reservation.operationId ===
				'operation-basse-possible' &&
				reservation.resourceId === 'R4' &&
				reservation.amount === 1
		),
		true
	);
});

test("un conflit humain place le tour en attente d'arbitrage", () => {
	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('arbitrage-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('arbitrage-b', { R4: 1 })
	);

	const result = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	assert.equal(
		result.plan.phase,
		'awaiting-arbitration'
	);
});

test("le joueur peut choisir une opération dans un conflit", async () => {
	const {
		resolveAfterArbitration
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('choix-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('choix-b', { R4: 1 })
	);

	const first = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const conflict = first.plan.conflicts.find(
		(candidate) =>
			candidate.requiresHumanArbitration
	);

	assert.ok(conflict);

	const resolved = resolveAfterArbitration(
		corcite,
		first.plan,
		conflict.id,
		['choix-b']
	);

	assert.equal(
		resolved.plan.phase,
		'reservations-resolved'
	);

	assert.equal(
		resolved.plan.operations.find(
			(candidate) =>
				candidate.id === 'choix-a'
		)?.status,
		'blocked'
	);

	assert.equal(
		resolved.plan.operations.find(
			(candidate) =>
				candidate.id === 'choix-b'
		)?.status,
		'reserved'
	);

	assert.equal(
		resolved.corcite.reservations.some(
			(reservation) =>
				reservation.operationId === 'choix-b' &&
				reservation.resourceId === 'R4'
		),
		true
	);
});

test("le joueur peut explicitement ne retenir aucune opération", async () => {
	const {
		resolveAfterArbitration
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('aucun-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('aucun-b', { R4: 1 })
	);

	const first = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const conflict = first.plan.conflicts.find(
		(candidate) =>
			candidate.requiresHumanArbitration
	);

	assert.ok(conflict);

	const resolved = resolveAfterArbitration(
		corcite,
		first.plan,
		conflict.id,
		[]
	);

	assert.equal(
		resolved.plan.phase,
		'reservations-resolved'
	);

	assert.deepEqual(
		resolved.plan.operations.map(
			(candidate) => candidate.status
		),
		['blocked', 'blocked']
	);

	assert.equal(
		resolved.corcite.reservations.length,
		0
	);
});

test("un arbitrage ne peut pas sélectionner une opération étrangère au conflit", async () => {
	const {
		recordArbitrationDecision
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('conflit-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('conflit-b', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('hors-conflit', { R1: 1 })
	);

	const first = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const conflict = first.plan.conflicts.find(
		(candidate) =>
			candidate.requiresHumanArbitration
	);

	assert.ok(conflict);

	assert.throws(
		() =>
			recordArbitrationDecision(
				first.plan,
				conflict.id,
				['hors-conflit']
			),
		/ne participe pas au conflit/
	);
});

test("un arbitrage dépassant la ressource disponible est refusé", async () => {
	const {
		recordArbitrationDecision
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('gros-a', { R3: 3 })
	);

	plan = addPlayerOperation(
		plan,
		operation('gros-b', { R3: 3 })
	);

	const first = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const conflict = first.plan.conflicts.find(
		(candidate) =>
			candidate.requiresHumanArbitration
	);

	assert.ok(conflict);

	assert.throws(
		() =>
			recordArbitrationDecision(
				first.plan,
				conflict.id,
				['gros-a', 'gros-b']
			),
		/Arbitrage impossible/
	);
});

test("un arbitrage refuse un état déjà modifié par les réservations du tour", async () => {
	const {
		resolveAfterArbitration
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation(
			'prioritaire',
			{ R1: 1 },
			10
		)
	);

	plan = addPlayerOperation(
		plan,
		operation(
			'concurrent-a',
			{ R4: 1 },
			1
		)
	);

	plan = addPlayerOperation(
		plan,
		operation(
			'concurrent-b',
			{ R4: 1 },
			1
		)
	);

	const first = resolveTurnReservations(
		corcite,
		lockTurnPlan(plan)
	);

	const conflict = first.plan.conflicts.find(
		(candidate) =>
			candidate.requiresHumanArbitration
	);

	assert.ok(conflict);

	assert.throws(
		() =>
			resolveAfterArbitration(
				first.corcite,
				first.plan,
				conflict.id,
				['concurrent-a']
			),
		/antérieur aux réservations/
	);
});

test("Terminer le tour verrouille les choix et prépare les réservations", async () => {
	const {
		endTurn
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('fin-tour-a', { R1: 1 })
	);

	const result = endTurn(
		corcite,
		plan
	);

	assert.equal(
		result.status,
		'ready-for-resolution'
	);

	assert.equal(
		result.plan.phase,
		'reservations-resolved'
	);

	assert.equal(
		result.plan.operations[0].status,
		'reserved'
	);

	assert.equal(
		result.plan.journal.some(
			(entry) =>
				entry.event ===
				'end-turn-requested'
		),
		true
	);

	assert.equal(
		result.plan.journal.some(
			(entry) =>
				entry.event === 'turn-locked'
		),
		true
	);
});

test("Terminer le tour ne modifie pas les objets d'entrée", async () => {
	const {
		endTurn
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('immutabilite', { R1: 1 })
	);

	const originalCorcite =
		structuredClone(corcite);
	const originalPlan =
		structuredClone(plan);

	endTurn(corcite, plan);

	assert.deepEqual(
		corcite,
		originalCorcite
	);

	assert.deepEqual(
		plan,
		originalPlan
	);
});

test("Terminer le tour s'arrête lorsqu'un arbitrage joueur est nécessaire", async () => {
	const {
		endTurn
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('fin-conflit-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('fin-conflit-b', { R4: 1 })
	);

	const result = endTurn(
		corcite,
		plan
	);

	assert.equal(
		result.status,
		'awaiting-arbitration'
	);

	assert.equal(
		result.plan.phase,
		'awaiting-arbitration'
	);
});

test("la fin de tour reprend après arbitrage explicite", async () => {
	const {
		continueEndTurnAfterArbitration,
		endTurn
	} = await import('../../src/lib/proto0/index.js');

	const corcite = createCorcite();

	let plan = createTurnPlan(1);

	plan = addPlayerOperation(
		plan,
		operation('reprise-a', { R4: 1 })
	);

	plan = addPlayerOperation(
		plan,
		operation('reprise-b', { R4: 1 })
	);

	const waiting = endTurn(
		corcite,
		plan
	);

	const conflict =
		waiting.plan.conflicts.find(
			(candidate) =>
				candidate
					.requiresHumanArbitration
		);

	assert.ok(conflict);

	const resumed =
		continueEndTurnAfterArbitration(
			corcite,
			waiting.plan,
			conflict.id,
			['reprise-a']
		);

	assert.equal(
		resumed.status,
		'ready-for-resolution'
	);

	assert.equal(
		resumed.plan.operations.find(
			(candidate) =>
				candidate.id === 'reprise-a'
		)?.status,
		'reserved'
	);
});

test("l'ordre canonique de résolution correspond à la spécification PROTO-0", async () => {
	const {
		PROTO0_RESOLUTION_ORDER
	} = await import('../../src/lib/proto0/index.js');

	assert.deepEqual(
		[...PROTO0_RESOLUTION_ORDER],
		[
			'lock-player-decisions',
			'prepare-simulated-corcites',
			'compute-effective-characteristics',
			'validate-capacities-and-constraints',
			'compute-needs',
			'extract',
			'produce-transform-fabricate',
			'resolve-direct-buffers-and-flows',
			'construct',
			'resolve-minimal-rpg-research',
			'commit',
			'resolve-deficits-and-internal-consequences',
			'update-knowledge',
			'update-world',
			'prepare-or-resolve-wave',
			'resolve-consequences',
			'log',
			'save'
		]
	);
});
