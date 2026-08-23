# Roadmap — Les Lisières d’Avelune

## État au 23 août 2026

Cette roadmap décrit le **chemin critique courant**. Les jalons fermés restent documentés dans `docs/development/` mais ne redeviennent pas des chantiers actifs sans défaut démontré ou décision explicite.

| Axe | État | Prochaine gate |
|---|---|---|
| **PROTO** | **CLOS / HISTORIQUE** | décommissionnement lorsqu’il sera décidé ; aucune reprise fonctionnelle |
| **Cœur / P0** | biologie suffisamment close ; O1 PASS/CLOSED/FROZEN ; P0-AUTH + neutralité + O2/O3/O4 PASS/CLOSED | **reste fermé** ; seulement régression/défaut ou changement explicite |
| **P1 — Lecteur** | offline, convergence transverse et **CREAD-LIVE applicatif qualifiés** | **reste gelé** hors défaut/régression/évolution de contrat |
| **P3 — Orchestrateur** | ORCH-0 offline qualifié | **ORCH-1 — gate critique active** |
| **P2 — Observabilité** | surface autonome OBS-1 qualifiée | **finalisation unique après ORCH-1** |
| **P4 — Tableaux** | contrat offline qualifié | raccord si nécessaire lorsque P1/P2/P3 live sont disponibles |
| **P5A — Visuel** | offline/convergence P1 qualifiés | live après les gates amont |
| **P5B — Musique** | offline/convergence P1 qualifiés | live après les gates amont |
| **P6 — Fenêtre sur les Avelunes** | fondation offline qualifiée | live après les gates amont |
| **O5-MIGRATION** | obligatoire, non exécuté | après P3/P2 et avant les raccords live aval définitifs |
| **PORTABILITÉ** | **chantier parallèle ouvert / non intrusif** | audits read-only P0/P0-AUTH/P1/P3 ; aucune réouverture automatique |
| **TA3 — Tableau Réel** | autonome du PROTO | poursuite de ses gates propres |

---

## 1. Jalons fermés

### CŒUR-0 / O1 / P0

Sont considérés fermés pour la version actuelle :

- [x] qualification biologique CŒUR-0 suffisamment close ;
- [x] O1 — endurance initiale 72 h : PASS / CLOSED / FROZEN ;
- [x] P0-AUTH — état canonique committé avec identité, révision et âge exact ;
- [x] neutralité biologique/RNG de la couche d’autorité ;
- [x] O2 — arrêt/reprise ;
- [x] O3 — crash/atomicité/recovery ;
- [x] O4 — politique de downtime `PAUSE`.

P0 reste l’autorité canonique et ne revient pas en chantier normal. Le raccord CREAD qualifié reste strictement en aval de P0-AUTH et n’en modifie pas les invariants.

Voir [`docs/development/P0_AUTH_CLOSURE_2026-08-21.md`](docs/development/P0_AUTH_CLOSURE_2026-08-21.md).

### PRE-P6 transverse

- [x] convergence P1↔P5A↔P5B ;
- [x] P1 reste l’unique autorité de continuité ;
- [x] C01–C08 qualifiés offline ;
- [x] projections visuelle et sonore convergées consommables sans couche de réparation P6.

Voir [`docs/development/PRE_P6_TRANSVERSE_2026-08-21.md`](docs/development/PRE_P6_TRANSVERSE_2026-08-21.md).

### CREAD-LIVE

CREAD-LIVE v1 est **PASS au niveau de la frontière applicative**.

Sont qualifiés :

- [x] lecture P0 read-only vis-à-vis de l’état autoritatif ;
- [x] normalisation privée et allowlist positive avant P1 ;
- [x] observation CREAD versionnée ;
- [x] transport local v1 par Unix Domain Socket ;
- [x] client/serveur request/response JSON UTF-8 ;
- [x] exactitude `world_instance_id`, `state_revision`, `canonical_age` ;
- [x] validation stricte et absence de fuite des champs privés recherchés ;
- [x] limites/timeouts explicites et comportement fail-closed ;
- [x] restart/reconnect ;
- [x] replay/live equivalence au niveau publié ;
- [x] P1 reste l’unique autorité de continuité ;
- [x] régressions P0/P1 préservées ;
- [x] coût local borné et mesuré.

Le PASS ne vaut pas encore qualification complète de l’isolation système ou de l’exploitation de production. Cette matérialisation appartient à ORCH-1.

Voir [`docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md`](docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md).

---

## 2. Chantier critique actif — P3 / ORCH-1

ORCH-1 rend le socle P0/P1 exploitable **sans le redessiner**.

À qualifier :

- [ ] matérialisation des identités runtime et séparation des privilèges ;
- [ ] runtime directory et permissions du transport CREAD ;
- [ ] lifecycle réel start/stop/restart ;
- [ ] executor LAB réel ;
- [ ] gestion runtime des secrets techniques sans exposition aux clients ;
- [ ] résistance aux substitutions de services et isolation fail-closed ;
- [ ] backup/restore réels et contrôles d’intégrité ;
- [ ] faits opérationnels publiables vers P2 ;
- [ ] valeurs de déploiement des timeouts, limites et cadences à partir de mesures ;
- [ ] coût opérationnel ;
- [ ] préparation des primitives nécessaires à la migration sans déclarer O5 PASS.

