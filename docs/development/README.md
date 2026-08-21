# Développement et architecture

Ce dossier regroupe la documentation technique, la méthode de développement, les ADR et les **snapshots datés** des chantiers Avelune.

## État courant

Point de référence général : **[Avelune — état du projet au 20 août 2026](PROJECT_STATUS_2026-08-20.md)**, complété par les clôtures datées du 21 août.

Les axes actifs doivent être lus séparément :

- **Cœur vivant / CŒUR-0** : O1 et P0-AUTH/O2/O3/O4 fermés ; prochaine gate CREAD-LIVE ;
- **P1–P6** : modules durables autour du Cœur, avec baselines offline qualifiées à différents niveaux ;
- **Tableau Réel (TA3)** : instrumentation persistante du projet réel ;
- **GitHub / sécurité** : gouvernance du dépôt, branches/PR, protections et CI.

Le **PROTO est clos et historique**. Il ne constitue plus un axe de développement.

`main` reste la baseline stable d’intégration du dépôt partageable.

## PROTO — archive

Référence normative de clôture : **[PROTO — clôture définitive du chantier](PROTO_CLOSURE_2026-08-20.md)**.

Les anciens cahiers PROTO, branches `develop/proto-*`, automations et rapports restent des sources historiques. Ils ne doivent pas être interprétés comme une invitation à poursuivre le playtest, moderniser le runtime ou aligner son architecture sur la production future.

Une expérience locale de durcissement des secrets a été testée mais non intégrée ; elle est abandonnée avec le prototype et ne constitue pas une dette active.

## Cœur vivant

Documentation partageable principale :

- [Clôture P0-AUTH / O2 / O3 / O4 — 21 août 2026](P0_AUTH_CLOSURE_2026-08-21.md)
- [Clôture PRE-P6 transverse — 21 août 2026](PRE_P6_TRANSVERSE_2026-08-21.md)
- [Cœur vivant et genèse canonique](../21_coeur_vivant_genese_canonique.md)
- [Références scientifiques et méthode](../25_coeur_vivant_references_methode.md)
- [Gate de suffisance](../29_coeur_vivant_gate_suffisance.md)
- [Temporalité canonique](../31_temporalite_canonique_genese.md)
- [Contrat de lecture des modules](../32_coeur_contrat_lecture_modules.md)
- [Multi-monde, capacité et Tableau Univers](../33_multi_monde_capacite_et_tableau_univers.md)

O1 est **PASS / CLOSED / FROZEN**. P0-AUTH, la neutralité biologique/RNG, O2 arrêt/reprise, O3 crash/atomicité et O4 sont également **PASS / CLOSED**. La politique qualifiée d’arrêt du Cœur est **PAUSE**. La prochaine gate est **CREAD-LIVE**, puis OBS-1/ORCH-1 selon dépendances et O5-MIGRATION avant la qualification live aval finale.

L’implémentation exacte, les seeds, paramètres, RNG, structures de persistance et causalités propriétaires restent hors GitHub. Le dépôt publie les contrats, méthodes autorisées et résultats suffisamment agrégés.

Le runtime actif ne doit pas être perturbé par les travaux documentaires ou les qualifications offline des modules aval.

## Modules durables

### P1 — Lecteur du Cœur

Baseline offline qualifiée ; frontière `WorldReadEnvelope` ; continuité et resynchronisation sous autorité P1 ; convergence P5A/P5B qualifiée offline. Les primitives P0 nécessaires sont désormais qualifiées ; **CREAD-LIVE** est la prochaine gate.

### P2 — Observabilité

OBS-0 offline qualifié et gelé ; observabilité non autoritative.

### P3 — Orchestrateur

ORCH-0 offline qualifié et gelé ; control plane séparé de l’autorité biologique.

### P4 — Tableaux Monde / Univers

Baseline offline qualifiée ; vues opérateur via P1/P2/P3.

### P5A — Visuel

[Contrat partageable](../24_visuel_coeur_contrat_public.md). Baseline offline qualifiée derrière P1.

### P5B — Musique / Sonore

- [Contrat partageable](../23_univers_sonore_contrat_public.md)
- [Références et méthode](../26_univers_sonore_references_methode.md)
- [Cahier d’intégration](../27_musique0_cahier_integration.md)

Baseline offline globale qualifiée derrière P1.

### P6 — Fenêtre sur les Avelunes

P6-0 offline qualifié. Le travail offline est autorisé, mais l’intégration live reste en attente de **CREAD-LIVE** ; aucun raccord direct opportuniste au runtime Cœur n’est autorisé.

## Tableau Réel

TA3 est autonome du PROTO.

- [Index TA3](../real/README.md)
- [Spécification](../real/SPECIFICATION.md)
- [Plan d’exécution](../real/EXECUTION_PLAN.md)

La surface publique est en lecture seule. Les écritures privées restent soumises aux gates d’authentification et de sécurité.

## GitHub et sécurité

Le nettoyage historique sensible est clos. Les références réécrites sont la source de vérité ; les anciens clones/worktrees issus du graphe antérieur doivent être contrôlés avant réutilisation.

L’hygiène courante reste ouverte : branches historiques, PR draft, `tmp-unused`, branche Sentinelle, protection de `main`, CI et automatisation sécurité.

GitHub reste une surface partageable même lorsque le dépôt est privé : aucun secret technique, clé privée, recovery code, seed privée, recette Cœur, RNG, détail de persistance propriétaire, causalité réservée ou CODEX ne doit y être publié.

## Documents structurants

- [Clôture P0-AUTH / O2 / O3 / O4 — 21 août 2026](P0_AUTH_CLOSURE_2026-08-21.md)
- [Clôture PRE-P6 transverse — 21 août 2026](PRE_P6_TRANSVERSE_2026-08-21.md)
- [Snapshot courant — 20 août 2026](PROJECT_STATUS_2026-08-20.md)
- [Clôture du PROTO](PROTO_CLOSURE_2026-08-20.md)
- [Snapshot historique — 12 août 2026](PROJECT_STATUS_2026-08-12.md)
- [Audit du développement et de l’architecture](AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Arbitrage transversal — pérennité, ressources et matériel](ARBITRATION_LONGEVITY_AND_RESOURCES.md)
- [Politique données/configuration](DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement jeu vidéo](GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l’UI](adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](adr/ADR-0002-DATA-DRIVEN-CONTENT.md)
- [ADR-0003 — Cœur indépendant de ses représentations](adr/ADR-0003-CORE-REPRESENTATION-INDEPENDENCE.md)

## Règle de lecture

Les documents historiques restent conservés pour traçabilité. Lorsqu’ils sont contredits, l’ordre de priorité est :

1. `README.md`, `ROADMAP.md` et `docs/index.md` ;
2. clôtures datées et snapshot de pilotage courant ;
3. contrats/ADR/règles plus récents ;
4. état réel du code ou de la branche concernée.

Un ancien document ou une ancienne branche ne rouvre jamais automatiquement un chantier fermé.
