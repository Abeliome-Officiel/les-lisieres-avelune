# Multi-monde, capacité et Tableau Univers

> **Statut : architecture partageable — v0.2**  
> Date : 18 août 2026  
> Ce document décrit l’architecture d’exploitation multi-instance sans exposer le background réservé ni les recettes du Cœur.

## 1. Principe

Le « monde partagé unique » s’applique à **chaque instance de production** : tous les joueurs d’une même Avelune partagent une seule histoire canonique, un seul état du monde et un seul Cœur autoritaire pour cette instance.

Le service Avelune n’est toutefois pas obligé de faire tenir toute sa population humaine dans une seule instance. Lorsque la capacité de jouabilité d’une Avelune devient insuffisante, une nouvelle instance indépendante peut être préparée et ouverte.

```text
service Avelune
├── Avelune A → Cœur A → histoire A
├── Avelune B → Cœur B → histoire B
└── Avelune C → Cœur C → histoire C
```

Les Avelune obéissent au même socle de lois et de genèse versionné, mais disposent d’identités, seeds privées, âges, états et histoires distincts.

**Terminologie :** une **Lisière** est une composante propre à chaque Avelune ; elle n’est pas le nom de l’instance entière. Pour distinguer les instances, la terminologie de travail reste **Avelune A, Avelune B, Avelune C** jusqu’à définition éventuelle de noms publics.

## 2. Indépendance stricte des mondes

Deux instances de production n’échangent pas :

- état canonique ;
- ressources ;
- événements ;
- causalité du Cœur ;
- Corcites ;
- progression de gameplay ;
- conséquences de jeu.

Une instance n’est donc ni une zone ni un sous-serveur d’une autre Avelune. C’est un monde autonome.

La pluralité des mondes est une propriété d’exploitation et de capacité. La documentation partageable ne fournit aucune explication cosmologique à cette pluralité.

## 3. Compte joueur et Corcites par monde

Un compte peut disposer de plusieurs parties sur des Avelune différentes.

Règles actées :

- un Corcite appartient à une seule instance ;
- sa progression n’est ni migrée ni copiée vers une autre instance ;
- changer d’Avelune signifie reprendre le Corcite déjà présent sur cette instance ou y créer un nouveau Corcite depuis le début ;
- le joueur choisit son Avelune parmi celles ouvertes et disposant de capacité ;
- il peut rejoindre l’Avelune d’un proche si cette instance accepte encore de nouveaux Corcites.

Cette séparation permet à un joueur expérimenté de recommencer une partie différente sur une autre Avelune sans altérer sa partie existante.

## 4. Fermeture et réouverture des inscriptions

Une Avelune peut cesser temporairement d’accepter de nouveaux Corcites lorsqu’elle approche de sa capacité de jouabilité.

Elle peut être rouverte si une capacité réelle redevient disponible.

La politique exacte d’inactivité très longue n’est pas encore actée. Elle devra respecter l’absence non punitive : libérer de la capacité ne doit pas signifier supprimer silencieusement l’identité ou la progression d’un joueur absent. Une forme de dormance ou d’hibernation avec conservation de l’historique doit être étudiée avant toute règle définitive.

## 5. Monde logique et machine physique

Une instance de monde est une identité logique durable. Elle n’est pas identifiée à la machine qui l’héberge.

```text
world_instance_id
      ≠
host_id
```

Conséquences :

- une Avelune doit pouvoir être déplacée vers une autre machine sans changer d’identité ;
- une nouvelle machine peut accueillir une Avelune existante ou une nouvelle instance ;
- ajouter une machine n’implique pas automatiquement de créer un monde ;
- créer un monde ne doit pas l’enfermer irréversiblement sur une machine précise ;
- **une machine peut héberger autant d’instances que les mesures cumulées permettent d’en exploiter sans risque matériel et sans dégradation perceptible de l’expérience de jeu**.

Aucun ratio fixe « une machine = un monde » ni « N mondes par machine » n’est acté. Le nombre admissible dépendra des mesures successives du Cœur seul, puis du Cœur avec les services de production, puis du jeu complet en charge réaliste.

L’optimisation de l’utilisation d’une machine est recherchée, mais elle reste subordonnée à deux limites : sécurité du matériel et qualité finale du jeu. Une économie de ressources qui dégrade le plaisir de jouer n’est pas une optimisation acceptable.

La migration d’une Avelune devra être qualifiée par sauvegarde, transfert, contrôle d’intégrité, reprise et vérification d’absence de seconde histoire.

## 6. Capacité : ne pas confondre machine et jouabilité

La capacité utile d’une Avelune ne se réduit pas au CPU ou à la RAM.

Elle devra distinguer au moins :

1. **capacité technique** : CPU, RAM, stockage, I/O, réseau, services et marge thermique ;
2. **capacité de jouabilité** : espace utile, implantations viables, densité de Corcites, qualité des interactions et expérience des nouveaux arrivants ;
3. **capacité opérationnelle** : marge de sécurité nécessaire pour absorber pointes, maintenance, sauvegardes, migrations et incidents.

Les valeurs de ces capacités ne sont pas définissables correctement tant que le jeu correspondant n’est pas suffisamment développé et instrumenté. Elles seront mesurées progressivement pendant les phases de développement puis réévaluées sur le produit réel.

Le seuil d’ouverture/fermeture est une décision d’exploitation mesurée. Il ne doit pas être enfoui dans les lois biologiques du Cœur.

## 7. Tableau Univers

Un **Tableau Univers** est prévu au-dessus des Tableaux Monde.

Il ne constitue pas une seconde autorité canonique. Sa panne ne doit pas arrêter les Cœurs sains.

Il doit permettre de voir au minimum :

