import type {
	CorciteState,
	PlayableCorciteState
} from '../domain/corcite.js';
import type {
	TfExtractionResolution,
	TfProcessingResolution
} from '../domain/tf.js';
import {
	recalculatePlayableCapacities
} from '../corcite/construction.js';
import {
	validateCorciteState
} from '../corcite/validate.js';
import {
	resolveTfCoreTurn
} from './turn.js';

export interface PlayableTfTurnResult {
	corcite: PlayableCorciteState;
	extraction: TfExtractionResolution;
	transformation: TfProcessingResolution;
	fabrication: TfProcessingResolution;
}

function requirePlayableState(
	state: CorciteState
): PlayableCorciteState {
	if (state.population === undefined) {
		throw new Error(
			"Le tour TF jouable nécessite un Corcite avec une population."
		);
	}

	return state as PlayableCorciteState;
}

/**
 * Tour TF complet du prototype miniature.
 *
 * La fonction délègue volontairement au moteur TF canonique :
 *
 * extraction
 * -> transformation
 * -> fabrication
 *
 * avec verrouillage des sorties du tour N.
 *
 * Une ressource produite au cours de ce tour ne peut donc pas
 * alimenter une étape aval avant le tour suivant.
 */
export function resolvePlayableTfTurn(
	inputState: CorciteState
): PlayableTfTurnResult {
	const state =
		structuredClone(
			requirePlayableState(
				inputState
			)
		);

	recalculatePlayableCapacities(state);

	const validationBefore =
		validateCorciteState(state);

	if (!validationBefore.valid) {
		throw new Error(
			`Etat Corcite invalide avant le tour TF : ${validationBefore.errors.join(' | ')}`
		);
	}

	const result =
		resolveTfCoreTurn(state);

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
			`Etat Corcite invalide après le tour TF : ${validationAfter.errors.join(' | ')}`
		);
	}

	return {
		corcite: playableResult,
		extraction:
			result.extraction,
		transformation:
			result.transformation,
		fabrication:
			result.fabrication
	};
}
