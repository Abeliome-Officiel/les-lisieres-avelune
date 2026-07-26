# Les Lisières d’Avelune
## Book de conception v0.7

Date : 2026-07-26

> Cette version est un instantané de conception. Le classeur associé est l’outil principal pour valider, invalider, modifier ou reporter chaque décision.

---

# Comment relire cette version

1. Lire la vision et le fonctionnement général.
2. Ouvrir le classeur et commencer par **Arbitrages prioritaires**.
3. Renseigner la colonne **Validation utilisateur** puis **Décision finale / commentaire**.
4. Ne pas chercher à tout figer : les décisions reportées et écartées restent visibles pour conserver l’historique.

# Vision

Un jeu navigateur de gestion, RPG, tycoon organique et transformation collective. Chaque personne développe un corps-cité, agit sur un monde persistant et choisit sa manière d’aider. Les événements peuvent être combattus, compris, accueillis, détournés ou transcendés.

## Piliers

- **Corps-cité et tycoon lisible** : cycles courts, automatismes et chaînes limitées.
- **RPG, exploration et instances** : incarnation mobile, Éclats, crises et éventuellement PvP volontaire plus tard.
- **Monde hexagonal persistant** : cellules, écotones, NPC évolutifs, Voiles et Époques.

# Corps-cité

Le personnage est à la fois avatar et microcosme de gestion. Son intérieur est représenté de manière végétale, minérale, magique et abstraite. Il possède un ancrage territorial et une incarnation capable d’explorer.

La vue de prototype est volontairement simple :

- carte générale cliquable ;
- vue intérieure fixe du corps-cité ;
- panneaux de flux, règles, crises et actions.

# Terrain, écotones et déplacement

Le terrain est une grille **hexagonale**. Chaque cellule possède six voisines, ce qui simplifie les distances et rend plus naturelles les propagations de Voiles, d’écotones et de migrations.

Chaque cellule peut contenir : type de sol, humidité, chaleur, minéralité, fertilité, mémoire, activité magique, accessibilité, ressources, saison, phénomène mobile et Traces.

Le corps-cité influence un **écotone** non exclusif. Les écotones voisins peuvent produire des synergies, tensions ou transformations, mais ne permettent pas de sabotage direct.

L’ancrage peut migrer très lentement. L’incarnation mobile gère l’exploration et les petites instances.

# Persistance, Traces, dormance et NPC

Les Traces ne sont pas nominatives : comme dans la nature, elles modifient le terrain, ses propriétés, sa taille ou son espace. La chronique peut raconter une transformation collective sans ériger chaque action en signature personnelle.

Un compte dormant maintient seulement les fonctions vitales et les échanges déjà autorisés. Il ne progresse presque pas pendant son absence. Les partenaires sont alertés de la baisse de débit et peuvent interrompre ou remplacer le lien.

Les écosystèmes NPC évoluent lentement selon quelques orientations : conservation, expansion, ouverture, recherche, migration ou restauration. Ils garantissent le jeu solo sans rester de simples boutiques figées.

Les **Époques** structurent l’histoire comme des chapitres. Elles peuvent être mondiales, régionales ou concerner un groupe; leur clôture peut ouvrir une nouvelle orientation.

# Tycoon et commerce

Le tycoon doit conserver le plaisir de l’organisation sans devenir une usine impossible à relire. Les chaînes de production restent courtes, visibles sur un écran et composées de peu d’entrées et sorties.

Le **Hub racinaire** publie : ressources offertes, ressources recherchées, ratios acceptés, réserve minimale, débit, portée et ports disponibles. Un autre joueur ou un NPC peut établir un échange compatible sans validation supplémentaire, car le consentement a déjà été exprimé dans les règles.

La suppression d’un lien est unilatérale mais annoncée. En dormance, son débit baisse. La distance et le niveau du hub déterminent portée, coût et capacité.

# Événements, Voiles et difficulté

Les événements sont hostiles, positifs, ambigus, sociaux, écologiques, logistiques ou culturels. Ils peuvent produire des effets ponctuels ou durables.

Les **Nœuds de crise** constituent de vraies difficultés : ils peuvent bloquer une branche, une amélioration ou un accès jusqu’à observation, essais et maîtrise. Ils ne bloquent jamais tout le compte. Chaque tentative apporte une information.

Les zones d’ombre sont des phénomènes mobiles indépendants, comparables à des masses nuageuses, des cycles jour/nuit ou des courants. Le nom **Voile** reste à valider. Leur effet dépend du terrain, de la saison et des affinités.

Le PvP éventuel est volontaire, instancié, sans pillage ni conséquence durable et reste hors du premier prototype.

# Comptes et collectif

Un compte joueur peut disposer d’une incarnation principale et d’une seule incarnation secondaire. Les ressources sont séparées et une personne ne dispose que d’une voix dans une décision collective. Les règles anti-abus restent à préciser avant mise en oeuvre.

Les cités collaboratives, nommées provisoirement **Confluences**, réunissent plusieurs joueurs sans fusionner leurs corps-cités. Elles peuvent être spécialisées et accueillir services, projets, votes structurés, quêtes et instances. Elles ne doivent pas devenir obligatoires pour progresser.

# Symbiose

La v0.7 simplifie fortement le système. Une symbiose est une coopération **temporaire** pour :

- créer ou améliorer quelque chose dans le cadre normal du jeu ;
- ouvrir ou accomplir une instance commune particulière.

Elle prend fin à l’objectif, à la durée prévue, à la sortie d’un participant ou à la clôture de l’instance. Elle ne crée ni compte, ni organe commun permanent, ni NPC appartenant aux joueurs, ni dépendance durable.

# Accessibilité et éthique

- aucune punition liée à l’absence ;
- aucune sociabilité libre obligatoire ;
- interface calme et mobile ;
- réglages individualisés pour les besoins dys ;
- règles explicites, reprise claire et sessions courtes ;
- choix de langue, pronoms et grammaire ;
- pas de micro-paiement prédateur, FOMO ou classement humiliant.

# Prototype algorithmique

Le prototype doit pouvoir être simulé sans graphisme complexe avec :

