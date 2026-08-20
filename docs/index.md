# Documentation — Les Lisières d’Avelune

Cet index distingue les **référentiels partageables actuels**, les modules durables, le **Cœur vivant**, le **Tableau Réel**, les représentations et les **jalons historiques**.

## 1. État courant — 20 août 2026

- **PROTO-0 / 0.1 / 0.2 / 0.2.2** : **CLOS / HISTORIQUE**. Aucun nouveau développement, playtest structurant ou retrofit de production. Les branches et documents restent des preuves historiques jusqu’au nettoyage GitHub.
- **Cœur vivant / CŒUR-0** : qualification biologique suffisamment close ; qualification opérationnelle prioritaire en cours. Aucun travail documentaire ou module aval ne doit perturber le runtime actif.
- **P1 — Lecteur du Cœur** : baseline offline qualifiée ; convergence avec P5A et P5B qualifiée ; live bloqué par les gates autoritatives/opérationnelles prévues.
- **P2 — Observabilité** : OBS-0 offline qualifié et gelé.
- **P3 — Orchestrateur** : ORCH-0 offline qualifié et gelé.
- **P4 — Tableaux Monde / Univers** : baseline offline qualifiée et gelée.
- **P5A — Visuel** : baseline offline qualifiée ; convergence P1 qualifiée.
- **P5B — Musique / Sonore** : baseline offline globale qualifiée ; convergence P1 qualifiée.
- **P6 — Fenêtre sur les Avelunes** : P6-0 OFFLINE = PASS ; phase suivante en attente du verdict du protocole Cœur en cours.
- **Tableau Réel (TA3)** : autonome du PROTO ; surfaces publique et privée séparées ; écritures privées toujours soumises à leurs gates de sécurité.
- **GitHub / sécurité** : purge de l’ancien historique sensible close ; hygiène des branches/PR et protection de `main` encore ouvertes.

Les métriques sensibles, seeds, paramètres, recettes, causalités détaillées, CODEX, credentials et détails d’exploitation réservés restent hors dépôt.

Lorsqu’un document historique contredit un référentiel plus récent, il reste une trace et non une source normative.

---

## 2. Entrées principales

- [README du projet](../README.md)
- [Roadmap actuelle](../ROADMAP.md)
- [Manifeste du dépôt](../MANIFEST.md)
- [Changelog](../CHANGELOG.md)
- [Clôture définitive du PROTO](development/PROTO_CLOSURE_2026-08-20.md)

---

## 3. Comprendre le jeu

- [Vision actuelle](00_vision.md)
- [Corps-cité](01_concept_corps_cite.md)
- [Monde persistant](02_monde_persistant.md)
- [Tycoon–Factorio](03_tycoon_et_reseaux.md)
- [Vagues, météo et Échos](04_evenements_et_donnees_reelles.md)
- [Social et communication](05_social_et_communication.md)
- [Accessibilité, éthique et inclusivité](06_accessibilite_ethique.md)
- [Sources et inspirations](09_sources.md)
- [Background](10_background_avelune.md)
- [Trame RPG](14_trame_rpg.md)
- [Passage et Lisière](15_lisiere_et_passage.md)

---

## 4. Cœur vivant et genèse canonique

Références partageables :

- [Manifeste de conception — Faire Monde](17_manifeste_faire_monde.md)
- [Système d’évolution du monde et des vagues — contrat expurgé](19_systeme_evolution_vague_v0.2.md)
- [Moteur de naissance des vagues — contrat expurgé](20_moteur_naissance_vagues_v0.1.md)
- [Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)
- [État agrégé historique de validation](22_coeur_vivant_validation_2026-08-12.md)
- [Références scientifiques et méthode](25_coeur_vivant_references_methode.md)
- [Synthèse trans-échelles](28_coeur_vivant_synthese_trans_echelles.md)
- [Gate de suffisance et limite de recherche](29_coeur_vivant_gate_suffisance.md)
- [Perturbations, sélection et transmission](30_coeur_vivant_selection_perturbations.md)
- [Temporalité canonique et genèse](31_temporalite_canonique_genese.md)
- [Contrat de lecture des modules](32_coeur_contrat_lecture_modules.md)
- [Multi-monde, capacité et Tableau Univers](33_multi_monde_capacite_et_tableau_univers.md)
- [WorldReadEnvelope v0.1 — schéma](contracts/world-read-envelope-v0.1.schema.json)
- [Avelune Semantic Replay v0.1](contracts/avelune-semantic-replay-v0.1.md)

### Frontière durable

```text
Cœur / état privé d’une instance
        ↓
P1 — Lecteur / normalisation privée
        ↓
WorldReadEnvelope minimal
        ↓
projections allowlistées spécialisées
        ├─ VisualPayload
        ├─ MusicPayload
        └─ autres projections autorisées
```

Un consommateur ne lit pas directement les structures privées du Cœur. Fixtures, replays et sources live doivent pouvoir présenter la même sémantique contractuelle. Pour la v1.0, cette frontière reste en lecture seule vis-à-vis de la biologie.

---

## 5. Modules autour du Cœur

### P1 — Lecteur

Autorité partageable : [Contrat de lecture des modules](32_coeur_contrat_lecture_modules.md) et les contrats `docs/contracts/`.

P1 possède la continuité de publication, la resynchronisation et la frontière entre le Cœur privé et les projections aval.

### P2 — Observabilité

