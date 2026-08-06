# CURRENT TASK — P02-001 — Construire le premier mini-jeu PROTO-0.2

**Status : READY**

**Base attendue : `develop/proto-0.2-ux-rules`**

## Mission

Transformer l’état actuel du prototype en une **première version jouable PROTO-0.2** centrée sur la nouvelle ergonomie et l’affinage des règles, sans consacrer la session à la direction artistique.

Cette tâche est volontairement large : l’objectif de la session est de profiter de Codex pour effectuer en autonomie les modifications multi-fichiers, contrôles, tests et corrections qui seraient lentes via Wetty.

Lire obligatoirement avant de coder :

1. `/AGENTS.md`
2. `docs/development/proto0.2/00_CHARTER.md`
3. `docs/development/proto0.2/01_RULES_AND_SCOPE.md`
4. `docs/development/proto0.2/02_UX_SPEC.md`
5. `docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md`
6. `docs/development/proto0.2/04_ACCEPTANCE.md`
7. `docs/conception/04_tf_ergonomie_et_modele_mental_2026-08-06.md`

Puis inspecter le code réel avant de décider où intervenir.

---

# 1. Priorité absolue

Livrer un **mini-jeu assemblé et jouable**, même encore brut visuellement.

Ne pas passer une grande partie du temps à polir la couleur, les ombres, les animations ou une direction artistique définitive.

Utiliser un style simple, cohérent, lisible, avec éventuellement une ambiance Avelune légère. Les composants qui ont vocation à survivre doivent être propres ; les habillages expérimentaux peuvent rester simples.

---

# 2. Première étape obligatoire : diagnostic rapide

Avant toute modification importante :

- vérifier branche, état Git et historique récent ;
- inventorier l’architecture réelle de `app/src/lib/proto0`, `app/src/lib/components`, `app/src/routes` et `app/tests/proto0` ;
- identifier précisément le modèle énergie/réserve existant ;
- identifier le modèle population / structures actives ;
- identifier le système de connexions réseau ;
- identifier le parcours recherche/évolution jouable ;
- identifier le TD / placement / résolution ;
- identifier le mécanisme actuel de vague, préparation et compte à rebours ;
- identifier toute persistance navigateur existante ;
- lire les README Docker/validation avant d’exécuter npm sur l’hôte.

Si le worktree comporte des modifications utilisateur non comprises, **ne pas les écraser**. Documenter et travailler dans une branche/worktree sûr si nécessaire.

---

# 3. Implémentation cible — ordre conseillé

L’ordre est indicatif. Réorganiser techniquement si nécessaire sans changer les règles.

## A. Énergie simple

- retirer du parcours PROTO-0.2 la réserve énergétique courte ;
- `utilisée / capacité` devient la seule lecture normale ;
- adapter moteur jouable, présentation et tests ;
- préserver l’historique hors parcours si nécessaire, sans maintenir deux vérités concurrentes dans PROTO-0.2.

## B. États fonction + population

Introduire proprement la distinction :

- fonction ON ;
- fonction OFF mais population encore affectée ;
- population retirée / fonction non staffée.

Règles actées :
- OFF arrête la production ;
- OFF libère l’énergie ;
- OFF ne libère pas la population ;
- retrait de population libère immédiatement le travail ;
- une fonction nécessitant du personnel ne travaille pas si non staffée ;
- liens conservés mais suspendus pendant OFF plutôt que détruits.

Ne pas inventer une nouvelle règle d’entretien si l’existant ne permet pas de la déduire proprement : conserver le comportement compatible ou remonter la décision.

## C. Socle UI réutilisable

Créer/réutiliser proprement les briques nécessaires :

- bandeau ressources ;
- bandeau capacités ;
- nœud de production générique ;
- breakdown de modificateurs ;
- primitive de ports/connexions ;
- pool population ;
- primitive défense/path si nécessaire ;
- panneau évolution/recherche réutilisable.

Ne pas créer de doublons si des composants actuels peuvent être adaptés proprement.

## D. Vue productive principale

Remplacer la compréhension par tableaux/formulaires par une représentation visuelle fonctionnelle :

- stocks comme hub/router mental par défaut ;
- bâtiments productifs visibles ;
- entrées/sorties lisibles ;
- liens directs affichés ;
- état ON/OFF visible ;
- personnel visible ;
- résultat de production visible ;
- ressources/capacités toujours accessibles.

Le layout peut être automatique/simple. Ne pas construire un canvas libre complet.

## E. Connexions

Supprimer du parcours normal la saisie `source + destination + ressource`.

Cible :
- interaction port de sortie → port d’entrée compatible ;
- ressource déduite ;
- destinations incompatibles non proposées ;
- drag/pointer souhaité si raisonnablement implémentable ce soir ;
- alternative clic/tap obligatoire ;
- lien suspendu quand fonction OFF.

Si le drag complet menace le délai, livrer d’abord une interaction clic-port → clic-port très visuelle et structurée dans une primitive extensible, puis ajouter le pointer drag si le temps le permet.

## F. Population manipulable

