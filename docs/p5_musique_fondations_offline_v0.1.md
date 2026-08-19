# P5B — MUSIQUE / UNIVERS SONORE — fondations offline v0.1

> Date : 19 août 2026  
> Statut : **architecture PASS · cahier des charges VERT pour reconstruction offline · OFFLINE PASS NON · LIVE BLOCKED OUI**

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

Le schéma partageable commun doit être synchronisé par le propriétaire de P1 avant que P5B ne fige son propre contrat d’entrée. P5B ne crée pas de fork amont.

## Thème et adaptation à l’observateur

Le thème est une couche de présentation musicale située après la structure/mémoire et avant le renderer. Il peut modifier fortement l’orchestration, les familles timbrales, la couleur harmonique, le registre, l’espace, la densité et d’autres dimensions esthétiques sans modifier les faits ni l’histoire musicale structurelle.

Changer de thème ne remet pas la mémoire à zéro. Une même histoire doit pouvoir être rendue par au moins deux thèmes nettement différents tout en restant la même histoire d’Avelune.

Le goût et l’accessibilité restent séparés : un même thème doit pouvoir être utilisé avec des réglages sensoriels très différents.

## Phases

### MUS-0 — fondation contractuelle offline

Entrée P1, `MusicPayload` expérimental, loader/session, replay loader, replay clock, resynchronisation, isolation multi-Avelune, allowlist, fixtures et tests de frontière.

### MUS-1 — état perceptif et mémoire

État musical non canonique, mémoire reconstructible et bornée, déduplication, reprise après snapshot, aucune invention de passé manquant.

### MUS-2 — grammaire abstraite

Plan musical structurel déterministe, continuité, motifs, transformations, silence, temporalité musicale, thèmes et accessibilité séparés.

### MUS-3 — renderer témoin et qualification perceptive

Port de rendu, fake renderer, premier renderer audio témoin remplaçable, protocole d’écoute comparative et mesures locales.

### MUS-4 — premier semantic replay réel clos

Même pipeline sur une projection réelle produite offline par P1 depuis un artefact clos, sans accès aux internes du Cœur et sans refonte conceptuelle.

### MUS-5 — paquet de préparation P6 / futur live

Ports stables, reprise/resync, préférences, budget cumulé, intégration offline et readiness replay → live.

## Corpus de qualification offline

Le corpus doit couvrir au minimum : stabilité, saut de révision canonique sans gap de publication, doublon, vrai gap de publication, changement de stream, isolation de deux mondes, longue histoire lente, transition, événement dupliqué, historique partiel, deux histoires divergentes puis partiellement convergentes, deux thèmes, accessibilité forte, version incompatible, champ non allowlisté, replay corrompu, interchangeabilité fixture/replay et longue séquence pour la mémoire.

## Gates du socle

Le socle ne sera déclaré `OFFLINE PASS` qu’après qualification mécanique de :

- validation/versionnement stricts ;
- continuité `publication_seq` ;
- resynchronisation ;
- isolation multi-Avelune ;
- intégrité replay ;
- déduplication ;
- absence d’invention d’histoire ;
- mémoire reconstructible et bornée ;
- déterminisme du plan structurel ;
- thème n’altérant pas l’histoire ;
- accessibilité n’altérant pas faits/mémoire/structure ;
- renderer découplé du contrat monde ;
- aucune importation des internes Cœur/P2/P3/P4 ;
- scan de fuite ;
- non-régression de coût offline.

## Statut des dépendances

- P0/O1 : **intouchable** ; ne bloque pas le travail offline.
- P1 : frontière amont ; synchronisation documentaire `publication_seq` encore nécessaire avant gel du contrat MUS-0.
- P2/P3/P4 : non bloquants pour P5B offline.
- P6 : intégrateur futur, non bloquant.
- P8 : persistance future des préférences, non bloquante pour les profils locaux.
- moteur audio final, races et TF/TD/RPG : non requis pour fermer les fondations P5B.

## Critère anti-réécriture

La future livraison d’un semantic replay réel P1 doit traverser le même pipeline que les fixtures et produire le même type de plan musical sans accès aux internes du Cœur et sans refonte conceptuelle de la grammaire ou du renderer.

Le corpus de références scientifiques et artistiques existant est conservé et reste référencé dans `docs/26_univers_sonore_references_methode.md`.