- une carte générale ;
- une vue intérieure fixe ;
- quelques ressources ;
- trois ou quatre transformations maximum ;
- un Hub ou lien NPC ;
- un Écho ;
- un Nœud de crise ;
- une dormance simulée ;
- une Trace persistante.

Le terrain du prototype est hexagonal. Les symbioses ne sont pas nécessaires au premier test, mais leur place doit être représentée dans les futures cartes d’interaction.

# Étape suivante

Le propriétaire du projet relit le classeur et utilise les colonnes **Validation utilisateur**, **Décision finale / commentaire** et **Priorité**. Une fois les arbitrages effectués, la prochaine livraison doit contenir :

- les arbres technologiques ;
- les arbres d’évolution ;
- une matrice lisible des mécanismes ;
- les prérequis, sorties, blocages et boucles entre systèmes.

# Décisions à arbitrer en priorité

- **DEC-010 - Échos locaux** (Décision provisoire, Haute, Prototype) : Des pseudo-fractures locales adaptées au style du joueur peuvent apparaître dans son territoire.
- **DEC-012 - Directeur adaptatif** (Décision provisoire, Haute, Après MVP) : Le monde observe les stratégies dominantes et varie progressivement ses réponses sans tricher.
- **DEC-019 - Fantasy d’adaptation** (Décision provisoire, Haute, Vision) : Avelune est un monde féerique, ésotérique et post-effondrement qui refuse d’être figé.
- **DEC-020 - Fêlure et Marées** (Décision provisoire, Haute, Vision) : La Fêlure libère des Marées de Possibles; l’enjeu est d’apprendre à vivre avec la transformation.
- **DEC-025 - Culture intégrée au gameplay** (Décision provisoire, Moyenne, Après MVP) : Les créations culturelles peuvent faciliter une négociation, conserver une mémoire ou transformer un lieu.
- **DEC-031 - Modèle du corps-cité** (Décision provisoire, Critique, Prototype) : Hypothèse majeure : l’avatar est lui-même une cité vivante abritant un écosystème intérieur.
- **DEC-032 - Économie biologique interne** (Décision provisoire, Haute, Prototype) : Les métiers et industries deviennent des cycles, organes, chambres, symbiotes et flux intérieurs non réalistes et non horrifiques.
- **DEC-033 - Liens biologiques entre individus** (Décision provisoire, Haute, Prototype) : Les routes commerciales et coopérations prennent la forme de filaments, courants ou symbioses entre corps-cités.
- **DEC-034 - Zone d’influence non exclusive** (Décision provisoire, Haute, Prototype) : Chaque avatar influence et protège un rayon autour de lui; les zones peuvent se chevaucher sans propriété exclusive.
- **DEC-035 - Bourgeonnement cellulaire** (Décision provisoire, Haute, MVP) : La croissance du monde peut créer de nouvelles cellules, cités ou territoires à partir des structures existantes.
- **DEC-036 - Fusion consentie** (Décision provisoire, Moyenne, Après MVP) : Une cité peut fusionner partiellement avec une présence NPC ou former une symbiose réversible avec un autre joueur.
- **DEC-040 - Vocabulaire du vivant** (Décision provisoire, Moyenne, MVP) : Les organisations prennent des formes comme Récif, Essaim, Banc, Colonie, Mycélium ou Symbiose.
- **DEC-046 - Entrelacs de 2 à 4 joueurs** (Décision provisoire, Moyenne, Après MVP) : Des liens privilégiés non obligatoirement romantiques permettent refuge, continuité consentie et histoires partagées.
- **DEC-059 - Paliers de résolution 70/20/10** (Décision provisoire, Haute, MVP) : Le besoin de base reste atteignable avec une participation raisonnable; la mobilisation améliore le résultat sans bloquer.
- **DEC-071 - Documentation dans le dépôt** (Décision provisoire, Haute, Vision) : Le dossier docs versionné constitue la source principale; le wiki est une vue ou un outil d’édition synchronisé.
- **DEC-073 - Journal d’événements immuable** (Décision provisoire, Critique, Prototype) : Les changements significatifs sont enregistrés comme Traces anonymes du terrain; des instantanés accélèrent le chargement.
- **DEC-076 - Monde extensible par cellules** (Décision provisoire, Haute, MVP) : La carte grandit par bourgeonnement de cellules plutôt que par saturation ou compétition foncière.
- **DEC-077 - Une incarnation secondaire autorisée** (Décision provisoire, Haute, MVP) : Un compte joueur peut posséder une incarnation principale et une seule incarnation secondaire officiellement rattachée.
- **DEC-078 - Limiter les abus de la seconde incarnation** (Décision provisoire, Critique, MVP) : Une seule voix par personne, aucune validation mutuelle, aucun affrontement entre ses incarnations et aucun transfert direct de ressources.
- **DEC-082 - Interaction des écotones** (Décision provisoire, Haute, MVP) : Le chevauchement de zones peut créer synergies, tensions ou transformations du terrain, sans sabotage direct.
- **DEC-083 - Ancrage et incarnation mobile** (Décision provisoire, Critique, Prototype) : Le corps-cité possède un ancrage persistant tandis qu’une incarnation peut explorer et participer aux instances.
- **DEC-084 - Migration très lente de l’ancrage** (Décision provisoire, Haute, MVP) : Le déplacement complet du corps-cité est possible comme projet long, sans mobilité tactique rapide.
- **DEC-098 - Époques à plusieurs échelles** (Décision provisoire, Haute, MVP) : Une Époque peut concerner le monde entier, une région, une Confluence, un groupe de participants ou un joueur.
- **DEC-101 - Quatre transformations au prototype** (Décision provisoire, Haute, Prototype) : Le prototype limite les chaînes à quatre transformations; cinq ou six restent à évaluer pour les spécialisations avancées.
- **DEC-106 - Confluence comme nom des cités collaboratives** (Décision provisoire, Moyenne, MVP) : Nom de travail pour des lieux collectifs spécialisés, accessibles à plusieurs corps-cités sans fusion.
- **DEC-107 - Confluences spécialisées et non fusionnables** (Décision provisoire, Haute, MVP) : Chaque cité collaborative possède une spécialité et peut coopérer avec d’autres sans fusion institutionnelle.
- **DEC-108 - Activités des cités collaboratives** (Décision provisoire, Haute, MVP) : Elles peuvent accueillir projets, décisions structurées, quêtes, services et petites instances.
- **DEC-112 - Voiles ambigus** (Décision provisoire, Haute, Prototype) : Nom de travail : les Voiles peuvent être favorables, défavorables ou ambigus selon le corps-cité et le contexte.
- **DEC-115 - Finalités limitées** (Décision provisoire, Haute, MVP) : Une symbiose sert uniquement à créer ou améliorer quelque chose dans le cadre normal du jeu, ou à ouvrir une instance commune particulière.

