import {
	PLAYABLE_RESEARCH_CATALOG,
	getPlayableResearchDefinition,
	type PlayableResearchDefinitionId
} from '../config/playable-research-reference.js';
import type {
	RpgResearchDefinition
} from '../config/rpg-reference.js';
import type {
	CorciteState
} from '../domain/corcite.js';
import type {
	RpgJournalEntry,
	RpgResearchState
} from '../domain/rpg.js';
import {
	applyRpgResearchCompletion,
	startRpgResearch
} from './research.js';

export type PlayableResearchAdvanceStatus =
	| 'no-active-research'
	| 'progressed'
	| 'discovery-pending';

export interface PlayableResearchAdvanceResult {
	corcite: CorciteState;
	status: PlayableResearchAdvanceStatus;
	researchId?: string;
}

export interface PlayablePendingDiscovery {
	research: RpgResearchState;
	definition: RpgResearchDefinition;
	availableTurn: number;
}

export interface PlayableResearchChoiceState {
	canStartResearch: boolean;
	blockers: string[];
	definitions: readonly RpgResearchDefinition[];
}

function assertTurn(
	turn: number
): void {
	if (
		!Number.isInteger(turn) ||
		turn < 1
	) {
		throw new Error(
			'Le tour RPG jouable doit être un entier supérieur ou égal à 1.'
		);
	}
}

function appendJournal(
	state: CorciteState,
	entry:
		Omit<
			RpgJournalEntry,
			'sequence'
		>
): void {
	state.rpg.journal.push({
		sequence:
			state.rpg.journal.length + 1,
		...entry
	});
}

function researchSource(
	definitionId: string
): string {
	return `research:${definitionId}`;
}

function activeResearch(
	state: CorciteState
): RpgResearchState | undefined {
	return state.rpg.researches.find(
		(research) =>
			research.status === 'active'
	);
}

function pendingDiscovery(
	state: CorciteState
): RpgResearchState | undefined {
	return state.rpg.researches.find(
		(research) =>
			research.status ===
			'discovery-pending'
	);
}

export function getPlayableResearchChoices(
	state: CorciteState
): PlayableResearchChoiceState {
	const blockers: string[] = [];

	if (activeResearch(state)) {
		blockers.push(
			'Une recherche est déjà active.'
		);
	}

	if (pendingDiscovery(state)) {
		blockers.push(
			'Une découverte doit être examinée et validée avant de lancer une nouvelle recherche.'
		);
	}

	const alreadyStarted =
		new Set(
			state.rpg.researches.map(
				(research) =>
					research.definitionId
			)
		);

	const definitions =
		PLAYABLE_RESEARCH_CATALOG.filter(
			(definition) =>
				!alreadyStarted.has(
					definition.id
				)
		);

	return {
		canStartResearch:
			blockers.length === 0 &&
			definitions.length > 0,
		blockers,
		definitions
	};
}

export function startPlayableRpgResearch(
	inputState: CorciteState,
	turn: number,
	definitionId: PlayableResearchDefinitionId
): CorciteState {
	assertTurn(turn);

	const choices =
		getPlayableResearchChoices(
			inputState
		);

	if (!choices.canStartResearch) {
		throw new Error(
			`Impossible de démarrer une recherche : ${choices.blockers.join(' | ')}`
		);
	}

	const definition =
		getPlayableResearchDefinition(
			definitionId
		);

	if (
		!choices.definitions.some(
			(candidate) =>
				candidate.id ===
					definition.id
		)
	) {
		throw new Error(
			`La recherche ${definition.id} n'est pas disponible.`
		);
	}

	return startRpgResearch(
		inputState,
		turn,
		definition
	);
}

/**
 * Progression jouable.
 *
 * Contrairement au moteur historique P4, l'achèvement n'applique
 * aucun effet. Il crée seulement une découverte en attente.
 */
