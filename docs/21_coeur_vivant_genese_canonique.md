# Avelune — Cœur vivant et genèse canonique

> **Statut : contrat de production expurgé — v0.3**  
> Date : 13 août 2026  
> Les recettes exactes, fonctions, coefficients, seuils, graines, poids de causalité et vérités narratives réservées sont classés **Cœur d’Avelune** et conservés hors GitHub.

## 1. Finalité

Le **Cœur vivant** est le socle autonome qui fait évoluer Avelune indépendamment du gameplay et de la présence des joueurs.

Le but n’est pas de produire une simulation promotionnelle jetable. Une fois une instance déclarée canonique, elle doit pouvoir devenir **la genèse réelle du monde**, fonctionner pendant une durée indéterminée — potentiellement plusieurs années réelles avant l’arrivée des premiers joueurs — puis continuer à alimenter le jeu produit sans remise à zéro de convenance.

Le premier jalon est donc :

> **Avelune vit seule, garde mémoire de ce qui lui arrive et peut devenir le monde réel dans lequel les Corcites s’implantent.**

## 2. Séparation avec les prototypes jouables

Le Cœur vivant est un chantier distinct de PROTO-0.x.

PROTO-0.x valide des boucles de jeu, des choix, une UX et des mécaniques de Corcite. Le Cœur vivant valide l’autonomie du monde, sa persistance, son histoire et les moteurs de fond qui devront ensuite être consommés par le jeu.

Les moteurs futurs ne doivent pas être réinjectés dans un prototype actif uniquement parce qu’ils existent.

## 3. Sous-systèmes

Le premier laboratoire du Cœur doit séparer au minimum :

- un **moteur du Monde** ;
- un **moteur de naissance des vagues** ;
- un **moteur d’évolution des vagues** ;
- un **substrat spatial persistant** ;
- une couche de **persistance / historique / télémétrie** ;
- un **simulateur accéléré** utilisant le même cœur logique.

Ces modules communiquent par des contrats étroits, versionnés et testables. Aucun ne dépend d’une interface graphique ou d’un joueur connecté.

## 4. Substrat canonique

Avant toute naissance canonique, le monde doit disposer d’un substrat spatial suffisamment stable pour porter une histoire future.

Ce substrat comprend conceptuellement :

- la **Fracture** comme source et système dynamique ;
- le **Sol** comme milieu local évolutif ;
- la **Lisière** comme périphérie globale vivante ;
- une topologie de voisinage et de propagation ;
- une organisation compatible avec les anneaux et le futur plateau hexagonal ;
- des états locaux persistants ;
- une mémoire des transformations et cicatrices.

La taille finale du monde n’a pas besoin d’être figée maintenant. L’architecture doit permettre une extension ultérieure sans invalider l’identité historique des régions déjà existantes.

## 5. Histoire locale du Sol

Le Sol n’est pas un décor statique.

Des régions initialement comparables doivent pouvoir diverger uniquement à cause de leur histoire : évolution lente, événements, passage des vagues, récupération et mémoire locale.

Le modèle n’est pas une simulation détaillée de faune ou de flore. Il utilise un nombre limité d’états fondamentaux suffisamment riches pour produire :

- présence ou raréfaction ;
- organisation ou diffusion ;
- stabilité ou mutabilité ;
- transformation durable ;
- récupération partielle ;
- cicatrices ;
- différences régionales persistantes.

L’évolution ne doit pas signifier « toujours plus ». Le monde peut devenir plus dense ou plus rare, plus structuré ou plus diffus, plus ancré ou plus flottant, ou simplement **différent**.

## 6. Vagues et transformation du monde

Une vague naît du moteur de cadence, reçoit ses caractéristiques du moteur d’évolution, puis traverse le substrat.

En l’absence de joueur, son passage est absorbé et traité par le monde lui-même. Il peut produire des changements locaux durables : raréfaction, redistribution, altération, imprégnation, cicatrice, récupération différée ou changement de trajectoire ultérieure.

