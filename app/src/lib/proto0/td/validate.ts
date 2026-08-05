import {
	TD_LAB_REFERENCE,
	TD_PATH_POSITIONS
} from '../config/td-reference.js';
import type {
	TdState
} from '../domain/td.js';

export interface TdValidationResult {
	valid: boolean;
	errors: string[];
}

function findDuplicates(
	values: readonly string[]
): string[] {
	const seen =
		new Set<string>();

	const duplicates =
		new Set<string>();

	for (const value of values) {
		if (seen.has(value)) {
			duplicates.add(value);
		}

		seen.add(value);
	}

	return [...duplicates];
}

export function validateTdState(
	state: TdState
): TdValidationResult {
	const errors: string[] = [];

	if (
		state.positions.length !==
			TD_PATH_POSITIONS.length
	) {
		errors.push(
			`Le chemin TD doit contenir exactement ${TD_PATH_POSITIONS.length} positions`
		);
	}

	for (
		let index = 0;
		index <
			state.positions.length;
		index += 1
	) {
		const position =
			state.positions[index];

		const expected =
			TD_PATH_POSITIONS[index];

		if (
			position.position !==
				expected
		) {
			errors.push(
				`Chemin TD : position ${index + 1} invalide, ${expected} attendu`
			);
		}

		const tower =
			position.tower;

		if (!tower) {
			continue;
		}

		if (!tower.id.trim()) {
			errors.push(
				`Position ${position.position} : identifiant de tour vide`
			);
		}

		const definition =
			TD_LAB_REFERENCE.towers.find(
				(candidate) =>
					candidate.id ===
						tower.definitionId
			);

		if (!definition) {
			errors.push(
				`Tour ${tower.id} : définition inconnue`
			);

			continue;
		}

		if (
			tower.family !==
				definition.family
		) {
			errors.push(
				`Tour ${tower.id} : famille incompatible avec sa définition`
			);
		}

		if (
			tower.level !==
				definition.level
		) {
			errors.push(
				`Tour ${tower.id} : niveau incompatible avec sa définition`
			);
		}
	}

	const towerIds =
		state.positions.flatMap(
			(position) =>
				position.tower
					? [
							position.tower.id
						]
					: []
		);

	const duplicateTowerIds =
		findDuplicates(
			towerIds
		);

	if (
		duplicateTowerIds.length > 0
	) {
		errors.push(
			`Identifiants de tours TD dupliqués : ${duplicateTowerIds.join(', ')}`
		);
	}

	return {
		valid:
			errors.length === 0,
		errors
	};
}
