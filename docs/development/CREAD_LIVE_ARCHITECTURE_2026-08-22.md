# CREAD-LIVE — frontière live P0 → P1

> Statut : cadrage architectural partageable — 22 août 2026  
> Implémentation et qualification : en cours dans P1 / Lecteur du Cœur.

## Objet

P0 porte l’état canonique d’une Avelune. P1 est le read plane durable qui publie une projection autorisée et porte l’autorité de continuité de publication.

CREAD-LIVE doit raccorder ces deux responsabilités sans transformer P1 en lecteur des structures privées du Cœur et sans créer une seconde autorité.

## Séparation des responsabilités

```text
P0 / Cœur
état canonique committé
        ↓
frontière privée de lecture
validation + normalisation + allowlist
        ↓
transport local remplaçable
        ↓
P1 / Lecteur
publication + session + continuité
        ↓
modules aval
```

Principes :

- P0 reste l’unique autorité canonique ;
- P1 reste l’unique autorité de continuité de publication ;
- P1 ne lit pas directement le stockage privé du Cœur ;
- la projection positive est construite avant la frontière P1 ;
- aucune seed, RNG, recette, causalité privée, structure de persistance ou donnée non nécessaire ne franchit cette frontière ;
- le protocole de transport est remplaçable et ne définit pas la sémantique du contrat.

## Transport CREAD v1

L’implémentation v1 retient une communication locale par **Unix Domain Socket**, en request/response et avec un message JSON UTF-8 versionné.

Ce choix vise une surface locale minimale et une séparation effective des privilèges sans ajouter de listener réseau ou de broker. Les chemins runtime, comptes système, permissions concrètes et détails d’exploitation restent privés.

Le transport ne doit jamais devenir une API générique permettant d’interroger les internes du Cœur. La surface v1 sert à obtenir une observation courante qualifiée et allowlistée.

## Invariants

- `world_instance_id` provient de P0 et reste indépendant de la machine ;
- `state_revision` provient de P0 et reste distinct de `publication_seq` ;
- `canonical_age` est transporté sans perte sous forme décimale exacte ;
- un état publié correspond à un seul état committé cohérent ;
- une version incompatible échoue explicitement ;
- un arrêt, ralentissement ou échec de P1 ne doit pas bloquer ni modifier un Cœur sain ;
- replay et live doivent être sémantiquement équivalents pour un même état source ;
- P1 conserve seul les décisions de duplicate, gap, changement de stream/monde, resynchronisation et exhaustivité d’historique.

## Qualification attendue

CREAD-LIVE doit notamment démontrer : lecture strictement read-only côté source, allowlist positive, absence de fuite privée, C01–C08 en live, replay/live equivalence, restart/reconnect, isolation des pannes, absence de backpressure vers le Cœur, limites et timeouts bornés et coût mesuré.

Un PASS CREAD-LIVE permettra de considérer **P0 + P1 comme le socle canonique fonctionnel d’Avelune au niveau théorique/LAB** : le Cœur autoritatif et son interface live qualifiée. Cela ne vaut pas encore qualification complète d’exploitation, de migration ou d’endurance intégrée.

## Ordre après CREAD-LIVE

```text
P1 — CREAD-LIVE
→ P3 — ORCH-1
→ P2 — OBS-1 finalisation
→ P4 — raccord opérateur si nécessaire
→ O5-MIGRATION
→ P5A / P5B / P6 live
→ isolation intégrée
→ freeze intégré
→ endurance 240 h
→ analyse exhaustive
→ décision CŒUR-1
```

P2 reste gelé pendant CREAD-LIVE puis ORCH-1 afin de ne reprendre qu’une fois lorsque les sources live P1 et P3 nécessaires existent réellement.

## Frontière de publication

Ce document décrit uniquement le contrat et les garanties partageables. Les structures internes du Cœur, mappings privés, recettes, paramètres, détails de persistance, topologie d’exploitation et secrets restent hors GitHub.
