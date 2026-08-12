# Visuel du Cœur et représentation du vivant — contrat partageable

> **Statut : cahier de préproduction partageable — v0.2**  
> Date : 13 août 2026  
> Les correspondances exactes entre données du Cœur, lignées, mues et morphologie, ainsi que les seuils, pondérations, seeds et causalités réservées, restent hors GitHub.

## 1. Finalité

Le visuel d’Avelune doit donner une perception **cohérente, historique, qualitative, adaptative et remplaçable** d’un monde dont la vérité est produite ailleurs.

Direction recherchée : **satisfaisante · contemplative · onirique · féerique**, dans la continuité de l’identité poétique · organique · minérale · florale-abstraite · queer d’Avelune.

Le Cœur reste exclusivement le moteur autonome d’évolution du vivant et de production de l’état canonique. Le visuel ne décide ni naissance, ni survie, ni reproduction, ni divergence, ni extinction, ni mue.

## 2. Architecture et frontière anti-réécriture

Architecture cible :

```text
Cœur vivant / replay de laboratoire
        ↓
adaptateur de version
        ↓
contrat sémantique de représentation versionné
        ↓
grammaire morphologique d’Avelune
        ↓
renderer remplaçable
        ↓
Orée / jeu / autres vues
```

Le **LAB VISUEL peut commencer avant que le Cœur soit terminé**, mais uniquement contre un sous-ensemble sémantique suffisamment stable.

Règles :

- le LAB ne prend pas les tables, classes, colonnes, coefficients ou structures internes d’une révision R2.x comme API durable ;
- fixtures synthétiques, replays enregistrés et future instance canonique utilisent le même contrat de représentation ;
- une évolution interne du Cœur doit être absorbable par un adaptateur ou une migration explicite de version du contrat ;
- la grammaire morphologique et les vues ne doivent pas être réécrites à chaque changement du modèle interne ;
- aucune commodité graphique ne doit imposer une mécanique au Cœur.

Le contrat doit privilégier des notions durables telles qu’identité, parenté, relations spatiales, état, transformation significative, continuités historiques et descripteurs de représentation autorisés. Il ne doit pas constituer une copie renommée des paramètres secrets du Cœur.

## 3. Replays et fixtures comme première source

Le premier LAB n’a pas besoin d’une connexion temps réel au Cœur.

Il doit pouvoir consommer :

1. des fixtures synthétiques respectant le contrat ;
2. des exports/replays de simulations existantes convertis par un adaptateur ;
3. plus tard, un flux sémantique issu du Cœur actif.

Ces trois sources doivent être interchangeables du point de vue de la grammaire et du renderer.

Un même replay, avec une même version de grammaire et les mêmes seeds de représentation autorisées, doit produire une identité visuelle cohérente et reproductible.

## 4. Représenter le vivant sans créer une seconde biologie

Une image, une texture, un mesh, un sprite ou une animation n’est pas en soi une vérité canonique.

Le visuel peut exploiter des descripteurs de représentation tels que : organisation générale, ancrage, cohésion, densité, ramification, segmentation, symétrie, souplesse, surface, motifs, mobilité, stade ou traces durables. Le vocabulaire définitif et ses correspondances exactes restent à concevoir.

Les rendus et caches doivent être autant que possible reconstructibles à partir des données structurées et des versions de grammaire nécessaires.

## 5. Continuité des lignées

Lorsqu’une parenté existe dans le canon, le rendu doit pouvoir conserver des continuités perceptibles sans produire des copies : silhouette, organisation, proportions, motifs, mouvements ou autres signatures morphologiques.

Une divergence historique peut progressivement modifier ces signatures.

Le principe reste causal : le visuel traduit une ascendance et une histoire déjà enregistrées ; il n’invente pas rétroactivement une généalogie pour justifier un concept art.

La relation précise entre certaines lignées historiques et la genèse future des races reste hors documentation partageable.

## 6. Mue avant les races

La **mue** peut être expérimentée tôt comme transformation majeure d’un vivant sans attendre la définition des races jouables.

Le principe public est :

```text
identité canonique
      ↓
transformation significative décidée en amont
      ↓
état avant / état après
      ↓
continuité morphologique rendue perceptible
```

Le renderer ne déclenche jamais la mue et ne décide pas de ses conséquences biologiques.

Le LAB doit notamment tester qu’une forme reste reconnaissable à travers une transformation importante et que des individus apparentés peuvent conserver des signatures communes. Les déclencheurs biologiques, seuils et relations futures avec les Corcites restent ouverts ou réservés.

## 7. Direction perceptive

### Satisfaisante

