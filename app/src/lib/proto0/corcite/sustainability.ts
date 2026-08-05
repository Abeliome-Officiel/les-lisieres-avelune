import {
	PLAYABLE_SUSTAINABILITY_REFERENCE
} from '../config/playable-sustainability-reference.js';
import type {
	CorciteState,
	MaintenanceCondition,
	PlayableCorciteState,
	PlayableSustainabilityState
} from '../domain/corcite.js';
import {
	recalculatePlayableCapacities
} from './construction.js';

export interface PlayableSustainabilityTurnResolution {
	turn: number;

	energy: {
		normalCapacity: number;
		used: number;
		overload: number;
		reserveBefore: number;
		reserveSpent: number;
		reserveRecovered: number;
		reserveAfter: number;
		mustReduceLoad: boolean;
	};

	maintenance: {
		capacity: number;
		used: number;
		deficit: number;
		surplus: number;
		debtBefore: number;
		debtAfter: number;
		consecutiveDeficitTurns: number;
		condition: MaintenanceCondition;
	};

	work: {
		capacity: number;
		used: number;
		free: number;
		shortage: number;
	};
}

export interface PlayableSustainabilityTurnResult {
	corcite: PlayableCorciteState;
	resolution:
		PlayableSustainabilityTurnResolution;
}

function requirePlayableState(
	state: CorciteState
): PlayableCorciteState {
	if (state.population === undefined) {
		throw new Error(
			"La soutenabilité nécessite un Corcite jouable avec une population."
		);
	}

	return state as PlayableCorciteState;
}

function maintenanceCondition(
	debt: number,
	consecutiveDeficitTurns: number
): MaintenanceCondition {
	if (debt <= 0) {
		return 'stable';
	}

	if (
		debt >=
			PLAYABLE_SUSTAINABILITY_REFERENCE
				.maintenance.criticalDebt ||
		consecutiveDeficitTurns >=
			PLAYABLE_SUSTAINABILITY_REFERENCE
				.maintenance
				.criticalAfterConsecutiveDeficitTurns
	) {
		return 'critical';
	}

	if (
		consecutiveDeficitTurns >=
			PLAYABLE_SUSTAINABILITY_REFERENCE
				.maintenance
				.degradedAfterConsecutiveDeficitTurns
	) {
		return 'degraded';
	}

	return 'strained';
}

function createCurrentSnapshot(
	state: PlayableCorciteState,
	previous?: PlayableSustainabilityState
): PlayableSustainabilityState {
	const overload =
		Math.max(
			0,
			state.capacities.energy.used -
				state.capacities.energy
					.normalCapacity
		);

	const deficit =
		Math.max(
			0,
			state.capacities.maintenance.used -
				state.capacities.maintenance
					.capacity
		);

	const workFree =
		Math.max(
			0,
			state.capacities.work.capacity -
				state.capacities.work.used
		);

	const workShortage =
		Math.max(
			0,
			state.capacities.work.used -
				state.capacities.work.capacity
		);

	return {
		lastResolvedTurn:
			previous?.lastResolvedTurn ?? 0,

		energy: {
			overload,
			reserveSpentLastTurn:
				previous?.energy
					.reserveSpentLastTurn ?? 0,
			reserveRecoveredLastTurn:
				previous?.energy
					.reserveRecoveredLastTurn ?? 0,
			mustReduceLoad:
				overload >
				state.capacities.energy
					.reserveCurrent
		},

		maintenance: {
			deficit,
			debt:
				previous?.maintenance.debt ?? 0,
			consecutiveDeficitTurns:
				previous?.maintenance
					.consecutiveDeficitTurns ?? 0,
			condition:
				previous?.maintenance.condition ??
				'stable'
		},

		work: {
			free: workFree,
			shortage: workShortage
		}
	};
}

export function getPlayableSustainabilityState(
	inputState: CorciteState
): PlayableSustainabilityState {
	const state =
		structuredClone(
			requirePlayableState(inputState)
		);

	recalculatePlayableCapacities(state);

	return createCurrentSnapshot(
		state,
		state.sustainability
	);
}

/**
 * Avant qu'un tour productif ne commence, la charge énergétique
 * courante doit pouvoir être couverte par :
 *
 * capacité normale + réserve encore disponible.
 *
 * Si ce n'est plus le cas, le joueur doit d'abord désactiver
 * des fonctions. Aucune production gratuite n'est autorisée
 * pendant un tour que le Corcite ne peut plus alimenter.
 */
export function assertPlayableEnergyCanOperate(
	inputState: CorciteState
): void {
	const state =
		structuredClone(
			requirePlayableState(inputState)
		);

	recalculatePlayableCapacities(state);

	const overload =
		Math.max(
			0,
			state.capacities.energy.used -
				state.capacities.energy
					.normalCapacity
		);

	if (
		overload >
		state.capacities.energy.reserveCurrent
	) {
		throw new Error(
			[
				'Déficit énergétique :',
				`charge ${state.capacities.energy.used},`,
				`capacité normale ${state.capacities.energy.normalCapacity},`,
				`réserve disponible ${state.capacities.energy.reserveCurrent}.`,
				'Le joueur doit désactiver des fonctions avant de poursuivre.'
			].join(' ')
		);
	}
}

