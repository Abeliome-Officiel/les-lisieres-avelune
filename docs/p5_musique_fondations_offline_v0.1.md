# P5B — MUSIQUE / UNIVERS SONORE — fondations offline v0.1

> Date : 19 août 2026  
> Statut : **architecture PASS · MUS-0 OFFLINE PASS · MUS-1A PASS · P5B OFFLINE GLOBAL NON · LIVE BLOCKED OUI**

## Mission

P5B construit le sous-système musical réutilisable par la Fenêtre puis par le futur jeu. Il interprète une projection sémantique autorisée d’Avelune sans lire directement le Cœur ni devenir une seconde autorité.

Chaîne cible :

```text
P1 / Lecteur du Cœur
        ↓
WorldReadEnvelope + MusicPayload
        ↓
état perceptif musical
        ↓
mémoire / structure musicale
        ↓
thème choisi par l’observateur
        ↓
préférences sensorielles
        ↓
renderer audio remplaçable
```

## Reconstruction propre

P5B n’a aucune obligation de compatibilité avec l’ancien LAB MUSIQUE-0. Les anciens schémas, fixtures, noms de classes et formats intermédiaires restent des jalons historiques. Une brique n’est reprise que si elle s’intègre naturellement à la frontière P1 qualifiée et repasse les gates P5B.

Sont conservés comme invariants de conception :

- direction **satisfaisante · contemplative · onirique · féerique** ;
- Cœur strictement indépendant du sonore ;
- mémoire musicale de l’histoire ;
- adaptation aux goûts de l’observateur ;
- thème musical sélectionnable/modifiable localement ;
- accessibilité paramétrique indépendante du thème ;
- moteur audio remplaçable ;
- corpus scientifique et artistique sourcé ;
- séparation `[RÉFÉRENCE] / [HYPOTHÈSE AVELUNE] / [TESTÉ] / [ACTÉ]`.

## Frontière P1

P5B dépend uniquement du contrat de lecture P1. Les responsabilités P2 Observabilité, P3 Orchestrateur et P4 Tableaux ne constituent pas des sources perceptives pour la musique.

La forme P1 qualifiée distingue :

- `publication_seq` : continuité de publication dans une session ;
- `state_revision` : révision de l’état canonique représenté ;
- `canonical_age` : position dans le temps canonique.

Un saut de `state_revision` ne constitue donc pas à lui seul un trou de flux lorsque les snapshots publiés restent contigus. P5B ne suppose pas non plus que l’historique événementiel est exhaustif et n’invente jamais des événements absents.

Le schéma partageable commun doit être synchronisé par le propriétaire de P1. P5B ne crée pas de fork amont ; ce gap documentaire ne bloque pas la fondation offline P5B qualifiée.

## MusicPayload expérimental qualifié

MUS-0 qualifie côté consommation un `MusicPayload v0.1-exp` fondé sur cinq axes perceptifs ordinaux `0..4` :

- `presence` ;
- `activity` ;
- `variation` ;
- `continuity` ;
- `transformation`.

Ces axes ne sont ni des métriques biologiques, ni des paramètres musicaux, ni des paramètres audio. Aucun mapping Cœur → MusicPayload n’est publié ou défini dans P5B.

Les scopes admis sont le monde, des régions opaques et des représentations opaques. Les identifiants ne codent aucune race, généalogie, recette ou information biologique privée.

## Qualification MUS-0 — PASS

La fondation contractuelle offline MUS-0 est fermée avec **80/80 tests PASS**. La qualification couvre notamment :

- séparation `publication_seq` / `state_revision` / `canonical_age` ;
- resynchronisation et redémarrage de stream ;
- doublons idempotents et doublons contradictoires ;
- isolation stricte par `world_instance_id` ;
- JSON strict et allowlist ;
- contrôles explicites de confidentialité ;
- semantic replay `manifest.json` + `frames.ndjson` + `checksums.sha256` ;
- contrôle SHA-256 ;
- lecture streaming ligne par ligne ;
- politique de compatibilité de versions injectée et fail-closed ;
- équivalence sémantique fixture/replay hors métadonnées de transport ;
- historique partiel respecté sans invention d’événements ;
- absence d’import du Cœur, P2, P3 ou P4 ;
- absence de dépendance runtime tierce ;
- absence de dépendance réseau et d’artefact audio.

