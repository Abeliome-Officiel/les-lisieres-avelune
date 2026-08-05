import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfExtractionPlacement,
	TfNetworkRoutingResolution
} from '../domain/tf.js';
import {
	routeTfOutputToNetwork
} from './network-routing.js';
import {
	getTotalFreeStorageCapacity,
	storeResourceDeterministically
} from './storage.js';

export interface TfOutputPlacementResult {
	success: boolean;
	corcite: CorciteState;
	routing: TfNetworkRoutingResolution;
	storagePlacements: TfExtractionPlacement[];
}

/**
 * Place une sortie TF de façon atomique.
 *
 * 1. Les connexions directes et leurs tampons sont servies.
 * 2. Seul le reliquat est envoyé vers le stockage général.
 * 3. Si le stockage ne peut pas recevoir tout le reliquat,
 *    aucune partie de la sortie n'est commitée, y compris dans
 *    les tampons.
 */
export function tryPlaceTfOutput(
	inputState: CorciteState,
	fromStructureId: string,
	resourceId: ResourceId,
	amount: number
): TfOutputPlacementResult {
	const routed =
		routeTfOutputToNetwork(
			inputState,
			fromStructureId,
			resourceId,
			amount
		);

	const remainder =
		routed.resolution
			.unroutedAmount;

	if (
		getTotalFreeStorageCapacity(
			routed.corcite
		) < remainder
	) {
		return {
			success: false,
			corcite:
				structuredClone(
					inputState
				),
			routing:
				routed.resolution,
			storagePlacements: []
		};
	}

	const state =
		routed.corcite;

	const storagePlacements =
		remainder > 0
			? storeResourceDeterministically(
					state,
					resourceId,
					remainder
			  )
			: [];

	return {
		success: true,
		corcite: state,
		routing:
			routed.resolution,
		storagePlacements
	};
}
