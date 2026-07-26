# Les Lisières d’Avelune
## Book de conception v0.4

Date : 2026-07-26


---

# Vision — Les Lisières d’Avelune

## Promesse

Un jeu de gestion, de rôle et de transformation collective dans lequel chaque personne développe une cité vivante, contribue à un monde persistant et choisit comment aider. Les phénomènes ne sont pas seulement détruits : ils peuvent être compris, accueillis, détournés ou transcendés.

## Trois piliers

1. **Corps-cité et tycoon organique** : construire des cycles, services, flux et automatismes à l'intérieur d'un avatar-microcosme.
2. **RPG et Éclats** : explorer, infiltrer, protéger, interpréter et vivre de petites instances satisfaisantes.
3. **Monde collectif persistant** : les actions transforment les territoires, les liens, les régions et la mémoire commune.

## Public et ton

Le jeu vise les amateurs de gestion, Factorio, Transport Tycoon, Theme Hospital, RPG, tower defense et jeux de collection, mais aussi un public littéraire, créatif et contemplatif. Le ton associe féerie, animaux humanoïdes, ésotérisme, poésie, douceur et intensité choisie.

## Principes directeurs

- aucune confrontation entre joueurs ;
- aucune punition d'absence ;
- chaque contribution compte ;
- plusieurs stratégies et qualités de réussite ;
- nouveaux joueurs durablement utiles ;
- coopération sans conversation libre obligatoire ;
- accessibilité et grammaire choisie dès la conception ;
- pas de micro-paiement prédateur ni de boucle de micro-dopamine ;
- monde transformé plutôt que consommé puis remis à zéro.


---

# Concept majeur : le personnage comme corps-cité

## Formulation

Le joueur n'incarne pas un maire placé au-dessus d'une population. Son avatar est lui-même un **microcosme vivant**. Il abrite des symbiotes, des chambres, des jardins intérieurs, des mémoires et des flux. Son développement intérieur remplit la fonction d'une ville de tycoon.

Autour de lui, sa présence crée un **écotone** : une zone d'influence et de protection non exclusive. Deux écotones peuvent se chevaucher et produire des effets complémentaires.

## Traduction des systèmes classiques

| Tycoon classique | Corps-cité |
|---|---|
| Bâtiment | Chambre, nœud, jardin, organe fictionnel |
| Ouvriers | Symbiotes, populations intérieures, esprits, fonctions |
| Matière première | Flux de matière, énergie, mémoire, attention, spores |
| Usine | Cycle de transformation |
| Entrepôt | Réserve, poche, mémoire minérale, grenier intérieur |
| Route | Filament, courant, racine ou lien biologique |
| Ville | Avatar entier |
| Territoire | Écotone autour de l'avatar |
| Défense | Réponse immunitaire, gardiens, adaptation du milieu |

La représentation doit rester féerique, végétale, minérale et abstraite. Elle ne doit pas devenir anatomique, médicale ou horrifique.

## Avantages

- réunit naturellement RPG et tycoon ;
- justifie qu'un avatar soit une communauté sans devenir un chef omnipotent ;
- transforme les routes commerciales en liens visibles entre individus ;
- donne une identité forte et originale ;
- facilite les organismes NPC pour le jeu solo ;
- permet la croissance par bourgeonnement ou symbiose ;
- donne aux formes animales une valeur identitaire et sensorielle.

## Risques

- concept abstrait à expliquer ;
- risque de body horror involontaire ;
- difficulté à représenter simultanément l'intérieur et le monde extérieur ;
- risque de perdre le sentiment de déplacement RPG.

## Variante recommandée pour le prototype

Le joueur voit deux couches :

1. **Vue intérieure** : gestion des cycles, chambres, ressources et symbiotes.
2. **Vue des Lisières** : déplacement de l'avatar, zone d'influence, liens, Échos et Marées.

Le corps-cité se déplace lentement ou projette une forme mobile dans les Éclats. Cette question reste à prototyper.


