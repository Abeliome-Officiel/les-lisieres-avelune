# PROTO-0.2 — Règles et périmètre

## 1. Énergie

La réserve énergétique courte est supprimée.

Modèle joueur :

```text
⚡ Énergie : utilisée / capacité
```

Exemple : `⚡ 2 / 4` signifie 2 mobilisées sur 4 disponibles.

Règles :
- une fonction effectivement active mobilise sa charge énergétique ;
- une activation qui dépasserait la capacité est refusée ;
- l’arrêt d’une fonction libère sa charge énergétique ;
- aucune seconde jauge de réserve ne doit subsister dans le parcours joueur.

Si le code historique conserve des structures de données de réserve pour compatibilité, elles ne doivent pas continuer à influencer le modèle PROTO-0.2. Préférer une suppression propre si elle est sûre et couverte par tests.

## 2. Population et état des fonctions

La population doit être visible comme :

- totale ;
- affectée ;
- disponible.

Une fonction qui demande du travail ne produit pas si le besoin de population n’est pas satisfait.

PROTO-0.2 doit distinguer deux décisions du joueur :

### ON / OFF
- OFF arrête la fonction ;
- OFF libère l’énergie mobilisée par la fonction ;
- OFF **ne désaffecte pas la population** ;
- ON tente de remettre la fonction en service si ses prérequis sont satisfaits.

### Affectation / retrait de population
- retirer la population libère immédiatement cette capacité de travail ;
- la fonction ne travaille plus si son besoin n’est plus rempli ;
- le retrait est une décision plus structurelle qu’un simple OFF, proche d’une mise en réserve fonctionnelle.

### Topologie des liens pendant OFF
Pour PROTO-0.2, l’implémentation recommandée est de **conserver la topologie des connexions mais de les suspendre visuellement et mécaniquement** pendant l’arrêt, plutôt que de forcer le joueur à reconstruire son réseau à chaque redémarrage.

Si le modèle existant rend cette distinction coûteuse ou ambiguë, documenter le point dans `DECISIONS_NEEDED.md` avant d’introduire une autre règle.

### Entretien en état OFF / sans personnel
La règle exacte de consommation d’entretien dans ces états n’est pas considérée comme suffisamment arbitrée pour être inventée. Conserver le comportement existant si compatible ; sinon signaler la décision.

## 3. Stocks et réseau productif

Le modèle mental retenu est un **petit réseau productif avec les stocks du Corcite comme hub/router par défaut**, pas une étoile strictement obligatoire.

Par défaut :

```text
bâtiment → stocks → bâtiment
```

Une connexion directe peut exister :

```text
bâtiment → bâtiment compatible
```

Règles :
- les bâtiments possèdent de vraies entrées/sorties logiques ;
- la ressource d’un lien direct est déduite automatiquement des ports compatibles ;
- le joueur ne choisit jamais `source + destination + ressource` dans trois champs ;
- une sortie non directement routée retourne aux stocks ;
- une entrée non directement alimentée peut utiliser les stocks selon les règles existantes ;
- le stock affiché au joueur peut être agrégé même si les bâtiments de stockage gardent chacun leur capacité mécanique réelle.

Les connexions directes doivent avoir une conséquence réelle ou préparer explicitement une conséquence déjà présente dans le moteur (par exemple tampon dédié / alimentation réservée). Ne pas ajouter arbitrairement des débits, convoyeurs ou coûts logistiques avancés juste pour « faire Factorio ».

## 4. Direction Tycoon × Factorio

PROTO-0.2 doit conserver les deux dimensions :

### Tycoon
- énergie ;
- population ;
- entretien ;
- espace ;
- stockage ;
- construction ;
- développement des capacités.

### Factorio simplifié
- recettes ;
- entrées/sorties ;
- chaînes ;
- connexions directes ;
- visualisation des dépendances ;
- préparation future à des tampons, bifurcations, priorités et goulots.

