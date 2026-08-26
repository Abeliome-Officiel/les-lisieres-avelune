# P0-AUTH — clôture autorité canonique, reprise et crash

> **Statut : PASS / CLOSED — 21 août 2026**  
> **Classification : SHAREABLE** — ce document décrit uniquement les garanties et résultats de qualification. Le code du Cœur, ses structures privées, recettes, seeds, RNG, détails de persistance et procédures internes restent hors GitHub.

## Verdict

La phase P0-AUTH est fermée. Le Cœur dispose désormais d'un état canonique committé dont l'identité du monde, la révision canonique, l'âge canonique et l'état vivant correspondent au même commit autoritatif.

```text
P0_AUTH=PASS
BIOLOGICAL_RNG_NEUTRALITY=PASS
O2_CLEAN_RESTART=PASS
O3_CRASH_ATOMICITY=PASS
O4_DOWNTIME_POLICY=PAUSE
```

La suite complète du Cœur après cette évolution est également qualifiée : **72/72 tests PASS**.

## Primitives autoritatives

La frontière conceptuelle fournie par P0 est :

```text
CommittedWorldState {
  world_instance_id,
  state_revision,
  canonical_age,
  state
}
```

Garanties partageables :

- `world_instance_id` est une identité opaque et persistante du monde, indépendante de la machine, du chemin ou du processus ;
- `state_revision` ordonne les commits canoniques et reste distinct de la version de schéma, de l'âge canonique et de l'ordre de publication P1 ;
- `canonical_age` est une quantité exacte ; sa progression autoritative est cohérente avec la progression biologique committée ;
- `state` désigne l'état vivant complet correspondant aux mêmes métadonnées canoniques ;
- une incohérence d'identité, de version ou de progression échoue explicitement plutôt que d'être approximée.

La manière exacte dont ces garanties sont persistées reste privée.

## Neutralité biologique et stochastique

La couche d'autorité a été comparée à une trajectoire de référence sans cette couche. La qualification exigeait une égalité exacte de l'état biologique final, des événements et des états aléatoires internes.

Verdict : **PASS**. P0-AUTH ajoute des garanties d'identité et de persistance sans modifier la biologie du monde.

## O2 — arrêt propre et reprise

Un même monde a été exécuté selon deux chemins : exécution continue et arrêt propre suivi d'une réouverture puis continuation.

Verdict : **PASS**. L'identité, l'état, la révision, l'âge canonique, la trajectoire et l'historique restent cohérents, sans duplication.

## O3 — crash et atomicité

Une qualification destructive sur monde LAB sacrificiel a provoqué un arrêt réel de processus pendant une opération de persistance.

Verdict : **PASS**. Après redémarrage, le Cœur retrouve un commit canonique entier et cohérent, jamais un mélange partiellement écrit. La continuation après récupération reste déterministe.

Ce résultat documente la garantie observable ; les mécanismes d'injection de panne et détails internes ne sont pas publiés.

## O4 — politique de downtime

La politique qualifiée est :

```text
CANONICAL_DOWNTIME_POLICY=PAUSE
```

Lorsque le **Cœur lui-même** est arrêté, le temps mural écoulé n'est pas converti automatiquement en vieillissement canonique. Le monde reprend depuis son dernier état committé et sa progression canonique recommence avec la reprise effective du Cœur.

Cette règle concerne l'indisponibilité du Cœur. Si un module aval est indisponible alors que le Cœur reste sain, le Cœur peut continuer indépendamment de ce module.

## Autorités après P0-AUTH

```text
P0 / Cœur
  → vérité biologique et état canonique committé

P1 / Lecteur
  → projection autorisée et continuité de publication

P2 / Observabilité
  → observation non autoritative

P3 / Orchestrateur
  → control plane et cycle de vie
```

P1 reste l'unique autorité de continuité de publication. P3 peut provisionner l'identité lors d'une création, mais l'identité du monde qu'il administre doit correspondre à celle portée par P0 ; une divergence est bloquante.

Aucun client aval ne reçoit un accès direct au stockage privé du Cœur ou à ses données aléatoires internes.

## Suite du chemin critique

P0-AUTH, la neutralité et O2/O3/O4 étant fermés, la prochaine gate est **CREAD-LIVE** : raccorder P1 à la nouvelle autorité P0 par une frontière minimale, versionnée et de moindre privilège, puis démontrer l'équivalence sémantique replay/live.

La séquence de qualification reste :

```text
CREAD-LIVE
  ↓
OBS-1 / ORCH-1 selon dépendances
  ↓
O5-MIGRATION
  ↓
P5A / P5B / P6 live
  ↓
isolation des pannes aval
  ↓
freeze intégré
  ↓
endurance 240 h
  ↓
analyse exhaustive
  ↓
décision de baseline d'entrée CŒUR-1
```

**O5-MIGRATION reste obligatoire** : une migration réelle LAB devra conserver l'identité du monde et son état canonique sans créer deux autorités actives.

## Addendum D17 — migration et portabilité — 26 août 2026

La règle D17 impose que la passation finale signale explicitement les particularités susceptibles d'affecter une migration ou un remplacement technologique. Cet addendum **ne rouvre pas P0** et ne modifie aucun PASS existant.

Particularités P0 à conserver dans le préflight d'une future migration :

- **migration réelle / O5** : l'identité et l'histoire canoniques doivent être conservées et le cutover doit maintenir une seule autorité active ; O5 reste requis et n'est pas revendiqué PASS par cette clôture ;
- **portage vers un autre langage/runtime** : la persistance et les identités P0 sont conçues de manière favorable à la portabilité, mais une équivalence bit-exacte avec une réimplémentation non-Python n'est pas actuellement une propriété qualifiée ; certains comportements déterministes et numériques restent liés à l'implémentation tant qu'ils n'ont pas été spécifiés et requalifiés comme contrat inter-langages.

Cette dette de portabilité est **documentée et non bloquante pour la baseline actuelle**. Un portage réel exigerait un audit et une requalification ciblés avant substitution de l'implémentation canonique ; il ne justifie pas une réouverture préventive de P0.

Les références détaillées, contraintes internes et preuves restent dans le Coffre et dans le registre central privé de migration/portabilité conformément à la frontière de publication.

```text
MIGRATION_PORTABILITY_SPECIAL_NOTES=DOCUMENTED
P0_BASELINE_REOPENED=NO
O5_REQUIRED=YES
CROSS_LANGUAGE_BIT_EXACT=NOT_CLAIMED
```

## Frontière de publication

Cette clôture n'autorise pas la publication du code propriétaire du Cœur. Restent hors GitHub : recettes, paramètres, seuils, seeds, RNG, structures privées, détails de stockage, mappings causaux, procédures internes de faute, informations d'exploitation sensibles et CODEX.

Les particularités détaillées de migration/portabilité, les mécanismes d'implémentation et les preuves privées restent également hors dépôt ; GitHub ne porte que les garanties et statuts agrégés nécessaires à la reprise.

Aucune nouvelle règle constitutionnelle n'est créée par cet addendum : D17 complète les principes existants de migration, réversibilité et portabilité sans transformer une dette documentée en réouverture automatique.
