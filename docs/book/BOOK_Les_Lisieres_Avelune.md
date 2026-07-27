# Les Lisières d’Avelune
## Book de conception v0.8

Date : 2026-07-27

> Version officielle du socle mécanique minimal. Elle fixe suffisamment de règles pour simuler les trois axes et construire un mini-prototype logiciel succinct. Elle ne prétend pas figer l’équilibrage final, la coopération, le commerce ou l’interface.

---

# Comment utiliser cette version

1. Lire le présent Book pour le système consolidé.
2. Utiliser `design-data/Avelune_Design_Book.xlsx` pour le registre complet.
3. Utiliser `prototype/Avelune_Mini_Prototype.xlsx` pour exécuter un cycle minimal.
4. Modifier une seule hypothèse à la fois.
5. Reporter tout système non nécessaire au test intégré.

---


# Vision v0.8

**Les Lisières d’Avelune** est un jeu navigateur persistant dans lequel chaque personne développe un **corps-cité**, participe à la protection d’un monde hexagonal et choisit son degré d’implication sociale.

Le jeu repose sur trois axes de même importance, mais conçus dans cet ordre :

1. **Tower Defense systémique** : la Fracture émet des vagues qui traversent le monde et doivent être contenues, transformées ou assumées avant la Lisière.
2. **Tycoon–Factorio (TF)** : production, transformation, stockage, débits, construction, réparation et automatisation fournissent les moyens d’agir.
3. **RPG / TTRPG** : l’incarnation, les Vocations, les compétences, les relations, les choix narratifs, les Échos et les instances donnent sens et profondeur aux systèmes.

Avelune n’a pas de mode solo séparé. Le monde est partagé, mais une personne peut jouer de manière autonome et ne dépend pas d’une présence simultanée ou d’une coopération constante.

## Principes non négociables

- la région ne rétrécit jamais ;
- l’absence ne provoque pas une destruction punitive irréversible ;
- l’échec produit une information, une Trace, un Écho ou un nouveau problème jouable ;
- aucune confrontation entre joueurs n’est imposée ;
- les modes accessibles et avancés utilisent les mêmes règles et donnent les mêmes droits de jeu ;
- la coopération active, le commerce inter-joueurs et le déplacement des corps-cités sont reportés après validation de la boucle centrale ;
- le développement du jeu peut devenir mémoire du monde sans créer de privilège mécanique permanent pour les premiers joueurs.


---


# Background : de la création au monde

## La Genèse

Avant les premiers habitants, les lois d’Avelune ne sont pas encore fixées. La Fracture existe déjà au centre, mais ses vagues sont simples et le monde apprend encore à leur résister. Les anciennes règles, les prototypes et les comportements inattendus peuvent être traduits en rêves, fragments, cartes impossibles ou lois qui n’ont jamais entièrement pris forme.

La Genèse correspond à la conception et au premier prototype. Elle est un Âge zéro : consultable par les futurs joueurs, mais non vécue comme un contenu manqué.

## Les Prémices

Les premiers bêta-testeurs deviennent les premiers éveillés du monde. Leurs actions peuvent produire :

- des noms validés ;
- des chroniques ;
- des Cicatrices de Lisière ;
- des Échos ;
- des traditions ;
- des souvenirs de NPC ;
- des cartes et objets commémoratifs sans avantage de puissance.

Les gains mécaniques issus de règles instables sont normalisés avant l’ouverture publique.

## L’Éveil

L’ouverture publique commence dans un monde qui possède déjà une mémoire, mais où aucune personne n’est réduite à un arrivant de seconde catégorie. Les archives, instances mémorielles et récits de NPC permettent de comprendre les événements antérieurs.


---


# Monde persistant, carte et chronologie

## Géométrie initiale

Le premier monde de développement est un disque hexagonal de rayon **R = 7** :

- 169 hexagones au total ;
- Fracture initiale : centre + anneau 1, soit 7 hexagones inutilisables ;
- dernier anneau : Lisière vitale non constructible ;
- deux anneaux jouables extérieurs servent de réserve de confort ;
- capacité cible : 10 corps-cités potentiels ;
- simulations initiales : 3 à 6 corps-cités actifs.

