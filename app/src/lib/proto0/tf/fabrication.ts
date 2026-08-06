import {
	TF_PROCESSING_LAB_REFERENCE,
	type TfProcessingConfiguration
} from '../config/tf-processing-reference.js';
import type {
	CorciteState,
	StructureState
} from '../domain/corcite.js';
import { isStructureOperational } from '../domain/corcite.js';
import {
	RESOURCE_IDS,
	type ResourceId
} from '../domain/resources.js';
import type {
	TfBufferConsumptionMovement,
	TfBufferInputBudget,
	TfProcessingEvent,
	TfProcessingResolution,
	TfRecipeDefinition,
	TfResourceMovement
} from '../domain/tf.js';
import {
	captureTfBufferInputBudget,
	consumeTfInputDeterministically,
	getEligibleIncomingBufferAmount
} from './input-consumption.js';
import {
	evaluateTfRecipeOutputs
} from './modifiers.js';
import {
	tryPlaceTfOutput
} from './output-placement.js';
import {
	getTotalAvailableResource
} from './storage.js';

export interface TfFabricationTurnResult {
	corcite: CorciteState;
	resolution: TfProcessingResolution;
}

function amountFor(
	values: Partial<Record<ResourceId, number>>,
	resourceId: ResourceId
): number {
	return values[resourceId] ?? 0;
}

function matchingStructures(
	state: CorciteState,
	recipe: TfRecipeDefinition
): StructureState[] {
	return [...state.structures]
		.filter(
			(structure) =>
				structure.kind ===
					recipe.structureKind
		)
		.sort(
			(a, b) =>
				a.id.localeCompare(b.id)
		);
}

function canSupplyAll(
	state: CorciteState,
	budget: Readonly<TfBufferInputBudget>,
	recipe: TfRecipeDefinition,
	structures: readonly StructureState[]
): boolean {
	for (const resourceId of RESOURCE_IDS) {
		let sharedStorageRequired = 0;

		for (const structure of structures) {
			const required =
				amountFor(
					recipe.inputs,
					resourceId
				);

			if (required <= 0) {
				continue;
			}

			const fromBuffers =
				getEligibleIncomingBufferAmount(
					state,
					budget,
					structure.id,
					resourceId
				);

			sharedStorageRequired +=
				Math.max(
					0,
					required - fromBuffers
				);
		}

		if (
			sharedStorageRequired >
			getTotalAvailableResource(
				state,
				resourceId
			)
		) {
			return false;
		}
	}

	return true;
}

function blockedEvent(
	structure: StructureState,
	recipe: TfRecipeDefinition,
	status:
		| 'input-blocked'
		| 'input-conflict',
	message: string
): TfProcessingEvent {
	return {
		structureId: structure.id,
		recipeId: recipe.id,
		status,
		inputs:
			structuredClone(
				recipe.inputs
			),
		outputs:
			structuredClone(
				recipe.outputs
			),
		consumptions: [],
		bufferConsumptions: [],
		placements: [],
		networkMovements: [],
		message
	};
}

