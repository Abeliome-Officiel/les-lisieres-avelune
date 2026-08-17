# Visuel du Cœur et représentation du vivant — contrat partageable

> **Statut : cahier de préproduction partageable — v0.4**  
> Date : 17 août 2026  
> Les recettes propriétaires, paramètres non publics, causalités cachées et mécanismes réservés restent hors GitHub.

## 1. Finalité

Le visuel d’Avelune doit donner une perception **cohérente, historique, qualitative, adaptative et remplaçable** d’un monde dont la vérité est produite ailleurs.

Direction recherchée : **satisfaisante · contemplative · onirique · féerique**, dans la continuité de l’identité poétique · organique · minérale · florale-abstraite · queer d’Avelune.

Le Cœur reste exclusivement le moteur autonome d’évolution du vivant et de production de l’état canonique. Le visuel ne décide ni naissance, ni survie, ni reproduction, ni divergence, ni extinction, ni transformation canonique.

## 2. Architecture et frontière anti-réécriture

Architecture cible :

```text
Cœur vivant / replay de laboratoire
        ↓
adaptateur privé de version
        ↓
projection sémantique autorisée
        ↓
contrat de représentation versionné
        ↓
grammaire visuelle d’Avelune
        ↓
renderer remplaçable
        ↓
Orée / jeu / autres vues
```

Le **LAB VISUEL peut commencer avant que le Cœur soit terminé**, mais uniquement contre un sous-ensemble sémantique suffisamment stable.

Règles :

- le LAB ne prend pas les tables, classes, colonnes, coefficients ou structures internes d’une révision de laboratoire comme API durable ;
- fixtures synthétiques, replays enregistrés et future instance canonique utilisent le même contrat de représentation ;
- une évolution interne du Cœur doit être absorbable par un adaptateur ou une migration explicite de version du contrat ;
- la grammaire visuelle et les vues ne doivent pas être réécrites à chaque changement du modèle interne ;
- aucune commodité graphique ne doit imposer une mécanique au Cœur.

Le contrat privilégie des notions sémantiques durables et strictement nécessaires à la représentation. Il ne doit pas constituer une copie renommée des paramètres internes du Cœur.

## 3. Projection publique et moindre état exposé

L’interface de représentation n’est pas un export brut du Cœur.

Avant tout envoi à un navigateur ou autre client non privilégié, une **projection de publication** transforme l’état privé en un état sémantique explicitement autorisé.

Principes :

- liste positive des informations exposables plutôt qu’une longue liste de champs à masquer ;
- aucun paramètre interne, causalité cachée ou information d’Observatoire ne doit transiter vers le client simplement parce que l’interface ne l’affiche pas ;
- l’Observatoire analytique et les outils propriétaires utilisent des interfaces privées distinctes ;
- le contrat de représentation public contient seulement ce qui est nécessaire à l’expérience perceptive autorisée ;
- une inspection réseau ou du code client ne doit pas permettre de retrouver les données privées du Cœur.

Cette frontière protège à la fois les secrets du CODEX, la sécurité de l’architecture et la possibilité de faire évoluer les internes sans modifier le client.

## 4. Contrat versionné, transport neutre et resynchronisable

Le contrat décrit **la signification des données**, pas la manière technique de les transporter.

Le LAB doit fonctionner avec un fichier/replay local ; la production pourra utiliser plus tard HTTP, SSE, WebSocket ou une autre solution sans changer la grammaire visuelle si la sémantique reste identique.

Le contrat doit prévoir au minimum :

- une version de contrat explicite ;
- un ordre ou identifiant d’état permettant de détecter un manque ;
- une notion de temps logique ou de position dans l’histoire représentée ;
- un état complet de resynchronisation ;
- des mises à jour incrémentales ou événements lorsque cela réduit utilement le trafic ;
- une portée de scène/région afin de ne pas envoyer le monde entier lorsqu’une vue n’en a besoin que d’une partie ;
- une stratégie claire lorsque le client détecte un trou : demander/recharger un état complet plutôt qu’inventer la transition manquante.

Le contrat n’impose pas aujourd’hui le protocole réseau final.

## 5. Versions indépendantes

Quatre versions conceptuelles doivent rester distinguables :

