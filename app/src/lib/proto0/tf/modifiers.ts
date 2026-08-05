import type {
	CorciteState
} from '../domain/corcite.js';
import {
	RESOURCE_IDS,
	type ResourceId
} from '../domain/resources.js';
import type {
	TfAppliedModifier,
	TfRecipeDefinition
} from '../domain/tf.js';

export interface TfEffectiveRecipeOutputs {
	outputs:
		Partial<
			Record<
				ResourceId,
				number
			>
		>;
	appliedModifiers:
		TfAppliedModifier[];
}

function amountFor(
	values:
		Partial<
			Record<
				ResourceId,
				number
			>
		>,
	resourceId: ResourceId
): number {
	return values[resourceId] ?? 0;
}

function targetFor(
	recipeId: string,
	resourceId: ResourceId
): string {
	return [
		'tf.recipe',
		recipeId,
		'output',
		resourceId
	].join('.');
}

export function evaluateTfRecipeOutputs(
	state: CorciteState,
	recipe: TfRecipeDefinition
): TfEffectiveRecipeOutputs {
	const outputs:
		Partial<
			Record<
				ResourceId,
				number
			>
		> = {};

	const appliedModifiers:
		TfAppliedModifier[] = [];

	for (
		const resourceId of
		RESOURCE_IDS
	) {
		const base =
			amountFor(
				recipe.outputs,
				resourceId
			);

		if (base <= 0) {
			continue;
		}

		const target =
			targetFor(
				recipe.id,
				resourceId
			);

		const modifiers =
			state.modifiers
				.filter(
					(modifier) =>
						modifier.active &&
						modifier.target ===
							target
				)
				.sort(
					(a, b) =>
						a.id.localeCompare(
							b.id
						)
				);

		let additive = 0;
		let multiplier = 1;

		for (
			const modifier of
			modifiers
		) {
			if (
				modifier.operation ===
					'add'
			) {
				additive +=
					modifier.value;
			} else {
				multiplier *=
					modifier.value;
			}

			appliedModifiers.push({
				id:
					modifier.id,
				source:
					modifier.source,
				target:
					modifier.target,
				operation:
					modifier.operation,
				value:
					modifier.value
			});
		}

		const effective =
			(base + additive) *
			multiplier;

		if (
			!Number.isFinite(
				effective
			) ||
			effective < 0
		) {
			throw new Error(
				`Sortie TF effective invalide pour ${recipe.id}/${resourceId} : ${effective}.`
			);
		}

		outputs[resourceId] =
			effective;
	}

	return {
		outputs,
		appliedModifiers
	};
}
