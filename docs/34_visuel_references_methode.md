# VISUEL du vivant — références et méthode de recherche

> **Statut : registre partageable de recherche — v0.2**  
> Date : 19 août 2026  
> Les références extérieures servent à formuler et tester des hypothèses. Elles ne décrivent ni les recettes propriétaires d’Avelune ni les mécanismes internes du Cœur.

## 1. Discipline documentaire

Toute référence réellement utilisée dans le chantier VISUEL est distinguée selon quatre niveaux :

### [RÉFÉRENCE]

Ce que la publication, le standard, la conférence ou le système extérieur montre réellement.

### [HYPOTHÈSE AVELUNE]

Ce que nous proposons d’en tirer pour Avelune. Cette proposition n’est pas attribuée rétrospectivement à la source.

### [TESTÉ]

Ce que le LAB VISUEL a effectivement vérifié sur ses propres fixtures, replays, renderers et matériels.

### [ACTÉ]

Ce qui est explicitement retenu comme décision d’Avelune après confrontation avec les besoins, mesures et lois du projet.

Une référence peut inspirer ou contredire une piste sans devenir une norme. Une technique pertinente dans un article peut être écartée si son coût, son accessibilité, sa maintenance ou son comportement temporel ne conviennent pas à Avelune.

**La pérennité du registre est indépendante de celle du code.** Une étude, œuvre ou norme ne disparaît pas du corpus parce que le prototype, renderer ou algorithme qu’elle a inspiré est supprimé. Un résultat négatif ou un abandon technique est documenté dans `[TESTÉ]` et/ou `[ACTÉ]` plutôt que d’effacer la source et l’apprentissage associé.

## 2. L-systems et développement procédural

### [RÉFÉRENCE]

Prusinkiewicz et collaborateurs, travaux d’Algorithmic Botany sur les L-systems et la modélisation du développement :

- https://algorithmicbotany.org/papers/modeling-plant-development-with-l-systems.html

Les L-systems fournissent un cadre compact pour décrire des processus de croissance et des structures ramifiées à partir de règles de réécriture.

### [HYPOTHÈSE AVELUNE]

Une grammaire de développement pourrait être utile pour certaines familles de silhouettes ou structures filamenteuses, à condition qu’elle reste un outil de représentation et non une seconde biologie.

### [TESTÉ]

Pas encore testé dans le renderer Avelune.

### [ACTÉ]

Famille technique admise au banc de recherche ; aucune recette L-system n’est imposée.

## 3. Clades et variation par grammaire

### [RÉFÉRENCE]

Algorithmic Botany Lab — *Clades* :

- https://algorithmicbotany.org/clades/about.html

Le projet constitue un précédent de diversification de formes générées à partir de grammaires et de mécanismes de variation.

### [HYPOTHÈSE AVELUNE]

Des variations paramétriques cohérentes pourraient aider à rendre parenté perceptive et diversification sans produire des tirages visuels indépendants à chaque frame.

### [TESTÉ]

Pas encore testé avec des histoires réelles d’Avelune.

### [ACTÉ]

Référence de recherche, pas modèle de biologie ni de généalogie pour Avelune.

## 4. Réaction-diffusion

### [RÉFÉRENCE]

Greg Turk — *Generating Textures on Arbitrary Surfaces Using Reaction-Diffusion*, SIGGRAPH 1991 :

- https://faculty.cc.gatech.edu/~turk/reaction_diffusion/reaction_diffusion.html

Le travail fournit un précédent classique de génération de motifs de surface par réaction-diffusion.

### [HYPOTHÈSE AVELUNE]

La réaction-diffusion pourrait servir à produire certains motifs, nervures ou marbrures reconstructibles, à événement ou en cache, plutôt qu’à chaque frame.

### [TESTÉ]

Non testé dans VISUEL à ce stade.

### [ACTÉ]

Famille de recherche admise ; aucune équation ou paramétrisation Avelune n’est actée.

## 5. Cohérence temporelle de l’animation stylisée

### [RÉFÉRENCE]

Bénard et al., Pixar / SIGGRAPH 2013 — *Stylizing Animation By Example* :

- https://graphics.pixar.com/library/indexAuthorSenn.html

Ces travaux constituent un précédent important pour la cohérence temporelle dans une représentation stylisée animée.

### [HYPOTHÈSE AVELUNE]

La stabilité perceptive dans le temps doit être traitée comme un critère de qualité de premier ordre : une belle image qui reroll, scintille ou perd son identité d’une frame à l’autre est un mauvais résultat pour le vivant d’Avelune.

### [TESTÉ]

Les premiers LAB synthétiques vérifient déjà un déterminisme de plan et une continuité d’identité projetée. Ils ne constituent pas encore une qualification sur histoire réelle du Cœur.

### [ACTÉ]

La cohérence temporelle et la continuité d’identité sont des gates VISUEL, notamment pour VISUEL-2.

## 6. Level of Detail

### [RÉFÉRENCE]

Hugues Hoppe :

- *View-dependent Refinement of Progressive Meshes* : https://www.microsoft.com/en-us/research/publication/view-dependent-refinement-of-progressive-meshes/
- *Smooth View-Dependent Level-of-Detail Control and its Application to Terrain Rendering* : https://www.microsoft.com/en-us/research/publication/smooth-view-dependent-level-of-detail-control-and-its-application-to-terrain-rendering/

Ces travaux fournissent des précédents de niveau de détail adaptatif et de transitions progressives.

