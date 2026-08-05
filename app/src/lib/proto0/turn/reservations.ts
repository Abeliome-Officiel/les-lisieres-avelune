import type { CorciteState } from '../domain/corcite.js';
import {
	RESOURCE_IDS,
	type ResourceId,
	type ResourceReservation
} from '../domain/resources.js';
import type {
	PlayerOperation,
	ResourceConflict,
	TurnJournalEntry,
	TurnPlan
} from '../domain/turn.js';

export interface ReservationResolution {
	corcite: CorciteState;
	plan: TurnPlan;
}

type AvailabilityByStorage = Map<
	string,
	Record<ResourceId, number>
>;

function nextSequence(plan: TurnPlan): number {
	return plan.journal.length + 1;
}

function appendJournal(
	plan: TurnPlan,
	entry: Omit<TurnJournalEntry, 'sequence'>
): void {
	plan.journal.push({
		sequence: nextSequence(plan),
		...entry
	});
}

function activeReservedAmount(
	state: CorciteState,
	storageUnitId: string,
	resourceId: ResourceId
): number {
	return state.reservations
		.filter(
			(reservation) =>
				reservation.status === 'active' &&
				reservation.storageUnitId === storageUnitId &&
				reservation.resourceId === resourceId
		)
		.reduce(
			(total, reservation) =>
				total + reservation.amount,
			0
		);
}

function createAvailability(
	state: CorciteState
): AvailabilityByStorage {
	const result: AvailabilityByStorage = new Map();

	const storages = [...state.storageUnits].sort(
		(a, b) => a.id.localeCompare(b.id)
	);

	for (const storage of storages) {
		result.set(storage.id, {
			R1:
				storage.contents.R1 -
				activeReservedAmount(
					state,
					storage.id,
					'R1'
				),
			R2:
				storage.contents.R2 -
				activeReservedAmount(
					state,
					storage.id,
					'R2'
				),
			R3:
				storage.contents.R3 -
				activeReservedAmount(
					state,
					storage.id,
					'R3'
				),
			R4:
				storage.contents.R4 -
				activeReservedAmount(
					state,
					storage.id,
					'R4'
				)
		});
	}

	return result;
}

function totalAvailable(
	availability: AvailabilityByStorage,
	resourceId: ResourceId
): number {
	let total = 0;

	for (const resources of availability.values()) {
		total += resources[resourceId];
	}

	return total;
}

function requestedAmount(
	operation: PlayerOperation,
	resourceId: ResourceId
): number {
	return operation.resourceCosts[resourceId] ?? 0;
}

function createConflict(
	plan: TurnPlan,
	resourceId: ResourceId,
	priority: number,
	available: number,
	operations: readonly PlayerOperation[],
	reason: ResourceConflict['reason'],
	requiresHumanArbitration: boolean
): ResourceConflict {
	const operationIds = operations
		.map((operation) => operation.id)
		.sort();

	const requestedTotal = operations.reduce(
		(total, operation) =>
			total +
			requestedAmount(
				operation,
				resourceId
			),
		0
	);

	return {
		id: [
			'conflict',
			`turn-${plan.turn}`,
			resourceId,
			`priority-${priority}`,
			...operationIds
		].join('-'),
		resourceId,
		priority,
		available,
		requestedTotal,
		operationIds,
		reason,
		requiresHumanArbitration
	};
}

function allocateResource(
	state: CorciteState,
	plan: TurnPlan,
	availability: AvailabilityByStorage,
	operation: PlayerOperation,
	resourceId: ResourceId,
	amount: number
): void {
	let remaining = amount;

	const storageIds = [...availability.keys()].sort();

	for (const storageId of storageIds) {
		if (remaining <= 0) break;

		const resources = availability.get(storageId);

		if (!resources) {
			throw new Error(
				`Stockage ${storageId} absent de la table de disponibilité.`
			);
		}

		const available = resources[resourceId];

		if (available <= 0) continue;

		const allocated = Math.min(
			available,
			remaining
		);

		const reservation: ResourceReservation = {
			id: [
				'reservation',
				`turn-${plan.turn}`,
				operation.id,
				resourceId,
				storageId
			].join('-'),
			operationId: operation.id,
			storageUnitId: storageId,
			resourceId,
			amount: allocated,
			purpose: operation.label,
			status: 'active'
		};

		state.reservations.push(reservation);

		resources[resourceId] -= allocated;
		remaining -= allocated;

		appendJournal(plan, {
			event: 'reservation-created',
			operationId: operation.id,
			resourceId,
			message:
				`${allocated} ${resourceId} réservé dans ${storageId} pour ${operation.id}.`
		});
	}

	if (remaining > 0) {
		throw new Error(
			`Invariant rompu : allocation incomplète de ${resourceId} pour ${operation.id}.`
		);
	}
}