---

# Faire évoluer Avelune de façon persistante

## Principe : tout changement significatif produit une Trace

Une **Trace** est un événement enregistré : construction, transformation, découverte, nom, accord, route créée, espèce accueillie, Marée transcendée ou décision collective. Les Traces constituent l'histoire vérifiable du monde.

Techniquement, le serveur peut conserver :

- un journal append-only des Traces ;
- des instantanés réguliers de l'état courant ;
- la provenance de chaque modification ;
- les versions des règles ayant produit le résultat.

Le journal permet de reconstruire l'histoire; les instantanés évitent de recalculer toute la partie.

## Cinq couches persistantes

1. **Intérieur du corps-cité** : cycles, nœuds, réserves, symbiotes et préférences.
2. **Écotone local** : terrain, espèces, protections et transformations.
3. **Liens** : routes biologiques, quotas, partenariats et délégations.
4. **Région** : infrastructures, migrations, santé du biome et projets communs.
5. **Monde et mémoire** : état de la Fêlure, époque, encyclopédie et chroniques.

## Absence et dormance

Une cité inactive passe en dormance :

- ses règles automatiques continuent à régime réduit ;
- les NPC maintiennent les fonctions essentielles ;
- les échanges peuvent respecter un plafond défini ;
- les événements majeurs sont différés, réduits ou pris en charge par le monde ;
- les occasions temporaires peuvent disparaître, mais pas les fondations du joueur.

## Croissance cellulaire

La carte n'est pas un plateau foncier fini. Elle est composée de cellules organiques.

- Une cellule mature peut **bourgeonner** une cellule fille.
- Une cellule NPC peut accueillir un nouveau joueur ou fusionner progressivement avec une cité existante.
- Une forte population crée de nouvelles ramifications régionales au lieu d'entasser les joueurs.
- Les anciennes régions restent reliées par les Marées et la mémoire mondiale.

## Fusion

Deux formes sont distinguées :

- **intégration NPC** : absorption progressive d'une cité non-joueuse, avec conservation de ses traits et de son histoire ;
- **symbiose de joueurs** : zone et fonctions communes, explicites et réversibles, sans fusion de comptes ni perte de souveraineté.

## Époques sans remise à zéro

Une époque dure plusieurs semaines. Sa fin peut :

- transformer une règle mondiale ;
- ouvrir une nouvelle famille de cellules ;
- faire évoluer une espèce ;
- stabiliser ou aggraver une propriété de la Fêlure ;
- convertir des projets en monuments ou traditions.

Les infrastructures, collections, personnages et archives restent. Le monde avance au lieu de recommencer.

## Wiki vivant

Les Traces alimentent automatiquement :

- une chronique par territoire et par époque ;
- une encyclopédie des espèces, lieux et phénomènes ;
- l'historique des noms et de leurs auteurs ;
- des cartes de transformation ;
- des synthèses accessibles après une longue absence.

Les créations humaines sont séparées des faits automatiques et conservent leur provenance.


---

# Tycoon, Factorio et réseaux automatiques

## Le cœur de gestion

Le joueur conçoit un système intérieur capable de produire, transformer, stocker, soigner, accueillir, apprendre et s'adapter. Les décisions portent sur l'architecture et les règles, pas sur la répétition manuelle.

## Automatisation

Chaque flux peut recevoir :

- une réserve minimale ;
- une capacité maximale ;
- une priorité ;
- un seuil de déclenchement ;
- une destination de secours ;
- une règle d'arrêt en cas de pénurie.

L'automatisation exécute les routines. Les nouveaux phénomènes, variations et arbitrages demandent une intervention.

## Commerce automatique

Le joueur définit :

- les ressources échangeables ;
- les quantités maximales par période ;
- les réserves qu'il refuse d'entamer ;
- les ressources recherchées ;
- les partenaires autorisés : NPC, monde public, groupe ou Entrelacs ;
- les priorités de transport.

