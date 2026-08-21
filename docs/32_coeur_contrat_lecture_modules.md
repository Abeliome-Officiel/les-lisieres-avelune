# Cœur vivant — contrat de lecture des modules

> **Statut : architecture partageable — v0.6**  
> Date : 22 août 2026  
> Ce document décrit la frontière **Cœur → modules** sans exposer structures, recettes, paramètres, causalités propriétaires ni détails d’exploitation sensibles.

## 1. Principe

Le Cœur d’une instance est l’autorité sur l’état canonique de ce monde. Les modules externes sont des clients en aval : ils ne deviennent ni une seconde vérité ni une dépendance nécessaire à la survie du Cœur.

```text
P0 / état canonique privé
        ↓
frontière CREAD privée
lecture + validation + normalisation + allowlist
        ↓
P1 / Lecteur du Cœur
        ↓
ReadSessionItem
├─ WorldReadEnvelope
└─ ContinuityDecision
        ↓
modules aval
```

**P1 est l’unique autorité de continuité de publication.**

## 2. Autorités

```text
P0 / Cœur
- état canonique
- world_instance_id
- state_revision
- canonical_age

P1 / Lecteur
- projection de lecture
- ordre de publication
- ReadSession
- duplicate / gap
- changements stream / monde
- resynchronisation
- qualification de l’historique exploitable

P2 / Observabilité
- mesure et fraîcheur non autoritatives

P3 / Orchestrateur
- lifecycle, placement et opérations

P5/P6
- interprétation et présentation en aval
```

Aucun module ne reconstruit silencieusement l’autorité d’un autre.

## 3. État autoritatif P0

P0-AUTH a qualifié un état committé cohérent associant au même commit :

- `world_instance_id` ;
- `state_revision` ;
- `canonical_age` ;
- état canonique.

Le mode de stockage, les transactions et structures internes restent privés.

`world_instance_id` est opaque et indépendant du host. `state_revision` est distinct de `publication_seq`, du temps mural, d’une version de schéma ou d’un identifiant de stockage.

## 4. canonical_age

La forme publique de transport est une **chaîne décimale exacte** :

```text
"100"
"100.25"
"0.0001"
```

P0 qualifie l’âge canonique ; P1 le transporte sans perte. Si le Cœur est arrêté, la politique qualifiée est `PAUSE` : le temps mural d’indisponibilité ne crée pas automatiquement de vieillissement canonique.

Aucun client n’invente un âge manquant, un rattrapage ou une progression locale.

## 5. ReadSessionItem

La frontière convergée des consommateurs est conceptuellement :

```text
ReadSessionItem {
  frame: WorldReadEnvelope,
  continuity: ContinuityDecision
}
```

`WorldReadEnvelope` transporte les primitives contractuelles et une projection spécialisée allowlistée. `ContinuityDecision` porte la décision P1 concernant la continuité.

## 6. Continuité

P1 seul décide notamment :

- premier état ;
- publication contiguë ;
- duplicate ;
- gap ;
- changement de stream ;
- changement de monde ;
- nouvelle session ;
- resynchronisation ;
- `event_history_exhaustive` lorsqu’il est exposé.

Un saut de `state_revision` n’est pas automatiquement un gap de publication.

Le gate transverse PRE-P6 a qualifié la matrice C01–C08 offline. CREAD-LIVE doit confirmer ces comportements sur la source live réelle.

## 7. CREAD-LIVE — frontière réelle P0 → P1

CREAD-LIVE applique le moindre privilège : **le processus P1 ne lit pas directement le stockage privé du Cœur et ne reçoit pas le raw state**.

La frontière v1 suit :

```text
P0 privé
        ↓
lecture strictement read-only
        ↓
validation du committed state
        ↓
normalisation privée versionnée
        ↓
positive allowlist
        ↓
message CREAD versionné
        ↓
transport local
        ↓
P1
```

Ainsi, une information privée n’est pas « protégée » parce qu’elle serait simplement ignorée après transmission : elle ne franchit pas la frontière si elle n’est pas nécessaire.

## 8. Transport CREAD v1

L’implémentation v1 retient une **Unix Domain Socket locale**, en request/response, avec un message JSON UTF-8 versionné.

Ce choix est une décision d’implémentation, pas une sémantique du contrat : le transport reste remplaçable.

Les détails concrets de chemins runtime, identités système, permissions et topologie restent privés. Aucun listener réseau ou broker externe n’est requis pour CREAD v1.

Le transport ne devient pas une API générale d’inspection du Cœur : il sert à obtenir une observation qualifiée et allowlistée.

