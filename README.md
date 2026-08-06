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

# Accessibilité : plusieurs profondeurs, les mêmes règles

Avelune doit pouvoir accueillir des personnes attirées par des systèmes complexes sans imposer à tout le monde la même densité d’interface.

Le projet porte une attention particulière aux besoins pouvant concerner notamment :

- TSA ;
- TDAH ;
- dys ;
- surcharge cognitive ;
- besoin de progressivité ;
- besoin de personnalisation de la présentation.

Principes retenus :

- complexité progressive ;
- informations essentielles lisibles ;
- automatisation possible ;
- conséquences expliquées ;
- pronoms, langue et grammaire configurables ;
- plusieurs profondeurs d’affichage ;
- **aucun avantage mécanique exclusif réservé au mode “expert”**.

Les vues Simple, Intermédiaire et Profond doivent présenter **le même personnage et les mêmes règles**, avec des niveaux de détail différents.

→ [`Accessibilité et éthique`](docs/06_accessibilite_ethique.md)

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

Le jeu doit pouvoir accueillir des profils polyvalents, orientés ou spécialisés sans qu’un chemin unique devienne universellement optimal.

---

# La boucle actuellement testée

Le PROTO-0 cherche à conserver la **nature réelle du jeu en miniature** :

```text
monde / ressources
        ↓
extraction
        ↓
stockage et réseaux
        ↓
transformation
        ↓
fabrication / construction
        ↓
organisation du Corcite
        ↓
recherche / progression
        ↓
préparation des défenses
        ↓
vague
        ↓
conséquences
        ↓
récupération / captation / adaptation
        ↺
```

> **On réduit la quantité, pas la nature du jeu.**

Le prototype doit permettre de répondre à une question avant toute production massive :

> **Est-ce que jouer à Avelune est intéressant ? Est-ce que les décisions produisent des situations qu’on veut comprendre, améliorer et expérimenter ?**

---

# Où en est le projet ?

## Stade actuel

**Prototype intégré jouable → playtests humains → ajustements.**

Le premier cycle de retours joueurs est en cours et certaines valeurs ou présentations du prototype sont activement retravaillées.

Les grands principes décrits dans ce README sont considérés comme **stables**. En revanche, les paramètres suivants restent volontairement modifiables :

- nombre de vagues d’un scénario de test ;
- calendrier des vagues ;
- coûts ;
- rendements ;
- quantités initiales ;
- coefficients ;
- durée des recherches ;
- puissance des défenses ;
- rythme de récupération.

Au dernier jalon technique consolidé :

| Élément | État |
|---|---|
| Boucle miniature de jeu | ✅ jouable |
| Construction / extraction / transformation / fabrication | ✅ |
| Énergie / entretien / population / travail | ✅ |
| Recherche et découvertes | ✅ |
| Fabrication et inventaire TD | ✅ |
| Cycle multi-vagues | ✅ |
| Conséquences persistantes / récupération | ✅ |
| Captation | ✅ |
| Interface prototype mobile / bureau | ✅ |
| Carnet de playtest | ✅ |
| Tests automatisés | **338** lors du dernier passage complet documenté |
| Simulations de référence | **384 parties** |
| Verdict expérientiel | 🧪 en playtest |

Les tests et simulations servent à prouver que les règles tiennent ensemble. **Ils ne prouvent pas que le jeu est amusant, lisible ou bien rythmé.**

→ [`Gate de playtest`](docs/proto0/PROTO0_PLAYTEST_READY.md)  
→ [`Rapport de simulations`](docs/proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)

---

# Une architecture pensée pour évoluer

Le prototype n’est pas uniquement codé dans l’interface.

Le cœur est organisé autour de briques réutilisables :

```text
domaine / règles
        ↓
moteurs TF / RPG / TD / vague
        ↓
orchestration des cas d’usage
        ↓
interface
```

Les mêmes moteurs sont utilisés par :

- les tests ;
- les simulations ;
- le contrôleur navigateur.

Cette architecture prépare une évolution vers un futur serveur autoritaire et des contenus davantage pilotés par des datasets plutôt que par des valeurs recompilées dans le code.

