import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';

export interface CommittedReservationConsumption {
	reservationId: string;
	operationId: string;
	storageUnitId: string;
	resourceId: ResourceId;
	amount: number;
	purpose: string;
}

export interface CommitOperationReservationsResult {
	corcite: CorciteState;
	consumptions:
		CommittedReservationConsumption[];
}

export function commitOperationReservations(
	inputState: CorciteState,
	operationId: string
): CommitOperationReservationsResult {
	if (!operationId.trim()) {
		throw new Error(
			'Une opération à engager doit posséder un identifiant.'
		);
	}

	const state =
		structuredClone(
			inputState
		);

	const reservations =
		state.reservations
			.filter(
				(reservation) =>
					reservation.operationId ===
						operationId &&
					reservation.status ===
						'active'
			)
			.sort(
				(a, b) =>
					a.id.localeCompare(
						b.id
					)
			);

	if (
		reservations.length === 0
	) {
		throw new Error(
			`Aucune réservation active pour l'opération ${operationId}.`
		);
	}

	const consumptions:
		CommittedReservationConsumption[] =
			[];

	for (
		const reservation of
		reservations
	) {
		const storage =
			state.storageUnits.find(
				(candidate) =>
					candidate.id ===
						reservation
							.storageUnitId
			);

		if (!storage) {
			throw new Error(
				`Stockage réservé introuvable : ${reservation.storageUnitId}.`
			);
		}

		if (
			storage.contents[
				reservation.resourceId
			] <
			reservation.amount
		) {
			throw new Error(
				`La réservation ${reservation.id} ne peut pas être engagée : contenu insuffisant.`
			);
		}

		storage.contents[
			reservation.resourceId
		] -=
			reservation.amount;

		reservation.status =
			'consumed';

		consumptions.push({
			reservationId:
				reservation.id,
			operationId:
				reservation
					.operationId,
			storageUnitId:
				reservation
					.storageUnitId,
			resourceId:
				reservation
					.resourceId,
			amount:
				reservation.amount,
			purpose:
				reservation.purpose
		});
	}

	return {
		corcite: state,
		consumptions
	};
}
