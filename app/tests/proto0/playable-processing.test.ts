import assert from 'node:assert/strict';
import test from 'node:test';

import {
	addPlayerOperation,
	commitPlayableConstruction,
	connectPlayableTfStructures,
	createPlayableConstructionOperation,
	createPlayableCorciteState,
	createTurnPlan,
	endTurn,
	getPlayableRecipePresentation,
	previewPlayableTfConnection,
	resolvePlayableTfTurn,
	setPlayableStructureActive,
	summarizeStoredResources,
	validateCorciteState,
	type PlayableConstructionDefinitionId,
	type PlayableCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createPlayableCorciteState({
		id: 'corcite-processing',
		name: 'PROCESSING',
		controller: 'human'
	});
}

function build(
	input: PlayableCorciteState,
	definitionId:
		PlayableConstructionDefinitionId,
	turn: number
): PlayableCorciteState {
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

	return commitPlayableConstruction(
		prepared.corcite,
		prepared.plan,
		operationId,
		definitionId
	).corcite;
}

function findStructure(
	state: PlayableCorciteState,
	kind:
		| 'extractor-a-n1'
		| 'extractor-b-n1'
		| 'transformer-n1'
		| 'fabricator-n1'
		| 'maintenance-extension-n1'
) {
	const structure =
		state.structures.find(
			(candidate) =>
				candidate.kind === kind
		);

	assert.ok(structure);

	return structure;
}

test(
	'les recettes jouables possèdent des noms compréhensibles',
	() => {
		assert.equal(
			getPlayableRecipePresentation(
				'transform-r3-n1'
			).label,
			'Transformation primaire'
		);

		assert.equal(
			getPlayableRecipePresentation(
				'fabricate-r4-n1'
			).label,
			'Fabrication de composant'
		);
	}
);

test(
	'sans atelier construit aucune transformation ni fabrication ne se produit',
	() => {
		const corcite =
			createCorcite();

		const result =
			resolvePlayableTfTurn(
				corcite
			);

		assert.equal(
			result.transformation.events.length,
			0
		);

		assert.equal(
			result.fabrication.events.length,
			0
		);
	}
);

test(
	'un atelier de transformation construit consomme les matières brutes',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'primary-transformer',
			1
		);

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableTfTurn(
				corcite
			);

		const after =
			summarizeStoredResources(
				result.corcite
			);

		assert.equal(
			result.transformation
				.events[0].status,
			'produced'
		);

		assert.equal(
			after.R1,
			before.R1 - 2
		);

		assert.equal(
			after.R2,
			before.R2 - 2
		);

		assert.equal(
			after.R3,
			before.R3 + 2
		);
	}
);

test(
	'un atelier de fabrication construit produit un composant',
	() => {
		let corcite =
			createCorcite();

		/*
		 * On fabrique directement l'atelier avec le stock
		 * initial afin de tester son comportement isolément.
		 */
		corcite = build(
			corcite,
			'component-workshop',
			1
		);

		const before =
			summarizeStoredResources(
				corcite
			);

		/*
		 * Il reste zéro R3 après la construction.
		 * On injecte ici uniquement le lot de recette afin
		 * de tester la mécanique de fabrication isolée.
		 */
		corcite.storageUnits[0]
			.contents.R3 = 2;

		const result =
			resolvePlayableTfTurn(
				corcite
			);

		const after =
			summarizeStoredResources(
				result.corcite
			);

		assert.equal(
			result.fabrication
				.events[0].status,
			'produced'
		);

		assert.equal(
			after.R3,
			0
		);

		assert.equal(
			after.R4,
			before.R4 + 1
		);
	}
);

