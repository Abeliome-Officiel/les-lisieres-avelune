# Documentation — Les Lisières d’Avelune

Cet index distingue les **principes de conception partageables**, les **jalons jouables**, le **chantier du Cœur vivant**, les **documents historiques** et les éléments dont la recette détaillée est classée **Cœur d’Avelune** hors dépôt.

## 1. Repères de version

- `v0.8` : ancien jalon historique.
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1.
- **PROTO-0.1** : jalon jouable intégré à `main`.
- **PROTO-0.2.2** : candidat de playtest distribué sur `develop/proto-0.2.2-playtest` ; il n’est pas automatiquement la nouvelle baseline de `main`.
- **Cœur vivant / genèse canonique** : chantier moteur distinct des prototypes jouables ; il ne porte pas de numéro de version de jeu.

Le projet ne doit pas être présenté comme ayant déjà atteint une version stable arbitraire telle que `v0.9`.

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

Ces documents portent la vision large du jeu. Lorsqu’un document historique contient une ancienne interprétation aujourd’hui classée Cœur d’Avelune ou contredit un référentiel plus récent, il ne doit pas être utilisé comme source normative.

### Références de préproduction actuelles

- **[Manifeste de conception — Faire Monde](17_manifeste_faire_monde.md)** — cadre normatif de production, expurgé des motivations cosmologiques et recettes propriétaires.
- **[Système d'évolution du monde et des vagues — contrat expurgé](19_systeme_evolution_vague_v0.2.md)** — interfaces, garanties de comportement, observabilité et confidentialité.
- **[Moteur de naissance des vagues — contrat expurgé](20_moteur_naissance_vagues_v0.1.md)** — interface de cadence, observabilité et confidentialité.
- **[Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)** — cahier public du moteur autonome, du substrat persistant, de la validation headless et de la future Orée contemplative.
- [Modèle évolutif de vague — notice historique expurgée](18_modele_vague_evolutive.md) — trace historique sans recette exploitable.

Le dépôt ne doit plus contenir les fonctions exactes, coefficients, seuils, graphes cachés, causalités propriétaires, recettes de variabilité ou vérités narratives réservées constituant le **Cœur d’Avelune**.

GitHub conserve ce qui est nécessaire au développement partagé : contrats, interfaces, exigences, architecture de persistance, télémétrie autorisée, tests et résultats de validation suffisamment agrégés.

**Historique :** certains anciens commits ont contenu des modèles exploratoires plus détaillés. Leur retrait de la branche courante ne purge pas les objets Git historiques ; une réécriture contrôlée de l’historique est un chantier distinct.

## 3. Cœur vivant / genèse canonique

Le chantier est **parallèle et indépendant** du playtest PROTO-0.2.2.

Ordre de travail :

1. moteur headless autonome ;
2. persistance, journal causal et simulateur accéléré ;
3. campagnes longues et multi-seeds ;
4. observatoire analytique privé ;
5. traduction visuelle sémantique et Orée ;
6. seulement après validation suffisante : lancement d’une instance canonique persistante.

L’instance canonique pourra vivre pendant une durée indéterminée avant l’arrivée des joueurs puis continuer dans le jeu produit. Le rendu graphique est volontairement découplé du Cœur afin de pouvoir évoluer ou être remplacé ultérieurement.

Le port hôte réservé pour l’éventuel Observatoire HTTP est `8091`. Aucun service web n’est requis pour le premier moteur headless.

## 4. Identité et direction artistique

- [Charte graphique de travail](art/CHARTE_GRAPHIQUE.md)
- [Assets GitHub](assets/README.md)
- [Brief visuel PROTO-0.2 / Gen3 corrigé](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2.2-playtest/docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)

Direction actuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**.

Pour PROTO-0.2, la composition Gen3 sert uniquement de référence ergonomique. Le Corcite doit rester non anthropomorphe ; éviter humains/humanoïdes, fantasy médiévale générique et esthétique industrielle sci-fi générique.

La future **Orée** ne doit pas figer cette direction artistique dans les moteurs : état canonique, traduction sémantique et rendu sont trois couches distinctes.

## 5. PROTO-0.1 — baseline de `main`

PROTO-0.1 reste le jalon logiciel intégré à `main` tant qu’une intégration plus récente n’est pas explicitement effectuée.

Documentation :

- [Périmètre du prototype jouable](proto0/PROTO0_PLAYABLE_SCOPE.md)
- [Gate de playtest](proto0/PROTO0_PLAYTEST_READY.md)
- [Jalon lisibilité et temporalité](proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md)
- [Carnet de test](proto0/PROTO0_TEST_NOTEBOOK.md)
- [Rapport d'équilibrage automatisé](proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [Parcours technique de référence](proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

Les documents historiques P0–P10 et `proto-0-spec.1` restent utiles pour la traçabilité, mais ne doivent pas être pris comme photographie exacte d’un jalon plus récent.

## 6. PROTO-0.2.2 — candidat de playtest distribué

Branche : [`develop/proto-0.2.2-playtest`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest)

Dossier de travail : [`docs/development/proto0.2`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest/docs/development/proto0.2)

Ce jalon valide volontairement une boucle simplifiée :

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

Simplifications volontaires : plateau hexagonal concret, stockage par bâtiments, recherche courte, une famille défensive active et une vague réduite à une Puissance unique. Les moteurs du Cœur vivant ne doivent pas être réinjectés dans ce playtest sans décision explicite de périmètre.

## 7. Architecture et méthode

- [Index développement](development/README.md)
- [Audit développement et architecture — 2026-08-06](development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Politique données/configuration](development/DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement jeu vidéo](development/GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l'UI](development/adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](development/adr/ADR-0002-DATA-DRIVEN-CONTENT.md)

## 8. Documents historiques

- [Mini-prototype historique](07_prototype_mvp.md)
- [Prototype logiciel minimal historique](16_proto_minimal.md)
- [Socle mécanique v0.8](13_socle_mecanique_v0.8.md)

Ces fichiers sont conservés pour la traçabilité. Ils ne reprennent pas autorité sur un référentiel plus récent.

## 9. Principes à garder visibles

- monde partagé unique ;
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
- direction visuelle onirique, féerique, organique et minérale ;
- monde autonome même sans joueur ;
- séparation stricte entre documentation de production et Cœur d’Avelune ;
- séparation stricte entre état canonique et représentation graphique.