La récupération n’implique pas un retour automatique à l’état précédent.

Le modèle doit accepter plusieurs morphologies de propagation sans confondre une rémanence du même événement avec une nouvelle naissance indépendante. Les recettes exactes et conditions d’apparition restent hors dépôt.

## 7. Genèse avant les Corcites

Le monde commence avant la population jouable.

La genèse peut passer d’états très simples vers des formes d’organisation plus complexes, sans imposer une biologie terrestre littérale et sans exiger un simulateur d’écosystème individualisé coûteux.

Le moteur peut faire apparaître des structures organisées transitoires avant l’arrivée des Corcites. Leur interprétation narrative précise et leur relation éventuelle avec les Corcites sont réservées au **Cœur d’Avelune**.

Des transformations majeures d’un même vivant, dont des **mues** au sens générique, peuvent être expérimentées avant la définition des races jouables. Le Cœur demeure l’autorité sur l’identité et la transformation ; le rendu ne déduit ni ne crée une généalogie à partir de l’apparence.

## 8. Arrivée future des joueurs

Lorsque les premiers Corcites jouables arrivent, ils doivent s’implanter dans **l’état réellement atteint par Avelune**.

Le monde n’est pas remis à neuf pour leur arrivée.

Une couche d’implantation devra cependant garantir une équité raisonnable : elle sélectionne des positions viables et comparables sans effacer l’histoire des régions. L’équité porte sur la capacité de commencer à jouer, pas sur l’identité parfaite des terrains.

Après l’arrivée des joueurs, les actions agrégées des Corcites peuvent devenir une force supplémentaire. Avelune garde sa dynamique propre, mais une activité collective persistante peut infléchir son histoire à long terme.

## 9. Persistance, données et durée inconnue

Le Cœur doit être conçu pour une durée de fonctionnement indéterminée.

Exigences :

- snapshots versionnés ;
- sauvegardes automatiques ;
- restauration testée ;
- migrations de schéma sans remise à zéro ;
- version du moteur inscrite dans l’état ;
- journal causal et événementiel ;
- reprise contrôlée après arrêt ;
- séparation stricte entre mondes de laboratoire et monde canonique ;
- absence de deuxième histoire concurrente après crash ou restauration ;
- formats et contrats suffisamment documentés pour permettre une migration future ;
- cycle de vie explicite des familles de données importantes.

La mémoire canonique ne signifie pas « tout conserver pour toujours ». Il faut distinguer l’état canonique courant, l’historique causal ou d’audit, les snapshots de restauration, les archives, les agrégats dérivés, les données reconstructibles et les données transitoires. Les règles de rétention doivent protéger l’identité du monde sans imposer une croissance incontrôlée de télémétrie brute.

Une instance canonique ne doit pas être lancée avant que ces opérations aient été éprouvées sur des mondes de test.

## 10. Laboratoire headless

Le premier chantier d’implémentation du Cœur ne comporte **aucun frontend nécessaire à son fonctionnement**.

Le laboratoire doit pouvoir :

1. créer un monde de test ;
2. le faire évoluer pendant une durée arbitraire ;
3. produire et traiter des vagues ;
4. faire diverger plusieurs régions ;
5. conserver des cicatrices ;
6. sauvegarder et reprendre l’état ;
7. exporter des métriques et un journal ;
8. reproduire une simulation avec la même version, les mêmes entrées et la même seed ;
9. exécuter des campagnes accélérées sur de nombreuses seeds ;
10. vérifier automatiquement les invariants de stabilité.

L’existence ultérieure d’un LAB VISUEL parallèle ne change pas cette exigence : le Cœur reste exécutable et validable sans lui.

## 11. Invariants de validation et coût de fonctionnement

Le Cœur doit notamment éviter :