La carte peut s’étendre par ajout d’anneaux, mais **ne peut jamais rétrécir**. Une extension est un événement rare de Chapitre, déclenché par une pression spatiale durable et une justification narrative.

## Fracture imposante

La Fracture commence par sept cases. Sa croissance future peut repousser les lieux vers l’extérieur de plusieurs anneaux. L’identité d’un lieu est donc distincte de ses coordonnées. Un algorithme futur devra préserver autant que possible les secteurs, ensembles et voisinages locaux, puis générer les cases intermédiaires.

Cette migration est reportée : La Genèse utilise une géométrie fixe.

## Temporalité fictionnelle

- **Tour** : unité abstraite de calcul et de choix.
- **Phase** : période définissant les actions autorisées.
- **Cycle** : une vague complète, des Murmures aux Retombées.
- **Saison** : plusieurs cycles sous un contexte environnemental commun.
- **Chapitre** : transformation importante des règles ou du monde.
- **Époque** : changement historique exceptionnel, si ce niveau s’avère nécessaire.

La version logicielle reste distincte de cette chronologie.

## Histoire réelle et histoire fictionnelle

- **Âge zéro – La Genèse** : création des règles, simulateurs et prototypes ; les lois du monde ne sont pas encore toutes stabilisées.
- **Chapitre – Les Prémices** : bêta-test ; les premières personnes actives laissent des chroniques, Échos et traces de terrain.
- **Chapitre – L’Éveil** : ouverture publique.

Les données mécaniques déséquilibrées de la bêta peuvent être réinitialisées ou normalisées, tandis que les traces narratives sélectionnées sont conservées. Aucun avantage essentiel ou pouvoir permanent n’est réservé aux premiers testeurs.


---


# Corps-cité, empreinte et influence

Le personnage est à la fois une incarnation mobile future et un **corps-cité ancré**. Pour le premier prototype, seul l’ancrage est actif.

## Empreinte physique

- départ : **1 hexagone** ;
- croissance : choix d’un hexagone adjacent valide à chaque palier ;
- plafond de **La Genèse** : **7 hexagones** ;
- décroissance possible : retrait prioritaire des cases périphériques jusqu’à un minimum d’une case ;
- les cases libérées conservent des Traces, ruines, ressources ou modifications de terrain.

La croissance n’est pas un saut automatique de 1 à 7 ou 19 cases. Elle forme un polyhexagone choisi, ce qui crée une pression géographique et des profils de développement distincts.

## Trois surfaces distinctes

1. **Empreinte** : cases occupées, exclusives et constructibles.
2. **Influence opérationnelle** : cases choisies au moyen d’un budget ; elle dépend plus tard de la distance, du terrain, de la saturation, des relais et des réseaux.
3. **Écotone** : effet ambiant, non exclusif et chevauchable, issu de l’activité du corps-cité.

Le budget d’influence ne reçoit pas encore de valeur définitive : son coût dépendra du premier moteur TF et des possibilités de production, transport et commerce.


---


# Passage et Lisière

Le Scellement crée un instantané de la région. Pendant le Passage, les défenses et ressources engagées ne peuvent plus être modifiées. Les échanges, transports externes et déplacements sont interrompus, tandis que les activités internes et RPG indépendantes restent accessibles.

Chaque corps-cité sur le secteur reçoit la puissance restante après les corps-cités précédents. La densité locale vaut puissance divisée par nombre de cases du front.

La Lisière compare densité et résistance locale. Le résultat modifie une vigueur et un niveau d’Entame :

- Sereine ;
- Frémissement ;
- Amincissement ;
- Cicatrice ;
- Brèche.

Une Brèche n’est pas une fin de partie : elle crée un Nœud de crise, interrompt certains accès, déclenche un Écho majeur et peut accélérer une transition de Chapitre.


---


# Tycoon–Factorio : socle v0.8

Le TF utilise des règles classiques éprouvées : recettes, entrées, sorties, stocks, débits, files, transport, fatigue et réparation. L’originalité vient de leurs interactions avec les vagues, le terrain, les Échos, les corps-cités et la mémoire du monde.

## Prototype minimal

Trois ressources fonctionnelles :

- **Matière** : construire et réparer ;
- **Flux** : activer et transporter ;
- **Mémoire** : étudier, prévoir et agir dans le RPG ;
- les **Résidus** sont produits après le Passage, mais ne constituent pas une quatrième ressource de départ.