## 9. Données qui ne franchissent pas la frontière

Ne sont pas exposés par défaut :

- seed et état RNG ;
- recettes, coefficients et seuils ;
- structures de persistance ;
- diagnostics scientifiques privés ;
- causalités propriétaires ;
- CODEX ;
- credentials et secrets techniques ;
- tout champ non requis par le contrat aval.

Une allowlist positive produit l’artefact de lecture ; on ne part pas d’un dump privé dont quelques champs seraient masqués.

## 10. Normalisation et projections

La normalisation privée commune est distincte des projections spécialisées visuelles ou sonores.

```text
internes P0
↓
normalisation sémantique commune
↓
contrat P1 minimal
↓
projections spécialisées allowlistées
```

CREAD-LIVE ne doit pas inventer ou publier les recettes propriétaires Cœur → descripteurs perceptifs. Les projections visuelle et sonore convergées restent les contrats qualifiés par leurs chantiers respectifs.

## 11. Sources et replay

Fixtures, replay, LAB et live doivent converger vers la même sémantique P1.

Pour un même état source, replay et live doivent produire une observation sémantiquement équivalente après exclusion des seules métadonnées propres au transport/runtime.

Le replay durable consommable par les modules est sémantique et allowlisté ; les replays privés bruts ne deviennent pas un format client.

## 12. Cadence et coût

La cadence biologique du Cœur, la cadence de lecture/publication P1 et la cadence de rendu sont distinctes.

CREAD-LIVE doit qualifier une politique de lecture/publication, des timeouts et des limites de message à partir de mesures réelles. Une lenteur ou panne P1 ne doit pas exercer de backpressure bloquante sur le commit canonique.

Le coût pertinent comprend lecture, normalisation, sérialisation, transport et publication, avec CPU/RAM/I/O/latence mesurés.

## 13. Restart, panne et resynchronisation

P1 doit pouvoir s’arrêter, redémarrer et se reconnecter sans modifier P0. Après reprise, il décide de la continuité à partir des faits réellement disponibles et n’invente pas d’historique perdu.

Un arrêt ou échec du reader, du publisher, d’un renderer ou d’un module aval ne doit pas arrêter un Cœur sain.

P0 O2/O3/O4 restent des gates fermées ; CREAD-LIVE vérifie comment P1 observe correctement leurs conséquences sans les réexécuter comme nouveau chantier P0.

## 14. Gates CREAD-LIVE

Avant PASS, démontrer notamment :

- lecture P0 strictement read-only ;
- aucune permission de lecture directe du stockage P0 pour le processus P1 ;
- allowlist positive et versionnée ;
- identité/révision/âge exacts ;
- aucun raw state ou secret au wire ;
- version incompatible → fail explicit ;
- C01–C08 live ;
- replay/live equivalence ;
- restart/reconnect ;
- isolation des pannes ;
- aucune backpressure bloquante vers P0 ;
- limites/timeouts/cadence qualifiés ;
- coût mesuré ;
- régressions P0/P1 préservées.

## 15. Conséquence d’un PASS CREAD-LIVE

Un PASS permettra de considérer, au niveau **théorique/LAB** :

```text
P0 = Cœur autoritatif qualifié
P1 = interface live qualifiée
P0 + P1 = socle canonique fonctionnel d’Avelune
```

Cela ne vaut pas encore qualification complète d’exploitation, d’observabilité, de migration ou d’endurance.

L’ordre suivant est :

```text
P3 — ORCH-1
→ P2 — OBS-1 finalisation
→ P4 si nécessaire
→ O5-MIGRATION
→ P5A/P5B/P6 live
→ isolation intégrée
→ freeze intégré
→ endurance 240 h
→ analyse exhaustive
→ décision CŒUR-1
```

## 16. Classification

### SHAREABLE

Contrats, invariants, formes allowlistées, principes de séparation des responsabilités et résultats agrégés.

### PRIVATE

Internes du Cœur, mappings privés, stockage, paramètres, topologie et détails d’exploitation non nécessaires au contrat.

### SECRET / CODEX

Recettes, causalités profondes, seeds/RNG, mécanismes latents et contenu narratif/cosmologique réservé ne sont jamais requis pour le fonctionnement normal des clients.

## 17. Références de phase

- [`docs/development/P0_AUTH_CLOSURE_2026-08-21.md`](development/P0_AUTH_CLOSURE_2026-08-21.md)
- [`docs/development/PRE_P6_TRANSVERSE_2026-08-21.md`](development/PRE_P6_TRANSVERSE_2026-08-21.md)
- [`docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md`](development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md)