test(
	'un atelier arrêté ne transforme rien et libère énergie et travail',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'primary-transformer',
			1
		);

		const transformer =
			findStructure(
				corcite,
				'transformer-n1'
			);

		corcite =
			setPlayableStructureActive(
				corcite,
				transformer.id,
				false
			);

		assert.equal(
			corcite.capacities.energy.used,
			0
		);

		assert.equal(
			corcite.capacities.work.used,
			0
		);

		const before =
			summarizeStoredResources(
				corcite
			);

		const result =
			resolvePlayableTfTurn(
				corcite
			);

		assert.equal(
			result.transformation
				.events[0].status,
			'inactive'
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
	'une connexion extracteur vers transformateur crée un tampon de lot aval',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		corcite =
			resolvePlayableTfTurn(
				corcite
			).corcite;

		corcite = build(
			corcite,
			'primary-transformer',
			2
		);

		const extractor =
			findStructure(
				corcite,
				'extractor-a-n1'
			);

		const transformer =
			findStructure(
				corcite,
				'transformer-n1'
			);

		const preview =
			previewPlayableTfConnection(
				corcite,
				extractor.id,
				transformer.id,
				'R1'
			);

		assert.equal(
			preview.canConnect,
			true
		);

		corcite =
			connectPlayableTfStructures(
				corcite,
				{
					id:
						'playable-organic-transform',
					fromStructureId:
						extractor.id,
					toStructureId:
						transformer.id,
					resourceId: 'R1'
				}
			);

		assert.equal(
			corcite.tfNetwork
				.connections.length,
			1
		);

		assert.equal(
			corcite.tfNetwork
				.buffers.length,
			1
		);

		assert.equal(
			corcite.tfNetwork
				.buffers[0].capacity,
			2
		);
	}
);

test(
	'une connexion incompatible est explicitement refusée',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		corcite =
			resolvePlayableTfTurn(
				corcite
			).corcite;

		corcite = build(
			corcite,
			'primary-transformer',
			2
		);

		const extractor =
			findStructure(
				corcite,
				'extractor-a-n1'
			);

		const transformer =
			findStructure(
				corcite,
				'transformer-n1'
			);

		const preview =
			previewPlayableTfConnection(
				corcite,
				extractor.id,
				transformer.id,
				'R2'
			);

		assert.equal(
			preview.canConnect,
			false
		);
	}
);

test(
	'une matière extraite au tour N n’alimente pas la transformation avant N+1',
	() => {
		let corcite =
			createCorcite();

		/*
		 * Etat préparé pour isoler la règle temporelle :
		 * extracteurs + transformateur existent,
		 * mais aucun R1/R2 n'est disponible au début du tour.
		 */
		corcite.structures.push(
			{
				id: 'test-organic',
				kind: 'extractor-a-n1',
				name: 'Extracteur organique',
				status: 'active',
				usage: {
					energy: 1,
					maintenance: 1,
					work: 1,
					space: 2
				}
			},
			{
				id: 'test-mineral',
				kind: 'extractor-b-n1',
				name: 'Extracteur minéral',
				status: 'active',
				usage: {
					energy: 1,
					maintenance: 1,
					work: 1,
					space: 2
				}
			},
			{
				id: 'test-transform',
				kind: 'transformer-n1',
				name: 'Atelier de transformation',
				status: 'active',
				usage: {
					energy: 2,
					maintenance: 1,
					work: 1,
					space: 3
				}
			}
		);

		corcite.storageUnits[0].contents = {
			R1: 0,
			R2: 0,
			R3: 0,
			R4: 0
		};

		/*
		 * Les capacités sont explicitement cohérentes avec
		 * cet état de test.
		 */
		corcite.capacities.energy.used = 4;
		corcite.capacities.maintenance.used = 5;
		corcite.capacities.work.used = 3;
		corcite.capacities.space.used = 11;

		const turnN =
			resolvePlayableTfTurn(
				corcite
			);

		assert.equal(
			turnN.transformation
				.events[0].status,
			'input-blocked'
		);

		assert.deepEqual(
			summarizeStoredResources(
				turnN.corcite
			),
			{
				R1: 2,
				R2: 2,
				R3: 0,
				R4: 0
			}
		);

		const turnN1 =
			resolvePlayableTfTurn(
				turnN.corcite
			);

		assert.equal(
			turnN1.transformation
				.events[0].status,
			'produced'
		);
	}
);

