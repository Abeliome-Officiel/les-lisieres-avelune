# Roadmap — Les Lisières d’Avelune

## Repères actuels

- `v0.8` : ancien jalon historique ;
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1 ;
- **PROTO-0.1** : baseline jouable intégrée à `main`, actuellement déployée ;
- **PROTO-0.2** : jalon de développement actif sur `develop/proto-0.2-ux-rules`.

Il n’existe pas encore de nouvelle version stable arbitrairement nommée `v0.9`.

## Phase actuelle

Le projet est dans la phase :

**PROTO-0.1 stable → PROTO-0.2 en développement → playtest du modèle concret du Corcite et de la boucle complète.**

PROTO-0.2 n’a pas pour objectif d’ajouter massivement du contenu. Il doit vérifier que le jeu devient réellement lisible, manipulable et intéressant lorsqu’on assemble :

```text
implantation
→ économie
→ recherche / évolution
→ préparation défensive
→ vague
→ conséquences
→ adaptation
→ victoire ou défaite
```

## Jalon actif — PROTO-0.2

Branche : `develop/proto-0.2-ux-rules`.

Cahier : `docs/development/proto0.2/` sur cette branche.

### 1. Plateau et modèle mental du Corcite

- [x] plateau hexagonal comme modèle actif du Corcite ;
- [x] principe `1 bâtiment = 1 case` ;
- [x] ressources de sol pour l’extraction ;
- [x] réseau direct/ports/câbles retirés du parcours actif ;
- [x] pas d’adjacence, distance, orientation ou logistique spatiale dans ce jalon ;
- [ ] valider en playtest que le plateau est plus naturel à comprendre et à manipuler.

### 2. Démarrage et économie

- [x] plateau vide au départ ;
- [x] kit de déploiement non posé ;
- [x] aucun stockage natif permanent du Corcite ;
- [x] capacité de stockage fournie par les bâtiments de stockage ;
- [x] inventaire global ;
- [x] extraction, transformation et fabrication dans la boucle cible ;
- [x] Atelier de construction, Fabrique défensive et Recyclerie dans le périmètre ;
- [x] réservation des matières et sortie bloquée sans destruction ;
- [x] démontage/remontage des bâtiments ;
- [ ] calibrer le bootstrap et les coûts par simulation et playtest.

### 3. Énergie, population et entretien

- [x] énergie simplifiée en `utilisée / capacité` ;
- [x] ancienne réserve énergétique courte abandonnée pour ce jalon ;
- [x] population affectée/disponible ;
- [x] entretien global ;
- [ ] vérifier que ces contraintes produisent des arbitrages sans surcharge de microgestion.

### 4. Recherche / progression

- [x] recherche comme couche transversale ;
- [x] déblocage de la Transformation ;
- [x] améliorations utiles dont `Stockage amélioré` ;
- [x] progression répétable volontairement bornée ;
- [ ] vérifier que les recherches ouvrent de vrais choix sans devenir un arbre technologique prématuré.

### 5. Défense et vagues

Pour PROTO-0.2 uniquement :

- [x] une famille défensive active : **Affaiblissement** ;
- [x] une caractéristique active de vague : **Puissance** ;
- [x] réduction séquentielle de la Puissance ;
- [x] Puissance résiduelle `0` → victoire immédiate du testeur ;
- [x] Intégrité du Corcite `0` → victoire du jeu ;
- [x] vagues strictement plus puissantes ;
- [x] suppression du nombre fixe de trois vagues ;
- [x] aucune matière de vague/captation dans l’économie du jalon ;
- [ ] calibrer un run challengeant, gagnable et fini ;
- [ ] redéfinir après PROTO-0.2 la nature réelle de la vague et ses futures caractéristiques.

Les anciennes notions `pression / structure / charge / matière capturable` restent historiques et ne constituent pas le canon futur.

### 6. UX et direction visuelle

- [x] Gen3 retenu comme référence de **composition** ;
- [x] HUD haut, fiche Corcite gauche, plateau central, contexte droit, inventaire/ordres bas ;
- [x] vue Défenses séparée ;
- [x] direction provisoire : onirique, queer, organique/minérale, biomorphique, violet/prune/lavande/opaline ;
- [ ] atteindre un prototype qui ressemble à un jeu Avelune et non à un back-office ;
- [ ] valider desktop et mobile ;
- [ ] tester lisibilité, contraste, clic/tap/clavier et absence de drag obligatoire.

### 7. Qualité et architecture

- [x] séparation données / logique / état / présentation comme principe ;
- [x] priorité aux composants réutilisables lorsqu’ils répondent à un besoin réel ;
- [x] refus des abstractions spéculatives pour remplir le temps de développement ;
- [ ] tests ciblés verts ;
- [ ] build production vert ;
- [ ] simulations reproductibles ;
- [ ] passe de simplification et suppression du code mort ;
- [ ] rapport d’implémentation final à jour.

## Gate de sortie PROTO-0.2

Le jalon peut être proposé au playtest lorsque :

1. un run complet peut être joué sans reconstruire mentalement le système technique ;
2. au moins une trajectoire raisonnable peut gagner ;
3. une trajectoire insuffisante finit par perdre ;
4. aucun soft-lock économique structurel n’est inévitable ;
5. les états importants sont lisibles ;
6. le prototype fonctionne sur desktop et reste utilisable sur mobile ;
7. tests, build et simulations sont verts/validés ;
8. le rapport d’implémentation reflète l’état réel ;
9. la revue humaine confirme qu’un push et un déploiement sont appropriés.

## Après PROTO-0.2

Ne pas décider automatiquement que le prochain jalon consiste à ajouter du contenu.

D’abord analyser les playtests :

- compréhension du Corcite ;
- plaisir de placement/manipulation ;
- qualité des arbitrages économiques ;
- valeur de la recherche ;
- rythme du run ;
- intérêt de la préparation défensive ;
- tension des vagues ;
- qualité des rapports ;
- fatigue cognitive ;
- identité visuelle perçue.

Ensuite seulement décider :

- quelles mécaniques du plateau doivent gagner en profondeur ;
- si et comment un réseau productif plus proche de Factorio/LabVIEW revient ;
- comment redéfinir la vague avec environ 4 à 6 caractéristiques pertinentes ;
- quelles dimensions RPG doivent être approfondies ;
- quels systèmes deviennent assez stables pour une architecture production plus complète ;
- quel contenu mérite d’être ajouté.

## Principes qui ne dépendent pas du jalon

- monde partagé unique ;
- protection collective de la Lisière ;
- coopération directe facultative ;
- progression principalement horizontale ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO/micro-dopamine comme moteur de rétention ;
- plusieurs styles de jeu légitimes ;
- accessibilité intégrée ;
- identité queer et non genrée ;
- architecture sobre, modulaire et évolutive sans sur-conception prématurée.