1. **version du Cœur / de sa source** ;
2. **version de l’adaptateur et du contrat sémantique** ;
3. **version de la grammaire visuelle d’Avelune** ;
4. **version du renderer / de la bibliothèque graphique**.

Une mise à jour de PixiJS, un changement de renderer ou une optimisation de shader ne doit pas devenir une migration du monde.

Une évolution interne du Cœur qui conserve la même signification perceptible doit pouvoir être absorbée par l’adaptateur. Si la signification elle-même change, le contrat évolue explicitement et les compatibilités sont testées.

Le but n’est pas de promettre qu’aucune ligne de code visuel ne changera jamais ; il est de **localiser les changements à la bonne frontière** et d’éviter une réécriture globale.

## 6. Replays et fixtures comme première source

Le premier LAB n’a pas besoin d’une connexion temps réel au Cœur.

Il doit pouvoir consommer :

1. des fixtures synthétiques respectant le contrat ;
2. des exports/replays de simulations existantes convertis par un adaptateur ;
3. plus tard, un flux sémantique issu du Cœur actif.

Ces trois sources doivent être interchangeables du point de vue de la grammaire et du renderer.

Un même replay, avec une même version de grammaire et les mêmes données de représentation autorisées, doit produire une identité visuelle cohérente et reproductible.

Le jeu interactif conserve ses propres interfaces d’action et d’autorité. Le contrat visuel ne devient pas par commodité l’API de gameplay qui déciderait des actions ou des règles.

## 7. Représenter le vivant sans créer une seconde biologie

Une image, une texture, un mesh, un sprite ou une animation n’est pas en soi une vérité canonique.

Le visuel peut exploiter des descripteurs de représentation abstraits nécessaires à la forme, au mouvement, à la surface, à la continuité et aux transformations observables. Le vocabulaire définitif et ses correspondances exactes restent à concevoir hors de ce contrat public.

Les rendus et caches doivent être autant que possible reconstructibles à partir des données structurées et des versions de grammaire nécessaires.

## 8. Continuité historique du vivant

Lorsqu’une continuité réelle existe dans le canon, le rendu doit pouvoir la rendre perceptible sans produire des copies identiques.

Les changements d’apparence doivent rester cohérents dans le temps et ne pas inventer rétroactivement une histoire absente du Cœur.

Cette exigence concerne la qualité de représentation ; les mécanismes internes qui produisent l’histoire du vivant ne sont pas décrits ici.

## 9. Mue et transformations majeures

La **mue** peut être expérimentée tôt comme cas visuel de transformation majeure d’un même vivant.

Le principe public est simple : le Cœur indique qu’une transformation canonique significative a eu lieu ; le visuel doit la rendre lisible tout en conservant la continuité d’identité lorsque le canon la conserve.

Le renderer ne déclenche jamais la mue et ne décide pas de ses conséquences biologiques.

Le LAB doit notamment tester qu’une forme reste reconnaissable à travers une transformation importante. Les règles biologiques qui déclenchent ou gouvernent ces transformations restent hors de ce document.

## 10. Direction perceptive

### Satisfaisante

Priorité à la continuité temporelle, à l’inertie, aux transitions lisibles, aux micro-réponses et à la stabilité de l’identité plutôt qu’au jitter, au scintillement ou à l’agitation permanente.

### Contemplative

Mouvements lents, respiration, temps long et densité maîtrisée. Une scène n’a pas à signaler constamment qu’elle est vivante.

### Onirique

Les formes peuvent rester biologiquement ambiguës, organiques, minérales, diffuses ou hybrides, sans recopier un catalogue terrestre.

### Féerique

Luminosité, translucidité, iridescence ou étrangeté peuvent participer à l’identité sans devenir une surcharge uniforme d’effets.

## 11. Travaux et familles techniques de référence

Avelune n’a pas à réinventer les briques mathématiques ou perceptives déjà étudiées. La valeur propre du projet réside dans sa grammaire de traduction et son articulation avec l’état canonique.

Pistes de recherche :

