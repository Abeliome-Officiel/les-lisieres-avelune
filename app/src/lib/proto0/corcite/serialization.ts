import type {
	WaveConsequenceState,
	WaveDefenseResult,
	WaveKnowledgeProduced,
	WaveRelevantConsumption
} from '../domain/consequence.js';
import type {
	RpgAccessState,
	RpgJournalEntry,
	RpgJournalEvent,
	RpgKnowledgeState,
	RpgResearchState,
	RpgResearchStatus,
	RpgState
} from '../domain/rpg.js';
import {
	TD_TOWER_DEFINITION_IDS,
	TD_TOWER_FAMILIES,
	type TdPathPositionState,
	type TdState,
	type TdTowerState
} from '../domain/td.js';
import type {
	TfBufferState,
	TfConnectionRouting,
	TfConnectionState,
	TfNetworkState
} from '../domain/tf.js';
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
	'corcite-core-n1',
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

const RPG_RESEARCH_STATUSES: readonly RpgResearchStatus[] = [
	'active',
	'completed',
	'discovery-pending',
	'validated'
];

const RPG_JOURNAL_EVENTS: readonly RpgJournalEvent[] = [
	'research-started',
	'research-progressed',
	'research-completed',
	'discovery-pending',
	'discovery-validated',
	'modifier-applied',
	'access-unlocked',
	'knowledge-updated'
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

function isPopulationState(value: unknown): boolean {
	if (!isRecord(value)) return false;

	return (
		isFiniteNumber(value.total) &&
		isFiniteNumber(value.workPerPopulation)
	);
}

function isPlayableSustainabilityState(
	value: unknown
): boolean {
	if (!isRecord(value)) return false;

	const lastResolvedTurn =
		value.lastResolvedTurn;

	if (
		!isFiniteNumber(lastResolvedTurn) ||
		!Number.isInteger(lastResolvedTurn) ||
		lastResolvedTurn < 0
	) {
		return false;
	}

	if (
		!isRecord(value.energy) ||
		!isFiniteNumber(value.energy.overload) ||
		!isFiniteNumber(
			value.energy.reserveSpentLastTurn
		) ||
		!isFiniteNumber(
			value.energy.reserveRecoveredLastTurn
		) ||
		!isBoolean(
			value.energy.mustReduceLoad
		)
	) {
		return false;
	}

	if (
		!isRecord(value.maintenance) ||
		!isFiniteNumber(
			value.maintenance.deficit
		) ||
		!isFiniteNumber(
			value.maintenance.debt
		) ||
		!Number.isInteger(
			value.maintenance
				.consecutiveDeficitTurns
		) ||
		typeof value.maintenance.condition !==
			'string' ||
		![
			'stable',
			'strained',
			'degraded',
			'critical'
		].includes(
			value.maintenance.condition
		)
	) {
		return false;
	}

	return (
		isRecord(value.work) &&
		isFiniteNumber(value.work.free) &&
		isFiniteNumber(value.work.shortage)
	);
}

function isPlayableRecoveryState(
        value: unknown
): boolean {
        if (!isRecord(value)) {
                return false;
        }

        if (
                !isFiniteNumber(
                        value.lastResolvedTurn
                ) ||
                !Number.isInteger(
                        value.lastResolvedTurn
                ) ||
                value.lastResolvedTurn < 0
        ) {
                return false;
        }

        if (
                !isRecord(
                        value.integrity
                ) ||
                !isFiniteNumber(
                        value.integrity.current
                ) ||
                !isFiniteNumber(
                        value.integrity.maximum
                ) ||
                !isFiniteNumber(
                        value.integrity
                                .damageTakenLastWave
                ) ||
                !isFiniteNumber(
                        value.integrity
                                .recoveredLastTurn
                )
        ) {
                return false;
        }

        if (
                !Array.isArray(
                        value.appliedWaveConsequenceIds
                ) ||
                !value.appliedWaveConsequenceIds.every(
                        isString
                )
        ) {
                return false;
        }

        if (
                value.lastWaveImpact ===
                null
        ) {
                return true;
        }

        if (
                !isRecord(
                        value.lastWaveImpact
                )
        ) {
                return false;
        }

        return (
                isString(
                        value.lastWaveImpact
                                .consequenceId
                ) &&
                isFiniteNumber(
                        value.lastWaveImpact.turn
                ) &&
                isFiniteNumber(
                        value.lastWaveImpact
                                .integrityDamage
                ) &&
                isFiniteNumber(
                        value.lastWaveImpact
                                .energyReserveDrain
                ) &&
                isFiniteNumber(
                        value.lastWaveImpact
                                .maintenanceDebtAdded
                )
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

function isRpgResearchState(
	value: unknown
): value is RpgResearchState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.definitionId) &&
		isString(value.label) &&
		typeof value.status === 'string' &&
		RPG_RESEARCH_STATUSES.some(
			(status) =>
				status === value.status
		) &&
		isFiniteNumber(value.progressTurns) &&
		isFiniteNumber(value.durationTurns) &&
		isFiniteNumber(value.startedTurn) &&
		(
			value.lastProgressTurn === null ||
			isFiniteNumber(
				value.lastProgressTurn
			)
		) &&
		(
			value.completedTurn === null ||
			isFiniteNumber(
				value.completedTurn
			)
		) &&
		(
			value.validatedTurn === undefined ||
			value.validatedTurn === null ||
			isFiniteNumber(
				value.validatedTurn
			)
		)
	);
}

