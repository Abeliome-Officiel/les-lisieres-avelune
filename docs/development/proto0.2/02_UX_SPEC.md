# PROTO-0.2 — Spécification UX fonctionnelle

## Intention

PROTO-0.2 n’est **pas** une maquette de direction artistique ni une préparation de sortie officielle. La priorité est l’**ergonomie d’usage** : comprendre, manipuler et lire l’état du jeu rapidement.

Le visuel peut porter un minimum d’ambiance Avelune, mais il ne doit jamais retarder ni compliquer la validation fonctionnelle.

Principe directeur :

> Le joueur ne doit pas reconstruire le modèle du jeu à partir de tableaux. Les relations importantes doivent être visibles ou directement manipulables.

## 1. Écran principal

La cible est une vue fonctionnelle du Corcite, avec quatre couches lisibles :

1. barre persistante des ressources et capacités ;
2. réseau productif visible ;
3. accès clair au développement / évolution ;
4. accès clair aux défenses et à la progression du run.

La navigation peut rester en vues spécialisées si nécessaire, mais le joueur doit conserver les informations économiques importantes sans changer de page.

## 2. Barre ressources / capacités

Toujours visible ou quasi permanente.

Exemple de lecture :

```text
◉ 12    ◆ 9    ⬢ 4    ⬡ 2      ⚡ 2/4   👤 3/5   🔧 4/6   ▣ 18/24
```

Objectifs :
- quantité lisible immédiatement ;
- mêmes icônes partout ;
- pas d’identifiants internes R1/R2/R3/R4 exposés comme libellés principaux ;
- détail disponible au clic/tap sans alourdir la vue.

## 3. Réseau productif

Représentation cible : hybride **hub de stocks + branches fonctionnelles**, visuellement organisée mais sans canvas industriel libre.

Le joueur doit voir :
- les fonctions construites ;
- leur état ON/OFF ;
- leur personnel ;
- leur consommation de capacité ;
- ce qu’elles consomment et produisent ;
- les liens directs existants ;
- les liens suspendus si une fonction est OFF.

### Nœud de production

Un composant générique doit pouvoir afficher au minimum :

```text
Transformation              ● ON

Entrées        2 ◉ + 2 ◆
Base           2 ⬢
Recherche    +50 %  (+1)
--------------------------
Résultat        3 ⬢ / tour

⚡ 2   👤 1   🔧 1
```

Les informations avancées peuvent être repliées pour éviter la surcharge.

## 4. Connexions

L’interaction normale ne doit jamais être un formulaire `source + destination + ressource`.

Cible :
- sélectionner/tirer un port de sortie ;
- mettre en évidence uniquement les entrées compatibles ;
- déposer/cliquer sur la cible ;
- déduire automatiquement la ressource ;
- alternative clic/tap obligatoire.

Le drag-and-drop / pointer gesture est une interaction préférée, pas exclusive.

### États graphiques minimum
- lien actif : lisible ;
- lien suspendu : visible mais atténué / discontinu ;
- cible incompatible : non proposée ;
- cible compatible : mise en évidence pendant l’interaction.

## 5. Population

La population doit être manipulable comme une capacité visible.

Cible :
- pool `disponible / totale` ;
- affectation à une fonction par drag-and-drop ou clic/tap ;
- retrait vers le pool ou commande équivalente ;
- le joueur doit voir immédiatement où la population est affectée.

Ne pas créer d’individus, métiers individuels, trajets ou microgestion sociale dans PROTO-0.2.

## 6. ON/OFF

ON/OFF est un contrôle simple et distinct de l’affectation de population.

OFF :
- cesse de produire ;
- libère l’énergie ;
- conserve l’affectation de population ;
- conserve la topologie des liens en mode suspendu.

Le contrôle doit être évident et ne pas ressembler à une suppression/démolition.

## 7. RPG / évolution

Le RPG doit être **présent et visible dans le parcours**, sans être réduit à un onglet secondaire oublié.

Cible minimale :
- recherche en cours clairement visible ;
- découvertes/choix signalés ;
- effets affichés sur les fonctions concernées ;
- choix de développement présentés sous forme de cartes ou options comparables ;
- impacts quantitatifs décomposés `base + modificateur = résultat` lorsque pertinent.

Ne pas utiliser le drag-and-drop pour les choix conceptuels de recherche/évolution sauf raison fonctionnelle explicite.

## 8. Défenses

Vue spécialisée autorisée et recommandée.

Le joueur doit voir :
- inventaire des défenses ;
- chemin d’entrée à sortie ;
- positions ;
- ordre ;
- placement/déplacement ;
- résultat principal de chaque tour.

Drag-and-drop pertinent pour placer/déplacer ; alternative clic/tap/clavier obligatoire.

## 9. Onde

Pas de compte à rebours gratuit permanent.

Le joueur poursuit son développement jusqu’à un déclenchement soudain. Le moteur peut rester déterministe / seedé pour les tests.

Si une recherche ou capacité donne de l’information préalable, afficher un **indice qualitatif**, pas nécessairement un nombre de tours exact.

## 10. Ergonomie mobile et desktop

PROTO-0.2 doit rester utilisable sur téléphone, même si le desktop peut offrir davantage d’espace.

Contraintes :
- pas de petites cibles obligatoires ;
- pas de geste hover-only ;
- pas de drag indispensable ;
- composants capables de se réorganiser verticalement ;
- les informations essentielles ne doivent pas dépendre d’un grand canvas fixe.

## 11. Ambiance visuelle minimale

Autorisé :
- palette cohérente avec Avelune ;
- formes organiques/minérales discrètes ;
- accent violet/prune/lavande ;
- micro-ambiance visuelle non anthropomorphe.

Interdit pour ce lot :
- consacrer du temps à une direction artistique finale ;
- créer des illustrations complexes ;
- créer habitants, humains/humanoïdes, faune ou flore naturaliste non définie ;
- choisir des effets décoratifs qui réduisent la lisibilité.

La réussite du prototype est **fonctionnelle**, pas esthétique.
