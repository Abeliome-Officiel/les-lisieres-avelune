# Documentation — Les Lisières d’Avelune

Cet index distingue les **principes de conception partageables**, les **jalons jouables**, le **Cœur vivant**, le **Tableau Réel**, les futures couches de représentation, les documents historiques et les informations propriétaires conservées hors dépôt.

## 1. État courant

- `v0.8` : ancien jalon historique.
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1.
- **PROTO-0.1** : jalon jouable intégré à `main`.
- **PROTO-0.2.2** : candidat de playtest distribué sur `develop/proto-0.2.2-playtest` ; son intégration dans `main` reste une décision explicite.
- **Cœur vivant / CŒUR-0** : chantier headless distinct, actuellement en campagne de diagnostic R2.10.
- **Tableau Réel (TA3)** : Gate 0 validé ; architecture persistante autonome retenue ; Phase B suivante.
- **Univers sonore** : direction de conception future cadrée ; aucun moteur audio choisi et aucun impact sur le PROTO courant.
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
- [Background](10_background_avelune.md)
- [Trame RPG](14_trame_rpg.md)
- [Passage et Lisière](15_lisiere_et_passage.md)
- [Univers sonore — contrat partageable](23_univers_sonore_contrat_public.md)

Lorsqu’un document historique contredit un référentiel plus récent, il reste une trace et non une source normative.

### Références de préproduction

- **[Manifeste de conception — Faire Monde](17_manifeste_faire_monde.md)**
- **[Système d'évolution du monde et des vagues — contrat expurgé](19_systeme_evolution_vague_v0.2.md)**
- **[Moteur de naissance des vagues — contrat expurgé](20_moteur_naissance_vagues_v0.1.md)**
- **[Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)**
- [Modèle évolutif de vague — notice historique](18_modele_vague_evolutive.md)

Les fonctions exactes, coefficients, seuils cachés, recettes de variabilité, causalités propriétaires et vérités narratives réservées ne sont pas des contenus GitHub. Cette frontière s’applique également aux futures recettes de traduction visuelle et sonore du Cœur.

GitHub conserve les contrats, interfaces, exigences, architecture, tests partageables et résultats de validation suffisamment agrégés.

## 3. Cœur vivant / genèse canonique

Le chantier est parallèle et indépendant du playtest PROTO-0.2.2.

Ordre de travail :

1. moteur headless autonome ;
2. persistance, journal causal et simulateur accéléré ;
3. campagnes longues et multi-seeds ;
4. observatoire analytique privé ;
5. contrat sémantique de représentation puis interpréteurs visuel et sonore indépendants ;
6. Orée et autres rendus seulement lorsque leurs prérequis sont stabilisés ;
7. validation de la pérennité, des migrations, des ressources et des modes dégradés ;
8. seulement après validation suffisante : instance canonique persistante.

Au 12 août, les diagnostics R2.6 à R2.9 ont isolé le problème de persistance précoce des lignées ; R2.10 mesure le goulot entre établissement, première propagation et exposition aux vagues. Les détails de recette et le code de laboratoire restent hors dépôt.

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
- [Assets GitHub](assets/README.md)
- [Brief visuel PROTO-0.2 / Gen3 corrigé](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)

Direction visuelle actuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**.

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
- séparation entre état canonique et représentations visuelle/sonore ;
- **le Cœur survit à la disparition ou au remplacement de ses représentations** ;
- technologies et formats choisis avec une voie de migration réaliste ;
- coût permanent et croissance des données mesurés ;
- dégradation gracieuse des fonctions non canoniques avant altération des lois ;
- matériel dimensionné et renouvelé à partir de mesures et de criticité ;
- séparation entre documentation partageable et informations propriétaires.
