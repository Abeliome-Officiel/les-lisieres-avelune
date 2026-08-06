# Documentation — Les Lisières d’Avelune

Cet index distingue désormais les **principes et documents de conception**, les **jalons historiques** et le **PROTO-0 jouable actuel**.

Le `v0.8` reste un repère historique. La dernière baseline de conception figée est `v0.8.3`, tandis que la conception courante est **v0.8.3+** et évolue avec les playtests.

## 1. Comprendre le jeu

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

## 2. Identité et direction artistique

- [Charte graphique de travail](art/CHARTE_GRAPHIQUE.md)
- [Assets GitHub](assets/README.md)

Direction actuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**.

Le canon visuel provisoire interdit d’inventer humains/humanoïdes, habitants, faune ou espèces naturelles non définies.

## 3. PROTO-0 jouable

Le prototype logiciel réel est développé sur :

- [`develop/proto-0.1-playable`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.1-playable)

La documentation technique courante du prototype comprend :

- [Périmètre du prototype jouable](proto0/PROTO0_PLAYABLE_SCOPE.md)
- [Gate de playtest](proto0/PROTO0_PLAYTEST_READY.md)
- [Jalon lisibilité et temporalité](proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md)
- [Carnet de test](proto0/PROTO0_TEST_NOTEBOOK.md)
- [Rapport d'équilibrage automatisé](proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [Parcours technique de référence](proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

### Architecture et méthode du prototype

- [Index développement](development/README.md)
- [Audit développement et architecture — 2026-08-06](development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Politique données/configuration](development/DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement jeu vidéo](development/GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l'UI](development/adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](development/adr/ADR-0002-DATA-DRIVEN-CONTENT.md)

Les documents P0–P10 et `proto-0-spec.1` restent des références
historiques de validation des moteurs. Lorsqu'ils divergent du
périmètre jouable courant, les documents ci-dessus font foi pour le
PROTO-0.1.

Documents historiques liés au passage vers le prototype :

- [Mini-prototype historique](07_prototype_mvp.md)
- [Prototype logiciel minimal historique](16_proto_minimal.md)
- [Socle mécanique v0.8](13_socle_mecanique_v0.8.md)

Ces documents restent utiles pour la traçabilité mais ne doivent pas être considérés comme une photographie exacte du PROTO-0 jouable actuel lorsqu’ils entrent en contradiction avec la branche jouable.

## 4. Méthode, décisions et outils

- [Outils](08_outils_et_wiki.md)
- [Sources](09_sources.md)
- [Décisions ouvertes](11_decisions_a_valider.md)
- [Préparation des progressions](12_preparation_arbres.md)

La documentation d’architecture, de méthode de développement, de dette technique et de politique data-driven est maintenue sur la branche documentaire dédiée afin de ne pas interférer avec les modifications du prototype en cours.

## 5. Principes à garder visibles

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
- direction visuelle onirique, féerique, organique et minérale sans inventer les populations ou espèces non définies.
