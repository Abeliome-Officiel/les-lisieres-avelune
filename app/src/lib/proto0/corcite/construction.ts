import {
	PLAYABLE_START_REFERENCE
} from '../config/playable-start-reference.js';
import {
	getPlayableConstructionDefinition,
	type PlayableConstructionDefinition,
	type PlayableConstructionDefinitionId
} from '../config/playable-construction-reference.js';
import type {
	CorciteState,
	PlayableCorciteState,
	StructureState
} from '../domain/corcite.js';
import {
	emptyResourceAmounts,
	RESOURCE_IDS,
	type ResourceAmounts,
	type StorageUnitState
} from '../domain/resources.js';
import type {
	PlayerOperation,
	ResourceCosts,
	TurnPlan
} from '../domain/turn.js';
import {
	commitOperationReservations,
	type CommittedReservationConsumption
} from '../turn/commit.js';
import {
	getAvailableAmount
} from './state.js';
import {
	validateCorciteState
} from './validate.js';

export interface ConstructionCapacitySnapshot {
	energyNormal: number;
	energyMaximumWithReserve: number;
	energyUsed: number;
	maintenanceCapacity: number;
	maintenanceUsed: number;
	workCapacity: number;
	workUsed: number;
	spaceCapacity: number;
	spaceUsed: number;
	storageCapacity: number;
}

export interface ConstructionPreview {
	definition: PlayableConstructionDefinition;
	canConstruct: boolean;
	blockers: string[];
	before: ConstructionCapacitySnapshot;
	after: ConstructionCapacitySnapshot;
	availableResources: ResourceAmounts;
}

export interface CommitPlayableConstructionResult {
	corcite: PlayableCorciteState;
	definition: PlayableConstructionDefinition;
	structure: StructureState;
	storageUnit?: StorageUnitState;
	consumptions: CommittedReservationConsumption[];
}

function requirePlayableCorciteState(
	state: CorciteState
): PlayableCorciteState {
	if (state.population === undefined) {
		throw new Error(
			"Cette opération nécessite un Corcite jouable avec une population."
		);
	}

	return state as PlayableCorciteState;
}

function sumStorageCapacity(
	state: PlayableCorciteState
): number {
	return state.storageUnits.reduce(
		(total, storage) =>
			total + storage.capacity,
		0
	);
}

function countActiveKind(
	state: PlayableCorciteState,
	kind: StructureState['kind']
): number {
	return state.structures.filter(
		(structure) =>
			structure.kind === kind &&
			structure.status === 'active'
	).length;
}

/**
 * Recalcule les capacités du Corcite jouable depuis son socle,
 * sa population et les extensions réellement construites.
 */
export function recalculatePlayableCapacities(
	state: PlayableCorciteState
): void {
	let energyNormal =
		PLAYABLE_START_REFERENCE.capacities.energyNormal;

	let energyReserveMaximum =
		PLAYABLE_START_REFERENCE.capacities.energyReserve;

	let maintenance =
		PLAYABLE_START_REFERENCE.capacities.maintenance;

	for (const structure of state.structures) {
		if (structure.status !== 'active') continue;

		if (
			structure.kind ===
			'energy-extension-n1'
		) {
			const definition =
				getPlayableConstructionDefinition(
					'energy-extension'
				);

			energyNormal +=
				definition.grants.energyNormal ?? 0;

			energyReserveMaximum +=
				definition.grants.energyReserve ?? 0;
		}

		if (
			structure.kind ===
			'maintenance-extension-n1'
		) {
			const definition =
				getPlayableConstructionDefinition(
					'maintenance-unit'
				);

			maintenance +=
				definition.grants.maintenance ?? 0;
		}
	}

	const usage = state.structures.reduce(
		(total, structure) => {
			if (structure.status !== 'active') {
				return total;
			}

			total.energy += structure.usage.energy;
			total.maintenance +=
				structure.usage.maintenance;
			total.work += structure.usage.work;
			total.space += structure.usage.space;

			return total;
		},
		{
			energy: 0,
			maintenance: 0,
			work: 0,
			space: 0
		}
	);

	const previousReserveMaximum =
		state.capacities.energy.reserveMaximum;

	const previousReserveCurrent =
		state.capacities.energy.reserveCurrent;

	const reserveIncrease =
		Math.max(
			0,
			energyReserveMaximum -
				previousReserveMaximum
		);

	state.capacities = {
		energy: {
			normalCapacity: energyNormal,
			used: usage.energy,
			reserveMaximum:
				energyReserveMaximum,
			reserveCurrent:
				Math.min(
					energyReserveMaximum,
					previousReserveCurrent +
						reserveIncrease
				)
		},
		maintenance: {
			capacity: maintenance,
			used: usage.maintenance
		},
		work: {
			capacity:
				state.population.total *
				state.population.workPerPopulation,
			used: usage.work
		},
		space: {
			capacity:
				PLAYABLE_START_REFERENCE
					.capacities.space,
			used: usage.space
		}
	};
}