- **L-systems / Algorithmic Botany** pour croissance et structures procédurales ;
- **Clades** comme précédent de variation de formes générées par grammaires ;
- **réaction-diffusion** pour motifs de surface et organisations locales ;
- **formes implicites, SDF et metaballs** pour masses molles et transformations ;
- **particules et champs de flux** pour formes diffuses ou flottantes ;
- principes classiques d’animation et travaux sur la **cohérence temporelle** ;
- **Level of Detail** et transitions progressives pour concentrer le coût là où il apporte une valeur perceptive ;
- standards **WCAG/W3C** pour la réduction du mouvement et la redondance de l’information.

Ces références inspirent et contraignent les tests ; elles ne deviennent pas automatiquement les recettes d’Avelune.

Les travaux sur les L-systems montrent qu’une grammaire compacte peut décrire des processus de développement complexes ; la réaction-diffusion fournit un précédent historique solide pour la synthèse de motifs ; les travaux de Hoppe établissent des méthodes de niveau de détail adaptatif avec transitions progressives ; les travaux Pixar sur la stylisation d’animation soulignent l’importance de la cohérence temporelle. Les standards W3C/WCAG encadrent explicitement la réduction du mouvement. Ces constats justifient nos axes d’essai, pas une implémentation imposée.

## 12. Renderer : candidat, jamais fondation

Aucun moteur graphique final n’est choisi.

**PixiJS v8** constitue un candidat de premier laboratoire pour un rendu navigateur 2D/2,5D. Sa documentation actuelle offre notamment des mécanismes de mise en cache et de particules optimisées ; l’API de particules est explicitement présentée comme expérimentale et peut évoluer. Elle ne doit donc pas structurer le contrat d’Avelune.

Three.js/Threlte ou d’autres solutions pourront être évalués si une profondeur 3D réelle devient nécessaire.

Le choix dépendra de mesures : qualité perceptive, compatibilité navigateur, accessibilité, coût CPU/GPU/RAM/réseau/énergie, maintenabilité, pérennité et voie de migration.

La grammaire visuelle d’Avelune ne dépend d’aucun renderer particulier.

## 13. Sobriété et partage de l’enveloppe

Le visuel est un poste majeur de qualité et d’identité, mais il partage les ressources avec le Cœur, le jeu, le sonore et les services nécessaires.

Par défaut :

```text
serveur
Cœur + état canonique
        ↓
projection sémantique compacte
        ↓ réseau
navigateur du joueur
        ├─ visuel
        └─ sonore local lorsque pertinent
```

Le serveur ne doit pas rendre une scène distincte par observateur sauf besoin ultérieur démontré.

La cadence du Cœur, la cadence de publication sémantique et la cadence graphique sont découplées. Le client peut interpoler entre états autorisés sans inventer une évolution canonique.

Une technique procédurale coûteuse doit être calculée à l’apparition, lors d’une transformation significative, ou à une cadence justifiée, puis mise en cache lorsque cela produit un résultat perceptif équivalent à un recalcul continu.

Le principe d’arbitrage est : **maximiser la qualité perceptive par unité de calcul, pas la sophistication technique pour elle-même.**

## 14. Qualité adaptative

Le même état canonique doit pouvoir donner au minimum trois niveaux de représentation :

- **sobre** : identité, silhouette, transformation et information critique conservées ;
- **normal** : cible artistique et technique de référence ;
- **riche** : détails, profondeur et effets supplémentaires lorsque la machine cliente le permet.

Le mode riche ne doit jamais devenir la cible minimale cachée.

En cas de contrainte, dégrader d’abord effets décoratifs, densité de particules, profondeur secondaire, sur-échantillonnage, détails reconstructibles ou fréquence de certains calculs, avant de compromettre identité, lisibilité ou accessibilité.

## 15. Accessibilité sensorielle

Il n’existe pas un unique « mode neuroA ».

Le même canon doit pouvoir être rendu avec des réglages indépendants : quantité et vitesse de mouvement, pulsation, densité de particules, parallaxe, halos, contraste, saturation, niveau de détail, flashes, grain et autres animations non essentielles.

Réduire ou supprimer une animation ne doit jamais supprimer l’information critique qu’elle transmet.

## 16. Le LAB VISUEL

Ordre de travail recommandé :

