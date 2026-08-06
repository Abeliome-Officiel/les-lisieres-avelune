import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfBufferState,
	TfConnectionState,
	TfNetworkRouteMovement,
	TfNetworkRoutingResolution
} from '../domain/tf.js';

const EPSILON = 1e-12;

interface RouteCandidate {
	connection: TfConnectionState;
	buffer: TfBufferState;
}

export interface TfNetworkRoutingResult {
	corcite: CorciteState;
	resolution: TfNetworkRoutingResolution;
}

function freeCapacity(
	buffer: TfBufferState
): number {
	return Math.max(
		0,
		buffer.capacity - buffer.amount
	);
}

function getCandidates(
	state: CorciteState,
	fromStructureId: string,
	resourceId: ResourceId
): RouteCandidate[] {
	return state.tfNetwork.connections
		.filter(
			(connection) =>
				connection.fromStructureId ===
					fromStructureId &&
				connection.resourceId ===
					resourceId
		)
		.map((connection) => {
			const buffer =
				state.tfNetwork.buffers.find(
					(candidate) =>
						candidate.connectionId ===
							connection.id
				);

			if (!buffer) {
				throw new Error(
					`Connexion ${connection.id} sans tampon TF.`
				);
			}

			if (
				buffer.resourceId !==
					resourceId
			) {
				throw new Error(
					`Tampon ${buffer.id} incompatible avec ${resourceId}.`
				);
			}

			return {
				connection,
				buffer
			};
		})
		.sort(
			(a, b) =>
				a.connection.id.localeCompare(
					b.connection.id
				)
		);
}

function addMovement(
	totals: Map<string, number>,
	candidate: RouteCandidate,
	amount: number
): void {
	if (amount <= EPSILON) {
		return;
	}

	candidate.buffer.amount +=
		amount;

	totals.set(
		candidate.connection.id,
		(
			totals.get(
				candidate.connection.id
			) ?? 0
		) + amount
	);
}

function routeByPriority(
	candidates: RouteCandidate[],
	amount: number,
	totals: Map<string, number>
): void {
	const ordered =
		[...candidates].sort(
			(a, b) => {
				if (
					a.connection.routing.mode !==
						'priority' ||
					b.connection.routing.mode !==
						'priority'
				) {
					throw new Error(
						"Une bifurcation prioritaire contient un mode incompatible."
					);
				}

				return (
					b.connection.routing.priority -
						a.connection.routing.priority ||
					a.connection.id.localeCompare(
						b.connection.id
					)
				);
			}
		);

	let remaining = amount;

	for (const candidate of ordered) {
		if (remaining <= EPSILON) {
			break;
		}

		const allocated = Math.min(
			remaining,
			freeCapacity(
				candidate.buffer
			)
		);

		addMovement(
			totals,
			candidate,
			allocated
		);

		remaining -= allocated;
	}
}

function routeByWeight(
	candidates: RouteCandidate[],
	amount: number,
	totals: Map<string, number>
): void {
	for (const candidate of candidates) {
		if (
			candidate.connection.routing.mode !==
				'weighted'
		) {
			throw new Error(
				"Une bifurcation pondérée contient un mode incompatible."
			);
		}
	}

	let remaining = amount;

	while (remaining > EPSILON) {
		const available =
			candidates.filter(
				(candidate) =>
					freeCapacity(
						candidate.buffer
					) > EPSILON
			);

		if (available.length === 0) {
			break;
		}

		const totalWeight =
			available.reduce(
				(total, candidate) => {
					if (
						candidate.connection
							.routing.mode !==
							'weighted'
					) {
						return total;
					}

					return (
						total +
						candidate.connection
							.routing.weight
					);
				},
				0
			);

		if (totalWeight <= 0) {
			throw new Error(
				"Somme des poids TF invalide."
			);
		}

		const amountAtStart =
			remaining;

		let allocatedThisPass = 0;

		for (const candidate of available) {
			if (
				candidate.connection
					.routing.mode !==
					'weighted'
			) {
				throw new Error(
					"Mode TF pondéré invalide."
				);
			}

			const proportionalShare =
				amountAtStart *
				(
					candidate.connection
						.routing.weight /
					totalWeight
				);

			const allocated = Math.min(
				proportionalShare,
				freeCapacity(
					candidate.buffer
				)
			);

			addMovement(
				totals,
				candidate,
				allocated
			);

			allocatedThisPass +=
				allocated;
		}

		if (
			allocatedThisPass <=
				EPSILON
		) {
			break;
		}

		remaining -=
			allocatedThisPass;
	}
}

function createMovements(
	candidates: readonly RouteCandidate[],
	totals: ReadonlyMap<string, number>,
	resourceId: ResourceId
): TfNetworkRouteMovement[] {
	return candidates
		.map((candidate) => {
			const amount =
				totals.get(
					candidate.connection.id
				) ?? 0;

			return {
				connectionId:
					candidate.connection.id,
				bufferId:
					candidate.buffer.id,
				toStructureId:
					candidate.connection
						.toStructureId,
				resourceId,
				amount
			};
		})
		.filter(
			(movement) =>
				movement.amount >
					EPSILON
		)
		.sort(
			(a, b) =>
				a.connectionId.localeCompare(
					b.connectionId
				)
		);
}

export function routeTfOutputToNetwork(
	inputState: CorciteState,
	fromStructureId: string,
	resourceId: ResourceId,
	amount: number
): TfNetworkRoutingResult {
	if (
		!Number.isFinite(amount) ||
		amount < 0
	) {
		throw new Error(
			`Quantité TF à router invalide : ${amount}.`
		);
	}

	const state =
		structuredClone(inputState);

	const candidates =
		getCandidates(
			state,
			fromStructureId,
			resourceId
		);

	if (
		amount === 0 ||
		candidates.length === 0
	) {
		return {
			corcite: state,
			resolution: {
				fromStructureId,
				resourceId,
				requestedAmount: amount,
				routedAmount: 0,
				unroutedAmount: amount,
				movements: []
			}
		};
	}

	const modes =
		new Set(
			candidates.map(
				(candidate) =>
					candidate.connection
						.routing.mode
			)
		);

	if (modes.size !== 1) {
		throw new Error(
			"Une bifurcation TF mélange plusieurs modes de routage."
		);
	}

	const totals =
		new Map<string, number>();

	if (
		candidates[0].connection
			.routing.mode ===
			'priority'
	) {
		routeByPriority(
			candidates,
			amount,
			totals
		);
	} else {
		routeByWeight(
			candidates,
			amount,
			totals
		);
	}

	const movements =
		createMovements(
			candidates,
			totals,
			resourceId
		);

	const routedAmount =
		movements.reduce(
			(total, movement) =>
				total + movement.amount,
			0
		);

	const unroutedAmount =
		Math.max(
			0,
			amount - routedAmount
		);

	return {
		corcite: state,
		resolution: {
			fromStructureId,
			resourceId,
			requestedAmount: amount,
			routedAmount,
			unroutedAmount:
				unroutedAmount <= EPSILON
					? 0
					: unroutedAmount,
			movements
		}
	};
}
