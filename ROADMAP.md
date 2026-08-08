# Roadmap — Les Lisières d’Avelune

## Repères actuels

- `v0.8` : ancien jalon historique ;
- `v0.8.3` : dernière baseline de conception figée avant PROTO-0.1 ;
- **PROTO-0.1** : baseline jouable intégrée à `main` ;
- **PROTO-0.2.1** : passe UX/règles intermédiaire ;
- **PROTO-0.2.2** : candidat de playtest distribué **finalisé, validé et poussé** sur `develop/proto-0.2.2-playtest`.

Il n’existe pas encore de nouvelle version stable arbitrairement nommée `v0.9`.

## Phase actuelle

Le projet est dans la phase :

**PROTO-0.2.2 validé → déploiement public sur instruction explicite → collecte de playtests → analyse avant prochain jalon.**

Le lot fonctionnel de référence est le commit `d3b080c` (`PROTO-0.2.2: finaliser le playtest distribue`). La documentation peut évoluer après ce commit, mais les mécaniques du playtest doivent rester gelées hors bugs bloquants.

La boucle testée reste :

```text
implantation
→ économie
→ recherche / évolution
→ préparation défensive
→ vague
→ conséquences
→ adaptation
→ victoire ou défaite
```

## Jalon courant — PROTO-0.2.2

Branche : `develop/proto-0.2.2-playtest`.

Cahier : `docs/development/proto0.2/`.

### 1. Plateau et modèle mental du Corcite

- [x] plateau hexagonal comme modèle actif du Corcite ;
- [x] principe `1 bâtiment = 1 case` ;
- [x] ressources de sol pour l’extraction ;
- [x] réseau direct/ports/câbles retirés du parcours actif ;
- [x] pas d’adjacence, distance, orientation ou logistique spatiale dans ce jalon ;
- [x] prévisualisation d’un extracteur compatible/incompatible sans interdiction artificielle ;
- [x] revue humaine desktop/mobile effectuée ;
- [ ] mesurer en playtest distribué si le plateau est réellement naturel à comprendre et à manipuler.

Défauts visuels mineurs acceptés pour P02.2 : doubles bordures/superpositions légères entre hexagones et optimisation possible de l’espace périphérique du plateau.

### 2. Démarrage et économie

- [x] plateau vide au départ ;
- [x] kit de déploiement non posé et hors inventaire ;
- [x] premier stockage déclenchant l’entrée des matières primaires dans le stock ;
- [x] aucun stockage natif permanent du Corcite ;
- [x] capacité fournie par les bâtiments de stockage ;
- [x] inventaire global ;
- [x] asymétrie légère Organique / Minéral ;
- [x] extraction, transformation et fabrication dans la boucle ;
- [x] Atelier, Fabrique défensive et Recyclerie dans le périmètre ;
- [x] réservation des matières et sortie bloquée sans destruction ;
- [x] démontage/remontage temporisé ;
- [x] simulations de non-soft-lock ;
- [ ] recalibrer seulement si les sessions distribuées montrent une dérive réelle.

### 3. Énergie, population et entretien

- [x] énergie active dans le modèle P02.2 ;
- [x] population et travail intégrés ;
- [x] entretien global ;
- [x] états de blocage explicités dans l’interface ;
- [ ] vérifier par télémétrie et retour humain que ces contraintes produisent des arbitrages sans surcharge de microgestion.

### 4. Recherche / progression

- [x] recherche comme couche transversale ;
- [x] déblocage de la Transformation ;
- [x] améliorations d’Extraction, Transformation, Fabrication, Recyclerie et Stockage ;
- [x] progression répétable volontairement bornée ;
- [x] effet de réduction de durée avec plancher à un cycle lorsqu’applicable ;
- [ ] vérifier que les recherches ouvrent de vrais choix sans devenir un arbre technologique prématuré.

### 5. Défense et vagues

Pour PROTO-0.2.2 uniquement :

- [x] une famille défensive active : **Affaiblissement** ;
- [x] une caractéristique active de vague : **Puissance** ;
- [x] chemin `Fracture → positions 1..8 → Corcite` ;
- [x] réduction séquentielle de la Puissance ;
- [x] première défense accessible avec les matières primaires ;
- [x] Puissance résiduelle `0` → victoire immédiate du testeur ;
- [x] Intégrité du Corcite `0` → victoire du jeu ;
- [x] vagues strictement plus puissantes ;
- [x] suppression du nombre fixe de trois vagues ;
- [x] aucune matière de vague/captation dans l’économie du jalon ;
- [x] trajectoires de victoire et de défaite simulées ;
- [ ] redéfinir **après les playtests** la nature réelle de la vague et ses futures caractéristiques.