Les routes sélectionnent automatiquement les échanges compatibles. Il n'est pas nécessaire de négocier en direct.

## Cité indépendante

Le monde NPC fournit :

- marchés de base ;
- services manquants ;
- routes publiques ;
- missions et événements calibrés ;
- partenaires de symbiose non joueurs.

Le joueur solo peut accéder à tous les grands systèmes, avec une efficacité ou une histoire différente mais sans plafond artificiel.

## Cité collaborative

Le joueur peut ouvrir certains nœuds :

- excédents exportables ;
- capacité de soin ;
- place d'accueil ;
- relais de transport ;
- atelier spécialisé ;
- observation ou recherche.

La collaboration augmente la variété, la vitesse ou la qualité, mais n'est jamais requise pour maintenir la cité.

## Jeunes cités utiles

Les jeunes corps-cités disposent d'une forte **plasticité** :

- adaptation plus rapide à une ressource nouvelle ;
- excellente observation de phénomènes inconnus ;
- rendement élevé sur les premières contributions ;
- accès à des micro-niches que les structures anciennes ont automatisées trop rigidement.

Les cités anciennes apportent capacité, stabilité et réseau. Les jeunes apportent plasticité et découverte.


---

# Événements et données planétaires

## Le Souffle du monde

Le hasard du jeu peut être alimenté par des phénomènes terrestres réellement variables. Il ne s'agit pas d'un hasard cryptographique, mais d'un signal extérieur, reproductible et transparent.

## Sources proposées

- météo atmosphérique mondiale ;
- météo marine : hauteur, période et direction des vagues ;
- marées et niveaux d'eau ;
- plus tard, activité solaire ou sismique sous forme abstraite et respectueuse.

## Méthode

1. Choisir 8 à 12 points fixes répartis sur les océans et continents.
2. Récupérer les données à une heure UTC fixe.
3. Normaliser chaque variable par rapport à sa plage attendue.
4. Conserver le jeu de données brut, la source et l'heure.
5. Calculer une empreinte déterministe.
6. Combiner cette empreinte avec l'état d'Avelune, la capacité active et les préférences locales.
7. Générer les familles d'événements, jamais une difficulté brute incontrôlée.

## Préférences

Le joueur règle des axes simples : contemplatif/intense, gestion/aventure, autonome/collectif, prévisible/surprenant. Son corps-cité possède aussi des affinités choisies.

Un événement hors préférence reste possible, mais comporte toujours une voie de résolution compatible, une délégation ou une issue moindre non punitive.

## Événements globaux

La difficulté utilise la capacité active probable :

- objectif de base atteignable sans mobilisation totale ;
- paliers supplémentaires pour une meilleure stabilisation ;
- transcendance exceptionnelle si la communauté dépasse les attentes ;
- sous-objectifs indépendants pour éviter un blocage unique.

## Résilience technique

- cache local des réponses ;
- dernier jeu de données valide ;
- source secondaire ;
- graine interne déterministe de repli ;
- aucune dépendance à la localisation du joueur.


---

# Social, groupes et communication

## Aucune communication libre au lancement

Le périmètre initial exclut forum, chat, messages privés, commentaires et galerie publique. La communication est une mécanique structurée.

## Proposition humaine structurée

Une proposition contient : observation, impact, besoin, solution, coût, durée et réversibilité. Le jeu transforme les champs en texte lisible.

Réponses possibles : soutenir, demander une estimation, proposer un essai plus court, contre-proposer un paramètre, s'abstenir, contribuer sans voter.

## Organisations du vivant

- **Récif** : autonomie et biens communs.
- **Essaim** : petites contributions rapides.
- **Banc** : coordination temporaire et mobilité.
- **Colonie** : production et automatisation.
- **Mycélium** : connaissance, culture et transmission.
- **Symbiose** : petit groupe complémentaire.

Il n'existe pas de chef joueur permanent. Une figure système ou NPC applique les règles, clôt les votes et maintient le service minimal.

## Liberté d'appartenance

