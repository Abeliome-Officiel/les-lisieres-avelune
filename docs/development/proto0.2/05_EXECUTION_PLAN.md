# PROTO-0.2 — Plan d’exécution agentique

## Finalité

Ce document organise le travail de Codex en blocs suffisamment grands pour qu’il puisse travailler **plusieurs heures sans supervision technique continue**, tout en laissant les décisions de game design à la discussion humaine.

Le développement est volontairement piloté par **playtests courts et fréquents** : pendant qu’un lot est codé, le prochain lot peut être préparé à partir des retours du joueur.

## Cadence cible

Les fenêtres de travail typiques peuvent être :

- matin : ~3 h ;
- midi : ~2 h ;
- après-midi : ~4 h ;
- soir : ~3 h ;
- nuit : jusqu’à ~8 h.

Ces durées sont des **budgets d’autonomie**, pas des deadlines rigides ni des raisons d’élargir artificiellement le périmètre.

## Règle d’utilisation du temps

Priorité stricte :

1. rendre le parcours demandé jouable ;
2. corriger les erreurs/régressions ;
3. renforcer les briques réutilisables directement impliquées ;
4. ajouter les tests utiles ;
5. améliorer l’ergonomie fonctionnelle ;
6. documenter ;
7. seulement s’il reste du temps et qu’une spécification existe déjà : travaux préparatoires non bloquants.

Ne jamais remplir le temps par de nouvelles mécaniques ou une direction artistique inventée.

## Travaux de remplissage autorisés uniquement si le lot principal est terminé

Codex peut, sans nouvelle décision de game design :

- améliorer la couverture de tests des briques créées ;
- factoriser proprement des composants réellement réutilisés ;
- renforcer clavier/tactile/accessibilité ;
- documenter les API internes des nouvelles primitives ;
- préparer des fixtures de playtest ;
- améliorer les outils de diagnostic / logs développeur ;
- préparer des tests E2E pour les parcours déjà spécifiés ;
- nettoyer de petites dettes créées par le lot courant ;
- améliorer le responsive purement ergonomique.

Travaux possibles lors d’un long créneau nocturne **uniquement après spécification humaine préalable** :

- interface graphique plus qualitative ;
- remplissage de données/catalogues ;
- vocabulaire joueur ;
- textes d’ambiance ;
- variantes de layout ;
- enrichissement de contenu.

Sans spécification explicite, ces sujets restent hors périmètre.

## Gestion des décisions

Une question ne doit interrompre le travail que si elle change réellement l’expérience, une règle ou le périmètre.

Si elle est localisée :

1. l’ajouter dans `DECISIONS_NEEDED.md` ;
2. isoler le point dans le code si nécessaire ;
3. poursuivre les parties indépendantes ;
4. produire un résultat partiel testable.

## Gestion du playtest parallèle

Pendant qu’un lot N est en cours, les retours du playtest du lot N-1 sont consignés dans `PLAYTEST_FEEDBACK.md`.

Ils ne doivent **pas** être incorporés silencieusement au lot en cours, sauf :
- correction évidente d’un bug bloquant ;
- consigne explicite ajoutée au `CURRENT_TASK.md` ou à une tâche suivante.

Cette séparation permet de ne pas faire dériver un lot en plein milieu de son implémentation.

## Fin d’un créneau

À la fin de chaque fenêtre autonome, Codex doit laisser le dépôt dans un état explicite :

- `REVIEW_READY` : parcours demandé terminé et contrôles verts ;
- `PARTIAL` : progrès substantiel, état cohérent, limites documentées ;
- `DECISION_REQUIRED` : progression sûre impossible sans arbitrage ;
- `BLOCKED_TECHNICAL` : problème externe/infrastructure non résolu après diagnostic raisonnable.

Aucun lot ne doit se terminer sur un worktree volontairement cassé sans rapport explicite.
