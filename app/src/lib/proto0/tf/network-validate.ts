import {
	TF_EXTRACTION_LAB_REFERENCE
} from '../config/tf-extraction-reference.js';
import {
	TF_PROCESSING_LAB_REFERENCE
} from '../config/tf-processing-reference.js';
import type {
	StructureKind,
	StructureState
} from '../domain/corcite.js';
import type {
	ResourceId
} from '../domain/resources.js';
import type {
	TfConnectionState,
	TfNetworkState
} from '../domain/tf.js';

export interface TfNetworkValidationResult {
	valid: boolean;
	errors: string[];
}

function findDuplicates(
	values: readonly string[]
): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();

	for (const value of values) {
		if (seen.has(value)) {
			duplicates.add(value);
		}

		seen.add(value);
	}

	return [...duplicates].sort();
}

function outputResourcesForKind(
	kind: StructureKind
): Set<ResourceId> {
	const result = new Set<ResourceId>();

	for (
		const rule of
		TF_EXTRACTION_LAB_REFERENCE.rules
	) {
		if (
			rule.extractorKind !== kind
		) {
			continue;
		}

		const source =
			TF_EXTRACTION_LAB_REFERENCE
				.sources
				.find(
					(candidate) =>
						candidate.id ===
						rule.sourceId
				);

		if (source) {
			result.add(
				source.resourceId
			);
		}
	}

	for (
		const recipe of
		TF_PROCESSING_LAB_REFERENCE.recipes
	) {
		if (
			recipe.structureKind !== kind
		) {
			continue;
		}

		for (
			const [
				resourceId,
				amount
			] of Object.entries(
				recipe.outputs
			)
		) {
			if (
				typeof amount === 'number' &&
				amount > 0
			) {
				result.add(
					resourceId as ResourceId
				);
			}
		}
	}

	return result;
}

function inputRequirementForKind(
	kind: StructureKind,
	resourceId: ResourceId
): number | undefined {
	const matches =
		TF_PROCESSING_LAB_REFERENCE
			.recipes
			.filter(
				(recipe) =>
					recipe.structureKind ===
						kind &&
					(
						recipe.inputs[
							resourceId
						] ?? 0
					) > 0
			);

	if (matches.length !== 1) {
		return undefined;
	}

	return matches[0]
		.inputs[resourceId];
}

function validateConnectionCompatibility(
	connection: TfConnectionState,
	structures: readonly StructureState[],
	errors: string[]
): void {
	const from = structures.find(
		(structure) =>
			structure.id ===
				connection.fromStructureId
	);

	const to = structures.find(
		(structure) =>
			structure.id ===
				connection.toStructureId
	);

	if (!from) {
		errors.push(
			`Connexion ${connection.id} : structure source inconnue ${connection.fromStructureId}.`
		);
	}

	if (!to) {
		errors.push(
			`Connexion ${connection.id} : structure destination inconnue ${connection.toStructureId}.`
		);
	}

	if (!from || !to) return;

	if (
		from.id === to.id
	) {
		errors.push(
			`Connexion ${connection.id} : une structure ne peut pas être connectée à elle-même.`
		);
	}

	if (
		!outputResourcesForKind(
			from.kind
		).has(
			connection.resourceId
		)
	) {
		errors.push(
			`Connexion ${connection.id} : ${from.kind} ne produit pas ${connection.resourceId}.`
		);
	}

	if (
		inputRequirementForKind(
			to.kind,
			connection.resourceId
		) === undefined
	) {
		errors.push(
			`Connexion ${connection.id} : ${to.kind} ne consomme pas ${connection.resourceId} dans le référentiel PROTO-0.`
		);
	}
}

export function getTfDownstreamBatchRequirement(
	structures: readonly StructureState[],
	toStructureId: string,
	resourceId: ResourceId
): number {
	const target = structures.find(
		(structure) =>
			structure.id ===
				toStructureId
	);

	if (!target) {
		throw new Error(
			`Structure destination inconnue : ${toStructureId}.`
		);
	}

	const requirement =
		inputRequirementForKind(
			target.kind,
			resourceId
		);

	if (
		requirement === undefined ||
		!Number.isFinite(requirement) ||
		requirement <= 0
	) {
		throw new Error(
			`${target.kind} ne possède pas de lot aval PROTO-0 pour ${resourceId}.`
		);
	}

	return requirement;
}

