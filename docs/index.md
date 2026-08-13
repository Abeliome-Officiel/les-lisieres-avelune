# Documentation — Les Lisières d’Avelune

Cet index distingue les **principes de conception partageables**, les **jalons jouables**, le **Cœur vivant**, le **Tableau Réel**, les couches de représentation, les documents historiques et les informations propriétaires conservées hors dépôt.

## 1. État courant

- `v0.8` : ancien jalon historique.
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1.
- **PROTO-0.1** : jalon jouable intégré à `main`.
- **PROTO-0.2.2** : candidat de playtest distribué sur `develop/proto-0.2.2-playtest` ; son intégration dans `main` reste une décision explicite.
- **Cœur vivant / CŒUR-0** : chantier headless distinct, actuellement en campagne de diagnostic R2.10.
- **Tableau Réel (TA3)** : Gate 0 validé ; architecture persistante autonome retenue ; Phase B suivante.
- **Univers sonore / MUSIQUE-0** : préproduction v0.2 autorisée hors ligne sur enveloppe sémantique versionnée, fixtures neutres et replays autorisés ; aucun moteur audio choisi et aucune intégration live au Cœur actée.
- **Visuel du Cœur / LAB VISUEL** : cahier de préproduction v0.3 cadré ; développement anticipé autorisé uniquement via projection publique minimale et contrat sémantique versionné, sans dépendance durable aux internes du Cœur.
- **Arbitrage transversal** : doctrine de pérennité, ressources, données et matériel actée le 13 août 2026 ; ce cadre n’est pas un runtime supplémentaire.

État de pilotage détaillé : **[Avelune — état de développement au 12 août 2026](development/PROJECT_STATUS_2026-08-12.md)**.

Le nettoyage de l’ancien historique GitHub est **clos**. La synchronisation normale des contenus partageables est de nouveau autorisée. Les anciens clones/worktrees doivent être vérifiés avant réutilisation afin de ne pas réintroduire un historique antérieur.

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

### Références de préproduction

