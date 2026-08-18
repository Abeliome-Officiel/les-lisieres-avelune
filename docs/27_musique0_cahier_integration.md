# MUSIQUE-0 — cahier des charges d’intégration

> **Statut : préproduction partageable — v0.3**  
> Date : 18 août 2026  
> **Verdict : VERT pour MUSIQUE-0/1/2 hors ligne.**  
> Ce document n’autorise ni accès direct aux internes du Cœur, ni branchement live pendant une qualification opérationnelle en cours, ni choix prématuré d’un moteur audio.

## 1. Situation et objectif

La recherche biologique ouverte de CŒUR-0 est considérée suffisamment close pour avancer vers l’ingénierie de production. La qualification opérationnelle du Cœur permanent est en cours et reste indépendante de MUSIQUE.

MUSIQUE-0 doit maintenant démontrer qu’une histoire d’Avelune peut devenir une structure musicale cohérente, mémorielle, personnalisable et reproductible **sans faire de la musique une dépendance du Cœur ni une seconde simulation biologique**.

La règle centrale reste :

> **la grammaire musicale ne dépend jamais des structures internes d’une révision du Cœur.**

MUSIQUE ne possède pas d’adaptateur source relisant le Cœur. Cette responsabilité appartient à `CœurReadAdapter`, dans le périmètre CŒUR/intégration.

## 2. Architecture active

```text
état privé du Cœur
        ↓
CœurReadAdapter commun
        ↓
normalisation privée
        ↓
allowlist MUSIQUE
        ↓
WorldReadEnvelope + MusicPayload
        ↓
état perceptif musical
        ↓
mémoire / musical_plan
        ↓
thème esthétique du joueur
        ↓
préférences sensorielles
        ↓
renderer remplaçable
```

VISUEL suit une projection spécialisée sœur à partir de la même normalisation amont. Il n’existe ni adaptateur MUSIQUE lisant directement le Cœur, ni dépendance VISUEL → MUSIQUE ou MUSIQUE → VISUEL.

Fixtures, replay, LAB et future production deviennent interchangeables **à partir de la frontière contractuelle**.

## 3. Répartition des responsabilités

### CŒUR / intégration

Décide et garantit : identité du monde, révision, âge canonique, source/canonicalité, ordre, resynchronisation, primitives d’identité persistante, faits canoniques publiables et frontière d’exposition.

### MUSIQUE

Décide : `MusicPayload` proposé, état perceptif musical, mémoire, grammaire, motifs, structure, thèmes du joueur, composition, renderer et accessibilité sonore.

Le Cœur ne choisit ni tonalité, ni instrument, ni thème.

## 4. WorldReadEnvelope v0.1

Le noyau contractuel commun est décrit dans `docs/32_coeur_contrat_lecture_modules.md` et schématisé par :

`docs/contracts/world-read-envelope-v0.1.schema.json`

Il porte au minimum les primitives suivantes :

```text
contract_version
projection_version
world_instance_id
source_kind
stream_id
canonicality
state_revision
canonical_age
frame_kind
payload
```

Le `payload` est spécialisé. MUSIQUE ne reçoit pas automatiquement les données utiles au VISUEL ou aux outils d’administration.

L’ancien `representation-semantic-v0.schema.json` et ses trois fixtures neutres sont conservés comme **jalon historique Gate 0** ayant prouvé le découplage initial. Ils ne constituent plus la baseline active du contrat commun.

## 5. MusicPayload v0.1 expérimental

`MusicPayload` doit exprimer uniquement les faits et descripteurs perceptifs dont MUSIQUE démontre réellement le besoin.

Il n’est pas une copie renommée des champs du Cœur.

La procédure pour chaque besoin est :

```text
MUSIQUE propose un besoin perceptif X
        ↓
CŒUR/intégration vérifie :
- X est-il canonique/observable ?
- X est-il publiable sans fuite ?
- X peut-il être dérivé de manière stable ?
        ↓
acceptation minimale ou refus
```

Aucun coefficient, seuil, RNG, seed, fonction interne, diagnostic scientifique ou causalité propriétaire ne devient un descripteur simplement parce qu’il serait pratique musicalement.

## 6. État perceptif et grammaire

Après `MusicPayload`, MUSIQUE crée son propre **état perceptif musical**. Cette couche est aval et non canonique.

La grammaire peut ensuite explorer des propriétés musicales générales telles que :

- densité ;
- tension et résolution ;
- registre ;
- richesse timbrale ;
- activité rythmique ;
- continuité ;
- vitesse de transformation ;
- espace ;
- silence.

Ces propriétés sont musicales, pas biologiques.

Le premier objectif n’est pas un beau WAV final mais un **`musical_plan` déterministe et inspectable**.

## 7. Reproductibilité

