# Univers sonore d’Avelune — contrat partageable

> **Statut : direction de conception active — v0.4**  
> Date : 18 août 2026  
> Les principes architecturaux et artistiques ci-dessous sont actés ; la grammaire musicale détaillée, les thèmes concrets, le moteur de rendu et les paramètres finaux restent à éprouver.

## 1. Rôle du module sonore

Le **Cœur vivant** reste exclusivement le moteur autonome du vivant et de l’état canonique d’Avelune. Il ne devient jamais un moteur musical.

Le sonore est un **interpréteur strictement en aval**, indépendant du visuel et des autres clients :

```text
état privé du Cœur
        ↓
CœurReadAdapter commun
        ↓
WorldReadEnvelope
        ↓
MusicPayload
        ↓
état perceptif musical
        ↓
mémoire / structure musicale
        ↓
thème esthétique du joueur
        ↓
préférences sensorielles
        ↓
renderer audio
```

VISUEL part de la même frontière amont mais reçoit sa propre projection spécialisée. MUSIQUE ne lit pas le Cœur privé, et VISUEL ne devient jamais une source de vérité pour MUSIQUE.

**Le Cœur doit continuer à vivre normalement si le module sonore est arrêté, remplacé ou indisponible.**

## 2. Direction sonore

L’identité sonore visée est :

**satisfaisante · contemplative · onirique · féerique**

- **Satisfaisante** : privilégier des continuités perceptibles, des attentes, des transformations progressives et des résolutions sensibles plutôt qu’une accumulation de récompenses artificielles.
- **Contemplative** : laisser du temps, de l’espace et du silence ; maîtriser la densité et éviter l’agression sonore.
- **Onirique** : permettre des résonances, suspensions, textures évolutives, ambiguïtés et étrangeté douce.
- **Féerique** : rechercher le délicat, le vivant et le légèrement étrange plutôt qu’une convention fantasy uniforme.

Le silence est un matériau de composition à part entière.

## 3. Trois couches sonores distinctes

Le système distingue au minimum :

1. **Musique du monde** : paysage musical durable et potentiellement génératif, interprétant l’histoire et l’état perceptible d’une Avelune.
2. **Sons du jeu** : retours liés aux interactions, constructions, connexions, productions, découvertes et résolutions.
3. **Signaux d’information** : alertes et faits demandant réellement l’attention, qui doivent rester clairement identifiables.

Ces couches peuvent partager une identité timbrale, mais leurs responsabilités restent séparées. Une information importante ne doit jamais se perdre dans l’ambiance.

MUSIQUE-0.1 et MUSIQUE-1 travaillent d’abord sur la **musique du monde**. Les sons du jeu et les signaux restent spécifiés, mais leur réalisation attend que leurs interactions fonctionnelles soient suffisamment stables.

## 4. Une musique issue du monde, pas une sonification naïve

Le sonore exploite uniquement les conséquences perceptibles explicitement autorisées par le contrat de lecture.

La chaîne correcte est :

```text
faits sémantiques autorisés
        ↓
état perceptif musical
        ↓
mémoire et structure
        ↓
grammaire musicale
        ↓
composition / arrangement
```

Il ne s’agit pas de convertir directement une statistique en volume, une mesure en tempo ou une variable en note. Les propriétés musicales — densité, tension, registre, activité rythmique, timbre, silence, etc. — restent des propriétés de l’interpréteur, pas des variables canoniques du Cœur.

## 5. Continuité, histoire et mémoire musicale

Avelune doit pouvoir posséder une **mémoire musicale aval**.

Cette mémoire :

- n’est pas canonique ;
- ne modifie jamais le Cœur ;
- est reconstructible depuis un replay compatible ;
- est versionnée avec la grammaire musicale ;
- est strictement partitionnée par `world_instance_id` ;
- ne doit jamais fusionner les histoires de deux Avelunes.

Deux histoires différentes peuvent donc conserver des différences perceptibles même si leurs états finaux deviennent proches. Cette propriété fera l’objet de tests explicites.

Les identifiants opaques de représentation peuvent permettre de conserver une continuité de motif lorsque cette continuité est explicitement autorisée par la projection, sans exposer la généalogie ni l’identité interne du Cœur.

## 6. Thème musical sélectionnable par le joueur

Le joueur peut choisir ou modifier un **thème esthétique** de restitution musicale.

Le thème intervient **après** l’interprétation de l’histoire et de la mémoire. Il peut notamment agir sur l’instrumentation, les familles de timbres, la couleur harmonique, le caractère acoustique/électronique/organique, l’ornementation, le registre privilégié, l’espace, la densité ou certaines caractéristiques rythmiques.

Il ne modifie ni les faits canoniques, ni l’ordre de l’histoire, ni les identités du monde.

Le changement de thème doit pouvoir préserver les motifs et continuités déjà établis en les réinterprétant plutôt qu’en réinitialisant l’histoire musicale.

Une gate de MUSIQUE-1 vérifiera qu’une même trajectoire rendue par au moins deux thèmes nettement différents reste reconnaissable comme **la même histoire musicale**.

Le thème est une préférence du joueur. `world_instance_id` et la seed du Cœur ne sont jamais utilisés comme matériau musical direct.

## 7. Thème et accessibilité sont deux dimensions différentes

Le **thème** est un choix esthétique.

L’**accessibilité / confort sensoriel** adapte le rendu aux besoins de la personne.

Ces deux dimensions se combinent sans se confondre. Une personne doit pouvoir conserver un thème choisi tout en réduisant indépendamment, par exemple, dynamique, densité, répétition, richesse spectrale, basses, aigus, spatialisation, nombre de couches, sons ponctuels ou complexité rythmique, et en augmentant la quantité de silence.

