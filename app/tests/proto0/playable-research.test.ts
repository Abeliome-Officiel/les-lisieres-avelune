import assert from 'node:assert/strict';
import test from 'node:test';

import {
	PLAYABLE_RESEARCH_CATALOG,
	PLAYABLE_RESEARCH_PRESENTATIONS,
	advanceActivePlayableRpgResearch,
	createPlayableCorciteState,
	createReferenceCorciteState,
	deserializeCorciteState,
	getPlayablePendingDiscovery,
	getPlayableResearchChoices,
	resolveFabricationTurn,
	resolvePlayableSustainabilityTurn,
	resolveTransformationTurn,
	serializeCorciteState,
	startPlayableRpgResearch,
	summarizeStoredResources,
	validateCorciteState,
	validatePlayableResearchDiscovery
} from '../../src/lib/proto0/index.js';

function createPlayable() {
	return createPlayableCorciteState({
		id: 'corcite-playable-research',
		name: 'PLAYABLE-RESEARCH',
		controller: 'human'
	});
}

function createReference() {
	return createReferenceCorciteState({
		id: 'corcite-playable-research-reference',
		name: 'PLAYABLE-RESEARCH-REFERENCE',
		controller: 'human'
	});
}

function advanceToPending(
	state: ReturnType<typeof createPlayable>,
	definitionId:
		| 'transformation-efficiency-n1'
		| 'fabrication-efficiency-n1'
		| 'reserve-recovery-n1'
		| 'maintenance-recovery-n1'
		| 'wave-observation-n1'
		| 'capture-analysis-n1',
	startTurn = 1
) {
	let corcite =
		startPlayableRpgResearch(
			state,
			startTurn,
			definitionId
		);

	const definition =
		PLAYABLE_RESEARCH_CATALOG.find(
			(candidate) =>
				candidate.id ===
					definitionId
		);

	assert.ok(definition);

	let result =
		advanceActivePlayableRpgResearch(
			corcite,
			startTurn
		);

	corcite = result.corcite;

	for (
		let offset = 1;
		offset < definition.durationTurns;
		offset += 1
	) {
		result =
			advanceActivePlayableRpgResearch(
				corcite,
				startTurn + offset
			);

		corcite =
			result.corcite;
	}

	assert.equal(
		result.status,
		'discovery-pending'
	);

	return {
		corcite,
		completedTurn:
			startTurn +
			definition.durationTurns -
			1
	};
}

test(
	'le catalogue jouable contient six recherches distinctes',
	() => {
		assert.equal(
			PLAYABLE_RESEARCH_CATALOG.length,
			6
		);

		assert.equal(
			new Set(
				PLAYABLE_RESEARCH_CATALOG.map(
					(definition) =>
						definition.id
				)
			).size,
			6
		);

		assert.equal(
			PLAYABLE_RESEARCH_PRESENTATIONS.length,
			6
		);
	}
);

test(
	'le Corcite peut choisir sa première recherche au lieu de recevoir une recherche imposée',
	() => {
		const corcite =
			createPlayable();

		const choices =
			getPlayableResearchChoices(
				corcite
			);

		assert.equal(
			choices.canStartResearch,
			true
		);

		assert.equal(
			choices.definitions.length,
			6
		);

		const started =
			startPlayableRpgResearch(
				corcite,
				1,
				'reserve-recovery-n1'
			);

		assert.equal(
			started.rpg.researches[0]
				.definitionId,
			'reserve-recovery-n1'
		);

		assert.equal(
			started.rpg.researches[0]
				.status,
			'active'
		);
	}
);

test(
	'une recherche achevée devient une découverte sans appliquer immédiatement ses effets',
	() => {
		const result =
			advanceToPending(
				createPlayable(),
				'transformation-efficiency-n1'
			);

		const research =
			result.corcite.rpg
				.researches[0];

		assert.equal(
			research.status,
			'discovery-pending'
		);

		assert.equal(
			research.completedTurn,
			3
		);

		assert.equal(
			research.validatedTurn,
			null
		);

		assert.equal(
			result.corcite.modifiers.length,
			0
		);

		assert.equal(
			result.corcite.rpg.accesses.length,
			0
		);

		assert.equal(
			result.corcite.rpg.knowledge.length,
			0
		);
	}
);

