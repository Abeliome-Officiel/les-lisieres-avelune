# MUSIQUE-0.1 — baseline du 18 août 2026

> **Statut : VERT pour développement offline**  
> Cette baseline complète le Gate 0 du 13 août sans le réécrire rétroactivement.

## 1. Ce qui reste acquis

Le Gate 0 historique reste valide : séparation Cœur/MUSIQUE, fixtures synthétiques neutres, validation mécanique, zones locales privées et absence de moteur audio choisi.

L’ancien schéma `representation-semantic-v0` et ses fixtures A/B/C restent conservés comme preuve du découplage initial.

## 2. Nouvelle autorité de frontière

`docs/32_coeur_contrat_lecture_modules.md` est désormais l’autorité partageable du raccordement Cœur → modules.

MUSIQUE ne développe plus son propre adaptateur lisant les internes du Cœur.

Architecture active :

```text
Cœur privé
   ↓
CœurReadAdapter commun
   ↓
normalisation privée
   ↓
WorldReadEnvelope + MusicPayload
   ↓
MUSIQUE
```

## 3. Replay

Le format de replay actif pour le LAB devient **Avelune Semantic Replay v0.1** :

```text
manifest.json
frames.ndjson
checksums.sha256
```

La première version contient des snapshots complets. Les deltas et optimisations réseau sont différés.

Un dump SQLite, un raw observer replay ou un rapport scientifique ne constitue pas le format durable de MUSIQUE.

## 4. R2.10 — décision de clôture du chantier exploratoire

L’inspection privée R2.10 menée avant cette baseline a rempli son rôle : confirmer la provenance des artefacts, identifier la nature diagnostique de `reduced_results.json`, vérifier la capacité historique d’observation neutre et démontrer qu’un accès direct aux internes n’est pas nécessaire comme architecture cible.

Le clone privé constitué pour cette exploration reste **figé comme artefact de recherche**. Il ne devient pas l’adaptateur MUSIQUE et aucun observer MUSIQUE spécifique n’est ajouté au Cœur à partir de ce chantier.

## 5. Périmètre immédiat

MUSIQUE-0.1 peut développer sans Cœur actif :

- `WorldReadEnvelope` et validation ;
- `MusicPayload` synthétique expérimental ;
- loader de semantic replay ;
- replay clock ;
- isolement par `world_instance_id` ;
- déduplication par `event_id` ;
- état perceptif musical ;
- mémoire reconstructible ;
- `musical_plan` déterministe ;
- thème esthétique sélectionnable par le joueur ;
- transformations d’accessibilité indépendantes ;
- renderer factice ;
- protocoles d’écoute comparative.

## 6. Thème du joueur

Le thème est placé après la structure/mémoire musicale et avant le rendu.

Il peut transformer l’orchestration et l’esthétique sans réécrire l’histoire perçue. Un changement de thème ne réinitialise pas la mémoire musicale.

Gate : au moins deux thèmes fortement distincts doivent pouvoir interpréter la même trajectoire en conservant la reconnaissance de la même histoire structurelle.

## 7. Multi-Avelune

Toute mémoire, cache ou historique est namespacé par `world_instance_id`.

Le minimum pour une mémoire liée à une représentation est :

```text
world_instance_id + representation_id
```

Aucune donnée musicale ne mélange deux Avelunes.

## 8. Qualification opérationnelle du Cœur

Pendant le soak Cœur en cours, MUSIQUE ne change rien au runtime actif : aucun observer, accès SQLite, publisher, benchmark audio/GPU ou charge concurrente supplémentaire.

Le travail reste offline.

## 9. Prochaine gate

La prochaine gate n’est plus « inspecter un export brut du Cœur ».

Elle est :

> **prouver qu’un semantic replay synthétique conforme à WorldReadEnvelope peut produire un `musical_plan` reproductible, mémoriel, isolé par monde et compatible avec plusieurs thèmes, sans connaissance de la source Cœur.**
