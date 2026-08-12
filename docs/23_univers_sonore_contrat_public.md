# Univers sonore d’Avelune — contrat partageable

Statut : **direction de conception future**. Les principes ci-dessous sont actés ; la grammaire musicale, le moteur de rendu et les paramètres finaux restent ouverts. Ce chantier ne fait pas partie du PROTO courant.

## 1. Rôle du module sonore

Le **Cœur vivant** reste exclusivement le moteur autonome d’évolution du vivant et de production de l’état canonique d’Avelune. Il ne devient pas un moteur musical.

Le sonore est un **interpréteur en aval**, au même niveau conceptuel que le futur interpréteur visuel :

```text
Cœur vivant
    ↓
état canonique du monde
    ↓
contrat sémantique de représentation
    ↓
interpréteurs indépendants
    ├─ visuel
    └─ sonore
```

Le rendu sonore ne modifie jamais l’état canonique et ne renvoie aucune décision vers le Cœur.

**Le Cœur doit continuer à vivre normalement si le module sonore est arrêté, remplacé ou indisponible.**

## 2. Direction sonore

L’identité sonore visée est :

**satisfaisante · contemplative · onirique · féerique**

- **Satisfaisante** : privilégier des résolutions sensibles, des continuités perceptibles et des réponses agréables plutôt qu’une accumulation de récompenses sonores artificielles.
- **Contemplative** : laisser du temps, de l’espace et du silence ; maîtriser la densité et éviter l’agression sonore.
- **Onirique** : permettre des résonances, suspensions, textures évolutives et une étrangeté douce.
- **Féerique** : rechercher le délicat, le vivant et le légèrement étrange plutôt qu’une convention fantasy uniforme.

## 3. Trois couches sonores distinctes

Le système doit distinguer au minimum :

1. **Musique du monde** : paysage musical lent et potentiellement génératif, nourri par l’évolution d’Avelune.
2. **Sons du jeu** : retours liés aux actions, constructions, connexions, productions, découvertes et résolutions.
3. **Signaux d’information** : alertes, problèmes, actions requises et événements importants, qui doivent rester clairement identifiables.

Ces couches peuvent partager une identité timbrale, mais leurs responsabilités restent séparées. Un son agréable comme feedback ne doit pas devenir envahissant par répétition, et une information importante ne doit pas se perdre dans l’ambiance.

## 4. Une musique issue du monde, pas une lecture brute des données

Le sonore peut exploiter les résultats du Cœur sans devenir une simple sonification de statistiques.

Les transformations du monde doivent influencer une **grammaire musicale** — par exemple sa densité, sa stabilité, ses timbres, ses motifs, son registre, son rythme ou ses transitions — plutôt qu’établir une conversion directe entre une valeur du moteur et une note.

La bande-son pourra ainsi évoluer progressivement avec Avelune et conserver une continuité perceptible dans le temps, tandis que le Cœur reste totalement indépendant de la musique.

## 5. Accessibilité sensorielle et neurodiversité

Il ne doit pas exister un unique « mode neuroA ». Les besoins sensoriels peuvent être différents, voire opposés.

L’accessibilité sonore doit donc être pensée comme un ensemble de réglages indépendants, avec éventuellement des profils de départ entièrement modifiables. Les dimensions envisageables comprennent notamment :

- intensité des transitoires ;
- dynamique générale ;
- densité musicale ;
- quantité de répétition ;
- fréquence des variations ;
- importance des basses ;
- richesse des aigus ;
- spatialisation ;
- quantité de sons ponctuels ;
- complexité rythmique ;
- nombre de couches simultanées ;
- présence des sons d’interface ;
- quantité de silence.

Ces réglages modifient le **rendu**, pas les règles ni les droits de jeu. Une information critique doit toujours disposer d’un équivalent non sonore.

## 6. Contrat d’architecture

- le module sonore reste strictement en aval de l’état canonique ;
- il consomme un contrat sémantique de représentation, pas les internes du Cœur ;
- il ne réécrit pas l’histoire du monde ;
- le compositeur/générateur musical et le moteur de rendu audio doivent rester remplaçables ;
- les interpréteurs visuel et sonore peuvent exploiter un même état sans dépendre l’un de l’autre ;
- les préférences d’accessibilité peuvent réduire, filtrer ou simplifier le rendu sans altérer le canon ;
- le sonore ne fait pas partie du chemin de survie du Cœur ;
- une dépendance GPU, un moteur propriétaire ou un service externe nécessaire au sonore ne devient pas par transitivité une dépendance canonique.

## 7. Statut technique, ressources et modes de repli

**Aucun moteur audio n’est sélectionné.** Les bibliothèques et moteurs éventuels devront être réévalués lorsque le chantier deviendra concret, selon les besoins réels, le navigateur cible, la qualité musicale, l’accessibilité, la pérennité de la technologie et la sobriété CPU/GPU/RAM/réseau/énergie.

La règle structurante est de conserver une couche d’interprétation propre à Avelune entre les données du monde et le moteur audio afin de ne pas coupler le Cœur à une technologie de rendu.

Avant toute implémentation, distinguer ce qui doit réellement être :

- **permanent** ;
- **périodique** ;
- **calculé à la demande**.

Une musique générative n’a pas à mobiliser en permanence un GPU ou un service externe si le même résultat perceptif peut être produit à une cadence plus sobre sans perte canonique.

Le mode dégradé sonore peut réduire densité, fréquence de régénération, nombre de couches ou qualité de synthèse, voire suspendre temporairement le sonore. Il ne doit jamais modifier le Cœur ni fabriquer une évolution du monde absente de l’état canonique.

Les choix de moteur doivent être accompagnés d’une stratégie de remplacement ou d’export réaliste. Voir `development/ARBITRATION_LONGEVITY_AND_RESOURCES.md`.

## 8. Frontière de publication

Peuvent être documentés dans GitHub :

- la direction artistique sonore ;
- les exigences d’accessibilité ;
- la séparation architecturale ;
- les trois couches sonores ;
- le principe d’une musique évolutive interprétant l’état du monde ;
- les interfaces et contrats nécessaires au développement partagé ;
- les budgets de ressources agrégés et stratégies de repli non secrets.

Restent hors GitHub :

- les correspondances exactes entre données du Cœur et paramètres musicaux ;
- les seuils, fenêtres temporelles et règles de transition ;
- les recettes de persistance, mutation ou réapparition des motifs ;
- les recettes de variabilité ;
- les signatures cachées ;
- les causalités ou indices susceptibles de révéler le fonctionnement propriétaire du Cœur ou des secrets narratifs.

## 9. Questions laissées ouvertes

- grammaire harmonique et rythmique propre à Avelune ;
- palette de timbres et instrumentation ;
- mémoire et transformation des motifs sur de longues durées ;
- part commune au monde partagé et adaptation locale au joueur ;
- budget CPU/GPU/RAM/réseau/énergie et stratégie de rendu navigateur ;
- moteur audio final, pérennité de ses dépendances et modes de repli.

Ces questions seront reprises lorsque le contrat sémantique de représentation du monde sera suffisamment stable.
