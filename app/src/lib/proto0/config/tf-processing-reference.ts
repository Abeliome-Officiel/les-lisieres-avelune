import type {
	TfRecipeDefinition
} from '../domain/tf.js';

export interface TfProcessingConfiguration {
	recipes: readonly TfRecipeDefinition[];
}

export const TF_PROCESSING_LAB_REFERENCE:
	TfProcessingConfiguration = {
		recipes: [
			{
				id: 'transform-r3-n1',
				structureKind:
					'transformer-n1',
				inputs: {
					R1: 2,
					R2: 2
				},
				outputs: {
					R3: 2
				},
				durationTurns: 1
			},
			{
				id: 'fabricate-r4-n1',
				structureKind:
					'fabricator-n1',
				inputs: {
					R3: 2
				},
				outputs: {
					R4: 1
				},
				durationTurns: 1
			}
		]
	};
