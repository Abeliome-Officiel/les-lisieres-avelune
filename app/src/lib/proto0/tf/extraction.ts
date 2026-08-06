import {
	TF_EXTRACTION_LAB_REFERENCE,
	type TfExtractionConfiguration
} from '../config/tf-extraction-reference.js';
import type {
	CorciteState,
	StructureState
} from '../domain/corcite.js';
import type {
	TfExtractionEvent,
	TfExtractionResolution,
	TfExtractionRule,
	TfSourceDefinition
} from '../domain/tf.js';
import {
	tryPlaceTfOutput
} from './output-placement.js';

export interface TfExtractionTurnResult {
	corcite: CorciteState;
	resolution: TfExtractionResolution;
}

function findSource(
	config: TfExtractionConfiguration,
	rule: TfExtractionRule
): TfSourceDefinition {
	const source = config.sources.find(
		(candidate) =>
			candidate.id ===
				rule.sourceId
	);

	if (!source) {
		throw new Error(
			`Source TF introuvable : ${rule.sourceId}.`
		);
	}

	return source;
}

function matchingRule(
	config: TfExtractionConfiguration,
	structure: StructureState
): TfExtractionRule | undefined {
	return config.rules.find(
		(rule) =>
			rule.extractorKind ===
				structure.kind
	);
}

function createInactiveEvent(
	structure: StructureState,
	rule: TfExtractionRule,
	source: TfSourceDefinition
): TfExtractionEvent {
	return {
		structureId: structure.id,
		sourceId: source.id,
		resourceId: source.resourceId,
		requestedOutput: 0,
		producedOutput: 0,
		status: 'inactive',
		placements: [],
		networkMovements: [],
		message:
			`${structure.name} est inactif : aucune extraction.`
	};
}

export function resolveExtractionTurn(
	inputState: CorciteState,
	config: TfExtractionConfiguration =
		TF_EXTRACTION_LAB_REFERENCE
): TfExtractionTurnResult {
	let state =
		structuredClone(inputState);

	const events:
		TfExtractionEvent[] = [];

	const extractors =
		[...state.structures]
			.filter(
				(structure) =>
					matchingRule(
						config,
						structure
					) !== undefined
			)
			.sort(
				(a, b) =>
					a.id.localeCompare(
						b.id
					)
			);

	for (const structure of extractors) {
		const rule =
			matchingRule(
				config,
				structure
			);

		if (!rule) {
			throw new Error(
				`Règle d'extraction absente pour ${structure.id}.`
			);
		}

		const source =
			findSource(
				config,
				rule
			);

		if (
			structure.status !==
				'active'
		) {
			events.push(
				createInactiveEvent(
					structure,
					rule,
					source
				)
			);

			continue;
		}

		const output = Math.min(
			source.potentialPerTurn,
			rule.capacityPerTurn
		);

		const placement =
			tryPlaceTfOutput(
				state,
				structure.id,
				source.resourceId,
				output
			);

		if (!placement.success) {
			events.push({
				structureId:
					structure.id,
				sourceId:
					source.id,
				resourceId:
					source.resourceId,
				requestedOutput:
					output,
				producedOutput: 0,
				status:
					'storage-blocked',
				placements: [],
				networkMovements: [],
				message:
					`${structure.name} bloqué : capacité combinée tampons + stockage insuffisante pour ${output} ${source.resourceId}.`
			});

			continue;
		}

		state =
			placement.corcite;

		events.push({
			structureId:
				structure.id,
			sourceId: source.id,
			resourceId:
				source.resourceId,
			requestedOutput:
				output,
			producedOutput:
				output,
			status: 'produced',
			placements:
				placement.storagePlacements,
			networkMovements:
				placement.routing
					.movements,
			message:
				`${structure.name} produit ${output} ${source.resourceId}.`
		});
	}

	return {
		corcite: state,
		resolution: {
			events
		}
	};
}
