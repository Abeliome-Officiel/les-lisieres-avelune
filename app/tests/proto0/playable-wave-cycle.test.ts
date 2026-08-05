import assert from 'node:assert/strict';
import test from 'node:test';

import type {
	CorciteState
} from '../../src/lib/proto0/domain/corcite.js';

import {
	PLAYABLE_WAVE_CYCLE_REFERENCE,
	advancePlayableWaveCycleAfterTurn,
	createPlayableCorciteState,
	createPlayableWaveCycle,
	deserializePlayableWaveCycle,
	getPlayableWaveForecast,
	resolvePlayableWave,
	serializePlayableWaveCycle,
	validatePlayableWaveCycle
} from '../../src/lib/proto0/index.js';

function createCorcite(): CorciteState {
	return createPlayableCorciteState({
		id:
			'corcite-playable-wave',
		name:
			'Cycle',
		controller:
			'human'
	});
}

function advanceToWave(
	input:
		ReturnType<
			typeof createPlayableWaveCycle
		>
) {
	let cycle =
		structuredClone(
			input
		);

	const scheduledTurn =
		cycle.current
			?.scheduledTurn;

	assert.ok(
		scheduledTurn
	);

	for (
		let turn =
			cycle.lastAdvancedTurn +
				1;
		turn <=
			scheduledTurn;
		turn += 1
	) {
		cycle =
			advancePlayableWaveCycleAfterTurn(
				cycle,
				turn
			);
	}

	return cycle;
}

test(
	"le cycle jouable prévoit trois vagues sans modifier la configuration historique P10",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		assert.equal(
			cycle.plannedWaveCount,
			3
		);

		assert.equal(
			PLAYABLE_WAVE_CYCLE_REFERENCE
				.plannedWaveCount,
			3
		);

		assert.equal(
			cycle.current
				?.scheduledTurn,
			6
		);

		assert.equal(
			cycle.phase,
			'preparation'
		);
	}
);

test(
	"les trois profils de vague sont qualitativement distincts",
	() => {
		const profiles =
			PLAYABLE_WAVE_CYCLE_REFERENCE
				.profiles;

		assert.deepEqual(
			profiles.map(
				(profile) =>
					profile.id
			),
			[
				'pressure-front',
				'charged-fracture',
				'dense-front'
			]
		);

		assert.ok(
			profiles[0]
				.nominal.pressure >
			profiles[0]
				.nominal.charge
		);

		assert.ok(
			profiles[1]
				.nominal.charge >
			profiles[0]
				.nominal.charge
		);

		assert.ok(
			profiles[2]
				.nominal.structure >
			profiles[0]
				.nominal.structure
		);

		assert.ok(
			profiles[2]
				.nominal.capturableMatter >
			profiles[0]
				.nominal.capturableMatter
		);
	}
);

test(
	"même seed produit exactement la même première vague jouable",
	() => {
		const a =
			createPlayableWaveCycle({
				seed: 12345
			});

		const b =
			createPlayableWaveCycle({
				seed: 12345
			});

		assert.deepEqual(
			a.current,
			b.current
		);
	}
);

test(
	"une autre seed modifie la réalisation de la vague",
	() => {
		const a =
			createPlayableWaveCycle({
				seed: 12345
			});

		const b =
			createPlayableWaveCycle({
				seed: 12346
			});

		assert.notDeepEqual(
			a.current
				?.actualWave,
			b.current
				?.actualWave
		);
	}
);

test(
	"la vague réelle reste dans la variation bornée de son profil",
	() => {
		for (
			let seed = 1;
			seed <= 100;
			seed += 1
		) {
			const cycle =
				createPlayableWaveCycle({
					seed
				});

			assert.ok(
				cycle.current
			);

			const profile =
				PLAYABLE_WAVE_CYCLE_REFERENCE
					.profiles[0];

			for (
				const key of [
					'pressure',
					'structure',
					'charge',
					'capturableMatter'
				] as const
			) {
				const nominal =
					profile
						.nominal[key];

				const actual: number =
					cycle.current
						.actualWave[key];

				const deltaPercent: number =
					Math.abs(
						actual -
							nominal
					) /
					nominal *
					100;

				assert.ok(
					deltaPercent <=
						profile
							.variationPercent +
						0.00001
				);
			}
		}
	}
);

test(
	"la première lecture existe tôt mais reste volontairement imprécise",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const forecast =
			getPlayableWaveForecast(
				cycle,
				1,
				createCorcite()
			);

		assert.ok(
			forecast
		);

		assert.equal(
			forecast
				.turnsUntilWave,
			5
		);

		assert.equal(
			forecast.stage,
			'distant'
		);

		assert.equal(
			forecast
				.baseUncertaintyPercent,
			14
		);
	}
);

