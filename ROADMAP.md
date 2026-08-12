# Roadmap — Les Lisières d’Avelune

## État au 13 août 2026

Le projet avance actuellement sur **trois axes runtime indépendants** :

| Axe | État | Prochaine gate |
|---|---|---|
| PROTO jouable | PROTO-0.2.2 validé sur `develop/proto-0.2.2-playtest` | playtests puis décision explicite d’intégration |
| Cœur vivant | laboratoire headless, diagnostic R2.10 en cours | identifier le goulot de persistance avant nouveau mécanisme |
| Tableau Réel | Gate 0 validé | Phase B : socle persistant autonome hors PROTO |

Les **univers sonore et visuel** sont cadrés comme chantiers de représentation et de préproduction. Ils ne deviennent pas de nouveaux axes canoniques et ne modifient pas le PROTO courant.

Le LAB VISUEL peut progresser avant l’achèvement du Cœur uniquement à travers un **contrat sémantique versionné** alimenté par fixtures, replays ou adaptateurs. Il ne doit jamais prendre les structures internes du Cœur comme API durable.

Le nettoyage de l’historique GitHub est clos. Le dépôt peut de nouveau être synchronisé normalement, avec contrôle obligatoire des anciens clones/worktrees avant réutilisation.

## 1. PROTO-0.2.2

Le candidat distribué a passé sa gate technique :

- 380 tests réussis ;
- `svelte-check` vert ;
- build production vert ;
- PostgreSQL et migration validés ;
- sessions distribuées, reprise, persistance et conflits validés ;
- feedback persistant et notification validés ;
- revue desktop/mobile acceptable.

### À faire

- [ ] distribuer/continuer le playtest humain ;
- [ ] centraliser les retours sans modifier le jalon hors bug bloquant ;
- [ ] analyser compréhension, rythme, arbitrages, fatigue cognitive et identité visuelle ;
- [ ] décider explicitement si/quand PROTO-0.2.2 devient la nouvelle baseline de `main` ;
- [ ] ne pas injecter automatiquement les moteurs du Cœur dans le prototype.

## 2. Cœur vivant / CŒUR-0

Le Cœur est le monde autonome avant les joueurs. Son implémentation de laboratoire reste séparée du dépôt partageable.

### Acquis

- [x] moteur headless et simulations accélérées ;
- [x] reproductibilité et reprise de baseline ;
- [x] divergence régionale et mémoire locale ;
- [x] campagnes longues multi-seeds ;
- [x] diagnostic de l’établissement ;
- [x] baseline R2.7 réduisant le turnover sans déstabiliser l’occupation globale ;
- [x] identification d’un goulot de disparition avant première propagation locale ;
- [x] principe d’un contrat sémantique de représentation indépendant des internes du Cœur.

### En cours

- [ ] R2.10 : distinguer incapacité à atteindre l’état de propagation, attente avant propagation et érosion par les vagues ;
- [ ] lire la campagne forte avant toute modification mécanique ;
- [ ] si deux mécanismes restent plausibles, les comparer en parallèle sur seeds appariées.

### En parallèle, lorsque le sous-ensemble sémantique suffit

- [ ] définir le plus petit contrat de représentation v0 utile au LAB ;
- [ ] exporter quelques états/replays de référence par adaptateur ;
- [ ] conserver les mécaniques expérimentales derrière l’adaptateur ;
- [ ] tester qu’une révision fictive du Cœur peut être absorbée sans réécrire les interpréteurs.

### Avant instance canonique

- [ ] validation longue supplémentaire lorsque le mécanisme est stabilisé ;
- [ ] validation sauvegarde/restauration/migrations pour durée indéterminée ;
- [ ] Observatoire analytique privé ;
- [ ] stabilisation progressive du contrat sémantique ;
- [ ] validation des budgets cumulés, modes dégradés et stratégie de remplacement ;
- [ ] Orée de production seulement après gates suffisantes ;
- [ ] naissance canonique uniquement après validation des opérations et du comportement long terme.

Voir : `docs/21_coeur_vivant_genese_canonique.md` et `docs/22_coeur_vivant_validation_2026-08-12.md`.

## 3. Tableau Réel — TA3

Le Gate 0 a invalidé l’idée de dépendre du conteneur ou de la base du PROTO.

### Phase A — terminée

- [x] audit du runtime et de la base PROTO ;
- [x] métriques temporaires de sessions identifiées ;
- [x] architecture autonome décidée ;
- [x] date zéro fixée au 26 juillet 2026 ;
- [x] séparation des données destinées à la publication et des données internes.

### Phase B — prochaine

- [ ] auditer le socle persistant hors PROTO ;
- [ ] choisir le plus petit runtime autonome approprié ;
- [ ] créer le stockage TA3 propre ;
- [ ] migrations réversibles et testées si nécessaire ;
- [ ] démontrer que TA3 reste disponible PROTO arrêté.

### Phases suivantes

