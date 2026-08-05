import { validateRpgState } from '../rpg/validate.js';
import { validateTdState } from '../td/validate.js';
import { validateTfNetworkState } from '../tf/network-validate.js';
import type { CorciteState } from '../domain/corcite.js';
import { RESOURCE_IDS } from '../domain/resources.js';

export interface CorciteValidationResult {
	valid: boolean;
	errors: string[];
}

function isNonNegativeFinite(value: number): boolean {
	return Number.isFinite(value) && value >= 0;
}

function findDuplicates(values: readonly string[]): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();

	for (const value of values) {
		if (seen.has(value)) duplicates.add(value);
		seen.add(value);
	}

	return [...duplicates];
}

export function validateCorciteState(
	state: CorciteState
): CorciteValidationResult {
	const errors: string[] = [];


	if (state.population !== undefined) {
		if (
			!Number.isInteger(
				state.population.total
			) ||
			state.population.total < 1
		) {
			errors.push(
				'Population totale invalide'
			);
		}

		if (
			!isNonNegativeFinite(
				state.population
					.workPerPopulation
			) ||
			state.population
				.workPerPopulation <= 0
		) {
			errors.push(
				'Production de travail par habitant invalide'
			);
		}

		const expectedWorkCapacity =
			state.population.total *
			state.population.workPerPopulation;

		if (
			Number.isFinite(
				expectedWorkCapacity
			) &&
			state.capacities.work.capacity !==
				expectedWorkCapacity
		) {
			errors.push(
				'La capacité de travail ne correspond pas à la population'
			);
		}
	}

	const tdValidation =
		validateTdState(
			state.td
		);

	errors.push(
		...tdValidation.errors
	);

	const tfNetworkValidation =
		validateTfNetworkState(
			state.tfNetwork,
			state.structures
		);

	errors.push(
		...tfNetworkValidation.errors
	);

	const rpgValidation =
		validateRpgState(
			state.rpg
		);

	errors.push(
		...rpgValidation.errors
	);

	const duplicateStorageIds = findDuplicates(
		state.storageUnits.map((storage) => storage.id)
	);

	if (duplicateStorageIds.length > 0) {
		errors.push(
			`Identifiants de stockage dupliqués : ${duplicateStorageIds.join(', ')}`
		);
	}

	const duplicateStructureIds = findDuplicates(
		state.structures.map((structure) => structure.id)
	);

	if (duplicateStructureIds.length > 0) {
		errors.push(
			`Identifiants de structure dupliqués : ${duplicateStructureIds.join(', ')}`
		);
	}

	for (const storage of state.storageUnits) {
		if (!isNonNegativeFinite(storage.capacity)) {
			errors.push(
				`Capacité invalide pour ${storage.id}`
			);
			continue;
		}

		let load = 0;

		for (const resourceId of RESOURCE_IDS) {
			const amount = storage.contents[resourceId];

			if (!isNonNegativeFinite(amount)) {
				errors.push(
					`Quantité ${resourceId} invalide dans ${storage.id}`
				);
			}

			load += amount;
		}

		if (load > storage.capacity) {
			errors.push(
				`${storage.id} dépasse sa capacité : ${load}/${storage.capacity}`
			);
		}

		const storageStructure = state.structures.find(
			(structure) => structure.id === storage.structureId
		);

		if (!storageStructure) {
			errors.push(
				`${storage.id} référence une structure inexistante`
			);
		} else if (storageStructure.kind !== 'storage-n1') {
			errors.push(
				`${storage.id} référence une structure qui n'est pas un stockage`
			);
		}
	}

	const capacities = [
		[
			'maintenance',
			state.capacities.maintenance.capacity,
			state.capacities.maintenance.used
		],
		[
			'work',
			state.capacities.work.capacity,
			state.capacities.work.used
		],
		[
			'space',
			state.capacities.space.capacity,
			state.capacities.space.used
		]
	] as const;

	for (const [name, capacity, used] of capacities) {
		if (
			!isNonNegativeFinite(capacity) ||
			!isNonNegativeFinite(used)
		) {
			errors.push(`Capacité ${name} invalide`);
		}
	}

	if (
		!isNonNegativeFinite(
			state.capacities.energy.normalCapacity
		) ||
		!isNonNegativeFinite(state.capacities.energy.used) ||
		!isNonNegativeFinite(
			state.capacities.energy.reserveMaximum
		) ||
		!isNonNegativeFinite(
			state.capacities.energy.reserveCurrent
		)
	) {
		errors.push('Etat énergétique invalide');
	}

	if (
		state.capacities.energy.reserveCurrent >
		state.capacities.energy.reserveMaximum
	) {
		errors.push(
			'La réserve énergétique courante dépasse son maximum'
		);
	}

	const duplicateModifierIds =
		findDuplicates(
			state.modifiers.map(
				(modifier) =>
					modifier.id
			)
		);

	if (
		duplicateModifierIds.length > 0
	) {
		errors.push(
			`Identifiants de modificateur dupliqués : ${duplicateModifierIds.join(', ')}`
		);
	}

	for (
		const modifier of
		state.modifiers
	) {
		if (!modifier.id.trim()) {
			errors.push(
				'Un modificateur possède un identifiant vide'
			);
		}

		if (!modifier.source.trim()) {
			errors.push(
				`Modificateur ${modifier.id} : origine vide`
			);
		}

		if (!modifier.target.trim()) {
			errors.push(
				`Modificateur ${modifier.id} : cible vide`
			);
		}

		if (
			!Number.isFinite(
				modifier.value
			)
		) {
			errors.push(
				`Modificateur ${modifier.id} : valeur invalide`
			);
		}
	}

	const duplicateWaveConsequenceIds =
		findDuplicates(
			state.waveConsequences.map(
				(consequence) =>
					consequence.id
			)
		);

	if (
		duplicateWaveConsequenceIds.length >
			0
	) {
		errors.push(
			`Identifiants de conséquences de vague dupliqués : ${duplicateWaveConsequenceIds.join(', ')}`
		);
	}

	for (
		const consequence of
		state.waveConsequences
	) {
		if (
			!consequence.id.trim() ||
			!consequence.runId.trim()
		) {
			errors.push(
				'Une conséquence de vague possède un identifiant vide'
			);
		}

		if (
			!Number.isInteger(
				consequence.turn
			) ||
			consequence.turn < 1
		) {
			errors.push(
				`Conséquence ${consequence.id} : tour invalide`
			);
		}

		for (
			const [
				name,
				value
			] of Object.entries(
				consequence.finalWave
			)
		) {
			if (
				!isNonNegativeFinite(
					value
				)
			) {
				errors.push(
					`Conséquence ${consequence.id} : ${name} final invalide`
				);
			}
		}

		if (
			!isNonNegativeFinite(
				consequence
					.capturedMatter
			)
		) {
			errors.push(
				`Conséquence ${consequence.id} : matière captée invalide`
			);
		}

		for (
			const consumption of
			consequence.consumptions
		) {
			if (
				!Number.isFinite(
					consumption.amount
				) ||
				consumption.amount <=
					0 ||
				!consumption.source.trim()
			) {
				errors.push(
					`Conséquence ${consequence.id} : consommation invalide`
				);
			}
		}

		for (
			const knowledge of
			consequence.knowledgeProduced
		) {
			const persisted =
				state.rpg.knowledge.find(
					(entry) =>
						entry.id ===
							knowledge.id
				);

			if (
				!persisted ||
				persisted.source !==
					knowledge.source ||
				persisted.key !==
					knowledge.key ||
				persisted.value !==
					knowledge.value
			) {
				errors.push(
					`Conséquence ${consequence.id} : connaissance ${knowledge.id} non persistée dans le RPG`
				);
			}
		}
	}

	for (const reservation of state.reservations) {
		if (
			!Number.isFinite(reservation.amount) ||
			reservation.amount <= 0
		) {
			errors.push(
				`Réservation ${reservation.id} : quantité invalide`
			);
		}

		const storage = state.storageUnits.find(
			(candidate) =>
				candidate.id === reservation.storageUnitId
		);

		if (!storage) {
			errors.push(
				`Réservation ${reservation.id} : stockage inexistant`
			);
		}
	}

	for (const storage of state.storageUnits) {
		for (const resourceId of RESOURCE_IDS) {
			const reserved = state.reservations
				.filter(
					(reservation) =>
						reservation.status === 'active' &&
						reservation.storageUnitId === storage.id &&
						reservation.resourceId === resourceId
				)
				.reduce(
					(total, reservation) =>
						total + reservation.amount,
					0
				);

			if (reserved > storage.contents[resourceId]) {
				errors.push(
					`Réservations ${resourceId} supérieures au stock dans ${storage.id}`
				);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
