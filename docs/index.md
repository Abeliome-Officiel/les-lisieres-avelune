# Documentation — Les Lisières d’Avelune

Cet index pointe vers les **référentiels partageables actuels**. Les documents historiques restent utiles comme preuves mais ne remplacent pas les statuts les plus récents.

## 1. État courant — 22 août 2026

- **PROTO** : **CLOS / HISTORIQUE**.
- **Cœur / P0** : biologie suffisamment close ; O1 PASS/CLOSED/FROZEN ; P0-AUTH, neutralité, O2, O3 et O4 PASS/CLOSED ; P0 reste fermé.
- **P1 — Lecteur** : baseline offline, convergence transverse et **CREAD-LIVE applicatif qualifiés** ; P1 reste gelé hors défaut/régression/évolution de contrat.
- **P3 — Orchestrateur** : ORCH-0 qualifié ; **ORCH-1 est la gate critique active**.
- **P2 — Observabilité** : surface autonome OBS-1 qualifiée ; finalisation unique reportée après ORCH-1.
- **P4 — Tableaux** : contrat offline qualifié ; raccord si nécessaire lorsque P1/P2/P3 le permettent.
- **P5A / P5B / P6** : fondations offline qualifiées ; raccords live après P3, P2 et O5.
- **O5-MIGRATION** : obligatoire après P3/P2 et avant la phase live aval définitive.
- **TA3** : autonome du PROTO et soumis à ses gates propres.

Ordre courant :

```text
P3 — ORCH-1
→ P2 — OBS-1 FINALIZATION
→ P4 si nécessaire
→ O5-MIGRATION obligatoire
→ P5A / P5B / P6 live
→ isolation intégrée
→ freeze intégré
→ endurance 240 h
→ analyse exhaustive
→ décision CŒUR-1
```

Les métriques sensibles, seeds, RNG, recettes, causalités détaillées, CODEX, credentials, mappings privés et détails d’exploitation réservés restent hors dépôt.

---

## 2. Entrées principales

- [README du projet](../README.md)
- [Roadmap actuelle](../ROADMAP.md)
- [CREAD-LIVE — architecture et PASS applicatif](development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md)
- [Clôture P0-AUTH / O2 / O3 / O4](development/P0_AUTH_CLOSURE_2026-08-21.md)
- [Clôture PRE-P6 transverse](development/PRE_P6_TRANSVERSE_2026-08-21.md)
- [Clôture du PROTO](development/PROTO_CLOSURE_2026-08-20.md)
- [Contrat de lecture des modules](32_coeur_contrat_lecture_modules.md)
- [Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)
- [Multi-monde, capacité et Tableau Univers](33_multi_monde_capacite_et_tableau_univers.md)
- [Univers sonore](23_univers_sonore_contrat_public.md)
- [Visuel du Cœur](24_visuel_coeur_contrat_public.md)
- [Tableau Réel](real/README.md)

---

## 3. Cœur vivant et lecture

Références partageables principales :

- [Manifeste — Faire Monde](17_manifeste_faire_monde.md)
- [Cœur vivant et genèse canonique](21_coeur_vivant_genese_canonique.md)
- [Références scientifiques et méthode](25_coeur_vivant_references_methode.md)
- [Gate de suffisance](29_coeur_vivant_gate_suffisance.md)
- [Temporalité canonique](31_temporalite_canonique_genese.md)
- [Contrat de lecture des modules](32_coeur_contrat_lecture_modules.md)
- [CREAD-LIVE](development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md)
- [WorldReadEnvelope v0.1 — schéma](contracts/world-read-envelope-v0.1.schema.json)
- [Avelune Semantic Replay v0.1](contracts/avelune-semantic-replay-v0.1.md)

Frontière durable :

```text
P0 / état canonique privé
        ↓
CREAD / lecture + normalisation + allowlist
        ↓
P1 / ReadSessionItem
├─ WorldReadEnvelope
└─ ContinuityDecision
        ↓
modules aval
```

P0 qualifie l’identité, la révision et l’âge canonique du monde. P1 qualifie la continuité de publication. Un consommateur ne lit pas directement les structures privées du Cœur.