test(
	"la lecture de vague se précise progressivement sans dépendre des libellés historiques T-3 T-2 T-1",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const corcite =
			createCorcite();

		const distant =
			getPlayableWaveForecast(
				cycle,
				1,
				corcite
			);

		const refined =
			getPlayableWaveForecast(
				cycle,
				4,
				corcite
			);

		const near =
			getPlayableWaveForecast(
				cycle,
				5,
				corcite
			);

		assert.ok(distant);
		assert.ok(refined);
		assert.ok(near);

		assert.equal(
			distant.stage,
			'distant'
		);

		assert.equal(
			refined.stage,
			'approaching'
		);

		assert.equal(
			near.stage,
			'near'
		);

		assert.ok(
			distant
				.effectiveUncertaintyPercent >
			refined
				.effectiveUncertaintyPercent
		);

		assert.ok(
			refined
				.effectiveUncertaintyPercent >
			near
				.effectiveUncertaintyPercent
		);
	}
);

test(
	"la recherche d'observation réduit réellement l'incertitude après validation de son modificateur",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const baseCorcite =
			createCorcite();

		const researchedCorcite =
			createCorcite();

		researchedCorcite
			.modifiers.push({
				id:
					'test-wave-precision',
				source:
					'research:test',
				target:
					'wave.forecast.precision',
				operation:
					'multiply',
				value:
					1.15,
				active:
					true
			});

		const before =
			getPlayableWaveForecast(
				cycle,
				1,
				baseCorcite
			);

		const after =
			getPlayableWaveForecast(
				cycle,
				1,
				researchedCorcite
			);

		assert.ok(before);
		assert.ok(after);

		assert.equal(
			before
				.precisionMultiplier,
			1
		);

		assert.equal(
			after
				.precisionMultiplier,
			1.15
		);

		assert.ok(
			after
				.effectiveUncertaintyPercent <
			before
				.effectiveUncertaintyPercent
		);
	}
);

test(
	"un modificateur de précision inactif n'altère pas les prévisions",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const corcite =
			createCorcite();

		corcite.modifiers.push({
			id:
				'test-inactive-wave-precision',
			source:
				'research:test',
			target:
				'wave.forecast.precision',
			operation:
				'multiply',
			value:
				2,
			active:
				false
		});

		const forecast =
			getPlayableWaveForecast(
				cycle,
				1,
				corcite
			);

		assert.ok(forecast);

		assert.equal(
			forecast
				.precisionMultiplier,
			1
		);

		assert.equal(
			forecast
				.effectiveUncertaintyPercent,
			14
		);
	}
);

test(
	"le cycle avance tour par tour jusqu'à rendre la vague prête",
	() => {
		let cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		for (
			let turn = 1;
			turn <= 5;
			turn += 1
		) {
			cycle =
				advancePlayableWaveCycleAfterTurn(
					cycle,
					turn
				);

			assert.equal(
				cycle.phase,
				'preparation'
			);
		}

		cycle =
			advancePlayableWaveCycleAfterTurn(
				cycle,
				6
			);

		assert.equal(
			cycle.phase,
			'ready'
		);

		assert.equal(
			cycle.lastAdvancedTurn,
			6
		);
	}
);

test(
	"le cycle refuse de sauter artificiellement un tour",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		assert.throws(
			() =>
				advancePlayableWaveCycleAfterTurn(
					cycle,
					2
				),
			/tour attendu est 1/
		);
	}
);

test(
	"une vague arrivée bloque l'avancement tant qu'elle n'est pas résolue",
	() => {
		const ready =
			advanceToWave(
				createPlayableWaveCycle({
					seed:
						20260804
				})
			);

		assert.equal(
			ready.phase,
			'ready'
		);

		assert.throws(
			() =>
				advancePlayableWaveCycleAfterTurn(
					ready,
					7
				),
			/doit être résolue/
		);
	}
);

test(
	"une vague ne peut pas être résolue avant son arrivée",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		assert.throws(
			() =>
				resolvePlayableWave(
					createCorcite(),
					cycle,
					{
						runId:
							'PLAYABLE-WAVE',
						turn:
							1
					}
				),
			/Aucune vague/
		);
	}
);

test(
	"résoudre une vague conserve une conséquence persistante et prépare la suivante",
	() => {
		const ready =
			advanceToWave(
				createPlayableWaveCycle({
					seed:
						20260804
				})
			);

		const result =
			resolvePlayableWave(
				createCorcite(),
				ready,
				{
					runId:
						'PLAYABLE-MULTI',
					turn:
						6
				}
			);

		assert.equal(
			result.corcite
				.waveConsequences
				.length,
			1
		);

		assert.equal(
			result.cycle
				.history.length,
			1
		);

		assert.equal(
			result.cycle.phase,
			'preparation'
		);

		assert.equal(
			result.cycle.current
				?.waveNumber,
			2
		);

		assert.equal(
			result.cycle.current
				?.scheduledTurn,
			11
		);

		assert.equal(
			result.cycle.current
				?.profileId,
			'charged-fracture'
		);
	}
);

