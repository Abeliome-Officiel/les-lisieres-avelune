# Les Lisières d’Avelune — conception v0.8

Dépôt de conception du jeu navigateur persistant **Les Lisières d’Avelune**.

La v0.8 fixe un socle mécanique minimal pour les trois axes du projet :

- Tower Defense centré sur le Passage des vagues ;
- Tycoon–Factorio pour la production, les constructions et les réseaux ;
- RPG avec la Trame d’Avelune, les Vocations et la Dissonance.

Un mini-prototype tableur relie désormais les trois axes dans un cycle complet.

## État du projet

Le dépôt contient de la conception, des données structurées et un simulateur tableur.
Il ne contient pas encore de prototype logiciel jouable dans un navigateur.

Le socle v0.8 permet maintenant de commencer ce prototype logiciel sans devoir définir tout le contenu final.

## Book de conception

- [Lire le book complet en Markdown](docs/book/BOOK_Les_Lisieres_Avelune.md)
- [Consulter le book complet en PDF](docs/book/BOOK_Les_Lisieres_Avelune.pdf)
- [Télécharger le book au format DOCX](docs/book/BOOK_Les_Lisieres_Avelune.docx)

## Classeurs principaux

- [Design Book](design-data/Avelune_Design_Book.xlsx) : registre des 144 décisions et 100 mécanismes ;
- [Règles et mécaniques](design-data/Avelune_Regles_Mecaniques.xlsx) : paramètres, recherches et simulations détaillées ;
- [Mini-prototype intégré](prototype/Avelune_Mini_Prototype.xlsx) : cycle minimal Tower Defense, TF et RPG.

## Socle mécanique v0.8

La première région utilise :

- un monde hexagonal de rayon 7 ;
- une Fracture centrale de rayon 1 ;
- une Lisière extérieure non constructible ;
- deux anneaux de confort ;
- dix corps-cités potentiels ;
- trois à six corps-cités actifs dans les premières simulations ;
- une empreinte maximale de sept cases pendant La Genèse.

Le premier Passage utilise une vague simple :

- un seul secteur ;
- aucune dérive ;
- aucune scission ;
- aucune dissipation générique ;
- résolution successive par anneau et par corps-cité.

Le cycle est organisé en :

1. Murmures ;
2. Veille ;
3. Scellement ;
4. Passage ;
5. Retombées.

## Documentation principale

- [Index documentaire](docs/index.md)
- [Vision](docs/00_vision.md)
- [Corps-cité](docs/01_concept_corps_cite.md)
- [Monde persistant](docs/02_monde_persistant.md)
- [Tycoon–Factorio et réseaux](docs/03_tycoon_et_reseaux.md)
- [Vagues, météo et Échos](docs/04_evenements_et_donnees_reelles.md)
- [Social et communication](docs/05_social_et_communication.md)
- [Accessibilité et éthique](docs/06_accessibilite_ethique.md)
- [Prototype et MVP](docs/07_prototype_mvp.md)
- [Background d’Avelune](docs/10_background_avelune.md)
- [Socle mécanique v0.8](docs/13_socle_mecanique_v0.8.md)
- [Trame RPG](docs/14_trame_rpg.md)
- [Passage et Lisière](docs/15_lisiere_et_passage.md)
- [Spécification du prototype logiciel](docs/16_proto_minimal.md)

## Données ouvertes

- `csv/` : exports tabulaires ;
- `data/design_data.json` : données structurées ;
- `docs/` : documentation Markdown ;
- `design-data/` : classeurs de conception ;
- `logs/` : historique continu des décisions et de la conception.

## Historique fictionnel et développement

L’histoire réelle du projet est intégrée à la mémoire du monde :

- **La Genèse** : création et stabilisation des premières lois ;
- **Les Prémices** : phase de bêta et premières traces laissées par les testeurs ;
- **L’Éveil** : ouverture publique.

Ces traces ne procurent aucun avantage mécanique durable exclusif.

## Périmètre reporté

La v0.8 ne développe pas encore :

- la coopération active ;
- le commerce entre joueurs ;
- le déplacement des corps-cités ;
- la dérive ou la scission des vagues ;
- les instances RPG complètes ;
- l’interface finale.

## Pilotage

- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [Journal complet des décisions](logs/JOURNAL_DECISIONS_COMPLET.md)
- [Journal de conception](logs/LOG_CONCEPTION.md)
- [Manifeste du dépôt](MANIFEST.md)

Les versions historiques sont identifiées par les tags Git `v0.4`, `v0.5`, `v0.6`, `v0.7` et `v0.8`.

Aucune licence n’est encore attribuée au projet. Tous droits réservés par défaut.