Ne pas réduire la production à une série de boutons « extraire / transformer / fabriquer » sans représentation du réseau.

## 5. RPG / Évolution

Le RPG **ne passe pas au second plan** et n’est pas un troisième mode isolé.

Il reste une couche textuelle et évolutive qui produit :
- recherches ;
- choix de développement ;
- modificateurs ;
- accès ;
- déblocages ;
- effets sur production, défense, observation ou autres fonctions du Corcite.

PROTO-0.2 doit rendre son effet visible dans la partie et comporter plusieurs décisions ou intégrations significatives au cours d’un run.

Une recherche ne doit pas seulement afficher « bonus appliqué ». Lorsqu’un effet quantitatif modifie une production ou un effet, afficher autant que possible :

```text
Base                 2
Modificateur        +50 %
Effet                 +1
------------------------
Résultat              3
```

La présentation doit être fidèle au moteur : si le bonus est additif, afficher `+1`, pas un faux pourcentage ; s’il est proportionnel, afficher le pourcentage et le delta calculé.

## 6. Défenses

Les défenses restent un pilier du prototype.

Objectifs :
- fabrication lisible ;
- inventaire lisible ;
- placement et déplacement visuels sur le chemin ;
- ordre des tours visible ;
- effets réellement appliqués par le moteur existant ;
- préparation de fond, pas simple réaction à un compte à rebours gratuit.

Le drag-and-drop est pertinent pour placer/déplacer une défense, avec alternative clic/tap/clavier.

## 7. Onde

La « vague » doit être pensée comme une **onde de choc brutale et impromptue issue de la Fracture**, pas comme une échéance périodique connue gratuitement.

Donc :
- pas de compteur permanent « vague dans N tours » par défaut ;
- le moteur peut conserver une fenêtre cachée / seed déterministe pour les tests ;
- des capacités d’observation ou recherches peuvent donner des signes partiels ;
- les défenses doivent être utiles comme préparation permanente.

Pour le mini-jeu PROTO-0.2, une séquence courte de quelques ondes, avec fin explicite du run, est souhaitée afin de pouvoir tester apprentissage et adaptation. **Trois ondes est la cible de test actuelle**, sans valeur canonique pour le jeu final.

## 8. Durées

Pour PROTO-0, les actions déjà arbitrées comme actions de prototype restent à **1 tour** : extraction, production/fabrication/construction/recherche concernées par ce socle de test, sauf règle historique explicitement conservée hors du parcours jouable.

Ne pas réintroduire un quota global d’actions par tour.

## 9. Sauvegarde

Le prototype doit pouvoir être repris après actualisation/fermeture raisonnable du navigateur.

Cible minimale :
- sauvegarde locale versionnée ;
- autosave après changements significatifs ;
- restauration sûre ;
- fallback propre si données invalides ;
- nouvelle partie remplace explicitement la sauvegarde.

Ne pas introduire une architecture serveur de persistance multijoueur prématurée pour ce besoin.

## 10. Hors périmètre explicite

Ne pas ajouter dans PROTO-0.2 :
- nouveaux matériaux ;
- système futur de matériaux découverts dans les ondes ;
- consommables de nouvelles tours liés à ces futurs matériaux ;
- races/classes complètes ;
- social/multijoueur simultané ;
- commerce ;
- météo ;
- événements secondaires riches ;
- plusieurs anneaux mécaniques ;
- carte monde active supplémentaire ;
- canvas industriel libre complexe ;
- temps réel ;
- lore conséquent ;
- dizaines de nouveaux bâtiments ou tours.

L’idée future à conserver est : de nouveaux matériaux issus des ondes pourront servir à fabriquer certaines nouvelles tours et éventuellement être consommés par elles, ce qui créera plus tard des besoins d’alimentation du réseau productif. **Cette idée ne doit avoir aucun effet mécanique maintenant.**
