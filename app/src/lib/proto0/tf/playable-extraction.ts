import type {
	CorciteState,
	PlayableCorciteState
} from '../domain/corcite.js';
import type {
	TfExtractionResolution
} from '../domain/tf.js';
import {
	recalculatePlayableCapacities
} from '../corcite/construction.js';
import {
	validateCorciteState
} from '../corcite/validate.js';
import {
	resolveExtractionTurn
} from './extraction.js';

export interface PlayableExtractionTurnResult {
	corcite: PlayableCorciteState;
	resolution: TfExtractionResolution;
}

function requirePlayableState(
	state: CorciteState
): PlayableCorciteState {
	if (state.population === undefined) {
		throw new Error(
			"L'extraction jouable nécessite un Corcite avec une population."
		);
	}

	return state as PlayableCorciteState;
}

/**
 * Aucun extracteur n'est créé implicitement.
 * Seuls les extracteurs réellement construits et actifs produisent.
 */
export function resolvePlayableExtractionTurn(
	inputState: CorciteState
): PlayableExtractionTurnResult {
	const state =
		structuredClone(
			requirePlayableState(inputState)
		);

	recalculatePlayableCapacities(state);

	const validationBefore =
		validateCorciteState(state);

	if (!validationBefore.valid) {
		throw new Error(
			`Etat Corcite invalide avant extraction : ${validationBefore.errors.join(' | ')}`
		);
	}

	const result =
		resolveExtractionTurn(state);

	const playableResult =
		requirePlayableState(
			result.corcite
		);

	recalculatePlayableCapacities(
		playableResult
	);

	const validationAfter =
		validateCorciteState(
			playableResult
		);

	if (!validationAfter.valid) {
		throw new Error(
			`Etat Corcite invalide après extraction : ${validationAfter.errors.join(' | ')}`
		);
	}

	return {
		corcite: playableResult,
		resolution:
			result.resolution
	};
}
