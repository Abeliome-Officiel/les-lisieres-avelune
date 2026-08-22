# CREAD-LIVE — frontière live P0 → P1

> Statut : **PASS — frontière applicative qualifiée** — 22 août 2026  
> La qualification système du déploiement reste une gate P3 / ORCH-1.

## Objet

P0 porte l’état canonique d’une Avelune. P1 est le read plane durable qui publie une projection autorisée et porte l’autorité de continuité de publication.

CREAD-LIVE raccorde ces deux responsabilités sans transformer P1 en lecteur des structures privées du Cœur et sans créer une seconde autorité.

## Architecture qualifiée

```text
P0 / Cœur
état canonique committé
        ↓
frontière privée de lecture read-only
validation + normalisation + allowlist
        ↓
observation CREAD versionnée
        ↓
transport local remplaçable
        ↓
P1 / Lecteur
validation + publication + session + continuité
        ↓
modules aval
```

Principes qualifiés :

- P0 reste l’unique autorité canonique ;
- P1 reste l’unique autorité de continuité de publication ;
- P1 ne lit pas directement le stockage privé du Cœur ;
- le raw state ne franchit pas la frontière P1 ;
- la projection positive est construite avant la frontière P1 ;
- les identifiants exposés sont opaques et ne révèlent pas les identifiants ou coordonnées privés du Cœur ;
- aucune seed, RNG, recette, causalité privée, structure de persistance ou donnée non nécessaire ne franchit cette frontière ;
- le protocole de transport est remplaçable et ne définit pas la sémantique du contrat.

## Transport CREAD v1

CREAD v1 utilise une communication locale par **Unix Domain Socket**, en request/response et avec un message JSON UTF-8 versionné.

Ce choix conserve une surface locale minimale sans listener réseau ni broker. Les chemins runtime, comptes système, permissions concrètes, secrets techniques et détails d’exploitation restent privés.

Le transport ne devient pas une API générique d’inspection du Cœur : il sert uniquement à obtenir une observation courante qualifiée et allowlistée.

## Invariants

- `world_instance_id` provient de P0 et reste indépendant de la machine ;
- `state_revision` provient de P0 et reste distinct de `publication_seq` ;
- `canonical_age` est transporté sans perte sous forme décimale exacte ;
- un état publié correspond à un seul état committé cohérent ;
- une version incompatible échoue explicitement ;
- un arrêt ou échec du Lecteur ne modifie pas le Cœur ;
- replay et live sont sémantiquement équivalents au niveau publié ;
- P1 conserve seul les décisions de duplicate, gap, changement de stream/monde, resynchronisation et exhaustivité d’historique.

## Qualification obtenue

Les gates CREAD-LIVE ont qualifié :

- lecture P0 read-only vis-à-vis de l’état autoritatif ;
- observation normalisée et allowlist positive ;
- client/serveur local versionnés ;
- validation stricte et comportement fail-closed ;
- exactitude identité/révision/âge canonique ;
- absence de fuite des champs privés recherchés ;
- limites de trame et timeouts explicites ;
- restart/reconnect ;
- équivalence live/replay au niveau `WorldReadEnvelope` + `ReadSession` ;
- conservation de P1 comme unique autorité de continuité ;
- régressions complètes P0 et P1 ;
- coût local borné et mesuré.

Les résultats détaillés d’exploitation, les mappings privés et les secrets ne sont pas publiés ici.

## Portée du PASS

`CREAD_LIVE=PASS_APPLICATION_BOUNDARY` permet de considérer au niveau **théorique/LAB** :

```text
P0 = Cœur autoritatif qualifié
P1 = interface live applicative qualifiée
P0 + P1 = socle canonique fonctionnel d’Avelune
```

Cela ne vaut **pas** qualification complète de l’isolation hôte ou de l’exploitation de production.

La gate suivante appartient à **P3 / ORCH-1** : matérialisation des identités de service, permissions minimales, lifecycle, gestion des secrets techniques, résistance aux substitutions de services, backup/restore opérationnels et isolation réelle. Ces détails restent hors documentation partageable.

## Ordre après CREAD-LIVE

```text
P3 — ORCH-1
→ P2 — OBS-1 FINALIZATION
→ P4 — raccord opérateur si nécessaire
→ O5-MIGRATION obligatoire
→ P5A / P5B / P6 live
→ isolation intégrée
→ freeze intégré
→ endurance 240 h
→ analyse exhaustive
→ décision CŒUR-1
```

P2 reste gelé pendant ORCH-1 afin de ne reprendre qu’une fois lorsque les sources live P1 et P3 nécessaires existent réellement.

## Frontière de publication

Ce document décrit uniquement les contrats, invariants et résultats agrégés partageables. Les structures internes du Cœur, mappings privés, recettes, paramètres, détails de persistance, topologie d’exploitation, permissions concrètes et secrets restent hors GitHub.
