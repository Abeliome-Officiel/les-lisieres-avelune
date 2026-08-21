# Roadmap — Les Lisières d’Avelune

## État au 22 août 2026

Cette roadmap décrit le **chemin critique courant**. Les jalons fermés restent documentés dans `docs/development/` mais ne redeviennent pas des chantiers actifs sans défaut démontré ou décision explicite.

| Axe | État | Prochaine gate |
|---|---|---|
| **PROTO** | **CLOS / HISTORIQUE** | décommissionnement lorsqu’il sera décidé ; aucune reprise fonctionnelle |
| **Cœur / P0** | biologie suffisamment close ; O1 PASS/CLOSED/FROZEN ; P0-AUTH + neutralité + O2/O3/O4 PASS/CLOSED | **reste fermé** ; seulement régression/défaut ou changement explicite |
| **P1 — Lecteur** | offline et convergence transverse qualifiés | **CREAD-LIVE** |
| **P3 — Orchestrateur** | ORCH-0 offline qualifié | **ORCH-1 après CREAD-LIVE PASS** |
| **P2 — Observabilité** | surface autonome OBS-1 qualifiée ; dépendances live restantes | **finalisation unique après ORCH-1** |
| **P4 — Tableaux** | contrat offline qualifié | raccord lorsque P1/P2/P3 live sont disponibles |
| **P5A — Visuel** | offline/convergence P1 qualifiés | live après les gates amont |
| **P5B — Musique** | offline/convergence P1 qualifiés | live après les gates amont |
| **P6 — Fenêtre sur les Avelunes** | fondation offline qualifiée | live après les gates amont |
| **O5-MIGRATION** | obligatoire, non exécuté | après P1/P3/P2 qualifiés |
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

P0 reste l’autorité canonique et **ne revient pas en chantier normal** pendant CREAD-LIVE. Un ajout d’intégration strictement nécessaire à la lecture ne vaut pas réouverture de P0-AUTH et doit préserver ses invariants et régressions.

Voir [`docs/development/P0_AUTH_CLOSURE_2026-08-21.md`](docs/development/P0_AUTH_CLOSURE_2026-08-21.md).

### PRE-P6 transverse

- [x] convergence P1↔P5A↔P5B ;
- [x] P1 reste l’unique autorité de continuité ;
- [x] C01–C08 qualifiés offline ;
- [x] projections visuelle et sonore convergées consommables sans couche de réparation P6.

Voir [`docs/development/PRE_P6_TRANSVERSE_2026-08-21.md`](docs/development/PRE_P6_TRANSVERSE_2026-08-21.md).

---

## 2. Chantier critique actif — P1 / CREAD-LIVE

CREAD-LIVE doit fournir l’interface live officielle du Cœur sans exposer ses internes.

Architecture de principe :

```text
P0 / état canonique privé
        ↓
lecture read-only + validation
        ↓
normalisation privée + allowlist
        ↓
transport local remplaçable
        ↓
P1 / Lecteur
publication + session + continuité
```

Décisions actées pour v1 :

- [x] P1 n’accède pas directement au stockage privé du Cœur ;
- [x] le raw state ne franchit pas la frontière P1 ;
- [x] normalisation et allowlist positives avant la frontière ;
- [x] transport local v1 par Unix Domain Socket ;
- [x] request/response ;
- [x] JSON UTF-8 versionné ;
- [x] transport distinct de la sémantique et remplaçable.

À qualifier avant PASS :

- [ ] primitive de lecture strictement read-only ;
- [ ] observation normalisée v1 et mapping versionné ;
- [ ] DTO/snapshot CREAD v1 ;
- [ ] serveur/client live ;
- [ ] exactitude `world_instance_id`, `state_revision`, `canonical_age` ;
- [ ] absence de fuite privée ;
- [ ] C01–C08 live ;
- [ ] replay/live equivalence ;
- [ ] restart/reconnect ;
- [ ] isolation d’une panne ou lenteur P1 ;
- [ ] aucune backpressure bloquante vers le Cœur ;
- [ ] tailles maximales, timeouts et politique de cadence ;
- [ ] coût CPU/RAM/I/O/latence ;
- [ ] régressions P0/P1.

Voir [`docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md`](docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md).

### Jalon de sortie CREAD

Si `CREAD_LIVE=PASS`, le projet pourra considérer au niveau **théorique/LAB** :

```text
P0 = Cœur autoritatif qualifié
P1 = interface live qualifiée
P0 + P1 = socle canonique fonctionnel d’Avelune
```

P0 et P1 resteront alors fermés pour v1 hors défaut/régression démontré, changement volontaire de contrat/version ou nouvelle exigence explicitement décidée.

---

## 3. Après CREAD — P3 / ORCH-1

ORCH-1 vient **immédiatement après CREAD-LIVE PASS**.

P3 doit rendre le socle P0/P1 exploitable sans le redessiner :

- [ ] matérialiser les identités runtime et permissions distinctes ;
- [ ] matérialiser le runtime directory et les permissions du transport CREAD ;
- [ ] lifecycle réel start/stop/restart ;
- [ ] executor LAB réel ;
- [ ] backup/restore réels et contrôles d’intégrité ;
- [ ] faits opérationnels publiables vers P2 ;
- [ ] mesurer le coût opérationnel ;
- [ ] préparer les primitives nécessaires à la migration sans déclarer O5 PASS.

P3 ne modifie ni la sémantique P0, ni la continuité P1, ni le contrat CREAD qualifié.

---

## 4. Après ORCH-1 — P2 / OBS-1 FINALIZATION

P2 reste gelé pendant P1 puis P3 afin d’éviter deux réouvertures successives.

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
2. P4 raccord opérateur lorsque nécessaire ;
3. qualification de l’isolation intégrée des pannes ;
4. freeze des versions et de la configuration ;
5. endurance intégrée **240 h / 10 jours** ;
6. analyse exhaustive ;
7. décision d’entrée dans **CŒUR-1**.

Le temps écoulé n’est jamais à lui seul un verdict PASS.

---

## 7. PROTO et futur jeu

Le PROTO reste clos/historique. Le futur jeu ne réutilise ni son runtime, ni sa base, ni son tour par tour comme architecture de production.

Le futur gameplay devra consommer le monde vivant via les contrats durables P0/P1 et les modules qualifiés, sans créer une seconde vérité du monde.

---

## 8. GitHub, secrets et publication

GitHub porte le code et la documentation partageables. Restent hors dépôt : recettes propriétaires, seeds/RNG, causalités détaillées, CODEX, credentials, clés privées, mappings privés et détails d’exploitation inutiles à la compréhension du contrat.

Hygiène toujours ouverte : protection de `main`, rationalisation des branches/PR historiques, CI/SCA/SAST/secret scanning et contrôles de dépendances.

---

## Ordre de pilotage autoritatif

```text
P1 — CREAD-LIVE
→ P3 — ORCH-1
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
