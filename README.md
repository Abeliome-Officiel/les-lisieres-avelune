# Les Lisières d’Avelune — conception v0.4

Dépôt de conception et de développement du jeu navigateur coopératif **Les Lisières d’Avelune**.

Le projet est actuellement en phase de cadrage fonctionnel et de conception du prototype algorithmique.

## Book de conception

- [Lire le book complet en Markdown](docs/book/BOOK_Les_Lisieres_Avelune_v0.4.md)
- [Consulter le book complet en PDF](docs/book/BOOK_Les_Lisieres_Avelune_v0.4.pdf)
- [Télécharger le classeur de pilotage](design-data/Avelune_Design_Book_v0.4.xlsx)

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

## Pilotage du projet

- [Feuille de route](ROADMAP.md)
- [Journal consolidé des décisions](logs/JOURNAL_DECISIONS_COMPLET.md)
- [Historique documentaire](CHANGELOG.md)
- [Manifeste des fichiers](MANIFEST.md)

Les données de conception sont également disponibles sous des formats ouverts :

- `csv/` : tableaux exportés individuellement ;
- `data/design_data.json` : données structurées ;
- `docs/` : documentation Markdown ;
- `design-data/` : classeur de travail.

## Source de vérité

Les fichiers Markdown, CSV et JSON suivis dans Git constituent la source documentaire durable.

Le classeur Excel sert d’interface de consultation et de pilotage. Les modifications importantes réalisées dans le classeur devront ensuite être reportées dans les fichiers structurés du dépôt.

## Statuts décisionnels

- **Décision définitive** : principe confirmé à préserver sauf remise en cause explicite.
- **Décision provisoire** : direction forte à tester ou à préciser.
- **Décision reportée** : idée conservée hors du périmètre actuel.

## Ordre de lecture recommandé

1. le [book complet](docs/book/BOOK_Les_Lisieres_Avelune_v0.4.md) ;
2. la [vision](docs/00_vision.md) ;
3. le [concept du corps-cité](docs/01_concept_corps_cite.md) ;
4. le [monde persistant](docs/02_monde_persistant.md) ;
5. le [tycoon et les réseaux](docs/03_tycoon_et_reseaux.md) ;
6. le [prototype minimal](docs/07_prototype_mvp.md) ;
7. le classeur de pilotage.

## État actuel

Le dépôt est privé. Aucun code jouable n’est encore présent.

La prochaine étape consiste à définir puis simuler la boucle algorithmique minimale du prototype, sans dépendance graphique.