function blockOperation(
	plan: TurnPlan,
	operationId: string,
	message: string
): void {
	const operation = plan.operations.find(
		(candidate) => candidate.id === operationId
	);

	if (!operation) {
		throw new Error(
			`Opération ${operationId} introuvable.`
		);
	}

	operation.status = 'blocked';

	appendJournal(plan, {
		event: 'operation-blocked',
		operationId,
		message
	});
}

function markConflict(
	plan: TurnPlan,
	conflict: ResourceConflict
): void {
	plan.conflicts.push(conflict);

	appendJournal(plan, {
		event: 'resource-conflict',
		resourceId: conflict.resourceId,
		message:
			`Conflit ${conflict.resourceId} : ${conflict.requestedTotal} demandé, ${conflict.available} disponible.`
	});
}

export function resolveTurnReservations(
	inputState: CorciteState,
	inputPlan: TurnPlan
): ReservationResolution {
	if (inputPlan.phase !== 'locked') {
		throw new Error(
			"Les réservations ne peuvent être résolues qu'après verrouillage du tour."
		);
	}

	const state = structuredClone(inputState);
	const plan = structuredClone(inputPlan);
	const availability = createAvailability(state);

	const priorities = [
		...new Set(
			plan.operations
				.filter(
					(operation) =>
						operation.status === 'pending'
				)
				.map(
					(operation) => operation.priority
				)
		)
	].sort((a, b) => b - a);

	const frozenResources = new Set<ResourceId>();
	const allocatedByHigherPriority = new Set<ResourceId>();

	for (const priority of priorities) {
		let candidates = plan.operations
			.filter(
				(operation) =>
					operation.status === 'pending' &&
					operation.priority === priority
			)
			.sort(
				(a, b) =>
					a.id.localeCompare(b.id)
			);

		/*
		 * Première passe :
		 * retirer les opérations qui sont, à elles seules,
		 * impossibles sur une ressource.
		 *
		 * Cela évite de créer un faux conflit collectif autour
		 * d'une opération déjà impossible pour une autre raison.
		 */
		let changed = true;

		while (changed) {
			changed = false;

			for (const resourceId of RESOURCE_IDS) {
				if (
					frozenResources.has(resourceId)
				) {
					continue;
				}

				const requesters = candidates.filter(
					(operation) =>
						requestedAmount(
							operation,
							resourceId
						) > 0
				);

				if (requesters.length !== 1) {
					continue;
				}

				const operation = requesters[0];
				const requested = requestedAmount(
					operation,
					resourceId
				);
				const available = totalAvailable(
					availability,
					resourceId
				);

				if (requested <= available) {
					continue;
				}

				const conflict = createConflict(
					plan,
					resourceId,
					priority,
					available,
					[operation],
					allocatedByHigherPriority.has(resourceId)
						? 'blocked-by-higher-priority'
						: 'insufficient-resource',
					false
				);

				markConflict(plan, conflict);
				blockOperation(
					plan,
					operation.id,
					`Ressource ${resourceId} insuffisante.`
				);

				/*
				 * L'opération est impossible et n'a rien réservé.
				 * La ressource reste donc disponible pour les
				 * priorités inférieures.
				 */
				candidates = candidates.filter(
					(candidate) =>
						candidate.id !== operation.id
				);

				changed = true;
				break;
			}
		}

		/*
		 * Deuxième passe :
		 * détecter les compétitions entre opérations de même
		 * priorité. Aucun choix arbitraire n'est fait.
		 */
		const ambiguousOperationIds = new Set<string>();
		const rejectedByArbitrationIds = new Set<string>();

		for (const resourceId of RESOURCE_IDS) {
			const requesters = candidates.filter(
				(operation) =>
					requestedAmount(
						operation,
						resourceId
					) > 0
			);

			if (requesters.length === 0) continue;

			if (frozenResources.has(resourceId)) {
				for (const operation of requesters) {
					ambiguousOperationIds.add(
						operation.id
					);
				}

				const conflict = createConflict(
					plan,
					resourceId,
					priority,
					totalAvailable(
						availability,
						resourceId
					),
					requesters,
					'blocked-by-higher-priority',
					false
				);

				markConflict(plan, conflict);
				continue;
			}

			const requested = requesters.reduce(
				(total, operation) =>
					total +
					requestedAmount(
						operation,
						resourceId
					),
				0
			);

			const available = totalAvailable(
				availability,
				resourceId
			);

			if (requested <= available) continue;

			const conflict = createConflict(
				plan,
				resourceId,
				priority,
				available,
				requesters,
				'competing-equal-priority',
				true
			);

			const decision = plan.arbitrations.find(
				(candidate) =>
					candidate.conflictId === conflict.id
			);

			if (decision) {
				const selected = new Set(
					decision.selectedOperationIds
				);

				conflict.requiresHumanArbitration = false;
				conflict.selectedOperationIds = [
					...decision.selectedOperationIds
				].sort();

				for (const operation of requesters) {
					if (!selected.has(operation.id)) {
						rejectedByArbitrationIds.add(
							operation.id
						);
					}
				}

				markConflict(plan, conflict);
				continue;
			}

			for (const operation of requesters) {
				ambiguousOperationIds.add(
					operation.id
				);
			}

			markConflict(plan, conflict);
			frozenResources.add(resourceId);
		}

		for (const operationId of [
			...ambiguousOperationIds
		].sort()) {
			blockOperation(
				plan,
				operationId,
				"Opération bloquée par un conflit de ressources."
			);
		}

		for (const operationId of [
			...rejectedByArbitrationIds
		].sort()) {
			blockOperation(
				plan,
				operationId,
				"Opération écartée par l'arbitrage du joueur."
			);
		}

		const reservable = candidates.filter(
			(operation) =>
				!ambiguousOperationIds.has(
					operation.id
				) &&
				!rejectedByArbitrationIds.has(
					operation.id
				) &&
				operation.status === 'pending'
		);

		for (const operation of reservable) {
			for (const resourceId of RESOURCE_IDS) {
				const amount = requestedAmount(
					operation,
					resourceId
				);

				if (amount <= 0) continue;

				allocateResource(
					state,
					plan,
					availability,
					operation,
					resourceId,
					amount
				);
			}

			const target = plan.operations.find(
				(candidate) =>
					candidate.id === operation.id
			);

			if (!target) {
				throw new Error(
					`Opération ${operation.id} introuvable après réservation.`
				);
			}

			target.status = 'reserved';

			appendJournal(plan, {
				event: 'operation-reserved',
				operationId: operation.id,
				message:
					`Toutes les ressources de ${operation.id} sont réservées.`
			});
		}

		/*
		 * Ces ressources ont été effectivement réservées à ce niveau
		 * de priorité. Elles sont donc considérées comme prises par
		 * une priorité supérieure pour les niveaux suivants.
		 */
		for (const operation of reservable) {
			for (const resourceId of RESOURCE_IDS) {
				if (
					requestedAmount(operation, resourceId) > 0
				) {
					allocatedByHigherPriority.add(resourceId);
				}
			}
		}
	}

	const unresolvedHumanConflict = plan.conflicts.some(
		(conflict) =>
			conflict.requiresHumanArbitration
	);

	plan.phase = unresolvedHumanConflict
		? 'awaiting-arbitration'
		: 'reservations-resolved';

	return {
		corcite: state,
		plan
	};
}
