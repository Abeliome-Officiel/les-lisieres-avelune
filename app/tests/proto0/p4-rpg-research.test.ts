import assert from 'node:assert/strict';
import test from 'node:test';

import {
	RPG_LAB_REFERENCE,
	advanceActiveRpgResearch,
	createReferenceCorciteState,
	createTurnPlan,
	deserializeCorciteState,
	serializeCorciteState,
	startRpgResearch,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p4-rpg-research',
		name: 'P4-RPG-RESEARCH',
		controller: 'human'
	});
}

test("la recherche de référence utilise explicitement des valeurs de laboratoire", () => {
	assert.equal(
		RPG_LAB_REFERENCE
			.durationTurns,
		3
	);

	assert.deepEqual(
		RPG_LAB_REFERENCE
			.completion.modifier,
		{
			id:
				'modifier-research-transformation-efficiency-n1',
			target:
				'tf.recipe.transform-r3-n1.output.R3',
			operation:
				'multiply',
			value: 1.2
		}
	);
});

test("une recherche RPG démarre directement dans l'état RPG sans PlayerOperation", () => {
	const base =
		createCorcite();

	const turnPlan =
		createTurnPlan(1);

	const result =
		startRpgResearch(
			base,
			1
		);

	assert.equal(
		result.rpg.researches.length,
		1
	);

	assert.equal(
		result.rpg.researches[0]
			.progressTurns,
		0
	);

	assert.equal(
		result.rpg.researches[0]
			.status,
		'active'
	);

	assert.equal(
		result.reservations.length,
		0
	);

	assert.equal(
		turnPlan.operations.length,
		0
	);

	assert.equal(
		result.rpg.journal[0]
			.event,
		'research-started'
	);
});

test("une seconde recherche ne peut pas être démarrée pendant qu'une recherche est active", () => {
	const active =
		startRpgResearch(
			createCorcite(),
			1
		);

	assert.throws(
		() =>
			startRpgResearch(
				active,
				2
			),
		/déjà active/
	);
});

test("une recherche ne peut progresser qu'une fois par tour", () => {
	const started =
		startRpgResearch(
			createCorcite(),
			1
		);

	const first =
		advanceActiveRpgResearch(
			started,
			1
		);

	assert.equal(
		first.status,
		'progressed'
	);

	assert.equal(
		first.corcite.rpg
			.researches[0]
			.progressTurns,
		1
	);

	assert.equal(
		first.corcite.rpg
			.researches[0]
			.lastProgressTurn,
		1
	);

	assert.throws(
		() =>
			advanceActiveRpgResearch(
				first.corcite,
				1
			),
		/déjà progressé/
	);
});

test("la recherche de laboratoire s'achève après trois tours de progression", () => {
	let corcite =
		startRpgResearch(
			createCorcite(),
			1
		);

	const one =
		advanceActiveRpgResearch(
			corcite,
			1
		);

	corcite =
		one.corcite;

	const two =
		advanceActiveRpgResearch(
			corcite,
			2
		);

	corcite =
		two.corcite;

	const three =
		advanceActiveRpgResearch(
			corcite,
			3
		);

	assert.equal(
		three.status,
		'completed'
	);

	const research =
		three.corcite.rpg
			.researches[0];

	assert.equal(
		research.status,
		'completed'
	);

	assert.equal(
		research.progressTurns,
		3
	);

	assert.equal(
		research.completedTurn,
		3
	);

	assert.equal(
		research.lastProgressTurn,
		3
	);
});

test("l'achèvement produit modificateur, accès et connaissance", () => {
	let corcite =
		startRpgResearch(
			createCorcite(),
			1
		);

	for (
		const turn of
		[1, 2, 3]
	) {
		corcite =
			advanceActiveRpgResearch(
				corcite,
				turn
			).corcite;
	}

	assert.equal(
		corcite.modifiers.length,
		1
	);

	assert.equal(
		corcite.modifiers[0]
			.active,
		true
	);

	assert.equal(
		corcite.rpg.accesses.length,
		1
	);

	assert.equal(
		corcite.rpg.accesses[0]
			.active,
		true
	);

	assert.equal(
		corcite.rpg.knowledge.length,
		1
	);

	assert.equal(
		corcite.rpg.knowledge[0]
			.value,
		1
	);

	assert.equal(
		validateCorciteState(
			corcite
		).valid,
		true
	);
});

test("l'origine de tous les effets d'achèvement est explicitement traçable", () => {
	let corcite =
		startRpgResearch(
			createCorcite(),
			1
		);

	for (
		const turn of
		[1, 2, 3]
	) {
		corcite =
			advanceActiveRpgResearch(
				corcite,
				turn
			).corcite;
	}

	const expectedSource =
		`research:${RPG_LAB_REFERENCE.id}`;

	assert.equal(
		corcite.modifiers[0]
			.source,
		expectedSource
	);

	assert.equal(
		corcite.rpg.accesses[0]
			.source,
		expectedSource
	);

	assert.equal(
		corcite.rpg.knowledge[0]
			.source,
		expectedSource
	);

	const completionEvents =
		corcite.rpg.journal.filter(
			(entry) =>
				[
					'research-completed',
					'modifier-applied',
					'access-unlocked',
					'knowledge-updated'
				].includes(
					entry.event
				)
		);

	assert.equal(
		completionEvents.length,
		4
	);

	assert.equal(
		completionEvents.every(
			(entry) =>
				entry.source ===
					expectedSource
		),
		true
	);
});

test("une recherche achevée et ses effets survivent à la sérialisation", () => {
	let corcite =
		startRpgResearch(
			createCorcite(),
			1
		);

	for (
		const turn of
		[1, 2, 3]
	) {
		corcite =
			advanceActiveRpgResearch(
				corcite,
				turn
			).corcite;
	}

	const restored =
		deserializeCorciteState(
			serializeCorciteState(
				corcite
			)
		);

	assert.deepEqual(
		restored.rpg,
		corcite.rpg
	);

	assert.deepEqual(
		restored.modifiers,
		corcite.modifiers
	);
});

test("résoudre le RPG sans recherche active ne crée aucun effet artificiel", () => {
	const corcite =
		createCorcite();

	const result =
		advanceActiveRpgResearch(
			corcite,
			1
		);

	assert.equal(
		result.status,
		'no-active-research'
	);

	assert.deepEqual(
		result.corcite,
		corcite
	);

	assert.notEqual(
		result.corcite,
		corcite
	);
});
