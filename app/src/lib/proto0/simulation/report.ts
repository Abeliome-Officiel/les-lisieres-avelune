import type {
	Proto0SimulationAudit
} from './audit.js';

function yesNo(
	value: boolean
): string {
	return value
		? 'oui'
		: 'non';
}

export function formatProto0SimulationAuditMarkdown(
	audit:
		Proto0SimulationAudit
): string {
	const lines = [
		'# Avelune — PROTO-0 — Vérification moteur P9',
		'',
		'Statut : résultats produits par le moteur headless.',
		'',
		'## 1. Traçabilité du lot de référence',
		'',
		'Le rapport de conception antérieur indique que 60 configurations avaient été comparées, mais les documents conservés ne contiennent pas leur liste exacte.',
		'',
		'Il serait donc incorrect de prétendre les réexécuter à l’identique.',
		'',
		`P9 définit désormais une référence moteur explicite de **${audit.referenceSet.count} configurations** :`,
		'',
		'- 24 permutations des quatre familles N1 distinctes ;',
		'- 36 ordonnancements uniques utilisant deux familles présentes deux fois.',
		'',
		'Cette référence est sérialisable, reproductible et utilisable pour les régressions futures.',
		'',
		'## 2. Scénario nominal',
		'',
		`Configurations exécutées : ${audit.referenceSet.count}.`,
		`Résultats TD distincts : ${audit.nominal.distinctResultCount}.`,
		`Effet de l’ordre reproduit : ${yesNo(audit.nominal.orderSensitive)}.`,
		`Configuration universellement dominante : ${
			audit.nominal
				.universallyDominantConfigurationIds
				.length === 0
				? 'aucune'
				: audit.nominal
						.universallyDominantConfigurationIds
						.join(', ')
		}.`,
		`Taille du front de Pareto : ${audit.nominal.paretoFrontConfigurationIds.length}.`,
		'',
		'### Leaders par objectif',
		''
	];

	for (
		const leader of
		audit.nominal
			.objectiveLeaders
	) {
		lines.push(
			`- ${leader.objective} : ${leader.value} — ${leader.configurationIds.join(', ')}`
		);
	}

	lines.push(
		'',
		'## 3. Variabilité seedée',
		'',
		`Graines testées : ${audit.seeded.seeds.length}.`,
		`Configurations seedées exécutées : ${audit.seeded.configurationsExecuted}.`,
		`Toutes les vagues restent dans les bornes configurées : ${yesNo(audit.seeded.allInputWavesWithinBounds)}.`,
		`Même graine = même batterie : ${yesNo(audit.seeded.deterministicReplay)}.`,
		`Des graines différentes produisent une variation observable : ${yesNo(audit.seeded.distinctSeedsProduceVariation)}.`,
		`Graines faisant apparaître une configuration universellement dominante : ${
			audit.seeded
				.seedsWithUniversalDominance
				.length
		}.`,
		'',
		'## 4. Stress et invariants',
		'',
		`Tours TF consécutifs terminés : ${audit.stress.tfTurnsCompleted}/${audit.stress.tfTurnsRequested}.`,
		`Tous les états TF produits restent valides : ${yesNo(audit.stress.allTfStatesValid)}.`,
		`Transformation/fabrication gratuite observée : ${yesNo(audit.stress.freeProcessingDetected)}.`,
		`Stockage saturé traité explicitement : ${yesNo(audit.stress.storageSaturationHandled)}.`,
		`Chaîne bloquée traitée explicitement : ${yesNo(audit.stress.blockedChainHandled)}.`,
		`Ressource insuffisante signalée explicitement : ${yesNo(audit.stress.insufficientResourceExplicit)}.`,
		`Conflit humain détecté : ${yesNo(audit.stress.humanConflictExplicit)}.`,
		`Conflit humain résolu après décision : ${yesNo(audit.stress.humanConflictResolved)}.`,
		`État impossible volontairement injecté détecté : ${yesNo(audit.stress.impossibleStateDetected)}.`,
		'',
		'## 5. Conclusions moteur',
		'',
		`- effet de l’ordre TD reproduit : ${yesNo(audit.conclusions.orderEffectReproduced)} ;`,
		`- aucune domination universelle observée dans le lot testé : ${yesNo(audit.conclusions.noUniversalDominanceObserved)} ;`,
		`- variation seedée maîtrisée : ${yesNo(audit.conclusions.seededVariationControlled)} ;`,
		`- répétition déterministe : ${yesNo(audit.conclusions.replayDeterministic)} ;`,
		`- aucune transformation/fabrication gratuite observée : ${yesNo(audit.conclusions.noFreeProcessingObserved)} ;`,
		`- conflits explicitement détectés/résolus : ${yesNo(audit.conclusions.conflictsRemainExplicit)} ;`,
		`- états impossibles détectés : ${yesNo(audit.conclusions.impossibleStatesDetected)}.`,
		'',
		'## 6. Portée',
		'',
		'Ces résultats valident ou réfutent les hypothèses de laboratoire de PROTO-0 pour le moteur actuel. Ils ne constituent pas un équilibrage définitif du jeu.',
		''
	);

	return lines.join('\n');
}