- rejoindre un groupe est facultatif ;
- plusieurs appartenances sont possibles mais limitées ;
- chaque joueur reste maître de son corps-cité et de ses ressources ;
- quitter ou déménager conserve l'identité, les collections et les acquis personnels ;
- les contenus fondamentaux restent accessibles en solo.

## Entrelacs

Lien privilégié de deux à quatre joueurs, non nécessairement romantique. Il peut offrir refuge commun, continuité autorisée pendant une absence, collections et récits partagés. Il ne doit jamais procurer un plafond de puissance inaccessible aux joueurs seuls.


---

# Accessibilité et éthique

## TDAH

- action courte immédiatement identifiable ;
- une tâche épinglée ;
- reprise après interruption ;
- récompenses intermédiaires ;
- sessions choisies ;
- absence de série punitive.

## TSA

- règles explicites ;
- interface prévisible ;
- contrôle des animations et sons ;
- détails disponibles sans obligation ;
- coopération asynchrone et sans conversation libre.

## Dys

Il n'existe pas un mode dys unique. Les réglages sont séparés : police, taille, espacement, largeur, interlignage, fond, contraste, alignement, lecture audio, résumé et vocabulaire simplifié.

## LGBTQIA+

- langue, pronoms et accords choisis ;
- grammaire traditionnelle, inclusive ou neutre ;
- absence de genre par défaut ;
- formes, voix et identités non liées aux statistiques ;
- Entrelacs non normatif.

## Éthique de l'engagement

- pas de micro-paiement prédateur ;
- pas de loot box payante ;
- pas de classement humiliant ;
- pas de destruction pendant l'absence ;
- pas de notification culpabilisante ;
- retour motivé par la curiosité, l'histoire, la création et l'amélioration du système.


---

# Prototype et MVP

## Question du prototype

> Est-il plaisant de développer un corps-cité, automatiser quelques flux, traverser un Écho et voir une contribution modifier durablement le monde ?

## Prototype vertical recommandé

- une vue intérieure du corps-cité ;
- une petite cellule extérieure ;
- trois ressources : matière, énergie, mémoire ;
- quatre nœuds de transformation ;
- un lien commercial NPC automatique ;
- un second joueur simulé ou réel ;
- un Écho comportant trois voies : protection, adaptation et transcendance ;
- un Éclat rapide avec alternative tactique ;
- un journal de Traces et une page de wiki générée ;
- dormance et résumé de retour simulés.

## Hors prototype

- contenu public libre ;
- grandes guildes ;
- application mobile native ;
- interaction par courriel ;
- calcul distribué ;
- directeur adaptatif complexe ;
- dizaines d'espèces ou arbres technologiques.

## Critères de validation

1. La boucle tycoon est compréhensible et satisfaisante.
2. Le corps-cité ne provoque pas de malaise visuel non voulu.
3. Le joueur comprend pourquoi sa petite contribution est utile.
4. L'événement peut produire plusieurs qualités de résolution.
5. Une absence simulée ne génère ni dette ni perte incompréhensible.
6. Les Traces donnent le sentiment d'un monde qui se souvient.


---

# Outils, dépôt et wiki

## Situation actuelle

- dépôt GitHub : **Avelune-Officiel** ;
- Forgejo sera déployé ultérieurement puis synchronisé ;
- un compte Google peut servir temporairement, sans devenir la source unique ;
- Nextcloud n'est pas retenu comme outil central.

## Recommandation immédiate

Conserver dans le dépôt :

- `docs/` en Markdown ;
- le classeur de conception ;
- les données JSON et CSV ;
- les journaux de décisions ;
- plus tard le code et les prototypes.

## Wiki

Trois options cohérentes :

1. **MkDocs** : le dossier `docs/` produit un site statique, simple à héberger et entièrement versionné.
2. **Wiki.js** : édition web et synchronisation Git possibles; à utiliser comme interface liée au dépôt.
3. **BookStack** : excellente lecture en livres, chapitres et pages, mais nécessite une discipline d'export/sauvegarde pour éviter une seconde source divergente.

