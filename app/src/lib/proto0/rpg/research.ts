import {
	RPG_LAB_REFERENCE,
	type RpgResearchDefinition
} from '../config/rpg-reference.js';
import type {
	CorciteState,
	ModifierState
} from '../domain/corcite.js';
import type {
	RpgJournalEntry,
	RpgResearchState
} from '../domain/rpg.js';

export type RpgResearchAdvanceStatus =
	| 'no-active-research'
	| 'progressed'
	| 'completed';

export interface RpgResearchAdvanceResult {
	corcite: CorciteState;
	status: RpgResearchAdvanceStatus;
	researchId?: string;
}

function assertTurn(
	turn: number
): void {
	if (
		!Number.isInteger(turn) ||
		turn < 1
	) {
		throw new Error(
			'Le tour RPG doit être un entier supérieur ou égal à 1.'
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
			state.rpg.journal.length +
			1,
		...entry
	});
}

function researchSource(
	definitionId: string
): string {
	return `research:${definitionId}`;
}

function createResearchInstance(
	definition:
		RpgResearchDefinition,
	turn: number
): RpgResearchState {
	return {
		id:
			`rpg-research:${definition.id}`,
		definitionId:
			definition.id,
		label:
			definition.label,
		status: 'active',
		progressTurns: 0,
		durationTurns:
			definition.durationTurns,
		startedTurn: turn,
		lastProgressTurn: null,
		completedTurn: null
	};
}

export function applyRpgResearchCompletion(
	state: CorciteState,
	research: RpgResearchState,
	definition:
		RpgResearchDefinition
): void {
	const source =
		researchSource(
			definition.id
		);

	const modifierDefinition =
		definition.completion
			.modifier;

	if (
		state.modifiers.some(
			(modifier) =>
				modifier.id ===
					modifierDefinition.id
		)
	) {
		throw new Error(
			`Modificateur RPG déjà présent : ${modifierDefinition.id}.`
		);
	}

	const modifier:
		ModifierState = {
			id:
				modifierDefinition.id,
			source,
			target:
				modifierDefinition.target,
			operation:
				modifierDefinition.operation,
			value:
				modifierDefinition.value,
			active: true
		};

	state.modifiers.push(
		modifier
	);

	appendJournal(state, {
		event: 'modifier-applied',
		source,
		message:
			`Modificateur ${modifier.id} appliqué à ${modifier.target}.`
	});

	const accessDefinition =
		definition.completion.access;

	if (
		state.rpg.accesses.some(
			(access) =>
				access.id ===
					accessDefinition.id
		)
	) {
		throw new Error(
			`Accès RPG déjà présent : ${accessDefinition.id}.`
		);
	}

	state.rpg.accesses.push({
		id:
			accessDefinition.id,
		source,
		key:
			accessDefinition.key,
		active: true
	});

	appendJournal(state, {
		event: 'access-unlocked',
		source,
		message:
			`Accès ${accessDefinition.key} débloqué.`
	});

	const knowledgeDefinition =
		definition.completion
			.knowledge;

	if (
		state.rpg.knowledge.some(
			(knowledge) =>
				knowledge.id ===
					knowledgeDefinition.id
		)
	) {
		throw new Error(
			`Connaissance RPG déjà présente : ${knowledgeDefinition.id}.`
		);
	}

	state.rpg.knowledge.push({
		id:
			knowledgeDefinition.id,
		source,
		key:
			knowledgeDefinition.key,
		value:
			knowledgeDefinition.value
	});

	appendJournal(state, {
		event: 'knowledge-updated',
		source,
		message:
			`Connaissance ${knowledgeDefinition.key} mise à jour à ${knowledgeDefinition.value}.`
	});
}

export function startRpgResearch(
	inputState: CorciteState,
	turn: number,
	definition:
		RpgResearchDefinition =
			RPG_LAB_REFERENCE
): CorciteState {
	assertTurn(turn);

	if (
		inputState.rpg.researches.some(
			(research) =>
				research.status ===
					'active'
		)
	) {
		throw new Error(
			'Une recherche RPG est déjà active.'
		);
	}

	if (
		inputState.rpg.researches.some(
			(research) =>
				research.definitionId ===
					definition.id
		)
	) {
		throw new Error(
			`La recherche RPG ${definition.id} a déjà été démarrée.`
		);
	}

	if (
		!Number.isInteger(
			definition.durationTurns
		) ||
		definition.durationTurns < 1
	) {
		throw new Error(
			`Durée de recherche RPG invalide : ${definition.durationTurns}.`
		);
	}

	const state =
		structuredClone(
			inputState
		);

	const research =
		createResearchInstance(
			definition,
			turn
		);

	state.rpg.researches.push(
		research
	);

	const source =
		researchSource(
			definition.id
		);

	appendJournal(state, {
		event: 'research-started',
		source,
		message:
			`Recherche ${definition.label} démarrée au tour ${turn}.`
	});

	return state;
}

export function advanceActiveRpgResearch(
	inputState: CorciteState,
	turn: number,
	definition:
		RpgResearchDefinition =
			RPG_LAB_REFERENCE
): RpgResearchAdvanceResult {
	assertTurn(turn);

	const state =
		structuredClone(
			inputState
		);

	const active =
		state.rpg.researches.find(
			(research) =>
				research.status ===
					'active'
		);

	if (!active) {
		return {
			corcite: state,
			status:
				'no-active-research'
		};
	}

	if (
		active.definitionId !==
			definition.id
	) {
		throw new Error(
			`Définition RPG absente pour la recherche active ${active.definitionId}.`
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
		active.lastProgressTurn !==
			null &&
		turn <=
			active.lastProgressTurn
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
		'completed';
	active.progressTurns =
		active.durationTurns;
	active.completedTurn =
		turn;

	appendJournal(state, {
		event:
			'research-completed',
		source,
		message:
			`Recherche ${definition.label} achevée au tour ${turn}.`
	});

	applyRpgResearchCompletion(
		state,
		active,
		definition
	);

	return {
		corcite: state,
		status: 'completed',
		researchId:
			active.id
	};
}