test(
	'une découverte n’est présentable qu’au début du tour suivant',
	() => {
		const result =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		assert.equal(
			result.completedTurn,
			2
		);

		assert.equal(
			getPlayablePendingDiscovery(
				result.corcite,
				2
			),
			null
		);

		const discovery =
			getPlayablePendingDiscovery(
				result.corcite,
				3
			);

		assert.ok(discovery);

		assert.equal(
			discovery.availableTurn,
			3
		);

		assert.equal(
			discovery.definition.id,
			'reserve-recovery-n1'
		);
	}
);

test(
	'une découverte ne peut pas être validée pendant son tour d’achèvement',
	() => {
		const result =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		assert.throws(
			() =>
				validatePlayableResearchDiscovery(
					result.corcite,
					2,
					'reserve-recovery-n1'
				),
			/à partir du tour 3/
		);
	}
);

test(
	'valider une découverte applique alors modificateur, accès et connaissance',
	() => {
		const result =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		const validated =
			validatePlayableResearchDiscovery(
				result.corcite,
				3,
				'reserve-recovery-n1'
			);

		const research =
			validated.rpg
				.researches[0];

		assert.equal(
			research.status,
			'validated'
		);

		assert.equal(
			research.validatedTurn,
			3
		);

		assert.equal(
			validated.modifiers.length,
			1
		);

		assert.equal(
			validated.rpg.accesses.length,
			1
		);

		assert.equal(
			validated.rpg.knowledge.length,
			1
		);

		assert.equal(
			validated.rpg.journal.some(
				(entry) =>
					entry.event ===
						'discovery-validated'
			),
			true
		);
	}
);

test(
	'une découverte en attente bloque le lancement d’une autre recherche',
	() => {
		const result =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		const choices =
			getPlayableResearchChoices(
				result.corcite
			);

		assert.equal(
			choices.canStartResearch,
			false
		);

		assert.ok(
			choices.blockers.some(
				(blocker) =>
					blocker.includes(
						'découverte'
					)
			)
		);

		assert.throws(
			() =>
				startPlayableRpgResearch(
					result.corcite,
					3,
					'maintenance-recovery-n1'
				),
			/découverte/
		);
	}
);

test(
	'après validation une nouvelle recherche peut être choisie',
	() => {
		const result =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		let corcite =
			validatePlayableResearchDiscovery(
				result.corcite,
				3,
				'reserve-recovery-n1'
			);

		const choices =
			getPlayableResearchChoices(
				corcite
			);

		assert.equal(
			choices.canStartResearch,
			true
		);

		assert.equal(
			choices.definitions.length,
			5
		);

		corcite =
			startPlayableRpgResearch(
				corcite,
				3,
				'maintenance-recovery-n1'
			);

		assert.equal(
			corcite.rpg.researches.filter(
				(research) =>
					research.status ===
						'active'
			).length,
			1
		);
	}
);

test(
	'l’efficacité de transformation n’agit qu’après validation de la découverte',
	() => {
		let corcite =
			createReference();

		corcite =
			startPlayableRpgResearch(
				corcite,
				1,
				'transformation-efficiency-n1'
			);

		for (
			const turn of [1, 2, 3]
		) {
			corcite =
				advanceActivePlayableRpgResearch(
					corcite,
					turn
				).corcite;
		}

		const beforeValidation =
			resolveTransformationTurn(
				corcite
			);

		const beforeEvent =
			beforeValidation.resolution.events.find(
				(event) =>
					event.status ===
						'produced'
			);

		assert.ok(beforeEvent);

		assert.equal(
			beforeEvent.outputs.R3,
			2
		);

		corcite =
			validatePlayableResearchDiscovery(
				corcite,
				4,
				'transformation-efficiency-n1'
			);

		const afterValidation =
			resolveTransformationTurn(
				corcite
			);

		const afterEvent =
			afterValidation.resolution.events.find(
				(event) =>
					event.status ===
						'produced'
			);

		assert.ok(afterEvent);

		assert.equal(
			afterEvent.outputs.R3,
			2.4
		);
	}
);

