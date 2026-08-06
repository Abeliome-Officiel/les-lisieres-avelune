# Les Lisières d’Avelune

> **Un monde partagé à habiter, comprendre et transformer.**  
> Développez un **Corcite**, corps-cité organique vivant, faites circuler matière, énergie et connaissance, préparez-vous aux vagues issues de la Fracture et laissez dans Avelune des traces qui comptent — sans course punitive, sans domination imposée, sans exiger d’être connecté en permanence.

**Les Lisières d’Avelune** est un jeu navigateur persistant mêlant **gestion systémique**, **production et réseaux**, **défense contre des vagues**, **progression RPG horizontale**, **narration textuelle** et **monde partagé évolutif**.

Le projet est actuellement en **prototype intégré jouable / playtest humain**. Le but n’est pas encore de produire beaucoup de contenu : il est de vérifier que la nature même d’Avelune est intéressante à jouer.

### Accès rapide

- **Jouer au prototype** : https://proto.avelune.duckdns.org
- **Comprendre la vision** : [`docs/00_vision.md`](docs/00_vision.md)
- **Explorer toute la documentation** : [`docs/index.md`](docs/index.md)
- **Voir l’état du PROTO-0 jouable** : [`docs/proto0/PROTO0_PLAYABLE_SCOPE.md`](docs/proto0/PROTO0_PLAYABLE_SCOPE.md)
- **Comprendre la méthode de développement** : [`docs/development/GAME_DEVELOPMENT_METHOD.md`](docs/development/GAME_DEVELOPMENT_METHOD.md)
- **Lire l’audit architecture/développement** : [`docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md`](docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)

---

## Avelune en quelques mots

Avelune est pensé comme un jeu **profond mais calme**, où la complexité vient des interactions entre systèmes plutôt que d’une accumulation de contraintes artificielles.

On y développe un organisme-cité, on choisit ce qu’il produit, ce qu’il comprend et ce qu’il devient. On anticipe des vagues, on prépare des défenses, on accepte parfois de ne pas tout arrêter, on récupère ce qui peut l’être, on s’adapte aux conséquences et on recommence avec une meilleure compréhension du monde.

L’ambition est de faire naître une sensation proche de :

> **« Je comprends mieux ce qui s’est passé. J’ai une idée de ce que je veux essayer ensuite. »**

C’est le cœur du projet.

---

# Les intentions fondatrices

Ces principes ne sont pas des options d’interface ajoutées à la fin du développement. Ils font partie du **game design lui-même** et doivent guider les choix mécaniques, narratifs et techniques.

## Un jeu pensé aussi pour les personnes TSA, TDAH et dys

Avelune est conçu avec une attention explicite aux personnes pouvant être concernées notamment par :

- le **TSA** ;
- le **TDAH** ;
- les troubles **dys** ;
- la surcharge cognitive ;
- la difficulté à hiérarchiser une grande quantité d’informations ;
- le besoin de routines ou, au contraire, de variété ;
- des rythmes d’apprentissage et de disponibilité très différents.

Cela ne signifie pas rendre le jeu pauvre ou trivial.

Le principe est au contraire :

> **conserver la profondeur, mais offrir plusieurs chemins pour l’appréhender.**

Le même système peut donc proposer plusieurs profondeurs de lecture, des explications progressives, des récapitulatifs, de l’automatisation et des outils d’aide — **sans créer un “mode facile” qui donnerait moins de droits de jeu**.

→ [`Accessibilité et éthique`](docs/06_accessibilite_ethique.md)

---

## Pas de “micro-dopamine” comme moteur de rétention

Avelune ne doit pas être construit autour d’une succession de petites récompenses artificielles destinées principalement à maintenir le clic ou la connexion.

Le projet veut éviter comme leviers principaux :