### [HYPOTHÈSE AVELUNE]

Le calcul doit être concentré là où il apporte une valeur perceptive : distance, importance de scène, persistance historique et niveau de qualité peuvent justifier des degrés de détail différents.

### [TESTÉ]

Le LAB actuel ne dispose pas encore d’un LOD spatial qualifié.

### [ACTÉ]

Le LOD est une famille d’optimisation admissible, sous réserve de préserver identité, information critique et continuité.

## 7. Formes implicites, SDF et metaballs

### [RÉFÉRENCE]

Les travaux historiques sur les surfaces implicites et les « soft objects » constituent une base connue pour représenter des masses lisses, fusionnantes ou déformables. Une référence déjà retenue dans le chantier est la famille de travaux de Wyvill sur les objets implicites.

### [HYPOTHÈSE AVELUNE]

Ces techniques pourraient être pertinentes pour des formes membraneuses, molles, fusionnantes ou difficiles à classifier, et pour des transformations importantes sans remplacement brutal de silhouette.

### [TESTÉ]

Non testé à ce stade.

### [ACTÉ]

Famille technique à étudier ; aucune implémentation finale ni recette propriétaire n’est fixée.

## 8. Particules et champs de flux

### [RÉFÉRENCE]

Les systèmes de particules et champs de flux constituent des techniques établies pour représenter mouvements diffus, essaims, filaments ou matières flottantes.

### [HYPOTHÈSE AVELUNE]

Ils peuvent être utiles pour certaines formes diffuses ou pour des effets environnementaux, mais doivent être considérés comme coûteux et fortement dégradables lorsque leur rôle est décoratif.

### [TESTÉ]

Le renderer Canvas témoin possède seulement des effets secondaires synthétiques ; il ne qualifie pas encore une grammaire de vivant diffus.

### [ACTÉ]

Les particules décoratives sont parmi les premiers éléments à dégrader en mode SOBRE ou sous contrainte matérielle/sensorielle.

## 9. Accessibilité — W3C/WCAG

### [RÉFÉRENCE]

W3C/WAI — WCAG 2.2 :

- technique C39, `prefers-reduced-motion` : https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- technique SCR40 : https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR40

Ces standards fournissent des références pour la réduction du mouvement et la prise en compte des préférences utilisateur.

### [HYPOTHÈSE AVELUNE]

Avelune doit aller au-delà d’un simple interrupteur global : quantité/vitesse de mouvement, pulsation, particules, parallaxe, halos, flashes, contraste, saturation, grain et détails secondaires doivent pouvoir être réglés indépendamment lorsque pertinent.

### [TESTÉ]

Le LAB possède déjà un premier `reducedMotion` indépendant de `SOBRE/NORMAL/RICHE`. La matrice complète de préférences perceptives reste à implémenter et tester.

### [ACTÉ]

- pas de « mode neuroA » unique ;
- qualité matérielle et préférences sensorielle sont deux axes distincts ;
- une information critique ne dépend exclusivement ni du mouvement ni de la couleur ;
- réduire une modalité ne change ni canon, ni identité, ni droits de jeu.

## 10. Renderers navigateur

### [RÉFÉRENCE]

PixiJS v8 — documentation officielle :

- `ParticleContainer` : https://pixijs.com/8.x/guides/components/scene-objects/particle-container
- `cacheAsTexture` : https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture

### [HYPOTHÈSE AVELUNE]

PixiJS peut constituer un candidat de comparaison 2D/2,5D lorsque Canvas 2D aura fourni une baseline mesurée. Une bibliothèque graphique ne doit jamais définir le contrat sémantique du monde.

### [TESTÉ]

Canvas 2D est actuellement le seul renderer graphique témoin du LAB. PixiJS n’est pas encore comparé sur scène, contrat et profil identiques.

### [ACTÉ]

Aucun renderer final n’est choisi. Le choix se fait par besoin perceptif → prototype → mesure → comparaison → décision.

## 11. Critères de recherche à appliquer aux futures références

Une nouvelle étude ou création documentée n’est ajoutée au registre que si elle éclaire au moins un axe réel du chantier :

- continuité/identité temporelle ;
- croissance ou transformation procédurale ;
- perception du vivant ;
- histoire perceptible ;
- accessibilité sensorielle ;
- personnalisation perceptive selon les préférences de l'observateur sans altération du canon ;
- sobriété/LOD/cache ;
- rendu navigateur ;
- évaluation perceptive ou protocole de comparaison.

Pour chaque ajout, conserver la séparation `[RÉFÉRENCE] / [HYPOTHÈSE AVELUNE] / [TESTÉ] / [ACTÉ]` et ne jamais publier la correspondance propriétaire exacte entre les internes du Cœur et les descripteurs de représentation.

## 12. Abandon technique et conservation des connaissances

Le registre ne suit pas la durée de vie des prototypes. Si un prototype est jeté ou une branche reconstruite :

- les références consultées restent identifiées ;
- les hypothèses testées restent traçables ;
- les résultats négatifs restent documentés ;
- les raisons d'abandon peuvent devenir une décision `[ACTÉ]` lorsqu'elles sont suffisamment établies ;
- une nouvelle implémentation peut repartir de zéro tout en bénéficiant des connaissances déjà acquises.

Cette règle permet de reconstruire proprement le logiciel sans reconstruire artificiellement la mémoire scientifique et artistique du projet.
