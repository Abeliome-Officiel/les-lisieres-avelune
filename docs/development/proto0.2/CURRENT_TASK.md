# CURRENT TASK — P02-003 — PROTO-0.2.2 pack de playtest distribué

**Status : READY_FOR_LONG_CODEX_RUN**

**Branche obligatoire : `develop/proto-0.2.2-playtest`**

**Base fonctionnelle : `27a703294498ec9b9cacd1175841f18405a36fa8`**

## Mission

Transformer PROTO-0.2.1 en une version **diffusable pendant quelques semaines**, sans ouvrir la prochaine grande phase de conception.

Le lot doit permettre à un testeur anonyme de :

1. comprendre immédiatement ce qu'il teste ;
2. créer une partie avec un code numérique à 4 chiffres ;
3. reprendre cette partie plus tard ou depuis un autre appareil ;
4. jouer le même PROTO-0.2 sans réinvention mécanique ;
5. signaler à tout moment bug, incompréhension, idée, désaccord, optimisation ou proposition ;
6. produire une télémétrie minimale permettant d'analyser rythme, blocages et cycles vides ;
7. conserver ses données côté serveur.

Aucun quota artificiel de sessions n'est demandé.

## Sources normatives principales

Lire en premier, dans cet ordre :

1. `docs/development/proto0.2/10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`
2. `docs/development/proto0.2/11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md`

Le document `11` prévaut lorsqu'il précise ou remplace le document `10`.

Lire ensuite :

1. `/AGENTS.md`
2. `docs/development/proto0.2/08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md`
3. `docs/development/proto0.2/09_P02_1_ACCEPTANCE_DELTA.md`
4. `docs/development/proto0.2/01_RULES_AND_SCOPE.md`
5. `docs/development/proto0.2/02_UX_SPEC.md`
6. `docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md`
7. code et tests réels.

## Ordre de travail attendu

Traiter le lot par gates autonomes. Ne pas attendre une intervention humaine entre deux gates si les tests sont verts et qu'aucune décision de game design n'est nécessaire.

### Gate A — corrections UX et économie de laboratoire

- corriger la tessellation mobile qui chevauche les hexagones ;
- remplacer l'inventaire permanent par la vue globale `Stock` définie dans le document 11 ;
- clic/tap sur une unité de stockage → ouvrir ce même stock global ;
- clic/tap sur une case vide → contexte `Implanter` avec ce qui est réellement en stock et posable ;
- Production : afficher possédé en stock, posé, coût, durée ; griser toute action impossible et expliquer exactement ce qui manque ;
- appliquer l'asymétrie Organique / Minéral et les coûts P02.2 du document 11 ;
- refondre la résolution de cycle pour produire un résultat structuré exhaustif réutilisable par le rapport et la télémétrie ;
- mesurer `forced_wait` / `voluntary_wait` sans ajouter de mécanique de remplissage ;
- simulations et tests de non-soft-lock après modification des coûts.

### Gate B — sessions serveur

- PostgreSQL minimal, sans ORM lourd ;
- migration explicite ;
- identifiant interne de session indépendant du code public ;
- création/reprise/sauvegarde par code 4 chiffres ;
- aucune limite artificielle du nombre de sessions ;
- codes accessibles uniques ; collision → choisir un autre code ;
- écran d'entrée ;
- versionnement de sauvegarde ;
- suppression du sélecteur des cinq profils du parcours public ;
- repositories testables sans DB réelle ;
- tests.

### Gate C — télémétrie et feedback

- journalisation serveur structurée ;
- métriques de cycles vides ;
- formulaire permanent `Signaler / proposer` ;
- stockage feedback en DB AVANT notification ;
- SMTP facultatif via variables d'environnement ;
- échec SMTP non bloquant ;
- tests.

### Gate D — notice, intégration, qualité

- introduction avant partie ;
- notice/règles consultables pendant le jeu ;
- rappel explicite de communiquer bugs, idées, désaccords et optimisations ;
- ressources compactes `icône + nom + quantité` ;
- état de session/sauvegarde placé dans la zone droite sans le confondre avec le contexte de case ;
- version/commit visible discrètement ;
- responsive 390×844 et 360×800 en priorité ;
- check/tests/simulation/build/diff-check ;
- smoke HTTP/Docker hors sandbox si disponible ;
- `IMPLEMENTATION_REPORT.md` à jour ;
- commits cohérents.

## Arbitrage explicite sur les cycles vides

Ne pas ajouter ce soir d'action artificielle ou de nouvelle mécanique pour combler les cycles sans choix.

Le signal humain actuel est trop faible pour justifier une modification de game design. Instrumenter d'abord la fréquence et les causes des `forced_wait` sur les parties distribuées.

## Feedback externe

Pour ce lot : **SMTP + PostgreSQL**, pas création automatique d'issue GitHub.

La base est la source de vérité. Si l'email échoue, le feedback reste enregistré et le joueur ne doit rien ressaisir.

## Secrets

Ne jamais committer :

- `DATABASE_URL` réelle ;
- mots de passe PostgreSQL ;
- identifiants SMTP ;
- adresse privée si elle ne doit pas être publique ;
- jetons quelconques.

Documenter seulement les noms de variables d'environnement.

## Interdictions

Ne pas :

- créer un compte utilisateur ;
- créer du vrai multijoueur ;
- ajouter une nouvelle famille de tour ;
- ajouter une ressource ;
- changer les conditions de victoire ;
- refaire le rythme des vagues ;
- transformer le prototype en survival game ;
- créer un système analytics générique ;
- ajouter de dépendance lourde sans nécessité ;
- merger `main` ;
- taguer ;
- déployer publiquement sans instruction humaine explicite.

## Validation finale

Avant de déclarer `REVIEW_READY` :

- `npm run check` vert ;
- `npm run test:proto0` vert ;
- `npm run simulate:proto02` vert ;
- `npm run build` vert ;
- `git diff --check` vert ;
- tests des repositories/API/feedback ;
- échec SMTP testé comme non destructif ;
- session créée puis reprise ;
- rapport de cycle exhaustif sur cas représentatifs ;
- aucune superposition des hexagones aux breakpoints mobiles définis ;
- aucune impasse économique structurelle introduite par l'asymétrie Organique / Minéral ;
- `IMPLEMENTATION_REPORT.md` reflète exactement les validations réellement effectuées.

Après validation, pousser uniquement `develop/proto-0.2.2-playtest`. Ne pas merger `main` et ne pas déployer sans ordre humain.
