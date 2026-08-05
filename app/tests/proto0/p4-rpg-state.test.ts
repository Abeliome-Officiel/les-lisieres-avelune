import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createReferenceCorciteState,
	deserializeCorciteState,
	serializeCorciteState,
	validateCorciteState,
	validateRpgState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p4-rpg-state',
		name: 'P4-RPG-STATE',
		controller: 'human'
	});
}

test("un Corcite de référence possède un état RPG vide", () => {
	const corcite =
		createCorcite();

	assert.deepEqual(
		corcite.rpg,
		{
			researches: [],
			accesses: [],
			knowledge: [],
			journal: []
		}
	);

	assert.equal(
		validateCorciteState(
			corcite
		).valid,
		true
	);
});

test("un état RPG valide survit à la sérialisation Corcite", () => {
	const corcite =
		createCorcite();

	corcite.rpg.researches.push({
		id: 'research-instance-1',
		definitionId:
			'research-lab-1',
		label:
			'Recherche de laboratoire',
		status: 'active',
		progressTurns: 1,
		durationTurns: 3,
		startedTurn: 2,
		lastProgressTurn: 2,
		completedTurn: null
	});

	corcite.rpg.accesses.push({
		id: 'access-1',
		source:
			'research:research-lab-0',
		key:
			'tf:transformer-analysis',
		active: true
	});

	corcite.rpg.knowledge.push({
		id: 'knowledge-1',
		source:
			'research:research-lab-0',
		key:
			'tf:transformation',
		value: 1
	});

	corcite.rpg.journal.push({
		sequence: 1,
		event:
			'research-started',
		source:
			'research:research-lab-1',
		message:
			'Recherche démarrée.'
	});

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

	assert.notEqual(
		restored.rpg,
		corcite.rpg
	);
});

test("plusieurs recherches RPG actives sont rejetées", () => {
	const corcite =
		createCorcite();

	for (
		const id of
		['research-a', 'research-b']
	) {
		corcite.rpg.researches.push({
			id,
			definitionId: id,
			label: id,
			status: 'active',
			progressTurns: 0,
			durationTurns: 3,
			startedTurn: 1,
			lastProgressTurn: null,
			completedTurn: null
		});
	}

	const validation =
		validateRpgState(
			corcite.rpg
		);

	assert.equal(
		validation.valid,
		false
	);

	assert.ok(
		validation.errors.some(
			(error) =>
				error.includes(
					'Plusieurs recherches'
				)
		)
	);
});

test("une progression supérieure à la durée est rejetée", () => {
	const corcite =
		createCorcite();

	corcite.rpg.researches.push({
		id: 'research-invalid-progress',
		definitionId: 'research-x',
		label: 'Recherche X',
		status: 'active',
		progressTurns: 4,
		durationTurns: 3,
		startedTurn: 1,
		lastProgressTurn: 1,
		completedTurn: null
	});

	assert.equal(
		validateRpgState(
			corcite.rpg
		).valid,
		false
	);
});

test("une recherche achevée doit avoir atteint exactement sa durée", () => {
	const corcite =
		createCorcite();

	corcite.rpg.researches.push({
		id: 'research-invalid-completed',
		definitionId: 'research-x',
		label: 'Recherche X',
		status: 'completed',
		progressTurns: 2,
		durationTurns: 3,
		startedTurn: 1,
		lastProgressTurn: 3,
		completedTurn: 3
	});

	assert.equal(
		validateRpgState(
			corcite.rpg
		).valid,
		false
	);
});

test("les identifiants d'accès RPG doivent être uniques", () => {
	const corcite =
		createCorcite();

	corcite.rpg.accesses.push(
		{
			id: 'access-duplicate',
			source: 'source-a',
			key: 'key-a',
			active: true
		},
		{
			id: 'access-duplicate',
			source: 'source-b',
			key: 'key-b',
			active: true
		}
	);

	const validation =
		validateRpgState(
			corcite.rpg
		);

	assert.equal(
		validation.valid,
		false
	);

	assert.ok(
		validation.errors.some(
			(error) =>
				error.includes(
					'Accès RPG dupliqués'
				)
		)
	);
});

test("le journal RPG impose une séquence continue", () => {
	const corcite =
		createCorcite();

	corcite.rpg.journal.push({
		sequence: 2,
		event: 'knowledge-updated',
		source: 'test',
		message: 'Entrée invalide.'
	});

	const validation =
		validateRpgState(
			corcite.rpg
		);

	assert.equal(
		validation.valid,
		false
	);

	assert.ok(
		validation.errors.some(
			(error) =>
				error.includes(
					'séquence'
				)
		)
	);
});

test("un ancien JSON Corcite sans état RPG est rejeté explicitement", () => {
	const corcite =
		createCorcite();

	const raw =
		JSON.parse(
			serializeCorciteState(
				corcite
			)
		);

	delete raw.rpg;

	assert.throws(
		() =>
			deserializeCorciteState(
				JSON.stringify(raw)
			),
		/structure JSON incompatible/
	);
});
