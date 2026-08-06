import assert from 'node:assert/strict';
import test from 'node:test';

import {
	addPlayerOperation,
	commitPlayableConstruction,
	createPlayableConstructionOperation,
	createPlayableCorciteState,
	createTurnPlan,
	endTurn,
	previewPlayableStructureActivation,
	resolvePlayableExtractionTurn,
	setPlayableStructureActive,
	summarizeStoredResources,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createPlayableCorciteState({
		id: 'corcite-extraction-storage',
		name: 'EXTRACTION',
		controller: 'human'
	});
}

function build(
	input:
		ReturnType<
			typeof createPlayableCorciteState
		>,
	definitionId:
		Parameters<
			typeof createPlayableConstructionOperation
		>[0],
	turn: number
) {
	const operationId =
		`build-${definitionId}-${turn}`;

	let plan =
		createTurnPlan(turn);

	plan = addPlayerOperation(
		plan,
		createPlayableConstructionOperation(
			definitionId,
			operationId
		)
	);

	const prepared =
		endTurn(
			input,
			plan
		);

	assert.equal(
		prepared.status,
		'ready-for-resolution'
	);

	const committed =
		commitPlayableConstruction(
			prepared.corcite,
			prepared.plan,
			operationId,
			definitionId
		);

	return committed.corcite;
}

test(
	'sans extracteur construit aucune matière brute supplémentaire n’est produite',
	() => {
		const corcite =
			createCorcite();

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableExtractionTurn(
				corcite
			);

		assert.deepEqual(
			summarizeStoredResources(
				result.corcite
			),
			before
		);
	}
);

test(
	'un extracteur organique construit produit réellement de la matière organique',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableExtractionTurn(
				corcite
			);

		const after =
			summarizeStoredResources(
				result.corcite
			);

		assert.equal(
			after.R1 - before.R1,
			2
		);

		assert.equal(
			after.R2 - before.R2,
			0
		);

		assert.ok(
			result.resolution.events.some(
				(event) =>
					event.sourceId ===
						'source-a' &&
					event.status ===
						'produced'
			)
		);
	}
);

test(
	'un extracteur construit peut être arrêté puis redémarré',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		const extractor =
			corcite.structures.find(
				(structure) =>
					structure.kind ===
					'extractor-a-n1'
			);

		assert.ok(extractor);

		corcite =
			setPlayableStructureActive(
				corcite,
				extractor.id,
				false
			);

		assert.equal(
			corcite.capacities.energy.used,
			0
		);

		assert.equal(
			corcite.capacities.work.used,
			1
		);

		assert.equal(
			corcite.capacities
				.maintenance.used,
			3
		);

		assert.equal(
			corcite.capacities.space.used,
			6
		);

		const beforeInactive =
			summarizeStoredResources(
				corcite
			);

		const inactiveResult =
			resolvePlayableExtractionTurn(
				corcite
			);

		assert.deepEqual(
			summarizeStoredResources(
				inactiveResult.corcite
			),
			beforeInactive
		);

		corcite =
			setPlayableStructureActive(
				inactiveResult.corcite,
				extractor.id,
				true
			);

		assert.equal(
			corcite.capacities.energy.used,
			1
		);

		assert.equal(
			corcite.capacities.work.used,
			1
		);

		const activeResult =
			resolvePlayableExtractionTurn(
				corcite
			);

		assert.equal(
			summarizeStoredResources(
				activeResult.corcite
			).R1,
			beforeInactive.R1 + 2
		);
	}
);

test(
	'l’aperçu d’activation expose les capacités résultantes',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		const extractor =
			corcite.structures.find(
				(structure) =>
					structure.kind ===
					'extractor-a-n1'
			);

		assert.ok(extractor);

		corcite =
			setPlayableStructureActive(
				corcite,
				extractor.id,
				false
			);

		const preview =
			previewPlayableStructureActivation(
				corcite,
				extractor.id,
				true
			);

		assert.equal(
			preview.canApply,
			true
		);

		assert.equal(
			preview.energy.used,
			1
		);

		assert.equal(
			preview.work.used,
			1
		);
	}
);

test(
	'un stockage saturé bloque explicitement l’extraction',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		corcite.storageUnits[0].contents = {
			R1: 6,
			R2: 4,
			R3: 2,
			R4: 0
		};

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableExtractionTurn(
				corcite
			);

		assert.deepEqual(
			summarizeStoredResources(
				result.corcite
			),
			before
		);

		assert.ok(
			result.resolution.events.some(
				(event) =>
					event.sourceId ===
						'source-a' &&
					event.status ===
						'storage-blocked'
			)
		);
	}
);

test(
	'un stockage supplémentaire permet à nouveau de recevoir l’extraction',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		corcite = build(
			corcite,
			'storage-extension',
			2
		);

		assert.equal(
			corcite.storageUnits.length,
			2
		);

		corcite.storageUnits[0].contents = {
			R1: 6,
			R2: 4,
			R3: 2,
			R4: 0
		};

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableExtractionTurn(
				corcite
			);

		const after =
			summarizeStoredResources(
				result.corcite
			);

		assert.equal(
			after.R1,
			before.R1 + 2
		);

		assert.equal(
			result.corcite
				.storageUnits[1]
				.contents.R1,
			2
		);
	}
);

test(
	'les deux extracteurs peuvent être construits et produire ensemble',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		corcite =
			resolvePlayableExtractionTurn(
				corcite
			).corcite;

		corcite = build(
			corcite,
			'mineral-extractor',
			2
		);

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableExtractionTurn(
				corcite
			);

		const after =
			summarizeStoredResources(
				result.corcite
			);

		assert.equal(
			after.R1 - before.R1,
			2
		);

		assert.equal(
			after.R2 - before.R2,
			2
		);
	}
);

test(
	'l’état reste valide après construction, arrêt, reprise et extraction',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		const extractor =
			corcite.structures.find(
				(structure) =>
					structure.kind ===
					'extractor-a-n1'
			);

		assert.ok(extractor);

		corcite =
			setPlayableStructureActive(
				corcite,
				extractor.id,
				false
			);

		corcite =
			setPlayableStructureActive(
				corcite,
				extractor.id,
				true
			);

		corcite =
			resolvePlayableExtractionTurn(
				corcite
			).corcite;

		assert.deepEqual(
			validateCorciteState(
				corcite
			),
			{
				valid: true,
				errors: []
			}
		);
	}
);
