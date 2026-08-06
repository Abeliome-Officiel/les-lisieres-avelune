# AGENTS.md — règles d’exécution pour Avelune

Ce dépôt contient un prototype jouable des **Lisières d’Avelune**. Les agents de code doivent traiter les documents de conception comme des contraintes, pas comme des suggestions à réinterpréter librement.

## Hiérarchie des sources

1. `docs/development/proto0.2/CURRENT_TASK.md` pour le lot en cours.
2. `docs/development/proto0.2/01_RULES_AND_SCOPE.md` pour les règles et le périmètre PROTO-0.2.
3. `docs/development/proto0.2/02_UX_SPEC.md` pour l’ergonomie visée.
4. `docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md` pour l’architecture et les garde-fous.
5. `docs/conception/` pour le référentiel plus large du projet.
6. Le code et les tests existants pour l’état réel de l’implémentation.

En cas de contradiction, **ne pas inventer une nouvelle règle** : documenter le conflit dans `docs/development/proto0.2/DECISIONS_NEEDED.md` et continuer tout travail indépendant.

## Rôle de Codex

Codex est ici un **agent d’implémentation, de refactorisation et de validation technique**. Il peut prendre seul les décisions purement techniques compatibles avec les contraintes ci-dessous. Il ne devient pas game designer autonome.

## Toujours

- Inspecter l’état réel du dépôt avant de modifier.
- Préserver et réutiliser les moteurs existants lorsqu’ils sont compatibles avec la cible.
- Séparer autant que possible **données / moteur / présentation / interactions**.
- Favoriser les blocs réutilisables plutôt que du code spécifique à une seule page.
- Ajouter ou adapter les tests pour toute règle modifiée.
- Lancer les contrôles pertinents après modification et corriger jusqu’au vert ou jusqu’à une vraie décision de conception bloquante.
- Conserver les alternatives clic/tap/clavier lorsqu’un drag-and-drop est introduit.
- Rendre les erreurs et blocages compréhensibles côté joueur ; ne pas exposer les identifiants internes inutilement.
- Conserver les rapports joueur distincts des logs techniques.
- Documenter précisément tout compromis ou limite connue dans le rapport de fin de tâche.

## Ne jamais

- Ne jamais inventer une mécanique pour simplifier l’implémentation.
- Ne jamais réintroduire la **réserve énergétique courte**.
- Ne jamais réintroduire une limite arbitraire du type « un ordre TF + un ordre TD + un ordre RPG par tour ».
- Ne jamais transformer le RPG en troisième boucle mécanique d’ordres équivalente à la production ou à la défense.
- Ne jamais exposer `TF`, `TD` ou `RPG` comme terminologie joueur.
- Ne jamais ajouter de nouveaux matériaux à PROTO-0.2 ; l’idée des matériaux issus des ondes est future uniquement.
- Ne jamais transformer PROTO-0.2 en éditeur de graphe libre complexe de type LabVIEW complet.
- Ne jamais imposer le drag-and-drop comme seul moyen d’agir.
- Ne jamais supprimer automatiquement une branche Git.
- Ne jamais faire de `push --force`, réécrire l’historique ou merger dans `main` sans instruction explicite.
- Ne jamais déployer sur un environnement public sans instruction explicite et vérification préalable de l’infrastructure réelle.
- Ne jamais utiliser `exit` dans un script destiné à être lancé manuellement dans le shell interactif du projet ; préférer un retour d’erreur du sous-processus ou du script.

## Contrôles de base connus

Le projet applicatif est dans `app/` et utilise SvelteKit + TypeScript. Les scripts actuellement disponibles incluent :

```bash
npm run check
npm run test:proto0
npm run build
```

La version Node déclarée est `>=24 <25`.

Ne pas supposer que npm doit être installé/utilisé sur l’hôte : inspecter les README et l’infrastructure Docker existante avant d’exécuter ou de modifier la stratégie de validation.

## Politique d’arrêt

Ne demander une décision humaine que lorsqu’au moins deux solutions techniquement valides changent réellement :

- la mécanique de jeu ;
- l’intention UX ;
- la difficulté ou l’économie ;
- la portée fonctionnelle ;
- une donnée canonique du projet.

Pour une erreur de code, un test cassé par l’implémentation, un import, un type, une fixture, une structure de composant ou un détail CSS purement technique : **corriger et poursuivre sans interrompre le lot**.