# Registre complet des décisions

## Accessibilité

- **DEC-051 - Réglages dys individualisés** - *Décision définitive / Critique / MVP* : Police, taille, espacement, largeur, fond, contraste, structure et lecture audio sont réglables séparément.
- **DEC-052 - Neurodiversité dès la conception** - *Décision définitive / Critique / Prototype* : Reprise claire, tâches courtes, règles explicites, limitation des interruptions et complexité progressive sont natives.

## Collectif

- **DEC-106 - Confluence comme nom des cités collaboratives** - *Décision provisoire / Moyenne / MVP* : Nom de travail pour des lieux collectifs spécialisés, accessibles à plusieurs corps-cités sans fusion.
- **DEC-107 - Confluences spécialisées et non fusionnables** - *Décision provisoire / Haute / MVP* : Chaque cité collaborative possède une spécialité et peut coopérer avec d’autres sans fusion institutionnelle.
- **DEC-108 - Activités des cités collaboratives** - *Décision provisoire / Haute / MVP* : Elles peuvent accueillir projets, décisions structurées, quêtes, services et petites instances.

## Combat

- **DEC-007 - Tower defense contre le monde** - *Décision définitive / Critique / Prototype* : La défense vise des phénomènes du jeu; les vagues peuvent être combattues, canalisées, accueillies ou transcendées.

## Commerce

- **DEC-029 - Routes commerciales automatiques** - *Décision définitive / Haute / Prototype* : Le joueur déclare les ressources échangeables et les quantités; le réseau exécute automatiquement les échanges.
- **DEC-102 - Hub racinaire à règles publiées** - *Décision définitive / Critique / Prototype* : Le joueur publie ce qu’il offre, recherche, réserve et accepte dans un hub aux ports limités.
- **DEC-103 - Connexion compatible sans seconde validation** - *Décision définitive / Haute / Prototype* : Un partenaire peut établir un échange conforme aux règles déjà publiées, sans validation bilatérale à chaque fois.
- **DEC-104 - Ports, débit, réserve, portée et distance** - *Décision définitive / Critique / Prototype* : Le niveau du hub limite le nombre de liens, les débits, les réserves protégées et la portée géographique.
- **DEC-105 - Rupture unilatérale avec alerte** - *Décision définitive / Haute / Prototype* : Chaque partenaire peut couper un lien; l’autre reçoit une alerte et des propositions de remplacement.

## Communication

- **DEC-042 - Aucun espace libre au lancement** - *Décision définitive / Critique / MVP* : Pas de forum, chat, message privé, commentaire ou galerie publique libre dans le périmètre initial.
- **DEC-043 - Propositions structurées** - *Décision définitive / Critique / Prototype* : La communication passe par observations, besoins, propositions, contre-propositions, coûts, durées et choix prédéfinis.
- **DEC-066 - Interaction par courriel** - *Décision reportée / Basse / Long terme* : La gestion du jeu par courriel est conservée comme idée mais retirée du périmètre initial.

## Comptes

- **DEC-077 - Une incarnation secondaire autorisée** - *Décision provisoire / Haute / MVP* : Un compte joueur peut posséder une incarnation principale et une seule incarnation secondaire officiellement rattachée.
- **DEC-078 - Limiter les abus de la seconde incarnation** - *Décision provisoire / Critique / MVP* : Une seule voix par personne, aucune validation mutuelle, aucun affrontement entre ses incarnations et aucun transfert direct de ressources.

## Conception

- **DEC-121 - Cartographier les interactions avant le code** - *Décision définitive / Critique / Prototype* : Les arbres technologiques, arbres d’évolution et interactions de mécanismes doivent être représentés lisiblement avant le prototype logiciel.

## Coopération

- **DEC-003 - Entraide structurelle** - *Décision définitive / Critique / Prototype* : Toute contribution aide le monde; l’entraide est intégrée aux systèmes sans imposer une sociabilité constante.

## Croissance

- **DEC-035 - Bourgeonnement cellulaire** - *Décision provisoire / Haute / MVP* : La croissance du monde peut créer de nouvelles cellules, cités ou territoires à partir des structures existantes.
- **DEC-036 - Fusion consentie** - *Décision provisoire / Moyenne / Après MVP* : Une cité peut fusionner partiellement avec une présence NPC ou former une symbiose réversible avec un autre joueur.

## Création

- **DEC-109 - Création encadrée de petites quêtes** - *Décision reportée / Moyenne / Après MVP* : Les créateurs peuvent proposer textes, objectifs et ambiances dans des modèles imposant durée, difficulté et récompenses.
- **DEC-110 - Récompenses plafonnées par le système** - *Décision définitive / Haute / Après MVP* : Les créateurs de contenu ne fixent pas librement les gains ni les conséquences durables.

## Culture

- **DEC-024 - Les mots comme création** - *Décision définitive / Haute / Après MVP* : Les joueurs créatifs peuvent proposer noms, lexiques, fragments, chroniques et interprétations aux autres.
- **DEC-025 - Culture intégrée au gameplay** - *Décision provisoire / Moyenne / Après MVP* : Les créations culturelles peuvent faciliter une négociation, conserver une mémoire ou transformer un lieu.

## Difficulté