Pour le laboratoire :

```text
même semantic replay
+ même contrat
+ même MusicPayload/projection version
+ même grammaire
+ même configuration MUSIQUE
= même musical_plan
```

Cette exigence porte sur la structure musicale. Le rendu audio final pourra être qualifié avec des tolérances propres aux plateformes et moteurs ; il n’est pas nécessaire de supposer dès maintenant un WAV bit-identique partout.

## 8. Mémoire musicale

La mémoire musicale est **réelle mais non canonique**.

Elle doit être :

- reconstructible depuis un replay compatible ;
- versionnée avec la grammaire ;
- partitionnée par `world_instance_id` ;
- indépendante de la seed du Cœur ;
- supprimable/régénérable sans changer l’histoire du monde ;
- incapable de mélanger silencieusement deux Avelunes.

Les caches associés à une représentation utilisent au minimum :

```text
world_instance_id + representation_id
```

Un test majeur opposera deux histoires différentes qui convergent vers un état final proche : leur mémoire musicale doit pouvoir conserver des différences perceptibles pertinentes.

## 9. Thème musical du joueur

Le thème est une **lentille esthétique aval**, séparée de l’état perceptif et de la mémoire.

Il peut agir sur l’orchestration, les familles de timbres, la couleur harmonique, le caractère acoustique/électronique/organique, l’ornementation, l’espace, le registre et d’autres dimensions artistiques compatibles avec la direction Avelune.

Il ne modifie pas les faits du monde.

Un changement de thème ne doit pas réinitialiser l’histoire musicale. Les motifs et continuités existants doivent pouvoir être réinterprétés dans la nouvelle palette.

Gate MUSIQUE-1 : **une même trajectoire doit pouvoir être rendue par au moins deux thèmes sensiblement différents tout en restant reconnaissable comme la même histoire musicale.**

La liste concrète des thèmes n’est pas actée à ce stade.

## 10. Accessibilité indépendante du thème

Thème esthétique et préférences sensorielles sont deux dimensions différentes.

Les axes de confort/accessibilité restent ajustables indépendamment autant que pertinent : dynamique, densité, répétition, richesse spectrale, basses, aigus, spatialisation, nombre de couches, complexité rythmique, sons ponctuels et quantité de silence.

Pas de mode neuroA unique. Des profils de départ sont possibles seulement s’ils restent modifiables.

Toute information critique possède un équivalent non sonore et les signaux fonctionnels restent reconnaissables quel que soit le thème.

## 11. Temporalités et replay clock

Toujours distinguer :

```text
temps LAB
temps canonique
temps humain
temps musical
```

Le replay loader fournit l’âge et l’ordre canoniques. MUSIQUE possède une **replay clock** et un temps musical propres pour compresser, ralentir, temporiser ou lisser l’écoute en laboratoire.

Cette horloge d’interprétation ne fabrique jamais un fait canonique absent.

La cadence actuelle d’un soak ou d’une campagne n’est jamais transformée implicitement en tempo ou cadence musicale de production.

## 12. Avelune Semantic Replay v0.1

Le format actif de replay de laboratoire est documenté dans :

`docs/contracts/avelune-semantic-replay-v0.1.md`

Structure :

```text
replay/
├── manifest.json
├── frames.ndjson
└── checksums.sha256
```

REPLAY-0.1 utilise des snapshots complets ordonnés par `state_revision`. Les deltas viennent plus tard.

Deux catégories sont séparées :

- raw/private replay ou observation brute : source interne éventuelle, jamais contrat durable MUSIQUE ;
- semantic replay : sortie du `CœurReadAdapter` et de l’allowlist, seule entrée durable du pipeline MUSIQUE.

Un artefact est homogènement PRIVATE ou SHAREABLE.

## 13. Fixtures et corpus

Le corpus initial doit comporter :

- fixtures neutres de validation de structure ;
- stabilité longue ;
- variation lente ;
- transition significative ;
- rupture puis récupération ;
- deux histoires différentes convergeant vers un état final comparable ;
- changement de `stream_id` ;
- trou/résynchronisation simulés ;
- tentative de mélange entre deux `world_instance_id`, qui doit échouer.

Les fixtures expressives restent explicitement synthétiques jusqu’à réception d’un semantic replay réel autorisé.

## 14. Sources closes réelles

Une baseline R1.1 figée peut servir à valider la mécanique de replay, l’ordre, les checksums et la reproductibilité.

Le premier replay réellement riche du vivant sera produit par CŒUR/intégration depuis un artefact R2 clos approprié, sans que MUSIQUE lise directement sa structure privée.

Le diagnostic réduit R2.10 inspecté historiquement n’est pas retenu comme replay musical : il contient des résultats scientifiques agrégés, pas une histoire sémantique temporelle adaptée au client.