- extinction automatique structurelle ;
- emballement non borné ;
- périodicité rigide ;
- convergence de toutes les régions vers le même état ;
- croissance monotone « toujours plus » ;
- stagnation durable non voulue ;
- dépendance à la présence d’un joueur ;
- coût CPU/GPU/RAM/stockage/I/O incompatible avec l’infrastructure cible ;
- dépendance permanente à un moteur de représentation ou à un matériel spécialisé non nécessaire aux lois du monde.

Il doit permettre au contraire :

- des périodes plus calmes et plus agitées ;
- des changements à plusieurs échelles de temps ;
- des histoires régionales distinctes ;
- des transformations persistantes ;
- une causalité reconstructible côté propriétaire ;
- une simulation reproductible à version et entrées identiques ;
- des cadences de calcul adaptées à la temporalité des phénomènes lorsqu’elles préservent lois, invariants et causalité.

Toute charge significative doit pouvoir être qualifiée comme permanente, périodique ou à la demande. Avant de rendre un calcul permanent ou d’augmenter le matériel, vérifier que sa fréquence et sa précision sont réellement nécessaires au phénomène simulé.

Les métriques et seuils chiffrés de validation sont des paramètres de laboratoire et peuvent rester hors de ce document.

## 12. Observatoire analytique

Une fois le moteur headless jugé viable, un **Observatoire privé** pourra afficher les séries temporelles nécessaires à l’analyse et à la calibration.

L’Observatoire est un outil d’ingénierie. Il peut nommer des variables et montrer des informations qui ne seront jamais exposées aux joueurs.

Le port hôte réservé pour une éventuelle exposition HTTP de ce chantier est **8091**. Le moteur headless n’a pas besoin d’ouvrir de port tant qu’aucune API ou interface n’est nécessaire.

L’Observatoire ne fait pas partie du chemin de survie canonique : sa panne ou son arrêt ne doit pas empêcher le Cœur sain de continuer.

## 13. LAB VISUEL et L’Orée

Le **LAB VISUEL peut être ouvert avant l’achèvement complet du Cœur** dès qu’un sous-ensemble sémantique est suffisamment stable pour être représenté sans figer les mécanismes expérimentaux.

Il ne consomme pas les tables, classes ou variables internes du Cœur comme API durable. Architecture :

```text
Cœur ou replay de laboratoire
        ↓
adaptateur de version
        ↓
contrat sémantique de représentation versionné
        ↓
interpréteur visuel
```

Les fixtures synthétiques, exports de simulations enregistrées et futurs états canoniques doivent pouvoir employer ce même contrat. Une révision du Cœur doit être absorbée autant que possible par l’adaptateur ou par une migration explicite du contrat, et non imposer une réécriture de la grammaire ou des vues.

Le LAB peut tester tôt continuité morphologique, mues, lignées, temps long, traces, accessibilité, qualité adaptative et coût de rendu. Il reste **non canonique** tant que les gates de production ne sont pas franchies.

L’**Orée** est la façade contemplative pérenne destinée à traduire le vrai état du monde : vitrine de genèse, écran d’accueil public, seuil facultatif vers le jeu, point d’observation ultérieur ou façade de maintenance.

La scène recherchée doit rester onirique, féerique, calme et peu explicative. La version publique ne doit ni exposer la recette du Cœur ni transformer les états internes en dashboard technique.

La production définitive de l’Orée reste postérieure à une stabilisation suffisante du contrat et à la validation des coûts, de la dégradation et de la pérennité.

Voir `docs/24_visuel_coeur_contrat_public.md`.

## 14. Représentations remplaçables, cadences et dégradation gracieuse

Le Cœur ne connaît jamais directement les sprites, modèles, textures, shaders, couleurs, animations, instruments, moteurs audio ou autres technologies de représentation.

Architecture cible générale :

```text
état canonique du monde
        ↓
adaptateurs de représentation
        ↓
contrat sémantique versionné
        ↓
interpréteurs / moteurs de rendu
```