Actions minimales :

- récolter ;
- activer le Flux ;
- étudier ;
- construire un ancrage ;
- préparer un abri ;
- ne rien engager.

Les chaînes initiales ne dépassent pas deux ou trois transformations. Le mini-prototype simule six tours de Veille et vérifie qu’un plan peut privilégier défense, équilibre ou recherche.

## Huit familles de constructions

1. cœur et habitat ;
2. production et transformation ;
3. logistique et stockage ;
4. veille et connaissance ;
5. défense et résonance ;
6. exploration et instances ;
7. culture et mémoire ;
8. liaisons et communs.

Les constructions sont pilotées par des données génériques : fonction, recettes, débit, capacité, emplacements de modules, tags, intégrité, fatigue, provenance et règles conditionnelles.

## Rejouabilité sans course infinie au contenu

La progression est horizontale :

- Chapitre initial : recettes simples, stockage, files et fatigue ;
- étape suivante : qualités, sous-produits, alternatives et modules ;
- puis : catalyseurs, terrain vivant, saisonnalité et règles conditionnelles ;
- plus tard : réseaux longs, spécialisation, commerce et coopération ;
- une innovation systémique majeure par Chapitre, au lieu d’une inflation permanente de bâtiments et de ressources.

Les valeurs de temps, de débit et de budget d’influence restent ouvertes tant que le premier catalogue TF n’est pas testé.


---


# Trame d’Avelune

## Procédure

1. Aucun jet si l’action est acquise et sans incertitude intéressante.
2. Choix structuré si l’enjeu est principalement social, moral ou interprétatif.
3. Test d100 si une compétence peut modifier réellement l’issue.
4. Piste de progression pour une scène longue.
5. Dissonance volontaire pour augmenter un seuil, un effet ou réduire une conséquence.
6. Toute conséquence produit une nouvelle piste, un coût, une condition ou une information.

## Seuil d100

`caractéristique + compétence + objet + difficulté + condition`, borné entre 5 et 95.

- réussite remarquable : jet très inférieur au seuil ;
- réussite complète : jet inférieur ou égal au seuil ;
- réussite avec coût : échec dans une faible marge ;
- conséquence : échec plus important.

La position fixe la gravité ; l’effet fixe l’ampleur.

## Dissonance

- 0–2 : Accordée ;
- 3–5 : Murmurée ;
- 6–8 : Marquée ;
- 9–11 : Fêlée ;
- 12 : Bascule.

La Bascule déclenche une crise ou une instance et propose plusieurs transformations. Elle ne supprime jamais automatiquement le personnage.


---


# Vagues, météo et Échos

## Puissance de vague

La puissance finale combine :

- une base de Chapitre ;
- la pression de la Fracture ;
- les résidus ou conséquences du cycle précédent ;
- un signal météorologique pondéré ;
- d’éventuels modificateurs propres au type de vague.

La défense installée au dernier moment ne sert pas à générer automatiquement une vague équivalente. La progression doit rester réelle.

La météo est une modulation bornée. Son poids exact reste à vérifier ; le simulateur utilise 10 % comme valeur de travail. Le jeu conserve plus tard cache, graine et valeur interne de remplacement.

## Vague de La Genèse

- un seul secteur ;
- aucune dérive ;
- aucune scission ou fusion ;
- aucune dissipation naturelle générique ;
- la densité baisse avec le nombre de cases touchées, mais la puissance totale ne diminue que par une défense ou un effet spécifique.

## Échos

Un Écho est une manifestation localisée de la Fracture ou d’une vague passée. Il peut apparaître :

- dans une zone ;
- à l’intérieur d’un corps-cité.

La propension dépend de l’exposition, de la saturation, de l’affinité, de la pression de Fracture et de la Dissonance. Pour le prototype : zéro ou un Écho candidat après le Passage. Les seuils exacts seront développés après les premières simulations détaillées.


---


# Monde partagé et coopération reportée

Le prototype fonctionne dans un monde partagé, mais ne simule pas encore de coopération active. Une personne peut jouer de manière autonome : elle partage les événements régionaux et la géographie, sans devoir dialoguer ou attendre d’autres personnes.

La future coopération utilisera :

