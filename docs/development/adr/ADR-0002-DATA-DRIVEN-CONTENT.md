# ADR-0002 - Faire évoluer contenu et équilibrage vers des datasets versionnés

Statut : accepté comme architecture cible ; migration non commencée.

## Contexte

Les paramètres du PROTO-0 sont déjà centralisés dans des modules TypeScript, mais chaque modification nécessite une recompilation et plusieurs générations de données coexistent dans le dépôt.

## Décision

Les invariants restent en code. Les paramètres d'équilibrage et définitions de contenu doivent progressivement migrer vers des datasets externes validés et versionnés, chargés dans un registre normalisé.

## Conséquences

- équilibrage plus rapide ;
- simulations comparables entre datasets ;
- ajout de contenu avec moins de modifications moteur ;
- nécessité de schémas, validations, version/hash et outils d'import/export.
