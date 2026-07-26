# Les Lisières d’Avelune — conception v0.7

Dépôt de conception et de développement du jeu navigateur coopératif **Les Lisières d’Avelune**.

Le projet est actuellement en phase de validation des décisions structurantes, avant la construction des arbres technologiques, des arbres d’évolution et des cartes d’interactions nécessaires au prototype.

## À examiner en priorité

Dans le classeur de pilotage :

1. ouvrir l’onglet **Arbitrages prioritaires** ;
2. renseigner la colonne **Validation utilisateur** ;
3. préciser les décisions ou commentaires nécessaires ;
4. poursuivre avec l’onglet **Décisions**.

La v0.7 consolide notamment :

- la carte du monde en cases hexagonales ;
- le fonctionnement temporaire des symbioses ;
- la distinction entre décisions retenues, simplifiées, reportées et rejetées ;
- la préparation des arbres et des cartes de dépendances avant le code.

## Book de conception

- [Lire le book complet en Markdown](docs/book/BOOK_Les_Lisieres_Avelune.md)
- [Consulter le book complet en PDF](docs/book/BOOK_Les_Lisieres_Avelune.pdf)
- [Télécharger le classeur de pilotage](design-data/Avelune_Design_Book.xlsx)

## Documents principaux

- [Vision du jeu](docs/00_vision.md)
- [Concept du personnage-corps-cité](docs/01_concept_corps_cite.md)
- [Monde persistant](docs/02_monde_persistant.md)
- [Tycoon, production et réseaux](docs/03_tycoon_et_reseaux.md)
- [Événements et données planétaires](docs/04_evenements_et_donnees_reelles.md)
- [Organisation sociale et communication](docs/05_social_et_communication.md)
- [Accessibilité et éthique](docs/06_accessibilite_ethique.md)
- [Prototype minimal](docs/07_prototype_mvp.md)
- [Outils documentaires et wiki](docs/08_outils_et_wiki.md)
- [Sources documentaires](docs/09_sources.md)
- [Background d’Avelune](docs/10_background_avelune.md)
- [Décisions à valider](docs/11_decisions_a_valider.md)
- [Préparation des arbres](docs/12_preparation_arbres.md)

## Pilotage du projet

- [Feuille de route](ROADMAP.md)
- [Journal consolidé des décisions](logs/JOURNAL_DECISIONS_COMPLET.md)
- [Journal de conception](logs/LOG_CONCEPTION.md)
- [Historique documentaire](CHANGELOG.md)
- [Manifeste des fichiers](MANIFEST.md)

Les données de conception sont disponibles sous des formats ouverts :

- `csv/` : tableaux exportés individuellement ;
- `data/design_data.json` : données structurées ;
- `docs/` : documentation Markdown ;
- `design-data/` : classeur de consultation et de pilotage.

## Source de vérité

Les fichiers Markdown, CSV et JSON suivis dans Git constituent la source documentaire durable.

Le classeur Excel sert d’interface de consultation et de pilotage. Les modifications importantes validées dans le classeur doivent ensuite être reportées dans les fichiers structurés du dépôt.

Les versions historiques sont identifiées par les tags Git `v0.4`, `v0.5`, `v0.6`, `v0.7`, etc. Les archives complètes restent conservées séparément sur le serveur.

## Statuts décisionnels

- **Décision définitive** : principe confirmé à préserver sauf remise en cause explicite.
- **Décision provisoire** : direction forte à tester ou à préciser.
- **Décision reportée** : idée conservée hors du périmètre actuel.
- **Décision rejetée** : proposition explicitement écartée de la version courante.
- **À décider** : arbitrage encore nécessaire.

## Ordre de lecture recommandé

1. le [book complet](docs/book/BOOK_Les_Lisieres_Avelune.md) ;
2. les [décisions à valider](docs/11_decisions_a_valider.md) ;
3. la [vision](docs/00_vision.md) ;
4. le [concept du corps-cité](docs/01_concept_corps_cite.md) ;
5. le [monde persistant](docs/02_monde_persistant.md) ;
6. le [tycoon et les réseaux](docs/03_tycoon_et_reseaux.md) ;
7. le [prototype minimal](docs/07_prototype_mvp.md) ;
8. la [préparation des arbres](docs/12_preparation_arbres.md) ;
9. le classeur de pilotage.

## État actuel

Le dépôt est privé. Aucun code jouable n’est encore présent.

La prochaine étape consiste à examiner et valider les arbitrages de la v0.7 avant de produire les arbres technologiques, les arbres d’évolution et les cartes d’interactions.