Pour un projet porté seul, la recommandation est : **Markdown dans Git comme source de vérité, MkDocs pour la lecture**. Wiki.js devient intéressant lorsque plusieurs personnes doivent éditer dans le navigateur.

## Arborescence cible

```text
Avelune-Officiel/
├── README.md
├── docs/
├── decisions/
├── data/
├── csv/
├── logs/
├── prototypes/
├── assets/
└── src/            # plus tard
```


---

# Principes consolidés

- **P-001 — Aucune punition liée à l’absence** : Une non-action ne produit pas de dette morale ou de destruction durable.
- **P-002 — Toute action aide** : Même une résolution imparfaite crée une information, une adaptation ou une ressource.
- **P-003 — Sociabilité non forcée** : Le joueur peut contribuer au collectif sans conversation libre ni présence synchrone.
- **P-004 — Nouveaux joueurs utiles** : La diversité, la plasticité et les tâches fondamentales donnent une vraie valeur aux faibles niveaux.
- **P-005 — Pas de domination sociale** : Aucun joueur ne détient un pouvoir permanent sur les autres ou leurs domaines.
- **P-006 — Complexité progressive** : Les systèmes avancés existent mais peuvent être masqués, automatisés ou introduits par étapes.
- **P-007 — Engagement stimulant** : Le jeu cherche la curiosité, la compréhension et la création plutôt que la micro-dopamine.
- **P-008 — Échec fertile** : L’échec crée une bifurcation, pas une invalidation de l’investissement du joueur.
- **P-009 — Monde vivant** : Le monde s’adapte, conserve les traces et ne se réduit pas à un décor consommable.
- **P-010 — Culture jouable** : Poésie, écriture, nomenclature et mémoire ont une fonction mécanique.
- **P-011 — Accessibilité native** : Les besoins TDAH, TSA, dys et les choix de langue/genre structurent le design initial.
- **P-012 — Consentement** : Les liens, groupes, fusions, délégations et publications sont explicites et réversibles.

---

# Questions ouvertes

- **Q-001 — Concept** : Le corps-cité devient-il le concept définitif ou seulement une faction/forme jouable ? _Priorité : Critique._
- **Q-002 — Représentation** : Le corps-cité se déplace-t-il physiquement sur la carte ou projette-t-il un avatar mobile ? _Priorité : Critique._
- **Q-003 — Échelle intérieure** : Voit-on des habitants individuels, des populations abstraites ou des symbiotes nommés ? _Priorité : Haute._
- **Q-004 — Carte** : Quelle forme prend une cellule et comment les zones d’influence se chevauchent-elles visuellement ? _Priorité : Haute._
- **Q-005 — Économie** : Quelles trois ressources suffisent au premier prototype ? _Priorité : Critique._
- **Q-006 — Événement** : Quel premier Écho démontre combat, adaptation et transcendance ? _Priorité : Critique._
- **Q-007 — Commerce** : Les échanges utilisent-ils troc automatique, crédits communs ou demandes ciblées ? _Priorité : Haute._
- **Q-008 — NPC** : À quel point les cités NPC évoluent-elles sans joueur ? _Priorité : Haute._
- **Q-009 — Social** : Combien d’organisations simultanées restent lisibles : 2, 3 ou 4 ? _Priorité : Moyenne._
- **Q-010 — Persistance** : Quelle durée réelle correspond à une époque d’Avelune ? _Priorité : Moyenne._
- **Q-011 — Données réelles** : Quels points fixes marins et terrestres composent le Souffle du monde ? _Priorité : Moyenne._
- **Q-012 — Wiki** : Le wiki est-il diégétique dans le jeu, documentaire hors jeu, ou les deux ? _Priorité : Haute._
- **Q-013 — Visuel** : Quel degré de cute et de lisibilité évite le body horror ? _Priorité : Critique._
- **Q-014 — MVP** : Quelles fonctions doivent être simulées avant tout développement graphique ? _Priorité : Critique._

