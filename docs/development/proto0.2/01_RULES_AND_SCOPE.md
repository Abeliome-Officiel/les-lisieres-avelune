# PROTO-0.2 — Règles et périmètre consolidés

Date : 2026-08-07
Statut : **source mécanique active pour implémentation**.

## 1. Objectif du prototype

PROTO-0.2 est un mini-jeu de test, pas le jeu final. Il doit valider la boucle :

`implanter → extraire → transformer/fabriquer → rechercher → préparer les défenses → subir l’onde → adapter`

Le challenge central du run est volontairement simple :
- une onde possède dans ce prototype une seule caractéristique mécanique active : sa **Puissance** ;
- les défenses d’**Affaiblissement** réduisent cette puissance ;
- si la puissance résiduelle atteint `0`, **le testeur gagne immédiatement le run** ;
- sinon le résidu inflige des dégâts à l’**Intégrité du Corcite** ;
- si l’Intégrité atteint `0`, **le jeu gagne / le testeur perd** ;
- si aucun des deux n’arrive, le développement continue jusqu’à l’onde suivante.

La puissance des ondes doit **augmenter strictement d’une onde à l’autre**. Le run ne doit pas pouvoir durer indéfiniment : si le joueur ne parvient pas à annuler une onde, la croissance finit par rendre la survie impossible. L’équilibrage doit néanmoins laisser au moins une trajectoire raisonnable de victoire ; challengeant, mais pas impossible.

Pour le proto, éviter d’ajouter d’autres axes de difficulté. Le calibrage principal porte sur : puissance initiale, croissance entre ondes, puissance d’Affaiblissement, rythme économique et Intégrité du Corcite.

## 2. Nature future de l’onde — explicitement remise à plus tard

Le jeu final devra redéfinir prochainement ce qu’est réellement une onde, de quoi elle est constituée et ses **4 à 6 caractéristiques** pertinentes. Les anciennes notions `pression / structure / charge / matière capturable` restent des références historiques, pas un canon futur.

Dans PROTO-0.2 :
- ne pas les utiliser pour déterminer victoire/défaite ;
- ne pas exposer une fausse complexité au joueur ;
- ne pas ajouter de captation ni de matière issue des ondes.

## 3. Temporalité des ondes

Conserver la décision antérieure : l’onde est une propagation **brutale/impromptue issue de la Fracture**, pas un raid annoncé par un compteur gratuit permanent.

Pour obtenir un prototype déterministe et testable, réutiliser comme point de départ les paramètres historiques déjà présents :
- première onde autour du tour 6 ;
- au moins 5 tours de développement entre deux ondes ;
- éventuel retard déterministe borné de 0 à 2 tours ;
- pas de compte à rebours exact gratuit dans l’UI ;
- les capacités d’observation/recherche peuvent donner des indices sans dévoiler artificiellement un timer exact.

Ces nombres sont des paramètres de laboratoire. Codex peut les ajuster par simulation si nécessaire pour atteindre les critères de challenge, sans changer le principe de temporalité.

Il n’y a plus de nombre fixe de trois ondes : le run s’arrête à la première onde annulée ou à la mort du Corcite.

## 4. Plateau économique

- Un seul plateau principal en hexagones.
- Taille de prototype, architecture extensible.
- `1 bâtiment = 1 case`.
- En dehors de l’extraction, la position n’a **aucun effet mécanique** dans PROTO-0.2.
- Pas d’adjacence, distance, orientation, routes, transport spatial, AoE, multi-case ou logistique spatiale.
- L’ancien `space` abstrait ne doit pas rester comme seconde contrainte concurrente.

Certaines cases portent une ressource primaire de sol. Tout bâtiment peut être posé sur toute case libre. Un extracteur placé sur une ressource compatible produit ; ailleurs il peut être posé mais produit `0` pour cette ressource. La prévisualisation de placement affiche le résultat attendu sans avertissement punitif.

## 5. Démarrage du run

Aucun bâtiment n’est déjà implanté sur le plateau.