- les récompenses distribuées toutes les quelques secondes sans réelle signification ;
- les notifications conçues pour provoquer une reconnexion compulsive ;
- les coffres, roulettes ou récompenses aléatoires utilisés comme boucle centrale de rétention ;
- les séries quotidiennes punitives ;
- les quêtes journalières obligatoires pour ne pas “prendre de retard” ;
- les jauges et badges ajoutés uniquement pour créer une impression constante de progression ;
- les mécanismes de peur de manquer quelque chose (**FOMO**) ;
- les boucles de connexion pensées d’abord pour le temps d’écran plutôt que pour l’expérience de jeu.

Cela n’interdit pas les retours visuels agréables, les découvertes ou la satisfaction de progresser. La différence recherchée est simple :

> **la récompense doit venir de la compréhension, de la décision, de la découverte et de l’évolution du monde — pas d’une captation artificielle de l’attention.**

---

## Un jeu qui challenge réellement

Avelune n’a pas vocation à devenir un jeu où tout réussit automatiquement.

Le joueur doit pouvoir rencontrer :

- des ressources insuffisantes ;
- des choix incompatibles ;
- des contraintes d’énergie, d’entretien, de population ou d’espace ;
- des vagues imparfaitement anticipées ;
- des décisions dont les effets ne sont pas entièrement immédiats ;
- des situations qui obligent à revoir une organisation ;
- des conséquences persistantes qui demandent une adaptation.

Le challenge recherché est surtout **systémique, intellectuel et stratégique**.

Le jeu doit pouvoir être exigeant sans devenir punitif ou humiliant.

> **Challenge ne signifie pas punition.**

Une mauvaise décision doit idéalement produire une nouvelle situation à comprendre plutôt qu’un simple écran d’échec.

---

## S’adapter aux styles de jeu, aux envies et aux possibilités de toustes

Il n’existe pas une seule “bonne” manière de jouer à Avelune.

Le jeu doit pouvoir accueillir, autant que possible :

- une personne très méthodique ou très expérimentale ;
- une personne qui adore optimiser ou une personne qui préfère explorer ;
- une personne très sociale ou une personne qui joue presque seule ;
- une personne disponible longtemps ou par courtes sessions ;
- une personne qui veut lire beaucoup de détails ou seulement l’essentiel ;
- une personne qui aime intervenir manuellement ou qui préfère automatiser certaines tâches ;
- un style polyvalent, orienté ou très spécialisé ;
- des capacités d’attention, de mémoire de travail et de traitement de l’information différentes.

Le but n’est pas de rendre toutes les stratégies équivalentes dans toutes les situations. Le but est que **plusieurs manières légitimes de jouer puissent exister** et que le jeu ne force pas artificiellement tout le monde dans le même comportement.

Les préférences et contraintes du joueur doivent autant que possible modifier **la manière d’accéder au jeu**, pas son droit à jouer pleinement.

---

## Non genré et inclusif par conception

Avelune ne doit pas enfermer personnages et joueurs dans des rôles genrés.

Principes :

- aucun métier, classe, rôle, capacité ou style de jeu ne doit être réservé à un genre ;
- les pronoms doivent pouvoir être choisis ;
- la langue et la grammaire doivent pouvoir évoluer vers des formes configurables ;
- l’écriture et les interfaces doivent éviter de supposer inutilement le genre de la personne qui joue ;
- la diversité des identités doit être considérée comme normale dans le monde, pas comme une exception à justifier mécaniquement.

L’objectif est qu’une personne puisse habiter Avelune **sans devoir entrer dans une case de genre prédéfinie par le système**.

---

## Même profondeur de jeu, plusieurs profondeurs d’interface

Les vues Simple, Intermédiaire et Profond doivent être des **lectures différentes du même état de jeu**.

Changer de profondeur ne doit pas :

- changer les règles ;
- retirer des choix essentiels ;
- modifier les chances de réussite ;
- donner une récompense exclusive aux personnes capables de gérer l’interface la plus complexe.

La complexité doit être **progressivement révélable**, pas imposée en bloc.

---

# Les concepts forts

## Le Corcite — personnage, organisme et cité

Le joueur ne contrôle pas seulement un avatar : il développe un **Corcite**, un corps-cité vivant ancré dans Avelune.

Le Corcite possède et organise progressivement :

