import type {
	RpgAccessState,
	RpgJournalEntry,
	RpgKnowledgeState,
	RpgResearchState,
	RpgState
} from '../domain/rpg.js';

export interface RpgValidationResult {
	valid: boolean;
	errors: string[];
}

function isRecord(
	value: unknown
): value is Record<string, unknown> {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value)
	);
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

function validateResearch(
	research: RpgResearchState,
	errors: string[]
): void {
	if (!research.id.trim()) {
		errors.push(
			'Une recherche RPG possède un identifiant vide'
		);
	}

	if (!research.definitionId.trim()) {
		errors.push(
			`Recherche ${research.id} : définition vide`
		);
	}

	if (!research.label.trim()) {
		errors.push(
			`Recherche ${research.id} : libellé vide`
		);
	}

	if (
		!Number.isInteger(
			research.durationTurns
		) ||
		research.durationTurns < 1
	) {
		errors.push(
			`Recherche ${research.id} : durée invalide`
		);
	}

	if (
		!Number.isInteger(
			research.progressTurns
		) ||
		research.progressTurns < 0 ||
		research.progressTurns >
			research.durationTurns
	) {
		errors.push(
			`Recherche ${research.id} : progression invalide`
		);
	}

	if (
		!Number.isInteger(
			research.startedTurn
		) ||
		research.startedTurn < 1
	) {
		errors.push(
			`Recherche ${research.id} : tour de départ invalide`
		);
	}

	if (
		research.progressTurns === 0
	) {
		if (
			research.lastProgressTurn !==
			null
		) {
			errors.push(
				`Recherche ${research.id} sans progression mais avec un dernier tour de progression`
			);
		}
	} else if (
		research.lastProgressTurn ===
			null ||
		!Number.isInteger(
			research.lastProgressTurn
		) ||
		research.lastProgressTurn <
			research.startedTurn
	) {
		errors.push(
			`Recherche ${research.id} : dernier tour de progression invalide`
		);
	}

	if (
		research.status === 'active'
	) {
		if (
			research.progressTurns >=
			research.durationTurns
		) {
			errors.push(
				`Recherche ${research.id} active mais déjà achevée`
			);
		}

		if (
			research.completedTurn !==
			null
		) {
			errors.push(
				`Recherche ${research.id} active avec un tour d'achèvement`
			);
		}

		return;
	}

	if (
		research.progressTurns !==
		research.durationTurns
	) {
		errors.push(
			`Recherche ${research.id} achevée avec une progression incomplète`
		);
	}

	if (
		research.completedTurn ===
			null ||
		!Number.isInteger(
			research.completedTurn
		) ||
		research.completedTurn <
			research.startedTurn
	) {
		errors.push(
			`Recherche ${research.id} : tour d'achèvement invalide`
		);
	}

	if (
		research.completedTurn !==
			null &&
		research.lastProgressTurn !==
			research.completedTurn
	) {
		errors.push(
			`Recherche ${research.id} : le dernier tour de progression ne correspond pas à l'achèvement`
		);
	}
}

function validateAccess(
	access: RpgAccessState,
	errors: string[]
): void {
	if (!access.id.trim()) {
		errors.push(
			'Un accès RPG possède un identifiant vide'
		);
	}

	if (!access.source.trim()) {
		errors.push(
			`Accès ${access.id} : origine vide`
		);
	}

	if (!access.key.trim()) {
		errors.push(
			`Accès ${access.id} : clé vide`
		);
	}
}

function validateKnowledge(
	knowledge: RpgKnowledgeState,
	errors: string[]
): void {
	if (!knowledge.id.trim()) {
		errors.push(
			'Une connaissance RPG possède un identifiant vide'
		);
	}

	if (!knowledge.source.trim()) {
		errors.push(
			`Connaissance ${knowledge.id} : origine vide`
		);
	}

	if (!knowledge.key.trim()) {
		errors.push(
			`Connaissance ${knowledge.id} : clé vide`
		);
	}

	if (
		!Number.isFinite(
			knowledge.value
		) ||
		knowledge.value < 0
	) {
		errors.push(
			`Connaissance ${knowledge.id} : valeur invalide`
		);
	}
}

function validateJournal(
	journal: readonly RpgJournalEntry[],
	errors: string[]
): void {
	for (
		let index = 0;
		index < journal.length;
		index += 1
	) {
		const entry =
			journal[index];

		if (
			entry.sequence !==
			index + 1
		) {
			errors.push(
				`Journal RPG : séquence ${entry.sequence} invalide à la position ${index + 1}`
			);
		}

		if (!entry.source.trim()) {
			errors.push(
				`Journal RPG ${entry.sequence} : origine vide`
			);
		}

		if (!entry.message.trim()) {
			errors.push(
				`Journal RPG ${entry.sequence} : message vide`
			);
		}
	}
}

export function validateRpgState(
	value: unknown
): RpgValidationResult {
	const errors: string[] = [];

	if (!isRecord(value)) {
		return {
			valid: false,
			errors: [
				'Etat RPG absent ou invalide'
			]
		};
	}

	const state =
		value as unknown as RpgState;

	if (
		!Array.isArray(
			state.researches
		) ||
		!Array.isArray(
			state.accesses
		) ||
		!Array.isArray(
			state.knowledge
		) ||
		!Array.isArray(
			state.journal
		)
	) {
		return {
			valid: false,
			errors: [
				'Etat RPG structurellement incomplet'
			]
		};
	}

	const duplicateResearchIds =
		findDuplicates(
			state.researches.map(
				(research) =>
					research.id
			)
		);

	if (
		duplicateResearchIds.length >
		0
	) {
		errors.push(
			`Recherches RPG dupliquées : ${duplicateResearchIds.join(', ')}`
		);
	}

	const duplicateAccessIds =
		findDuplicates(
			state.accesses.map(
				(access) =>
					access.id
			)
		);

	if (
		duplicateAccessIds.length >
		0
	) {
		errors.push(
			`Accès RPG dupliqués : ${duplicateAccessIds.join(', ')}`
		);
	}

	const duplicateKnowledgeIds =
		findDuplicates(
			state.knowledge.map(
				(knowledge) =>
					knowledge.id
			)
		);

	if (
		duplicateKnowledgeIds.length >
		0
	) {
		errors.push(
			`Connaissances RPG dupliquées : ${duplicateKnowledgeIds.join(', ')}`
		);
	}

	for (
		const research of
		state.researches
	) {
		validateResearch(
			research,
			errors
		);
	}

	const activeResearches =
		state.researches.filter(
			(research) =>
				research.status ===
					'active'
		);

	if (
		activeResearches.length > 1
	) {
		errors.push(
			'Plusieurs recherches RPG sont actives simultanément'
		);
	}

	for (
		const access of
		state.accesses
	) {
		validateAccess(
			access,
			errors
		);
	}

	for (
		const knowledge of
		state.knowledge
	) {
		validateKnowledge(
			knowledge,
			errors
		);
	}

	validateJournal(
		state.journal,
		errors
	);

	return {
		valid:
			errors.length === 0,
		errors
	};
}
