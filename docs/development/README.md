# Développement et architecture

Ce dossier regroupe la documentation technique, la méthode de développement et les états de pilotage des chantiers Avelune.

## État courant

Point de référence : **[Avelune — état de développement au 12 août 2026](PROJECT_STATUS_2026-08-12.md)**.

Trois chantiers doivent être lus séparément :

- **PROTO-0.2.2** : candidat de playtest distribué ;
- **Cœur vivant / CŒUR-0** : laboratoire headless autonome ;
- **Tableau Réel (TA3)** : instrumentation persistante du projet réel.

`main` reste la baseline stable d’intégration jusqu’à décision explicite sur le candidat PROTO-0.2.2.

## PROTO-0.2.2

Branche : [`develop/proto-0.2.2-playtest`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest)

Cahier : [`docs/development/proto0.2`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest/docs/development/proto0.2)

Références principales :

- [Règles et périmètre](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/01_RULES_AND_SCOPE.md)
- [Spécification UX](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/02_UX_SPEC.md)
- [Garde-fous techniques](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md)
- [Critères d’acceptation](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/04_ACCEPTANCE.md)
- [Spécification playtest distribué](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md)
- [Arbitrages finaux](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md)
- [Rapport d’implémentation](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/IMPLEMENTATION_REPORT.md)

Le jalon est validé techniquement pour diffusion, mais son intégration dans `main` n’est pas automatique.

## Cœur vivant

Documentation partageable :

- [Cœur vivant et genèse canonique](../21_coeur_vivant_genese_canonique.md)
- [État agrégé de validation — 12 août 2026](../22_coeur_vivant_validation_2026-08-12.md)

L’implémentation exacte du laboratoire reste hors GitHub. Le dépôt publie les contrats et résultats agrégés utiles au développement.

## Tableau Réel

Le Gate 0 est validé et l’architecture autonome est retenue.

- [Index TA3](../real/README.md)
- [Spécification](../real/SPECIFICATION.md)
- [Plan d’exécution](../real/EXECUTION_PLAN.md)

TA3 ne doit pas dépendre du runtime ou de la base d’un PROTO éphémère.

## Documents structurants

- [Audit du développement et de l'architecture](AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Politique données/configuration](DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement jeu vidéo](GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l'UI](adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](adr/ADR-0002-DATA-DRIVEN-CONTENT.md)

## Règle de lecture

Les documents historiques restent conservés pour traçabilité. Lorsqu’ils sont contredits, l’ordre de priorité est :

1. état de pilotage courant ;
2. cahier du jalon concerné ;
3. ADR et règles d’architecture plus récents ;
4. état réel du code de la branche concernée.

Principe directeur : **architecture suffisamment propre pour évoluer sans refonte inutile, sans construire prématurément des systèmes non encore justifiés.**