function snapshotCapacities(
	state: PlayableCorciteState
): ConstructionCapacitySnapshot {
	return {
		energyNormal:
			state.capacities.energy.normalCapacity,
		energyMaximumWithReserve:
			state.capacities.energy.normalCapacity +
			state.capacities.energy.reserveCurrent,
		energyUsed:
			state.capacities.energy.used,
		maintenanceCapacity:
			state.capacities.maintenance.capacity,
		maintenanceUsed:
			state.capacities.maintenance.used,
		workCapacity:
			state.capacities.work.capacity,
		workUsed:
			state.capacities.work.used,
		spaceCapacity:
			state.capacities.space.capacity,
		spaceUsed:
			state.capacities.space.used,
		storageCapacity:
			sumStorageCapacity(state)
	};
}

function availableResources(
	state: PlayableCorciteState
): ResourceAmounts {
	const result = emptyResourceAmounts();

	for (const resourceId of RESOURCE_IDS) {
		result[resourceId] =
			getAvailableAmount(
				state,
				resourceId
			);
	}

	return result;
}

function createPreviewStructure(
	state: PlayableCorciteState,
	definition: PlayableConstructionDefinition
): StructureState {
	const count =
		state.structures.filter(
			(structure) =>
				structure.kind ===
				definition.structureKind
		).length + 1;

	return {
		id:
			`preview-${definition.id}-${count}`,
		kind: definition.structureKind,
		name: definition.label,
		status: 'active',
		usage: structuredClone(
			definition.usage
		)
	};
}

function simulateConstruction(
	state: PlayableCorciteState,
	definition: PlayableConstructionDefinition
): PlayableCorciteState {
	const result =
		structuredClone(state);

	result.structures.push(
		createPreviewStructure(
			result,
			definition
		)
	);

	if (
		definition.grants.storageCapacity !==
		undefined
	) {
		result.storageUnits.push({
			id: 'preview-storage',
			structureId:
				result.structures.at(-1)?.id ??
				'preview-storage-structure',
			name: definition.label,
			capacity:
				definition.grants.storageCapacity,
			contents: emptyResourceAmounts()
		});
	}

	recalculatePlayableCapacities(result);

	return result;
}

export function previewPlayableConstruction(
	state: PlayableCorciteState,
	definitionId: PlayableConstructionDefinitionId
): ConstructionPreview {
	const definition =
		getPlayableConstructionDefinition(
			definitionId
		);

	const resources =
		availableResources(state);

	const blockers: string[] = [];

	for (const resourceId of RESOURCE_IDS) {
		const cost =
			definition.resourceCosts[
				resourceId
			] ?? 0;

		if (cost > resources[resourceId]) {
			blockers.push(
				`Ressource insuffisante : ${PLAYABLE_START_REFERENCE.resourceLabels[resourceId]} (${resources[resourceId]}/${cost}).`
			);
		}
	}

	const simulated =
		simulateConstruction(
			state,
			definition
		);

	const before =
		snapshotCapacities(state);

	const after =
		snapshotCapacities(simulated);

	/*
	 * Première politique jouable :
	 * - espace et travail sont des limites dures ;
	 * - entretien ne peut pas être volontairement dépassé
	 *   avant l'implémentation du déficit progressif ;
	 * - l'énergie peut utiliser la réserve courte.
	 *
	 * Le lot Énergie / Entretien / Population affinera ensuite
	 * la consommation réelle de réserve et les déficits.
	 */
	if (
		after.spaceUsed >
		after.spaceCapacity
	) {
		blockers.push(
			`Espace insuffisant (${after.spaceUsed}/${after.spaceCapacity}).`
		);
	}

	if (
		after.workUsed >
		after.workCapacity
	) {
		blockers.push(
			`Travail insuffisant (${after.workUsed}/${after.workCapacity}).`
		);
	}

	if (
		after.maintenanceUsed >
		after.maintenanceCapacity
	) {
		blockers.push(
			`Entretien insuffisant (${after.maintenanceUsed}/${after.maintenanceCapacity}).`
		);
	}

	if (
		after.energyUsed >
		after.energyMaximumWithReserve
	) {
		blockers.push(
			`Énergie insuffisante (${after.energyUsed}/${after.energyMaximumWithReserve}, réserve comprise).`
		);
	}

	return {
		definition,
		canConstruct:
			blockers.length === 0,
		blockers,
		before,
		after,
		availableResources: resources
	};
}

