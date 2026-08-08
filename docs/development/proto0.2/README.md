# PROTO-0.2 — Dossier de développement

Ce dossier est la **source de travail du jalon PROTO-0.2**. Le sous-jalon courant est désormais **PROTO-0.2.2**, finalisé et poussé sur `develop/proto-0.2.2-playtest`.

PROTO-0.2 reste un mini-jeu de validation : il doit permettre de tester une boucle complète, lisible et réellement jouable sans prétendre définir déjà le jeu final.

## État courant

- branche : `develop/proto-0.2.2-playtest` ;
- commit fonctionnel de référence : `d3b080c` ;
- statut : **validé et prêt à être distribué** ;
- merge `main` : non effectué ;
- tag release : non effectué ;
- déploiement public : action séparée, uniquement sur instruction humaine explicite.

Validation finale connue :

- 380/380 tests ;
- `svelte-check` : 0 erreur, 0 warning ;
- build Docker/production vert ;
- PostgreSQL 17 réel + migration validés ;
- smoke HTTP et garde-fous API validés ;
- feedback PostgreSQL → SMTP réel validé de bout en bout ;
- revue humaine desktop et mobile acceptée.

## Jalons Git

La baseline technique du premier assemblage complet est conservée sous le tag :

```text
proto-0.2.0-tech
```

Le jalon P02.1 a ensuite consolidé UX et règles avant P02.2.

La sous-version distribuée actuelle est décrite par :

- [`10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`](10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md)
- [`11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md`](11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md)
- [`CURRENT_TASK.md`](CURRENT_TASK.md)
- [`TASK_QUEUE.md`](TASK_QUEUE.md)
- [`IMPLEMENTATION_REPORT.md`](IMPLEMENTATION_REPORT.md)

## Ordre de lecture actif

1. `/AGENTS.md`
2. `11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md`
3. `10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`
4. `CURRENT_TASK.md`
5. `08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md`
6. `09_P02_1_ACCEPTANCE_DELTA.md`
7. `01_RULES_AND_SCOPE.md`
8. `02_UX_SPEC.md`
9. `06_VISUAL_BRIEF_GEN3.md`
10. `03_TECHNICAL_GUARDRAILS.md`
11. `04_ACCEPTANCE.md`
12. `TASK_QUEUE.md`
13. `IMPLEMENTATION_REPORT.md`
14. `LEGACY_REFERENCES.md` uniquement comme historique/contextualisation

Le document `11` prévaut lorsqu’il précise ou remplace `10`. Les documents P02.2 prévalent sur les sources P02.0/P02.1 lorsqu’ils actent explicitement une évolution.

## Cible mécanique P02.2

Boucle active :

```text
implanter
→ extraire
→ fabriquer / transformer
→ rechercher / évoluer
→ préparer les défenses
→ subir une vague
→ lire les conséquences
→ adapter
→ gagner ou perdre le run
```

Principes clés :

- structure hexagonale simple du Corcite ;
- `1 bâtiment = 1 case` ;
- ressources de sol pour l’extraction ;
- pas d’adjacence ou de logistique spatiale active ;
- pas de réseau direct/ports/câbles/Factorio dans le parcours joueur ;
- stockage fourni uniquement par les bâtiments de stockage ;
- Stock global ;
- fabrication physique : fabriqué → stock → posé/utilisé ;
- légère asymétrie Organique / Minéral ;
- recherche courte et utile ;
- défense unique : **Affaiblissement** ;
- vague active à **Puissance** unique ;
- première défense accessible depuis les matières primaires ;
- Puissance résiduelle à `0` → victoire immédiate du testeur pour ce jalon ;
- Intégrité du Corcite à `0` → victoire du jeu ;
- vagues de plus en plus fortes ;
- aucun nombre fixe de vagues ;
- aucune matière de vague/captation dans ce proto.

Le joueur doit rester libre d’augmenter sa défense par **quantité de tours**, par **amélioration d’efficacité**, ou par combinaison des deux. Aucune voie ne doit être déclarée correcte artificiellement.

