# Roadmap — Les Lisières d’Avelune

## État au 21 août 2026

Le projet a quitté la phase où le PROTO constituait un chantier actif. La priorité est désormais de qualifier puis intégrer durablement le **Cœur autonome** et les modules qui l’entourent, sans réouvrir les jalons déjà fermés.

| Axe | État | Prochaine gate |
|---|---|---|
| **PROTO** | **CLOS / HISTORIQUE** | décommissionnement lorsque décidé ; aucune reprise fonctionnelle |
| **Cœur / CŒUR-0** | biologie suffisamment close ; O1 PASS/CLOSED/FROZEN ; **P0-AUTH + neutralité + O2/O3/O4 PASS/CLOSED** | **CREAD-LIVE**, puis OBS-1/ORCH-1 selon dépendances et O5-MIGRATION |
| **P1 — Lecteur** | offline qualifié ; convergence et gate transverse P1↔P5A↔P5B PASS | **CREAD-LIVE** sur la nouvelle autorité P0 qualifiée |
| **P2 — Observabilité** | OBS-0 offline qualifié et gelé | OBS-1 lorsque les sources live sont autorisées |
| **P3 — Orchestrateur** | ORCH-0 offline qualifié et gelé | ORCH-1 sur instance LAB dédiée après gates requises |
| **P4 — Tableaux** | offline qualifié et gelé | reprise uniquement lors de l’arrivée de sources live réelles |
| **P5A — Visuel** | offline qualifié ; frontière convergée avec P1 ; aucun second guard | travail offline autorisé ; live après CREAD-LIVE |
| **P5B — Musique** | offline global qualifié ; frontière convergée avec P1 ; aucune seconde autorité active sur le chemin convergé | travail offline autorisé ; live après CREAD-LIVE |
| **P6 — Fenêtre sur les Avelunes** | P6-0 offline qualifié ; contrat de fondation prêt ; PRE-P6 transverse CLOSED/PASS | travail offline autorisé ; intégration live en attente de CREAD-LIVE |
| **TA3 — Tableau Réel** | autonome du PROTO ; surfaces publique/privée séparées | fermer les gates d’authentification avant toute écriture privée |
| **GitHub / sécurité** | historique sensible nettoyé ; hygiène du dépôt encore ouverte | branches/PR, protection de `main`, CI/sécurité et documentation |

---

## 1. PROTO — fermé

La lignée **PROTO-0 / PROTO-0.1 / PROTO-0.2 / PROTO-0.2.2** est terminée.

### Acquis

- [x] plusieurs boucles de gameplay et d’interface ont été éprouvées ;
- [x] une version distribuable avec sessions persistantes a été qualifiée comme prototype ;
- [x] les enseignements utiles ont été séparés des choix purement temporaires ;
- [x] le tour par tour a été identifié comme propriété du prototype, non comme temporalité cible du jeu final ;
- [x] TA3 a été rendu indépendant du runtime et de la base du PROTO ;
- [x] la clôture documentaire explicite du chantier a été actée le 20 août 2026.

### Règle définitive

- [x] aucun nouveau playtest structurant n’est une gate du projet ;
- [x] aucune modernisation, migration de secrets, convergence d’architecture ou dette technique propre au PROTO n’est poursuivie ;
- [x] les branches et documents restent historiques jusqu’au nettoyage GitHub ;
- [x] le futur jeu et P1–P8 ne dépendent pas du code, du stockage ou du runtime PROTO ;
- [ ] décommissionner l’éventuelle instance restante lorsque l’opération sera décidée et vérifier la suppression des routes, credentials et données devenus inutiles.

Voir [`docs/development/PROTO_CLOSURE_2026-08-20.md`](docs/development/PROTO_CLOSURE_2026-08-20.md).

---

## 2. Cœur vivant — priorité actuelle

Le Cœur est le moteur autonome d’une Avelune. La qualification biologique ouverte est considérée suffisamment close. O1 a qualifié le fonctionnement continu initial pendant 72 h réelles ; son verdict est **PASS**, ses preuves sont gelées et ce jalon est clos.

P0-AUTH et les gates post-O1 immédiates sont maintenant également closes : **neutralité biologique/RNG PASS, O2 PASS, O3 PASS, O4 PASS**. La politique qualifiée pendant une indisponibilité du Cœur est **PAUSE**.

### Principes et gates fermés

