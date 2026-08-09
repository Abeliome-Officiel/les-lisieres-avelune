# Avelune — Système d'évolution du monde et des vagues — contrat expurgé

> **Statut : référence de production expurgée**  
> Date : 9 août 2026  
> La recette exacte est classée **Cœur d'Avelune** et conservée hors GitHub.

## 1. Rôle

Avelune dispose d'un moteur autonome capable de faire évoluer lentement l'état global du monde et les caractéristiques futures des vagues.

Le dépôt de production ne décrit plus les variables latentes, fonctions de transition, mécanismes de mémoire, coefficients, seuils, chemins d'évolution ou règles secrètes qui produisent ce comportement.

## 2. Contrat comportemental

Le moteur doit respecter les propriétés suivantes :

- fonctionnement autonome même sans activité de joueur ;
- évolution lente à l'état de fond ;
- possibilité de variations temporaires plus marquées sans rupture arbitraire ;
- influence future des actions agrégées des Corcites ;
- aucune adaptation des règles à un joueur individuel ;
- absence d'emballement ou d'extinction accidentelle sur les horizons de simulation validés ;
- absence de saut instantané vers un état que les moyens disponibles rendent structurellement impossible à traiter ;
- historique et télémétrie suffisants pour reconstruire les changements autorisés ;
- versionnement de la recette et reproductibilité des tests internes.

## 3. Interfaces attendues

### Entrées

Le moteur peut recevoir des signaux synthétiques provenant notamment :

- de l'état persistant du monde ;
- de phénomènes environnementaux autorisés ;
- des conséquences agrégées des vagues précédentes ;
- des actions agrégées des Corcites ;
- d'interventions administratives explicitement tracées.

La forme exacte et le poids de ces entrées relèvent de la recette secrète.

### Sorties

Le moteur doit produire au minimum :

- un snapshot versionné d'état mondial exploitable par les autres systèmes ;
- les informations nécessaires à la génération autorisée d'une vague ;
- des indicateurs synthétiques destinés au moteur de naissance ;
- des deltas et événements de télémétrie pour l'Observatoire ;
- un historique permettant les simulations de futurs possibles dans la Console du Monde.

## 4. Observabilité

L'Observatoire doit pouvoir détecter :

- stagnation anormale ;
- dérive trop rapide ;
- oscillation artificiellement régulière ;
- saturation ou approche répétée d'une borne ;
- divergence entre versions de moteur ;
- comportements statistiquement inattendus.

Les données d'observation ne doivent pas exposer aux joueurs la recette propriétaire.

## 5. Résultats de validation

Des campagnes de simulation longues ont confirmé qu'une architecture autonome peut rester stable, produire des changements lents et supporter des épisodes temporaires sans calendrier trivial.

Les nombres détaillés, distributions, signatures internes et paramètres de ces campagnes sont désormais conservés dans le **Cœur d'Avelune** plutôt que dans le dépôt courant.

## 6. Confidentialité

Sont exclus du dépôt courant :

- structure détaillée des états latents ;
- dimensions secrètes ou leurs relations exactes ;
- fonctions et graphes de transition ;
- coefficients, seuils et pondérations ;
- mécanismes de mémoire et saturation ;
- paramètres de variabilité ;
- recettes des phénomènes exceptionnels ;
- règles permettant de déduire précisément la réaction future du système.

Les implémentations de production devront charger ces éléments depuis une configuration protégée ou un artefact serveur approprié sans les exposer au client.

## 7. Étape de développement

Avant activation sur le jeu partagé, le moteur doit fonctionner en **shadow mode** dans un Observatoire persistant, en temps réel et en temps accéléré, couplé au moteur de naissance mais sans conséquence sur les joueurs.

La définition précise de la force relative entre activité naturelle et influence agrégée des joueurs reste une question d'équilibrage expérimental.

## 8. Historique Git

Le contenu sensible a été retiré de la branche courante. Des commits antérieurs peuvent encore contenir des recettes exploratoires ; ils ne constituent donc pas un emplacement secret et devront faire l'objet d'une purge d'historique distincte.