Le joueur reçoit un **kit de déploiement initial non posé**, lui permettant d’organiser lui-même son Corcite dès le premier écran :
- 1 stockage ;
- 1 source/extension énergétique ;
- 1 unité d’entretien ;
- 1 Atelier de construction ;
- 1 extracteur organique ;
- 1 extracteur minéral ;
- 1 Fabrique défensive.

La Recyclerie est disponible à la fabrication dès le départ mais n’a pas besoin d’être offerte gratuitement.

Il n’existe **aucune capacité de stockage native du Corcite**. Toute capacité mécanique vient de bâtiments de stockage posés. Le bootstrap initial doit donc être traité comme une phase de déploiement : le premier stockage du kit est posé avant que le stock économique normal soit utilisé. Ne pas créer de stockage invisible permanent pour résoudre ce cas.

Stock économique initial de laboratoire :
- matière organique brute : `4` ;
- matière minérale brute : `4` ;
- matériau transformé : `0` ;
- composant fabriqué : `0`.

Le joueur doit découvrir/utiliser la chaîne de transformation lui-même. Ces valeurs restent ajustables après simulation, mais **aucune matière transformée ne doit être donnée au départ**.

## 6. Bâtiments de base et fabrication

Disponibles sans recherche :
- extracteur organique ;
- extracteur minéral ;
- stockage ;
- extension énergétique ;
- unité d’entretien ;
- Atelier de construction ;
- Recyclerie ;
- Fabrique défensive.

Le transformateur est débloqué par recherche.

Responsabilités :
- **Atelier de construction** : fabrique les bâtiments économiques ;
- **Fabrique défensive** : fabrique les tours/défenses ;
- les bâtiments et tours suivent tous la chaîne `fabriqué → inventaire → posé/utilisé`.

Les coûts chiffrés historiques peuvent servir de première base, mais Codex doit centraliser les nouveaux coûts et les ajuster par simulation pour rendre le bootstrap viable sans supprimer les choix.

## 7. Retrait / remontage d’un bâtiment

Un bâtiment posé peut être démonté. Il devient un objet démonté en inventaire.

Il peut :
- être recyclé ;
- être **remonté** plus tard ;
- le remontage coûte du temps (référence PROTO : 1 tour) ;
- pas de coût matériel supplémentaire pour le remontage dans ce proto.

Ainsi, un déplacement indirect existe mais n’est ni instantané ni gratuit.

Interdire le retrait d’un stockage si la capacité restante ne peut pas contenir le stock. Aucun contenu n’est détruit automatiquement.

## 8. Stockage / inventaire global

- Les bâtiments de stockage augmentent une capacité globale du Corcite.
- Cliquer n’importe quel stockage ouvre le même inventaire global.
- Présentation type inventaire RPG avec piles visuelles.
- Catégories possibles : Tout / Ressources / Matériaux-Composants / Bâtiments / Défenses.
- Chaque unité mécanique occupe `1` unité de capacité dans le proto ; une pile visuelle ne compresse pas la capacité.
- Pas de volumes différenciés ni stockage spécialisé.

### Réservation d’une fabrication

À la commande :
- coût matière réservé immédiatement ;
- matière réservée non dépensable par un autre ordre ;
- elle reste physiquement dans le stock et occupe sa capacité ;
- aucune réservation anticipée de capacité de sortie.

Au démarrage réel :
- matière réservée consommée ;
- la capacité correspondante se libère.

Annulation :
- avant démarrage réel : restitution 100 % ;
- après démarrage : pas d’annulation gratuite.

### Sortie bloquée

À la fin d’une production/fabrication :
- si le stock accepte le résultat, il y entre ;
- sinon le résultat reste dans **la sortie locale du producteur, limitée au résultat de ce cycle** ;
- le producteur est bloqué jusqu’à libération ;
- rien n’est détruit ;
- pas de buffer configurable, convoyeur ou réseau logistique caché ;
- on ne place pas directement un objet depuis la sortie pour contourner l’inventaire.

## 9. Réseau / Factorio

Le réseau direct est **entièrement hors du parcours joueur PROTO-0.2**.

Ne pas implémenter/réintroduire :
- ports ;
- câbles ;
- source/destination ;
- ressource de lien ;
- graphes de production ;
- routage ;
- priorités ;
- connexions directes bâtiment→bâtiment ;
- buffers de réseau ;
- convoyeurs/débits.