- **DEC-087 - Nœuds de crise semi-bloquants** - *Décision définitive / Critique / Prototype* : Certaines difficultés bloquent une branche d’évolution jusqu’à observation, essais et maîtrise, mais jamais tout le compte.
- **DEC-088 - Échec informatif** - *Décision définitive / Critique / Prototype* : Un essai infructueux apporte une information, élimine une hypothèse ou améliore une tentative future.

## Documentation

- **DEC-071 - Documentation dans le dépôt** - *Décision provisoire / Haute / Vision* : Le dossier docs versionné constitue la source principale; le wiki est une vue ou un outil d’édition synchronisé.
- **DEC-072 - Wiki du monde** - *Décision définitive / Haute / MVP* : Les actions et découvertes alimentent automatiquement une encyclopédie historique du monde.

## Données réelles

- **DEC-060 - Météo réelle comme graine** - *Décision définitive / Haute / Prototype* : Des données météorologiques mondiales alimentent les tendances sans décider seules de la difficulté.
- **DEC-061 - Météo marine** - *Décision définitive / Moyenne / Prototype* : Hauteur, période et direction des vagues marines peuvent influencer les Marées d’Avelune.
- **DEC-062 - Multi-source planétaire** - *Décision définitive / Haute / MVP* : Plusieurs points et familles de données limitent le biais d’une seule région ou d’un seul phénomène.
- **DEC-063 - Cache et repli interne** - *Décision définitive / Critique / Prototype* : Les données brutes et graines sont conservées; une panne externe ne bloque jamais le jeu.
- **DEC-064 - Aucune géolocalisation joueur** - *Décision définitive / Critique / Prototype* : Les sources utilisent des points fixes publics; la météo personnelle du joueur n’est pas nécessaire.

## Dormance

- **DEC-091 - Maintien minimal des liens** - *Décision définitive / Critique / Prototype* : La dormance conserve seulement les fonctions vitales et les échanges déjà demandés, dans les limites publiées.
- **DEC-092 - Progression quasi nulle en inactivité** - *Décision définitive / Critique / Prototype* : Un compte dormant ne gagne pas, ou très peu, de progression, recherche et collection.

## Déplacement

- **DEC-083 - Ancrage et incarnation mobile** - *Décision provisoire / Critique / Prototype* : Le corps-cité possède un ancrage persistant tandis qu’une incarnation peut explorer et participer aux instances.
- **DEC-084 - Migration très lente de l’ancrage** - *Décision provisoire / Haute / MVP* : Le déplacement complet du corps-cité est possible comme projet long, sans mobilité tactique rapide.

## Engagement

- **DEC-006 - Collection sans prédation** - *Décision définitive / Critique / MVP* : La collection soutient le retour au jeu sans microtransaction aléatoire, FOMO ou punition d’absence.
- **DEC-055 - Aucune punition d’absence** - *Décision définitive / Critique / Prototype* : Pas de série perdue, destruction nocturne, culpabilisation ou fenêtre obligatoire.

## Expérience

- **DEC-005 - Gestion, bac à sable, chill mais intense** - *Décision définitive / Haute / MVP* : Le jeu permet des sessions calmes ou engagées, avec profondeur de gestion et événements intenses.

## Formes

- **DEC-086 - Affinités sans verrouillage** - *Décision définitive / Haute / Prototype* : Les formes animales et affinités modifient les facilités d’interaction sans interdire définitivement une activité.

## Genre

- **DEC-054 - Pas de genre imposé** - *Décision définitive / Haute / MVP* : Joueurs, avatars, habitants et créatures ne sont pas genrés par défaut.

## Gouvernance

- **DEC-044 - Vote sur propositions** - *Décision définitive / Haute / MVP* : Un joueur peut proposer ou contre-proposer; les votes sont bornés dans le temps et le silence vaut abstention.
- **DEC-045 - Souveraineté du domaine** - *Décision définitive / Critique / MVP* : Un groupe ne peut pas modifier le domaine, les ressources ou la spécialisation d’un joueur sans consentement.

## Identité

- **DEC-022 - Forme expressive non déterministe** - *Décision définitive / Critique / MVP* : La forme animale participe à l’identification personnelle et aux perceptions sans imposer métier, personnalité ou valeur sociale.

## Instances

- **DEC-047 - Éclats courts** - *Décision définitive / Haute / Prototype* : Le jeu propose de petites instances rapides de route, atelier, fêlure, infiltration, veillée ou action collective asynchrone.
- **DEC-048 - Alternative non réflexe** - *Décision définitive / Critique / Prototype* : Chaque mini-jeu d’action doit proposer une option tactique, pause ou résolution accessible.

## Interface

- **DEC-049 - Deux niveaux d’affichage** - *Décision définitive / Critique / MVP* : Un mode Monde visuel et un mode Calme sobre présentent le même jeu avec des stimulations différentes.
- **DEC-050 - Mobile en priorité** - *Décision définitive / Critique / MVP* : Toutes les actions de maintien courant doivent être simples sur téléphone.
- **DEC-089 - Carte générale et vue intérieure fixe** - *Décision définitive / Critique / Prototype* : Le prototype emploie une carte générale cliquable et une vue fixe interne du corps-cité, inspirée des interfaces anciennes de RPG.

## Langue

- **DEC-053 - Grammaire au choix** - *Décision définitive / Haute / MVP* : Le joueur choisit langue, forme d’adresse et grammaire traditionnelle, inclusive ou neutre.

## Modes

- **DEC-030 - Cité indépendante ou collaborative** - *Décision définitive / Critique / Prototype* : Un joueur peut gérer seul sa cité ou ouvrir certaines fonctions à la collaboration, sans plafond de progression solo.

## Modération

- **DEC-067 - Création libre publique** - *Décision reportée / Moyenne / Après MVP* : Les contenus libres publics nécessitant une modération sont reportés; les premières créations restent encadrées ou privées.

## NPC

- **DEC-037 - Présences non-joueuses permanentes** - *Décision définitive / Critique / Prototype* : Des cités et communautés NPC assurent les rôles manquants, le commerce solo et la vie du monde dès 2 à 3 joueurs.
- **DEC-093 - Écosystèmes NPC évolutifs** - *Décision définitive / Haute / MVP* : Les cités et écosystèmes NPC suivent lentement leurs propres orientations au lieu de rester figés.

