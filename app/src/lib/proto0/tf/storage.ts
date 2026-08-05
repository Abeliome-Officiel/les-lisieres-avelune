import type { CorciteState } from '../domain/corcite.js';
import type {
	ResourceId,
	StorageUnitState
} from '../domain/resources.js';
import type {
	TfExtractionPlacement
} from '../domain/tf.js';

export function getStorageLoad(
	storage: StorageUnitState
): number {
	return Object.values(storage.contents).reduce(
		(total, amount) => total + amount,
		0
	);
}

export function getStorageFreeCapacity(
	storage: StorageUnitState
): number {
	return Math.max(
		0,
		storage.capacity - getStorageLoad(storage)
	);
}

export function getTotalFreeStorageCapacity(
	state: CorciteState
): number {
	return state.storageUnits.reduce(
		(total, storage) =>
			total +
			getStorageFreeCapacity(storage),
		0
	);
}

/**
 * Stocke une quantité en utilisant un ordre stable par identifiant.
 *
 * La fonction suppose que la capacité globale nécessaire a déjà
 * été vérifiée. Une production peut être répartie sur plusieurs
 * bâtiments de stockage, mais chaque capacité reste individuelle.
 */
export function storeResourceDeterministically(
	state: CorciteState,
	resourceId: ResourceId,
	amount: number
): TfExtractionPlacement[] {
	if (!Number.isFinite(amount) || amount < 0) {
		throw new Error(
			`Quantité à stocker invalide : ${amount}.`
		);
	}

	if (
		getTotalFreeStorageCapacity(state) <
		amount
	) {
		throw new Error(
			"Capacité de stockage insuffisante."
		);
	}

	let remaining = amount;

	const placements: TfExtractionPlacement[] = [];

	const storages = [...state.storageUnits].sort(
		(a, b) => a.id.localeCompare(b.id)
	);

	for (const storage of storages) {
		if (remaining <= 0) break;

		const free =
			getStorageFreeCapacity(storage);

		if (free <= 0) continue;

		const stored = Math.min(
			free,
			remaining
		);

		const target = state.storageUnits.find(
			(candidate) =>
				candidate.id === storage.id
		);

		if (!target) {
			throw new Error(
				`Stockage ${storage.id} introuvable.`
			);
		}

		target.contents[resourceId] += stored;

		placements.push({
			storageUnitId: target.id,
			resourceId,
			amount: stored
		});

		remaining -= stored;
	}

	if (remaining !== 0) {
		throw new Error(
			"Invariant rompu : stockage incomplet."
		);
	}

	return placements;
}

export function getStorageReservedAmount(
	state: CorciteState,
	storageUnitId: string,
	resourceId: ResourceId
): number {
	return state.reservations
		.filter(
			(reservation) =>
				reservation.status === 'active' &&
				reservation.storageUnitId ===
					storageUnitId &&
				reservation.resourceId ===
					resourceId
		)
		.reduce(
			(total, reservation) =>
				total + reservation.amount,
			0
		);
}

export function getStorageAvailableResource(
	state: CorciteState,
	storage: StorageUnitState,
	resourceId: ResourceId
): number {
	return Math.max(
		0,
		storage.contents[resourceId] -
			getStorageReservedAmount(
				state,
				storage.id,
				resourceId
			)
	);
}

export function getTotalAvailableResource(
	state: CorciteState,
	resourceId: ResourceId
): number {
	return state.storageUnits.reduce(
		(total, storage) =>
			total +
			getStorageAvailableResource(
				state,
				storage,
				resourceId
			),
		0
	);
}

export function consumeResourceDeterministically(
	state: CorciteState,
	resourceId: ResourceId,
	amount: number
): TfExtractionPlacement[] {
	if (
		!Number.isFinite(amount) ||
		amount < 0
	) {
		throw new Error(
			`Quantité à consommer invalide : ${amount}.`
		);
	}

	if (
		getTotalAvailableResource(
			state,
			resourceId
		) < amount
	) {
		throw new Error(
			`Quantité ${resourceId} disponible insuffisante.`
		);
	}

	let remaining = amount;

	const movements: TfExtractionPlacement[] = [];

	const storages = [...state.storageUnits].sort(
		(a, b) =>
			a.id.localeCompare(b.id)
	);

	for (const storage of storages) {
		if (remaining <= 0) break;

		const available =
			getStorageAvailableResource(
				state,
				storage,
				resourceId
			);

		if (available <= 0) continue;

		const consumed = Math.min(
			available,
			remaining
		);

		const target =
			state.storageUnits.find(
				(candidate) =>
					candidate.id ===
					storage.id
			);

		if (!target) {
			throw new Error(
				`Stockage ${storage.id} introuvable.`
			);
		}

		target.contents[resourceId] -=
			consumed;

		movements.push({
			storageUnitId: target.id,
			resourceId,
			amount: consumed
		});

		remaining -= consumed;
	}

	if (remaining !== 0) {
		throw new Error(
			"Invariant rompu : consommation incomplète."
		);
	}

	return movements;
}
