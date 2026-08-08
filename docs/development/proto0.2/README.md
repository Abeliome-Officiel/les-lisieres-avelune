# PROTO-0.2 — Dossier de développement

Ce dossier est la **source de travail active** du jalon PROTO-0.2 sur la branche `develop/proto-0.2-ux-rules`.

PROTO-0.2 est un mini-jeu de validation : il doit permettre de tester une boucle complète, lisible et réellement jouable sans prétendre définir déjà le jeu final.

## Jalons Git

La baseline technique issue du premier assemblage complet est conservée sous le tag :

```text
proto-0.2.0-tech
```

Ce jalon est volontairement conservé comme référence : moteur/tests/build/Docker sains, mais UX et rythme humain jugés insuffisants après revue visuelle.

La suite est organisée en sous-versions documentées. Voir :

- [`08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md`](08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md)
- [`09_P02_1_ACCEPTANCE_DELTA.md`](09_P02_1_ACCEPTANCE_DELTA.md)

Principe : lorsqu’une phase atteint un niveau cohérent et vérifié, elle doit être commitée, poussée et, si elle constitue un vrai point de référence/retour arrière, taguée. Ne pas attendre la fin globale du prototype pour créer des jalons utiles.

## Ordre de lecture actif pour Codex

1. `/AGENTS.md`
2. `CODEX_START_HERE.md`
3. `CURRENT_TASK.md`
4. `08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md`
5. `09_P02_1_ACCEPTANCE_DELTA.md`
6. `00_CHARTER.md`
7. `01_RULES_AND_SCOPE.md`
8. `02_UX_SPEC.md`
9. `06_VISUAL_BRIEF_GEN3.md`
10. `03_TECHNICAL_GUARDRAILS.md`
11. `04_ACCEPTANCE.md`
12. `05_EXECUTION_PLAN.md`
13. `TASK_QUEUE.md`
14. `DECISIONS_NEEDED.md`
15. `LEGACY_REFERENCES.md` uniquement comme historique/contextualisation

À partir de PROTO-0.2.1, `08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md` et `09_P02_1_ACCEPTANCE_DELTA.md` prévalent sur les documents 0.2.0 lorsqu’ils signalent explicitement une évolution issue du playtest humain.

`IMPLEMENTATION_REPORT.md` est la sortie d’implémentation et doit refléter l’état réel du code, des tests, simulations et revues humaines.

`TONIGHT_RUN.md` est conservé uniquement comme marqueur historique et est superseded par le lot courant.

## Cible mécanique

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
- inventaire global ;
- fabrication physique : fabriqué → inventaire → posé/utilisé ;
- recherche courte et utile ;
- défense unique : **Affaiblissement** ;
- vague active à **Puissance** unique ;
- Puissance résiduelle à `0` → victoire immédiate du testeur pour l’instant ;
- Intégrité du Corcite à `0` → victoire du jeu ;
- vagues de plus en plus fortes ;
- aucun nombre fixe de vagues ;
- aucune matière de vague/captation dans ce proto.

À partir de PROTO-0.2.2, la première défense d’Affaiblissement doit devenir accessible avec les matières primaires. Transformation devient une montée de sophistication, pas le ticket d’entrée vers la première défense.

Le joueur doit rester libre d’augmenter sa défense par **quantité de tours**, par **amélioration d’efficacité**, ou par combinaison des deux. Aucune voie ne doit être déclarée correcte artificiellement.

Les anciennes notions `pression / structure / charge / matière capturable` sont historiques et ne constituent pas le canon futur de la vague.

## Cible UX / visuelle

Gen3 sert de **référence de composition**, pas de direction artistique littérale.

La composition doit désormais être pensée par blocs fonctionnels réutilisables :

- identité / état du Corcite ;
- ressources ;
- navigation ;
- espace de travail ;
- contexte ;
- activité / productions / rapports.

Desktop organise ces blocs spatialement. Mobile réutilise les mêmes blocs et les mêmes données dans un ordre adapté ; pas de seconde interface parallèle.

Direction provisoire : onirique, queer, organique/minérale, biomorphique, violet/prune/lavande/opaline/iridescente, Corcite non anthropomorphe.

Le résultat doit ressembler à un jeu Avelune testable, pas à un outil administratif.

## Rythme humain

PROTO-0.2 doit rester court et rejouable, mais aucune durée exacte n’est figée tant que le temps humain réel n’est pas mesuré.

La première confrontation doit arriver assez tôt pour enseigner concrètement le danger et la défense, sans punir brutalement un joueur qui découvre encore l’interface.

La montée du Corcite doit suivre une logique de base éprouvée : ouverture lisible, premières capacités rapidement utiles, puis augmentation progressive du débit économique, de la production et du nombre de décisions possibles par cycle.

## Autonomie Codex

Codex peut décider seul des choix purement techniques, de l’architecture locale nécessaire, du CSS, du responsive, de l’accessibilité, des tests et des paramètres numériques de laboratoire.

Il ne doit pas inventer une nouvelle mécanique pour simplifier le code ni figer une zone d’ombre de game design sans source.

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

## Sortie attendue d’un sous-jalon

Avant de considérer un sous-jalon suffisamment cohérent :

- critères de son delta d’acceptation vérifiés ;
- tests pertinents verts ;
- build validé ;
- simulations si la mécanique a changé ;
- responsive contrôlé ;
- passe visuelle humaine effectuée lorsque l’UX change ;
- code mort/contradictions historiques supprimés du parcours actif ;
- documentation et `IMPLEMENTATION_REPORT.md` mis à jour ;
- push de la branche lorsque la phase est suffisamment stable ;
- tag uniquement lorsqu’un vrai point de référence est atteint.

Ne pas merger vers `main` ni déployer publiquement sans instruction explicite.
