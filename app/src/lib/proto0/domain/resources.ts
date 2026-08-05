export const RESOURCE_IDS = ['R1', 'R2', 'R3', 'R4'] as const;

export type ResourceId = (typeof RESOURCE_IDS)[number];

export type ResourceAmounts = Record<ResourceId, number>;

export interface StorageUnitState {
	id: string;
	structureId: string;
	name: string;
	capacity: number;
	contents: ResourceAmounts;
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