- une empreinte dans le monde ;
- des bâtiments et fonctions organiques ;
- des chaînes d’extraction, transformation et fabrication ;
- des stockages et connexions ;
- de l’énergie ;
- de l’entretien ;
- une population et une capacité de travail ;
- des connaissances, recherches et compétences ;
- des défenses ;
- une mémoire des événements et des choix traversés.

Sa croissance doit créer **des formes et stratégies différentes**, pas simplement un niveau supérieur.

→ [`Corps-cité, empreinte et influence`](docs/01_concept_corps_cite.md)

---

## La Fracture, les vagues et la Lisière

Au centre du monde se trouve la **Fracture**. Elle produit des vagues qui traversent Avelune jusqu’à la **Lisière**, frontière vitale du monde.

Une vague n’est pas seulement une barre de points de vie à réduire.

Elle possède plusieurs propriétés pouvant être :

- atténuées ;
- déstructurées ;
- stabilisées ;
- captées ;
- transformées par l’ordre des défenses rencontrées.

Le joueur prépare donc la vague **avant** son arrivée grâce au développement de son Corcite. Le résultat de la vague devient ensuite une nouvelle situation de gestion : dégâts, dette, récupération, matière captée, connaissance et adaptation.

La défense doit ainsi rester reliée à tout le reste du jeu plutôt que devenir un mini-jeu isolé.

→ [`Lisière et Passage`](docs/15_lisiere_et_passage.md)  
→ [`État du prototype jouable`](docs/proto0/PROTO0_PLAYTEST_READY.md)

---

## Produire, connecter, arbitrer

La dimension gestion repose sur de vraies chaînes :

```text
ressources du monde
        ↓
extraction
        ↓
stockage
        ↓
transformation
        ↓
fabrication / construction
        ↓
énergie + entretien + population / travail
        ↓
développement du Corcite
```

Le joueur ne peut pas tout faire simultanément.

Il doit choisir :

- quelles fonctions activer ;
- quelles ressources privilégier ;
- où investir ;
- quand produire ;
- quand transformer ;
- quand fabriquer une défense ;
- quand accepter une dette ou une réserve réduite ;
- comment préparer la vague suivante.

L’objectif n’est pas la microgestion pour elle-même, mais **l’arbitrage lisible entre plusieurs besoins légitimes**.

→ [`Tycoon et réseaux`](docs/03_tycoon_et_reseaux.md)

---

## Une couche RPG qui donne du sens aux systèmes

Le RPG n’est pas conçu comme une file d’actions artificiellement symétrique aux autres mécaniques.

Il constitue une couche **textuelle, évolutive et transversale** :

- recherches ;
- découvertes ;
- compétences ;
- métiers ;
- classes ;
- spécialisations ;
- capacités ;
- accès ;
- modificateurs ;
- connaissances ;
- choix narratifs ;
- relations ;
- mémoire du Corcite.

La progression vise surtout à **ouvrir des possibilités et différencier les personnages**, plutôt qu’à transformer le jeu en course verticale à la puissance.

→ [`Trame RPG`](docs/14_trame_rpg.md)

---

## Un monde partagé qui se souvient

Avelune n’a pas vocation à séparer artificiellement « solo » et « multijoueur ».

Le monde est **unique et partagé**, même pour une personne qui souhaite jouer de manière autonome et avec peu d’interactions sociales.

Les lieux, événements et actions peuvent laisser :

- des **Traces** ;
- des ruines ;
- des transformations de terrain ;
- des **Échos** ;
- des connaissances ;
- une histoire du monde.

La carte peut évoluer et s’étendre, mais un principe est acté : **Avelune ne rétrécit pas**.

L’histoire créée par les premières périodes du jeu pourra devenir mémoire fictionnelle, mais ne doit jamais créer de privilège mécanique essentiel réservé aux premiers joueurs.

→ [`Monde persistant, carte et chronologie`](docs/02_monde_persistant.md)

---

# Une éthique intégrée au game design

L’éthique d’Avelune n’est pas une couche de communication ajoutée après coup. Elle influence directement les mécaniques.