Cible :
- population disponible visible ;
- affecter une unité de travail à une fonction ;
- retirer vers le pool ;
- drag/pointer souhaité ;
- alternative clic/tap obligatoire ;
- pas d’individus ni microgestion.

## G. RPG / évolution transversal

Ne pas sacrifier cette partie pour finir l’UI productive.

- garder/adapter le parcours de recherche actuel ;
- rendre la recherche en cours et les choix/découvertes visibles ;
- montrer les impacts sur les fonctions concernées ;
- utiliser `ModifierBreakdown` ou équivalent : base, pourcentage si réel, delta, résultat ;
- conserver la temporalité jouable existante validée (recherche PROTO jouable à 1 tour ; historique distinct si présent) ;
- si possible, fournir au moins une vraie bifurcation de choix utilisant les mécanismes existants, sans créer un arbre RPG complet.

## H. Défenses

Refondre suffisamment l’ergonomie pour obtenir :
- inventaire lisible ;
- chemin lisible ;
- positions claires ;
- placement/déplacement direct ;
- drag souhaité avec fallback clic/tap ;
- ordre de résolution visible ;
- effets du moteur existant préservés.

## I. Onde

- retirer de l’interface joueur le compte à rebours gratuit permanent ;
- conserver une logique déterministe/seedée cachée si utile aux tests ;
- préserver le rapport de fin d’onde distinct des rapports de tour ;
- si la mécanique actuelle est trop couplée à une phase de préparation annoncée, faire la modification minimale sûre pour obtenir un déclenchement joueur non précisément connu et documenter les limites restantes.

## J. Sauvegarde locale

Créer une primitive versionnée de sauvegarde/restauration du run jouable :
- autosave ;
- restauration ;
- données invalides gérées sans crash ;
- nouvelle partie explicite ;
- tests roundtrip ciblés.

## K. Mini-jeu borné

Si possible dans le temps disponible :
- compter les ondes traversées ;
- cible de run : 3 ondes ;
- afficher une fin de prototype simple avec quelques statistiques déjà disponibles ;
- permettre de recommencer.

Si cette partie menace la stabilité du cœur UX, elle passe après les gates production/RPG/défense/onde.

---

# 4. Ce qui doit rester hors du lot

Ne pas ajouter :
- nouveaux matériaux ;
- matériaux récupérés dans les ondes comme nouvelles ressources de production ;
- consommables de futures tours ;
- races/classes complètes ;
- nouveau lore ;
- social/multijoueur ;
- commerce ;
- météo ;
- temps réel ;
- éditeur de graphe industriel généraliste ;
- direction artistique finale.

---

# 5. Autonomie accordée

Tu peux décider sans demander :
- découpage de composants ;
- noms internes cohérents ;
- refactors locaux nécessaires ;
- choix CSS/layout purement ergonomiques ;
- stratégie de tests ;
- organisation des helpers ;
- corrections de types/imports/fixtures ;
- choix entre SVG/HTML/CSS pour les connexions si l’API reste extensible ;
- petits ajustements de responsive/accessibilité nécessaires.

Tu dois demander/documenter si une décision change :
- une règle de jeu non explicitement définie ;
- l’économie/équilibrage de façon substantielle ;
- le rôle du RPG ;
- le sens mécanique des connexions ;
- les effets de OFF / population / entretien au-delà de ce qui est acté ;
- la logique fondamentale de l’onde ;
- le périmètre du prototype.

Ne bloque pas tout le lot pour une question localisée : consigner dans `DECISIONS_NEEDED.md` et poursuivre les travaux indépendants.

---

# 6. Boucle de travail attendue

Ne t’arrête pas à la première erreur.

```text
inspecter
→ implémenter
→ formatter/typecheck/tester/build
→ diagnostiquer
→ corriger
→ retester
→ répéter jusqu’au vert ou décision humaine réelle
```

Ne pas supprimer/désactiver un test uniquement pour faire passer la suite.

---

# 7. Rapport attendu

À la fin, créer ou mettre à jour :

`docs/development/proto0.2/IMPLEMENTATION_REPORT.md`

Il doit contenir :
- statut `REVIEW_READY`, `PARTIAL` ou `DECISION_REQUIRED` ;
- branche/commit ;
- résumé de ce qui est réellement jouable ;
- fichiers/blocs principaux modifiés ;
- briques réutilisables créées ;
- contrôles exécutés avec résultats ;
- éventuels tests non exécutables et pourquoi ;
- écarts par rapport à la spécification ;
- dette volontaire restante ;
- décisions requises ;
- instructions exactes pour lancer/déployer/tester le résultat.

Si l’environnement de staging existe et peut être utilisé sans risque, préparer/déployer uniquement selon les règles d’infrastructure existantes. Ne pas inventer de déploiement ni toucher à la production publique sans autorisation.

---

# 8. Définition de « terminé ce soir »

Un résultat acceptable est une **alpha PROTO-0.2 réellement jouable** où le joueur peut observer et manipuler le Corcite de façon nettement plus directe qu’en PROTO-0.1, avec production, évolution/RPG, défenses et onde encore connectées dans la même boucle.

Le polish graphique, les animations et la finition exhaustive peuvent attendre.