export function validateTfNetworkState(
	network: TfNetworkState,
	structures: readonly StructureState[]
): TfNetworkValidationResult {
	const errors: string[] = [];

	for (
		const duplicate of findDuplicates(
			network.connections.map(
				(connection) =>
					connection.id
			)
		)
	) {
		errors.push(
			`Connexion TF dupliquée : ${duplicate}.`
		);
	}

	for (
		const duplicate of findDuplicates(
			network.buffers.map(
				(buffer) => buffer.id
			)
		)
	) {
		errors.push(
			`Tampon TF dupliqué : ${duplicate}.`
		);
	}

	for (const connection of network.connections) {
		if (!connection.id.trim()) {
			errors.push(
				"Une connexion TF possède un identifiant vide."
			);
		}

		validateConnectionCompatibility(
			connection,
			structures,
			errors
		);

		if (
			connection.routing.mode ===
				'priority'
		) {
			if (
				!Number.isInteger(
					connection.routing.priority
				) ||
				connection.routing.priority < 0
			) {
				errors.push(
					`Connexion ${connection.id} : priorité invalide.`
				);
			}
		} else if (
			!Number.isFinite(
				connection.routing.weight
			) ||
			connection.routing.weight <= 0
		) {
			errors.push(
				`Connexion ${connection.id} : poids de répartition invalide.`
			);
		}

		const buffers =
			network.buffers.filter(
				(buffer) =>
					buffer.connectionId ===
						connection.id
			);

		if (buffers.length !== 1) {
			errors.push(
				`Connexion ${connection.id} : exactement un tampon automatique est requis.`
			);

			continue;
		}

		const buffer = buffers[0];

		if (
			buffer.resourceId !==
				connection.resourceId
		) {
			errors.push(
				`Tampon ${buffer.id} : ressource incompatible avec la connexion ${connection.id}.`
			);
		}

		const target =
			structures.find(
				(structure) =>
					structure.id ===
						connection.toStructureId
			);

		if (target) {
			const expected =
				inputRequirementForKind(
					target.kind,
					connection.resourceId
				);

			if (
				expected !== undefined &&
				buffer.capacity !==
					expected
			) {
				errors.push(
					`Tampon ${buffer.id} : capacité ${buffer.capacity}, lot aval attendu ${expected}.`
				);
			}
		}
	}

	for (const buffer of network.buffers) {
		if (!buffer.id.trim()) {
			errors.push(
				"Un tampon TF possède un identifiant vide."
			);
		}

		if (
			!network.connections.some(
				(connection) =>
					connection.id ===
						buffer.connectionId
			)
		) {
			errors.push(
				`Tampon ${buffer.id} : connexion inconnue ${buffer.connectionId}.`
			);
		}

		if (
			!Number.isFinite(
				buffer.capacity
			) ||
			buffer.capacity <= 0
		) {
			errors.push(
				`Tampon ${buffer.id} : capacité invalide.`
			);
		}

		if (
			!Number.isFinite(
				buffer.amount
			) ||
			buffer.amount < 0 ||
			buffer.amount >
				buffer.capacity
		) {
			errors.push(
				`Tampon ${buffer.id} : contenu ${buffer.amount} incompatible avec la capacité ${buffer.capacity}.`
			);
		}
	}

	const branchGroups =
		new Map<
			string,
			TfConnectionState[]
		>();

	for (const connection of network.connections) {
		const key =
			`${connection.fromStructureId}:${connection.resourceId}`;

		const group =
			branchGroups.get(key) ?? [];

		group.push(connection);
		branchGroups.set(
			key,
			group
		);
	}

	for (
		const [key, connections]
		of branchGroups
	) {
		if (connections.length < 2) {
			continue;
		}

		const modes = new Set(
			connections.map(
				(connection) =>
					connection.routing.mode
			)
		);

		if (modes.size !== 1) {
			errors.push(
				`Bifurcation ${key} : les modes priority et weighted ne peuvent pas être mélangés.`
			);

			continue;
		}

		if (
			connections[0].routing.mode ===
				'priority'
		) {
			const priorities =
				connections.map(
					(connection) =>
						connection.routing.mode ===
							'priority'
							? connection.routing.priority
							: -1
				);

			if (
				new Set(priorities).size !==
					priorities.length
			) {
				errors.push(
					`Bifurcation ${key} : les priorités doivent être uniques.`
				);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