Priorité à la continuité temporelle, à l’inertie, aux transitions lisibles, aux micro-réponses et à la stabilité de l’identité plutôt qu’au jitter, au scintillement ou à l’agitation permanente.

### Contemplative

Mouvements lents, respiration, temps long et densité maîtrisée. Une scène n’a pas à signaler constamment qu’elle est vivante.

### Onirique

Les formes peuvent rester biologiquement ambiguës : membraneuses, filamenteuses, agrégées, diffuses, minérales-organiques ou hybrides, sans recopier un catalogue terrestre.

### Féerique

Luminosité, translucidité, iridescence ou étrangeté peuvent participer à l’identité sans devenir une surcharge uniforme d’effets.

## 8. Travaux et familles techniques de référence

Avelune n’a pas à réinventer les briques mathématiques ou perceptives déjà étudiées. La valeur propre du projet réside dans sa grammaire de traduction et son articulation avec l’histoire canonique.

Pistes de recherche :

- **L-systems / Algorithmic Botany** pour croissance, structures ramifiées et continuité de développement ;
- **Clades** comme précédent de duplication/diversification de formes générées par L-systems ;
- **réaction-diffusion** pour motifs de surface, réseaux, marbrures, nervures ou traces ;
- **formes implicites, SDF et metaballs** pour masses molles, membranes, fusions et transformations ;
- **particules et champs de flux** pour formes diffuses ou flottantes ;
- principes classiques d’animation et travaux sur la **cohérence temporelle** pour éviter qu’un beau rendu image par image devienne instable en mouvement ;
- **Level of Detail** et transitions progressives pour concentrer le coût là où il apporte une valeur perceptive ;
- standards **WCAG/W3C** pour la réduction du mouvement et la redondance de l’information.

Ces références inspirent et contraignent les tests ; elles ne deviennent pas automatiquement les recettes d’Avelune.

## 9. Renderer : candidat, jamais fondation

Aucun moteur graphique final n’est choisi.

**PixiJS v8** constitue un candidat de premier laboratoire pour un rendu navigateur 2D/2,5D, notamment grâce à ses primitives de rendu, de particules et de mise en cache. Three.js/Threlte ou d’autres solutions pourront être évalués si une profondeur 3D réelle devient nécessaire.

Le choix dépendra de mesures : qualité perceptive, compatibilité navigateur, accessibilité, coût CPU/GPU/RAM/réseau/énergie, maintenabilité, pérennité et voie de migration.

La grammaire morphologique d’Avelune ne dépend d’aucun renderer particulier.

## 10. Sobriété et partage de l’enveloppe

Le visuel est un poste majeur de qualité et d’identité, mais il partage les ressources avec le Cœur, le jeu, le sonore et les services nécessaires.

Par défaut :

```text
serveur
Cœur + état canonique
        ↓
état sémantique compact
        ↓ réseau
navigateur du joueur
        ├─ visuel
        └─ sonore local lorsque pertinent
```

Le serveur ne doit pas rendre une scène distincte par observateur sauf besoin ultérieur démontré.

La cadence du Cœur, la cadence de publication sémantique et la cadence graphique sont découplées. Le client peut interpoler entre états autorisés sans inventer une évolution canonique.

Une technique procédurale coûteuse doit être calculée à l’apparition, lors d’une mue ou d’un changement significatif, ou à une cadence justifiée, puis mise en cache lorsque cela produit un résultat perceptif équivalent à un recalcul continu.

Le principe d’arbitrage est : **maximiser la qualité perceptive par unité de calcul, pas la sophistication technique pour elle-même.**

## 11. Qualité adaptative

Le même état canonique doit pouvoir donner au minimum trois niveaux de représentation :

- **sobre** : identité, silhouette, transformation et information critique conservées ;
- **normal** : cible artistique et technique de référence ;
- **riche** : détails, profondeur et effets supplémentaires lorsque la machine cliente le permet.

Le mode riche ne doit jamais devenir la cible minimale cachée.

En cas de contrainte, dégrader d’abord effets décoratifs, densité de particules, profondeur secondaire, sur-échantillonnage, détails reconstructibles ou fréquence de certains calculs, avant de compromettre identité, lisibilité ou accessibilité.

## 12. Accessibilité sensorielle

Il n’existe pas un unique « mode neuroA ».

Le même canon doit pouvoir être rendu avec des réglages indépendants : quantité et vitesse de mouvement, pulsation, densité de particules, parallaxe, halos, contraste, saturation, niveau de détail, flashes, grain et autres animations non essentielles.

Réduire ou supprimer une animation ne doit jamais supprimer l’information critique qu’elle transmet.