- [x] le Cœur est l’autorité canonique sur l’état vivant ;
- [x] l’identité d’un monde est indépendante de son host ;
- [x] plusieurs Avelunes canoniques peuvent exister sans mélanger leurs histoires ;
- [x] les représentations sont strictement en aval ;
- [x] l’arrêt d’un module aval ne doit pas arrêter un Cœur sain ;
- [x] aucune fréquentation joueur ne change la vitesse ou les lois biologiques du monde ;
- [x] la v1.0 ne prévoit pas de rétroaction gameplay → biologie du Cœur ;
- [x] O1 72 h : fonctionnement continu initial qualifié et archivé ;
- [x] **P0-AUTH** : identité, révision canonique, âge canonique exact et état associés au même commit autoritatif ;
- [x] neutralité biologique/RNG de la couche d’autorité ;
- [x] **O2** — arrêt propre et reprise exacts ;
- [x] **O3** — crash, atomicité et recovery ;
- [x] **O4** — politique de downtime qualifiée : `PAUSE`.

Voir [`docs/development/P0_AUTH_CLOSURE_2026-08-21.md`](docs/development/P0_AUTH_CLOSURE_2026-08-21.md).

### Séquence opérationnelle restante

1. **CREAD-LIVE** — raccorder P1 à l’autorité P0 par une frontière minimale/versionnée et qualifier replay/live ;
2. **OBS-1 / ORCH-1** selon dépendances ;
3. **O5-MIGRATION** — migration LAB réelle sans changement d’identité et sans double autorité ;
4. **P5A / P5B / P6 live** ;
5. qualification de l’isolation des pannes aval ;
6. freeze de la configuration intégrée ;
7. endurance intégrée longue **10 jours / 240 h** ;
8. analyse exhaustive puis décision d’entrée dans **CŒUR-1**.

La durée d’un soak ne vaut jamais PASS à elle seule. **O5-MIGRATION ne doit pas être omis.**

---

## 3. P1 — Lecteur du Cœur

P1 constitue l’unique frontière durable entre les structures privées du Cœur et les consommateurs aval.

### Acquis

- [x] CREAD-OFFLINE qualifié ;
- [x] séparation `publication_seq` / `state_revision` / `canonical_age` ;
- [x] replay et source live conçus derrière la même frontière sémantique ;
- [x] continuité et resynchronisation restent autorité P1 ;
- [x] convergence contractuelle P1↔P5A↔P5B qualifiée ;
- [x] gate transverse P1↔P5A↔P5B exécuté : **PASS / CLOSED** ;
- [x] `canonical_age` conservé comme chaîne décimale exacte sur le wire ;
- [x] `event_history_exhaustive` relève de la décision de continuité P1 ;
- [x] P0 fournit désormais les primitives autoritatives requises ;
- [x] la sémantique P0 qualifiée de `canonical_age` est exacte et la politique de downtime du Cœur est `PAUSE`.

### Prochaine gate

- [ ] **CREAD-LIVE** : adapter la source réelle P0 à la session P1 existante, vérifier l’identité et l’allowlist, démontrer l’équivalence sémantique replay/live et mesurer le coût de projection.

---

## 4. P2 / P3 / P4 — exploitation durable

### P2 — Observabilité

- [x] OBS-0 offline qualifié ;
- [x] métriques allowlistées, santé/fraîcheur, incidents et rétention offline ;
- [x] aucune autorité canonique ou pouvoir d’action ;
- [ ] OBS-1 live à raccorder lorsque les sources sont autorisées.

### P3 — Orchestrateur

- [x] ORCH-0 offline qualifié ;
- [x] modèle monde/host/placement/opération ;
- [x] idempotence, locks, confirmation humaine et recovery offline ;
- [x] `SecretRef` plutôt que secrets bruts ;
- [ ] ORCH-1 réel sur LAB dédié ;
- [ ] backup/restore/migration réels à qualifier avant exploitation permanente.

### P4 — Tableau Monde / Tableau Univers

- [x] baseline offline qualifiée ;
- [x] lecture P1/P2/P3 sans accès direct au Cœur ;
- [x] UX opérateur non autoritative ;
- [ ] reprise lorsque les vraies surfaces OBS-1/ORCH-1/CREAD-LIVE existent.

---

## 5. P5A — Visuel

Le visuel traduit une projection autorisée en représentation perceptive sans inventer de biologie.

- [x] VISUEL-0 offline qualifié ;
- [x] déterminisme, isolation multi-Avelune, fail-closed et renderer-neutral qualifiés ;
- [x] convergence P1 qualifiée ;
- [x] gate transverse commun PASS ;
- [x] aucune seconde autorité de continuité ;
- [x] forme publique de `canonical_age` transportée sans perte ;
- [ ] travail offline autorisé sur besoins démontrés ;
- [ ] travail live après CREAD-LIVE ;
- [ ] direction artistique finale à poursuivre uniquement sur besoins démontrés ;
- [ ] aucun enrichissement préventif du payload visuel.

---

## 6. P5B — Musique / Sonore

Le sonore est un interpréteur strictement aval du monde.