function isRpgAccessState(
	value: unknown
): value is RpgAccessState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.source) &&
		isString(value.key) &&
		isBoolean(value.active)
	);
}

function isRpgKnowledgeState(
	value: unknown
): value is RpgKnowledgeState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.source) &&
		isString(value.key) &&
		isFiniteNumber(value.value)
	);
}

function isRpgJournalEntry(
	value: unknown
): value is RpgJournalEntry {
	if (!isRecord(value)) return false;

	return (
		isFiniteNumber(value.sequence) &&
		typeof value.event === 'string' &&
		RPG_JOURNAL_EVENTS.some(
			(event) =>
				event === value.event
		) &&
		isString(value.source) &&
		isString(value.message)
	);
}

function isRpgState(
	value: unknown
): value is RpgState {
	if (!isRecord(value)) return false;

	return (
		Array.isArray(
			value.researches
		) &&
		value.researches.every(
			isRpgResearchState
		) &&
		Array.isArray(
			value.accesses
		) &&
		value.accesses.every(
			isRpgAccessState
		) &&
		Array.isArray(
			value.knowledge
		) &&
		value.knowledge.every(
			isRpgKnowledgeState
		) &&
		Array.isArray(
			value.journal
		) &&
		value.journal.every(
			isRpgJournalEntry
		)
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

function isTdTowerState(
	value: unknown
): value is TdTowerState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		typeof value.definitionId === 'string' &&
		TD_TOWER_DEFINITION_IDS.some(
			(id) =>
				id ===
					value.definitionId
		) &&
		typeof value.family === 'string' &&
		TD_TOWER_FAMILIES.some(
			(family) =>
				family ===
					value.family
		) &&
		value.level === 'n1' &&
		isString(value.label)
	);
}

function isTdPathPositionState(
	value: unknown
): value is TdPathPositionState {
	if (!isRecord(value)) return false;

	return (
		isFiniteNumber(
			value.position
		) &&
		(
			value.tower === null ||
			isTdTowerState(
				value.tower
			)
		)
	);
}

function isTdState(
	value: unknown
): value is TdState {
	if (!isRecord(value)) return false;

	return (
		Array.isArray(
			value.positions
		) &&
		value.positions.every(
			isTdPathPositionState
		)
	);
}

function isTfConnectionRouting(
	value: unknown
): value is TfConnectionRouting {
	if (!isRecord(value)) return false;

	if (value.mode === 'priority') {
		return isFiniteNumber(
			value.priority
		);
	}

	if (value.mode === 'weighted') {
		return isFiniteNumber(
			value.weight
		);
	}

	return false;
}

function isTfConnectionState(
	value: unknown
): value is TfConnectionState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.fromStructureId) &&
		isString(value.toStructureId) &&
		isResourceId(value.resourceId) &&
		isTfConnectionRouting(
			value.routing
		)
	);
}

