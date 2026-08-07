# AGENTS.md — règles d’exécution pour Avelune

Ce dépôt contient le prototype jouable des **Lisières d’Avelune**. Les agents de code traitent les documents de conception comme des contraintes. Ils ne doivent pas réinterpréter le game design pour simplifier l’implémentation.

## Hiérarchie des sources PROTO-0.2

1. `docs/development/proto0.2/CURRENT_TASK.md` — mission exécutable actuelle.
2. `docs/development/proto0.2/01_RULES_AND_SCOPE.md` — règles mécaniques actées.
3. `docs/development/proto0.2/02_UX_SPEC.md` — ergonomie et composition.
4. `docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md` — référence visuelle textuelle issue de Gen3 et corrections.
5. `docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md` — architecture et garde-fous.
6. `docs/development/proto0.2/04_ACCEPTANCE.md` — critères de sortie.
7. `docs/conception/` — contexte plus large, uniquement s’il ne contredit pas les sources ci-dessus.
8. Code/tests existants — état historique à migrer, pas autorité de game design lorsqu’ils sont contredits.

En cas de contradiction, **ne pas inventer une nouvelle règle**. Appliquer la source de rang supérieur. Si le conflit reste réel et bloque une décision de game design, l’écrire dans `DECISIONS_NEEDED.md`, continuer tout travail indépendant, puis s’arrêter seulement lorsque plus aucun travail sûr n’est possible.

## Rôle de Codex

Codex est l’agent d’implémentation, refactorisation, validation, intégration visuelle et équilibrage de laboratoire du PROTO-0.2. Il travaille de manière autonome sur les problèmes techniques et peut itérer longtemps : inspecter, modifier, tester, simuler, corriger, améliorer l’UX, puis recommencer.

L’utilisateur a explicitement autorisé un lot de plusieurs heures. Ne s’arrêter ni après une première compilation verte, ni après une première page fonctionnelle si les critères du lot restent incomplets.

## Toujours

- Inspecter l’état réel du dépôt, de la branche et des tests avant de modifier.
- Préserver/réutiliser les moteurs historiques compatibles, mais supprimer du parcours PROTO-0.2 les concepts explicitement abandonnés.
- Séparer autant que possible **données / moteur / état / présentation / interactions**.
- Privilégier des primitives réutilisables plutôt que du code spécifique à une page.
- Ajouter/adaptater les tests à toute règle modifiée.
- Exécuter les contrôles pertinents après chaque lot cohérent et corriger jusqu’au vert.
- Faire des simulations déterministes pour calibrer la seule difficulté centrale du proto : croissance des ondes versus progression défensive/intégrité.
- Conserver des interactions clic/tap/clavier ; un drag éventuel ne doit jamais être obligatoire.
- Afficher les erreurs/blocages en langage joueur ; ne pas exposer inutilement les identifiants internes.
- Conserver le rapport de vague distinct des rapports de tour et des logs techniques.
- Garder les paramètres d’équilibrage centralisés/configurables.
- Mettre à jour `IMPLEMENTATION_REPORT.md` avant de s’arrêter.

## Ne jamais

- Ne jamais inventer une mécanique pour faciliter le code.
- Ne jamais réintroduire la **réserve énergétique courte**.
- Ne jamais réintroduire un quota arbitraire « un ordre TF + un ordre TD + un ordre RPG par tour ».
- Ne jamais transformer le RPG en troisième boucle symétrique d’ordres.
- Ne jamais exposer `TF`, `TD` ou `RPG` comme terminologie joueur.
- Ne jamais ajouter de matériaux issus des ondes dans PROTO-0.2.
- Ne jamais réintroduire dans le parcours actif : réseau direct entre bâtiments, ports, câbles, routage, priorités de flux, graphe Factorio/LabVIEW, convoyeurs ou buffers configurables.
- Ne jamais ajouter adjacence, distance, orientation, bâtiments multi-cases, routes ou logistique spatiale sur le plateau économique.
- Ne jamais conserver l’ancien espace abstrait en parallèle du nouveau plateau où `1 bâtiment = 1 case`.
- Ne jamais conserver une capacité de stockage native du Corcite : le stockage mécanique vient des bâtiments de stockage.
- Ne jamais faire dépendre la victoire de pression/structure/charge/matière capturable dans ce proto : la vague active utilise une **Puissance** unique.
- Ne jamais ajouter de captation/matière de vague au PROTO-0.2.
- Ne jamais imposer le drag-and-drop comme seul moyen d’agir.
- Ne jamais supprimer automatiquement une branche Git.
- Ne jamais faire de `push --force`, réécrire l’historique ou merger dans `main` sans instruction explicite.
- Ne jamais déployer publiquement sans instruction explicite.
- Ne jamais utiliser `exit` dans un script destiné au shell interactif du projet.

## Contrôles de base connus

Le projet applicatif est dans `app/`, SvelteKit + TypeScript. Contrôles connus :

```bash
npm run check
npm run test:proto0
npm run build
```

Node déclaré : `>=24 <25`.

Ne pas supposer que npm doit être exécuté sur l’hôte : lire les README et l’infrastructure Docker avant de choisir la stratégie de validation.

## Politique d’arrêt

Ne demander une décision humaine que lorsque deux solutions techniquement valides changent réellement le game design, l’intention UX, une donnée canonique ou la portée fonctionnelle.

Pour les types, imports, fixtures, CSS, composants, responsive, accessibilité, architecture locale, tests, simulation, réglage numérique de laboratoire dans les bornes de `CURRENT_TASK.md`, ou correction d’une régression : **décider, corriger et poursuivre**.