Il ne doit pas exister un unique « mode neuroA ». Des profils de départ sont possibles uniquement s’ils restent entièrement modifiables.

Une information critique possède toujours un équivalent non sonore. Les signaux fonctionnels restent reconnaissables quel que soit le thème.

## 8. Plusieurs Avelunes, plusieurs mémoires

Plusieurs instances canoniques peuvent exister. Chacune possède sa propre identité et sa propre histoire.

MUSIQUE indexe au minimum sa mémoire et ses caches par `world_instance_id`. Un changement d’Avelune observée peut provoquer une transition sonore de confort, mais il ne fusionne jamais les mémoires, motifs, événements ou historiques des deux mondes.

Le même thème choisi par un joueur peut donc interpréter plusieurs Avelunes, qui continueront à sonner différemment lorsque leurs histoires diffèrent.

## 9. Temporalités

Le chantier distingue toujours :

```text
temps de laboratoire
temps canonique
temps humain
temps musical
```

Le **temps musical** est une horloge d’interprétation aval : il peut temporiser, maintenir un motif, interpoler une transition esthétique ou laisser du silence entre deux publications sémantiques.

Il ne permet jamais d’inventer une naissance, une disparition ou une transformation canonique absente du contrat.

La cadence du Cœur, la cadence de publication et le rendu audio restent découplés. La musique doit rester cohérente même lorsque les mises à jour sémantiques sont rares ou irrégulières.

## 10. Contrat de lecture et replays

`docs/32_coeur_contrat_lecture_modules.md` est l’autorité architecturale partageable de la frontière Cœur → modules.

MUSIQUE reçoit :

```text
WorldReadEnvelope + MusicPayload
```

et ne possède pas son propre adaptateur relisant les internes du Cœur.

Le même pipeline musical doit pouvoir consommer :

```text
fixture
replay sémantique
snapshot de test
LAB
production
```

sans que sa grammaire dépende de l’origine de la source.

Le format de laboratoire retenu est **Avelune Semantic Replay v0.1** : manifeste, `frames.ndjson` et checksums SHA-256. La première version utilise des snapshots complets ; les deltas sont différés.

Un replay scientifique brut ou un dump de persistance n’est pas le contrat durable de MUSIQUE.

## 11. Reproductibilité

Le niveau déterministe exigé pour le laboratoire porte d’abord sur la structure musicale :

```text
même replay
+ même contrat
+ même version de projection musicale
+ même grammaire
+ même configuration MUSIQUE
= même musical_plan
```

Un fichier audio final n’a pas nécessairement à être bit-identique entre toutes les plateformes si le renderer ou la chaîne DSP varie ; les tolérances de rendu seront qualifiées séparément.

## 12. Statut technique, ressources et modes de repli

**Aucun moteur audio final n’est sélectionné.** Les bibliothèques et moteurs éventuels seront évalués après la grammaire et les prototypes, selon les besoins réels, la compatibilité navigateur, la qualité, l’accessibilité, la pérennité et les coûts CPU/GPU/RAM/réseau/énergie.

Le budget final est **cumulatif et concurrent** : côté client, jeu, visuel, audio, accessibilité et réseau sont testés ensemble lorsqu’ils cohabitent ; côté serveur, le Cœur/backend est mesuré avec les services réellement présents sur le même hôte.

En contention, dégrader d’abord la sophistication du rendu non canonique. Le sonore peut être suspendu ; le canon ne change pas.

Pendant une qualification opérationnelle du Cœur dont le protocole a été figé avant T0, MUSIQUE n’ajoute aucun nouveau consommateur, observer, service de publication ou benchmark concurrent. Le travail reste offline sur documentation, fixtures et artefacts clos.

## 13. Frontière de publication

GitHub documente uniquement ce qui est nécessaire au développement partagé : direction artistique, exigences d’accessibilité, garanties architecturales, interfaces autorisées, méthode, références extérieures, gates et résultats suffisamment agrégés.

Les recettes de traduction, paramètres, mappings, causalités et autres informations propriétaires restent dans les espaces internes appropriés. La confidentialité porte sur le contenu **et** sur la structure documentaire.

Aucun contenu CODEX n’est nécessaire au fonctionnement normal de MUSIQUE.

## 14. Méthode de recherche

Les études, œuvres, conférences, standards et précédents utilisés sont cités dans `26_univers_sonore_references_methode.md` avec leur rôle et leurs limites.

Quatre statuts restent distincts : **[RÉFÉRENCE]**, **[HYPOTHÈSE AVELUNE]**, **[TESTÉ]** et **[ACTÉ]**. Une source extérieure éclaire ou contredit une hypothèse ; elle ne devient pas une loi d’Avelune par autorité.

## 15. Questions laissées ouvertes

Restent notamment à éprouver :

- le contenu exact de `MusicPayload` ;
- l’état perceptif musical minimal ;
- la grammaire propre à Avelune ;
- les thèmes concrets et leur palette de timbres ;
- la mémoire musicale longue et l’oubli éventuel ;
- la manière dont plusieurs histoires convergentes restent perceptiblement distinctes ;
- les protocoles d’écoute et critères du « satisfaisant » ;
- les budgets mesurés et modes de repli ;
- le moteur audio final et sa stratégie de migration.

Le principe retenu est plus important que la bibliothèque : **Avelune produit son histoire ; la musique en donne une perception cohérente, mémorielle, personnalisable, accessible et remplaçable.**
