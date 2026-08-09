# Documentation — Les Lisières d’Avelune

Cet index distingue les **principes de conception**, les **jalons jouables stables**, les **documents historiques** et le **développement actif PROTO-0.2**.

## 1. Repères de version

- `v0.8` : ancien jalon historique.
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1.
- **PROTO-0.1** : jalon jouable intégré à `main` et actuellement déployé.
- **PROTO-0.2** : développement actif sur `develop/proto-0.2-ux-rules`, non encore stable ni déployé comme référence.

Le projet ne doit pas être présenté comme ayant déjà atteint une nouvelle version stable arbitraire telle que `v0.9`.

## 2. Comprendre le jeu

- [Vision actuelle](00_vision.md)
- [Corps-cité](01_concept_corps_cite.md)
- [Monde persistant](02_monde_persistant.md)
- [Tycoon–Factorio](03_tycoon_et_reseaux.md)
- [Vagues, météo et Échos](04_evenements_et_donnees_reelles.md)
- [Social et communication](05_social_et_communication.md)
- [Accessibilité, éthique et inclusivité](06_accessibilite_ethique.md)
- [Background](10_background_avelune.md)
- [Trame RPG](14_trame_rpg.md)
- [Passage et Lisière](15_lisiere_et_passage.md)

Ces documents portent la vision large du jeu. Lorsqu’un document de conception historique entre en contradiction avec le cahier actif PROTO-0.2, il ne doit pas être utilisé pour modifier le périmètre du prototype courant.

### Références de préproduction actuelles

- **[Manifeste de conception — Faire Monde](17_manifeste_faire_monde.md)** — cadre normatif révisable : étoile polaire, liberté du joueur, vivant, UX, monde systémique et contrôle de dérive.
- **[Système d'évolution de la vague — v0.2](19_systeme_evolution_vague_v0.2.md)** — référence active du moteur naturel : composition, six propriétés, dérive autonome, régimes, excès et 1,6 million de vagues simulées sans joueur.
- [Modèle évolutif de vague — v0.1](18_modele_vague_evolutive.md) — baseline historique conservée pour traçabilité.
- [Simulateur exploratoire v0.2](../tools/simulate_wave_evolution_v0_2.py) — modèle reproductible d'analyse, distinct du runtime du jeu.

Le manifeste et la v0.2 du système d'évolution décrivent le **canon de préproduction post-PROTO-0.2**. Ils ne modifient pas rétroactivement le périmètre du prototype actif ; lorsqu'une formulation conceptuelle historique les contredit sur le futur du jeu, ils font autorité.

## 3. Identité et direction artistique

- [Charte graphique de travail](art/CHARTE_GRAPHIQUE.md)
- [Assets GitHub](assets/README.md)
- [Brief visuel PROTO-0.2 / Gen3 corrigé](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)

Direction actuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**.

Pour PROTO-0.2, la composition Gen3 sert uniquement de référence ergonomique. Le Corcite doit rester non anthropomorphe ; éviter humains/humanoïdes, fantasy médiévale générique et esthétique industrielle sci-fi générique.

## 4. PROTO-0.1 — baseline stable

PROTO-0.1 reste la baseline logicielle actuellement intégrée à `main` et le prototype déployé de référence.

Documentation de ce jalon :

- [Périmètre du prototype jouable](proto0/PROTO0_PLAYABLE_SCOPE.md)
- [Gate de playtest](proto0/PROTO0_PLAYTEST_READY.md)
- [Jalon lisibilité et temporalité](proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md)
- [Carnet de test](proto0/PROTO0_TEST_NOTEBOOK.md)
- [Rapport d'équilibrage automatisé](proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [Parcours technique de référence](proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

Les documents historiques P0–P10 et `proto-0-spec.1` restent utiles pour la traçabilité, mais ne doivent pas être pris comme photographie exacte de l’état stable actuel lorsqu’ils divergent de `main`.

## 5. PROTO-0.2 — développement actif

Branche : [`develop/proto-0.2-ux-rules`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2-ux-rules)

Dossier de travail : [`docs/development/proto0.2`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2-ux-rules/docs/development/proto0.2)

Ordre de priorité documentaire du prototype :

1. [`CURRENT_TASK.md`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/CURRENT_TASK.md)
2. [`01_RULES_AND_SCOPE.md`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/01_RULES_AND_SCOPE.md)
3. [`02_UX_SPEC.md`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/02_UX_SPEC.md)
4. [`06_VISUAL_BRIEF_GEN3.md`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)
5. [`03_TECHNICAL_GUARDRAILS.md`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md)
6. [`04_ACCEPTANCE.md`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/04_ACCEPTANCE.md)

### Boucle active PROTO-0.2

```text
implanter
→ extraire
→ transformer / fabriquer
→ rechercher / évoluer
→ préparer les défenses
→ subir une vague
→ lire les conséquences
→ adapter
→ gagner ou perdre le run
```

### Simplifications volontaires du jalon

- plateau hexagonal concret ;
- `1 bâtiment = 1 case` ;
- pas de réseau direct/ports/câbles/Factorio actif ;
- stockage fourni par les bâtiments de stockage ;
- recherche courte et utile ;
- une seule famille de défense : **Affaiblissement** ;
- une seule caractéristique active de vague : **Puissance** ;
- première vague réduite à `0` → victoire du testeur ;
- Intégrité du Corcite à `0` → victoire du jeu ;
- pas de nombre fixe de vagues ;
- pas de matière issue des vagues ni de captation dans ce proto.

Pour PROTO-0.2, seule la **Puissance** reste active par simplification volontaire. Le modèle futur de vague est désormais défini séparément dans [le système d'évolution v0.2](19_systeme_evolution_vague_v0.2.md) ; il ne doit pas être réinjecté dans le prototype actif sans décision de périmètre.

## 6. Architecture et méthode

- [Index développement](development/README.md)
- [Audit développement et architecture — 2026-08-06](development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Politique données/configuration](development/DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement jeu vidéo](development/GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l'UI](development/adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](development/adr/ADR-0002-DATA-DRIVEN-CONTENT.md)

## 7. Documents historiques

- [Mini-prototype historique](07_prototype_mvp.md)
- [Prototype logiciel minimal historique](16_proto_minimal.md)
- [Socle mécanique v0.8](13_socle_mecanique_v0.8.md)

Ces fichiers sont conservés pour la traçabilité. Ils ne doivent pas reprendre autorité sur un jalon actif lorsqu’une source plus récente les contredit.

## 8. Principes à garder visibles

- monde partagé unique ;
- protection collective de la Lisière ;
- coopération directe entre Corcites facultative ;
- progression principalement horizontale ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- challenge systémique sans punition artificielle ;
- pas de micro-dopamine/FOMO comme moteur de rétention ;
- plusieurs styles et profondeurs de jeu légitimes ;
- attention explicite aux profils TSA, TDAH et dys ;
- identité queer et non genrée ;
- direction visuelle onirique, féerique, organique et minérale.