- contributions identifiées à une défense ou un projet ;
- offres, besoins, réserves et débits ;
- propositions et réponses structurées ;
- consentement explicite ;
- aucun classement humiliant ;
- aucune dépendance permanente obligatoire.

Le Passage interrompt par défaut commerce, échanges, transports externes, déplacements et modification des défenses. La gestion interne, les scènes RPG et la préparation de l’après-vague restent accessibles. Le profil de fermeture pourra varier selon la nature de la vague.


---


# Accessibilité et éthique

## Fiche RPG à trois profondeurs

Les modes **Simple**, **Intermédiaire** et **Profond** sont trois vues du même personnage :

- Simple : Vocation, grands domaines, recommandations et conséquences expliquées ;
- Intermédiaire : caractéristiques, compétences utiles, talents et objets principaux ;
- Profond : toutes les compétences, spécialisations, relations, connaissances, tags, marges et combinaisons.

Changer de mode n’altère aucune donnée et ne donne aucune récompense exclusive.

## Règles générales

- pas de réflexe obligatoire ;
- pas de FOMO ou de série quotidienne punitive ;
- récapitulatif synthétique au retour ;
- complexité progressive et automatisation possible ;
- pronoms, langue et grammaire configurables ;
- échec fertile ;
- Dissonance sans suppression automatique du personnage ;
- absence pouvant conduire à une contraction ou un retrait de la carte active, mais avec noyau restaurable ;
- aucune donnée de localisation personnelle nécessaire pour la météo.


---


# Mini-prototype v0.8

Le prototype est un classeur algorithmique, non une interface finale. Il contient :

- un monde R7, Fracture F1 et Lisière extérieure ;
- cinq corps-cités actifs et une présence inactive de démonstration ;
- une boucle TF de trois ressources, cinq actions et six tours ;
- une fiche RPG minimale, un calculateur d100, la Dissonance et trois scènes ;
- une vague simple résolue anneau par anneau ;
- une Lisière locale et des états d’Entame ;
- un cycle intégré ;
- des scénarios météo, TF, RPG et population ;
- une conclusion de préparation.

## Cycle simulé

1. **Murmures** : informations initiales et scène de Veille.
2. **Veille** : production, étude, construction et allocation.
3. **Scellement** : instantané reproductible.
4. **Passage** : progression de la vague et défenses successives.
5. **Retombées** : Lisière, résidus, réparation, Dissonance et Écho candidat.

## Verdict

Les trois axes disposent d’entrées, d’actions et de sorties reliées. Le projet est prêt pour un mini-prototype logiciel succinct. Celui-ci ne validera pas encore la coopération, le commerce, le déplacement, l’interface finale, la rejouabilité longue ou l’équilibrage de production.


---


# Socle mécanique fixé en v0.8

| Domaine | Règle fixée |
|---|---|
| Monde | partagé, R7, dix corps-cités potentiels, deux anneaux de confort, aucune réduction |
| Fracture | rayon initial 1, croissance future par Chapitre |
| Corps-cité | une case au départ, croissance choisie, plafond sept pendant La Genèse, décroissance possible |
| Vague | un secteur, pas de dérive/scission, aucune dissipation générique |
| Cycle | Murmures, Veille, Scellement, Passage, Retombées |
| Lisière | secteurs locaux : Sereine, Frémissement, Amincissement, Cicatrice, Brèche |
| TF | trois ressources de test, chaînes courtes, progression horizontale, constructions génériques |
| RPG | d100 hybride, choix structurés, pistes, position/effet, Dissonance |
| Fiche | trois vues ; six caractéristiques ; dix-huit compétences ; six Vocations |
| Échos | territoriaux ou internes, calculés après le Passage |
| Chronologie | La Genèse, Les Prémices, L’Éveil |

Ce socle est suffisant pour un mini-prototype. Les valeurs ouvertes sont consignées dans le Design Book et dans le classeur de règles.


---


# Décisions ouvertes après v0.8

Le socle du mini-prototype est fixé. Les valeurs suivantes restent ouvertes :