function isTfBufferState(
	value: unknown
): value is TfBufferState {
	if (!isRecord(value)) return false;

	return (
		isString(value.id) &&
		isString(value.connectionId) &&
		isResourceId(value.resourceId) &&
		isFiniteNumber(value.capacity) &&
		isFiniteNumber(value.amount)
	);
}

function isTfNetworkState(
	value: unknown
): value is TfNetworkState {
	if (!isRecord(value)) return false;

	return (
		Array.isArray(
			value.connections
		) &&
		value.connections.every(
			isTfConnectionState
		) &&
		Array.isArray(
			value.buffers
		) &&
		value.buffers.every(
			isTfBufferState
		)
	);
}

function isConsequenceWaveState(
	value: unknown
): boolean {
	if (!isRecord(value)) {
		return false;
	}

	return (
		isFiniteNumber(
			value.pressure
		) &&
		isFiniteNumber(
			value.structure
		) &&
		isFiniteNumber(
			value.charge
		) &&
		isFiniteNumber(
			value.capturableMatter
		)
	);
}

function isWaveRelevantConsumption(
	value: unknown
): value is WaveRelevantConsumption {
	if (!isRecord(value)) {
		return false;
	}

	return (
		isResourceId(
			value.resourceId
		) &&
		isFiniteNumber(
			value.amount
		) &&
		isString(
			value.source
		)
	);
}

function isWaveKnowledgeProduced(
	value: unknown
): value is WaveKnowledgeProduced {
	if (!isRecord(value)) {
		return false;
	}

	return (
		isString(
			value.id
		) &&
		isString(
			value.key
		) &&
		isString(
			value.source
		) &&
		isFiniteNumber(
			value.value
		)
	);
}

function isWaveDefenseResult(
	value: unknown
): value is WaveDefenseResult {
	return (
		value === 'contained' ||
		value === 'residual'
	);
}

function isWaveConsequenceState(
	value: unknown
): value is WaveConsequenceState {
	if (!isRecord(value)) {
		return false;
	}

	return (
		isString(
			value.id
		) &&
		isString(
			value.runId
		) &&
		isFiniteNumber(
			value.turn
		) &&
		isWaveDefenseResult(
			value.defenseResult
		) &&
		isConsequenceWaveState(
			value.initialWave
		) &&
		isConsequenceWaveState(
			value.finalWave
		) &&
		isFiniteNumber(
			value.capturedMatter
		) &&
		Array.isArray(
			value.consumptions
		) &&
		value.consumptions.every(
			isWaveRelevantConsumption
		) &&
		Array.isArray(
			value.knowledgeProduced
		) &&
		value.knowledgeProduced.every(
			isWaveKnowledgeProduced
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
			(
				value.population === undefined ||
				isPopulationState(value.population)
			) &&
			(
				value.sustainability === undefined ||
				isPlayableSustainabilityState(
					value.sustainability
				)
			) &&
		(
		        value.recovery === undefined ||
		        isPlayableRecoveryState(
		                value.recovery
		        )
		) &&
		Array.isArray(value.storageUnits) &&
		value.storageUnits.every(isStorageUnitState) &&
		Array.isArray(value.structures) &&
		value.structures.every(isStructureState) &&
		Array.isArray(value.productions) &&
		value.productions.every(isProductionState) &&
		isTdState(value.td) &&
            (
                    value.tdInventory === undefined ||
                    (
                            Array.isArray(
                                    value.tdInventory
                            ) &&
                            value.tdInventory.every(
                                    isTdTowerState
                            )
                    )
            ) &&
		isTfNetworkState(value.tfNetwork) &&
		isCapacities(value.capacities) &&
		isRpgState(value.rpg) &&
		Array.isArray(value.modifiers) &&
		value.modifiers.every(isModifierState) &&
		Array.isArray(value.reservations) &&
		value.reservations.every(isResourceReservation) &&
		Array.isArray(value.waveConsequences) &&
		value.waveConsequences.every(
			isWaveConsequenceState
		)
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
