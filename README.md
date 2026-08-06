<p align="center">
  <img src="docs/assets/avelune-readme-hero.webp" alt="Les Lisières d’Avelune — monde partagé, Corcites et protection de la Lisière" width="100%" />
</p>

# Les Lisières d’Avelune

> **Un monde partagé à habiter, comprendre et transformer.**  
> Développez un **Corcite**, corps-cité organique vivant, faites circuler matière, énergie et connaissance, préparez-vous aux vagues issues de la Fracture et contribuez à protéger la Lisière — seul·e, en parallèle des autres ou en coopération directe selon vos envies et vos possibilités.

**Les Lisières d’Avelune** est un jeu navigateur persistant mêlant **gestion systémique**, **production et réseaux**, **défense contre des vagues**, **progression RPG horizontale**, **narration textuelle** et **monde partagé évolutif**.

> **Poétique · Féerique · Organique · Systémique**

---

## État du projet — pas “v0.8”

Le `v0.8` longtemps visible en haut du dépôt correspondait à un **jalon historique de conception**. Il n’est plus l’état réel du projet.

| Repère | Signification actuelle |
|---|---|
| `v0.8` | tag/jalon historique |
| `v0.8.3` | dernière baseline de conception figée sur `main` |
| **v0.8.3+** | conception consolidée avec les décisions postérieures |
| **PROTO-0 jouable** | prototype logiciel navigateur actuellement développé et playtesté |

La branche logicielle active est : **[`develop/proto-0.1-playable`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.1-playable)**.

Le projet est actuellement dans la transition :

**prototype intégré jouable → playtests humains → ajustements → consolidation technique**.

Il n’existe pas encore de nouvelle version stable nommée arbitrairement “v0.9” : le numéro de version ne doit pas devancer les décisions réelles du projet.

### Accès rapide

- **Prototype jouable** : https://proto.avelune.duckdns.org
- **Branche du prototype** : [`develop/proto-0.1-playable`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.1-playable)
- **Documentation actuelle consolidée** : [`docs/proto0-consolidation-2026-08-06`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/docs/proto0-consolidation-2026-08-06)
- **Vision historique/consolidée** : [`docs/00_vision.md`](docs/00_vision.md)
- **Charte graphique de travail** : [`docs/art/CHARTE_GRAPHIQUE.md`](docs/art/CHARTE_GRAPHIQUE.md)

---

# Le cœur d’Avelune

## Le Corcite — personnage, organisme et cité

Le joueur ne contrôle pas seulement un avatar. Il développe un **Corcite**, corps-cité vivant, ancré dans Avelune et destiné à évoluer selon des orientations différentes.

Un Corcite peut progressivement organiser :

- son empreinte dans le monde ;
- ses structures et fonctions organiques ;
- ses chaînes d’extraction, transformation et fabrication ;
- ses stockages et réseaux ;
- son énergie et son entretien ;
- sa population et sa capacité de travail ;
- ses connaissances, recherches et compétences ;
- ses défenses ;
- sa mémoire des événements traversés.

Sa progression doit produire **des stratégies, spécialisations et formes différentes**, pas seulement des statistiques plus hautes.

→ [`Corps-cité, empreinte et influence`](docs/01_concept_corps_cite.md)

---

## La Fracture, les vagues et la Lisière

Au centre du monde se trouve la **Fracture**. Elle émet des vagues qui traversent progressivement Avelune jusqu’à la **Lisière**, frontière vitale du monde.

Une vague n’est pas conçue comme une simple barre de points de vie. Elle porte plusieurs caractéristiques qui peuvent être :

- atténuées ;
- déstructurées ;
- stabilisées ;
- captées ;
- transformées par l’ordre des défenses rencontrées.

La préparation du Corcite avant l’arrivée de la vague fait donc partie du système défensif.

Après la vague, le résultat devient une nouvelle situation de jeu : intégrité, dette d’entretien, réserve énergétique, matière captée, connaissance, récupération et adaptation.

→ [`Passage et Lisière`](docs/15_lisiere_et_passage.md)

---

## Une protection collective, sans coopération directe obligatoire

C’est un principe central du monde partagé :

> **l’ensemble des Corcites contribue à la protection de la Lisière, mais chaque Corcite n’est pas obligé de coopérer directement avec les autres.**