## Échec fertile

L’échec doit produire quelque chose :

- une information ;
- une cicatrice ;
- une Trace ;
- un Écho ;
- une transformation ;
- un problème nouveau ;
- une raison d’essayer autrement.

L’échec ne doit pas principalement servir à effacer brutalement des dizaines d’heures de jeu.

**Comprendre et s’adapter doit être plus important que punir.**

---

## Pas de FOMO punitif

Avelune ne doit pas exiger une présence quotidienne sous menace de perte.

Le projet exclut comme moteur principal :

- les séries quotidiennes punitives ;
- la connexion obligatoire ;
- les réflexes imposés ;
- la peur artificielle de « rater » quelque chose ;
- la destruction irréversible simplement parce qu’un joueur s’est absenté.

Le retour après absence doit favoriser **récapitulatif, compréhension et reprise**.

---

## Pas de classement humiliant

Le monde partagé n’est pas destiné à devenir une pyramide sociale permanente.

Il n’a pas vocation à mettre en avant :

- un classement global humiliant ;
- une domination mécanique permanente des plus anciens ;
- une concurrence imposée entre joueurs ;
- une dépendance sociale obligatoire.

Les systèmes collectifs futurs privilégieront contributions, besoins, offres, projets et consentement.

---

## Coopérer sans être obligé de socialiser en permanence

L’entraide et l’interdépendance font partie de la vision du jeu, mais elles ne doivent pas forcer chaque personne à :

- discuter en temps réel ;
- rejoindre un groupe permanent ;
- attendre qu’un autre joueur soit connecté ;
- maintenir une présence sociale constante.

Le monde est commun ; **le degré d’implication sociale reste modulable**.

→ [`Monde partagé et coopération`](docs/05_social_et_communication.md)

---

# Une progression surtout horizontale

Avelune cherche à limiter le modèle classique :

> ancien personnage = personnage objectivement meilleur dans presque toutes les situations.

Races, classes, métiers, compétences, recherches et futures mues doivent surtout créer :

- des orientations ;
- des spécialisations ;
- des compromis ;
- des interactions différentes avec le monde ;
- de nouvelles possibilités.

Le jeu doit pouvoir accueillir des profils polyvalents, orientés ou spécialisés sans qu’un seul chemin devienne la progression obligatoire.

---

# La boucle d’Avelune

La boucle de jeu visée peut se résumer ainsi :

```text
ressources du monde
        ↓
extraction / stockage / transformation
        ↓
fabrication / construction / organisation du Corcite
        ↓
recherche / progression / découvertes
        ↓
préparation des défenses
        ↓
vague
        ↓
conséquences / captation / connaissance
        ↓
récupération / adaptation
        ↓
nouvelle préparation
```

Le Tower Defense, la gestion TF et le RPG ne sont donc pas trois mini-jeux indépendants. Ils doivent produire **une seule situation de jeu cohérente**.

---

# Où en est le projet ?

La branche de développement jouable est :

`develop/proto-0.1-playable`

Le PROTO-0 dispose désormais d’une boucle intégrée avec notamment :

- départ minimal du Corcite ;
- construction ;
- extraction et stockage ;
- transformation et fabrication ;
- énergie, entretien, population et travail ;
- recherches et découvertes ;
- fabrication et organisation des défenses ;
- cycle multi-vagues ;
- conséquences persistantes et récupération ;
- captation et matière de vague ;
- interface navigateur mobile/bureau ;
- carnet de playtest ;
- simulations reproductibles.

Au dernier jalon complet documenté :

- **338 tests** passaient ;
- `svelte-check` ne remontait aucun diagnostic ;
- le build de production était valide ;
- une batterie de **384 parties complètes** avait été exécutée.

Ces chiffres indiquent la stabilité technique du prototype, **pas sa qualité ludique**.

Le projet est actuellement dans la phase :

> **prototype intégré → playtest humain → validation ou correction de la boucle.**

Les paramètres numériques du prototype — coûts, rendements, coefficients, nombre et calendrier des vagues, durée des recherches, récupération — restent **provisoires** et peuvent évoluer pendant cette phase.

