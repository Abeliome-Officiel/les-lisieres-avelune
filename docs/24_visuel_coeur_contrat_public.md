# Visuel du Cœur et représentation du vivant — contrat partageable

> **Statut : cahier de préproduction partageable — v0.5**  
> Date : 18 août 2026  
> Les recettes propriétaires, paramètres non publics, causalités cachées et mécanismes réservés restent hors GitHub.

## 1. Mission et finalité

Le chantier VISUEL est responsable de la représentation du vivant d’Avelune et, à terme, de la **Fenêtre sur la Lisière**, module permanent du produit final.

La Fenêtre n’est ni une démo scientifique ni un dashboard. Elle doit donner l’impression :

> **Avelune existe et vit sans moi.**

Elle doit rendre perceptibles présence, croissance, continuité, raréfaction, disparition, recolonisation, divergence, transformation, âge et histoire.

Direction recherchée : **satisfaisante · contemplative · onirique · féerique**, dans la continuité de l’identité **poétique · organique · minérale · florale-abstraite · queer** d’Avelune.

## 2. Autorité biologique et principe « graphisme ≠ biologie »

Le Cœur reste exclusivement l’autorité sur l’état canonique du vivant. Le visuel ne décide jamais naissance, survie, reproduction, sélection, divergence, extinction, mue ou transformation canonique.

```text
sprite ≠ espèce
mesh ≠ lignée
couleur ≠ gène
shader ≠ mécanisme biologique
```

Une forme graphiquement réussie n’acquiert aucune existence canonique parce qu’elle plaît. Inversement, lorsqu’une continuité existe réellement dans le monde, la représentation doit conserver suffisamment de mémoire perceptive pour que cette histoire puisse être ressentie.

Le vivant d’Avelune n’a pas à reproduire les catégories terrestres : végétaloïde, minéral, fongique, diffus, flottant, colonial, floral-abstrait, géométrique, hybride ou difficile à classifier sont des familles perceptives possibles, jamais des catégories biologiques imposées au Cœur.

## 3. Frontière Cœur → VISUEL

L’autorité commune est [`docs/32_coeur_contrat_lecture_modules.md`](32_coeur_contrat_lecture_modules.md).

```text
état privé du Cœur
        ↓
CœurReadAdapter unique
normalisation privée/versionnée
        ↓
observation normalisée PRIVATE
        ↓
allowlist VISUEL
        ↓
WorldReadEnvelope + VisualPayload
        ↓
grammaire visuelle d’Avelune
        ↓
profil de présentation utilisateur
        ↓
renderer remplaçable
        ↓
Fenêtre / jeu / autres vues
```

VISUEL ne possède pas un second adaptateur relisant directement les internes du Cœur. Il propose les besoins de `VisualPayload`; la couche CŒUR/intégration décide si l’information demandée est canonique, observable, stable et publiable sans fuite.

VISUEL et MUSIQUE partagent le même noyau de lecture mais restent indépendants :

```text
                         ┌── VisualPayload → grammaire VISUEL → renderer
Cœur → WorldReadEnvelope ┤
                         └── MusicPayload  → grammaire SON    → renderer
```

Jamais `Cœur → VISUEL → MUSIQUE` ni l’inverse.

## 4. WorldReadEnvelope et identité multi-Avelune

Le noyau commun v0.1 transporte au minimum : `contract_version`, `projection_version`, `world_instance_id`, `source_kind`, `stream_id`, `canonicality`, `state_revision`, `canonical_age`, `frame_kind` et le `payload` spécialisé.

`world_instance_id` identifie le monde, indépendamment de la machine qui l’héberge. Redémarrage, migration et restauration contrôlée du même monde conservent cette identité. Un clone LAB destructif reçoit une identité distincte.

Chaque Avelune possède sa propre Lisière. Les instances sont désignées comme **Avelune A/B/C** ou par leur futur nom public, pas « Lisière A/B/C ».

Un cache d’identité visuelle doit être namespacé au minimum par :

```text
world_instance_id + representation_id
```

Un replay/flux doit en outre vérifier sa source/session. Un changement d’Avelune ne doit jamais réutiliser silencieusement cache, mémoire, replay ou événement d’un autre monde.

## 5. Révision, âge et trois cadences

`state_revision` ordonne les états committés et reste distinct de `canonical_age`, de l’heure système et de la séquence réseau.

Toujours séparer :

```text
cadence biologique du Cœur
cadence de publication sémantique
framerate graphique
```

Le navigateur peut interpoler une présentation entre deux états autorisés. Il ne peut pas inventer une naissance, une disparition, une mue ou une évolution biologique profonde.

