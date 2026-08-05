export const RESOURCE_IDS = ['R1', 'R2', 'R3', 'R4'] as const;

export type ResourceId = (typeof RESOURCE_IDS)[number];

export type ResourceAmounts = Record<ResourceId, number>;

export interface StorageUnitState {
	id: string;
	structureId: string;
	name: string;
	capacity: number;
	contents: ResourceAmounts;

	/**
	 * Matière issue des vagues, conservée physiquement mais
	 * pas encore identifiée comme une ressource TF exploitable.
	 *
	 * Optionnel pour préserver les états historiques P0-P10.
	 */
	unanalysedWaveMatter?: number;
}

export interface WaveMatterStoragePlacement {
        storageUnitId: string;
        amount: number;
}

export interface ResourceReservation {
	id: string;
	operationId: string;
	storageUnitId: string;
	resourceId: ResourceId;
	amount: number;
	purpose: string;
	status: 'active' | 'released' | 'consumed';
}

export function emptyResourceAmounts(): ResourceAmounts {
	return {
		R1: 0,
		R2: 0,
		R3: 0,
		R4: 0
	};
}