Le code historique peut rester isolé s’il ne structure plus l’UX ni l’état actif. La piste Factorio/LabVIEW demeure future, après validation du plateau simple.

## 10. Énergie, population, entretien

Énergie : modèle unique `utilisée / capacité`. Aucune réserve courte.
- activation au-delà de la capacité : refusée ;
- OFF arrête la production et libère l’énergie ;
- OFF conserve la population affectée ;
- retirer la population la rend disponible immédiatement ;
- une fonction insuffisamment staffée ne travaille pas.

Population affichée : totale / affectée / disponible, sans microgestion d’individus.

Entretien reste une capacité globale du Corcite. Ne pas inventer d’usure individuelle détaillée.

## 11. Recherche / évolution

Une seule vue globale de recherche, source de vérité unique ; des raccourcis contextuels peuvent pointer vers les mêmes nœuds.

Premier petit arbre testé :
- déblocage Transformation ;
- améliorations répétables de productivité utiles ;
- amélioration Recyclerie ;
- **Stockage amélioré** ;
- améliorations liées à fabrication/extraction/transformation selon cohérence avec le moteur.

Les améliorations répétables ne sont pas universelles. Dans PROTO-0.2, limiter la progression répétable à **4 niveaux totaux cumulés** afin de garder le run borné et simulable. Gains modestes et configurables ; pas d’améliorations de type cheat.

Le RPG reste transversal : recherche, choix, modificateurs, accès, déblocages. Pas de quota RPG par tour.

## 12. Défense

PROTO-0.2 simplifie volontairement les anciennes quatre familles de tours en **une seule famille : Affaiblissement**.

- Une défense est un objet physique fabriqué par la Fabrique défensive.
- Elle entre dans l’inventaire global.
- Elle est ensuite placée dans une vue tactique séparée sur le chemin de défense.
- Le chemin historique de 8 positions peut être conservé comme base de prototype.
- L’ordre des tours doit rester visible et mécanique.
- Chaque tour réduit la **Puissance** résiduelle selon son paramètre d’Affaiblissement.
- Pas de Captation, Déstructuration, Stabilisation ni matière de vague dans le parcours actif.

Le joueur ne peut pas fabriquer/ajouter une nouvelle tour pendant la résolution de l’onde.

## 13. Conséquence de l’onde

Après passage des défenses :
- `résidu = max(0, puissanceOnde - affaiblissementEffectif)` selon la résolution séquentielle retenue par le moteur ;
- si `résidu == 0` : victoire immédiate du testeur ;
- sinon : perte d’Intégrité du Corcite déterminée par une fonction simple et centralisée du résidu ;
- si Intégrité `<= 0` : fin du run, victoire du jeu ;
- sinon retour au développement.

Pas de dommage de réserve énergétique, dette de structure, matière capturée ou autre seconde conséquence de vague dans ce proto.

## 14. Rapports

Rapport de vague joueur distinct des logs techniques. Il doit montrer au minimum :
- numéro de l’onde ;
- puissance initiale ;
- effets successifs des tours dans l’ordre ;
- puissance résiduelle ;
- Intégrité avant/après ;
- victoire/défaite/continuité ;
- informations/effets de recherche pertinents.

## 15. Accessibilité / interactions

- Desktop : drag optionnel lorsque naturel.
- Mobile : tap/clic sélection → cible → prévisualisation → confirmation.
- Clavier lorsque raisonnable.
- Jamais de hover-only ou drag-only.
- Cibles suffisamment grandes.
- Une icône seule ne porte pas une information essentielle.

## 16. Hors périmètre

Ne pas ajouter : temps réel, social/multijoueur, commerce, météo, événements riches, anneaux mécaniques multiples, carte monde active supplémentaire, races/classes complètes, lore conséquent, nouveaux matériaux, matière d’onde, réseau Factorio/LabVIEW, direction artistique finale.

PROTO-0.2 doit toutefois recevoir un habillage visuel cohérent et suffisamment abouti pour tester l’expérience, selon `02_UX_SPEC.md` et `06_VISUAL_BRIEF_GEN3.md`.
