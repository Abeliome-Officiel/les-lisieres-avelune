import type {
	TfExtractionRule,
	TfSourceDefinition
} from '../domain/tf.js';

export interface TfExtractionConfiguration {
	sources: readonly TfSourceDefinition[];
	rules: readonly TfExtractionRule[];
}

export const TF_EXTRACTION_LAB_REFERENCE: TfExtractionConfiguration = {
	sources: [
		{
			id: 'source-a',
			resourceId: 'R1',
			potentialPerTurn: 3,
			nonDepleting: true
		},
		{
			id: 'source-b',
			resourceId: 'R2',
			potentialPerTurn: 3,
			nonDepleting: true
		}
	],
	rules: [
		{
			sourceId: 'source-a',
			extractorKind: 'extractor-a-n1',
			capacityPerTurn: 2
		},
		{
			sourceId: 'source-b',
			extractorKind: 'extractor-b-n1',
			capacityPerTurn: 2
		}
	]
};
