# Multi-monde, capacité et Tableau Univers

> **Statut : architecture partageable — v0.1**  
> Date : 18 août 2026  
> Ce document décrit l’architecture d’exploitation multi-instance sans exposer le background réservé ni les recettes du Cœur.

## 1. Principe

Le « monde partagé unique » s’applique à **chaque instance de production** : tous les joueurs d’un même monde partagent une seule histoire canonique, un seul état du monde et un seul Cœur autoritaire pour cette instance.

Le service Avelune n’est toutefois pas obligé de faire tenir toute sa population humaine dans une seule instance. Lorsque la capacité de jouabilité d’un monde devient insuffisante, une nouvelle instance indépendante peut être préparée et ouverte.

```text
service Avelune
├── monde A → Cœur A → histoire A
├── monde B → Cœur B → histoire B
└── monde C → Cœur C → histoire C
```

Les mondes obéissent au même socle de lois et de genèse versionné, mais disposent d’identités, seeds privées, âges, états et histoires distincts.

## 2. Indépendance stricte des mondes

Deux instances de production n’échangent pas :

- état canonique ;
- ressources ;
- événements ;
- causalité du Cœur ;
- Corcites ;
- progression de gameplay ;
- conséquences de jeu.

Une instance n’est donc ni une zone ni un sous-serveur d’un autre monde. C’est un monde autonome.

La pluralité des mondes est une propriété d’exploitation et de capacité. La documentation partageable ne fournit aucune explication cosmologique à cette pluralité.

## 3. Compte joueur et Corcites par monde

Un compte peut disposer de plusieurs parties sur des mondes différents.

Règles actées :

- un Corcite appartient à une seule instance ;
- sa progression n’est ni migrée ni copiée vers une autre instance ;
- changer de monde signifie reprendre le Corcite déjà présent sur ce monde ou y créer un nouveau Corcite depuis le début ;
- le joueur choisit son monde parmi ceux ouverts et disposant de capacité ;
- il peut rejoindre le monde d’un proche si ce monde accepte encore de nouveaux Corcites.

Cette séparation permet à un joueur expérimenté de recommencer une partie différente sur un autre monde sans altérer sa partie existante.

## 4. Fermeture et réouverture des inscriptions

Un monde peut cesser temporairement d’accepter de nouveaux Corcites lorsqu’il approche de sa capacité de jouabilité.

Il peut être rouvert si une capacité réelle redevient disponible.

La politique exacte d’inactivité très longue n’est pas encore actée. Elle devra respecter l’absence non punitive : libérer de la capacité ne doit pas signifier supprimer silencieusement l’identité ou la progression d’un joueur absent. Une forme de dormance ou d’hibernation avec conservation de l’historique doit être étudiée avant toute règle définitive.

## 5. Monde logique et machine physique

Une instance de monde est une identité logique durable. Elle n’est pas identifiée à la machine qui l’héberge.

```text
world_instance_id
      ≠
host_id
```

Conséquences :

- un monde doit pouvoir être déplacé vers une autre machine sans changer d’identité ;
- une nouvelle machine peut accueillir un monde existant ou un nouveau monde ;
- ajouter une machine n’implique pas automatiquement de créer un monde ;
- créer un monde ne doit pas l’enfermer irréversiblement sur une machine précise ;
- une machine peut héberger une ou plusieurs instances uniquement si les mesures de capacité et la marge de sécurité le permettent.

La migration d’un monde devra être qualifiée par sauvegarde, transfert, contrôle d’intégrité, reprise et vérification d’absence de seconde histoire.

## 6. Capacité : ne pas confondre machine et jouabilité

La capacité utile d’un monde ne se réduit pas au CPU ou à la RAM.

Elle devra distinguer au moins :

1. **capacité technique** : CPU, RAM, stockage, I/O, réseau, services et marge thermique ;
2. **capacité de jouabilité** : espace utile, implantations viables, densité de Corcites, qualité des interactions et expérience des nouveaux arrivants ;
3. **capacité opérationnelle** : marge de sécurité nécessaire pour absorber pointes, maintenance, sauvegardes, migrations et incidents.

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

Le Tableau Monde reste l’outil d’observation détaillée d’un monde particulier. Le Tableau Univers sert au pilotage de l’ensemble des instances.

## 8. Naissance d’un nouveau monde

La création d’un monde ne doit pas être déclenchée parce qu’un Cœur existant est « trop vieux » ou parce que son facteur temporel doit être modifié.

La planification est extérieure au Cœur.

Le Tableau Univers peut estimer le besoin d’une nouvelle instance à partir de :

- capacité jouable restante ;
- inscriptions ;
- activité réelle ;
- tendance de croissance ;
- marge de sécurité ;
- délai de provisionnement ;
- délai estimé pour qu’un nouveau monde atteigne son état d’accueil.

Le principe de l’alerte est :

```text
saturation prévisible du monde ouvert
        comparée à
provisionnement + genèse/maturation + marge
```

Si le nouveau monde risquerait d’être prêt trop tard, le système doit signaler qu’il faut envisager sa naissance.

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

L’automatisation complète n’est pas actée. Elle ne sera envisagée qu’après qualification de plusieurs créations, reprises et migrations.

## 10. Maturité d’un nouveau monde

Un nouveau monde ne doit pas être ouvert uniquement parce qu’un nombre fixe de jours s’est écoulé.

Le futur gate d’accueil devra refléter un état de préparation du monde. Ses critères exacts restent à définir et peuvent rester propriétaires s’ils révèlent des mécanismes du Cœur.

Deux seeds différentes peuvent donc atteindre leur état d’accueil à des moments différents sans qu’on modifie leur biologie pour respecter un calendrier commercial.

## 11. Fenêtre sur la Lisière

La Fenêtre sur la Lisière doit pouvoir observer plusieurs instances de production sans mélanger leurs histoires.

Un sélecteur simple de Lisière/instance, par exemple un menu déroulant, constitue l’interaction minimale retenue. Changer de sélection change la source canonique observée ; cela ne déplace pas un Corcite et ne modifie aucun monde.

Le libellé et la présentation publics ne doivent révéler aucun background réservé.

## 12. Gates d’implémentation

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

## 13. Questions encore ouvertes

Restent à mesurer ou concevoir :

- capacité jouable exacte d’un monde ;
- seuils et marges d’alerte ;
- définition de l’inactivité très longue ;
- mécanisme non punitif de libération de capacité ;
- critères exacts de maturité avant ouverture ;
- nombre d’instances admissible par machine ;
- stratégie de placement sur les hosts ;
- niveau futur d’automatisation de la naissance ;
- noms et présentation publique des différentes Lisières/instances.