## Narration

- **DEC-097 - Époques comme chapitres** - *Décision définitive / Critique / MVP* : Le monde avance par Époques ou chapitres qui structurent l’histoire persistante.
- **DEC-098 - Époques à plusieurs échelles** - *Décision provisoire / Haute / MVP* : Une Époque peut concerner le monde entier, une région, une Confluence, un groupe de participants ou un joueur.
- **DEC-099 - Nouvelle direction à la fin d’un chapitre** - *Décision définitive / Haute / MVP* : La clôture d’une Époque peut ouvrir plusieurs orientations pour le chapitre suivant.

## Outils

- **DEC-068 - Dépôt GitHub actuel** - *Décision définitive / Haute / Vision* : Le dépôt courant est le compte/projet « Avelune-Officiel ».
- **DEC-069 - Forgejo futur** - *Décision définitive / Moyenne / Après MVP* : Forgejo sera déployé séparément puis synchronisé avec GitHub.
- **DEC-070 - Formats ouverts** - *Décision définitive / Haute / Vision* : Markdown, CSV, JSON, YAML, ODS/XLSX d’échange, SVG et PNG évitent l’enfermement propriétaire.

## Participatif

- **DEC-065 - Calcul distribué** - *Décision reportée / Basse / Long terme* : L’utilisation de puissance de calcul pour une cause est sortie du périmètre initial.

## Persistance

- **DEC-073 - Journal d’événements immuable** - *Décision provisoire / Critique / Prototype* : Les changements significatifs sont enregistrés comme Traces anonymes du terrain; des instantanés accélèrent le chargement.
- **DEC-074 - Pas de remise à zéro globale** - *Décision définitive / Critique / MVP* : Le monde évolue par époques et transformations tout en conservant les territoires, archives et conséquences.
- **DEC-075 - Mémoire à plusieurs échelles** - *Décision définitive / Critique / Prototype* : État intérieur, liens, régions, monde et connaissance collective persistent séparément.
- **DEC-076 - Monde extensible par cellules** - *Décision provisoire / Haute / MVP* : La carte grandit par bourgeonnement de cellules plutôt que par saturation ou compétition foncière.
- **DEC-090 - Traces non nominatives** - *Décision définitive / Critique / Prototype* : Les actions laissent des transformations naturelles du terrain sans signature publique du joueur à l’origine.

## Personnage

- **DEC-031 - Modèle du corps-cité** - *Décision provisoire / Critique / Prototype* : Hypothèse majeure : l’avatar est lui-même une cité vivante abritant un écosystème intérieur.
- **DEC-032 - Économie biologique interne** - *Décision provisoire / Haute / Prototype* : Les métiers et industries deviennent des cycles, organes, chambres, symbiotes et flux intérieurs non réalistes et non horrifiques.
- **DEC-033 - Liens biologiques entre individus** - *Décision provisoire / Haute / Prototype* : Les routes commerciales et coopérations prennent la forme de filaments, courants ou symbioses entre corps-cités.

## Pilotage

- **DEC-119 - Sélection critique des idées** - *Décision définitive / Critique / Vision* : Toute nouvelle proposition doit être classée : retenir, simplifier, reporter ou écarter selon sa valeur et son coût.
- **DEC-120 - Revue utilisateur avant les arbres** - *Décision définitive / Critique / Vision* : Le propriétaire du projet valide, invalide ou modifie les décisions du classeur avant la création des arbres technologiques et d’évolution.

## Progression

- **DEC-004 - Faible importance du niveau** - *Décision définitive / Critique / Prototype* : L’ancienneté donne davantage d’options et d’automatisation mais ne rend jamais les nouveaux inutiles.
- **DEC-016 - Reconversion souple** - *Décision définitive / Haute / MVP* : Changer de spécialité conserve les acquis transversaux; la transition prend du temps mais ne remet pas à zéro.
- **DEC-017 - Plusieurs voies de réussite** - *Décision définitive / Haute / MVP* : Productivité, résilience, beauté, hospitalité, culture, savoir, exploration et biodiversité sont des accomplissements valides.

## PvP

- **DEC-079 - PvP volontaire et instancié** - *Décision reportée / Moyenne / Après MVP* : Le moteur peut accueillir plus tard des épreuves PvP volontaires, sans pillage, perte durable ni avantage indispensable.

## RPG

- **DEC-014 - Plusieurs rôles complémentaires** - *Décision définitive / Haute / Prototype* : Protection, soin, action, contrôle, logistique, exploration, médiation, art et passe-brèche sont utiles.
- **DEC-015 - Passe-brèche** - *Décision définitive / Moyenne / MVP* : Le rôle de roublard devient spécialiste d’infiltration, récupération, chemins temporaires et prise de risque contrôlée.

## Relations

- **DEC-046 - Entrelacs de 2 à 4 joueurs** - *Décision provisoire / Moyenne / Après MVP* : Des liens privilégiés non obligatoirement romantiques permettent refuge, continuité consentie et histoires partagées.

## Reprise

- **DEC-056 - Dormance protectrice** - *Décision définitive / Critique / Prototype* : Une cité inactive maintient seulement ses fonctions vitales et les échanges déjà autorisés; sa progression active s’arrête presque complètement.

## Résolution

- **DEC-013 - Victoires graduées** - *Décision définitive / Critique / Prototype* : Les résultats vont de la stabilisation à la transcendance; un échec tactique crée une suite jouable et peu de pertes.

## Social

- **DEC-038 - Appartenance facultative** - *Décision définitive / Critique / MVP* : On peut fonctionner sans groupe; aucune organisation ne bloque les contenus ou la progression.
- **DEC-039 - Plusieurs appartenances limitées** - *Décision définitive / Haute / MVP* : Un joueur peut appartenir à plusieurs structures, avec une limite pour préserver la lisibilité et l’engagement.
- **DEC-040 - Vocabulaire du vivant** - *Décision provisoire / Moyenne / MVP* : Les organisations prennent des formes comme Récif, Essaim, Banc, Colonie, Mycélium ou Symbiose.
- **DEC-041 - Aucun chef joueur permanent** - *Décision définitive / Critique / MVP* : Le rôle central éventuel est tenu par le système ou un personnage non-joueur; les joueurs restent souverains.