test(
	'la recherche de fabrication modifie effectivement la production R4 après validation',
	() => {
		let corcite =
			createReference();

		corcite =
			startPlayableRpgResearch(
				corcite,
				1,
				'fabrication-efficiency-n1'
			);

		for (
			const turn of [1, 2, 3]
		) {
			corcite =
				advanceActivePlayableRpgResearch(
					corcite,
					turn
				).corcite;
		}

		corcite =
			validatePlayableResearchDiscovery(
				corcite,
				4,
				'fabrication-efficiency-n1'
			);

		const result =
			resolveFabricationTurn(
				corcite
			);

		const event =
			result.resolution.events.find(
				(candidate) =>
					candidate.status ===
						'produced'
			);

		assert.ok(event);

		assert.equal(
			event.outputs.R4,
			1.25
		);

		assert.equal(
			summarizeStoredResources(
				result.corcite
			).R4,
			2.25
		);
	}
);

test(
	'la recherche énergétique accélère la recharge de réserve après validation',
	() => {
		const pending =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		let corcite =
			validatePlayableResearchDiscovery(
				pending.corcite,
				3,
				'reserve-recovery-n1'
			);

		corcite.capacities.energy
			.reserveCurrent = 0;

		const result =
			resolvePlayableSustainabilityTurn(
				corcite,
				1
			);

		assert.equal(
			result.resolution.energy
				.reserveRecovered,
			2
		);

		assert.equal(
			result.corcite.capacities
				.energy.reserveCurrent,
			2
		);
	}
);

test(
	'les recherches vague et captation créent leurs accès sans effet anticipé avant validation',
	() => {
		for (
			const definitionId of
			[
				'wave-observation-n1',
				'capture-analysis-n1'
			] as const
		) {
			const pending =
				advanceToPending(
					createPlayable(),
					definitionId
				);

			assert.equal(
				pending.corcite.rpg
					.accesses.length,
				0
			);

			const validated =
				validatePlayableResearchDiscovery(
					pending.corcite,
					pending.completedTurn + 1,
					definitionId
				);

			assert.equal(
				validated.rpg.accesses.length,
				1
			);

			assert.equal(
				validated.rpg.knowledge.length,
				1
			);
		}
	}
);

test(
	'une découverte en attente survit à la sérialisation',
	() => {
		const pending =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		const restored =
			deserializeCorciteState(
				serializeCorciteState(
					pending.corcite
				)
			);

		assert.deepEqual(
			restored.rpg,
			pending.corcite.rpg
		);

		assert.equal(
			restored.rpg.researches[0]
				.status,
			'discovery-pending'
		);
	}
);

test(
	'une recherche validée et ses effets survivent à la sérialisation',
	() => {
		const pending =
			advanceToPending(
				createPlayable(),
				'reserve-recovery-n1'
			);

		const validated =
			validatePlayableResearchDiscovery(
				pending.corcite,
				3,
				'reserve-recovery-n1'
			);

		const restored =
			deserializeCorciteState(
				serializeCorciteState(
					validated
				)
			);

		assert.equal(
			restored.rpg.researches[0]
				.status,
			'validated'
		);

		assert.equal(
			restored.rpg.researches[0]
				.validatedTurn,
			3
		);

		assert.deepEqual(
			restored.modifiers,
			validated.modifiers
		);
	}
);

test(
	'l’état RPG jouable reste valide après le cycle complet',
	() => {
		const pending =
			advanceToPending(
				createPlayable(),
				'maintenance-recovery-n1'
			);

		const validated =
			validatePlayableResearchDiscovery(
				pending.corcite,
				3,
				'maintenance-recovery-n1'
			);

		assert.deepEqual(
			validateCorciteState(
				validated
			),
			{
				valid: true,
				errors: []
			}
		);
	}
);