Les anciennes notions `pression / structure / charge / matière capturable` sont historiques et ne constituent pas le canon futur de la vague.

## Playtest distribué

P02.2 ajoute uniquement l’infrastructure nécessaire à la collecte :

- session anonyme ;
- UUID interne ;
- code public à quatre chiffres ;
- sauvegarde PostgreSQL ;
- LWW avec journalisation des conflits ;
- télémétrie structurée minimale ;
- classification des cycles vides ;
- feedback permanent ;
- stockage DB avant SMTP ;
- SMTP facultatif et non destructif.

Ce lot n’ajoute ni comptes utilisateurs, ni vrai multijoueur, ni analytics générique.

## Cible UX / visuelle

Gen3 sert de **référence de composition**, pas de direction artistique littérale.

La composition est pensée par blocs fonctionnels réutilisables :

- identité / état du Corcite ;
- ressources ;
- navigation ;
- plateau / espace de travail ;
- contexte ;
- Session ;
- activité / productions / rapports.

Desktop organise ces blocs spatialement. Mobile réutilise les mêmes blocs et les mêmes données dans un ordre adapté ; pas de seconde interface parallèle.

Direction provisoire : onirique, queer, organique/minérale, biomorphique, violet/prune/lavande/opaline/iridescente, Corcite non anthropomorphe.

Le résultat doit ressembler à un jeu Avelune testable, pas à un outil administratif.

La représentation graphique actuelle du Corcite n’est **pas figée**. Une exploration comparative de plusieurs directions visuelles distinctes peut continuer sans modifier les mécaniques du playtest.

### Dette UI acceptée pour la diffusion

- doubles bordures/superpositions légères de certains hexagones ;
- espace autour du plateau encore sous-exploité ;
- panneau droit encore sous-exploité ;
- possibilité future de déplacer certaines informations/actions globales vers la périphérie du plateau ou la zone droite.

Ne pas rouvrir ces points pendant la collecte sauf blocage réel.

## Rythme humain

PROTO-0.2 doit rester court et rejouable, mais aucune durée exacte n’est figée tant que le temps humain réel n’est pas mesuré.

P02.2 instrumente les cycles `forced_wait` et `voluntary_wait` afin de mesurer le rythme avant d’ajouter une mécanique destinée à remplir artificiellement les temps morts.

## Autonomie Codex

Codex peut décider seul des choix purement techniques, de l’architecture locale nécessaire, du CSS, du responsive, de l’accessibilité, des tests et des paramètres numériques de laboratoire.

Il ne doit pas inventer une nouvelle mécanique pour simplifier le code ni figer une zone d’ombre de game design sans source.

Après distribution de P02.2, les changements fonctionnels doivent rester gelés hors bugs bloquants.

## Lancement détaché depuis Wetty

Voir : [`07_CODEX_LONG_RUN_WETTY.md`](07_CODEX_LONG_RUN_WETTY.md)

Worktree actif connu :

```text
/SSD-Sata/Projets/Avelune-Officiel/repository-proto02
```

Branche :

```text
develop/proto-0.2.2-playtest
```

Les gros collages Wetty sont considérés peu fiables : privilégier des commandes courtes et séparer création de prompt, contrôle puis lancement.

## Sortie attendue d’un sous-jalon

Avant de considérer un sous-jalon suffisamment cohérent :

- critères d’acceptation vérifiés ;
- tests pertinents verts ;
- build validé ;
- simulations si la mécanique a changé ;
- responsive contrôlé ;
- passe visuelle humaine effectuée lorsque l’UX change ;
- documentation et `IMPLEMENTATION_REPORT.md` mis à jour ;
- push de la branche lorsque la phase est suffisamment stable ;
- tag uniquement lorsqu’un vrai point de référence est décidé.

PROTO-0.2.2 satisfait ces critères de diffusion. Ne pas merger vers `main` ni déployer publiquement sans instruction explicite.