Observabilité non autoritative : métriques, santé, fraîcheur, incidents et rétention sans action sur le canon.

### P3 — Orchestrateur

Control plane séparé : cycle de vie des instances, opérations idempotentes, placement et garde-fous. Il ne devient pas autorité biologique.

### P4 — Tableaux Monde / Univers

Vues opérateur construites à partir de P1/P2/P3 ; aucune lecture directe du Cœur.

### P5A — Visuel

- [Visuel du Cœur — contrat partageable](24_visuel_coeur_contrat_public.md)

Le visuel est une projection aval, renderer-neutral et non autoritative.

### P5B — Musique / Sonore

- [Univers sonore — contrat partageable](23_univers_sonore_contrat_public.md)
- [Références et méthode](26_univers_sonore_references_methode.md)
- [Cahier d’intégration MUSIQUE-0](27_musique0_cahier_integration.md)
- `lab/musique0/` pour les éléments partageables présents sur `main`.

Le sonore interprète le monde sans modifier son canon. Les thèmes et préférences restent présentationnels.

### P6 — Fenêtre sur les Avelunes

P6 assemble P1 + P5A + P5B dans un produit contemplatif permanent. P6-0 est qualifié offline ; le live attend les gates Cœur/P1 prévues.

---

## 6. Multi-monde et exploitation

Voir [Multi-monde, capacité et Tableau Univers](33_multi_monde_capacite_et_tableau_univers.md).

Principes visibles :

- une Avelune possède une identité stable indépendante de son host ;
- plusieurs instances canoniques autonomes peuvent exister ;
- leurs états, histoires, sauvegardes, caches et flux ne se mélangent pas ;
- un Corcite appartient à une seule instance ;
- la croissance de fréquentation peut déclencher une décision d’ouvrir un nouveau monde, jamais accélérer ou ralentir la biologie d’un monde existant ;
- la migration d’une instance entre hôtes doit conserver son identité.

---

## 7. Tableau Réel

Le Tableau Réel suit le **projet réel** sans se confondre avec le monde de jeu ni avec le Tableau Univers.

- [Index TA3](real/README.md)
- [Spécification fonctionnelle et architecture](real/SPECIFICATION.md)
- [Plan d’exécution](real/EXECUTION_PLAN.md)
- [Source énergie AvLab — télémétrie locale](real/AVLAB_POWER_TELEMETRY.md)

TA3 dispose de son propre stockage et runtime persistants. Le PROTO n’est plus une source structurante et son extinction ne doit pas affecter TA3.

---

## 8. PROTO — archive historique

**Statut : CLOS / HISTORIQUE depuis le 20 août 2026.**

Référence de clôture : [PROTO_CLOSURE_2026-08-20.md](development/PROTO_CLOSURE_2026-08-20.md).

Documents historiques conservés :

- [Périmètre PROTO-0.1](proto0/PROTO0_PLAYABLE_SCOPE.md)
- [Gate de playtest PROTO-0.1](proto0/PROTO0_PLAYTEST_READY.md)
- [Lisibilité et temporalité](proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md)
- [Carnet de test](proto0/PROTO0_TEST_NOTEBOOK.md)
- [Rapport d’équilibrage](proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [Parcours technique de référence](proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

Les branches `develop/proto-*`, `automation/proto02-*`, `codex/proto02-bootstrap` et documents associés sont à considérer comme historiques jusqu’à leur classification dans le nettoyage GitHub. Leur présence ne constitue pas une roadmap.

---

## 9. Architecture, développement et gouvernance

- [Index développement](development/README.md)
- [État historique au 12 août](development/PROJECT_STATUS_2026-08-12.md)
- [Audit développement et architecture](development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Arbitrage transversal — pérennité, ressources et matériel](development/ARBITRATION_LONGEVITY_AND_RESOURCES.md)
- [Politique données/configuration](development/DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement](development/GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l’UI](development/adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](development/adr/ADR-0002-DATA-DRIVEN-CONTENT.md)
- [ADR-0003 — Cœur indépendant de ses représentations](development/adr/ADR-0003-CORE-REPRESENTATION-INDEPENDENCE.md)

Le nettoyage de l’ancien historique sensible GitHub est clos. Les anciennes copies pré-purge doivent être contrôlées avant réutilisation. L’hygiène courante du dépôt — branches, PR draft, protection de `main`, CI et sécurité GitHub — reste un chantier de gouvernance distinct.

---

## 10. Identité et direction artistique

- [Charte graphique de travail](art/CHARTE_GRAPHIQUE.md)
- [Univers sonore](23_univers_sonore_contrat_public.md)
- [Visuel du Cœur](24_visuel_coeur_contrat_public.md)
- [Assets GitHub](assets/README.md)

Direction visuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**.

Direction visuelle et sonore du vivant : **satisfaisante · contemplative · onirique · féerique**.

---

## 11. Frontière de publication

GitHub contient le **code et la documentation partageables**.

Ne pas y publier :

- secrets techniques ou credentials ;
- clés privées ou recovery codes ;
- seeds privées ;
- recettes propriétaires du Cœur ;
- paramètres et causalités détaillés réservés ;
- CODEX ou inventaires de secrets ;
- dumps bruts d’un runtime privé présentés comme documentation.

Le dépôt privé reste traité comme une surface de publication. Une donnée privée ou propriétaire ne devient pas partageable parce que le dépôt exige une authentification.