Le clone privé créé lors de cette inspection reste un artefact de recherche figé et n’est pas poursuivi comme adaptateur MUSIQUE.

## 15. Gates MUSIQUE

### G0 — historique : PASS

Documentation initiale, frontière de publication, enveloppe neutre et fixtures A/B/C validées. `lab/musique0/GATE0_READY.md` reste une preuve datée et n’est pas réécrit rétroactivement.

### M0.1 — contrat commun

`WorldReadEnvelope v0.1` validable, identité/ordre/temps/source explicitement séparés.

### M0.2 — loader replay

Manifest, NDJSON et checksums validés ; version incompatible → échec explicite.

### M0.3 — isolement multi-monde

Aucun cache, motif, événement ou mémoire du monde A ne peut être appliqué silencieusement au monde B.

### M0.4 — état perceptif

Une même sémantique produit un état perceptif stable sans accès aux internes du Cœur.

### M0.5 — musical_plan

Plan déterministe et reproductible sur plusieurs trajectoires synthétiques.

### M1 — thèmes

Au moins deux thèmes nettement différents préservent la reconnaissance de la même histoire structurelle.

### M2 — mémoire

Continuité longue, reprise, reconstruction depuis replay et histoires convergentes qualifiées.

### M3 — renderer

Renderer factice puis audio consomment le même `musical_plan` sans modifier la grammaire ni le Cœur.

### M4 — accessibilité

Réduction forte de plusieurs axes indépendants sans perte d’information fonctionnelle critique.

### M5 — perception

Trajectoires contrastées perceptiblement différentes mais cohérentes avec l’identité **satisfaisante · contemplative · onirique · féerique**.

### M6 — ressources

Coût isolé connu puis charge cumulée testée avec les composants réellement concurrents.

### M7 — replay/live

Pour un même état source, replay et source LAB/live produisent une sémantique équivalente hors métadonnées de transport ; aucune logique musicale ne dépend de `source_kind`.

Une gate échouée ne peut pas être contournée par un accès direct aux internes du Cœur.

## 16. Charge machine et qualification Cœur

Le budget final n’est jamais celui de la musique seule.

Pendant un soak Cœur dont le protocole est déjà figé, MUSIQUE n’ajoute **aucun** observer, service de publication, accès au SQLite actif, benchmark audio/GPU ou charge lourde concurrente.

Le travail autorisé reste : documentation, schémas, fixtures, code offline, tests unitaires et replays clos.

Un futur test de cohabitation ne sera valable que si la vraie publication/consommation a été définie et figée **avant T0** du protocole concerné.

## 17. Technologie

Aucun moteur audio n’est sélectionné.

Ordre de décision :

```text
besoins → hypothèses → prototype → mesures → comparaison → choix
```

Évaluer ensuite compatibilité navigateur, latence, qualité, procéduralité, CPU/GPU/RAM/réseau/énergie, maintenance, pérennité et migration possible.

## 18. Frontière public / privé / CODEX

Les interfaces, méthodes, formats partageables, critères, références et résultats suffisamment agrégés peuvent être documentés sur GitHub.

Les recettes de traduction, mappings, réglages propriétaires et autres informations classées restent dans les espaces internes appropriés.

Aucun contenu CODEX ne doit être nécessaire au fonctionnement normal de MUSIQUE. Si le renderer ou la grammaire réclame un champ CODEX, la frontière est mauvaise.

## 19. Références et méthode

Le corpus spécialisé reste dans `26_univers_sonore_references_methode.md` avec les statuts : **[RÉFÉRENCE]**, **[HYPOTHÈSE AVELUNE]**, **[TESTÉ]**, **[ACTÉ]**.

Aucune source extérieure ne devient une loi par autorité.

## 20. Séquence technique immédiate MUSIQUE-0.1

1. adopter `WorldReadEnvelope v0.1` comme noyau actif ;
2. définir un `MusicPayload v0.1` synthétique minimal, sans prétendre décrire les internes du Cœur ;
3. implémenter le loader `Avelune Semantic Replay v0.1` ;
4. créer le corpus historique synthétique et les tests d’isolement multi-monde ;
5. créer l’état perceptif musical v0.1 ;
6. produire un `musical_plan` abstrait déterministe ;
7. ajouter mémoire reconstructible et déduplication d’événements ;
8. intégrer l’interface de thème joueur séparée de l’accessibilité ;
9. créer un renderer factice ;
10. préparer le protocole d’écoute comparative ;
11. consommer ensuite un semantic replay réel lorsqu’il est livré par CŒUR/intégration.

Cette séquence peut progresser longtemps **sans aucune nouvelle exposition de la biologie privée et sans attendre la fin du soak opérationnel**.