- [ ] domaine/agrégations et tests ;
- [ ] interface publique ;
- [ ] préchargement des données actées ;
- [ ] adaptateur PROTO unidirectionnel ;
- [ ] énergie/carbone ;
- [ ] acceptation et déploiement.

Voir `docs/real/`.

## 4. Univers sonore — conception future

### Acquis de conception

- [x] le Cœur reste exclusivement le moteur d’évolution du vivant ;
- [x] le sonore est un interpréteur en aval de l’état canonique, au même niveau conceptuel que le visuel ;
- [x] direction : satisfaisante, contemplative, onirique et féerique ;
- [x] séparation musique du monde / sons du jeu / signaux d’information ;
- [x] accessibilité sensorielle paramétrique, sans « mode neuroA » unique ;
- [x] séparation explicite entre contrat partageable et recettes internes.

### À reprendre plus tard

- [ ] définir la grammaire musicale d’Avelune ;
- [ ] définir la mémoire et la transformation des motifs ;
- [ ] arbitrer la part commune au monde et l’adaptation locale ;
- [ ] fixer les contraintes de sécurité et de confort sonore ;
- [ ] mesurer le budget CPU/RAM/réseau avec le jeu et le visuel ;
- [ ] comparer les moteurs de rendu sur un prototype isolé ;
- [ ] choisir une technologie seulement à partir de besoins stabilisés.

Voir : `docs/23_univers_sonore_contrat_public.md`.

## 5. Visuel du Cœur / LAB VISUEL — préproduction

### Acquis de conception

- [x] représentation strictement en aval du Cœur ;
- [x] architecture contract-first avec adaptateur de version ;
- [x] même contrat pour fixtures, replays et future production ;
- [x] direction : satisfaisante, contemplative, onirique et féerique ;
- [x] continuité d’identité et cohérence temporelle comme contraintes ;
- [x] mue utilisable comme cas de test de transformation majeure ;
- [x] niveaux sobre / normal / riche à partir du même canon ;
- [x] rendu client par défaut et cadences Cœur/publication/rendu découplées ;
- [x] bibliographie initiale : L-systems/Algorithmic Botany, Clades, réaction-diffusion, cohérence temporelle, LOD, WCAG et documentation de renderer candidat ;
- [x] frontière public/privé renforcée : GitHub ne décrit ni organisation ni mécanismes réservés du CODEX.

### VISUEL-0 — prochaine gate

- [ ] définir un contrat sémantique v0 **minimal**, versionné et validé par schéma ;
- [ ] créer des fixtures synthétiques représentatives sans recopier les internes du Cœur ;
- [ ] écrire un adaptateur d’exports/replays de simulations existantes ;
- [ ] prouver que fixtures et replays alimentent exactement le même LAB ;
- [ ] créer un renderer factice pour tester l’indépendance du contrat ;
- [ ] simuler une révision incompatible du Cœur et la corriger uniquement par adaptateur/migration ;
- [ ] mesurer un premier budget CPU/GPU/RAM/réseau côté client ;
- [ ] ne figer aucun contenu futur inutile à la validation du LAB.

### VISUEL-1 à VISUEL-5, seulement après gate

- [ ] coût minimal du vivant et cohérence temporelle ;
- [ ] continuité d’identité et premières mues ;
- [ ] variations historiques sans dépendance aux mécanismes privés ;
- [ ] environnement, traces et vagues ;
- [ ] Orée expérimentale ;
- [ ] mesures en charge avec jeu et sonore représentatifs ;
- [ ] choix de renderer seulement après comparaison mesurée.

Voir : `docs/24_visuel_coeur_contrat_public.md`.

## 6. Documentation et gouvernance

- [x] GitHub redevient la source de vérité des contenus destinés au dépôt ;
- [x] documentation de pilotage synchronisée au 12 août ;
- [x] documentation TA3 partageable migrée vers GitHub ;
- [x] frontière public/secret du futur univers sonore formalisée ;
- [x] contrat visuel partageable, mue comme cas de test, gates anti-réécriture et références documentés ;
- [x] reformulation de la documentation visuelle publique pour ne pas exposer la structure des mécanismes réservés ;
- [ ] conserver hors dépôt les détails propriétaires et opérationnels ;
- [ ] nettoyer progressivement du Drive les doublons qui n’avaient été créés que pendant le gel GitHub ;
- [ ] ne supprimer une information sensible d’un stockage temporaire qu’après vérification de sa copie de référence.

## 7. Principes invariants

- monde partagé unique ;
- Corcite comme personnage, organisme et cité ;
- progression principalement horizontale ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO/micro-dopamine comme moteur de rétention ;
- plusieurs styles de jeu légitimes ;
- accessibilité intégrée ;
- identité queer et non genrée ;
- sobriété technique ;
- séparation entre prototype, monde autonome, instrumentation du projet et représentations visuelle/sonore ;
- interpréteurs anticipés branchés sur un contrat versionné, jamais sur les internes provisoires du Cœur ;
- budgets de ressources arbitrés au niveau du système complet et non de chaque brique isolément.