function executeRecipe(
	state: CorciteState,
	inputBudget: TfBufferInputBudget,
	structure: StructureState,
	recipe: TfRecipeDefinition
): {
	state: CorciteState;
	inputBudget: TfBufferInputBudget;
	event: TfProcessingEvent;
} {
	const effective =
		evaluateTfRecipeOutputs(
			state,
			recipe
		);

	const working =
		structuredClone(state);

	const workingBudget =
		structuredClone(
			inputBudget
		);

	const consumptions:
		TfResourceMovement[] = [];

	const bufferConsumptions:
		TfBufferConsumptionMovement[] = [];

	for (const resourceId of RESOURCE_IDS) {
		const amount =
			amountFor(
				recipe.inputs,
				resourceId
			);

		if (amount <= 0) continue;

		const consumed =
			consumeTfInputDeterministically(
				working,
				workingBudget,
				structure.id,
				resourceId,
				amount
			);

		consumptions.push(
			...consumed.storageConsumptions
		);

		bufferConsumptions.push(
			...consumed.bufferConsumptions
		);
	}

	let outputState =
		working;

	const placements:
		TfResourceMovement[] = [];

	const networkMovements = [];

	for (const resourceId of RESOURCE_IDS) {
		const amount =
			amountFor(
				effective.outputs,
				resourceId
			);

		if (amount <= 0) continue;

		const placement =
			tryPlaceTfOutput(
				outputState,
				structure.id,
				resourceId,
				amount
			);

		if (!placement.success) {
			return {
				state,
				inputBudget,
				event: {
					structureId:
						structure.id,
					recipeId:
						recipe.id,
					status:
						'storage-blocked',
					inputs:
						structuredClone(
							recipe.inputs
						),
					outputs:
						structuredClone(
							effective.outputs
						),
					baseOutputs:
						structuredClone(
							recipe.outputs
						),
					appliedModifiers:
						structuredClone(
							effective.appliedModifiers
						),
					consumptions: [],
					bufferConsumptions: [],
					placements: [],
					networkMovements: [],
					message:
						`${structure.name} bloqué : capacité combinée tampons + stockage insuffisante.`
				}
			};
		}

		outputState =
			placement.corcite;

		placements.push(
			...placement.storagePlacements
		);

		networkMovements.push(
			...placement.routing.movements
		);
	}

	return {
		state: outputState,
		inputBudget:
			workingBudget,
		event: {
			structureId: structure.id,
			recipeId: recipe.id,
			status: 'produced',
			inputs:
				structuredClone(
					recipe.inputs
				),
			outputs:
				structuredClone(
					effective.outputs
				),
			baseOutputs:
				structuredClone(
					recipe.outputs
				),
			appliedModifiers:
				structuredClone(
					effective.appliedModifiers
				),
			consumptions,
			bufferConsumptions,
			placements,
			networkMovements,
			message:
				`${structure.name} exécute ${recipe.id}.`
		}
	};
}

export function resolveFabricationTurn(
	inputState: CorciteState,
	config: TfProcessingConfiguration =
		TF_PROCESSING_LAB_REFERENCE,
	inputBudget: TfBufferInputBudget =
		captureTfBufferInputBudget(
			inputState
		)
): TfFabricationTurnResult {
	let state =
		structuredClone(inputState);

	let budget =
		structuredClone(
			inputBudget
		);

	const events:
		TfProcessingEvent[] = [];

	const recipes =
		[...config.recipes]
			.filter(
				(recipe) =>
					recipe.structureKind ===
						'fabricator-n1'
			)
			.sort(
				(a, b) =>
					a.id.localeCompare(
						b.id
					)
			);

	for (const recipe of recipes) {
		const structures =
			matchingStructures(
				state,
				recipe
			);

		const active =
			structures.filter(
				(structure) => isStructureOperational(structure)
			);

		for (const structure of structures) {
			if (
				isStructureOperational(structure)
			) {
				continue;
			}

			events.push({
				structureId:
					structure.id,
				recipeId: recipe.id,
				status: 'inactive',
				inputs:
					structuredClone(
						recipe.inputs
					),
				outputs:
					structuredClone(
						recipe.outputs
					),
				consumptions: [],
				bufferConsumptions: [],
				placements: [],
				networkMovements: [],
				message:
					`${structure.name} est inactif.`
			});
		}

		if (active.length === 0) {
			continue;
		}

		if (
			!canSupplyAll(
				state,
				budget,
				recipe,
				active
			)
		) {
			const status =
				active.length > 1
					? 'input-conflict'
					: 'input-blocked';

			for (const structure of active) {
				events.push(
					blockedEvent(
						structure,
						recipe,
						status,
						status ===
							'input-conflict'
							? `${structure.name} bloqué : intrants insuffisants pour servir équitablement toutes les unités concurrentes.`
							: `${structure.name} bloqué : intrants insuffisants.`
					)
				);
			}

			continue;
		}

		for (const structure of active) {
			const executed =
				executeRecipe(
					state,
					budget,
					structure,
					recipe
				);

			state =
				executed.state;

			budget =
				executed.inputBudget;

			events.push(
				executed.event
			);
		}
	}

	return {
		corcite: state,
		resolution: {
			events
		}
	};
}
