import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createEmptyTdState,
	createReferenceCorciteState,
	createTdTower,
	deserializeCorciteState,
	placeTdTower,
	serializeCorciteState,
	validateCorciteState,
	validateTdState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id: 'corcite-p5-td-state',
		name: 'P5-TD-STATE',
		controller: 'human'
	});
}

test("le Corcite de référence possède exactement huit positions TD ordonnées", () => {
	const corcite =
		createCorcite();

	assert.deepEqual(
		corcite.td.positions.map(
			(position) =>
				position.position
		),
		[1, 2, 3, 4, 5, 6, 7, 8]
	);

	assert.equal(
		corcite.td.positions.every(
			(position) =>
				position.tower === null
		),
		true
	);

	assert.equal(
		validateCorciteState(
			corcite
		).valid,
		true
	);
});

test("les quatre familles N1 peuvent être instanciées", () => {
	const definitions = [
		'attenuation-n1',
		'destructuration-n1',
		'captation-n1',
		'stabilisation-n1'
	] as const;

	const families =
		definitions.map(
			(definitionId, index) =>
				createTdTower({
					id:
						`tower-${index + 1}`,
					definitionId
				}).family
		);

	assert.deepEqual(
		families,
		[
			'attenuation',
			'destructuration',
			'captation',
			'stabilisation'
		]
	);
});

test("une tour peut être placée sur une position précise sans modifier les autres", () => {
	const base =
		createEmptyTdState();

	const tower =
		createTdTower({
			id: 'tower-attenuation',
			definitionId:
				'attenuation-n1'
		});

	const placed =
		placeTdTower(
			base,
			{
				position: 4,
				tower
			}
		);

	assert.equal(
		base.positions[3]
			.tower,
		null
	);

	assert.equal(
		placed.positions[3]
			.tower?.id,
		'tower-attenuation'
	);

	assert.equal(
		placed.positions.filter(
			(position) =>
				position.tower !== null
		).length,
		1
	);
});

test("l'ordre du chemin reste 1 à 8 quel que soit l'ordre de placement", () => {
	let state =
		createEmptyTdState();

	state =
		placeTdTower(
			state,
			{
				position: 8,
				tower:
					createTdTower({
						id: 'tower-last',
						definitionId:
							'stabilisation-n1'
					})
			}
		);

	state =
		placeTdTower(
			state,
			{
				position: 1,
				tower:
					createTdTower({
						id: 'tower-first',
						definitionId:
							'destructuration-n1'
					})
			}
		);

	assert.deepEqual(
		state.positions.map(
			(position) =>
				position.position
		),
		[1, 2, 3, 4, 5, 6, 7, 8]
	);

	assert.equal(
		state.positions[0]
			.tower?.id,
		'tower-first'
	);

	assert.equal(
		state.positions[7]
			.tower?.id,
		'tower-last'
	);
});

test("une position TD déjà occupée refuse une seconde tour", () => {
	let state =
		createEmptyTdState();

	state =
		placeTdTower(
			state,
			{
				position: 2,
				tower:
					createTdTower({
						id: 'tower-a',
						definitionId:
							'attenuation-n1'
					})
			}
		);

	assert.throws(
		() =>
			placeTdTower(
				state,
				{
					position: 2,
					tower:
						createTdTower({
							id: 'tower-b',
							definitionId:
								'captation-n1'
						})
				}
			),
		/déjà occupée/
	);
});

test("une même instance de tour ne peut pas apparaître deux fois", () => {
	let state =
		createEmptyTdState();

	const tower =
		createTdTower({
			id: 'tower-unique',
			definitionId:
				'captation-n1'
		});

	state =
		placeTdTower(
			state,
			{
				position: 3,
				tower
			}
		);

	assert.throws(
		() =>
			placeTdTower(
				state,
				{
					position: 6,
					tower
				}
			),
		/déjà placée/
	);
});

test("un chemin TD invalide ou désordonné est rejeté", () => {
	const state =
		createEmptyTdState();

	state.positions.splice(
		3,
		1
	);

	assert.equal(
		validateTdState(
			state
		).valid,
		false
	);

	const reordered =
		createEmptyTdState();

	[
		reordered.positions[0],
		reordered.positions[1]
	] = [
		reordered.positions[1],
		reordered.positions[0]
	];

	assert.equal(
		validateTdState(
			reordered
		).valid,
		false
	);
});

test("le chemin TD et ses tours survivent à la sérialisation du Corcite", () => {
	const corcite =
		createCorcite();

	corcite.td =
		placeTdTower(
			corcite.td,
			{
				position: 1,
				tower:
					createTdTower({
						id:
							'tower-serialization-a',
						definitionId:
							'destructuration-n1'
					})
			}
		);

	corcite.td =
		placeTdTower(
			corcite.td,
			{
				position: 5,
				tower:
					createTdTower({
						id:
							'tower-serialization-b',
						definitionId:
							'stabilisation-n1'
					})
			}
		);

	const restored =
		deserializeCorciteState(
			serializeCorciteState(
				corcite
			)
		);

	assert.deepEqual(
		restored.td,
		corcite.td
	);

	assert.notEqual(
		restored.td,
		corcite.td
	);
});
