import type { ResourceId } from './resources.js';

export type TfSourceId =
	| 'source-a'
	| 'source-b';

export interface TfSourceDefinition {
	id: TfSourceId;
	resourceId: ResourceId;
	potentialPerTurn: number;
	nonDepleting: true;
}

export interface TfExtractionRule {
	sourceId: TfSourceId;
	extractorKind:
		| 'extractor-a-n1'
		| 'extractor-b-n1';
	capacityPerTurn: number;
}

export interface TfExtractionPlacement {
	storageUnitId: string;
	resourceId: ResourceId;
	amount: number;
}

export type TfExtractionStatus =
	| 'produced'
	| 'inactive'
	| 'storage-blocked';

export interface TfExtractionEvent {
	structureId: string;
	sourceId: TfSourceId;
	resourceId: ResourceId;
	requestedOutput: number;
	producedOutput: number;
	status: TfExtractionStatus;
	placements: TfExtractionPlacement[];
	networkMovements?: TfNetworkRouteMovement[];
	message: string;
}

export interface TfExtractionResolution {
	events: TfExtractionEvent[];
}

export type TfRecipeId =
	| 'transform-r3-n1'
	| 'fabricate-r4-n1';

export interface TfRecipeDefinition {
	id: TfRecipeId;
	structureKind:
		| 'transformer-n1'
		| 'fabricator-n1';
	inputs: Partial<Record<ResourceId, number>>;
	outputs: Partial<Record<ResourceId, number>>;
	durationTurns: number;
}

export interface TfAppliedModifier {
	id: string;
	source: string;
	target: string;
	operation: 'add' | 'multiply';
	value: number;
}

export interface TfResourceMovement {
	storageUnitId: string;
	resourceId: ResourceId;
	amount: number;
}

export type TfProcessingStatus =
	| 'produced'
	| 'inactive'
	| 'input-blocked'
	| 'input-conflict'
	| 'storage-blocked';

export interface TfProcessingEvent {
	structureId: string;
	recipeId: TfRecipeId;
	status: TfProcessingStatus;
	inputs: Partial<Record<ResourceId, number>>;
	outputs: Partial<Record<ResourceId, number>>;
	baseOutputs?: Partial<Record<ResourceId, number>>;
	appliedModifiers?: TfAppliedModifier[];
	consumptions: TfResourceMovement[];
	bufferConsumptions?: TfBufferConsumptionMovement[];
	placements: TfResourceMovement[];
	networkMovements?: TfNetworkRouteMovement[];
	message: string;
}

export interface TfProcessingResolution {
	events: TfProcessingEvent[];
}

export type TfConnectionRouting =
	| {
			mode: 'priority';
			priority: number;
	  }
	| {
			mode: 'weighted';
			weight: number;
	  };

export interface TfConnectionState {
	id: string;
	fromStructureId: string;
	toStructureId: string;
	resourceId: ResourceId;
	routing: TfConnectionRouting;
}

export interface TfBufferState {
	id: string;
	connectionId: string;
	resourceId: ResourceId;
	capacity: number;
	amount: number;
}

export interface TfNetworkState {
	connections: TfConnectionState[];
	buffers: TfBufferState[];
}

export interface TfNetworkRouteMovement {
	connectionId: string;
	bufferId: string;
	toStructureId: string;
	resourceId: ResourceId;
	amount: number;
}

export interface TfNetworkRoutingResolution {
	fromStructureId: string;
	resourceId: ResourceId;
	requestedAmount: number;
	routedAmount: number;
	unroutedAmount: number;
	movements: TfNetworkRouteMovement[];
}

export type TfBufferInputBudget =
	Record<string, number>;

export interface TfBufferConsumptionMovement {
	bufferId: string;
	connectionId: string;
	fromStructureId: string;
	resourceId: ResourceId;
	amount: number;
}