Le projet reste toutefois un prototype : l’interface actuelle doit encore être découpée et une partie du contenu/équilibrage doit devenir réellement **data-driven** avant une production importante de contenu.

→ [`Architecture actuelle et cible`](docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md)  
→ [`Politique données/configuration`](docs/development/DATA_CONFIGURATION_POLICY.md)  
→ [`Dette technique et prochaines étapes`](docs/development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)

---

# Méthode de développement

Le projet évite autant que possible la logique « ajouter des fonctionnalités jusqu’à obtenir un jeu ».

La progression visée est :

1. **vision et piliers** ;
2. **boucles de jeu** ;
3. **prototypes des systèmes** ;
4. **prototype intégré jouable** ;
5. **playtests et validation de l’intérêt** ← **nous sommes ici** ;
6. consolidation architecture et pipeline de contenu ;
7. vertical slice ;
8. production de contenu ;
9. équilibrage, UX et accessibilité à plus grande échelle ;
10. persistance et monde partagé de production ;
11. alpha / bêta / exploitation.

→ [`Méthode de développement jeu vidéo`](docs/development/GAME_DEVELOPMENT_METHOD.md)

---

# Documentation — par où commencer ?

## Je veux comprendre le jeu

- [`Vision`](docs/00_vision.md)
- [`Corps-cité`](docs/01_concept_corps_cite.md)
- [`Monde persistant`](docs/02_monde_persistant.md)
- [`Tycoon et réseaux`](docs/03_tycoon_et_reseaux.md)
- [`Social et coopération`](docs/05_social_et_communication.md)
- [`Accessibilité et éthique`](docs/06_accessibilite_ethique.md)
- [`Trame RPG`](docs/14_trame_rpg.md)
- [`Lisière et Passage`](docs/15_lisiere_et_passage.md)

## Je veux comprendre le prototype actuel

- [`Périmètre jouable`](docs/proto0/PROTO0_PLAYABLE_SCOPE.md)
- [`Gate de playtest`](docs/proto0/PROTO0_PLAYTEST_READY.md)
- [`Carnet de test`](docs/proto0/PROTO0_TEST_NOTEBOOK.md)
- [`Simulations`](docs/proto0/PROTO0_PLAYABLE_BALANCE_REPORT.md)
- [`Parcours technique`](docs/proto0/PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md)

## Je veux comprendre le développement technique

- [`Audit développement / architecture`](docs/development/AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [`Architecture actuelle et cible`](docs/development/ARCHITECTURE_CURRENT_AND_TARGET.md)
- [`Données et équilibrage`](docs/development/DATA_CONFIGURATION_POLICY.md)
- [`Méthode de développement`](docs/development/GAME_DEVELOPMENT_METHOD.md)
- [`Dette technique`](docs/development/TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [`Tests, sécurité et persistance`](docs/development/TEST_SECURITY_PERSISTENCE_STRATEGY.md)

### Index complet

→ **[`docs/index.md`](docs/index.md)**

---

# Historique du projet

Les anciens jalons P0–P10 et `proto-0-spec.1` sont conservés dans le dépôt parce qu’ils documentent la construction et la validation progressive des moteurs.

Ils peuvent contenir des règles de laboratoire désormais dépassées — notamment les anciens scénarios fixes — et ne doivent pas être confondus avec la définition courante du prototype jouable.

Cette conservation est volontaire : **l’histoire de la conception fait partie de la traçabilité du projet.**

---

# Développement local

Application : `app/`  
Infrastructure : `infra/compose.yaml`

Validation de référence :

```bash
npm run test:proto0
npm run check
npm run build
```

Branche de jeu active :

```text
develop/proto-0.1-playable
```

Une branche documentaire séparée peut être utilisée pendant les modifications du prototype afin d’éviter les conflits entre travail de conception/documentation et changements de code.

---

## Les Lisières d’Avelune

**Construire sans conquérir. Progresser sans écraser. Échouer sans tout perdre. Comprendre pour mieux recommencer.**
