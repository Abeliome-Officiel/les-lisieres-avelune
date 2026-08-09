# Avelune — Système d'évolution du monde et des vagues — contrat expurgé

> **Statut : référence de production expurgée**  
> Date : 9 août 2026  
> La recette exacte est classée **Cœur d'Avelune** et conservée hors GitHub.

## 1. Rôle

Avelune dispose d'un moteur autonome capable de faire évoluer lentement l'état global et local du monde ainsi que les caractéristiques futures des vagues.

Le dépôt de production ne décrit pas les variables latentes, fonctions de transition, mécanismes de mémoire, coefficients, seuils, chemins d'évolution ou règles secrètes qui produisent ce comportement.

Ce moteur appartient au chantier **Cœur vivant / genèse canonique** décrit dans [`21_coeur_vivant_genese_canonique.md`](21_coeur_vivant_genese_canonique.md).

## 2. Contrat comportemental

Le moteur doit respecter les propriétés suivantes :

- fonctionnement autonome même sans activité de joueur ;
- évolution lente à l'état de fond ;
- possibilité de variations temporaires plus marquées sans rupture arbitraire ;
- histoire locale persistante et divergence possible entre régions ;
- transformations et cicatrices pouvant durer longtemps ;
- récupération non obligatoirement identique à l'état antérieur ;
- influence future des actions agrégées des Corcites ;
- aucune adaptation des règles à un joueur individuel ;
- absence d'emballement ou d'extinction accidentelle sur les horizons de simulation validés ;
- absence de croissance monotone « toujours plus » ;
- absence de convergence artificielle de toutes les régions vers le même état ;
- historique et télémétrie suffisants pour reconstruire les changements autorisés ;
- versionnement de la recette et reproductibilité des tests internes.

## 3. Substrat persistant

Le moteur doit pouvoir projeter son état sur un substrat spatial stable comprenant conceptuellement Fracture, Sol, Lisière, voisinages et propagation.

La taille finale du monde n'a pas besoin d'être figée, mais l'identité historique des régions déjà existantes doit survivre aux extensions ultérieures.

La résolution interne exacte — case, région ou agrégat — est une décision technique tant qu'elle conserve les propriétés observables et permet une projection cohérente vers le futur plateau.

## 4. Interfaces attendues

### Entrées

Le moteur peut recevoir des signaux synthétiques provenant notamment :

- de l'état persistant du monde ;
- de phénomènes environnementaux autorisés ;
- des conséquences agrégées des vagues précédentes ;
- des actions agrégées des Corcites lorsqu'elles existeront ;
- d'interventions administratives explicitement tracées.

La forme exacte et le poids de ces entrées relèvent de la recette secrète.

### Sorties

Le moteur doit produire au minimum :

- un snapshot versionné d'état mondial ;
- des états locaux persistants nécessaires au Sol et à la Lisière ;
- les informations nécessaires à la génération autorisée d'une vague ;
- des indicateurs synthétiques destinés au moteur de naissance ;
- des deltas et événements de télémétrie ;
- un historique permettant audit, replay de laboratoire et simulations de futurs possibles autorisées.

## 5. Échelles de temps

Le système doit pouvoir combiner plusieurs échelles :

- changements perceptibles à l'échelle de quelques heures ou jours ;
- transformations plus lisibles sur plusieurs jours ou semaines ;
- régimes profonds sur plusieurs semaines ou mois ;
- mémoire historique sur plusieurs années.

Ces régimes ne constituent pas un calendrier terrestre fixe. Ils résultent de l'état du monde et de ses dynamiques.

## 6. Observabilité

L'Observatoire doit pouvoir détecter :

- stagnation anormale ;
- dérive trop rapide ;
- oscillation artificiellement régulière ;
- saturation ou approche répétée d'une borne ;
- convergence excessive entre régions ;
- divergence entre versions de moteur ;
- comportements statistiquement inattendus ;
- défaut de reproductibilité d'un laboratoire à entrées identiques.

Les données d'observation propriétaire ne doivent pas être confondues avec les informations destinées aux joueurs.

## 7. Validation avant canon

Avant activation canonique, le moteur doit fonctionner d'abord en laboratoire **headless** avec temps accéléré, seeds reproductibles, persistance et tests automatiques.

L'ordre est :

1. moteur headless ;
2. campagnes longues et multi-seeds ;
3. Observatoire analytique ;
4. traduction contemplative éventuelle ;
5. seulement ensuite lancement d'une instance canonique.

Une instance canonique peut ensuite fonctionner pendant une durée indéterminée avant l'arrivée des Corcites et doit pouvoir continuer sans remise à zéro lorsque le jeu produit l'utilise.

## 8. Représentation visuelle

Le moteur du Monde ne doit pas dépendre de la direction artistique.

Il expose un état sémantique stable ; une couche séparée pourra le traduire en intentions visuelles puis en assets, shaders, matières, couleurs et animations. Cette séparation permet de remplacer ou enrichir le graphisme sans modifier l'histoire canonique.

## 9. Confidentialité

Sont exclus du dépôt courant :

- structure détaillée des états latents ;
- dimensions secrètes ou leurs relations exactes ;
- fonctions et graphes de transition ;
- coefficients, seuils et pondérations ;
- mécanismes de mémoire et saturation ;
- paramètres de variabilité ;
- recettes des phénomènes exceptionnels ;
- règles permettant de déduire précisément la réaction future du système ;
- interprétations narratives réservées de la genèse.

Les implémentations de production devront charger ces éléments depuis une configuration protégée ou un artefact serveur approprié sans les exposer au client.

## 10. Historique Git

Le contenu sensible a été retiré de la branche courante. Des commits antérieurs peuvent encore contenir des recettes exploratoires ; ils ne constituent donc pas un emplacement secret et devront faire l'objet d'une purge d'historique distincte.
