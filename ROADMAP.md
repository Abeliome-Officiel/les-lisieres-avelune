# Roadmap — Les Lisières d’Avelune

## État au 13 août 2026

Le projet avance actuellement sur **trois axes indépendants** :

| Axe | État | Prochaine gate |
|---|---|---|
| PROTO jouable | PROTO-0.2.2 validé sur `develop/proto-0.2.2-playtest` | playtests puis décision explicite d’intégration |
| Cœur vivant | laboratoire headless, diagnostic R2.10 en cours | identifier le goulot de persistance avant nouveau mécanisme |
| Tableau Réel | Gate 0 validé | Phase B : socle persistant autonome hors PROTO |

L’**univers sonore** est désormais cadré comme chantier futur de représentation. Il ne devient pas un quatrième axe runtime courant et ne modifie pas le PROTO.

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
- [ ] décider explicitement si/Quand PROTO-0.2.2 devient la nouvelle baseline de `main` ;
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
- [x] identification d’un goulot de disparition avant première propagation locale.

### En cours

- [ ] R2.10 : distinguer incapacité à atteindre l’état de propagation, attente avant propagation et érosion par les vagues ;
- [ ] lire la campagne forte avant toute modification mécanique ;
- [ ] si deux mécanismes restent plausibles, les comparer en parallèle sur seeds appariées.

### Après le diagnostic écologique

- [ ] validation longue supplémentaire lorsque le mécanisme est stabilisé ;
- [ ] validation sauvegarde/restauration/migrations pour durée indéterminée ;
- [ ] Observatoire analytique privé ;
- [ ] contrat sémantique de représentation ;
- [ ] prototypes d’interpréteurs visuel et sonore seulement après stabilisation suffisante du contrat ;
- [ ] prototype de l’Orée ;
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
- [ ] mesurer le budget CPU/RAM/réseau ;
- [ ] comparer les moteurs de rendu sur un prototype isolé ;
- [ ] choisir une technologie seulement à partir de besoins stabilisés.

Voir : `docs/23_univers_sonore_contrat_public.md`.

## 5. Documentation et gouvernance

- [x] GitHub redevient la source de vérité des contenus destinés au dépôt ;
- [x] documentation de pilotage synchronisée au 12 août ;
- [x] documentation TA3 partageable migrée vers GitHub ;
- [x] frontière public/secret du futur univers sonore formalisée ;
- [ ] conserver hors dépôt les détails propriétaires et opérationnels ;
- [ ] nettoyer progressivement du Drive les doublons qui n’avaient été créés que pendant le gel GitHub ;
- [ ] ne supprimer une information sensible d’un stockage temporaire qu’après vérification de sa copie de référence.

## 6. Principes invariants

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
- séparation entre prototype, monde autonome, instrumentation du projet et représentations visuelle/sonore.
