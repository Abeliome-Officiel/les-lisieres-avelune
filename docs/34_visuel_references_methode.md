# VISUEL du vivant — références et méthode de recherche

> **Statut : registre partageable — v0.2**  
> Date : 19 août 2026

## Méthode

Chaque source utilisée est conservée selon quatre statuts : `[RÉFÉRENCE]`, `[HYPOTHÈSE AVELUNE]`, `[TESTÉ]`, `[ACTÉ]`.

Le registre est indépendant de la durée de vie du code : abandonner un prototype ou un renderer n’efface ni la source, ni l’hypothèse testée, ni le résultat négatif éventuel.

## Références déjà retenues

### L-systems / Algorithmic Botany

[RÉFÉRENCE] Prusinkiewicz et collaborateurs, travaux sur les L-systems et la modélisation du développement :
https://algorithmicbotany.org/papers/modeling-plant-development-with-l-systems.html

[HYPOTHÈSE AVELUNE] Utiles potentiellement pour certaines croissances/ramifications visuelles, sans devenir une seconde biologie.

### Clades

[RÉFÉRENCE] Algorithmic Botany Lab — *Clades* :
https://algorithmicbotany.org/clades/about.html

[HYPOTHÈSE AVELUNE] Étudier comment une grammaire compacte peut produire variation et parenté perceptive.

### Réaction-diffusion

[RÉFÉRENCE] Greg Turk — *Generating Textures on Arbitrary Surfaces Using Reaction-Diffusion*, SIGGRAPH 1991 :
https://faculty.cc.gatech.edu/~turk/reaction_diffusion/reaction_diffusion.html

[HYPOTHÈSE AVELUNE] Motifs, nervures ou marbrures reconstructibles, de préférence calculés à événement/cache plutôt qu’en continu.

### Cohérence temporelle

[RÉFÉRENCE] Bénard et al., Pixar / SIGGRAPH 2013 — *Stylizing Animation By Example* :
https://graphics.pixar.com/library/indexAuthorSenn.html

[ACTÉ] Une image belle mais instable dans le temps est un mauvais résultat pour le vivant d’Avelune. Continuité et identité temporelle sont des gates VISUEL.

### Level of Detail

[RÉFÉRENCE] Hugues Hoppe :
- https://www.microsoft.com/en-us/research/publication/view-dependent-refinement-of-progressive-meshes/
- https://www.microsoft.com/en-us/research/publication/smooth-view-dependent-level-of-detail-control-and-its-application-to-terrain-rendering/

[HYPOTHÈSE AVELUNE] Concentrer le calcul là où il apporte une valeur perceptive sans sacrifier identité ou information critique.

### Formes implicites / SDF / metaballs

[RÉFÉRENCE] Famille de travaux sur surfaces implicites et soft objects, notamment Wyvill.

[HYPOTHÈSE AVELUNE] Piste pour formes membraneuses, molles, fusionnantes ou transformations majeures continues.

### Particules / champs de flux

[RÉFÉRENCE] Famille établie de techniques de particules et flow fields.

[ACTÉ] Les particules décoratives sont fortement dégradables en mode SOBRE ou sous contrainte matérielle/sensorielle.

### Accessibilité et préférences visuelles

[RÉFÉRENCE] W3C/WAI — WCAG 2.2 :
- https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR40

[ACTÉ]
- pas de mode neuroA unique ;
- qualité matérielle et préférences visuelles/sensorielles sont deux axes distincts ;
- une information critique ne dépend exclusivement ni du mouvement ni de la couleur ;
- les préférences de l’observateur dans P5A sont exclusivement visuelles.

### Renderers navigateur

[RÉFÉRENCE] PixiJS v8 :
- https://pixijs.com/8.x/guides/components/scene-objects/particle-container
- https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture

[ACTÉ] Aucun renderer final n’est choisi. Le choix suit : besoin perceptif → prototype → mesure → comparaison → décision.

## Axes pour les futures références

Ajouter de nouvelles études/créations lorsqu’elles éclairent réellement : continuité/identité temporelle, croissance/transformation procédurale, perception du vivant, histoire perceptible, accessibilité sensorielle, préférences visuelles de l’observateur, sobriété/LOD/cache, rendu navigateur ou protocoles d’évaluation perceptive.

La correspondance propriétaire entre internes du Cœur et descripteurs visuels reste hors de ce registre public.
