# PROTO-0.2 — Dossier de développement

Ce dossier est la **source de travail active** du jalon PROTO-0.2 sur la branche `develop/proto-0.2-ux-rules`.

PROTO-0.2 est un mini-jeu de validation : il doit permettre de tester une boucle complète, lisible et réellement jouable sans prétendre définir déjà le jeu final.

## Ordre de lecture actif pour Codex

1. `/AGENTS.md`
2. `CODEX_START_HERE.md`
3. `CURRENT_TASK.md`
4. `00_CHARTER.md`
5. `01_RULES_AND_SCOPE.md`
6. `02_UX_SPEC.md`
7. `06_VISUAL_BRIEF_GEN3.md`
8. `03_TECHNICAL_GUARDRAILS.md`
9. `04_ACCEPTANCE.md`
10. `05_EXECUTION_PLAN.md`
11. `TASK_QUEUE.md`
12. `DECISIONS_NEEDED.md`
13. `LEGACY_REFERENCES.md` uniquement comme historique/contextualisation

`IMPLEMENTATION_REPORT.md` est la sortie d’implémentation et doit refléter l’état réel du code, des tests et des simulations.

`TONIGHT_RUN.md` est conservé uniquement comme marqueur historique et est superseded par le lot courant.

## Cible mécanique

Boucle active :

```text
implanter
→ extraire
→ transformer / fabriquer
→ rechercher / évoluer
→ préparer les défenses
→ subir une vague
→ lire les conséquences
→ adapter
→ gagner ou perdre le run
```

Principes clés :

- plateau hexagonal simple ;
- `1 bâtiment = 1 case` ;
- ressources de sol pour l’extraction ;
- pas d’adjacence ou de logistique spatiale active ;
- pas de réseau direct/ports/câbles/Factorio dans le parcours joueur ;
- stockage fourni uniquement par les bâtiments de stockage ;
- inventaire global ;
- fabrication physique : fabriqué → inventaire → posé/utilisé ;
- recherche courte et utile ;
- défense unique : **Affaiblissement** ;
- vague active à **Puissance** unique ;
- Puissance résiduelle à `0` → victoire immédiate du testeur ;
- Intégrité du Corcite à `0` → victoire du jeu ;
- vagues de plus en plus fortes ;
- aucun nombre fixe de vagues ;
- aucune matière de vague/captation dans ce proto.

Les anciennes notions `pression / structure / charge / matière capturable` sont historiques et ne constituent pas le canon futur de la vague.

## Cible UX / visuelle

Gen3 sert de **référence de composition**, pas de direction artistique littérale.

Cible desktop :

- HUD en haut ;
- fiche Corcite à gauche ;
- plateau central dominant ;
- contexte de sélection à droite ;
- inventaire/ordres en bas ;
- vue Défenses séparée et accessible.

Direction provisoire : onirique, queer, organique/minérale, biomorphique, violet/prune/lavande/opaline/iridescente, Corcite non anthropomorphe.

Le résultat doit ressembler à un jeu Avelune testable, pas à un outil administratif.

## Autonomie Codex

Codex peut décider seul des choix purement techniques, de l’architecture locale nécessaire, du CSS, du responsive, de l’accessibilité, des tests et des paramètres numériques de laboratoire.

Il ne doit pas inventer une nouvelle mécanique pour simplifier le code.

En cas de vraie bifurcation de game design non couverte : consigner dans `DECISIONS_NEEDED.md`, continuer tout le travail indépendant, puis s’arrêter uniquement lorsqu’aucun travail sûr ne reste.

## Lancement détaché depuis Wetty

Voir : [`07_CODEX_LONG_RUN_WETTY.md`](07_CODEX_LONG_RUN_WETTY.md)

Worktree actif connu :

```text
/SSD-Sata/Projets/Avelune-Officiel/repository-proto02
```

Branche :

```text
develop/proto-0.2-ux-rules
```

Le lancement doit utiliser `tmux` afin que Codex continue après fermeture de Wetty/SSH.

## Sortie attendue

Avant `REVIEW_READY` :

- gates de `04_ACCEPTANCE.md` vérifiées ;
- tests pertinents verts ;
- build validé ;
- simulations résumées ;
- responsive contrôlé ;
- passe visuelle effectuée ;
- code mort/contradictions historiques supprimés du parcours actif ;
- `IMPLEMENTATION_REPORT.md` mis à jour ;
- aucun push, merge vers `main` ou déploiement sans instruction explicite.