function sameCosts(
	actual: ResourceCosts,
	expected: ResourceCosts
): boolean {
	return RESOURCE_IDS.every(
		(resourceId) =>
			(actual[resourceId] ?? 0) ===
			(expected[resourceId] ?? 0)
	);
}

export function createPlayableConstructionOperation(
	definitionId: PlayableConstructionDefinitionId,
	operationId: string,
	priority = 0
): PlayerOperation {
	if (!operationId.trim()) {
		throw new Error(
			"La construction doit posséder un identifiant d'opération."
		);
	}

	const definition =
		getPlayableConstructionDefinition(
			definitionId
		);

	return {
		id: operationId,
		label:
			`Construire : ${definition.label}`,
		kind: 'resource-demand',
		priority,
		resourceCosts:
			structuredClone(
				definition.resourceCosts
			),
		status: 'pending'
	};
}

function nextInstanceNumber(
	state: PlayableCorciteState,
	definition: PlayableConstructionDefinition
): number {
	return (
		state.structures.filter(
			(structure) =>
				structure.kind ===
				definition.structureKind
		).length + 1
	);
}

export function commitPlayableConstruction(
	inputState: CorciteState,
	plan: TurnPlan,
	operationId: string,
	definitionId: PlayableConstructionDefinitionId
): CommitPlayableConstructionResult {
	const definition =
		getPlayableConstructionDefinition(
			definitionId
		);

	const operation =
		plan.operations.find(
			(candidate) =>
				candidate.id === operationId
		);

	if (!operation) {
		throw new Error(
			`Opération de construction introuvable : ${operationId}.`
		);
	}

	if (operation.status !== 'reserved') {
		throw new Error(
			`La construction ${operationId} n'est pas réservée.`
		);
	}

	if (
		!sameCosts(
			operation.resourceCosts,
			definition.resourceCosts
		)
	) {
		throw new Error(
			`Les coûts réservés pour ${operationId} ne correspondent pas au catalogue.`
		);
	}

	const playableInputState =
		requirePlayableCorciteState(
			inputState
		);

	const preview =
		previewPlayableConstruction(
			playableInputState,
			definitionId
		);

	/*
	 * Les ressources de cette opération sont déjà réservées
	 * dans inputState. Le preview les voit donc comme indisponibles.
	 * Les blocages de ressources sont contrôlés par P2.
	 * Ici, seuls les blocages de capacité doivent encore être retenus.
	 */
	const capacityBlockers =
		preview.blockers.filter(
			(blocker) =>
				!blocker.startsWith(
					'Ressource insuffisante'
				)
		);

	if (capacityBlockers.length > 0) {
		throw new Error(
			`Construction impossible : ${capacityBlockers.join(' | ')}`
		);
	}

	const committed =
		commitOperationReservations(
			inputState,
			operationId
		);

	const state =
		requirePlayableCorciteState(
			committed.corcite
		);

	const instance =
		nextInstanceNumber(
			state,
			definition
		);

	const structure: StructureState = {
		id:
			`structure-${definition.id}-${instance}`,
		kind: definition.structureKind,
		name:
			instance === 1
				? definition.label
				: `${definition.label} ${instance}`,
		status: 'active',
		usage:
			structuredClone(
				definition.usage
			)
	};

	state.structures.push(structure);

	let storageUnit:
		| StorageUnitState
		| undefined;

	if (
		definition.grants.storageCapacity !==
		undefined
	) {
		const storageNumber =
			state.storageUnits.length + 1;

		storageUnit = {
			id:
				`storage-built-${storageNumber}`,
			structureId:
				structure.id,
			name:
				`Stockage ${storageNumber}`,
			capacity:
				definition.grants
					.storageCapacity,
			contents:
				emptyResourceAmounts()
		};

		state.storageUnits.push(
			storageUnit
		);
	}

	recalculatePlayableCapacities(state);

	const validation =
		validateCorciteState(state);

	if (!validation.valid) {
		throw new Error(
			`Etat Corcite invalide après construction : ${validation.errors.join(' | ')}`
		);
	}

	return {
		corcite: state,
		definition,
		structure,
		storageUnit,
		consumptions:
			committed.consumptions
	};
}
