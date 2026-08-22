# Cœur vivant — contrat de lecture des modules

> **Statut : architecture partageable — v0.7 — CREAD-LIVE applicatif qualifié**  
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

Le gate transverse PRE-P6 a qualifié la matrice C01–C08 offline. CREAD-LIVE a confirmé que la source live compose avec les mêmes `WorldReadEnvelope` et `ReadSession` sans introduire une seconde logique de continuité.

## 7. CREAD-LIVE — frontière réelle P0 → P1

CREAD-LIVE v1 est **PASS au niveau de la frontière applicative**.

Il applique le moindre privilège : **le processus P1 ne lit pas directement le stockage privé du Cœur et ne reçoit pas le raw state**.

La frontière v1 suit :

```text
P0 privé
        ↓
lecture read-only vis-à-vis de l’état autoritatif
        ↓
validation du committed state
        ↓
normalisation privée versionnée
        ↓
positive allowlist + identifiants opaques
        ↓
message CREAD versionné
        ↓
transport local
        ↓
validation stricte P1
```

Ainsi, une information privée n’est pas « protégée » parce qu’elle serait simplement ignorée après transmission : elle ne franchit pas la frontière si elle n’est pas nécessaire.

## 8. Transport CREAD v1

L’implémentation v1 retient une **Unix Domain Socket locale**, en request/response, avec un message JSON UTF-8 versionné.

Ce choix est une décision d’implémentation, pas une sémantique du contrat : le transport reste remplaçable.

Les détails concrets de chemins runtime, identités système, permissions, secrets techniques et topologie restent privés. Aucun listener réseau ou broker externe n’est requis pour CREAD v1.

Le transport ne devient pas une API générale d’inspection du Cœur : il sert à obtenir une observation qualifiée et allowlistée.

La qualification applicative ne remplace pas la qualification système P3 : ORCH-1 doit matérialiser l’isolation réelle du service et du canal local.

## 9. Données qui ne franchissent pas la frontière

Ne sont pas exposés par défaut :

- seed et état RNG ;
- recettes, coefficients et seuils ;
- structures de persistance ;
- diagnostics scientifiques privés ;
- causalités propriétaires ;
- CODEX ;
- credentials et secrets techniques ;
- identifiants internes et coordonnées privées non nécessaires ;
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

CREAD-LIVE ne publie ni n’invente les recettes propriétaires Cœur → descripteurs perceptifs. Les projections visuelle et sonore restent les contrats qualifiés par leurs chantiers respectifs.

## 11. Sources et replay

Fixtures, replay, LAB et live convergent vers la même sémantique P1.

La qualification CREAD-LIVE a démontré l’équivalence live/replay au niveau `WorldReadEnvelope` + `ReadSession` pour un même état sémantique publié.

Le replay durable consommable par les modules est sémantique et allowlisté ; les replays privés bruts ne deviennent pas un format client.

## 12. Cadence et coût

La cadence biologique du Cœur, la cadence de lecture/publication P1 et la cadence de rendu sont distinctes.

CREAD-LIVE a qualifié des limites et timeouts explicites ainsi qu’un coût local borné et mesuré. Les valeurs concrètes de déploiement et la cadence opérationnelle finale restent une responsabilité ORCH-1 et doivent être choisies à partir de mesures, sans redéfinir la sémantique CREAD.

Une lenteur ou panne P1 ne doit pas devenir une écriture ou un mécanisme d’autorité sur P0.

## 13. Restart, panne et resynchronisation

Le client P1 a été qualifié pour se reconnecter après redémarrage du service CREAD et échouer explicitement lorsque la source est indisponible.

La continuité après reprise reste décidée par P1 à partir des faits réellement disponibles ; aucun historique perdu n’est inventé.

Un arrêt ou échec du reader, du publisher, d’un renderer ou d’un module aval ne doit pas modifier un Cœur sain.

P0 O2/O3/O4 restent des gates fermées ; CREAD-LIVE observe leurs conséquences sans les réexécuter comme nouveau chantier P0.

## 14. Gates CREAD-LIVE — résultat

Qualification applicative :

- [x] lecture P0 read-only vis-à-vis de l’état autoritatif ;
- [x] P1 sans lecture directe du stockage P0 ;
- [x] allowlist positive et versionnée ;
- [x] identité/révision/âge exacts ;
- [x] aucun raw state ou secret au wire ;
- [x] version et forme incompatibles → échec explicite ;
- [x] continuité live déléguée au `ReadSession` P1 existant ;
- [x] replay/live equivalence ;
- [x] restart/reconnect ;
- [x] limites et timeouts explicites ;
- [x] coût local borné et mesuré ;
- [x] régressions P0/P1 préservées.

Reste hors de ce PASS : la matérialisation système définitive des identités de service, permissions, lifecycle, secrets runtime et isolation hôte. Cette gate appartient à P3 / ORCH-1.

## 15. Conséquence du PASS CREAD-LIVE

Au niveau **théorique/LAB** :

```text
P0 = Cœur autoritatif qualifié
P1 = interface live applicative qualifiée
P0 + P1 = socle canonique fonctionnel d’Avelune
```

Cela ne vaut pas encore qualification complète d’exploitation, d’observabilité, de migration ou d’endurance.

L’ordre suivant est :

```text
P3 — ORCH-1
→ P2 — OBS-1 FINALIZATION
→ P4 si nécessaire
→ O5-MIGRATION obligatoire
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