- résistance et seuils précis de la Lisière ;
- poids météorologique final selon les familles de vagues ;
- budget et coût d’influence ;
- nombre de tours réels, durée des recettes et vitesse de transport ;
- fréquence et seuils des Échos ;
- marge exacte de réussite avec coût dans la Trame d’Avelune ;
- talents, spécialisations et contenu des trois paliers de Vocation ;
- catalogue TF initial de six à dix constructions ;
- règles d’inactivité et délais de contraction ;
- algorithme futur d’expansion du monde et de poussée des lieux.

Ces décisions ne bloquent pas un prototype logiciel succinct du cycle v0.8.


---


# Préparation des progressions

Les arbres complets ne sont pas nécessaires au mini-prototype. La v0.8 fixe seulement leur grammaire.

## Corps-cité

- croissance physique case par case ;
- influence par budget ;
- densification interne ;
- décroissance possible ;
- déplacement reporté.

## TF

- modules et alternatives plutôt que simples niveaux ;
- une nouvelle mécanique majeure par Chapitre ;
- nouvelles ressources uniquement lorsqu’elles créent un choix.

## RPG

- six Vocations ;
- trois paliers par Vocation ;
- compétences accessibles hors Vocation avec coûts différents ;
- talents qualitatifs ;
- relations, connaissances et Dissonance comme progressions séparées.

## Monde

- Cycle, Saison, Chapitre et éventuellement Époque ;
- expansion du monde et croissance de la Fracture seulement lors de transitions majeures.


---


# Spécification du prochain prototype logiciel

## Entrées

- scénario et graine ;
- carte fixe R7/F1 ;
- cinq corps-cités actifs ;
- stocks et plan TF ;
- fiche RPG minimale ;
- puissance, météo et pression de Fracture.

## Actions

- choisir deux actions TF par tour ;
- résoudre une scène de Murmures ;
- Sceller ;
- observer les pulsations ;
- résoudre une Retombée RPG ou TF.

## Sorties

- stocks ;
- défense et prévision ;
- marge RPG ;
- Dissonance ;
- puissance restante par anneau ;
- vigueur et Entame de Lisière ;
- résidus ;
- Écho candidat ;
- journal de causes et conséquences.

## Exclusions

- coopération active ;
- commerce inter-joueurs ;
- déplacement du corps-cité ;
- dérive et scission ;
- instance complète ;
- données météo connectées ;
- graphismes définitifs.


---


# Outils et dépôt

- **Forgejo / GitHub** : versionnement, décisions et code ;
- **Penpot** : écrans lorsque les mécaniques sont stabilisées ;
- **Umami** : mesures anonymes du prototype navigateur ;
- **GlitchTip** : erreurs techniques ;
- **tableur** : laboratoire de règles et scénarios ;
- **Python** : simulations en lot et tests statistiques lorsque le tableur devient insuffisant.

La v0.8 fournit deux classeurs distincts :

- `design-data/Avelune_Design_Book.xlsx` : registre de conception ;
- `prototype/Avelune_Mini_Prototype.xlsx` : simulateur intégré minimal.

La prochaine étape technique est un moteur logiciel simple, sans graphismes définitifs, reproduisant exactement un cycle du classeur.


---


# Sources et inspirations

Les mécanismes suivants servent d’inspiration et ne sont pas copiés comme systèmes complets :

- WFRP : d100, carrières, compétences, talents et degrés de réussite — https://cubicle7games.com/our-games/warhammer-fantasy-roleplay
- Shadowrun Sixth World : ressources critiques et compromis persistants — https://shadowrunsixthworld.com/shadowrun-sixth-world-faq/
- Ironsworn / Starforged : mouvements guidés, assets et pistes — https://tomkinpress.com/pages/ironsworn
- QuestWorlds : résolution globale et concours étendus — https://questworlds.chaosium.com/
- Year Zero Engine : équipement dans la résolution, poussée et conditions — https://freeleaguepublishing.com/wp-content/uploads/2023/11/YZE-Standard-Reference-Document.pdf
- Fate : aspects et complications semi-structurés — https://fate-srd.com/fate-core/aspects-fate-points
- Open-Meteo : données météorologiques et marines futures — https://open-meteo.com/en/docs

Toute réutilisation textuelle ou implémentation proche d’un SRD devra faire l’objet d’une vérification de licence. La **Trame d’Avelune** est une combinaison originale de procédures adaptées à un jeu navigateur persistant sans meneur humain.


---
