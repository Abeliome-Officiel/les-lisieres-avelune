# CODEX — START HERE — PROTO-0.2

Tu travailles sur **Les Lisières d’Avelune — PROTO-0.2**.

## Instruction de départ

1. Vérifie que tu es sur une branche de travail dérivée de `develop/proto-0.2-ux-rules`.
2. Lis `/AGENTS.md` puis l’ensemble du dossier `docs/development/proto0.2/`.
3. Inspecte l’état réel du dépôt avant toute modification.
4. Exécute `CURRENT_TASK.md` de manière autonome jusqu’à `REVIEW_READY`, `PARTIAL`, `DECISION_REQUIRED` ou `BLOCKED_TECHNICAL`.
5. Pour les problèmes purement techniques : diagnostique, corrige et poursuis sans demander d’autorisation.
6. Pour une vraie décision de jeu ou d’UX intentionnelle : consigne-la dans `DECISIONS_NEEDED.md`, poursuis tout ce qui est indépendant, puis indique clairement le blocage.
7. Mets à jour `IMPLEMENTATION_REPORT.md` avant de terminer.
8. Ne merge pas `main`, ne force-push pas, ne supprime pas de branche et ne modifie pas un environnement public sans instruction explicite.

## Priorité de ce premier run

Le premier run doit privilégier **l’ergonomie fonctionnelle et le mini-jeu jouable**, pas la finition esthétique.

Si le temps est limité, prioriser dans cet ordre :

1. règles énergie/population cohérentes ;
2. bandeau ressources/capacités ;
3. vue productive lisible ;
4. connexions plus naturelles ;
5. RPG/évolution visible et impactant ;
6. défenses manipulables ;
7. onde sans compte à rebours gratuit ;
8. persistance locale ;
9. fin de run / polish / E2E complémentaires.

Ne jamais sacrifier complètement le RPG ou les défenses pour finir uniquement l’écran de production.

## Phrase de lancement recommandée pour une session interactive

> Lis `AGENTS.md` et `docs/development/proto0.2/CODEX_START_HERE.md`, puis exécute entièrement `docs/development/proto0.2/CURRENT_TASK.md`. Travaille de manière autonome sur les problèmes techniques, teste et corrige jusqu’au vert, et ne m’interromps que pour une véritable décision de game design/UX ou un blocage externe. Mets à jour le rapport avant de t’arrêter.

Cette phrase doit suffire : les détails de conception sont dans le dépôt.
