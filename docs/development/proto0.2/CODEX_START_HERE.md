# CODEX — START HERE — PROTO-0.2

Tu travailles sur **Les Lisières d’Avelune — PROTO-0.2**.

## Mode de travail attendu

Cette session est volontairement longue et autonome, mais le périmètre doit rester volontairement petit.

**Long run = finir mieux, pas construire plus.**

Ne t’arrête pas après une première implémentation ou une première suite de tests verte si `CURRENT_TASK.md` reste incomplet. En revanche, n’utilise jamais le temps disponible pour élargir le jeu, généraliser prématurément l’architecture ou préparer des fonctionnalités futures non utilisées.

1. Vérifie que le travail part de `develop/proto-0.2-ux-rules`.
2. Lis `/AGENTS.md`, notamment le principe anti-embonpoint.
3. Lis tout le dossier `docs/development/proto0.2/`, en priorité `CURRENT_TASK.md`, `01_RULES_AND_SCOPE.md`, `02_UX_SPEC.md`, `06_VISUAL_BRIEF_GEN3.md`, `03_TECHNICAL_GUARDRAILS.md`, `04_ACCEPTANCE.md`.
4. Inspecte le code réel avant de modifier.
5. Exécute entièrement `CURRENT_TASK.md`.
6. Travaille par lots cohérents : moteur/état → UI → tests/simulation → correction → passe visuelle → smoke test → simplification.
7. Pour les problèmes techniques, décide et corrige sans demander.
8. Pour une véritable décision de game design non couverte, écris-la dans `DECISIONS_NEEDED.md`, continue tout le reste, puis ne t’arrête que lorsque plus aucun travail indépendant utile n’est possible.
9. Avant `REVIEW_READY`, fais une passe de réduction : supprime le code mort, les doublons et les abstractions sans usage actuel.
10. Mets à jour `IMPLEMENTATION_REPORT.md` avant la fin.
11. Ne merge pas `main`, ne force-push pas et ne déploie pas publiquement.

## Priorités

1. migration vers le plateau hexagonal simple ;
2. suppression du réseau direct du parcours actif ;
3. déploiement initial + stockage uniquement par bâtiments ;
4. économie/fabrication/réservations/sorties bloquées ;
5. recherche et améliorations dont Stockage amélioré ;
6. défense unique Affaiblissement ;
7. onde Puissance croissante + Intégrité + conditions de victoire ;
8. simulations et équilibrage de laboratoire ;
9. persistance simple ;
10. composition UX Gen3 corrigée + vraie passe visuelle Avelune + responsive ;
11. tests/build/smoke, corrections et simplification jusqu’au vert.

La partie visuelle est **dans le lot**, pas une option de fin de session. Gen3 sert de composition ; le brief visuel donne les corrections de thème.

## Règle de taille

Toute nouvelle abstraction, dépendance ou sous-système doit répondre à une exigence actuelle du proto ou supprimer une duplication réelle déjà présente. Sinon, ne pas le créer.

Préférer systématiquement la solution la plus petite qui soit :
- correcte ;
- testable ;
- lisible ;
- raisonnablement réutilisable ;
- suffisante pour le prototype actuel.

Ne pas construire : framework générique, architecture plugin, ECS, event bus global, système de configuration universel, moteur de graphe, moteur de tech-tree généraliste, design system complet ou infrastructure de tests lourde si le besoin actuel peut être couvert plus simplement.

## Phrase de mission

> Exécute entièrement `docs/development/proto0.2/CURRENT_TASK.md` en respectant `AGENTS.md`. Travaille de manière autonome jusqu’à obtenir une alpha PROTO-0.2 sobre, propre et jouable. Utilise le temps long pour terminer, tester, simuler, corriger, améliorer l’UX, le responsive et le visuel Avelune — pas pour élargir le périmètre ni généraliser prématurément l’architecture. Choisis la solution la plus petite qui satisfait proprement le cahier. Ne t’arrête pas à la première passe verte. Fais une passe finale de simplification, mets à jour `IMPLEMENTATION_REPORT.md`, ne merge pas main et ne déploie pas.