P3 ne modifie ni la sémantique P0, ni la continuité P1, ni le contrat CREAD qualifié.

---

## 3. Après ORCH-1 — P2 / OBS-1 FINALIZATION

P2 reste gelé pendant ORCH-1 afin d’éviter deux réouvertures successives.

État déjà acquis :

- [x] OBS-0 ;
- [x] Host live ;
- [x] freshness / alertes / incidents ;
- [x] isolation de panne P2 ;
- [x] coût initial mesuré ;
- [x] frontière passive P3 ;
- [x] contrat P2→P4.

Après ORCH-1 :

- [ ] raccorder `core.*` / `reader.*` via les surfaces P1 autorisées ;
- [ ] raccorder `orchestrator.*` / `backup.*` via P3 ;
- [ ] fermer OBS-1 complet sans lecture des stockages privés P0/P1/P3 ;
- [ ] conserver P2 strictement non autoritatif.

---

## 4. P4 — si nécessaire

P4 reste qualifié offline. Son raccord opérateur est réveillé seulement si la finalisation P2 ou l’exploitation P3 démontre un besoin réel. Il ne doit pas devenir une voie d’accès directe aux stockages privés.

---

## 5. O5-MIGRATION — obligatoire

O5 reste une gate distincte de P3/ORCH-1.

Elle devra démontrer sur LAB réel :

- même `world_instance_id` ;
- état canonique intact ;
- révision et âge cohérents ;
- historique/RNG préservés selon les garanties P0 ;
- changement réel de placement ;
- ancienne autorité arrêtée ;
- une seule nouvelle autorité active ;
- P1 reconnecté correctement ;
- P2 capable d’observer la transition sans devenir autorité du verdict.

**O5 ne doit jamais disparaître du chemin critique.**

---

## 6. Aval live puis endurance

Après O5 :

1. P5A / P5B / P6 live ;
2. P4 raccord opérateur si encore nécessaire ;
3. qualification de l’isolation intégrée des pannes ;
4. freeze des versions et de la configuration ;
5. endurance intégrée **240 h / 10 jours** ;
6. analyse exhaustive ;
7. décision d’entrée dans **CŒUR-1**.

Le temps écoulé n’est jamais à lui seul un verdict PASS.

---

## 7. Chantier parallèle — portabilité

Le chantier de portabilité est **ouvert en parallèle** et ne modifie pas le chemin critique ci-dessus.

Principes :

- [ ] commencer par un inventaire read-only des dépendances au langage/runtime ;
- [ ] auditer P0, P0-AUTH, P1 et P3 sans les rouvrir automatiquement ;
- [ ] distinguer formats/contrats réellement portables et détails d’implémentation ;
- [ ] créer des fixtures et vecteurs de test inter-langages avant tout portage réel ;
- [ ] ne modifier une baseline qualifiée qu’après démonstration d’un couplage concret et décision explicite ;
- [ ] requalifier uniquement les dépendances réellement touchées.

L’acte intervient après fermeture de P0/CŒUR-0, P0-AUTH et P1/CREAD-LIVE. **P3 n’est pas encore entièrement clos** : ORCH-0 est qualifié et ORCH-1 est actif. Le chantier audite donc P3 pendant sa phase actuelle sans prétendre rouvrir ORCH-0.

Le constat initial est que l’architecture est largement favorable à la migration, mais que l’interchangeabilité déterministe stricte d’un Cœur réimplémenté dans un autre langage n’est pas encore une propriété qualifiée.

Voir [`docs/development/PORTABILITY_PARALLEL_WORKSTREAM_2026-08-23.md`](docs/development/PORTABILITY_PARALLEL_WORKSTREAM_2026-08-23.md).

---

## 8. PROTO et futur jeu

Le PROTO reste clos/historique. Le futur jeu ne réutilise ni son runtime, ni sa base, ni son tour par tour comme architecture de production.

Le futur gameplay devra consommer le monde vivant via les contrats durables P0/P1 et les modules qualifiés, sans créer une seconde vérité du monde.

---

## 9. GitHub, secrets et publication

GitHub porte le code et la documentation partageables. Restent hors dépôt : recettes propriétaires, seeds/RNG, causalités détaillées, CODEX, credentials, clés privées, mappings privés et détails d’exploitation inutiles à la compréhension du contrat.

Hygiène toujours ouverte : protection de `main`, rationalisation des branches/PR historiques, CI/SCA/SAST/secret scanning et contrôles de dépendances.

---

## Ordre de pilotage autoritatif

```text
P3 — ORCH-1
→ P2 — OBS-1 FINALIZATION
→ P4 — si nécessaire
→ O5-MIGRATION
→ P5A / P5B / P6 live
→ isolation intégrée
→ freeze intégré
→ endurance 240 h
→ analyse exhaustive
→ décision CŒUR-1
```

Le chantier **PORTABILITÉ** progresse en parallèle et ne s’insère dans cet ordre que si une future gate explicite démontre qu’une migration technique est nécessaire avant la baseline visée.
