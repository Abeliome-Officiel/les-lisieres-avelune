# PROTO-0.2 — Critères d’acceptation du mini-jeu

Cette version n’est pas jugée sur son niveau de finition graphique. Elle est jugée sur sa capacité à fournir un **mini-jeu jouable permettant d’évaluer l’ergonomie et les règles**.

## Gate A — lecture immédiate

Un testeur doit pouvoir identifier rapidement :
- ressources principales ;
- énergie utilisée/capacité ;
- population affectée/disponible ;
- entretien ;
- stockage ;
- fonctions présentes et actives ;
- accès à l’évolution ;
- accès aux défenses.

## Gate B — production

Le joueur doit pouvoir :
- voir au moins une chaîne de production ;
- comprendre entrées/sorties ;
- affecter/retirer de la population ;
- mettre une fonction ON/OFF ;
- créer une connexion directe compatible sans formulaire source/destination/ressource ;
- comprendre où va une production non directement reliée.

## Gate C — recherche / RPG

Le joueur doit :
- voir la recherche/évolution comme une composante du Corcite et pas comme un système secondaire invisible ;
- pouvoir lancer/intégrer les recherches prévues par le prototype ;
- voir l’effet d’une recherche sur la fonction concernée ;
- comprendre un breakdown du type `base + bonus = résultat` ;
- rencontrer au moins un choix ou une bifurcation de développement significative si l’existant le permet sans recréer tout le RPG.

## Gate D — défense

Le joueur doit pouvoir :
- fabriquer au moins les défenses existantes du prototype ;
- comprendre l’inventaire ;
- placer et déplacer une défense sur le chemin ;
- comprendre l’ordre de résolution ;
- utiliser le système sans passer par une succession de formulaires textuels abstraits.

## Gate E — onde et adaptation

- L’onde n’est pas présentée comme un compte à rebours gratuit permanent.
- Elle peut être déclenchée de façon déterministe dans le moteur pour les tests.
- Le rapport de fin d’onde reste distinct du rapport de tour.
- Le joueur peut adapter son Corcite après une onde.

## Gate F — continuité de session

- Actualiser/revenir dans le navigateur ne doit pas perdre silencieusement toute la partie.
- Une sauvegarde locale versionnée est restaurée ou rejetée proprement.

## Gate G — stabilité technique

Avant revue :
- `svelte-check` ou contrôle équivalent : vert ;
- tests PROTO-0 : verts ;
- build : vert ;
- tests ciblés des nouvelles règles : verts ;
- aucun test existant supprimé uniquement pour masquer une régression.

## Gate H — expérience minimale

À la fin du lot, il doit exister un parcours réellement jouable, même encore brut :

```text
démarrer
→ lire ses ressources/capacités
→ développer/produire
→ affecter et piloter les fonctions
→ rechercher/évoluer
→ préparer les défenses
→ subir une onde
→ lire les conséquences
→ adapter
```

La version peut rester imparfaite visuellement. En revanche, elle ne doit pas être seulement une collection de nouvelles maquettes ou composants non assemblés.

## Critère de succès playtest

Le testeur doit pouvoir formuler une opinion sur le **jeu** et non seulement sur sa capacité à comprendre l’interface.

Les retours recherchés sont notamment :
- ai-je compris ce que je pouvais faire ?
- ai-je compris pourquoi une action était bloquée ?
- ai-je compris les effets de mes recherches ?
- ai-je eu des choix réels ?
- ai-je apprécié organiser mon Corcite ?
- ai-je envie d’essayer une autre organisation ?

Un résultat « j’ai compris mais je n’aime pas » est exploitable. Un résultat « je ne sais pas, je n’ai rien compris » signifie que le prototype n’a pas encore atteint sa gate ergonomique.