## Symbiose

- **DEC-094 - Aucune création automatique de compte** - *Décision définitive / Critique / MVP* : Une symbiose ne crée jamais automatiquement un compte joueur, une seconde incarnation ou une fusion de comptes.
- **DEC-095 - Organe commun réversible** - *Proposition écartée / Basse / Long terme* : Hypothèse v0.6 écartée en v0.7 : ne pas créer d’organe commun permanent ni de propriété partagée durable par symbiose.
- **DEC-096 - Écosystème NPC issu d’une symbiose** - *Décision reportée / Basse / Long terme* : Idée conservée uniquement comme possibilité narrative lointaine; aucune entité NPC appartenant aux joueurs ne sera créée par le système courant.
- **DEC-114 - Symbiose temporaire** - *Décision définitive / Critique / MVP* : La symbiose est une coopération limitée dans le temps; elle ne crée pas de lien, compte ou entité commune permanente.
- **DEC-115 - Finalités limitées** - *Décision provisoire / Haute / MVP* : Une symbiose sert uniquement à créer ou améliorer quelque chose dans le cadre normal du jeu, ou à ouvrir une instance commune particulière.
- **DEC-116 - Fin explicite** - *Décision définitive / Critique / MVP* : La symbiose prend fin à l’objectif, à la durée prévue, à la sortie d’un participant ou à la clôture de l’instance.
- **DEC-117 - Aucun actif symbiotique durable** - *Décision définitive / Critique / MVP* : Le projet peut produire une récompense normale, mais pas un organe partagé permanent, une dépendance persistante ou un NPC appartenant aux joueurs.
- **DEC-118 - Système optionnel** - *Décision définitive / Haute / MVP* : La symbiose améliore certaines possibilités mais n’est pas nécessaire à la progression principale.

## Terrain

- **DEC-080 - Monde en cellules hexagonales** - *Décision définitive / Critique / Prototype* : Le monde est divisé en hexagones écologiques possédant six voisinages équivalents et des propriétés de terrain.
- **DEC-081 - Écotone autour du corps-cité** - *Décision définitive / Critique / Prototype* : Chaque corps-cité influence une zone non exclusive autour de son ancrage.
- **DEC-082 - Interaction des écotones** - *Décision provisoire / Haute / MVP* : Le chevauchement de zones peut créer synergies, tensions ou transformations du terrain, sans sabotage direct.
- **DEC-085 - Zones favorables, difficiles et saisonnières** - *Décision définitive / Haute / Prototype* : Les secteurs peuvent être propices ou défavorables selon leurs propriétés, les saisons et les phénomènes mobiles.
- **DEC-113 - Carte hexagonale** - *Décision définitive / Critique / Prototype* : Les cellules du monde sont des hexagones : six voisinages équivalents, propagation et distances plus naturelles.

## Territoire

- **DEC-034 - Zone d’influence non exclusive** - *Décision provisoire / Haute / Prototype* : Chaque avatar influence et protège un rayon autour de lui; les zones peuvent se chevaucher sans propriété exclusive.

## Ton

- **DEC-023 - Poésie, cute et féerie** - *Décision définitive / Haute / Vision* : Le jeu inclut du positif, de la douceur, du merveilleux et une profondeur littéraire.

## Tycoon

- **DEC-026 - Le tycoon est un pilier** - *Décision définitive / Critique / Prototype* : La gestion de flux, services, habitants, production, transports et adaptation est égale au RPG et aux événements collectifs.
- **DEC-027 - Automatisation à la Factorio** - *Décision définitive / Haute / Prototype* : Les chaînes répétitives peuvent être automatisées; les événements nouveaux exigent à nouveau des choix humains.
- **DEC-028 - Transports à la Transport Tycoon** - *Décision définitive / Haute / MVP* : Les réseaux ont capacité, fréquence, priorité, redondance et résilience.
- **DEC-100 - Chaînes courtes et lisibles** - *Décision définitive / Critique / Prototype* : Les chaînes de production doivent rester visibles et compréhensibles sur un seul écran.
- **DEC-101 - Quatre transformations au prototype** - *Décision provisoire / Haute / Prototype* : Le prototype limite les chaînes à quatre transformations; cinq ou six restent à évaluer pour les spécialisations avancées.

## Univers

- **DEC-018 - Nom du jeu** - *Décision définitive / Haute / Vision* : Le titre retenu est « Les Lisières d’Avelune ».
- **DEC-019 - Fantasy d’adaptation** - *Décision provisoire / Haute / Vision* : Avelune est un monde féerique, ésotérique et post-effondrement qui refuse d’être figé.
- **DEC-020 - Fêlure et Marées** - *Décision provisoire / Haute / Vision* : La Fêlure libère des Marées de Possibles; l’enjeu est d’apprendre à vivre avec la transformation.
- **DEC-021 - Animaux humanoïdes** - *Décision définitive / Haute / MVP* : Les personnages peuvent prendre des formes animales humanoïdes ou hybrides.

## Vision

- **DEC-001 - Jeu sur navigateur** - *Décision définitive / Critique / MVP* : Le jeu est accessible depuis un navigateur et pensé dès le départ pour le téléphone.

## Échelle

- **DEC-057 - De 2 à plusieurs centaines** - *Décision définitive / Critique / Prototype* : La dynamique s’adapte de 2–3 joueurs à des centaines d’inscrits et actifs.
- **DEC-058 - Capacité active raisonnable** - *Décision définitive / Critique / MVP* : Les événements globaux sont calibrés sur la capacité probable des joueurs actifs, pas sur le nombre de comptes.
- **DEC-059 - Paliers de résolution 70/20/10** - *Décision provisoire / Haute / MVP* : Le besoin de base reste atteignable avec une participation raisonnable; la mobilisation améliore le résultat sans bloquer.

## Éthique

