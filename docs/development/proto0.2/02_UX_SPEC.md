# PROTO-0.2 — Spécification UX fonctionnelle

## Intention

PROTO-0.2 doit être un mini-jeu lisible, manipulable et suffisamment incarné visuellement pour permettre un vrai playtest. La direction artistique n’est pas finale, mais l’interface ne doit plus ressembler à un outil technique ni à une succession de formulaires.

Référence de composition : `06_VISUAL_BRIEF_GEN3.md`.

## 1. Composition principale

Desktop, de préférence en une vue principale proche de Gen3 :
- bandeau supérieur RTS : ressources/capacités essentielles ;
- panneau gauche : fiche du Corcite / évolution ;
- centre : plateau hexagonal économique ;
- panneau droit : contexte du bâtiment/case sélectionné ;
- bas : inventaire global + ordres/productions en cours ;
- accès visible à la vue Défenses.

Mobile : mêmes fonctions, réorganisées en panneaux/tiroirs verticaux ; aucune fonction essentielle ne dépend d’un grand écran.

## 2. Bandeau supérieur

Afficher sans duplication :
- matières primaires et intermédiaires réellement disponibles ;
- stockage utilisé/capacité ;
- énergie utilisée/capacité ;
- population utile à la décision ;
- entretien ;
- Intégrité du Corcite ;
- état général du run.

Même vocabulaire et mêmes icônes dans HUD, inventaire, recettes, recherches et rapports. Les identifiants `R1/R2/...` restent internes.

La matière réservée doit pouvoir être comprise : disponible/déjà engagée/total physique au besoin via détail.

## 3. Plateau économique

Le centre de l’expérience est un **plateau en hexagones**, pas un réseau de nœuds.

Le joueur doit pouvoir :
- lire les ressources de sol ;
- sélectionner un bâtiment disponible ;
- choisir une case ;
- voir une prévisualisation avant pose ;
- confirmer ;
- sélectionner ensuite la case/bâtiment pour agir.

`1 bâtiment = 1 case`. Pas de liens, ports, câbles, routes, adjacence ou orientation mécanique.

Pour un extracteur, la prévisualisation montre explicitement la production attendue sur la case (`+2 organique/tour`, `0`, etc.) sans message moralisateur.

## 4. Panneau de contexte

Pour la sélection courante :
- nom et fonction ;
- ON/OFF si pertinent ;
- population affectée/besoin ;
- énergie/entretien mobilisés ;
- recette/production ;
- base + modificateurs + résultat ;
- état bloqué et raison ;
- sorties en attente ;
- actions pertinentes : produire, configurer, démonter, remonter, ouvrir recherche associée, etc.

Ne jamais afficher un bouton « déplacer » instantané pour un bâtiment posé : déplacement = démontage puis remontage avec coût en temps.

## 5. Inventaire / stockage

Inventaire global de type RPG :
- Tout ;
- Ressources ;
- Matériaux/Composants ;
- Bâtiments ;
- Défenses.

Chaque élément doit avoir : quantité, état éventuel (réservé, démonté, sortie bloquée), info de coût/utilisation au clic/tap.

Un stockage posé ouvre ce même inventaire ; il n’existe pas d’inventaire par bâtiment.

## 6. Démarrage

Écran de déploiement initial : plateau vide, kit initial disponible. Le joueur choisit où poser le premier stockage puis organise librement le reste.

Cette phase ne doit pas donner l’impression qu’un stockage invisible existe déjà. Une fois le déploiement amorcé, toutes les contraintes normales s’appliquent.

## 7. Recherche / fiche Corcite

La fiche du Corcite ne duplique pas le HUD. Elle montre surtout :
- identité du Corcite ;
- Intégrité ;
- effets actifs ;
- progression/recherche ;
- compétences/déblocages utiles au proto.

La recherche utilise une vue globale unique. Les raccourcis depuis les bâtiments ouvrent le même nœud/source de vérité.

Afficher : prérequis, coût, durée, effet, niveau, limite répétable totale. Ajouter `Stockage amélioré` aux branches testées.

## 8. Défenses

Vue tactique séparée :
- chemin de 8 positions ;
- inventaire de tours disponibles ;
- une seule famille PROTO-0.2 : **Affaiblissement** ;
- placement/déplacement visuel ;
- ordre de résolution clair ;
- puissance totale d’Affaiblissement lisible ;
- pas de termes historiques Atténuation/Déstructuration/Captation/Stabilisation dans le parcours joueur.

Drag possible sur desktop, mais clic/tap obligatoire.

## 9. Onde et run

L’onde est brutale et impromptue : pas de compteur exact permanent.

Afficher avant l’onde seulement les informations réellement obtenues par l’observation/recherche.

Pendant/après résolution :
- Puissance initiale ;
- réduction séquentielle par chaque tour ;
- Puissance résiduelle ;
- dégâts d’Intégrité ;
- état final.

Fin immédiate :
- résidu `0` → **Victoire du testeur** ;
- Intégrité `0` → **Victoire du jeu** ;
- sinon retour au développement et prochaine onde plus puissante.

L’écran de fin montre durée, nombre d’ondes, évolution économique/défensive et bouton recommencer.

## 10. Accessibilité

- pas de drag obligatoire ;
- pas de hover-only ;
- targets tactiles larges ;
- contraste suffisant ;
- texte lisible ;
- icône jamais seule pour une information critique ;
- état sélectionné/bloqué/actif distinct visuellement et textuellement ;
- responsive sans horizontal scroll structurel sur mobile.

## 11. Ambiance visuelle

L’interface doit déjà se rapprocher d’Avelune :
- queer, onirique, féerique sans fantasy médiévale ;
- organique, minérale, biomorphique, légèrement florale/abstraite ;
- violet, prune, lavande, opalin, iridescent ;
- lumière douce, surfaces semi-translucides si lisibles ;
- Corcite non anthropomorphe.

Éviter :
- humanoïde/avatar de héros ;
- forêt fantasy générique ;
- architecture médiévale ;
- métal industriel sci-fi générique ;
- bleu/vert RTS générique dominant ;
- décoration qui masque la hiérarchie fonctionnelle.

La priorité reste l’usage, mais Codex doit effectuer un **vrai travail visuel** et pas uniquement brancher des composants bruts.
