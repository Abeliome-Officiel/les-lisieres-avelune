import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfRecipeId
} from '../domain/tf.js';

export interface PlayableRecipePresentation {
	id: TfRecipeId;
	label: string;
	description: string;
	inputLabels:
		Partial<Record<ResourceId, string>>;
	outputLabels:
		Partial<Record<ResourceId, string>>;
}

export const PLAYABLE_RECIPE_PRESENTATIONS:
	readonly PlayableRecipePresentation[] = [
	{
		id: 'transform-r3-n1',
		label: 'Transformation primaire',
		description:
			'Combine matière organique et matière minérale pour produire un matériau transformé.',
		inputLabels: {
			R1: 'Matière organique brute',
			R2: 'Matière minérale brute'
		},
		outputLabels: {
			R3: 'Matériau transformé'
		}
	},
	{
		id: 'fabricate-r4-n1',
		label: 'Fabrication de composant',
		description:
			'Utilise le matériau transformé pour fabriquer un composant.',
		inputLabels: {
			R3: 'Matériau transformé'
		},
		outputLabels: {
			R4: 'Composant fabriqué'
		}
	}
] as const;

export function getPlayableRecipePresentation(
	id: TfRecipeId
): PlayableRecipePresentation {
	const definition =
		PLAYABLE_RECIPE_PRESENTATIONS.find(
			(candidate) =>
				candidate.id === id
		);

	if (!definition) {
		throw new Error(
			`Recette jouable inconnue : ${id}.`
		);
	}

	return definition;
}
