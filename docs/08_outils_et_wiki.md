# Outils, dépôt et wiki

## Situation actuelle

- dépôt GitHub : **Avelune-Officiel** ;
- Forgejo sera déployé ultérieurement puis synchronisé ;
- un compte Google peut servir temporairement, sans devenir la source unique ;
- Nextcloud n'est pas retenu comme outil central.

## Recommandation immédiate

Conserver dans le dépôt :

- `docs/` en Markdown ;
- le classeur de conception ;
- les données JSON et CSV ;
- les journaux de décisions ;
- plus tard le code et les prototypes.

## Wiki

Trois options cohérentes :

1. **MkDocs** : le dossier `docs/` produit un site statique, simple à héberger et entièrement versionné.
2. **Wiki.js** : édition web et synchronisation Git possibles; à utiliser comme interface liée au dépôt.
3. **BookStack** : excellente lecture en livres, chapitres et pages, mais nécessite une discipline d'export/sauvegarde pour éviter une seconde source divergente.

Pour un projet porté seul, la recommandation est : **Markdown dans Git comme source de vérité, MkDocs pour la lecture**. Wiki.js devient intéressant lorsque plusieurs personnes doivent éditer dans le navigateur.

## Arborescence cible

```text
Avelune-Officiel/
├── README.md
├── docs/
├── decisions/
├── data/
├── csv/
├── logs/
├── prototypes/
├── assets/
└── src/            # plus tard
```