→ [`Gate de playtest`](docs/proto0/PROTO0_PLAYTEST_READY.md)

---

# Une méthode de développement volontairement critique

Le prototype est développé avec un principe :

> **Réduire la quantité, pas la nature du jeu.**

On cherche donc à tester une vraie version miniature d’Avelune plutôt qu’un banc de test artificiel.

La démarche actuelle :

1. vision et piliers ;
2. boucles principales ;
3. moteurs de systèmes ;
4. prototype intégré ;
5. playtest humain ;
6. consolidation technique ;
7. vertical slice ;
8. production de contenu ;
9. équilibrage, UX et accessibilité à grande échelle ;
10. monde persistant partagé et montée en charge.

→ [`Méthode de développement jeu vidéo`](docs/development/GAME_DEVELOPMENT_METHOD.md)

---

# Une architecture prévue pour évoluer

Le cœur du prototype suit déjà la direction :

```text
UI / API
   ↓
application / orchestration
   ↓
domaine / règles
```

Les moteurs TF, RPG, TD et vague sont exécutables indépendamment de l’interface et utilisés par les tests et simulations.

La prochaine consolidation technique devra notamment :

- découper l’interface Svelte monolithique ;
- externaliser davantage les paramètres d’équilibrage ;
- passer progressivement à des datasets de contenu versionnés ;
- versionner les états persistants et leurs migrations ;
- rendre le serveur autoritaire pour le futur monde partagé ;
- ajouter CI et tests E2E.

→ [`Audit développement et architecture`](docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)  
→ [`Architecture actuelle et cible`](docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md)  
→ [`Politique données/configuration`](docs/development/DATA_CONFIGURATION_POLICY.md)

---

# Explorer la documentation

## Comprendre le jeu

- [`Vision`](docs/00_vision.md)
- [`Corps-cité`](docs/01_concept_corps_cite.md)
- [`Monde persistant`](docs/02_monde_persistant.md)
- [`Tycoon et réseaux`](docs/03_tycoon_et_reseaux.md)
- [`Social et coopération`](docs/05_social_et_communication.md)
- [`Accessibilité et éthique`](docs/06_accessibilite_ethique.md)
- [`Trame RPG`](docs/14_trame_rpg.md)
- [`Lisière et Passage`](docs/15_lisiere_et_passage.md)

## Comprendre le prototype

- [`Périmètre jouable`](docs/proto0/PROTO0_PLAYABLE_SCOPE.md)
- [`Gate de playtest`](docs/proto0/PROTO0_PLAYTEST_READY.md)
- [`Carnet de test`](docs/proto0/PROTO0_TEST_NOTEBOOK.md)
- [`Rapport de simulations`](docs/proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [`Parcours technique de référence`](docs/proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

## Comprendre le développement

- [`Index développement`](docs/development/README.md)
- [`Audit architecture/développement`](docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [`Architecture actuelle et cible`](docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [`Données et configuration`](docs/development/DATA_CONFIGURATION_POLICY.md)
- [`Dette technique`](docs/development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [`Tests, sécurité et persistance`](docs/development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)

L’index complet est disponible dans [`docs/index.md`](docs/index.md).

---

# Documentation historique

Les jalons P0–P10 et `proto-0-spec.1` sont conservés comme historique de validation des moteurs.

Ils décrivent notamment un ancien scénario fixe de laboratoire et ne constituent plus la définition normative du prototype jouable lorsqu’ils entrent en contradiction avec la documentation actuelle.

La branche historique `develop/proto-0` est conservée pour traçabilité.

---

# Développement local

Application : `app/`  
Infrastructure : `infra/compose.yaml`

Commandes de validation de référence :

```bash
npm run test:proto0
npm run check
npm run build
```

---

## En une phrase

> **Construire sans conquérir. Progresser sans écraser. Challenger sans punir. Échouer sans tout perdre. Respecter les rythmes et les identités. Comprendre pour mieux recommencer.**
