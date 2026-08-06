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
	assertPlayableEnergyCanOperate,
	resolvePlayableSustainabilityTurn,
	type PlayableSustainabilityTurnResolution
} from '../corcite/sustainability.js';
import {
        resolvePlayableRecoveryTurn,
        type PlayableRecoveryTurnResolution
} from '../corcite/recovery.js';
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
	sustainability:
		PlayableSustainabilityTurnResolution;
	recovery:
	        PlayableRecoveryTurnResolution;
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
 * 1. vérifie que la charge énergétique courante peut encore
 *    être soutenue ;
 * 2. exécute le moteur TF canonique ;
 * 3. applique consommation/récupération énergétique ;
 * 4. met à jour entretien et travail.
 *
 * La règle N -> N+1 du moteur TF canonique reste intacte.
 */
export function resolvePlayableTfTurn(
	inputState: CorciteState,
	explicitTurn?: number
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

	assertPlayableEnergyCanOperate(
		state
	);

	const tfResult =
		resolveTfCoreTurn(state);

	const playableAfterTf =
		requirePlayableState(
			tfResult.corcite
		);

	recalculatePlayableCapacities(
		playableAfterTf
	);

	const sustainability =
		resolvePlayableSustainabilityTurn(
			playableAfterTf,
			explicitTurn
		);

	const recovery =
	        resolvePlayableRecoveryTurn(
	                sustainability.corcite,
	                sustainability.resolution
	        );

	const playableResult =
	        recovery.corcite;

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
			tfResult.extraction,
		transformation:
			tfResult.transformation,
		fabrication:
			tfResult.fabrication,
		sustainability:
		        sustainability.resolution,
		recovery:
		        recovery.resolution
	};
}
