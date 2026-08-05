import assert from 'node:assert/strict';
import test from 'node:test';

import {
	applyWaveConsequences,
	createEmptyTdState,
	createReferenceCorciteState,
	createTdTower,
	deserializeCorciteState,
	placeTdTower,
	resolveTdPath,
	serializeCorciteState,
	validateCorciteState
} from '../../src/lib/proto0/index.js';

function createCorcite() {
	return createReferenceCorciteState({
		id:
			'corcite-p7',
		name:
			'P7',
		controller:
			'human'
	});
}

function createResolution() {
	let td =
		createEmptyTdState();

	const definitions = [
		'attenuation-n1',
		'destructuration-n1',
		'captation-n1',
		'stabilisation-n1'
	] as const;

	for (
		let index = 0;
		index <
			definitions.length;
		index += 1
	) {
		td =
			placeTdTower(
				td,
				{
					position:
						index + 1,
					tower:
						createTdTower({
							id:
								`p7-tower-${index + 1}`,
							definitionId:
								definitions[index]
						})
				}
			);
	}

	return resolveTdPath(
		td,
		{
			pressure: 50,
			structure: 60,
			charge: 20,
			capturableMatter: 16
		}
	);
}

test("un Corcite de référence ne possède encore aucune conséquence de vague", () => {
	const corcite =
		createCorcite();

	assert.deepEqual(
		corcite.waveConsequences,
		[]
	);
});

test("le résultat TD est appliqué et conservé sur le Corcite", () => {
	const resolution =
		createResolution();

	const result =
		applyWaveConsequences(
			createCorcite(),
			{
				runId: 'P7-RUN',
				turn: 10,
				resolution
			}
		);

	assert.equal(
		result.corcite
			.waveConsequences
			.length,
		1
	);

	assert.deepEqual(
		result.corcite
			.waveConsequences[0]
			.finalWave,
		resolution.finalWave
	);
});

test("une défense imparfaite laisse une exposition résiduelle mesurable", () => {
	const result =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-RESIDUAL',
				turn: 10,
				resolution:
					createResolution()
			}
		);

	assert.equal(
		result.consequence
			.defenseResult,
		'residual'
	);

	assert.ok(
		result.consequence
			.finalWave
			.pressure >
			0
	);

	assert.ok(
		result.consequence
			.finalWave
			.structure >
			0
	);

	assert.ok(
		result.consequence
			.finalWave
			.charge >
			0
	);
});

test("la matière réellement captée est conservée après la vague", () => {
	const resolution =
		createResolution();

	const result =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-CAPTURE',
				turn: 10,
				resolution
			}
		);

	assert.equal(
		result.consequence
			.capturedMatter,
		resolution
			.capturedMatter
	);

	assert.ok(
		result.consequence
			.capturedMatter >
			0
	);
});

test("les consommations pertinentes sont conservées avec leur origine", () => {
	const result =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-CONSUMPTIONS',
				turn: 10,
				resolution:
					createResolution(),
				consumptions: [
					{
						resourceId:
							'R3',
						amount: 2,
						source:
							'td-preparation:attenuation-n1'
					},
					{
						resourceId:
							'R4',
						amount: 1,
						source:
							'td-preparation:attenuation-n1'
					}
				]
			}
		);

	assert.deepEqual(
		result.consequence
			.consumptions,
		[
			{
				resourceId:
					'R3',
				amount: 2,
				source:
					'td-preparation:attenuation-n1'
			},
			{
				resourceId:
					'R4',
				amount: 1,
				source:
					'td-preparation:attenuation-n1'
			}
		]
	);
});

test("la vague produit une connaissance persistante avec origine traçable", () => {
	const result =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-KNOWLEDGE',
				turn: 10,
				resolution:
					createResolution()
			}
		);

	const produced =
		result.consequence
			.knowledgeProduced[0];

	const persisted =
		result.corcite
			.rpg.knowledge.find(
				(entry) =>
					entry.id ===
						produced.id
			);

	assert.ok(persisted);

	assert.equal(
		persisted.source,
		'wave:P7-KNOWLEDGE'
	);

	assert.equal(
		result.corcite
			.rpg.journal.at(-1)
			?.source,
		'wave:P7-KNOWLEDGE'
	);
});

test("le snapshot après vague est indépendant de l'état retourné", () => {
	const result =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-SNAPSHOT',
				turn: 10,
				resolution:
					createResolution()
			}
		);

	const originalPressure =
		result.corcite
			.waveConsequences[0]
			.finalWave.pressure;

	result.snapshotAfterWave
		.finalWave.pressure = 0;

	assert.equal(
		result.corcite
			.waveConsequences[0]
			.finalWave.pressure,
		originalPressure
	);
});

test("les conséquences et connaissances survivent à la sérialisation Corcite", () => {
	const applied =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-SERIALIZE',
				turn: 10,
				resolution:
					createResolution(),
				consumptions: [
					{
						resourceId:
							'R4',
						amount: 1,
						source:
							'test'
					}
				]
			}
		).corcite;

	const restored =
		deserializeCorciteState(
			serializeCorciteState(
				applied
			)
		);

	assert.deepEqual(
		restored
			.waveConsequences,
		applied
			.waveConsequences
	);

	assert.deepEqual(
		restored
			.rpg.knowledge,
		applied
			.rpg.knowledge
	);

	assert.equal(
		validateCorciteState(
			restored
		).valid,
		true
	);
});

test("une même vague ne peut pas être appliquée deux fois au même Corcite", () => {
	const first =
		applyWaveConsequences(
			createCorcite(),
			{
				runId:
					'P7-DUPLICATE',
				turn: 10,
				resolution:
					createResolution()
			}
		).corcite;

	assert.throws(
		() =>
			applyWaveConsequences(
				first,
				{
					runId:
						'P7-DUPLICATE',
					turn: 10,
					resolution:
						createResolution()
				}
			),
		/déjà produit des conséquences/
	);
});