---

# Risques

- **R-001 — Foisonnement fonctionnel (Critique)** : Trop de systèmes avant validation de la boucle centrale. Réponse : Prototype vertical limité; chaque idée est marquée Prototype/MVP/Après MVP.
- **R-002 — Abstraction du corps-cité (Haute)** : Le concept peut être difficile à comprendre ou sembler organique/horrifique. Réponse : Direction biomorphique douce, métaphores végétales et minérales, prototype visuel très tôt.
- **R-003 — Tycoon trop automatisé (Haute)** : Le joueur pourrait ne plus avoir de décisions intéressantes. Réponse : Automatiser la répétition mais créer variations, objectifs et arbitrages.
- **R-004 — Tycoon trop manuel (Critique)** : La maintenance devient un emploi et pénalise les absences. Réponse : Seuils, règles, NPC, reprise et absence de dégradation punitive.
- **R-005 — Monde vide au lancement (Critique)** : Deux joueurs ne couvrent pas les fonctions prévues pour une communauté. Réponse : NPC actifs, objectifs recalibrés et cellules préexistantes.
- **R-006 — Monde saturé à grande échelle (Haute)** : Des centaines de joueurs rendent la carte illisible. Réponse : Carte cellulaire multi-échelle, bourgeonnement et agrégation régionale.
- **R-007 — Données externes indisponibles (Haute)** : Panne, changement de licence ou modèle météo. Réponse : Cache, normalisation, sources multiples et générateur de repli déterministe.
- **R-008 — Données réelles perçues comme aléatoires parfaites (Moyenne)** : La météo est imprévisible mais pas un générateur cryptographique. Réponse : Présenter le mécanisme comme un Souffle du monde reproductible, pas comme hasard pur.
- **R-009 — Communication trop limitée (Haute)** : Les joueurs pourraient manquer de chaleur humaine sans texte libre. Réponse : Phrases empathiques, cadeaux, chroniques, réactions nuancées et liens privilégiés.
- **R-010 — Communication détournée (Moyenne)** : Les combinaisons de noms ou propositions pourraient servir au harcèlement. Réponse : Lexiques contrôlés, droits de publication, blocage et audit.
- **R-011 — Gouvernance lente (Haute)** : Trop de propositions et votes. Réponse : Périmètres privés, décisions automatiques, délais et contre-propositions limitées.
- **R-012 — Nouveaux joueurs décoratifs (Critique)** : Le niveau finit malgré tout par dominer. Réponse : Rendement décroissant, bonus de diversité et aptitude de plasticité des jeunes cités.
- **R-013 — Wiki illisible (Moyenne)** : L’accumulation automatique produit du bruit. Réponse : Entrées synthétiques, niveaux de lecture, tags et archivage par époque.
- **R-014 — Charge de modération future (Critique)** : La publication créative ouverte exige une équipe. Réponse : Pas de contenu public libre au MVP; préparation des permissions et de la provenance.

---

# Sources techniques consultées

- Open-Meteo Weather Forecast API — https://open-meteo.com/en/docs
- Open-Meteo Marine Weather API — https://open-meteo.com/en/docs/marine-weather-api
- Open-Meteo licence — https://open-meteo.com/en/licence
- NOAA Global Forecast System — https://www.ncei.noaa.gov/products/weather-climate-models/global-forecast
- NOAA Tides & Currents Web Services — https://tidesandcurrents.noaa.gov/web_services_info.html
- USGS Earthquake Catalog API — https://earthquake.usgs.gov/fdsnws/event/1/
- MkDocs — https://www.mkdocs.org/
- Wiki.js Git storage — https://docs.requarks.io/storage/git
- BookStack content model — https://www.bookstackapp.com/docs/user/content-overview/
- GitHub Wikis — https://docs.github.com/communities/documenting-your-project-with-wikis/about-wikis
