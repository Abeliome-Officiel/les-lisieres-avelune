import {
	PLAYABLE_START_REFERENCE
} from '../config/playable-start-reference.js';
import {
	TF_LAB_REFERENCE
} from '../config/tf-reference.js';
import {
	createEmptyTdState
} from '../td/state.js';
import type {
	CorciteCapacities,
	CorciteIdentity,
	CorciteState,
	PlayableCorciteState,
	PopulationState,
	StructureState,
	StructureUsage
} from '../domain/corcite.js';
import {
	RESOURCE_IDS,
	emptyResourceAmounts,
	type ResourceAmounts,
	type ResourceId,
	type StorageUnitState
} from '../domain/resources.js';

function addUsage(
	total: StructureUsage,
	usage: StructureUsage
): void {
	total.energy += usage.energy;
	total.maintenance += usage.maintenance;
	total.work += usage.work;
	total.space += usage.space;
}

export function calculateStructureUsage(
	structures: readonly StructureState[]
): StructureUsage {
	const result: StructureUsage = {
		energy: 0,
		maintenance: 0,
		work: 0,
		space: 0
	};

	for (const structure of structures) {
		if (structure.status !== 'active') continue;
		addUsage(result, structure.usage);
	}

	return result;
}

export function calculatePopulationWorkCapacity(
	population: PopulationState
): number {
	return (
		population.total *
		population.workPerPopulation
	);
}

function createInitialStorageUnits(): StorageUnitState[] {
	return [
		{
			id: 'storage-1',
			structureId: 'structure-storage-1',
			name: 'Stockage N1 — A',
			capacity:
				TF_LAB_REFERENCE.storageUnitCapacityN1,
			contents: {
				R1: 4,
				R2: 2,
				R3: 2,
				R4: 0
			}
		},
		{
			id: 'storage-2',
			structureId: 'structure-storage-2',
			name: 'Stockage N1 — B',
			capacity:
				TF_LAB_REFERENCE.storageUnitCapacityN1,
			contents: {
				R1: 0,
				R2: 2,
				R3: 2,
				R4: 1
			}
		}
	];
}

function createInitialCapacities(
	structures: StructureState[]
): CorciteCapacities {
	const usage =
		calculateStructureUsage(structures);

	return {
		energy: {
			normalCapacity:
				TF_LAB_REFERENCE.capacities.energyNormal,
			used: usage.energy,
			reserveMaximum:
				TF_LAB_REFERENCE.capacities.energyReserve,
			reserveCurrent:
				TF_LAB_REFERENCE.capacities.energyReserve
		},
		maintenance: {
			capacity:
				TF_LAB_REFERENCE.capacities.maintenance,
			used: usage.maintenance
		},
		work: {
			capacity:
				TF_LAB_REFERENCE.capacities.work,
			used: usage.work
		},
		space: {
			capacity:
				TF_LAB_REFERENCE.capacities.space,
			used: usage.space
		}
	};
}

function createPlayableStorageUnits(): StorageUnitState[] {
	return [
		{
			id: 'storage-base-1',
			structureId:
				'structure-storage-base-1',
			name: 'Stockage de base',
			capacity:
				PLAYABLE_START_REFERENCE
					.baseStorageCapacity,
			contents: {
				...PLAYABLE_START_REFERENCE
					.initialStocks
			}
		}
	];
}

function createPlayableCapacities(
	structures: StructureState[],
	population: PopulationState
): CorciteCapacities {
	const usage =
		calculateStructureUsage(structures);

	return {
		energy: {
			normalCapacity:
				PLAYABLE_START_REFERENCE
					.capacities.energyNormal,
			used: usage.energy,
			reserveMaximum:
				PLAYABLE_START_REFERENCE
					.capacities.energyReserve,
			reserveCurrent:
				PLAYABLE_START_REFERENCE
					.capacities.energyReserve
		},
		maintenance: {
			capacity:
				PLAYABLE_START_REFERENCE
					.capacities.maintenance,
			used: usage.maintenance
		},
		work: {
			capacity:
				calculatePopulationWorkCapacity(
					population
				),
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

function createEmptyRpgState() {
	return {
		researches: [],
		accesses: [],
		knowledge: [],
		journal: []
	};
}

export function summarizeStoredResources(
	state: CorciteState
): ResourceAmounts {
	const totals = emptyResourceAmounts();

	for (const storage of state.storageUnits) {
		for (const resourceId of RESOURCE_IDS) {
			totals[resourceId] +=
				storage.contents[resourceId];
		}
	}

	return totals;
}

export function getStoredAmount(
	state: CorciteState,
	resourceId: ResourceId
): number {
	return summarizeStoredResources(state)[resourceId];
}

export function getReservedAmount(
	state: CorciteState,
	resourceId: ResourceId
): number {
	let total = 0;

	for (const reservation of state.reservations) {
		if (
			reservation.status === 'active' &&
			reservation.resourceId === resourceId
		) {
			total += reservation.amount;
		}
	}

	return total;
}

export function getAvailableAmount(
	state: CorciteState,
	resourceId: ResourceId
): number {
	return (
		getStoredAmount(state, resourceId) -
		getReservedAmount(state, resourceId)
	);
}

/**
 * Etat historique de laboratoire.
 *
 * Il reste la référence P0-P10 et conserve exactement sa chaîne
 * productive préinstallée et ses capacités.
 */
export function createReferenceCorciteState(
	identity: CorciteIdentity
): CorciteState {
	const structures = structuredClone(
		TF_LAB_REFERENCE.initialStructures
	) as StructureState[];

	return {
		...identity,

		// 8 habitants correspondent à l'ancienne capacité
		// de travail de laboratoire de 8.
		population: {
			total: 8,
			workPerPopulation: 1
		},

		storageUnits:
			createInitialStorageUnits(),
		structures,
		productions: [],
		td: createEmptyTdState(),
		tfNetwork: {
			connections: [],
			buffers: []
		},
		capacities:
			createInitialCapacities(structures),
		rpg: createEmptyRpgState(),
		modifiers: [],
		reservations: [],
		waveConsequences: []
	};
}

/**
 * Etat de départ du prototype miniature jouable.
 *
 * Le Corcite possède seulement son socle vital :
 * - Noyau ;
 * - stockage de base ;
 * - population initiale ;
 * - capacités vitales ;
 * - petit stock permettant les premiers arbitrages.
 *
 * Aucune chaîne productive n'est préconstruite.
 */
export function createPlayableCorciteState(
	identity: CorciteIdentity
): PlayableCorciteState {
	const structures = structuredClone(
		PLAYABLE_START_REFERENCE
			.initialStructures
	) as StructureState[];

	const population: PopulationState = {
		...PLAYABLE_START_REFERENCE.population
	};

	return {
		...identity,
		population,
		storageUnits:
			createPlayableStorageUnits(),
		structures,
		productions: [],
		td: createEmptyTdState(),
		tfNetwork: {
			connections: [],
			buffers: []
		},
		capacities:
			createPlayableCapacities(
				structures,
				population
			),
		rpg: createEmptyRpgState(),
		modifiers: [],
		reservations: [],
		waveConsequences: []
	};
}

export function snapshotCorciteState(
	state: CorciteState
): CorciteState {
	return structuredClone(state);
}
