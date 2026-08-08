# CURRENT TASK — P02-002 — PROTO-0.2.1 structure UX et lisibilité

**Status : READY_FOR_IMPLEMENTATION**

**Base obligatoire : `develop/proto-0.2-ux-rules`**

Baseline de référence : tag `proto-0.2.0-tech`.

## Mission

Transformer la baseline techniquement saine mais humainement insuffisante en une **sous-version UX cohérente**, sans encore refondre l’équilibrage complet ni figer le rythme final du mini-jeu.

Ce lot doit résoudre les défauts révélés par la première revue visuelle humaine : composition trop grande, hexagones instables, informations mal groupées, pictogrammes insuffisants, progression trop volumineuse, kit initial affiché hors contexte et architecture desktop difficile à transposer proprement sur mobile.

Lire obligatoirement, dans cet ordre :

1. `/AGENTS.md`
2. `docs/development/proto0.2/08_SUBVERSIONS_RHYTHM_AND_PLAYTEST.md`
3. `docs/development/proto0.2/09_P02_1_ACCEPTANCE_DELTA.md`
4. `docs/development/proto0.2/00_CHARTER.md`
5. `docs/development/proto0.2/01_RULES_AND_SCOPE.md`
6. `docs/development/proto0.2/02_UX_SPEC.md`
7. `docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md`
8. `docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md`
9. code réel et tests avant modification.

Les documents `08` et `09` prévalent lorsqu’ils modifient explicitement la baseline 0.2.0.

---

## 1. Objectif UX principal

Construire l’interface comme **six blocs fonctionnels réutilisables**, pas comme une grande page desktop à réduire ensuite :

- A — identité / état du Corcite ;
- B — ressources ;
- C — navigation ;
- D — espace de travail ;
- E — contexte ;
- F — activité / productions / rapports.

Desktop et mobile doivent utiliser les mêmes données et responsabilités de composants. La mise en page peut changer fortement selon le breakpoint.

Ne pas créer un moteur de layout générique. Utiliser les composants et le CSS nécessaires au prototype réel.

---

## 2. Structure du Corcite

Remplacer le vocabulaire joueur `Plateau` par le terme UX provisoire `Structure` / `Structure du Corcite`.

Corriger impérativement :

- hexagones qui paraissent se superposer ;
- cases qui se déplacent visuellement pendant l’implantation ;
- géométrie différente avant/après pose ;
- gisements trop nombreux ou trop présents visuellement ;
- pictogrammes de fonctions trop similaires.

La carte doit être stable : une case conserve exactement sa position et sa taille quel que soit son état.

Une densité de gisements plus faible peut être testée pour améliorer la lecture. `2 organiques + 2 minéraux` est une hypothèse de laboratoire, pas une règle canonique ; la décision finale reste ouverte.

---

## 3. Ressources et état du Corcite

Réorganiser le haut d’écran :

- rapprocher Intégrité, énergie, population et entretien de l’identité du Corcite ;
- utiliser `icône + nom + valeur`, pas des nombres isolés ;
- rendre la zone Ressources plus compacte ;
- supprimer les quatre grands rectangles s’ils ne justifient pas leur surface ;
- afficher les matières primaires d’amorçage dès le départ.

Le joueur doit comprendre :

- `4 organique + 4 minéral` existent dès l’ouverture ;
- avant le premier stockage ils sont des ressources d’amorçage hors capacité mécanique normale ;
- poser le stockage fournit une capacité, il ne crée pas les matières.

Ne pas ajouter de stockage natif caché.

---

## 4. Pictogrammes et cohérence visuelle

Créer/adapter un petit jeu de pictogrammes suffisamment distincts pour :

- stockage ;
- énergie ;
- entretien ;
- construction ;
- extraction organique ;
- extraction minérale ;
- fabrication défensive ;
- ressources principales ;
- recherches déjà présentes lorsque pertinent.

Une icône ne porte jamais seule une donnée essentielle : conserver un libellé lisible.

Éviter de tout représenter par un losange abstrait semblable.

---

## 5. Corcite visuel

Remplacer/améliorer la représentation actuelle trop proche d’une sphère/planète/atome magique.

Cible provisoire :

- non anthropomorphe ;
- asymétrique ;
- biomorphique ;
- organique + minéral ;
- membranes internes, croissance cristalline, nervures, pétales abstraits ou volumes similaires sans créer d’animal/personnage ;
- prune/violet/lavande/opaline/iridescent ;
- plus de profondeur visuelle que la baseline 0.2.0.

Ce n’est toujours pas la direction artistique finale.

---

## 6. Évolution

Compacter fortement la vue actuelle.

