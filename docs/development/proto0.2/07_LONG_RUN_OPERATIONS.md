# PROTO-0.2 — Opérations du long run Codex

## Objectif de sortie

À la fin du long run, l’utilisateur doit idéalement n’avoir plus qu’à :
1. relire l’état final ;
2. pousser les commits locaux ;
3. déployer selon la procédure existante.

## Git

Codex peut et doit créer des **commits locaux cohérents** sur la branche de travail lorsque le lot est suffisamment stabilisé.

Avant de s’arrêter :
- `git status` propre autant que possible ;
- aucun fichier temporaire/log accidentel ajouté ;
- changements du lot commités localement avec messages explicites ;
- SHA final noté dans `IMPLEMENTATION_REPORT.md` ;
- **aucun push** ;
- aucun merge dans `main` ;
- aucun force-push ;
- aucun déploiement public.

Si un dernier fichier de rapport doit être modifié après un commit, faire un dernier commit local incluant ce rapport afin que le worktree soit propre.

## Autonomie

Continuer les cycles de travail tant qu’une amélioration nécessaire aux critères d’acceptation est faisable sans décision humaine. Les tests verts intermédiaires ne signifient pas que le lot est terminé.