La Fenêtre pourra afficher un âge d’Avelune dérivé de l’âge canonique sans révéler le facteur de conversion temps humain ↔ temps canonique. La cadence des soaks de laboratoire n’est pas l’horloge finale du produit.

Lorsque la représentation sera suffisamment mature, des replays perceptifs à horizons humains pourront aider à choisir une temporalité lisible et contemplative sans demander au Cœur d’accélérer pour le renderer.

## 6. Identité et continuité perceptive

Lorsqu’une continuité réelle existe, VISUEL reçoit un `representation_id` opaque et stable dans le namespace du monde. Il ne reçoit pas la généalogie interne nécessaire à la produire.

La représentation doit éviter : reroll complet à chaque snapshot, silhouettes sans mémoire, palettes arbitrairement redistribuées, jitter/scintillement permanents et « mutations » graphiques sans fait canonique correspondant.

Le spectateur doit pouvoir ressentir : **« cette forme a changé »** plutôt que **« une autre forme a été tirée au hasard »**.

Les mémoires, caches et éventuelles seeds d’apparence propres au VISUEL sont des données aval reconstructibles. Elles ne deviennent jamais une seconde identité biologique.

## 7. Mue comme gate VISUEL-2

La mue est un cas de qualification prioritaire :

```text
même representation_id
        +
transformation canonique majeure
        =
continuité perceptible
```

Le Cœur déclenche ou constate la transformation. VISUEL représente l’avant/après et peut produire une interpolation présentationnelle. Cette interpolation n’est jamais un état biologique intermédiaire canonique inventé.

Le test doit vérifier que l’identité reste reconnaissable à travers une transformation importante, y compris avec mouvement réduit.

## 8. Sources interchangeables et replay sémantique

Le même code VISUEL doit pouvoir consommer fixture, replay, snapshot de test, LAB et source canonique sans modifier sa grammaire ni son renderer.

Le format de référence LAB est **Avelune Semantic Replay v0.1** : `manifest.json`, `frames.ndjson`, `checksums.sha256`. La première version utilise des snapshots complets ; l’optimisation par deltas vient après.

Deux catégories restent distinctes :

1. replay brut/observer : PRIVATE, lié aux internes du Cœur et non consommé durablement par VISUEL ;
2. replay sémantique : produit par `CœurReadAdapter` + allowlist, format durable consommé par VISUEL.

Pour un même état source, replay et source live doivent produire la même sémantique utile hors métadonnées de transport. Une version incompatible échoue explicitement.

## 9. Resynchronisation et absence d’invention canonique

Le client vérifie monde, stream et révisions. Lorsqu’il détecte un trou, un désordre, un changement de source incompatible ou un cache appartenant à un autre monde :

```text
arrêt de la continuité inventée
        ↓
RESYNC_REQUIRED
        ↓
nouveau snapshot complet compatible
        ↓
reprise
```

Le renderer ne fabrique jamais une révision absente.

## 10. Direction perceptive

**Satisfaisante** : continuité, inertie, transformations lisibles, micro-réponses, stabilité identitaire et plaisir de percevoir un système cohérent.

**Contemplative** : lenteur, respiration, faible densité lorsque nécessaire, temps long et droit à l’immobilité.

**Onirique** : ambiguïtés, matières, formes et transformations qui évoquent le vivant sans recopier un bestiaire terrestre.

**Féerique** : délicatesse, lumière et étrangeté douce sans transformer systématiquement l’univers en cliché fantasy.

## 11. Renderer et familles techniques

Aucun renderer final n’est choisi. Canvas 2D sert actuellement de **renderer témoin VISUEL-1B** pour établir une baseline simple. PixiJS v8 reste un candidat raisonnable de LAB navigateur 2D/2,5D. Three.js/Threlte ou une autre approche 3D ne seront évalués que si une profondeur réelle apporte une valeur perceptive démontrée.

Familles à étudier selon les besoins : L-systems / Algorithmic Botany ; Clades et grammaires morphologiques ; réaction-diffusion ; SDF/metaballs/formes implicites ; particules/champs de flux ; cohérence temporelle ; Level of Detail ; standards WCAG/W3C, notamment réduction du mouvement et redondance de l’information.

Ces références éclairent les tests ; elles ne deviennent pas automatiquement les recettes d’Avelune.

## 12. Sobriété et qualité adaptative

```text
SERVEUR
Cœur + état committé
        ↓
projection compacte
        ↓ réseau

CLIENT
renderer visuel
```

Le serveur ne rend pas une vidéo/scène distincte par spectateur sans besoin démontré.

Principe : **maximiser la perception de vie par unité de calcul**.

Trois enveloppes matérielles restent prévues :

- **SOBRE** : identité, silhouette, transformations et informations essentielles ;
- **NORMAL** : cible artistique de référence ;
- **RICHE** : effets, profondeur, particules et détails supplémentaires.

