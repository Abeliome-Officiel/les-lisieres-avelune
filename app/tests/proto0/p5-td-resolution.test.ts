import assert from 'node:assert/strict';
import test from 'node:test';

import {
	applyTdTowerEffect,
	createEmptyTdState,
	createTdTower,
	placeTdTower,
	resolveTdPath
} from '../../src/lib/proto0/index.js';

import type {
	TdTowerDefinitionId
} from '../../src/lib/proto0/domain/td.js';

const NOMINAL_WAVE = {
	pressure: 50,
	structure: 60,
	charge: 20,
	capturableMatter: 16
};

function closeTo(
	actual: number,
	expected: number,
	epsilon = 1e-9
): void {
	assert.ok(
		Math.abs(
			actual -
				expected
		) <= epsilon,
		`${actual} != ${expected}`
	);
}

function createPath(
	definitions:
		readonly TdTowerDefinitionId[]
) {
	let state =
		createEmptyTdState();

	definitions.forEach(
		(
			definitionId,
			index
		) => {
			state =
				placeTdTower(
					state,
					{
						position:
							index + 1,
						tower:
							createTdTower({
								id:
									`tower-${index + 1}`,
								definitionId
							})
					}
				);
		}
	);

	return state;
}

test("Atténuation N1 transforme pression, structure et matière capturable", () => {
	const result =
		applyTdTowerEffect(
			'attenuation',
			NOMINAL_WAVE
		);

	closeTo(
		result.wave.pressure,
		42
	);

	closeTo(
		result.wave.structure,
		61.5
	);

	closeTo(
		result.wave.charge,
		20
	);

	closeTo(
		result.wave
			.capturableMatter,
		15.36
	);

	closeTo(
		result.effect
			.capturedMatter,
		0
	);
});

test("Déstructuration N1 réduit la structure avec contre-effets pression et charge", () => {
	const result =
		applyTdTowerEffect(
			'destructuration',
			NOMINAL_WAVE
		);

	closeTo(
		result.wave.pressure,
		49.6
	);

	closeTo(
		result.wave.structure,
		52
	);

	closeTo(
		result.wave.charge,
		23
	);

	closeTo(
		result.wave
			.capturableMatter,
		16
	);
});

test("Captation N1 retire réellement de la matière capturable", () => {
	const result =
		applyTdTowerEffect(
			'captation',
			NOMINAL_WAVE
		);

	closeTo(
		result.effect
			.capturedMatter,
		3.5
	);

	closeTo(
		result.wave
			.capturableMatter,
		12.5
	);

	closeTo(
		result.wave.pressure,
		49.475
	);

	closeTo(
		result.wave.charge,
		20.8
	);
});

test("Stabilisation N1 neutralise une fraction de charge mais restitue un peu de pression", () => {
	const result =
		applyTdTowerEffect(
			'stabilisation',
			NOMINAL_WAVE
		);

	closeTo(
		result.wave.charge,
		14
	);

	closeTo(
		result.wave.structure,
		64
	);

	closeTo(
		result.wave.pressure,
		51.2
	);

	closeTo(
		result.wave
			.capturableMatter,
		16
	);
});

test("la résolution journalise avant, effet et après pour les huit positions", () => {
	const path =
		createPath([
			'attenuation-n1',
			'destructuration-n1',
			'captation-n1',
			'stabilisation-n1'
		]);

	const result =
		resolveTdPath(
			path,
			NOMINAL_WAVE
		);

	assert.equal(
		result.steps.length,
		8
	);

	assert.deepEqual(
		result.steps.map(
			(step) =>
				step.position
		),
		[1, 2, 3, 4, 5, 6, 7, 8]
	);

	for (
		let index = 0;
		index <
			result.steps.length -
				1;
		index += 1
	) {
		assert.deepEqual(
			result.steps[index]
				.after,
			result.steps[index + 1]
				.before
		);
	}

	assert.deepEqual(
		result.steps[7]
			.before,
		result.steps[7]
			.after
	);

	assert.deepEqual(
		result.steps[7]
			.effect,
		{
			pressure: 0,
			structure: 0,
			charge: 0,
			capturableMatter: 0,
			capturedMatter: 0
		}
	);
});

test("les quatre variables sont transformées progressivement sur le chemin", () => {
	const result =
		resolveTdPath(
			createPath([
				'attenuation-n1',
				'destructuration-n1',
				'captation-n1',
				'stabilisation-n1'
			]),
			NOMINAL_WAVE
		);

	assert.notEqual(
		result.finalWave
			.pressure,
		NOMINAL_WAVE.pressure
	);

	assert.notEqual(
		result.finalWave
			.structure,
		NOMINAL_WAVE.structure
	);

	assert.notEqual(
		result.finalWave
			.charge,
		NOMINAL_WAVE.charge
	);

	assert.notEqual(
		result.finalWave
			.capturableMatter,
		NOMINAL_WAVE
			.capturableMatter
	);

	assert.ok(
		result.capturedMatter >
			0
	);
});

test("une captation après déstructuration capture davantage qu'avant déstructuration", () => {
	const captureFirst =
		resolveTdPath(
			createPath([
				'captation-n1',
				'destructuration-n1'
			]),
			NOMINAL_WAVE
		);

	const destructureFirst =
		resolveTdPath(
			createPath([
				'destructuration-n1',
				'captation-n1'
			]),
			NOMINAL_WAVE
		);

	assert.ok(
		destructureFirst
			.capturedMatter >
			captureFirst
				.capturedMatter
	);
});

test("le même ensemble de tours dans un ordre différent produit un résultat différent", () => {
	const orderA =
		resolveTdPath(
			createPath([
				'attenuation-n1',
				'destructuration-n1',
				'captation-n1',
				'stabilisation-n1'
			]),
			NOMINAL_WAVE
		);

	const orderB =
		resolveTdPath(
			createPath([
				'destructuration-n1',
				'captation-n1',
				'attenuation-n1',
				'stabilisation-n1'
			]),
			NOMINAL_WAVE
		);

	assert.notDeepEqual(
		orderA.finalWave,
		orderB.finalWave
	);

	assert.notEqual(
		orderA.capturedMatter,
		orderB.capturedMatter
	);

	assert.deepEqual(
		orderA.steps
			.filter(
				(step) =>
					step.tower
			)
			.map(
				(step) =>
					step.tower
						?.definitionId
			)
			.sort(),
		orderB.steps
			.filter(
				(step) =>
					step.tower
			)
			.map(
				(step) =>
					step.tower
						?.definitionId
			)
			.sort()
	);
});