test(
	"la seconde vague est déterministe mais différente de la première",
	() => {
		const initial =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const firstWave =
			structuredClone(
				initial.current
					?.actualWave
			);

		const firstResolved =
			resolvePlayableWave(
				createCorcite(),
				advanceToWave(
					initial
				),
				{
					runId:
						'PLAYABLE-PROFILES',
					turn:
						6
				}
			);

		assert.notDeepEqual(
			firstResolved
				.cycle.current
				?.actualWave,
			firstWave
		);

		assert.equal(
			firstResolved
				.cycle.current
				?.profileId,
			'charged-fracture'
		);
	}
);

test(
	"les trois vagues peuvent être résolues dans une même partie",
	() => {
		let corcite =
			createCorcite();

		let cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const expectedTurns = [
			6,
			11,
			16
		];

		for (
			let waveIndex = 0;
			waveIndex <
				expectedTurns.length;
			waveIndex += 1
		) {
			cycle =
				advanceToWave(
					cycle
				);

			assert.equal(
				cycle.current
					?.scheduledTurn,
				expectedTurns[
					waveIndex
				]
			);

			const result =
				resolvePlayableWave(
					corcite,
					cycle,
					{
						runId:
							'PLAYABLE-THREE-WAVES',
						turn:
							expectedTurns[
								waveIndex
							]
					}
				);

			corcite =
				result.corcite;

			cycle =
				result.cycle;
		}

		assert.equal(
			cycle.phase,
			'complete'
		);

		assert.equal(
			cycle.current,
			null
		);

		assert.equal(
			cycle.history.length,
			3
		);

		assert.equal(
			corcite
				.waveConsequences
				.length,
			3
		);

		assert.deepEqual(
			cycle.history.map(
				(entry) =>
					entry.waveNumber
			),
			[
				1,
				2,
				3
			]
		);

		assert.deepEqual(
			cycle.history.map(
				(entry) =>
					entry.profileId
			),
			[
				'pressure-front',
				'charged-fracture',
				'dense-front'
			]
		);

		assert.equal(
			new Set(
				cycle.history.map(
					(entry) =>
						entry
							.consequenceId
				)
			).size,
			3
		);
	}
);

test(
	"les conséquences de vagues précédentes restent présentes pendant la préparation suivante",
	() => {
		let corcite =
			createCorcite();

		let cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const first =
			resolvePlayableWave(
				corcite,
				advanceToWave(
					cycle
				),
				{
					runId:
						'PLAYABLE-PERSISTENCE',
					turn:
						6
				}
			);

		corcite =
			first.corcite;

		cycle =
			first.cycle;

		cycle =
			advancePlayableWaveCycleAfterTurn(
				cycle,
				7
			);

		assert.equal(
			cycle.phase,
			'preparation'
		);

		assert.equal(
			corcite
				.waveConsequences
				.length,
			1
		);

		assert.equal(
			cycle.history.length,
			1
		);
	}
);

test(
	"le cycle multi-vagues survit à la sérialisation",
	() => {
		const firstResolved =
			resolvePlayableWave(
				createCorcite(),
				advanceToWave(
					createPlayableWaveCycle({
						seed:
							20260804
					})
				),
				{
					runId:
						'PLAYABLE-SERIALIZE',
					turn:
						6
				}
			);

		const restored =
			deserializePlayableWaveCycle(
				serializePlayableWaveCycle(
					firstResolved
						.cycle
				)
			);

		assert.deepEqual(
			restored,
			firstResolved.cycle
		);

		assert.notEqual(
			restored,
			firstResolved.cycle
		);

		assert.equal(
			validatePlayableWaveCycle(
				restored
			).valid,
			true
		);
	}
);

test(
	"un cycle incohérent est rejeté à la désérialisation",
	() => {
		const cycle =
			createPlayableWaveCycle({
				seed:
					20260804
			});

		const raw =
			JSON.parse(
				serializePlayableWaveCycle(
					cycle
				)
			);

		raw.current.waveNumber =
			3;

		assert.throws(
			() =>
				deserializePlayableWaveCycle(
					JSON.stringify(
						raw
					)
				),
			/invalide/
		);
	}
);

test(
	"la captation reste une conséquence mesurée et n'est pas injectée arbitrairement dans les stocks au lot cycle",
	() => {
		const corcite =
			createCorcite();

		const before =
			structuredClone(
				corcite.storageUnits
			);

		const result =
			resolvePlayableWave(
				corcite,
				advanceToWave(
					createPlayableWaveCycle({
						seed:
							20260804
					})
				),
				{
					runId:
						'PLAYABLE-NO-CAPTURE-ECONOMY',
					turn:
						6
				}
			);

		assert.deepEqual(
			result.corcite
				.storageUnits,
			before
		);
	}
);