En cas de contrainte, on dégrade d’abord effets décoratifs, densité de particules, sur-échantillonnage, profondeur secondaire et détails reconstructibles, jamais l’identité ou la vérité du monde.

## 13. Préférences perceptives utilisateur

La **qualité matérielle** et les **besoins sensoriels** sont deux axes indépendants. Un utilisateur peut conserver un rendu riche tout en demandant peu de mouvement, ou utiliser un rendu sobre avec une animation normale.

VISUEL doit pouvoir proposer des réglages indépendants tels que : quantité/vitesse de mouvement, pulsation, particules, parallaxe, halos/lueurs, flashes/transitions brusques, contraste, saturation, grain/bruit, profondeur et détails secondaires.

Il n’existe pas un unique « mode neuroA ». Des presets peuvent servir de points de départ, mais restent modifiables individuellement.

Ces réglages interviennent **après la sémantique identitaire**. Ils ne modifient jamais `world_instance_id`, présence, identité, continuité, chronologie, événements significatifs ni état canonique.

Une information importante ne doit dépendre exclusivement ni du mouvement ni de la couleur. Avec mouvement nul ou saturation fortement réduite, l’information critique doit rester accessible par une autre propriété perceptive.

La persistance de ces préférences relève à terme de la plateforme compte/préférences, pas du Cœur.

## 14. Roadmap VISUEL consolidée

1. **VISUEL-0 — contrat + fixtures + replay** : WorldReadEnvelope/VisualPayload, loaders, identités, replay sémantique, resync, audit de fuite et interchangeabilité ;
2. **VISUEL-1 — impression de vie à coût minimal** : plan neutre, renderer témoin, profils matériels et première vie perceptible ;
3. **VISUEL-2 — continuité + mue** : croissance, transformation majeure, identité avant/après ;
4. **VISUEL-3 — trajectoires historiques différentes** ;
5. **VISUEL-4 — environnement + traces + vagues** ;
6. **VISUEL-5 — première véritable Fenêtre intégrée**.

Le renderer Canvas précédemment appelé « VISUEL-2 » est désormais classé **VISUEL-1B** ; son nom de branche historique n’est pas réécrit.

## 15. Gates avant production visuelle lourde

Aucune production artistique massive n’est autorisée avant démonstration de : projection publique par allowlist sans fuite ; aucune dépendance persistante aux internes du Cœur ; `world_instance_id` vérifié de bout en bout ; impossibilité d’appliquer silencieusement cache/replay/flux A au monde B ; fixture/replay/live interchangeables sémantiquement ; resynchronisation sur trou/incompatibilité ; reproductibilité ; continuité d’identité et mue ; renderer remplaçable ; versions source/contrat/projection/grammaire/renderer distinguées ; profils SOBRE/NORMAL/RICHE ; préférences perceptives indépendantes et testées ; budgets CPU/GPU/RAM/réseau/stockage/énergie acceptables avec les autres composants actifs.

## 16. Qualification opérationnelle du Cœur

Le développement VISUEL peut continuer offline pendant les soaks du Cœur sur documentation, schémas, fixtures, code local et artefacts clos.

Il ne doit pas ajouter en cours de protocole un observer, publisher, benchmark GPU ou consommateur du stockage actif. Un futur soak intégrant une vraie publication légère devra définir et figer cette charge avant son démarrage.

## 17. Confidentialité

GitHub peut contenir architecture, interfaces partageables, direction artistique, méthodologie, accessibilité, références et résultats agrégés.

Restent PRIVATE/Coffre : sources brutes, champs Cœur consommés par l’adaptateur, mappings exacts, paramètres, recettes, provenance propriétaire, correspondances identitaires internes et causalités révélatrices.

Aucun contenu CODEX ne doit être nécessaire au renderer public. Une inspection du JavaScript ou du réseau ne doit pas permettre de reconstruire le Cœur.

## 18. État technique actuel

Les travaux synthétiques déjà réalisés restent utiles :

- VISUEL-0 : projection/fixtures/resync/anti-réécriture synthétique, 9/9 tests ;
- VISUEL-1 : plan de rendu neutre, port renderer, qualité adaptative, reduced motion, 7/7 tests ;
- renderer Canvas témoin VISUEL-1B : dessin navigateur synthétique, interpolation présentationnelle, 5/5 tests.

Ces preuves ne ferment pas encore VISUEL-0 : le prochain jalon important est la migration vers `WorldReadEnvelope + VisualPayload`, puis le premier replay sémantique réel produit offline depuis un artefact Cœur clos.

Le principe retenu reste : **Avelune produit le vivant ; le visuel en donne une perception cohérente, historique, accessible et remplaçable.**