La protection du monde est donc **collective par ses conséquences**, sans exiger une sociabilité permanente.

Un Corcite doit pouvoir :

- se développer très largement de manière autonome ;
- agir en parallèle d’autres Corcites ;
- participer au résultat global simplement par la façon dont il traite les vagues ;
- coopérer ponctuellement lorsqu’il le souhaite ;
- échanger, partager ou contribuer à des projets futurs ;
- se spécialiser de manière complémentaire ;
- rester peu social sans être exclu du jeu.

Les futures mécaniques de coopération doivent favoriser l’entraide **sans transformer la coopération en obligation sociale permanente**.

→ [`Monde partagé et coopération`](docs/05_social_et_communication.md)

---

## Produire, connecter, arbitrer

La dimension gestion relie les systèmes :

```text
ressources du monde
        ↓
extraction / stockage / réseaux
        ↓
transformation
        ↓
fabrication / construction
        ↓
énergie + entretien + population / travail
        ↓
développement du Corcite
        ↓
recherche / progression
        ↓
préparation défensive
        ↓
vague
        ↓
conséquences / captation / connaissance
        ↓
récupération / adaptation
        ↺
```

Le joueur ne doit pas pouvoir tout faire simultanément. Le challenge vient notamment des arbitrages entre plusieurs besoins légitimes.

→ [`Tycoon–Factorio et réseaux`](docs/03_tycoon_et_reseaux.md)

---

## Une couche RPG transversale

Le RPG n’est pas une troisième file d’actions artificiellement symétrique au TF et au TD.

Il constitue une couche **textuelle, évolutive et transversale** qui peut produire :

- recherches et découvertes ;
- compétences ;
- métiers et classes ;
- spécialisations ;
- capacités et accès ;
- modificateurs ;
- connaissances ;
- choix narratifs ;
- relations ;
- mémoire du Corcite.

La progression vise principalement à **ouvrir des possibilités et différencier les manières de jouer**, plutôt qu’à créer une course verticale à la puissance.

→ [`Trame RPG`](docs/14_trame_rpg.md)

---

# Un monde partagé qui se souvient

Avelune n’a pas vocation à séparer artificiellement un “mode solo” et un “mode multijoueur”.

Le monde est **unique et partagé**, même lorsqu’une personne choisit un style très autonome.

Les actions et événements pourront laisser dans le monde :

- des **Traces** ;
- des **Échos** ;
- des ruines ;
- des transformations de terrain ;
- des connaissances ;
- une histoire collective.

La carte pourra s’étendre, mais un principe est acté : **Avelune ne rétrécit pas**.

La mémoire des premières périodes du jeu peut nourrir la fiction sans créer d’avantage mécanique essentiel réservé aux premiers joueurs.

→ [`Monde persistant, carte et chronologie`](docs/02_monde_persistant.md)

---

# Les intentions fondatrices

Ces principes font partie du **game design**, pas d’une couche marketing ajoutée après coup.

## Profond, mais accessible de plusieurs manières

Avelune est pensé avec une attention explicite aux personnes pouvant être concernées notamment par :

- le **TSA** ;
- le **TDAH** ;
- les troubles **dys** ;
- la surcharge cognitive ;
- des capacités d’attention ou de mémoire de travail différentes ;
- des rythmes d’apprentissage et de disponibilité très variables.

L’objectif n’est pas de réduire la profondeur du jeu.

> **Conserver la profondeur, mais offrir plusieurs chemins pour l’appréhender.**

Cela implique notamment :

- complexité progressive ;
- informations hiérarchisées ;
- conséquences expliquées ;
- récapitulatifs ;
- automatisation possible ;
- plusieurs profondeurs d’affichage ;
- mêmes règles et mêmes droits de jeu quelle que soit la profondeur d’interface choisie.

→ [`Accessibilité et éthique`](docs/06_accessibilite_ethique.md)

---

## Pas de micro-dopamine comme modèle économique de l’attention

Avelune ne doit pas être construit autour d’une succession de petites récompenses artificielles destinées avant tout à maintenir le clic ou la connexion.

Le projet veut éviter comme moteurs principaux :