export function resolvePlayableSustainabilityTurn(
	inputState: CorciteState,
	explicitTurn?: number
): PlayableSustainabilityTurnResult {
	const state =
		structuredClone(
			requirePlayableState(inputState)
		);

	recalculatePlayableCapacities(state);

	const previous =
		createCurrentSnapshot(
			state,
			state.sustainability
		);

	const turn =
		explicitTurn ??
		previous.lastResolvedTurn + 1;

	if (
		!Number.isInteger(turn) ||
		turn < 1
	) {
		throw new Error(
			"Le tour de soutenabilité doit être un entier supérieur ou égal à 1."
		);
	}

	if (
		turn <= previous.lastResolvedTurn
	) {
		throw new Error(
			`La soutenabilité du tour ${turn} a déjà été résolue ou appartient au passé.`
		);
	}

	const energy =
		state.capacities.energy;

	const overload =
		Math.max(
			0,
			energy.used -
				energy.normalCapacity
		);

	const reserveBefore =
		energy.reserveCurrent;

	if (
		overload >
		reserveBefore
	) {
		throw new Error(
			[
				'Réserve énergétique insuffisante pour résoudre le tour :',
				`${overload} requis,`,
				`${reserveBefore} disponible.`,
				'Désactivez des fonctions avant de poursuivre.'
			].join(' ')
		);
	}

	const maintenanceDeficit =
		Math.max(
			0,
			state.capacities.maintenance.used -
				state.capacities.maintenance
					.capacity
		);

	const maintenanceSurplus =
		Math.max(
			0,
			state.capacities.maintenance
				.capacity -
				state.capacities.maintenance.used
		);

	const debtBefore =
		previous.maintenance.debt;

	let debtAfter =
		debtBefore;

	let consecutiveDeficitTurns =
		previous.maintenance
			.consecutiveDeficitTurns;

	if (maintenanceDeficit > 0) {
		debtAfter +=
			maintenanceDeficit;

		consecutiveDeficitTurns += 1;
	} else {
		debtAfter =
			Math.max(
				0,
				debtAfter -
					maintenanceSurplus
			);

		consecutiveDeficitTurns = 0;
	}

	const condition =
		maintenanceCondition(
			debtAfter,
			consecutiveDeficitTurns
		);

	const reserveSpent =
		overload;

	energy.reserveCurrent -=
		reserveSpent;

	let reserveRecovered = 0;

	/*
	 * La réserve ne récupère que pendant un tour réellement stable.
	 *
	 * Un tour consacré à résorber une dette d'entretien
	 * ne recharge donc pas simultanément la réserve.
	 */
	const maintenanceWasAlreadyStable =
		debtBefore === 0 &&
		maintenanceDeficit === 0;

	if (
		overload === 0 &&
		maintenanceWasAlreadyStable
	) {
		reserveRecovered =
			Math.min(
				PLAYABLE_SUSTAINABILITY_REFERENCE
					.energy
					.reserveRecoveryPerStableTurn,
				energy.reserveMaximum -
					energy.reserveCurrent
			);

		energy.reserveCurrent +=
			reserveRecovered;
	}

	const workFree =
		Math.max(
			0,
			state.capacities.work.capacity -
				state.capacities.work.used
		);

	const workShortage =
		Math.max(
			0,
			state.capacities.work.used -
				state.capacities.work.capacity
		);

	const mustReduceLoad =
		overload >
		energy.reserveCurrent;

	state.sustainability = {
		lastResolvedTurn: turn,

		energy: {
			overload,
			reserveSpentLastTurn:
				reserveSpent,
			reserveRecoveredLastTurn:
				reserveRecovered,
			mustReduceLoad
		},

		maintenance: {
			deficit:
				maintenanceDeficit,
			debt:
				debtAfter,
			consecutiveDeficitTurns,
			condition
		},

		work: {
			free: workFree,
			shortage: workShortage
		}
	};

	return {
		corcite: state,

		resolution: {
			turn,

			energy: {
				normalCapacity:
					energy.normalCapacity,
				used:
					energy.used,
				overload,
				reserveBefore,
				reserveSpent,
				reserveRecovered,
				reserveAfter:
					energy.reserveCurrent,
				mustReduceLoad
			},

			maintenance: {
				capacity:
					state.capacities
						.maintenance.capacity,
				used:
					state.capacities
						.maintenance.used,
				deficit:
					maintenanceDeficit,
				surplus:
					maintenanceSurplus,
				debtBefore,
				debtAfter,
				consecutiveDeficitTurns,
				condition
			},

			work: {
				capacity:
					state.capacities.work
						.capacity,
				used:
					state.capacities.work.used,
				free:
					workFree,
				shortage:
					workShortage
			}
		}
	};
}