1. **VISUEL-0 — contrat et replay** : schéma minimal, projection de publication, fixtures et adaptateur d’exports existants ;
2. **VISUEL-1 — coût minimal du vivant** : obtenir une impression de vie avec peu de calcul ;
3. **VISUEL-2 — continuité et mue** : même identité avant/après transformation ;
4. **VISUEL-3 — continuités et variations historiques** ;
5. **VISUEL-4 — environnement, traces et vagues** ;
6. **VISUEL-5 — Orée expérimentale**.

Le LAB initial ne doit pas figer des mécanismes ou contenus futurs qui ne sont pas nécessaires à sa validation.

## 17. Gates avant investissement de production

Le LAB n’autorise une production visuelle de grande ampleur que si les points suivants sont démontrés :

- **projection** : le client ne reçoit aucune donnée privée inutile au rendu ;
- **contrat** : aucune dépendance persistante aux internes du Cœur ;
- **transport** : le même LAB fonctionne avec replay local et flux simulé sans changement de grammaire ;
- **resynchronisation** : une perte ou un saut de mises à jour peut être récupéré par état complet sans invention canonique ;
- **replay** : un même état contractuel produit une représentation cohérente et reproductible ;
- **identité** : croissance et transformations préservent les continuités attendues ;
- **remplacement** : un renderer alternatif ou factice peut consommer le contrat sans changement du Cœur ;
- **évolution** : une révision simulée du Cœur est absorbée par un adaptateur sans réécrire le LAB ;
- **versionnement** : changement de renderer, grammaire, contrat et source peuvent être testés séparément ;
- **coût** : CPU, GPU, RAM, réseau, stockage et énergie sont mesurés avec les autres charges pertinentes ;
- **accessibilité** : les modes de réduction conservent l’information ;
- **dégradation** : le mode sobre reste fonctionnel et identifiable ;
- **pérennité** : les données nécessaires à reconstruire une apparence ne dépendent pas d’un cache ou format propriétaire unique.

## 18. Fenêtre permanente et âge d’Avelune

La **Fenêtre sur la Lisière** est un module permanent : une fois mise en ligne, elle reste disponible pendant les phases de développement, les essais avec joueurs, la sortie du jeu et après celle-ci. Elle peut changer de place ou de forme dans l’expérience, mais elle ne devient pas un teaser à supprimer.

La Fenêtre doit afficher un **âge d’Avelune** dérivé de l’âge canonique du monde. Cet âge est une information historique publique autorisée ; il ne doit pas exposer la recette de conversion temporelle, les paramètres internes du Cœur ni les causalités réservées. Le choix de son unité, de sa notation et de sa formulation éditoriale reste ouvert.

La perception visuelle du temps doit rester distincte du calcul biologique : la scène peut interpoler et rendre lisibles des évolutions lentes, mais elle ne modifie ni la vitesse du Cœur ni les événements canoniques pour produire artificiellement davantage de spectacle.

## 19. Frontière de publication

GitHub peut documenter les principes d’architecture, exigences de qualité et d’accessibilité, références extérieures, stratégies de repli, interfaces expurgées et résultats de validation suffisamment agrégés.

Les recettes propriétaires, paramètres réservés, mécanismes causaux non publics, signatures internes et informations narratives sensibles restent dans les espaces privés appropriés. La documentation publique ne doit pas détailler leur organisation ni permettre d’en reconstruire la structure.

## 20. Références initiales

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

## 21. Questions encore ouvertes

- vocabulaire minimal exact du contrat sémantique v0 ;
- politique de compatibilité et migration entre versions du contrat ;
- format d’état complet et de mises à jour incrémentales ;
- stratégie de portée spatiale / scène pour éviter le transfert inutile ;
- grammaire visuelle exacte ;
- règles biologiques des transformations que le rendu devra un jour représenter ;
- poids relatif 2D / 2,5D / 3D ;
- renderer final ;
- budgets chiffrés sur matériel représentatif ;
- seuils perceptifs justifiant les effets coûteux ;
- stratégie finale de cache et reconstruction ;
- articulation avec l’identité visuelle générale du jeu ;
- unité et formulation publique de l’âge d’Avelune.

Le principe retenu est plus important que la bibliothèque : **Avelune produit le vivant ; le visuel lui donne une perception cohérente, accessible, historique, sobre et remplaçable.**