- séries quotidiennes punitives ;
- FOMO ;
- quêtes journalières obligatoires ;
- notifications compulsives ;
- coffres/roulettes comme boucle de rétention ;
- badges et jauges sans sens ludique réel ;
- punition liée au simple fait de ne pas s’être connecté.

> **La récompense doit venir de la compréhension, de la décision, de la découverte et de l’évolution du monde — pas d’une captation artificielle de l’attention.**

---

## Un jeu qui challenge

Avelune ne doit pas devenir un jeu où tout réussit automatiquement.

Le joueur doit rencontrer de vraies contraintes :

- ressources insuffisantes ;
- choix incompatibles ;
- limites d’énergie, entretien, population, stockage ou espace ;
- anticipation imparfaite ;
- conséquences persistantes ;
- nécessité de réorganiser son Corcite.

Le challenge recherché est principalement **systémique, intellectuel et stratégique**.

> **Challenge ne signifie pas punition.**

L’échec doit produire une situation nouvelle à comprendre plutôt qu’un simple effacement de progression.

---

## Échec fertile

Une erreur ou une défaite doit autant que possible produire :

- une information ;
- une cicatrice ;
- une Trace ;
- un Écho ;
- une transformation ;
- une contrainte nouvelle ;
- une raison d’essayer autrement.

**Comprendre et s’adapter doit être plus important que punir.**

---

## S’adapter aux styles de jeu, aux envies et aux possibilités de toustes

Il n’existe pas une seule bonne manière de jouer à Avelune.

Le jeu doit pouvoir accueillir, autant que possible :

- optimisation ou exploration ;
- jeu méthodique ou expérimental ;
- forte sociabilité ou grande autonomie ;
- sessions longues ou courtes ;
- beaucoup de détails ou seulement l’essentiel ;
- interventions manuelles ou automatisation ;
- profils polyvalents, orientés ou spécialisés.

Le but n’est pas que toutes les stratégies soient identiques. Le but est que **plusieurs manières légitimes de jouer existent**.

---

## Non genré et inclusif par conception

Aucun métier, classe, rôle, capacité ou style de jeu ne doit être réservé à un genre.

Le projet vise notamment :

- pronoms choisis ;
- langue et grammaire configurables ;
- écriture qui ne suppose pas inutilement le genre de la personne ;
- diversité des identités considérée comme normale dans le monde ;
- absence de rôles mécaniques genrés.

Une personne doit pouvoir habiter Avelune **sans devoir entrer dans une case de genre prédéfinie par le système**.

---

## Pas de classement humiliant ni de domination des anciens

Le monde partagé n’a pas vocation à devenir une pyramide sociale permanente.

Le projet exclut comme direction centrale :

- classement global humiliant ;
- concurrence imposée ;
- pouvoir permanent réservé aux premiers joueurs ;
- dépendance sociale obligatoire.

Les systèmes collectifs futurs privilégieront besoins, offres, contributions, projets et consentement.

---

# Thématique et direction artistique

Avelune cherche une identité **poétique, féerique, onirique et organique**, avec une lecture systémique discrète sous la surface.

La direction actuelle associe :

- paysages de crépuscule ;
- végétation et architectures vivantes ;
- bioluminescence ;
- réseaux et hexagones intégrés subtilement au monde ;
- anneaux, arcs et horizons concentriques ;
- une Fracture lumineuse et inquiétante sans esthétique horrifique ;
- la Lisière comme frontière vitale à protéger ;
- des Corcites distincts, reliés ou autonomes ;
- une sensation de calme, de mystère, de résilience et d’intelligence collective.

### Charte UI actuelle

Le prototype utilise actuellement :

- fond principal `#17131f` ;
- panneaux `#15111d` / violets très sombres ;
- texte `#ece9f2` ;
- accent lavande `#9f8dcc` ;
- focus `#d8c9ff` ;
- succès vert doux `#9bd5ad` ;
- police d’interface **Inter**.

Les visuels illustratifs enrichissent cette base avec bleu nuit, indigo, teal bioluminescent, violet crépusculaire et touches d’or doux.

→ [`Charte graphique de travail`](docs/art/CHARTE_GRAPHIQUE.md)

---

# Où en est le prototype ?