- les instances connues ;
- leur identité et statut d’exploitation ;
- l’hôte actuel ;
- leur âge/maturité ;
- leur état d’ouverture aux nouveaux joueurs ;
- leur capacité et occupation ;
- leur santé technique ;
- leurs alertes ;
- un accès vers le Tableau Monde de l’instance sélectionnée.

Le Tableau Monde reste l’outil d’observation détaillée d’une Avelune particulière. Le Tableau Univers sert au pilotage de l’ensemble des instances.

## 8. Naissance d’un nouveau monde

La création d’une nouvelle Avelune ne doit pas être déclenchée parce qu’un Cœur existant est « trop vieux » ou parce que son facteur temporel doit être modifié.

La planification est extérieure au Cœur.

Le Tableau Univers peut estimer le besoin d’une nouvelle instance à partir de :

- capacité jouable restante ;
- inscriptions ;
- activité réelle ;
- tendance de croissance ;
- marge de sécurité ;
- délai de provisionnement ;
- délai estimé pour qu’une nouvelle Avelune atteigne son état d’accueil.

Le principe de l’alerte est :

```text
saturation prévisible des Avelune ouvertes
        comparée à
provisionnement + genèse/maturation + marge
```

Les seuils ne sont pas figés maintenant. Ils devront être estimés à partir des inscriptions réellement observées, de leur tendance, de l’incertitude de projection et des délais opérationnels mesurés. Analyse statistique et probabilité servent à décider assez tôt sans créer des mondes inutilement.

Si une nouvelle Avelune risquerait d’être prête trop tard, le système doit signaler qu’il faut envisager sa naissance.

Cette prévision ne modifie jamais la seed, la biologie, les lois ou l’horloge des mondes existants.

## 9. Action « faire naître un monde »

Dans un premier temps, la naissance reste **validée explicitement par un humain**.

Le flux cible est :

```text
Tableau Univers
    ↓
Créer une instance
    ↓
identité de monde
    ↓
seed privée
    ↓
provisionnement runtime + stockage
    ↓
lancement du Cœur
    ↓
genèse autonome
    ↓
gate de maturité / accueil
    ↓
ouverture aux joueurs
```

Le niveau maximal d’automatisation n’est pas encore défini. Il pourra aller d’une simple assistance à une automatisation importante si l’exploitation réelle montre que cela est utile et sûr.

## 10. Maturité d’un nouveau monde

Un nouveau monde ne doit pas être ouvert uniquement parce qu’un nombre fixe de jours s’est écoulé.

Le futur gate d’accueil devra refléter un état de préparation du monde. Ses critères exacts restent à définir et peuvent rester propriétaires s’ils révèlent des mécanismes du Cœur.

Deux seeds différentes peuvent donc atteindre leur état d’accueil à des moments différents sans qu’on modifie leur biologie pour respecter un calendrier commercial.

À ce stade, la définition précise de « prêt à recevoir des joueurs » reste ouverte ; elle devra être construite à partir des futurs besoins du gameplay et de l’état réellement observable du Cœur.

## 11. Fenêtre sur la Lisière

Chaque Avelune possède sa propre Lisière. La Fenêtre sur la Lisière doit pouvoir observer plusieurs Avelune de production sans mélanger leurs histoires.

Un sélecteur simple d’**Avelune**, par exemple un menu déroulant Avelune A / Avelune B / Avelune C, constitue l’interaction minimale retenue. Changer de sélection change la source canonique observée ; cela ne déplace pas un Corcite et ne modifie aucun monde.

Le libellé public final reste ouvert. La terminologie de travail Avelune A/B/C est provisoire mais correcte ; « Lisière A/B/C » ne doit pas servir de synonyme technique d’une instance entière.

## 12. Mesure progressive de la capacité

La capacité multi-instance doit être apprise au fil du développement plutôt que supposée aujourd’hui.

Ordre de mesure prévu :

1. coût permanent d’un Cœur seul ;
2. croissance de ses données et coût de sa persistance ;
3. coût d’un Cœur avec ses services de lecture/observation ;
4. coût cumulé des interpréteurs et services serveur réellement nécessaires ;
5. coût du jeu produit ;
6. essais de plusieurs instances simultanées sur une machine ;
7. essais de charge joueurs ;
8. définition de marges d’exploitation et de placement par host à partir des mesures.

Une mesure obtenue à une phase ne doit pas être extrapolée comme capacité finale du jeu si des composants importants manquent encore.

La première étape opérationnelle après qualification biologique est donc de mesurer un Cœur unique en fonctionnement continu réel avant de tenter de déduire combien d’instances pourront partager une machine.

## 13. Gates d’implémentation

Avant d’ouvrir réellement plusieurs mondes, l’architecture doit démontrer :

- identité `world_instance_id` indépendante du host ;
- stockage et sauvegardes namespacés par instance ;
- impossibilité de mélange entre deux histoires ;
- migration d’une instance vers un autre host ;
- restauration sans duplication canonique ;
- contrôle de capacité par host ;
- création d’une nouvelle instance sans modifier les existantes ;
- sélection correcte de la projection/contrat de lecture par instance ;
- association compte ↔ Corcite ↔ monde explicite ;
- fonctionnement du Tableau Univers sans devenir une dépendance de survie des Cœurs.

## 14. Questions encore ouvertes

Restent à mesurer ou concevoir :

- capacité jouable exacte d’une Avelune ;
- seuils et marges d’alerte, qui devront être dérivés des observations et projections réelles ;
- définition de l’inactivité très longue ;
- mécanisme non punitif de libération de capacité ;
- critères exacts de maturité avant ouverture ;
- nombre d’instances admissible par machine à chaque stade de développement puis en production ;
- stratégie de placement sur les hosts ;
- niveau futur d’automatisation de la naissance ;
- noms et présentation publique des différentes Avelune.