- **DEC-002 - Aucun conflit imposé entre joueurs** - *Décision définitive / Critique / MVP* : Le monde principal interdit pillage, attaque de territoire et confrontation forcée; un PvP volontaire pourra être étudié séparément.

## Événements

- **DEC-008 - Diversité des vagues** - *Décision définitive / Critique / Prototype* : Les vagues peuvent être hostiles, positives, ambiguës, environnementales, sociales, culturelles ou logistiques.
- **DEC-009 - Effets ponctuels ou persistants** - *Décision définitive / Haute / Prototype* : Un événement peut modifier temporairement ou durablement un territoire, un réseau, une région ou le monde.
- **DEC-010 - Échos locaux** - *Décision provisoire / Haute / Prototype* : Des pseudo-fractures locales adaptées au style du joueur peuvent apparaître dans son territoire.
- **DEC-011 - Événements positifs** - *Décision définitive / Haute / Prototype* : Les phénomènes favorables, féeriques, fertiles ou culturels sont aussi importants que les menaces.
- **DEC-012 - Directeur adaptatif** - *Décision provisoire / Haute / Après MVP* : Le monde observe les stratégies dominantes et varie progressivement ses réponses sans tricher.
- **DEC-111 - Zones d’ombre mobiles** - *Décision définitive / Critique / Prototype* : Les zones d’ombre sont des phénomènes indépendants qui circulent comme des nuages, le jour, la nuit ou des courants.
- **DEC-112 - Voiles ambigus** - *Décision provisoire / Haute / Prototype* : Nom de travail : les Voiles peuvent être favorables, défavorables ou ambigus selon le corps-cité et le contexte.

# Questions ouvertes

- **Q-001 - Concept** (Critique) : Le corps-cité devient-il le concept définitif ou seulement une faction/forme jouable ? — Prochaine action : Prototype papier et maquette visuelle.
- **Q-002 - Représentation** (Critique) : Le corps-cité se déplace-t-il physiquement sur la carte ou projette-t-il un avatar mobile ? — Prochaine action : Comparer lisibilité RPG et tycoon.
- **Q-003 - Échelle intérieure** (Haute) : Voit-on des habitants individuels, des populations abstraites ou des symbiotes nommés ? — Prochaine action : Tester 3 à 5 figures nommées plus flux agrégés.
- **Q-004 - Carte** (Haute) : Comment représenter lisiblement les hexagones et les écotones sur ordinateur et téléphone ? — Prochaine action : Maquette de carte hexagonale.
- **Q-005 - Économie** (Critique) : Quelles trois ressources suffisent au premier prototype ? — Prochaine action : Matière, énergie, mémoire comme hypothèse.
- **Q-006 - Événement** (Critique) : Quel premier Écho démontre combat, adaptation et transcendance ? — Prochaine action : Concevoir un événement vertical complet.
- **Q-007 - Commerce** (Haute) : Les échanges utilisent-ils troc automatique, crédits communs ou demandes ciblées ? — Prochaine action : Tester troc par quotas sans monnaie.
- **Q-008 - NPC** (Haute) : À quel point les cités NPC évoluent-elles sans joueur ? — Prochaine action : Service minimal plus traits persistants.
- **Q-009 - Social** (Moyenne) : Combien d’organisations simultanées restent lisibles : 2, 3 ou 4 ? — Prochaine action : Test utilisateur ultérieur.
- **Q-010 - Persistance** (Moyenne) : Quelle durée réelle correspond à une époque d’Avelune ? — Prochaine action : 4 à 8 semaines comme plage initiale.
- **Q-011 - Données réelles** (Moyenne) : Quels points fixes marins et terrestres composent le Souffle du monde ? — Prochaine action : Choisir 8 à 12 points répartis globalement.
- **Q-012 - Wiki** (Haute) : Le wiki est-il diégétique dans le jeu, documentaire hors jeu, ou les deux ? — Prochaine action : Prévoir une base commune avec deux présentations.
- **Q-013 - Visuel** (Critique) : Quel degré de cute et de lisibilité évite le body horror ? — Prochaine action : Moodboard et silhouettes abstraites.
- **Q-014 - MVP** (Critique) : Quelles fonctions doivent être simulées avant tout développement graphique ? — Prochaine action : Flux, événement, adaptation, commerce automatique.
- **Q-015 - Comptes** (Haute) : À quel moment l’incarnation secondaire est-elle débloquée et quelles limites doivent être partagées ? — Prochaine action : Définir les règles anti-abus.
- **Q-016 - Carte** (Haute) : Décision prise : terrain hexagonal. Reste à fixer taille, zoom et regroupement. — Prochaine action : Voir Q-027.
- **Q-017 - Déplacement** (Haute) : Quelle vitesse réelle de migration rend la géographie importante sans enfermer le joueur ? — Prochaine action : Simuler plusieurs durées.
- **Q-018 - Crises** (Critique) : Quel premier Nœud de crise démontre observation, essais et dépassement ? — Prochaine action : Concevoir un cas de test.
- **Q-019 - Dormance** (Critique) : Après combien de temps un compte passe-t-il en dormance et quel débit minimal conserve-t-il ? — Prochaine action : Simuler 3 profils d’absence.
- **Q-020 - NPC** (Haute) : Quelles orientations lentes suffisent pour donner une vie propre aux cités NPC ? — Prochaine action : Limiter à 4 tendances pour le prototype.
- **Q-021 - Symbiose** (Critique) : Quel résultat justifie une symbiose sans créer de dépendance ou de propriété commune complexe ? — Prochaine action : À simplifier.
- **Q-022 - Époques** (Haute) : Quelles conditions clôturent un chapitre et quelle échelle doit être testée en premier ? — Prochaine action : Prototype régional.
- **Q-023 - Commerce** (Critique) : Quel nombre initial de ports, quelle portée et quel débit pour le hub racinaire ? — Prochaine action : Simulation économique.
- **Q-024 - Collectif** (Moyenne) : Le nom Confluence et ses types fonctionnels conviennent-ils ? — Prochaine action : Validation vocabulaire.
- **Q-025 - Événements** (Moyenne) : Le nom Voile convient-il aux zones d’ombre mobiles ? — Prochaine action : Validation vocabulaire.
- **Q-026 - Symbiose** (Critique) : Créer, améliorer ou instance commune : quelles récompenses sont assez utiles sans devenir obligatoires ? — Prochaine action : Définir 3 scénarios comparables.
- **Q-027 - Hexagones** (Critique) : Quelle échelle représente un hexagone et combien sont visibles à l’écran ? — Prochaine action : Maquette papier.
- **Q-028 - Arbres** (Critique) : Quelles familles doivent former les premiers arbres : intérieur, écotone, commerce, exploration ou adaptation ? — Prochaine action : Après validation du classeur.
- **Q-029 - Interactions** (Critique) : Quelles dépendances entre mécanismes sont indispensables et lesquelles doivent être supprimées ? — Prochaine action : Construire une matrice d’interactions.

