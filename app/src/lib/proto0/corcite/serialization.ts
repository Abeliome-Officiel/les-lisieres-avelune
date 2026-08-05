import type {
	CorciteController,
	CorciteState,
	ModifierOperation,
	ProductionState,
	StructureKind,
	StructureStatus
} from '../domain/corcite.js';
import {
	RESOURCE_IDS,
	type ResourceAmounts,
	type ResourceId,
	type ResourceReservation,
	type StorageUnitState
} from '../domain/resources.js';
import { validateCorciteState } from './validate.js';

type UnknownRecord = Record<string, unknown>;

const CORCITE_CONTROLLERS: readonly CorciteController[] = [
	'human',
	'simulated-tf',
	'simulated-td',
	'simulated-rpg',
	'simulated-limits'
];

const STRUCTURE_KINDS: readonly StructureKind[] = [
	'extractor-a-n1',
	'extractor-b-n1',
	'transformer-n1',
	'fabricator-n1',
	'storage-n1',
	'energy-extension-n1',
	'maintenance-extension-n1'
];

const STRUCTURE_STATUSES: readonly StructureStatus[] = [
	'active',
	'inactive',
	'constructing'
];

const PRODUCTION_STATUSES: readonly ProductionState['status'][] = [
	'queued',
	'running',
	'paused'
];

const MODIFIER_OPERATIONS: readonly ModifierOperation[] = [
	'add',
	'multiply'
];

const RESERVATION_STATUSES: readonly ResourceReservation['status'][] = [
	'active',
	'released',
	'consumed'
];

function isRecord(value: unknown): value is UnknownRecord {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value)
	);
}

function isString(value: unknown): value is string {
	return typeof value === 'string';
}

function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isResourceId(value: unknown): value is ResourceId {
	return (
		typeof value === 'string' &&
		RESOURCE_IDS.some((resourceId) => resourceId === value)
	);
}

function isResourceAmounts(
	value: unknown
): value is ResourceAmounts {
	if (!isRecord(value)) return false;

	return RESOURCE_IDS.every(
		(resourceId) =>
			isFiniteNumber(value[resourceId])
	);
}

function isStorageUnitState(
	value: unknown
): value is StorageUnitState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.structureId) &&
		isString(value.name) &&
		isFiniteNumber(value.capacity) &&
		isResourceAmounts(value.contents)
	);
}

function isStructureUsage(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isFiniteNumber(value.energy) &&
		isFiniteNumber(value.maintenance) &&
		isFiniteNumber(value.work) &&
		isFiniteNumber(value.space)
	);
}

function isStructureKind(
	value: unknown
): value is StructureKind {
	return (
		typeof value === 'string' &&
		STRUCTURE_KINDS.some((kind) => kind === value)
	);
}

function isStructureStatus(
	value: unknown
): value is StructureStatus {
	return (
		typeof value === 'string' &&
		STRUCTURE_STATUSES.some((status) => status === value)
	);
}

function isStructureState(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isStructureKind(value.kind) &&
		isString(value.name) &&
		isStructureStatus(value.status) &&
		isStructureUsage(value.usage)
	);
}

function isProductionState(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.structureId) &&
		isString(value.recipeId) &&
		typeof value.status === 'string' &&
		PRODUCTION_STATUSES.some(
			(status) => status === value.status
		) &&
		isFiniteNumber(value.progressTurns) &&
		isFiniteNumber(value.durationTurns)
	);
}

function isCapacityUsageState(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isFiniteNumber(value.capacity) &&
		isFiniteNumber(value.used)
	);
}

function isEnergyState(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isFiniteNumber(value.normalCapacity) &&
		isFiniteNumber(value.used) &&
		isFiniteNumber(value.reserveMaximum) &&
		isFiniteNumber(value.reserveCurrent)
	);
}

function isCapacities(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isEnergyState(value.energy) &&
		isCapacityUsageState(value.maintenance) &&
		isCapacityUsageState(value.work) &&
		isCapacityUsageState(value.space)
	);
}

function isModifierOperation(
	value: unknown
): value is ModifierOperation {
	return (
		typeof value === 'string' &&
		MODIFIER_OPERATIONS.some(
			(operation) => operation === value
		)
	);
}

function isModifierState(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.source) &&
		isString(value.target) &&
		isModifierOperation(value.operation) &&
		isFiniteNumber(value.value) &&
		isBoolean(value.active)
	);
}

function isResourceReservation(
	value: unknown
): value is ResourceReservation {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.operationId) &&
		isString(value.storageUnitId) &&
		isResourceId(value.resourceId) &&
		isFiniteNumber(value.amount) &&
		isString(value.purpose) &&
		typeof value.status === 'string' &&
		RESERVATION_STATUSES.some(
			(status) => status === value.status
		)
	);
}

function isController(
	value: unknown
): value is CorciteController {
	return (
		typeof value === 'string' &&
		CORCITE_CONTROLLERS.some(
			(controller) => controller === value
		)
	);
}

function isCorciteStateShape(
	value: unknown
): value is CorciteState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.name) &&
		isController(value.controller) &&
		Array.isArray(value.storageUnits) &&
		value.storageUnits.every(isStorageUnitState) &&
		Array.isArray(value.structures) &&
		value.structures.every(isStructureState) &&
		Array.isArray(value.productions) &&
		value.productions.every(isProductionState) &&
		isCapacities(value.capacities) &&
		Array.isArray(value.modifiers) &&
		value.modifiers.every(isModifierState) &&
		Array.isArray(value.reservations) &&
		value.reservations.every(isResourceReservation)
	);
}

export function serializeCorciteState(
	state: CorciteState
): string {
	const validation = validateCorciteState(state);

	if (!validation.valid) {
		throw new Error(
			`Etat Corcite invalide : ${validation.errors.join(' | ')}`
		);
	}

	return JSON.stringify(state, null, 2);
}

export function deserializeCorciteState(
	serialized: string
): CorciteState {
	let parsed: unknown;

	try {
		parsed = JSON.parse(serialized) as unknown;
	} catch {
		throw new Error('Etat Corcite : JSON invalide.');
	}

	if (!isCorciteStateShape(parsed)) {
		throw new Error(
			'Etat Corcite : structure JSON incompatible.'
		);
	}

	const validation = validateCorciteState(parsed);

	if (!validation.valid) {
		throw new Error(
			`Etat Corcite invalide : ${validation.errors.join(' | ')}`
		);
	}

	return structuredClone(parsed);
}
