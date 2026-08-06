# Dette technique et prochaines étapes

Statut : registre vivant.

## Priorité P0 - après le playtest humain si la boucle est conservée

| Sujet | Risque | Action |
|---|---|---|
| `+page.svelte` monolithique | coût de modification, régressions UI | découper en vues/composants + selectors |
| Config compilée | équilibrage lent | datasets externes versionnés |
| Sources multiples de données | divergences | définir source canonique et pipeline |
| Capacités liées à des kinds précis | ajout de contenu nécessite moteur | grants/composants génériques |
| État Corcite non versionné | sauvegardes cassées | envelope + migrations |
| Client autoritaire | triche/incohérence futur monde | commandes serveur autoritaires |

## Priorité P1 - avant vertical slice

| Sujet | Action |
|---|---|
| CI | GitHub Actions test/check/build |
| Protection de branches | checks requis avant fusion des branches stables |
| E2E | parcours navigateur critiques et mobile |
| Persistance | repositories PostgreSQL + transactions |
| Télémétrie | événements métier versionnés |
| Dépendances | audit, cadence de mise à jour, politique vulnérabilités |
| Sauvegarde | procédure backup/restore testée |
| ADR | journaliser les choix structurants |

## Priorité P2 - avant production de contenu importante

- pipeline tableur -> dataset validé ;
- comparaison de rulesets par simulation ;
- localisation ;
- pipeline narratif ;
- profiling ;
- budgets performance ;
- outils d'administration/contenu.

## Signal issu des simulations actuelles

La stratégie automatique `develop` termine autour de 83 d'intégrité contre environ 93 pour `passive`/`research` et ne parvient pas à poser de défense dans la batterie actuelle.

Ce signal ne permet pas de conclure que le développement est désavantagé : l'agent automatique est volontairement simple. Il impose toutefois un contrôle humain prioritaire de la courbe « investissement productif -> préparation TD -> survivabilité ».
