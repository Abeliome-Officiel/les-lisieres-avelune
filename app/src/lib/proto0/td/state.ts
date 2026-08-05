import {
	TD_LAB_REFERENCE,
	TD_PATH_POSITIONS
} from '../config/td-reference.js';
import type {
	TdPathPosition,
	TdState,
	TdTowerDefinitionId,
	TdTowerState
} from '../domain/td.js';

export interface CreateTdTowerInput {
	id: string;
	definitionId: TdTowerDefinitionId;
}

export interface PlaceTdTowerInput {
	position: number;
	tower: TdTowerState;
}

export function createEmptyTdState(): TdState {
	return {
		positions:
			TD_PATH_POSITIONS.map(
				(position) => ({
					position,
					tower: null
				})
			)
	};
}

export function createTdTower(
	input: CreateTdTowerInput
): TdTowerState {
	if (!input.id.trim()) {
		throw new Error(
			'Une tour TD doit posséder un identifiant.'
		);
	}

	const definition =
		TD_LAB_REFERENCE.towers.find(
			(candidate) =>
				candidate.id ===
					input.definitionId
		);

	if (!definition) {
		throw new Error(
			`Définition de tour TD inconnue : ${input.definitionId}.`
		);
	}

	return {
		id: input.id,
		definitionId:
			definition.id,
		family:
			definition.family,
		level:
			definition.level,
		label:
			definition.label
	};
}

export function placeTdTower(
	inputState: TdState,
	input: PlaceTdTowerInput
): TdState {
	if (
		!TD_PATH_POSITIONS.includes(
			input.position as TdPathPosition
		)
	) {
		throw new Error(
			`Position TD invalide : ${input.position}.`
		);
	}

	if (
		inputState.positions.some(
			(position) =>
				position.tower?.id ===
					input.tower.id
		)
	) {
		throw new Error(
			`La tour TD ${input.tower.id} est déjà placée.`
		);
	}

	const state =
		structuredClone(
			inputState
		);

	const target =
		state.positions.find(
			(position) =>
				position.position ===
					input.position
		);

	if (!target) {
		throw new Error(
			`La position TD ${input.position} est absente du chemin.`
		);
	}

	if (target.tower) {
		throw new Error(
			`La position TD ${input.position} est déjà occupée.`
		);
	}

	target.tower =
		structuredClone(
			input.tower
		);

	return state;
}
