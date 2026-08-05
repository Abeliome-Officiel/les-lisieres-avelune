import assert from 'node:assert/strict';
import test from 'node:test';

import {
	TD_PREPARATION_LAB_REFERENCE,
	addPlayerOperation,
	createReferenceCorciteState,
	createReferenceTdPreparationOperation,
	createTurnPlan,
	endTurn,
	resolveTfCoreTurn,
	summarizeStoredResources
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p3-tf-to-td',
		name: 'P3-TF-TO-TD',
		controller: 'human'
	});
}

function createPreparationPlan() {
	let plan =
		createTurnPlan(1);

	plan =
		addPlayerOperation(
			plan,
			createReferenceTdPreparationOperation(
				{
					operationId:
						'prepare-attenuation-n1',
					priority: 10
				}
			)
		);

	return plan;
}

function clearResource(
	corcite: ReturnType<
		typeof createCorcite
	>,
	resourceId: 'R3' | 'R4'
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

test("la préparation Atténuation N1 possède un coût matériel de laboratoire R3 + R4", () => {
	assert.deepEqual(
		TD_PREPARATION_LAB_REFERENCE
			.resourceCosts,
		{
			R3: 2,
			R4: 1
		}
	);
});

test("une préparation TD solvable passe par le moteur de réservation P2", () => {
	const corcite =
		createCorcite();

	const result =
		endTurn(
			corcite,
			createPreparationPlan()
		);

	assert.equal(
		result.status,
		'ready-for-resolution'
	);

	assert.equal(
		result.plan.operations[0]
			.status,
		'reserved'
	);

	const reservedR3 =
		result.corcite.reservations
			.filter(
				(reservation) =>
					reservation.operationId ===
						'prepare-attenuation-n1' &&
					reservation.resourceId ===
						'R3'
			)
			.reduce(
				(total, reservation) =>
					total +
					reservation.amount,
				0
			);

	const reservedR4 =
		result.corcite.reservations
			.filter(
				(reservation) =>
					reservation.operationId ===
						'prepare-attenuation-n1' &&
					reservation.resourceId ===
						'R4'
			)
			.reduce(
				(total, reservation) =>
					total +
					reservation.amount,
				0
			);

	assert.equal(
		reservedR3,
		2
	);

	assert.equal(
		reservedR4,
		1
	);
});

test("sans R4 la préparation TD est matériellement bloquée", () => {
	const corcite =
		createCorcite();

	clearResource(
		corcite,
		'R4'
	);

	const result =
		endTurn(
			corcite,
			createPreparationPlan()
		);

	assert.equal(
		result.status,
		'ready-for-resolution'
	);

	assert.equal(
		result.plan.operations[0]
			.status,
		'blocked'
	);

	assert.ok(
		result.plan.conflicts.some(
			(conflict) =>
				conflict.resourceId ===
					'R4' &&
				conflict.reason ===
					'insufficient-resource'
		)
	);

	assert.equal(
		result.corcite.reservations
			.some(
				(reservation) =>
					reservation.operationId ===
						'prepare-attenuation-n1'
			),
		false
	);
});

test("la chaîne TF R1/R2 vers R3 puis R4 rend ensuite la préparation TD possible", () => {
	let corcite =
		createCorcite();

	/*
	 * On retire les ressources avancées initiales :
	 * la préparation TD ne peut donc plus être satisfaite
	 * sans passer par transformation puis fabrication.
	 */
	clearResource(
		corcite,
		'R3'
	);

	clearResource(
		corcite,
		'R4'
	);

	const initiallyBlocked =
		endTurn(
			corcite,
			createPreparationPlan()
		);

	assert.equal(
		initiallyBlocked.plan
			.operations[0].status,
		'blocked'
	);

	/*
	 * Tour TF 1 :
	 * R1/R2 -> R3.
	 * Le R3 produit n'est pas fabricable dans le même tour.
	 */
	const tfTurnOne =
		resolveTfCoreTurn(
			corcite
		);

	assert.equal(
		tfTurnOne.transformation
			.events[0].status,
		'produced'
	);

	assert.equal(
		tfTurnOne.fabrication
			.events[0].status,
		'input-blocked'
	);

	corcite =
		tfTurnOne.corcite;

	/*
	 * Tour TF 2 :
	 * le R3 du tour précédent devient utilisable ;
	 * le fabricateur produit alors R4.
	 */
	const tfTurnTwo =
		resolveTfCoreTurn(
			corcite
		);

	corcite =
		tfTurnTwo.corcite;

	assert.equal(
		tfTurnTwo.fabrication
			.events[0].status,
		'produced'
	);

	const stocks =
		summarizeStoredResources(
			corcite
		);

	assert.ok(
		stocks.R3 >= 2,
		`R3 attendu >= 2, obtenu ${stocks.R3}`
	);

	assert.ok(
		stocks.R4 >= 1,
		`R4 attendu >= 1, obtenu ${stocks.R4}`
	);

	/*
	 * La même opération TD devient maintenant réservable
	 * via le moteur P2, sans contournement spécial.
	 */
	const nowReservable =
		endTurn(
			corcite,
			createPreparationPlan()
		);

	assert.equal(
		nowReservable.plan
			.operations[0].status,
		'reserved'
	);

	assert.equal(
		nowReservable.status,
		'ready-for-resolution'
	);
});
