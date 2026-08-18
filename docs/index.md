# Documentation — Les Lisières d’Avelune

Cet index distingue les **principes de conception partageables**, les **jalons jouables**, le **Cœur vivant**, le **Tableau Réel**, les couches de représentation, les documents historiques et les informations propriétaires conservées hors dépôt.

## 1. État courant — 18 août 2026

- `v0.8` : ancien jalon historique.
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1.
- **PROTO-0.1** : jalon jouable intégré à `main`.
- **PROTO-0.2.2** : candidat de playtest distribué sur `develop/proto-0.2.2-playtest` ; son intégration dans `main` reste une décision explicite.
- **Cœur vivant / CŒUR-0** : qualification biologique, temporelle et de largeur hors échantillon suffisamment close ; aucun prolongement biologique n’est ouvert. La gate active est désormais l’ingénierie du Cœur permanent et sa qualification opérationnelle.
- **Fenêtre sur la Lisière** : module contemplatif définitif ; premier consommateur de production privilégié du futur contrat de lecture ; elle reste présente lorsque le jeu complet existe et affiche un âge d’Avelune dérivé du temps canonique.
- **Tableau Réel (TA3)** : Gate 0 validé ; architecture persistante autonome retenue ; Phase B suivante.
- **Univers sonore / MUSIQUE-0** : préproduction autorisée hors ligne sur contrat versionné, fixtures et replays ; aucun moteur audio n’est imposé au Cœur.
- **Visuel du Cœur / LAB VISUEL** : développement anticipé autorisé derrière une projection sémantique versionnée ; aucune dépendance durable aux internes du Cœur.
- **Arbitrage transversal** : pérennité, réversibilité, ressources, données et matériel restent des contraintes de système, pas un runtime supplémentaire.

Le nettoyage de l’ancien historique GitHub est **clos**. La synchronisation normale des contenus partageables est autorisée, sous réserve de contrôler les anciens clones/worktrees avant réutilisation.

Les métriques, seeds, paramètres, recettes, causalités détaillées et autres éléments classés du Cœur restent hors dépôt.

## 2. Comprendre le jeu

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
- [Univers sonore — contrat partageable](23_univers_sonore_contrat_public.md)
- [Univers sonore — références et méthode MUSIQUE-0](26_univers_sonore_references_methode.md)
- [MUSIQUE-0 — cahier des charges d’intégration](27_musique0_cahier_integration.md)
- [Visuel du Cœur — contrat partageable](24_visuel_coeur_contrat_public.md)

Lorsqu’un document historique contredit un référentiel plus récent, il reste une trace et non une source normative.

## 3. Cœur vivant / genèse canonique

Références partageables :