## 13. Le LAB VISUEL

Ordre de travail recommandé :

1. **VISUEL-0 — contrat et replay** : schéma minimal, fixtures et adaptateur d’exports existants ;
2. **VISUEL-1 — coût minimal du vivant** : obtenir une impression de vie avec peu de calcul ;
3. **VISUEL-2 — continuité et mue** : même identité avant/après transformation ;
4. **VISUEL-3 — lignées** : héritage perceptible et divergence ;
5. **VISUEL-4 — environnement, traces et vagues** ;
6. **VISUEL-5 — Orée expérimentale**.

Les races jouables et leur design définitif ne sont pas un objectif de ce laboratoire initial.

## 14. Gates avant investissement de production

Le LAB n’autorise une production visuelle de grande ampleur que si les points suivants sont démontrés :

- **contrat** : aucune dépendance persistante aux internes du Cœur ;
- **replay** : un même état contractuel produit une représentation cohérente et reproductible ;
- **identité** : croissance, divergence et mue préservent les continuités attendues ;
- **remplacement** : un renderer alternatif ou factice peut consommer le contrat sans changement du Cœur ;
- **évolution** : une révision simulée du Cœur est absorbée par un adaptateur sans réécrire le LAB ;
- **coût** : CPU, GPU, RAM, réseau, stockage et énergie sont mesurés avec les autres charges pertinentes ;
- **accessibilité** : les modes de réduction conservent l’information ;
- **dégradation** : le mode sobre reste fonctionnel et identifiable ;
- **pérennité** : les données nécessaires à reconstruire une apparence ne dépendent pas d’un cache ou format propriétaire unique.

## 15. Frontière de publication

Peuvent être publiés : architecture, contrat de haut niveau, exigences de qualité/accessibilité, familles techniques étudiées, budgets agrégés, stratégies de repli, références et résultats de validation suffisamment agrégés.

Restent hors GitHub : correspondances exactes entre variables du Cœur et paramètres morphologiques ; pondérations ; seuils ; seeds révélatrices ; règles propriétaires d’héritage visuel ; signatures de lignées ; recettes de mutation ; mécanismes permettant d’anticiper une lignée fondatrice ; causalités secrètes ou narratives.

## 16. Références initiales

- Prusinkiewicz et collaborateurs — *Modeling Plant Development with L-systems* : https://algorithmicbotany.org/papers/modeling-plant-development-with-l-systems.html
- Algorithmic Botany Lab — *Clades* : https://algorithmicbotany.org/clades/about.html
- Greg Turk — *Generating Textures on Arbitrary Surfaces Using Reaction-Diffusion*, SIGGRAPH 1991 : https://faculty.cc.gatech.edu/~turk/reaction_diffusion/reaction_diffusion.html
- Bénard et al. / Pixar — *Stylizing Animation By Example*, SIGGRAPH 2013 : https://graphics.pixar.com/library/indexAuthorSenn.html
- Hugues Hoppe — *View-dependent Refinement of Progressive Meshes* : https://www.microsoft.com/en-us/research/publication/view-dependent-refinement-of-progressive-meshes/
- Hugues Hoppe — *Smooth View-Dependent Level-of-Detail Control* : https://www.microsoft.com/en-us/research/publication/smooth-view-dependent-level-of-detail-control-and-its-application-to-terrain-rendering/
- W3C/WAI — WCAG 2.2, technique C39 : https://www.w3.org/WAI/WCAG22/Techniques/css/C39
- W3C/WAI — WCAG 2.2, technique SCR40 : https://www.w3.org/WAI/WCAG22/Techniques/client-side-script/SCR40
- PixiJS v8 — `ParticleContainer` : https://pixijs.com/8.x/guides/components/scene-objects/particle-container
- PixiJS v8 — `cacheAsTexture` : https://pixijs.com/8.x/guides/components/scene-objects/container/cache-as-texture

## 17. Questions encore ouvertes

- vocabulaire minimal exact du contrat sémantique v0 ;
- politique de compatibilité et migration entre versions du contrat ;
- grammaire morphologique exacte ;
- définition biologique précise des mues et de leurs conséquences ;
- poids relatif 2D / 2,5D / 3D ;
- renderer final ;
- budgets chiffrés sur matériel représentatif ;
- seuils perceptifs justifiant les effets coûteux ;
- stratégie finale de cache et reconstruction ;
- articulation précise entre le vivant pré-corcitique, les Corcites jouables et l’identité visuelle générale du jeu.

Le principe retenu est plus important que la bibliothèque : **Avelune produit le vivant ; le visuel lui donne une perception cohérente, accessible, historique, sobre et remplaçable.**