Une longue séquence synthétique de 5 000 snapshots a également été consommée par le chemin streaming avec mémoire de lecture bornée. Il s’agit d’une gate de fondation, pas encore d’un benchmark de production audio.

La projection événementielle et la déduplication `event_id` sont volontairement différées jusqu’à l’existence d’un contrat événementiel P1 qualifié. P5B n’invente pas ce contrat pour satisfaire une checklist locale.

## MUS-1A — état perceptif — PASS

La première tranche MUS-1 qualifie `MusicPerceptionState` avec **92/92 tests PASS**.

Cette couche est construite uniquement depuis `MusicSemanticObservation` déjà validée par MUS-0. Elle retire avant toute mémoire ou composition les métadonnées purement transport :

- `source_kind` ;
- `stream_id` ;
- `publication_seq`.

Elle conserve les faits sémantiques utiles, notamment `world_instance_id`, `state_revision`, `canonical_age`, l’exhaustivité historique déclarée et les profils perceptifs autorisés.

Un `semantic_fingerprint` déterministe permet de démontrer l’identité d’une observation sémantique entre fixture et replay. Cette empreinte n’est ni une seed, ni une identité canonique, ni un motif musical.

MUS-1A n’introduit encore aucun historique, motif, lissage, tempo, rythme, thème, accessibilité, renderer ou audio.

## Thème et adaptation à l’observateur

Le thème est une couche de présentation musicale située après la structure/mémoire et avant le renderer. Il peut modifier fortement l’orchestration, les familles timbrales, la couleur harmonique, le registre, l’espace, la densité et d’autres dimensions esthétiques sans modifier les faits ni l’histoire musicale structurelle.

Changer de thème ne remet pas la mémoire à zéro. Une même histoire doit pouvoir être rendue par au moins deux thèmes nettement différents tout en restant la même histoire d’Avelune.

Le goût et l’accessibilité restent séparés : un même thème doit pouvoir être utilisé avec des réglages sensoriels très différents.

## Phases

### MUS-0 — fondation contractuelle offline — **PASS / CLOSED**

Entrée P1, `MusicPayload` expérimental, loader/session, replay loader, replay clock, resynchronisation, isolation multi-Avelune, allowlist, fixtures, streaming, compatibilité et tests de frontière.

### MUS-1 — état perceptif et mémoire — **ACTIVE**

`MusicPerceptionState` est qualifié. La prochaine tranche construit une mémoire reconstructible et bornée, sans conservation illimitée de l’historique brut, sans invention du passé manquant et avec partitionnement strict par monde.

### MUS-2 — grammaire abstraite

Plan musical structurel déterministe, continuité, motifs, transformations, silence, temporalité musicale, thèmes et accessibilité séparés.

### MUS-3 — renderer témoin et qualification perceptive

Port de rendu, fake renderer, premier renderer audio témoin remplaçable, protocole d’écoute comparative et mesures locales.

### MUS-4 — premier semantic replay réel clos

Même pipeline sur une projection réelle produite offline par P1 depuis un artefact clos, sans accès aux internes du Cœur et sans refonte conceptuelle.

### MUS-5 — paquet de préparation P6 / futur live

Ports stables, reprise/resync, préférences, budget cumulé, intégration offline et readiness replay → live.

## Statut des dépendances

- P0/O1 : **intouchable** ; ne bloque pas MUS-1→3 offline.
- P1 : frontière amont ; gap documentaire `publication_seq` encore ouvert côté forme partageable, non bloquant pour MUS-0 qualifié.
- P0 live + P1 live : bloquants pour le futur branchement live.
- premier replay réel MUSIQUE : encore ouvert, non bloquant pour MUS-1→3 offline.
- P2/P3/P4 : non bloquants pour P5B offline.
- P6 : intégrateur futur, non bloquant.
- P8 : persistance future des préférences, non bloquante pour les profils locaux.
- moteur audio final, races et TF/TD/RPG : non requis à ce stade.

## Critère anti-réécriture

La future livraison d’un semantic replay réel P1 doit traverser le même pipeline que les fixtures et produire le même type de plan musical sans accès aux internes du Cœur et sans refonte conceptuelle de la grammaire ou du renderer.

Le corpus de références scientifiques et artistiques existant est conservé et reste référencé dans `docs/26_univers_sonore_references_methode.md`.