- [x] MUS-0, MUS-1 et MUS-2 qualifiés ;
- [x] P5B OFFLINE GLOBAL = PASS ;
- [x] mémoire bornée, persistance/restart et recovery sans invention du passé ;
- [x] renderer témoin remplaçable qualifié ;
- [x] convergence P1 qualifiée ;
- [x] gate transverse commun PASS ;
- [x] l’ancien mécanisme de session de publication n’est pas autorité active sur le chemin convergé ;
- [x] forme publique de `canonical_age` transportée sans perte ;
- [ ] qualification artistique approfondie facultative ;
- [ ] moteur audio final ouvert ;
- [ ] live après CREAD-LIVE.

Les thèmes et réglages d’accessibilité restent en présentation et ne modifient jamais le canon.

---

## 7. P6 — Fenêtre sur les Avelunes

La **Fenêtre sur les Avelunes** est le premier produit intégrateur contemplatif permanent.

- [x] P6-0 OFFLINE = PASS ;
- [x] intégration P1 + P5A + P5B sur fixtures/contrats ;
- [x] isolation multi-monde ;
- [x] perte visuel/sonore dégradable sans invention d’état ;
- [x] préférences locales non canoniques ;
- [x] PRE-P6 transverse = PASS / CLOSED ;
- [x] contrat de fondation P6 prêt, sans couche de traduction/réparation transverse ;
- [x] travail P6 offline autorisé ;
- [x] gates amont P0-AUTH/O2/O3/O4 closes ;
- [ ] **P6 live** : attente de CREAD-LIVE ;
- [ ] aucune connexion directe au Cœur privé.

Le PASS transverse ferme une dette contractuelle ; il n’autorise pas le raccord live avant CREAD-LIVE.

---

## 8. Tableau Réel — TA3

TA3 mesure le projet dans le monde réel et reste séparé du Cœur, du Tableau Univers et du PROTO.

### Acquis

- [x] stockage/runtime autonomes ;
- [x] journal événementiel et provenance propres ;
- [x] surface publique en lecture seule ;
- [x] surface privée séparée ;
- [x] aucune administration du Cœur par TA3.

### Gates restantes

- [ ] terminer la qualification d’authentification forte de la console privée ;
- [ ] conserver les écritures privées désactivées jusqu’à fermeture des gates sécurité ;
- [ ] qualifier les sauvegardes/restaurations indépendantes et la rétention ;
- [ ] poursuivre la minimisation des données et l’audit des imports.

Voir [`docs/real/`](docs/real/README.md).

---

## 9. GitHub, secrets et sécurité

### Acquis

- [x] purge contrôlée de l’ancien historique sensible close et vérifiée ;
- [x] références réécrites devenues source de vérité ;
- [x] anciens clones/worktrees pré-purge classés à contrôler avant réutilisation ;
- [x] séparation entre identité GitHub Avelune et identités personnelles dans les procédures d’exploitation ;
- [x] politique de secrets : credentials humains, secrets runtime, clés SSH et recovery codes traités dans leurs espaces appropriés ;
- [x] GitHub reste une surface partageable même lorsque le dépôt est privé.

### Hygiène encore ouverte

- [ ] classifier puis rationaliser les branches historiques ;
- [ ] fermer/classer les PR draft VISUEL supersédées ;
- [ ] traiter `tmp-unused` ;
- [ ] revoir `security/sentinel-baseline-2026-08-20` ;
- [ ] mettre en place une protection/ruleset adaptée de `main` ;
- [ ] renforcer CI, audit de dépendances/images et politique `.github` ;
- [ ] maintenir une sauvegarde Avelune réellement indépendante de l’hôte lorsque requise.

Ces tâches sont des chantiers de gouvernance et de sécurité du dépôt ; **elles ne rouvrent pas le PROTO**.

---

## 10. Futur jeu

Le futur jeu TF/TD/RPG devra se brancher sur les fondations durables sans réutiliser le PROTO comme runtime de production.

Principes :

- serveur de jeu autoritatif séparé du Cœur ;
- compte, Corcite et `world_instance_id` comme identités distinctes ;
- gameplay continu et asynchrone ;
- consommation du monde vivant via P1 ;
- réutilisation des briques Visuel, Sonore, Observabilité, Orchestrateur, Tableaux et préférences lorsque pertinent ;
- aucune rétroaction biologique v1.0 sans décision future explicite ;
- absence non punitive, progression principalement horizontale et accessibilité intégrée.

---

## Règle de pilotage

Un chantier fermé ne redevient pas actif parce qu’un ancien fichier, une branche ou une dette locale existe encore. Toute réouverture doit être motivée par un besoin actuel démontré et attribuée au module qui en possède réellement l’autorité.