Les anciennes notions `pression / structure / charge / matière capturable` restent historiques et ne constituent pas le canon futur.

### 6. UX, playtest distribué et direction visuelle

- [x] Gen3 retenu comme référence de **composition** seulement ;
- [x] HUD de ressources compact ;
- [x] navigation Corcite / Stock / Évolution / Production / Défenses ;
- [x] plateau central et contexte séparé ;
- [x] Stock global contextualisé ;
- [x] sessions anonymes à code 4 chiffres ;
- [x] sauvegarde/reprise serveur ;
- [x] feedback permanent `Signaler / proposer` ;
- [x] version/commit visible ;
- [x] revue desktop + 390×844 + 360×800 jugée acceptable ;
- [x] direction provisoire : onirique, queer, organique/minérale, biomorphique, violet/prune/lavande/opaline ;
- [ ] produire et comparer plusieurs pistes graphiques du Corcite ;
- [ ] mesurer en playtest lisibilité, rythme, fatigue cognitive et compréhension.

Pistes UX explicitement reportées après P02.2 : meilleure exploitation du panneau droit et de l’espace autour du plateau, éventuel déplacement des ressources/actions globales hors du bandeau supérieur.

### 7. Qualité et architecture

- [x] séparation données / logique / état / présentation comme principe ;
- [x] cœur P02.2 indépendant de la persistance ;
- [x] PostgreSQL 17 minimal sans ORM lourd ;
- [x] repositories testables avec fakes mémoire ;
- [x] migration additive ;
- [x] tests : **380/380** ;
- [x] `svelte-check` : **0 erreur, 0 warning** ;
- [x] build production/Docker vert ;
- [x] PostgreSQL réel validé ;
- [x] smoke HTTP réel validé ;
- [x] garde-fous API validés ;
- [x] feedback PostgreSQL → SMTP réel validé de bout en bout ;
- [x] rapport d’implémentation mis à jour ;
- [x] commit/push P02.2 effectué ;
- [ ] audit `npm audit --omit=dev` à classer avant une future release stable ;
- [ ] simplification/refactor uniquement après retour de playtest, pas pendant la collecte.

## Gate de sortie PROTO-0.2.2

Les critères techniques et de revue nécessaires à la diffusion sont **atteints** :

1. run jouable de bout en bout ;
2. trajectoires gagnantes et perdantes ;
3. absence de soft-lock économique structurel identifié ;
4. états importants lisibles ;
5. desktop et mobile utilisables ;
6. tests, build et simulations validés ;
7. persistance réelle validée ;
8. feedback et SMTP validés ;
9. revue humaine acceptée ;
10. branche poussée.

Le déploiement public reste une action séparée nécessitant une instruction humaine explicite.

## Après distribution de PROTO-0.2.2

Geler les modifications fonctionnelles hors bugs bloquants et collecter pendant plusieurs semaines :

- compréhension du Corcite ;
- plaisir de placement/manipulation ;
- qualité des arbitrages économiques ;
- valeur de la recherche ;
- fréquence et causes des `forced_wait` ;
- rythme du run ;
- intérêt de la préparation défensive ;
- tension des vagues ;
- qualité des rapports ;
- fatigue cognitive ;
- identité visuelle perçue ;
- critiques, désaccords, simplifications et propositions spontanées.

Ensuite seulement décider :

- quelles mécaniques du plateau doivent gagner en profondeur ;
- si et comment un réseau productif plus proche de Factorio/LabVIEW revient ;
- comment redéfinir la vague avec environ 4 à 6 caractéristiques pertinentes ;
- quelles dimensions RPG doivent être approfondies ;
- quels systèmes deviennent assez stables pour une architecture production plus complète ;
- quel contenu mérite d’être ajouté.

## Principes qui ne dépendent pas du jalon

- monde partagé unique ;
- protection collective de la Lisière ;
- coopération directe facultative ;
- progression principalement horizontale ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO/micro-dopamine comme moteur de rétention ;
- plusieurs styles de jeu légitimes ;
- accessibilité intégrée ;
- identité queer et non genrée ;
- architecture sobre, modulaire et évolutive sans sur-conception prématurée.
