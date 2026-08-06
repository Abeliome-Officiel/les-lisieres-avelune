import type {
	CorciteState,
	PlayableCorciteState,
	StructureKind,
	StructureState
} from '../domain/corcite.js';
import {
	recalculatePlayableCapacities
} from './construction.js';
import {
	validateCorciteState
} from './validate.js';

export interface StructureActivationPreview {
	structureId: string;
	currentStatus: StructureState['status'];
	targetStatus: 'active' | 'inactive';
	canApply: boolean;
	blockers: string[];

	energy: {
		used: number;
		normalCapacity: number;
	};

	maintenance: {
		used: number;
		capacity: number;
	};

	work: {
		used: number;
		capacity: number;
	};

	space: {
		used: number;
		capacity: number;
	};
}

const MANUALLY_CONTROLLABLE_KINDS:
	readonly StructureKind[] = [
	'extractor-a-n1',
	'extractor-b-n1',
	'transformer-n1',
	'fabricator-n1',
	'energy-extension-n1',
	'maintenance-extension-n1'
];

function requirePlayableState(
	state: CorciteState
): PlayableCorciteState {
	if (state.population === undefined) {
		throw new Error(
			"Cette opération nécessite un Corcite jouable avec une population."
		);
	}

	return state as PlayableCorciteState;
}

function getStructure(
	state: CorciteState,
	structureId: string
): StructureState {
	const structure =
		state.structures.find(
			(candidate) =>
				candidate.id === structureId
		);

	if (!structure) {
		throw new Error(
			`Structure inconnue : ${structureId}.`
		);
	}

	return structure;
}

function assertControllable(
	structure: StructureState
): void {
	if (
		!MANUALLY_CONTROLLABLE_KINDS.includes(
			structure.kind
		)
	) {
		throw new Error(
			`La structure ${structure.name} ne peut pas être arrêtée manuellement dans ce prototype.`
		);
	}
}

function capacityBlockers(
	state: PlayableCorciteState
): string[] {
	const blockers: string[] = [];

	if (
		state.capacities.energy.used >
		state.capacities.energy.normalCapacity
	) {
		blockers.push(
			`Énergie insuffisante (${state.capacities.energy.used}/${state.capacities.energy.normalCapacity}).`
		);
	}

	if (
		state.capacities.work.used >
		state.capacities.work.capacity
	) {
		blockers.push(
			`Travail insuffisant (${state.capacities.work.used}/${state.capacities.work.capacity}).`
		);
	}

	if (
		state.capacities.space.used >
		state.capacities.space.capacity
	) {
		blockers.push(
			`Espace insuffisant (${state.capacities.space.used}/${state.capacities.space.capacity}).`
		);
	}

	return blockers;
}

export function previewPlayableStructureActivation(
	inputState: CorciteState,
	structureId: string,
	active: boolean
): StructureActivationPreview {
	const state =
		structuredClone(
			requirePlayableState(inputState)
		);

	const structure =
		getStructure(
			state,
			structureId
		);

	assertControllable(structure);

	if (structure.status === 'constructing') {
		throw new Error(
			`La structure ${structure.name} est encore en construction.`
		);
	}

	structure.status =
		active
			? 'active'
			: 'inactive';

	recalculatePlayableCapacities(state);

	/*
	 * Désactiver une fonction doit toujours rester possible :
	 * c'est précisément l'outil permettant au joueur de sortir
	 * d'un déficit énergétique ou de travail.
	 */
	const blockers =
		active
			? capacityBlockers(state)
			: [];

	if (active) {
		if (
			inputState.capacities.energy.used >
			inputState.capacities.energy.normalCapacity
		) {
			blockers.unshift(
				'Le Corcite est déjà en déficit énergétique : désactivez d’abord des fonctions avant toute nouvelle activation.'
			);
		}
	}

	return {
		structureId,
		currentStatus:
			getStructure(
				inputState,
				structureId
			).status,
		targetStatus:
			active
				? 'active'
				: 'inactive',
		canApply:
			blockers.length === 0,
		blockers,

		energy: {
			used:
				state.capacities.energy.used,
			normalCapacity:
				state.capacities.energy.normalCapacity
		},

		maintenance: {
			used:
				state.capacities.maintenance.used,
			capacity:
				state.capacities.maintenance.capacity
		},

		work: {
			used:
				state.capacities.work.used,
			capacity:
				state.capacities.work.capacity
		},

		space: {
			used:
				state.capacities.space.used,
			capacity:
				state.capacities.space.capacity
		}
	};
}

export function setPlayableStructureActive(
	inputState: CorciteState,
	structureId: string,
	active: boolean
): PlayableCorciteState {
	const preview =
		previewPlayableStructureActivation(
			inputState,
			structureId,
			active
		);

	if (!preview.canApply) {
		throw new Error(
			`Changement d'état impossible : ${preview.blockers.join(' | ')}`
		);
	}

	const state =
		structuredClone(
			requirePlayableState(inputState)
		);

	const structure =
		getStructure(
			state,
			structureId
		);

	structure.status =
		active
			? 'active'
			: 'inactive';

	recalculatePlayableCapacities(state);

	const validation =
		validateCorciteState(state);

	if (!validation.valid) {
		throw new Error(
			`Etat Corcite invalide après changement d'activité : ${validation.errors.join(' | ')}`
		);
	}

	return state;
}