test(
	'du matériau transformé au tour N n’alimente pas le fabricateur avant N+1',
	() => {
		let corcite =
			createCorcite();

		/*
		 * Etat technique contrôlé :
		 * transformateur + fabricateur actifs,
		 * intrants de transformation présents,
		 * aucun R3 au début du tour.
		 */
		corcite.structures.push(
			{
				id: 'test-transform',
				kind: 'transformer-n1',
				name: 'Atelier de transformation',
				status: 'active',
				usage: {
					energy: 2,
					maintenance: 1,
					work: 1,
					space: 3
				}
			},
			{
				id: 'test-fabricate',
				kind: 'fabricator-n1',
				name: 'Atelier de fabrication',
				status: 'active',
				usage: {
					energy: 2,
					maintenance: 1,
					work: 1,
					space: 3
				}
			}
		);

		corcite.storageUnits[0].contents = {
			R1: 2,
			R2: 2,
			R3: 0,
			R4: 0
		};

		corcite.capacities.energy.used = 4;
		corcite.capacities.maintenance.used = 4;
		corcite.capacities.work.used = 2;
		corcite.capacities.space.used = 10;

		const turnN =
			resolvePlayableTfTurn(
				corcite
			);

		assert.equal(
			turnN.transformation
				.events[0].status,
			'produced'
		);

		assert.equal(
			turnN.fabrication
				.events[0].status,
			'input-blocked'
		);

		assert.equal(
			summarizeStoredResources(
				turnN.corcite
			).R3,
			2
		);

		const turnN1 =
			resolvePlayableTfTurn(
				turnN.corcite
			);

		assert.equal(
			turnN1.fabrication
				.events[0].status,
			'produced'
		);
	}
);

test(
	'avec quatre habitants la chaîne complète impose de désactiver certaines fonctions',
	() => {
		let corcite =
			createCorcite();

		corcite = build(
			corcite,
			'organic-extractor',
			1
		);

		corcite =
			resolvePlayableTfTurn(
				corcite
			).corcite;

		corcite = build(
			corcite,
			'mineral-extractor',
			2
		);

		/*
		 * On produit plusieurs tours afin de constituer
		 * le stock nécessaire au développement.
		 */
		corcite =
			resolvePlayableTfTurn(
				corcite
			).corcite;

		corcite =
			resolvePlayableTfTurn(
				corcite
			).corcite;

		corcite = build(
			corcite,
			'primary-transformer',
			3
		);

		/*
		 * La maintenance atteint alors sa limite.
		 * On transforme un lot afin d'obtenir les ressources
		 * nécessaires à l'infrastructure suivante.
		 */
		corcite =
			resolvePlayableTfTurn(
				corcite
			).corcite;

		const organic =
			findStructure(
				corcite,
				'extractor-a-n1'
			);

		/*
		 * L'unité d'entretien nécessitera une unité de travail
		 * et d'énergie. On arrête donc une extraction avant sa
		 * construction pour changer de phase
		 * économique au lieu d'augmenter artificiellement
		 * la population.
		 */
		corcite =
			setPlayableStructureActive(
				corcite,
				organic.id,
				false
			);

		corcite = build(
			corcite,
			'maintenance-unit',
			4
		);

		assert.equal(
			corcite.capacities.work.used,
			3
		);

		/*
		 * Selon les stocks exacts produits par les tours
		 * précédents, on assure ici uniquement que cette
		 * réorganisation rend une unité de travail disponible.
		 */
		assert.equal(
			corcite.capacities.work.capacity -
				corcite.capacities.work.used,
			1
		);

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
