# Documentation — Les Lisières d’Avelune

Cet index distingue les **principes et documents de conception**, les **jalons historiques**, le **PROTO-0.1 intégré à `main`**, le travail **PROTO-0.2 en revue/playtest** et le registre long terme **Futur du jeu**.

Le `v0.8` reste un repère historique. La dernière baseline de conception figée avant le PROTO-0.1 est `v0.8.3`, tandis que la conception courante est **v0.8.3+** et continue d’évoluer avec les discussions et playtests.

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

## 2. Futur du jeu — idées, hypothèses et développements

Le pool « Futur du jeu » n’est pas une roadmap : il conserve les idées avec leur degré d’engagement afin d’éviter à la fois la perte d’idées et leur transformation accidentelle en décisions.

- [Registre GitHub — Futur du jeu, mise à jour 2026-08-07](conception/05_futur_du_jeu_registre_2026-08-07.md)
- baseline archivistique Drive : `Avelune_Pool_idees_futur_jeu_v0.3.pdf`, **313 entrées** au 3 août 2026 ;
- le registre GitHub ajoute le delta des discussions des 6–7 août 2026 ;
- une section distincte contient les **idées extrapolées par ChatGPT**, explicitement marquées comme non validées.

Règle : **Retenu/Acté ≠ Piste ≠ Remisé ≠ Extrapolation assistant**. Une idée ne change de statut qu’après arbitrage explicite.

## 3. Identité et direction artistique

- [Charte graphique de travail](art/CHARTE_GRAPHIQUE.md)
- [Assets GitHub](assets/README.md)

Direction actuelle : **poétique · onirique · féerique · organique · minérale · florale-abstraite · queer**.

Le canon visuel provisoire interdit d’inventer humains/humanoïdes, habitants, faune ou espèces naturelles non définies.

## 4. PROTO-0.1 — baseline intégrée

Le PROTO-0.1 logiciel est intégré à `main`, qui reste la baseline stable du dépôt tant que PROTO-0.2 n’a pas été revu, poussé et intégré.

La branche `develop/proto-0.1-playable` reste utile pour la traçabilité historique.

Documentation :

- [Périmètre du prototype jouable](proto0/PROTO0_PLAYABLE_SCOPE.md)
- [Gate de playtest](proto0/PROTO0_PLAYTEST_READY.md)
- [Jalon lisibilité et temporalité](proto0/PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md)
- [Carnet de test](proto0/PROTO0_TEST_NOTEBOOK.md)
- [Rapport d'équilibrage automatisé](proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [Parcours technique de référence](proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

## 5. PROTO-0.2 — alpha en revue/playtest

Au 7 août 2026, un nouveau lot PROTO-0.2 a été cadré pour tester une boucle plus lisible et plus proche du modèle mental visé : plateau hexagonal, inventaire, stockage par bâtiments, fabrication, recherche, défense Affaiblissement et vagues à Puissance unique.

Le lot a été volontairement borné pour éviter la sur-architecture : **long run = finir et tester le périmètre, pas élargir le jeu**.

État de revue connu au moment de cette mise à jour documentaire :

- alpha jouable produite localement sur `develop/proto-0.2-ux-rules` ;
- architecture active simplifiée : page principale ramenée d’environ 3 495 lignes à environ 225 lignes, logique P02 isolée et tests ciblés ;
- première passe technique : check, tests, simulations et build annoncés verts par le run Codex initial ;
- playtest navigateur réel lancé sur une preview Docker séparée ;
- bug de bootstrap détecté (`Stock 15/0`) : kit et ressources de départ étaient comptés dans le stockage malgré une capacité nulle ;
- correctif local `2b1b76d31d6f6f936b56ab2fdad29f1baeae079c` : kit séparé, ressources d’amorçage hors stockage jusqu’à la première membrane, passage attendu `0/0 → 8/16`, actions normales verrouillées jusqu’à la fin du déploiement ;
- ce correctif doit encore être revalidé hors sandbox par les commandes de test/build et par un nouveau smoke/playtest navigateur avant intégration.

Documentation active du lot :

- [Index PROTO-0.2](development/proto0.2/README.md)
- [Charte](development/proto0.2/00_CHARTER.md)
- [Règles et périmètre](development/proto0.2/01_RULES_AND_SCOPE.md)
- [Spécification UX](development/proto0.2/02_UX_SPEC.md)
- [Garde-fous techniques](development/proto0.2/03_TECHNICAL_GUARDRAILS.md)
- [Critères d’acceptation](development/proto0.2/04_ACCEPTANCE.md)
- [Plan d’exécution](development/proto0.2/05_EXECUTION_PLAN.md)
- [Brief visuel Gen3 corrigé](development/proto0.2/06_VISUAL_BRIEF_GEN3.md)
- [Rapport d’implémentation](development/proto0.2/IMPLEMENTATION_REPORT.md)

**PROTO-0.2 n’est pas encore une nouvelle baseline stable tant que la revue humaine, les tests hors sandbox et l’intégration GitHub ne sont pas terminés.**

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

Les documents P0–P10 et `proto-0-spec.1` restent des références historiques de validation des moteurs. Lorsqu'ils divergent du périmètre jouable courant, les documents actifs du jalon testé et les décisions les plus récentes font foi.

## 7. Méthode, décisions et outils

- [Outils](08_outils_et_wiki.md)
- [Sources](09_sources.md)
- [Décisions ouvertes](11_decisions_a_valider.md)
- [Préparation des progressions](12_preparation_arbres.md)
- [Index de conception post-v0.8](conception/00_index.md)

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
- direction visuelle onirique, féerique, organique et minérale sans inventer les populations ou espèces non définies ;
- sobriété de scope : un prototype doit valider la boucle et l’expérience, pas préconstruire tous les systèmes futurs.
