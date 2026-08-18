# Cœur vivant — qualification opérationnelle initiale en fonctionnement continu

> **Statut : protocole partageable — v0.2**  
> Date : 18 août 2026  
> Les seeds, chemins privés, seuils détaillés et résultats bruts restent hors GitHub.

## 1. Objet

Après clôture suffisante des qualifications biologique, temporelle et hors échantillon de CŒUR-0, la gate active devient opérationnelle.

Le premier essai de cette phase consiste à faire fonctionner **une seule instance de Cœur de manière continue, sans intervention manuelle ordinaire**, dans une configuration représentative de la première phase de produit où la Fenêtre sur la Lisière sera le principal consommateur en aval.

Ce test n’est pas une nouvelle campagne biologique accélérée. Il cherche à observer le comportement logiciel et matériel d’un Cœur qui vit réellement pendant une période continue.

## 2. Fenêtre de test initiale

La première fenêtre est fixée à **72 heures réelles continues à compter du démarrage effectif du runtime**. La date/heure d’arrêt n’est donc pas fixée à l’avance : le timestamp de démarrage enregistré par le protocole fait foi, et l’arrêt nominal intervient exactement 72 heures plus tard.

Le Cœur ne reçoit aucune intervention manuelle de confort pendant la fenêtre. Les protections automatiques de sécurité restent toutefois actives : un arrêt automatique motivé par température, mémoire, stockage, corruption ou autre condition de sûreté constitue un résultat du test, pas une violation du protocole.

Un arrêt prématuré, un redémarrage spontané, une perte de progression ou une interruption du runtime est enregistré comme événement du soak et doit être analysé avant toute reprise ou nouvelle tentative.

## 3. Ce que le test doit mesurer

La collecte doit au minimum permettre d’analyser :

- continuité du runtime et absence de crash ;
- CPU, charge et temps processeur ;
- RAM et swap ;
- température et marge thermique ;
- stockage disponible, croissance des données et I/O ;
- fréquence et durée des opérations de persistance ;
- progression régulière de l’âge/état selon l’horloge provisoire retenue pour l’essai ;
- cohérence des snapshots et journaux produits ;
- absence de blocage silencieux ;
- dérive éventuelle de consommation de ressources ;
- capacité à fournir une projection de lecture sans modifier le Cœur.

Les métriques biologiques restent observables comme contrôle de cohérence, mais le but principal n’est plus de recalibrer la biologie.

## 4. Interdiction d’interprétation prématurée

La fin du runtime ne vaut pas verdict à elle seule.

Les données doivent être :

1. contrôlées pour leur intégrité ;
2. analysées sur l’ensemble des 72 heures ;
3. comparées aux attentes et aux limites matérielles ;
4. examinées pour les tendances lentes ;
5. confirmées avant de conclure PASS, PASS AVEC RÉSERVES ou FAIL.

Aucune valeur isolée ni simple absence de crash ne suffit à qualifier le Cœur pour la production finale.

## 5. Relation avec la production future

Ce soak représente la première marche de qualification du fonctionnement permanent. Il ne prétend pas encore mesurer le coût final du jeu complet.

Les mesures de capacité seront enrichies progressivement : Cœur seul, puis persistance et lecture, puis interpréteurs/services nécessaires, puis jeu complet et enfin charge joueurs. Le nombre d’Avelune admissible par machine ne sera dérivé qu’à partir de ces mesures cumulées avec marge de sécurité matérielle et sans dégradation perceptible de l’expérience de jeu.

## 6. Suite

Après analyse et confirmation du soak initial :

- si le comportement est propre, poursuivre la qualification opérationnelle avec arrêt/reprise, restauration et essais plus longs si justifiés ;
- si une dérive ou une faiblesse apparaît, l’isoler avant d’augmenter la durée ou le nombre d’instances ;
- ne pas modifier la biologie pour masquer un problème d’exploitation.