- **[Manifeste de conception — Faire Monde](17_manifeste_faire_monde.md)**
- **[Système d'évolution du monde et des vagues — contrat expurgé](19_systeme_evolution_vague_v0.2.md)**
- **[Moteur de naissance des vagues — contrat expurgé](20_moteur_naissance_vagues_v0.1.md)**
- **[Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)**
- **[Cœur vivant — références scientifiques et méthode](25_coeur_vivant_references_methode.md)**
- **[Cœur vivant — synthèse trans-échelles](28_coeur_vivant_synthese_trans_echelles.md)**
- **[Cœur vivant — gate de suffisance et limite de recherche](29_coeur_vivant_gate_suffisance.md)**
- **[Cœur vivant — perturbations, sélection et transmission](30_coeur_vivant_selection_perturbations.md)**
- **[Temporalité canonique et genèse](31_temporalite_canonique_genese.md)**
- **[Cœur vivant — contrat de lecture des modules](32_coeur_contrat_lecture_modules.md)**
- [Modèle évolutif de vague — notice historique](18_modele_vague_evolutive.md)

### État scientifique

Les campagnes successives ont qualifié le cycle précoce des lignées, le rôle des perturbations, la transmission générationnelle, la tenue à temps long et la largeur hors échantillon. Les campagnes indépendantes récentes ne font pas apparaître de nouvelle classe de fragilité structurelle nécessitant une correction biologique.

La recherche biologique ouverte est donc **suffisamment close** au sens de la gate de suffisance durable. Cette formule ne signifie ni modèle parfait, ni stationnarité mathématique démontrée, ni impossibilité d’un événement écologique extrême.

Un nouveau chantier biologique ne sera ouvert qu’en présence d’une régression, d’une anomalie ou d’une question causale nouvelle et explicite.

### Gate active

L’ordre de travail devient :

1. persistance et snapshots de production ;
2. arrêt, reprise, restauration, crash-consistency et absence de deuxième histoire ;
3. migrations/versionnement et croissance maîtrisée des données ;
4. politique de panne et éventuel rattrapage du temps ;
5. qualification du coût permanent et fonctionnement continu réel ;
6. fixation de l’interface temporelle / horloge canonique ;
7. stabilisation du contrat de lecture ;
8. branchement de la Fenêtre sur la Lisière ;
9. autres modules aval et poursuite du jeu v1.0.

### Identité des mondes et modules

Plusieurs instances de laboratoire peuvent exister. À version, configuration, état initial, seed et entrées identiques, elles doivent être reproductibles ; des seeds ou entrées différentes permettent normalement des histoires distinctes. Une seule instance peut porter l’identité d’**Avelune canonique**.

Le principe anti-réécriture reste obligatoire : **un client ne consomme pas durablement les structures internes du Cœur**.

Architecture générale :

```text
Cœur / état privé
        ↓
adaptateur de version
        ↓
projection sémantique autorisée
        ↓
contrat de lecture versionné
        ↓
transport remplaçable
        ↓
Fenêtre / visuel / sonore / Tableaux / panneaux / jeu
```

Fixtures, replays et instance active doivent pouvoir présenter le même contrat. Une panne d’un client ne doit pas arrêter un Cœur sain. Pour la v1.0, cette frontière est en lecture seule vis-à-vis de la biologie.

## 4. Tableau Réel

Le Tableau Réel suit le projet **réel** sans le confondre avec le monde de jeu.

- [Index TA3](real/README.md)
- [Spécification fonctionnelle et architecture](real/SPECIFICATION.md)
- [Plan d’exécution post-Gate 0](real/EXECUTION_PLAN.md)
- [Source énergie AvLab — télémétrie locale](real/AVLAB_POWER_TELEMETRY.md)

Décision structurante : TA3 dispose de son propre stockage et runtime persistants. Les PROTO, instruments, saisies et futures sources de production s’y raccordent par des adaptateurs remplaçables.

## 5. PROTO-0.1 — baseline de `main`

- [Périmètre du prototype jouable](proto0/PROTO0_PLAYABLE_SCOPE.md)
- [Gate de playtest](proto0/PROTO0_PLAYTEST_READY.md)
- [Jalon lisibilité et temporalité](proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md)
- [Carnet de test](proto0/PROTO0_TEST_NOTEBOOK.md)
- [Rapport d'équilibrage automatisé](proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [Parcours technique de référence](proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

Les documents P0–P10 restent historiques.

## 6. PROTO-0.2.2 — candidat distribué

Branche : [`develop/proto-0.2.2-playtest`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest)

Cahier : [`docs/development/proto0.2`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest/docs/development/proto0.2)

Le jalon teste volontairement une boucle simplifiée et distribuable. Les moteurs du Cœur vivant ne sont pas réinjectés automatiquement dans ce prototype. Son tour par tour reste propre au prototype ; les développements ultérieurs visent un monde et un gameplay continus et asynchrones.

## 7. Architecture et méthode

- [Index développement](development/README.md)
- [État du projet — 12 août 2026](development/PROJECT_STATUS_2026-08-12.md)
- [Audit développement et architecture — 2026-08-06](development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- **[Arbitrage transversal — pérennité, ressources et matériel](development/ARBITRATION_LONGEVITY_AND_RESOURCES.md)**
- [Politique données/configuration](development/DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement](development/GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l'UI](development/adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](development/adr/ADR-0002-DATA-DRIVEN-CONTENT.md)
- **[ADR-0003 — Cœur indépendant de ses représentations](development/adr/ADR-0003-CORE-REPRESENTATION-INDEPENDENCE.md)**

## 8. Identité et direction artistique

- [Charte graphique de travail](art/CHARTE_GRAPHIQUE.md)
- [Univers sonore — contrat partageable](23_univers_sonore_contrat_public.md)
- [Univers sonore — références et méthode](26_univers_sonore_references_methode.md)
- [MUSIQUE-0 — intégration](27_musique0_cahier_integration.md)
- [Visuel du Cœur — contrat partageable](24_visuel_coeur_contrat_public.md)
- [Assets GitHub](assets/README.md)
- [Brief visuel PROTO-0.2 / Gen3 corrigé](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)

Direction visuelle actuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**, avec pour la représentation vivante une recherche **satisfaisante · contemplative · onirique · féerique**.

Direction sonore initiale : **satisfaisante · contemplative · onirique · féerique**.

## 9. Historique

- [Mini-prototype historique](07_prototype_mvp.md)
- [Prototype logiciel minimal historique](16_proto_minimal.md)
- [Socle mécanique v0.8](13_socle_mecanique_v0.8.md)

Ces fichiers restent utiles pour la traçabilité mais ne reprennent pas autorité sur les référentiels plus récents.

## 10. Principes à garder visibles

- monde partagé unique ;
- coopération directe facultative ;
- progression principalement horizontale ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO/micro-dopamine comme moteur de rétention ;
- plusieurs styles et profondeurs de jeu légitimes ;
- accessibilité intégrée ;
- identité queer et non genrée ;
- monde autonome même sans joueur ;
- séparation entre prototype jouable, Cœur vivant et Tableau Réel ;
- séparation entre état canonique et représentations ;
- **robustesse ne signifie ni immobilité ni immortalité** ;
- **le Cœur survit à la disparition ou au remplacement de ses représentations** ;
- **les interpréteurs consomment un contrat versionné, jamais les internes comme API durable** ;
- **les clients ne reçoivent que l’état sémantique autorisé nécessaire à leur rôle** ;
- protocole de transport distinct du contrat sémantique ;
- versions source/contrat/grammaire/renderer découplées ;
- technologies et formats choisis avec une voie de migration réaliste ;
- coût permanent et croissance des données mesurés ;
- budget visuel/sonore évalué avec le jeu et le Cœur, jamais isolément ;
- dégradation gracieuse des fonctions non canoniques avant altération des lois ;
- observabilité et capacité d’action restent des responsabilités distinctes ;
- séparation entre documentation partageable et informations propriétaires ;
- **la confidentialité porte aussi sur la structure documentaire : ne pas cartographier un mécanisme réservé pour dire qu’il est secret** ;
- **références extérieures, hypothèses Avelune, résultats testés et décisions actées restent traçables et distincts**.
