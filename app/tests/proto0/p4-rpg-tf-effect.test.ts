import assert from 'node:assert/strict';
import test from 'node:test';

import {
	RPG_LAB_REFERENCE,
	advanceActiveRpgResearch,
	createReferenceCorciteState,
	evaluateTfRecipeOutputs,
	resolveTransformationTurn,
	startRpgResearch,
	summarizeStoredResources
} from '../../src/lib/proto0/index.js';

import {
	TF_PROCESSING_LAB_REFERENCE
} from '../../src/lib/proto0/config/tf-processing-reference.js';

function createCorcite() {
	return createReferenceCorciteState({
		id:
			'corcite-p4-rpg-tf-effect',
		name:
			'P4-RPG-TF-EFFECT',
		controller: 'human'
	});
}

function completeResearch(
	input:
		ReturnType<
			typeof createCorcite
		>
) {
	let corcite =
		startRpgResearch(
			input,
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

	return corcite;
}

function transformationRecipe() {
	const recipe =
		TF_PROCESSING_LAB_REFERENCE
			.recipes.find(
				(candidate) =>
					candidate.id ===
						'transform-r3-n1'
			);

	assert.ok(recipe);

	return recipe;
}

test("sans modificateur RPG la recette conserve sa sortie R3 de base", () => {
	const corcite =
		createCorcite();

	const effective =
		evaluateTfRecipeOutputs(
			corcite,
			transformationRecipe()
		);

	assert.equal(
		effective.outputs.R3,
		2
	);

	assert.deepEqual(
		effective.appliedModifiers,
		[]
	);
});

test("la recherche RPG achevée transforme la sortie R3 de 2 en 2.4", () => {
	const corcite =
		completeResearch(
			createCorcite()
		);

	const effective =
		evaluateTfRecipeOutputs(
			corcite,
			transformationRecipe()
		);

	assert.equal(
		effective.outputs.R3,
		2.4
	);

	assert.equal(
		effective.appliedModifiers
			.length,
		1
	);

	assert.equal(
		effective.appliedModifiers[0]
			.source,
		`research:${RPG_LAB_REFERENCE.id}`
	);
});

test("un modificateur inactif n'altère pas la recette TF", () => {
	const corcite =
		completeResearch(
			createCorcite()
		);

	corcite.modifiers[0]
		.active = false;

	const effective =
		evaluateTfRecipeOutputs(
			corcite,
			transformationRecipe()
		);

	assert.equal(
		effective.outputs.R3,
		2
	);

	assert.deepEqual(
		effective.appliedModifiers,
		[]
	);
});

test("addition puis multiplication donnent un résultat indépendant de l'ordre des modificateurs", () => {
	const first =
		createCorcite();

	first.modifiers.push(
		{
			id: 'modifier-z',
			source: 'test:multiply',
			target:
				'tf.recipe.transform-r3-n1.output.R3',
			operation: 'multiply',
			value: 1.5,
			active: true
		},
		{
			id: 'modifier-a',
			source: 'test:add',
			target:
				'tf.recipe.transform-r3-n1.output.R3',
			operation: 'add',
			value: 1,
			active: true
		}
	);

	const second =
		structuredClone(
			first
		);

	second.modifiers.reverse();

	const resultA =
		evaluateTfRecipeOutputs(
			first,
			transformationRecipe()
		);

	const resultB =
		evaluateTfRecipeOutputs(
			second,
			transformationRecipe()
		);

	assert.equal(
		resultA.outputs.R3,
		4.5
	);

	assert.equal(
		resultB.outputs.R3,
		4.5
	);

	assert.deepEqual(
		resultA,
		resultB
	);
});

test("deux Corcites identiques diffèrent mécaniquement uniquement par le choix RPG", () => {
	const withoutResearch =
		createCorcite();

	const withResearch =
		completeResearch(
			createCorcite()
		);

	const beforeWithout =
		summarizeStoredResources(
			withoutResearch
		);

	const beforeWith =
		summarizeStoredResources(
			withResearch
		);

	assert.deepEqual(
		beforeWith,
		beforeWithout
	);

	const normal =
		resolveTransformationTurn(
			withoutResearch
		);

	const researched =
		resolveTransformationTurn(
			withResearch
		);

	const normalEvent =
		normal.resolution.events.find(
			(event) =>
				event.recipeId ===
					'transform-r3-n1' &&
				event.status ===
					'produced'
		);

	const researchedEvent =
		researched.resolution.events.find(
			(event) =>
				event.recipeId ===
					'transform-r3-n1' &&
				event.status ===
					'produced'
		);

	assert.ok(normalEvent);
	assert.ok(researchedEvent);

	assert.equal(
		normalEvent.outputs.R3,
		2
	);

	assert.equal(
		researchedEvent.outputs.R3,
		2.4
	);

	assert.equal(
		researchedEvent
			.baseOutputs?.R3,
		2
	);

	assert.equal(
		researchedEvent
			.appliedModifiers
			?.length,
		1
	);

	assert.equal(
		researchedEvent
			.appliedModifiers?.[0]
			.source,
		`research:${RPG_LAB_REFERENCE.id}`
	);

	const normalStocks =
		summarizeStoredResources(
			normal.corcite
		);

	const researchedStocks =
		summarizeStoredResources(
			researched.corcite
		);

	assert.equal(
		normalStocks.R3,
		6
	);

	assert.equal(
		researchedStocks.R3,
		6.4
	);

	assert.equal(
		normalStocks.R1,
		researchedStocks.R1
	);

	assert.equal(
		normalStocks.R2,
		researchedStocks.R2
	);
});