# Risques

- **R-001 - Foisonnement fonctionnel** (Critique) : Trop de systèmes avant validation de la boucle centrale. Réponse : Prototype vertical limité; chaque idée est marquée Prototype/MVP/Après MVP.
- **R-002 - Abstraction du corps-cité** (Haute) : Le concept peut être difficile à comprendre ou sembler organique/horrifique. Réponse : Direction biomorphique douce, métaphores végétales et minérales, prototype visuel très tôt.
- **R-003 - Tycoon trop automatisé** (Haute) : Le joueur pourrait ne plus avoir de décisions intéressantes. Réponse : Automatiser la répétition mais créer variations, objectifs et arbitrages.
- **R-004 - Tycoon trop manuel** (Critique) : La maintenance devient un emploi et pénalise les absences. Réponse : Seuils, règles, NPC, reprise et absence de dégradation punitive.
- **R-005 - Monde vide au lancement** (Critique) : Deux joueurs ne couvrent pas les fonctions prévues pour une communauté. Réponse : NPC actifs, objectifs recalibrés et cellules préexistantes.
- **R-006 - Monde saturé à grande échelle** (Haute) : Des centaines de joueurs rendent la carte illisible. Réponse : Carte cellulaire multi-échelle, bourgeonnement et agrégation régionale.
- **R-007 - Données externes indisponibles** (Haute) : Panne, changement de licence ou modèle météo. Réponse : Cache, normalisation, sources multiples et générateur de repli déterministe.
- **R-008 - Données réelles perçues comme aléatoires parfaites** (Moyenne) : La météo est imprévisible mais pas un générateur cryptographique. Réponse : Présenter le mécanisme comme un Souffle du monde reproductible, pas comme hasard pur.
- **R-009 - Communication trop limitée** (Haute) : Les joueurs pourraient manquer de chaleur humaine sans texte libre. Réponse : Phrases empathiques, cadeaux, chroniques, réactions nuancées et liens privilégiés.
- **R-010 - Communication détournée** (Moyenne) : Les combinaisons de noms ou propositions pourraient servir au harcèlement. Réponse : Lexiques contrôlés, droits de publication, blocage et audit.
- **R-011 - Gouvernance lente** (Haute) : Trop de propositions et votes. Réponse : Périmètres privés, décisions automatiques, délais et contre-propositions limitées.
- **R-012 - Nouveaux joueurs décoratifs** (Critique) : Le niveau finit malgré tout par dominer. Réponse : Rendement décroissant, bonus de diversité et aptitude de plasticité des jeunes cités.
- **R-013 - Wiki illisible** (Moyenne) : L’accumulation automatique produit du bruit. Réponse : Entrées synthétiques, niveaux de lecture, tags et archivage par époque.
- **R-014 - Charge de modération future** (Critique) : La publication créative ouverte exige une équipe. Réponse : Pas de contenu public libre au MVP; préparation des permissions et de la provenance.
- **R-015 - Double incarnation exploitable** (Critique) : Le second personnage peut servir à voter, transférer ou contourner les limites. Réponse : Compte unique, restrictions mécaniques et ressources séparées.
- **R-016 - Terrain trop complexe** (Critique) : Trop de propriétés et d’interactions rendent la carte illisible. Réponse : Limiter les propriétés actives et afficher des couches.
- **R-017 - Blocage frustrant** (Haute) : Les Nœuds de crise peuvent immobiliser un joueur. Réponse : Bloquer une branche seulement et rendre chaque essai informatif.
- **R-018 - NPC trop autonomes** (Haute) : Le joueur peut avoir l’impression que le jeu joue seul. Réponse : Évolution lente, lisible et influençable, sans concurrence directe.
- **R-019 - Commerce opportuniste** (Haute) : Des règles ouvertes peuvent être exploitées à la limite des ratios. Réponse : Réserves, ports, plafonds, historiques et temporisation des ruptures.
- **R-020 - Symbiose administrative** (Critique) : La propriété d’un organe commun crée des litiges et dépendances. Réponse : Simplifier ou supprimer tout actif permanent partagé.
- **R-021 - Confluences obligatoires** (Haute) : Les lieux collectifs peuvent devenir des passages forcés. Réponse : Alternatives NPC et progression solo complète.
- **R-022 - Carte hexagonale sur mobile** (Haute) : Des hexagones trop petits ou nombreux nuisent à la lisibilité tactile. Réponse : Zoom, regroupement régional et panneaux plutôt que micro-clics.
- **R-023 - Symbiose sans intérêt** (Haute) : Si le gain est trop faible, le système sera ignoré; trop fort, il deviendra obligatoire. Réponse : Tester trois finalités et plafonner l’avantage.
- **R-024 - Accumulation de décisions** (Critique) : Le classeur peut devenir trop volumineux pour être relu. Réponse : Feuille d’arbitrages prioritaires, filtres et statut utilisateur.

# Sources techniques

- Open-Meteo Weather Forecast API - https://open-meteo.com/en/docs
- Open-Meteo Marine Weather API - https://open-meteo.com/en/docs/marine-weather-api
- NOAA GFS - https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast
- NOAA Tides & Currents - https://tidesandcurrents.noaa.gov/web_services_info.html
- USGS Earthquake Catalog - https://earthquake.usgs.gov/fdsnws/event/1/
