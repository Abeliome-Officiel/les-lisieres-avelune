import type {
	WaveConsequenceState
} from './consequence.js';
import type { CorciteId } from './ids.js';
import type { RpgState } from './rpg.js';
import type {
        TdState,
        TdTowerState
} from './td.js';
import type { TfNetworkState } from './tf.js';
import type {
	ResourceId,
	ResourceReservation,
	StorageUnitState
} from './resources.js';
import type {
        PlayableCaptureEconomyState
} from './playable-capture.js';

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
	| 'corcite-core-n1'
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

/**
 * Population minimale du prototype jouable.
 *
 * La capacité de travail dérive de la population et non d'une
 * constante indépendante.
 *
 * Le champ reste optionnel dans CorciteState pendant la migration
 * afin que les états historiques P0-P10 restent lisibles.
 */
export interface PopulationState {
	total: number;
	workPerPopulation: number;
}

export type MaintenanceCondition =
	| 'stable'
	| 'strained'
	| 'degraded'
	| 'critical';

export interface PlayableSustainabilityState {
	/**
	 * Dernier tour pour lequel les coûts de soutenabilité
	 * ont effectivement été appliqués.
	 */
	lastResolvedTurn: number;

	energy: {
		/**
		 * Dépassement courant de la capacité normale.
		 */
		overload: number;

		reserveSpentLastTurn: number;
		reserveRecoveredLastTurn: number;

		/**
		 * Vrai lorsque la charge actuelle ne pourra pas
		 * être soutenue au prochain tour avec la réserve restante.
		 */
		mustReduceLoad: boolean;
	};

	maintenance: {
		/**
		 * Déficit courant capacité / besoin.
		 */
		deficit: number;

		/**
		 * Dette accumulée par les tours sous-entretenus.
		 */
		debt: number;

		consecutiveDeficitTurns: number;
		condition: MaintenanceCondition;
	};

	work: {
		free: number;
		shortage: number;
	};
}

export interface PlayableWaveImpactState {
        consequenceId: string;
        turn: number;

        /**
         * Dégât effectivement subi, après limitation par
         * l'intégrité encore disponible.
         */
        integrityDamage: number;

        /**
         * Réserve énergétique effectivement retirée.
         */
        energyReserveDrain: number;

        /**
         * Dette d'entretien ajoutée par la vague.
         */
        maintenanceDebtAdded: number;
}

export interface PlayableRecoveryState {
        /**
         * Dernier tour ayant traité la récupération naturelle.
         */
        lastResolvedTurn: number;

        integrity: {
                current: number;
                maximum: number;
                damageTakenLastWave: number;
                recoveredLastTurn: number;
        };

        /**
         * Dernier impact directement produit par une vague.
         */
        lastWaveImpact:
                | PlayableWaveImpactState
                | null;

        /**
         * Garantit qu'une conséquence persistée ne puisse pas
         * endommager deux fois le Corcite.
         */
        appliedWaveConsequenceIds: string[];
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
	population?: PopulationState;

	/**
	 * Absent des anciens états P0-P10.
	 * Présent après la première résolution de soutenabilité
	 * du prototype jouable.
	 */
	sustainability?: PlayableSustainabilityState;

        /**
         * Conséquences persistantes et récupération du prototype jouable.
         * Absent des états historiques P0-P10.
         */
        recovery?: PlayableRecoveryState;
	/**
	 * Economie de captation propre au prototype jouable.
	 *
	 * Le champ reste optionnel afin de conserver la lecture
	 * des états historiques P0-P10.
	 */
	captureEconomy?: PlayableCaptureEconomyState;
	storageUnits: StorageUnitState[];
	structures: StructureState[];
	productions: ProductionState[];
	td: TdState;

	/**
	 * Défenses fabriquées mais non placées.
	 *
	 * Le champ reste optionnel sur CorciteState
	 * pour conserver la compatibilité P0-P10.
	 */
	tdInventory?: TdTowerState[];
	tfNetwork: TfNetworkState;
	capacities: CorciteCapacities;
	rpg: RpgState;
	modifiers: ModifierState[];
	reservations: ResourceReservation[];
	waveConsequences: WaveConsequenceState[];
}

/**
 * Etat utilisé par le prototype miniature réellement jouable.
 *
 * Contrairement aux anciens états de laboratoire, la population
 * est obligatoire.
 */
export interface PlayableCorciteState extends CorciteState {
	population: PopulationState;
        recovery: PlayableRecoveryState;
	tdInventory: TdTowerState[];
	captureEconomy: PlayableCaptureEconomyState;
}

export interface StoredResourceSummary {
	resourceId: ResourceId;
	amount: number;
}