Cette séparation doit permettre à plusieurs générations de rendu visuel, sonore ou futur de se succéder au-dessus du même Avelune sans modifier les moteurs ni réécrire l’histoire du monde.

**Avelune ne doit jamais dépendre pour sa survie d’un moteur chargé de la représenter.**

La cadence de calcul du Cœur, la cadence de publication d’un état sémantique et les cadences de rendu sont distinctes. Un navigateur peut interpoler ou animer entre états autorisés sans inventer une trajectoire canonique. Un besoin de fluidité graphique ou sonore ne constitue pas à lui seul une raison d’augmenter la fréquence du Cœur.

Le rendu est effectué côté client autant que possible. Le serveur publie des états ou événements compacts ; il ne rend pas une scène distincte par observateur sauf nécessité ultérieure démontrée.

Si une ressource manque ou si un interpréteur tombe, le mode dégradé porte d’abord sur la qualité, la fréquence ou la disponibilité de la représentation. Le Cœur ne doit pas modifier silencieusement ses lois pour masquer une limite de rendu.

Si le jeu est indisponible mais que le Cœur fonctionne, l’Orée peut continuer à refléter l’état réel. Si le Cœur lui-même est indisponible, elle peut afficher le dernier snapshot validé et des micro-animations d’ambiance, mais elle ne doit jamais inventer une évolution canonique côté client.

Voir `docs/development/ARBITRATION_LONGEVITY_AND_RESOURCES.md`, `docs/development/adr/ADR-0003-CORE-REPRESENTATION-INDEPENDENCE.md`, `docs/23_univers_sonore_contrat_public.md` et `docs/24_visuel_coeur_contrat_public.md`.

## 15. Ordre de réalisation

Le Cœur et ses interpréteurs n’avancent pas selon une chaîne rigide « Cœur fini puis rendu ». L’ordre cible devient :

1. documentation, frontières public/secret et invariants ;
2. moteur headless + persistance + simulateur accéléré ;
3. campagnes longues, multi-seeds et tests d’invariants ;
4. dès qu’un sous-ensemble sémantique est suffisamment stable : **contrat de représentation v0 + fixtures/replays + LAB VISUEL ou sonore isolé** ;
5. Observatoire analytique et poursuite des diagnostics du Cœur ;
6. faire évoluer les adaptateurs et le contrat sans coupler les interpréteurs aux mécanismes expérimentaux ;
7. validation sauvegarde/restauration/migrations, pérennité et ressources cumulées ;
8. gates de compatibilité des interpréteurs : remplacement, mode dégradé, accessibilité et budget ;
9. seulement après stabilisation suffisante : Orée et représentations de production ;
10. seulement après validation opérationnelle et comportementale suffisante : naissance de l’instance canonique.

L’investissement artistique et technique peut donc commencer de façon contrôlée avant la fin du Cœur. **La production massive d’assets ou le design définitif des races restent en revanche interdits tant que le contrat, les lignées et leurs mécanismes amont ne sont pas suffisamment stables.**

## 16. Confidentialité

GitHub peut contenir :

- contrats de modules ;
- interfaces de données expurgées ;
- invariants ;
- outils de test ;
- télémétrie autorisée ;
- résultats agrégés de validation ;
- architecture de persistance ;
- couches de rendu génériques ;
- doctrine publique d’arbitrage technique et de pérennité ;
- principes d’adaptation et de versionnement du contrat de représentation.

GitHub ne doit pas contenir :

- formule exacte de naissance ;
- recette exacte d’évolution ;
- paramètres canoniques cachés ;
- seuils invisibles ;
- signatures secrètes ;
- correspondances exactes entre variables du Cœur et morphologie ou musique ;
- règles propriétaires d’héritage, de sélection ou de mue lorsqu’elles révèlent les internes ;
- causalités narratives réservées ;
- mécanismes permettant de reconstruire précisément le comportement propriétaire du Cœur.