Chaque recherche doit afficher clairement :

- icône ;
- nom ;
- effet ;
- coût ;
- durée ;
- état/niveau.

Faire apparaître visuellement les relations ou déblocages réels entre recherches. Ne pas inventer de prérequis uniquement pour obtenir un dessin d’arbre.

Le but est que le joueur comprenne rapidement ce que chaque choix améliore et ce qu’il ouvre.

---

## 7. Production et contexte

Le petit inspecteur contextuel ne doit plus être le seul endroit où gérer une fonction importante de fabrication.

Préparer une entrée/bloc `Production` qui peut apparaître dans la navigation lorsque le Corcite possède une fonction pertinente.

Le bloc Production doit pouvoir accueillir progressivement :

- transformations ;
- Atelier de construction ;
- Fabrique défensive ;
- Recyclerie ;
- ordres en cours ;
- sorties bloquées.

Pour P02.1, ne pas inventer de nouvelle économie : réorganiser les fonctions existantes proprement.

Le panneau Contexte reste destiné à l’objet sélectionné, aux prévisualisations et actions locales.

---

## 8. Kit initial

Le kit ne doit plus rester comme un grand bandeau dans toutes les vues.

Pendant le déploiement :

- vue Structure : kit disponible ;
- Évolution / Défenses / autres vues : au maximum une indication compacte renvoyant à Structure ;
- après déploiement : disparition du kit de l’interface courante.

Ne pas modifier encore de façon définitive la composition des sept fonctions gratuites : ce point est explicitement réservé à PROTO-0.2.2 après comparaison de plusieurs ouvertures.

---

## 9. Passage de cycle et activité

Ajouter un feedback perceptible lorsque le joueur termine un cycle :

- indication claire du cycle terminé ;
- progression vers le suivant ;
- résumé court des actions résolues ;
- rapport consultable ensuite.

Une animation courte de résolution/progression est autorisée si :

- elle n’introduit aucune mécanique temps réel ;
- elle est rapide ;
- elle peut être ignorée/skippée ;
- `prefers-reduced-motion` est respecté.

Ne pas créer une animation longue répétitive.

---

## 10. Sauvegarde

Conserver l’autosauvegarde par profil.

Rendre l’état de sauvegarde visible. Une action manuelle `Sauvegarder maintenant` peut être ajoutée si elle est utile, mais elle ne doit pas devenir une obligation ni l’action principale.

---

## 11. Responsive

Critère fort : un écran desktop courant doit être utilisable à zoom navigateur `100 %`.

Mobile :

- réutiliser les mêmes blocs ;
- les empiler/réordonner ;
- utiliser drawer/bottom-sheet pour le contexte si pertinent ;
- pas de scroll horizontal structurel ;
- pas de drag obligatoire ;
- cibles tactiles raisonnables ;
- aucune fonction essentielle supprimée.

---

## 12. Ce que ce lot ne doit PAS résoudre

Ne pas encore :

- refaire tout l’équilibrage des vagues ;
- modifier arbitrairement le nombre final de cycles/vagues ;
- figer une durée en minutes ;
- décider définitivement du kit initial ;
- définir la forme finale de l’amélioration défensive ;
- créer plusieurs familles de tours ;
- réintroduire réseau/Factorio ;
- ajouter de nouvelles ressources ;
- changer la condition de victoire sans décision humaine explicite.

Les règles suivantes sont déjà actées pour le lot suivant et doivent seulement être respectées architecturalement :

- la première défense de base sera accessible avec matières primaires ;
- les matières secondaires devront être une évolution méritée ;
- le joueur choisira entre multiplier les tours, améliorer leur efficacité ou combiner les deux ;
- le jeu ne devra pas forcer artificiellement une seule de ces stratégies.

---

## 13. Validation

Avant de proposer le jalon `proto-0.2.1-ux` :

1. `npm run check` vert ;
2. `npm run test:proto0` vert ;
3. `npm run build` vert ;
4. `git diff --check` vert ;
5. smoke Docker/health si pertinent ;
6. contrôle humain desktop à zoom 100 % ;
7. contrôle humain mobile ;
8. géométrie hexagonale stable ;
9. ressources d’amorçage compréhensibles ;
10. progression plus compacte et lisible ;
11. blocs fonctionnels réutilisés ;
12. `IMPLEMENTATION_REPORT.md` mis à jour avec ce qui est réellement validé et ce qui reste rejeté/ouvert.

Le code peut être poussé avant le tag lorsqu’une phase intermédiaire est suffisamment saine. Le tag ne doit être posé qu’après vraie revue du sous-jalon.

Ne pas merger `main` ni déployer publiquement dans ce lot sans instruction explicite.
