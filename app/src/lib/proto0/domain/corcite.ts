import type { CorciteId } from './ids.js';
import type { TfNetworkState } from './tf.js';
import type {
	ResourceId,
	ResourceReservation,
	StorageUnitState
} from './resources.js';

export type CorciteController =
	| 'human'
	| 'simulated-tf'
	| 'simulated-td'
	| 'simulated-rpg'
	| 'simulated-limits';

export interface CorciteIdentity {
	id: CorciteId;
	name: string;
	controller: CorciteController;
}

export type StructureKind =
	| 'extractor-a-n1'
	| 'extractor-b-n1'
	| 'transformer-n1'
	| 'fabricator-n1'
	| 'storage-n1'
	| 'energy-extension-n1'
	| 'maintenance-extension-n1';

export type StructureStatus =
	| 'active'
	| 'inactive'
	| 'constructing';

export interface StructureUsage {
	energy: number;
	maintenance: number;
	work: number;
	space: number;
}

export interface StructureState {
	id: string;
	kind: StructureKind;
	name: string;
	status: StructureStatus;
	usage: StructureUsage;
}

export interface ProductionState {
	id: string;
	structureId: string;
	recipeId: string;
	status: 'queued' | 'running' | 'paused';
	progressTurns: number;
	durationTurns: number;
}

export type ModifierOperation = 'add' | 'multiply';

export interface ModifierState {
	id: string;
	source: string;
	target: string;
	operation: ModifierOperation;
	value: number;
	active: boolean;
}

export interface CapacityUsageState {
	capacity: number;
	used: number;
}

export interface EnergyState {
	normalCapacity: number;
	used: number;
	reserveMaximum: number;
	reserveCurrent: number;
}

export interface CorciteCapacities {
	energy: EnergyState;
	maintenance: CapacityUsageState;
	work: CapacityUsageState;
	space: CapacityUsageState;
}

export interface CorciteState extends CorciteIdentity {
	storageUnits: StorageUnitState[];
	structures: StructureState[];
	productions: ProductionState[];
	tfNetwork: TfNetworkState;
	capacities: CorciteCapacities;
	modifiers: ModifierState[];
	reservations: ResourceReservation[];
}

export interface StoredResourceSummary {
	resourceId: ResourceId;
	amount: number;
}
