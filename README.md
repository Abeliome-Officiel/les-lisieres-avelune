# Les Lisières d’Avelune — dossier de conception v0.4

Ce dossier consolide les échanges de cadrage du 26 juillet 2026. Il est conçu pour être déposé directement dans le dépôt GitHub **Avelune-Officiel**, puis synchronisé vers Forgejo ultérieurement.

## Fichiers principaux

- `BOOK_Les_Lisieres_Avelune_v0.4.docx` et `.pdf` : book de conception lisible.
- `Avelune_Design_Book_v0.4.xlsx` : classeur de pilotage avec décisions atomiques et listes déroulantes.
- `logs/CONVERSATION_COMPLETE.md` : transcription du fil visible jusqu'à la demande de création du pack.
- `docs/` : pages Markdown adaptées à Git, GitHub, MkDocs ou Wiki.js.
- `wiki/` : copie directement importable comme arborescence de wiki.
- `data/design_data.json` : données structurées réutilisables.
- `csv/` : exports ouverts de tous les tableaux principaux.
- `ROADMAP.md` : séquençage recommandé du prototype au monde persistant.
- `CHANGELOG.md` : historique des versions documentaires.

## Source de vérité recommandée

À court terme, conserver les fichiers Markdown et les données structurées dans le dépôt Git. Le wiki doit être une interface de lecture ou d'édition synchronisée, pas l'unique exemplaire des données.

## Statuts décisionnels

- **Décision définitive** : principe confirmé à préserver sauf remise en cause explicite.
- **Décision provisoire** : direction forte à tester ou préciser.
- **Décision reportée** : bonne idée conservée hors du périmètre actuel.

## Ordre de lecture

1. `docs/00_vision.md`
2. `docs/01_concept_corps_cite.md`
3. `docs/02_monde_persistant.md`
4. `docs/03_tycoon_et_reseaux.md`
5. `docs/04_evenements_et_donnees_reelles.md`
6. `docs/05_social_et_communication.md`
7. `docs/06_accessibilite_ethique.md`
8. `docs/07_prototype_mvp.md`
9. `docs/08_outils_et_wiki.md`
10. le classeur de pilotage
