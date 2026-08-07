# PROTO-0.2 — Critères d’acceptation du mini-jeu

PROTO-0.2 est accepté comme **alpha de playtest** lorsqu’un testeur peut jouer un run complet sans reconstruire mentalement un modèle technique.

## Gate A — démarrage / plateau
- plateau hexagonal vide au départ ;
- kit initial non posé ;
- premier stockage posé par le joueur ;
- aucun stockage natif/invisible permanent ;
- ressources de sol lisibles ;
- placement d’un bâtiment avec prévisualisation ;
- `1 bâtiment = 1 case` ;
- aucune mécanique d’adjacence/réseau cachée.

## Gate B — économie
Le joueur peut :
- extraire les deux matières primaires ;
- transformer puis fabriquer les niveaux suivants ;
- construire des bâtiments via l’Atelier de construction ;
- fabriquer des défenses via la Fabrique défensive ;
- comprendre énergie, population, entretien et stockage ;
- voir les matières réservées ;
- constater un producteur bloqué si sa sortie ne peut pas entrer en stock ;
- libérer le blocage sans perte cachée.

Aucun matériau transformé/composant n’est offert au départ.

## Gate C — inventaire / bâtiments
- inventaire global lisible ;
- bâtiments non posés et défenses y apparaissent ;
- démontage d’un bâtiment possible ;
- remontage coûte du temps ;
- recyclage fonctionne selon sa règle ;
- retrait d’un stockage impossible si le stock ne tient plus dans la capacité restante.

## Gate D — recherche / RPG
- recherche visible comme couche du Corcite ;
- Transformation réellement débloquée par recherche ;
- au moins plusieurs améliorations utiles sont testables, dont **Stockage amélioré** ;
- effets affichés `base + modificateur = résultat` ;
- limite de progression répétable respectée ;
- une seule source de vérité de recherche.

## Gate E — défense
- une seule famille joueur dans ce proto : **Affaiblissement** ;
- fabrication → inventaire → vue tactique → placement ;
- chemin/ordre de résolution lisible ;
- chaque défense réduit réellement la Puissance de l’onde ;
- aucun ancien système Captation/Déstructuration/Stabilisation nécessaire au run.

## Gate F — onde / victoire
- onde sans compte à rebours exact gratuit permanent ;
- Puissance strictement croissante d’une onde à l’autre ;
- résolution séquentielle des défenses visible ;
- résidu `0` → victoire immédiate du testeur ;
- résidu `>0` → perte d’Intégrité ;
- Intégrité `0` → victoire du jeu / défaite testeur ;
- sinon le run continue ;
- aucune matière de vague/captation n’entre dans l’économie.

Le run n’a pas un nombre fixe de vagues et ne doit pas pouvoir rester éternellement neutre : la courbe finit par tuer un Corcite qui ne parvient jamais à annuler une onde.

## Gate G — équilibrage de laboratoire
Les simulations doivent démontrer :
- au moins une trajectoire de jeu raisonnable peut gagner ;
- une trajectoire insuffisante finit par perdre ;
- le challenge augmente continûment ;
- pas de victoire triviale immédiate avec le kit de départ ;
- pas de soft-lock économique structurel inévitable ;
- paramètres centralisés et modifiables sans refactor.

Il ne s’agit pas d’un équilibrage final.

## Gate H — UX / visuel
- composition proche du brief Gen3 corrigé ;
- HUD permanent clair ;
- plateau central dominant ;
- fiche Corcite, contexte de sélection et inventaire lisibles ;
- identité Avelune perceptible : violet/prune/lavande/opaline, organique/minérale/biomorphique ;
- aucun humain/humanoïde, fantasy médiévale ou sci-fi industrielle générique ;
- desktop agréable ;
- mobile utilisable ;
- drag jamais obligatoire ;
- pas de formulaires techniques comme interaction principale.

Le visuel n’a pas besoin d’être final, mais une interface purement brute/grise n’est pas suffisante pour ce lot.

## Gate I — rapports / persistance
- rapport d’onde séparé des logs techniques ;
- puissance initiale, effets successifs, résidu, Intégrité avant/après et résultat visibles ;
- sauvegarde locale versionnée ;
- restauration/rejet propre ;
- nouvelle partie fonctionnelle.

## Gate J — stabilité
Avant `REVIEW_READY` :
- `npm run check` ou équivalent : vert ;
- `npm run test:proto0` : vert ;
- `npm run build` : vert ;
- tests ciblés : verts ;
- simulations : exécutées et résumées ;
- aucun test supprimé pour masquer une régression.

## Parcours minimum réellement jouable

```text
déployer le kit
→ poser stockage/extracteurs/fonctions
→ extraire
→ rechercher la transformation
→ transformer/fabriquer
→ développer capacités et stockage
→ fabriquer des défenses
→ les placer
→ subir une onde impromptue
→ lire le résultat
→ adapter
→ gagner en annulant une onde OU perdre par Intégrité à 0
```

Un résultat acceptable doit permettre au testeur de juger le **jeu, les choix, l’organisation du Corcite et le challenge**, pas seulement la compréhension de l’interface.
