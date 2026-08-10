# AVELUNE — TABLEAU RÉEL
## Cahier des charges fonctionnel v0.1

Statut : **socle durable**.  
Portée : données publiques et non sensibles uniquement.

## 1. Objet

Le **Tableau réel** est l'instrument de télémétrie du projet Avelune dans le monde réel. Il complète les tableaux internes au jeu sans les confondre avec eux.

Il doit conserver une trace honnête et durable de ce qu'il faut réellement pour faire exister Avelune :

- âge du projet ;
- temps humain consacré ;
- matériel engagé ;
- énergie consommée ;
- coûts monétaires ;
- empreinte carbone incorporée et d'usage ;
- soutien financier reçu ;
- part autofinancée ;
- signes de vie du monde : parties de prototype, puis joueurs, Corcites, temps de vie et autres métriques globales pertinentes lorsque la production existera.

Le tableau est **simple mais technique, accessible, sérieux sans être solennel**. La légèreté, la féérie et l'autodérision accompagnent les chiffres ; elles ne les remplacent jamais.

> Le monde est imaginaire. Le temps, l'énergie et les moyens consacrés à sa construction ne le sont pas.

## 2. Rappel public : qu'est-ce qu'Avelune ?

Avelune est un monde imaginaire en construction, et **Les Lisières d'Avelune** le jeu qui doit permettre de l'habiter.

Le projet cherche à créer un jeu de gestion, d'exploration et de coopération profond sans être inutilement compliqué, exigeant sans être punitif, et accueillant sans retirer au joueur ses véritables choix.

Ses volontés publiques de départ sont notamment :

- faire réfléchir plutôt que faire lutter contre l'interface ;
- permettre différentes manières d'habiter le monde ;
- créer un monde collectif sans rendre la présence permanente obligatoire ;
- faire de l'échec une source de jeu plutôt qu'une simple punition ;
- favoriser l'entraide plutôt qu'un classement humiliant ;
- intégrer l'accessibilité à la conception ;
- conserver une place réelle au merveilleux, au calme, à l'étrange et au littéraire.

Ce rappel est volontairement non technique. Le Tableau réel n'a pas vocation à exposer les mécanismes réservés, les recettes internes, l'infrastructure privée ni les secrets du projet.

## 3. Deux espaces distincts

### 3.1 Monde réel

- jours depuis la création ;
- temps humain ;
- matériel ;
- électricité ;
- services et autres dépenses ;
- empreinte carbone ;
- financement ;
- autofinancement.

### 3.2 Vie d'Avelune

- monde public ;
- parties créées et en cours pendant les PROTO ;
- puis, lorsque le monde persistant existe, joueurs, Corcites, temps de vie et autres signes de vie globaux retenus.

Les deux espaces peuvent être affichés ensemble, mais leurs chiffres ne sont jamais additionnés ou sémantiquement mélangés.

## 4. Statuts de vérité

Toute donnée importante doit être qualifiée par l'un des statuts suivants :

- **MESURÉ** : valeur issue directement d'un instrument ou d'une source primaire ;
- **CALCULÉ** : valeur déterminée automatiquement à partir de données connues ;
- **ESTIMÉ** : valeur raisonnablement reconstruite mais non directement mesurée ;
- **SYMBOLIQUE** : information volontairement narrative ou institutionnelle, non assimilable à une mesure physique ou financière.

Une estimation ne doit jamais être présentée comme une mesure.

## 5. Données initiales

Le socle v0.1 connaît actuellement :

- coût machine/laboratoire Avelune : **270 €**, déclaré comme **ESTIMÉ** tant que le détail d'achat n'est pas enregistré ;
- abonnement ChatGPT Plus courant : **23,00 € payés**, **99 % attribués à Avelune**, soit **22,77 € calculés** pour le projet ;
- acquisition du serveur principal : **non imputée** à Avelune, puisqu'il existait déjà et sert à d'autres usages ;
- électricité antérieure à l'instrumentation : à enregistrer ultérieurement comme **ESTIMÉE**, avec méthode documentée ;
- mesure électrique future : à enregistrer comme **MESURÉE** à partir de la prise du lab ;
- empreinte carbone : structure prête, valeurs encore à établir ;
- monde public : **1**, valeur **SYMBOLIQUE** ;
- soutien communautaire : **0 €** tant qu'aucun soutien réel n'est enregistré ;
- date zéro du projet : **à fixer explicitement** ; aucune date ne doit être inventée.