CREAD-LIVE v1 est **PASS au niveau applicatif**. Il utilise un transport local par Unix Domain Socket, mais le transport reste remplaçable et distinct de la sémantique. Les détails d’exploitation restent privés et la matérialisation système définitive appartient à P3 / ORCH-1.

P0 + P1 constitue désormais le **socle canonique fonctionnel au niveau théorique/LAB** : Cœur autoritatif + interface live applicative qualifiée.

---

## 4. Modules autour du Cœur

### P1 — Lecteur

Autorité de lecture et de continuité. CREAD-LIVE applicatif est qualifié ; P1 reste gelé hors défaut/régression ou évolution contractuelle explicite.

### P2 — Observabilité

Mesure non autoritative. La surface autonome est qualifiée ; la finalisation live attend ORCH-1 afin de raccorder en une seule reprise les faits P1 et P3/backup.

### P3 — Orchestrateur

Control plane séparé. **ORCH-1 est le chantier critique actif** et doit matérialiser l’exploitation et l’isolation système du socle P0/P1 sans en redéfinir les contrats.

### P4 — Tableaux Monde / Univers

Vues opérateur à partir de faits P1/P2/P3 qualifiés ; aucune lecture directe du Cœur. Raccord seulement si nécessaire après les gates amont.

### P5A — Visuel

- [Contrat partageable](24_visuel_coeur_contrat_public.md)

### P5B — Musique / Sonore

- [Contrat partageable](23_univers_sonore_contrat_public.md)
- [Références et méthode](26_univers_sonore_references_methode.md)
- [Cahier d’intégration](27_musique0_cahier_integration.md)

### P6 — Fenêtre sur les Avelunes

P6-0 est qualifié offline ; le travail offline reste autorisé. Le raccord live attend la séquence P3 → P2 → O5 et une autorisation explicite de phase.

---

## 5. O5 et exploitation multi-monde

Voir [Multi-monde, capacité et Tableau Univers](33_multi_monde_capacite_et_tableau_univers.md).

O5-MIGRATION doit démontrer qu’un même monde peut changer réellement de host tout en préservant son identité, son canon et une seule autorité active. Cette gate reste distincte d’ORCH-1 et ne peut pas être déclarée PASS par un simple test de primitives d’orchestration.

---

## 6. Tableau Réel

- [Index TA3](real/README.md)
- [Spécification](real/SPECIFICATION.md)
- [Plan d’exécution](real/EXECUTION_PLAN.md)
- [Télémétrie énergie AvLab](real/AVLAB_POWER_TELEMETRY.md)

TA3 suit le projet réel et reste séparé du Cœur, du Tableau Univers et du PROTO.

---

## 7. PROTO — archive historique

Le PROTO est **CLOS / HISTORIQUE** depuis le 20 août 2026.

Référence : [PROTO_CLOSURE_2026-08-20.md](development/PROTO_CLOSURE_2026-08-20.md).

Les documents et branches PROTO conservés servent à la traçabilité et ne constituent plus une roadmap technique.

---

## 8. Développement et gouvernance

- [Index développement](development/README.md)
- [Architecture actuelle et cible](development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Arbitrage pérennité / ressources](development/ARBITRATION_LONGEVITY_AND_RESOURCES.md)
- [Politique données/configuration](development/DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement](development/GAME_DEVELOPMENT_METHOD.md)
- [Dette technique](development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests / sécurité / persistance](development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l’UI](development/adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](development/adr/ADR-0002-DATA-DRIVEN-CONTENT.md)
- [ADR-0003 — Cœur indépendant de ses représentations](development/adr/ADR-0003-CORE-REPRESENTATION-INDEPENDENCE.md)

---

## 9. Frontière de publication

GitHub contient le code et la documentation partageables.

Ne pas publier : credentials, clés privées, recovery codes, seeds/RNG privés, recettes propriétaires, causalités détaillées, CODEX, mappings privés ou dumps d’un runtime privé.

Le dépôt privé reste traité comme une surface de publication : une information confidentielle ne devient pas partageable simplement parce qu’une authentification est requise.