Le PROTO-0 a pour rôle de tester **la nature du jeu en miniature**, pas de simuler un produit final.

Principe de développement :

> **Réduire la quantité, pas la nature du jeu.**

La branche jouable comprend actuellement notamment :

- départ minimal du Corcite ;
- construction ;
- extraction et stockage ;
- transformation et fabrication ;
- énergie, entretien, population et travail ;
- recherches et découvertes ;
- fabrication et organisation TD ;
- cycle multi-vagues ;
- conséquences persistantes ;
- récupération ;
- économie de captation ;
- interface mobile/bureau ;
- carnet de playtest ;
- simulations reproductibles.

Au dernier jalon technique documenté :

- **338 tests** passaient ;
- `svelte-check` ne remontait aucun diagnostic ;
- le build de production était valide ;
- une batterie de **384 parties complètes** avait été exécutée.

Ces chiffres mesurent la stabilité technique, **pas l’intérêt ludique**.

La question de playtest reste :

> **Est-ce que les décisions produisent des situations qu’on veut comprendre, améliorer et expérimenter ?**

### Documentation actuelle du prototype

- [`Périmètre jouable`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.1-playable/docs/proto0/PROTO0_PLAYABLE_SCOPE.md)
- [`Gate de playtest`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.1-playable/docs/proto0/PROTO0_PLAYTEST_READY.md)
- [`Rapport de simulations`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.1-playable/docs/proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)

---

# Une architecture pensée pour évoluer

Le prototype n’est pas uniquement codé dans l’interface.

Le cœur suit déjà une séparation proche de :

```text
domaine / règles
        ↓
moteurs TF / RPG / TD / vague
        ↓
orchestration
        ↓
interface
```

Les mêmes moteurs sont utilisés par tests, simulations et navigateur.

La consolidation prévue si les playtests valident la boucle porte notamment sur :

- découpage de l’interface monolithique ;
- contenu et équilibrage davantage **data-driven** ;
- versionnement des états et migrations ;
- future autorité serveur ;
- CI et tests E2E ;
- télémétrie métier ;
- persistance PostgreSQL.

→ [`Audit développement/architecture`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/docs/proto0-consolidation-2026-08-06/docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)  
→ [`Architecture actuelle et cible`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/docs/proto0-consolidation-2026-08-06/docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md)  
→ [`Politique données/configuration`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/docs/proto0-consolidation-2026-08-06/docs/development/DATA_CONFIGURATION_POLICY.md)

---

# Explorer le projet

### Comprendre le jeu

- [`Vision`](docs/00_vision.md)
- [`Corps-cité`](docs/01_concept_corps_cite.md)
- [`Monde persistant`](docs/02_monde_persistant.md)
- [`Tycoon–Factorio et réseaux`](docs/03_tycoon_et_reseaux.md)
- [`Social et communication`](docs/05_social_et_communication.md)
- [`Accessibilité et éthique`](docs/06_accessibilite_ethique.md)
- [`Background d’Avelune`](docs/10_background_avelune.md)
- [`Trame RPG`](docs/14_trame_rpg.md)
- [`Passage et Lisière`](docs/15_lisiere_et_passage.md)

### Comprendre le développement actuel

- [`Documentation consolidée`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/docs/proto0-consolidation-2026-08-06/docs)
- [`Roadmap actuelle`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/docs/proto0-consolidation-2026-08-06/ROADMAP.md)
- [`Changelog`](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/docs/proto0-consolidation-2026-08-06/CHANGELOG.md)

---

# Technique

Prototype actuel :

- **SvelteKit** ;
- **TypeScript** ;
- **Node.js** ;
- **PostgreSQL** ;
- **Docker Compose** ;
- moteurs headless testables indépendamment de l’UI.

Validation de référence :

```bash
npm run test:proto0
npm run check
npm run build
```

---

# En une phrase

> **Construire sans conquérir. Progresser sans écraser. Challenger sans punir. Coopérer sans l’imposer. Échouer sans tout perdre. Respecter les rythmes et les identités. Comprendre pour mieux recommencer.**

---

*Les Lisières d’Avelune est en développement actif. Les principes ci-dessus représentent la direction du projet ; les valeurs numériques et contenus du prototype restent volontairement ajustables pendant les playtests.*