## 6. Temps humain

Le temps humain est une métrique historique. Il peut être ventilé par catégories : conception, développement, infrastructure, documentation, tests, administration, communauté, autre.

Une valorisation économique théorique peut exister plus tard, mais elle doit rester distincte des dépenses réellement payées.

**Le temps humain n'est pas une dette financière du projet.**

## 7. Coûts et énergie

Les coûts sont enregistrés sous forme d'événements élémentaires et non seulement sous forme de totaux. Les totaux sont calculés depuis les événements sources.

Le serveur principal étant partagé, son achat n'est pas imputé à Avelune et seule une quote-part énergétique documentée peut être attribuée au projet.

## 8. Empreinte carbone

Le registre carbone est séparé du registre financier.

Il distingue :

- **carbone incorporé** : fabrication, distribution et éventuellement fin de vie du matériel ;
- **carbone d'usage** : émissions dues au fonctionnement au fil du temps ;
- **empreinte carbone connue** : somme des postes quantifiés sur des périmètres compatibles.

Les euros ne sont jamais convertis automatiquement en CO2e. L'électricité est convertie depuis les kWh réellement mesurés et un facteur d'émission ADEME versionné. Le carbone du serveur partagé suit une quote-part Avelune. Le carbone de l'IA reste non quantifié tant qu'une méthode défendable manque.

Tant qu'un poste important reste inconnu, l'interface affiche **empreinte carbone connue** et **périmètre incomplet**, jamais un faux total exhaustif.

La méthode détaillée est décrite dans `CARBON_ACCOUNTING.md`.

## 9. Financement

Le tableau distingue contributions brutes, frais, contributions nettes et part des coûts connus couverte.

Deux jauges différentes peuvent exister : couverture historique et besoin futur concret. Une jauge ne doit jamais créer artificiellement un besoin dans le seul but de pousser au don.

## 10. Provenance et historisation

Toute donnée importante doit pouvoir répondre à trois questions : d'où vient-elle, quand a-t-elle été enregistrée et comment a-t-elle été obtenue ?

Les événements sont append-only par défaut. Une correction est une nouvelle entrée de correction ou d'annulation, pas une réécriture silencieuse du passé.

Les facteurs d'émission carbone sont également versionnés : une nouvelle valeur ne réécrit pas silencieusement les calculs historiques.

## 11. Lisibilité et ton

Le premier niveau doit être compréhensible en quelques secondes. Le détail doit rester accessible sans être imposé.

Sont autorisés : microtextes légers, références discrètes à l'univers, féérie visuelle sobre et autodérision ponctuelle. La donnée brute et son unité restent toujours visibles.

## 12. Lois du Tableau réel

1. **Le réel reste réel.**
2. **La poésie accompagne la donnée, elle ne la remplace pas.**
3. **Une estimation se déclare.**
4. **La source doit pouvoir être retrouvée.**
5. **Les événements précèdent les totaux.**
6. **Le temps humain n'est pas une dette.**
7. **Les dons ne créent pas artificiellement un besoin.**
8. **L'autofinancement est une donnée.**
9. **Le passé et le futur sont séparés.**
10. **Le projet réel et le monde de jeu ne sont pas confondus.**
11. **Un environnement technique n'est pas un monde.**
12. **La précision ne doit jamais être inventée.**
13. **La première lecture doit être simple.**
14. **Le détail doit rester auditable.**
15. **Le tableau ne culpabilise pas.**
16. **Le tableau peut sourire.**
17. **La mémoire commence maintenant.**
18. **Aucun secret d'exploitation n'appartient au tableau public.**
19. **Une source absente vaut mieux qu'une valeur inventée.**
20. **L'instrumentation doit coûter moins de ressources qu'elle n'en observe raisonnablement.**
21. **Le CO2e n'est pas déduit des euros.**
22. **Carbone incorporé et carbone d'usage restent distincts.**
23. **Un total carbone incomplet est nommé comme tel.**
24. **Tout facteur carbone est sourcé et versionné.**

## 13. Critère de réussite

Une personne doit pouvoir comprendre en moins de trente secondes ce qu'est Avelune, depuis combien de temps le projet existe, combien de temps humain lui a été consacré, ce qu'il a coûté réellement, quelle empreinte carbone est déjà quantifiée, ce qui reste inconnu, ce qui a été soutenu ou autofinancé et quelques signes de vie du monde — sans jamais avoir besoin de connaître l'infrastructure privée du projet.