export function advanceActivePlayableRpgResearch(
	inputState: CorciteState,
	turn: number
): PlayableResearchAdvanceResult {
	assertTurn(turn);

	const state =
		structuredClone(
			inputState
		);

	const active =
		activeResearch(state);

	if (!active) {
		return {
			corcite: state,
			status:
				'no-active-research'
		};
	}

	const definition =
		PLAYABLE_RESEARCH_CATALOG.find(
			(candidate) =>
				candidate.id ===
					active.definitionId
		);

	if (!definition) {
		throw new Error(
			`Définition jouable absente pour la recherche active ${active.definitionId}.`
		);
	}

	if (
		turn <
		active.startedTurn
	) {
		throw new Error(
			`La recherche ${active.id} ne peut pas progresser avant son tour de départ.`
		);
	}

	if (
		active.lastProgressTurn !== null &&
		turn <= active.lastProgressTurn
	) {
		throw new Error(
			`La recherche ${active.id} a déjà progressé au tour ${turn}.`
		);
	}

	active.progressTurns += 1;
	active.lastProgressTurn =
		turn;

	const source =
		researchSource(
			definition.id
		);

	appendJournal(state, {
		event:
			'research-progressed',
		source,
		message:
			`Recherche ${definition.label} : ${active.progressTurns}/${active.durationTurns}.`
	});

	if (
		active.progressTurns <
		active.durationTurns
	) {
		return {
			corcite: state,
			status: 'progressed',
			researchId:
				active.id
		};
	}

	active.status =
		'discovery-pending';

	active.progressTurns =
		active.durationTurns;

	active.completedTurn =
		turn;

	active.validatedTurn =
		null;

	appendJournal(state, {
		event:
			'research-completed',
		source,
		message:
			`Recherche ${definition.label} achevée au tour ${turn}.`
	});

	appendJournal(state, {
		event:
			'discovery-pending',
		source,
		message:
			`Une découverte issue de ${definition.label} sera examinable au début du tour ${turn + 1}.`
	});

	return {
		corcite: state,
		status:
			'discovery-pending',
		researchId:
			active.id
	};
}

/**
 * Retourne uniquement une découverte réellement présentable.
 *
 * Une recherche terminée au tour N n'est donc pas présentée
 * avant le début du tour N+1.
 */
export function getPlayablePendingDiscovery(
	inputState: CorciteState,
	turn: number
): PlayablePendingDiscovery | null {
	assertTurn(turn);

	const research =
		pendingDiscovery(
			inputState
		);

	if (!research) {
		return null;
	}

	if (
		research.completedTurn === null
	) {
		throw new Error(
			`La découverte ${research.id} ne possède pas de tour d'achèvement.`
		);
	}

	const availableTurn =
		research.completedTurn + 1;

	if (turn < availableTurn) {
		return null;
	}

	const definition =
		PLAYABLE_RESEARCH_CATALOG.find(
			(candidate) =>
				candidate.id ===
					research.definitionId
		);

	if (!definition) {
		throw new Error(
			`Définition jouable absente pour la découverte ${research.definitionId}.`
		);
	}

	return {
		research:
			structuredClone(
				research
			),
		definition,
		availableTurn
	};
}

export function validatePlayableResearchDiscovery(
	inputState: CorciteState,
	turn: number,
	definitionId: PlayableResearchDefinitionId
): CorciteState {
	assertTurn(turn);

	const state =
		structuredClone(
			inputState
		);

	const research =
		pendingDiscovery(state);

	if (!research) {
		throw new Error(
			'Aucune découverte RPG n’attend de validation.'
		);
	}

	if (
		research.definitionId !==
			definitionId
	) {
		throw new Error(
			`La découverte en attente concerne ${research.definitionId}, pas ${definitionId}.`
		);
	}

	if (
		research.completedTurn === null
	) {
		throw new Error(
			`La découverte ${research.id} ne possède pas de tour d'achèvement.`
		);
	}

	if (
		turn <=
		research.completedTurn
	) {
		throw new Error(
			`La découverte ${research.id} ne peut être validée qu'à partir du tour ${research.completedTurn + 1}.`
		);
	}

	const definition =
		getPlayableResearchDefinition(
			definitionId
		);

	const source =
		researchSource(
			definition.id
		);

	research.status =
		'validated';

	research.validatedTurn =
		turn;

	appendJournal(state, {
		event:
			'discovery-validated',
		source,
		message:
			`Découverte ${definition.label} validée au tour ${turn}.`
	});

	applyRpgResearchCompletion(
		state,
		research,
		definition
	);

	return state;
}
