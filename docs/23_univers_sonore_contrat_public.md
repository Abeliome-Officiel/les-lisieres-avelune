# Univers sonore d’Avelune — contrat partageable

Statut : **direction de conception future**. Les principes ci-dessous sont actés ; la grammaire musicale, le moteur de rendu et les paramètres finaux restent ouverts. Ce chantier ne fait pas partie du PROTO courant.

## 1. Rôle du module sonore

Le **Cœur vivant** reste exclusivement le moteur autonome d’évolution du vivant et de production de l’état canonique d’Avelune. Il ne devient pas un moteur musical.

Le sonore est un **interpréteur en aval**, au même niveau conceptuel que l’interpréteur visuel :

```text
Cœur vivant
    ↓
état canonique du monde
    ↓
projection sémantique autorisée
    ↓
contrat de représentation versionné
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

Le sonore peut exploiter les conséquences perceptibles autorisées de l’état du monde sans devenir une simple sonification de statistiques.

Les transformations du monde influencent une **grammaire musicale** plutôt qu’une conversion directe d’une donnée interne en paramètre audio. La bande-son peut ainsi évoluer progressivement avec Avelune et conserver une continuité perceptible dans le temps, tandis que le Cœur reste totalement indépendant de la musique.

Le contrat public décrit uniquement la sémantique nécessaire au rôle autorisé du client ou de l’interpréteur. Il ne constitue pas une copie renommée du modèle interne du Cœur.

## 5. Accessibilité sensorielle et neurodiversité

Il ne doit pas exister un unique « mode neuroA ». Les besoins sensoriels peuvent être différents, voire opposés.

L’accessibilité sonore doit donc être pensée comme un ensemble de réglages indépendants, avec éventuellement des profils de départ entièrement modifiables. Les dimensions de rendu peuvent notamment agir sur l’intensité, la dynamique, la densité, la répétition, la richesse spectrale, la spatialisation, la complexité rythmique, le nombre de couches, les sons ponctuels et la quantité de silence.

Ces réglages modifient le **rendu**, pas les règles ni les droits de jeu. Une information critique doit toujours disposer d’un équivalent non sonore.

## 6. Contrat d’architecture et anti-réécriture

- le module sonore reste strictement en aval de l’état canonique ;
- il consomme uniquement une projection sémantique autorisée et versionnée ;
- il ne dépend pas durablement des structures internes d’une révision du Cœur ;
- une évolution interne doit pouvoir être absorbée par un adaptateur ou une migration explicite du contrat ;
- le compositeur/générateur musical et le moteur de rendu audio doivent rester remplaçables ;
- le visuel et le sonore restent indépendants l’un de l’autre et peuvent utiliser un socle commun ou des contrats frères selon leurs besoins ;
- le protocole de transport ne définit pas la sémantique du contrat ;
- les préférences d’accessibilité peuvent réduire, filtrer ou simplifier le rendu sans altérer le canon ;
- le sonore ne fait pas partie du chemin de survie du Cœur.

Fixtures synthétiques, replays autorisés et future source active doivent pouvoir alimenter la même frontière contractuelle sans imposer à la grammaire musicale une connaissance de leur origine.

## 7. Statut technique, ressources et modes de repli

**Aucun moteur audio n’est sélectionné.** Les bibliothèques et moteurs éventuels seront réévalués lorsque le chantier le nécessitera, selon les besoins réels, le navigateur cible, la qualité musicale, l’accessibilité, la pérennité de la technologie et la sobriété CPU/GPU/RAM/réseau/énergie.

Avant toute implémentation durable, distinguer ce qui doit réellement être permanent, périodique ou calculé à la demande.

Le budget final est **cumulatif et concurrent** : côté client, jeu, visuel, audio, accessibilité et réseau doivent être testés ensemble lorsqu’ils cohabitent ; côté serveur, le Cœur/backend est mesuré avec les services réellement présents sur le même hôte. Un benchmark audio isolé attribue un coût mais ne valide pas l’intégration.

Le mode dégradé sonore réduit d’abord la sophistication du rendu ou peut suspendre le sonore. Il ne modifie jamais le Cœur et ne fabrique aucune évolution du monde absente de l’état canonique.

Les choix de moteur doivent disposer d’une voie réaliste de remplacement ou de migration. Voir `development/ARBITRATION_LONGEVITY_AND_RESOURCES.md`.

## 8. Frontière de publication

GitHub documente uniquement ce qui est nécessaire au développement partagé : direction artistique, exigences d’accessibilité, garanties architecturales, interfaces autorisées, méthode, références extérieures, gates et résultats suffisamment agrégés.

Les informations classées dans les espaces internes ne sont décrites ici que par des formulations génériques. **Cette documentation ne dresse pas l’inventaire de leur contenu, de leur organisation, de leurs relations ni de leur place éventuelle dans une chaîne causale.**

La frontière de publication s’applique au contenu comme à la structure documentaire. Le caractère privé du dépôt ne constitue pas une autorisation de publier des éléments classés CODEX ou propriétaires.

## 9. Méthode de recherche

Les études, œuvres, conférences, standards et précédents utilisés sont cités dans `26_univers_sonore_references_methode.md` avec leur rôle et leurs limites.

Quatre statuts restent distincts : **[RÉFÉRENCE]**, **[HYPOTHÈSE AVELUNE]**, **[TESTÉ]** et **[ACTÉ]**. Une source extérieure éclaire ou contredit une hypothèse ; elle ne devient pas une loi d’Avelune par autorité.

## 10. Questions laissées ouvertes

Restent notamment à éprouver :

- la grammaire musicale propre à Avelune ;
- la palette de timbres et l’instrumentation ;
- la continuité musicale sur le temps long ;
- l’articulation entre paysage commun du monde et expérience locale ;
- les budgets mesurés et les modes de repli ;
- le moteur audio final et sa stratégie de migration ;
- la version initiale de la sémantique sonore autorisée et sa politique de compatibilité.

Le principe retenu est plus important que la bibliothèque : **Avelune produit son histoire ; le sonore en donne une perception cohérente, accessible, sobre et remplaçable.**