- **[Manifeste de conception — Faire Monde](17_manifeste_faire_monde.md)**
- **[Système d'évolution du monde et des vagues — contrat expurgé](19_systeme_evolution_vague_v0.2.md)**
- **[Moteur de naissance des vagues — contrat expurgé](20_moteur_naissance_vagues_v0.1.md)**
- **[Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)**
- **[Cœur vivant — références scientifiques et méthode](25_coeur_vivant_references_methode.md)**
- **[Cœur vivant — synthèse trans-échelles](28_coeur_vivant_synthese_trans_echelles.md)**
- **[Cœur vivant — gate de suffisance et limite de recherche](29_coeur_vivant_gate_suffisance.md)**
- **[Univers sonore — contrat partageable](23_univers_sonore_contrat_public.md)**
- **[Univers sonore — références et méthode MUSIQUE-0](26_univers_sonore_references_methode.md)**
- **[MUSIQUE-0 — intégration](27_musique0_cahier_integration.md)**
- **[Visuel du Cœur — contrat partageable](24_visuel_coeur_contrat_public.md)**
- [Modèle évolutif de vague — notice historique](18_modele_vague_evolutive.md)

Les contenus classés ne sont pas des contenus GitHub. La documentation partageable décrit uniquement les contrats, exigences, méthodes, références et résultats autorisés sans détailler l’organisation du savoir propriétaire.

GitHub conserve les contrats, interfaces, exigences, architecture, tests partageables, références extérieures et résultats de validation suffisamment agrégés.

## 3. Cœur vivant / genèse canonique

Le chantier est parallèle et indépendant du playtest PROTO-0.2.2.

Ordre de travail révisé :

1. moteur headless autonome ;
2. persistance, journal causal et simulateur accéléré ;
3. campagnes longues et multi-seeds ;
4. dès qu’un sous-ensemble sémantique est assez stable, projection publique minimale + contrat de représentation v0 + fixtures/replays ;
5. LAB VISUEL et/ou sonore isolé, derrière des adaptateurs de version, pendant que les diagnostics du Cœur continuent ;
6. Observatoire analytique privé et poursuite de la validation du Cœur ;
7. validation de la pérennité, des migrations, des ressources cumulées et des modes dégradés ;
8. Orée et autres rendus de production seulement lorsque leurs gates et le contrat sont suffisamment stabilisés ;
9. seulement après validation suffisante : instance canonique persistante.

Le principe anti-réécriture est obligatoire : **un interpréteur ne consomme pas durablement les structures internes d’une révision du Cœur**. Une évolution interne doit être absorbée autant que possible par l’adaptateur ou une migration explicite du contrat. Le protocole de transport, la grammaire et le renderer doivent pouvoir évoluer indépendamment lorsqu’ils ne changent pas la signification des données.

Au 12 août, les diagnostics R2.6 à R2.9 ont isolé le problème de persistance précoce des lignées ; R2.10 mesure le goulot entre établissement, première propagation et exposition aux vagues. Les détails de laboratoire restent hors dépôt.

La recherche du Cœur suit la même règle de traçabilité : sources extérieures, hypothèses Avelune, résultats internes et décisions actées sont distingués explicitement. Voir **[Cœur vivant — références scientifiques et méthode](25_coeur_vivant_references_methode.md)**.

La méthode de synthèse entre macro-vivant, micro-vivant et vivant imaginaire est formalisée dans **[Cœur vivant — synthèse trans-échelles](28_coeur_vivant_synthese_trans_echelles.md)**. La condition de sortie de recherche ouverte et la qualification de CŒUR-0 sont définies dans **[Cœur vivant — gate de suffisance et limite de recherche](29_coeur_vivant_gate_suffisance.md)**.

## 4. Tableau Réel

Le Tableau Réel suit le projet **réel** sans le confondre avec le monde de jeu.

- [Index TA3](real/README.md)
- [Spécification fonctionnelle et architecture](real/SPECIFICATION.md)
- [Plan d’exécution post-Gate 0](real/EXECUTION_PLAN.md)

Décision structurante : TA3 doit disposer de son propre stockage et runtime persistants. Les PROTO, instruments, saisies et futures sources de production s’y raccordent par des adaptateurs remplaçables.

## 5. PROTO-0.1 — baseline de `main`

Documents de référence :

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

Le jalon teste volontairement une boucle simplifiée et distribuable : implantation, économie, recherche, préparation défensive, vague, conséquences et adaptation. Les moteurs du Cœur vivant ne sont pas réinjectés automatiquement dans ce prototype.

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

Le visuel de préproduction privilégie une grammaire visuelle indépendante du renderer, la continuité d’identité à travers les transformations, la cohérence temporelle, une qualité adaptative sobre/normal/riche et un budget mesuré avec les autres charges du système.

MUSIQUE-0 privilégie une enveloppe sémantique neutre, des fixtures/replays indépendants de la source, une grammaire séparée du renderer et des gates explicites avant tout branchement live.

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
- séparation entre état canonique et représentations visuelle/sonore ;
- **le Cœur survit à la disparition ou au remplacement de ses représentations** ;
- **les interpréteurs anticipés consomment un contrat versionné, jamais les internes provisoires comme API durable** ;
- **les clients ne reçoivent que l’état sémantique autorisé nécessaire à leur rôle** ;
- protocole de transport distinct du contrat sémantique ;
- versions source/contrat/grammaire/renderer découplées ;
- technologies et formats choisis avec une voie de migration réaliste ;
- coût permanent et croissance des données mesurés ;
- budget visuel/sonore évalué avec le jeu et le Cœur, jamais isolément ;
- dégradation gracieuse des fonctions non canoniques avant altération des lois ;
- matériel dimensionné et renouvelé à partir de mesures et de criticité ;
- séparation entre documentation partageable et informations propriétaires ;
- **la confidentialité porte aussi sur la structure documentaire : ne pas cartographier un mécanisme réservé pour dire qu’il est secret** ;
- **références extérieures, hypothèses Avelune, résultats testés et décisions actées restent traçables et distincts**.
