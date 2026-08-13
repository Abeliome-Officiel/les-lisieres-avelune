# Arbitrage transversal — pérennité, ressources et matériel

Statut : **doctrine technique partageable**.  
Date : 13 août 2026.

Ce document traduit en règles d’architecture les principes de la Constitution vivante d’Avelune. Il ne contient ni recette propriétaire du Cœur, ni mécanisme réservé, ni choix prématuré de moteur de rendu.

## 1. Position dans l’architecture

L’arbitrage n’est pas un nouveau moteur d’Avelune. Il sert à trancher les choix transversaux de technologie, données, calcul, énergie, matériel et maintenance entre des chantiers qui ont des cycles de vie différents.

Hiérarchie de référence :

```text
Cœur vivant
    ↓
état canonique / données durables
    ↓
adaptateurs de version
    ↓
contrats sémantiques et interfaces versionnées
    ↓
interpréteurs et services remplaçables
    ├─ visuel
    ├─ sonore
    ├─ observabilité
    └─ futurs modules
```

**Invariant de survie : Avelune ne doit jamais dépendre pour sa survie d’un moteur chargé de la représenter.**

La perte d’un rendu, d’un outil d’observation ou d’un service auxiliaire peut réduire la qualité de service, mais ne doit pas créer une seconde vérité ni modifier silencieusement l’histoire canonique.

## 2. Ordre d’arbitrage

Lorsqu’un compromis réel est nécessaire, examiner dans cet ordre :

1. fidélité aux lois d’Avelune ;
2. indépendance et intégrité du Cœur ;
3. pérennité du monde et de son histoire ;
4. réversibilité du choix ;
5. ressources et coût d’exploitation ;
6. complexité de maintenance.

Un gain local de performance ou de confort ne justifie pas de rendre le Cœur dépendant d’un moteur de représentation, d’un fournisseur ou d’un format impossible à migrer.

## 3. Technologies et dépendances

Les langages, frameworks, bases, moteurs graphiques ou audio, bibliothèques et fournisseurs sont des moyens remplaçables.

À chaque choix structurant, documenter autant que pertinent :

- maturité et maintenance du projet ;
- licence et conditions d’usage ;
- formats d’entrée/sortie ;
- capacité d’export ;
- dépendances propriétaires ;
- compatibilité avec l’infrastructure cible ;
- coût de migration estimé ;
- solution de repli possible.

Préférer des contrats stables, des données exportables et des formats documentés lorsque cela réduit un verrouillage sans complexité disproportionnée. L’objectif n’est pas d’interdire toute dépendance externe, mais d’éviter qu’une dépendance remplaçable devienne silencieusement une partie de l’identité canonique.

Un outil candidat peut être utilisé dans un laboratoire sans être élevé au rang de fondation. Une API expérimentale ou très spécifique à un renderer doit rester derrière une couche locale au renderer et ne jamais structurer le contrat sémantique partagé.

## 4. Développement anticipé par contrat

Un interpréteur visuel, sonore ou futur peut être prototypé avant stabilisation complète du Cœur si un sous-ensemble sémantique est suffisamment stable.

Le prototype doit alors consommer :

- des fixtures synthétiques ;
- des replays ou exports de laboratoire ;
- plus tard, l’état réel ;

au travers du **même contrat versionné**.

Les internes du Cœur ne deviennent pas une API de commodité. Une évolution normale du laboratoire doit être absorbée principalement dans un adaptateur de version ou, si la sémantique elle-même change, par une migration explicite du contrat.

Une gate simple doit être testée avant investissement important : modifier artificiellement la structure de la source sans changer sa signification perceptible et vérifier que seul l’adaptateur doit évoluer.

## 5. Permanent, périodique et à la demande

Toute charge significative doit être classée :

- **permanente** : nécessaire à la continuité canonique ou au service explicitement attendu en permanence ;
- **périodique** : peut être calculée à une cadence adaptée ;
- **à la demande** : déclenchée uniquement lorsqu’un utilisateur, un outil ou une opération en a besoin.

Un calcul ponctuel ne devient pas permanent par commodité. Un rendu visuel ou musical coûteux n’a pas à tourner 24/7 s’il peut être reconstruit ou produit au moment utile sans perdre d’information canonique.

## 6. Cadences découplées

Ne pas confondre :

- cadence de simulation du Cœur ;
- cadence de persistance ;
- cadence de publication d’un état ou événement sémantique ;
- cadence d’affichage du navigateur ;
- cadence audio locale.

Un rendu peut interpoler, mettre en cache ou animer entre deux états autorisés. Cette interpolation n’est pas un nouvel état canonique.

Un besoin de 60 images par seconde n’implique donc pas 60 mises à jour du Cœur par seconde. Inversement, un événement canonique significatif ne doit pas être perdu simplement parce que le renderer travaille à une autre cadence.

## 7. Budget de ressources cumulé

Pour les charges permanentes ou importantes, mesurer selon le besoin :

- CPU et GPU ;
- RAM ;
- stockage actif et croissance ;
- entrées-sorties ;
- réseau ;
- énergie ;
- température et refroidissement ;
- temps d’administration ;
- dépendance à un matériel spécialisé.

Aucune brique n’est dimensionnée comme si elle était seule. Les mesures de validation doivent représenter les charges susceptibles de coexister : Cœur, backend du jeu, persistance, communication, visuel, sonore et services nécessaires.

Le bon indicateur n’est pas seulement « cela fonctionne aujourd’hui », mais la marge disponible et le coût marginal lorsque le monde, l’historique, les joueurs ou les représentations augmentent.

Aucun seuil universel n’est fixé ici. Les seuils d’exploitation appartiennent aux procédures et registres mesurés et doivent être révisables.

## 8. Répartition serveur / client

Par défaut, la machine qui héberge le monde doit consacrer ses ressources aux fonctions autoritaires et persistantes.

Le rendu visuel est effectué côté client autant que possible. Le serveur publie un état sémantique compact ; il ne génère pas une scène par observateur sauf besoin ultérieur démontré.

Même principe pour les traitements sonores qui peuvent raisonnablement être produits localement.

Cette règle n’interdit pas un futur service de génération, d’export ou de pré-calcul serveur. Elle exige simplement qu’un tel service soit justifié et reste hors du chemin de survie du Cœur.

## 9. Qualité adaptative

Les représentations doivent disposer d’un mode de dégradation structuré, pas seulement d’un curseur global arbitraire.

Pour le visuel, la cible de conception prévoit au minimum :

- **sobre** : fonctionnel, accessible et identifiable ;
- **normal** : cible artistique et technique de référence ;
- **riche** : détails et effets supplémentaires lorsque les ressources le permettent.

Le riche est un bonus, pas la cible minimale cachée.

Les premiers éléments sacrifiables sont les effets décoratifs, densités élevées, sur-échantillonnages, détails reconstructibles ou fréquences de mise à jour sans valeur informationnelle. L’identité, la lisibilité et l’information critique sont préservées.

## 10. Précision et échelles temporelles

La résolution maximale n’est pas une valeur en soi.

Un phénomène lent peut être calculé moins fréquemment qu’un phénomène rapide si cette cadence préserve :

- les lois ;
- les invariants ;
- la causalité significative ;
- les résultats observables pertinents ;
- la reproductibilité attendue.

Avant d’ajouter du matériel pour soutenir une fréquence de calcul élevée, vérifier si cette fréquence est réellement nécessaire au phénomène simulé. Cette optimisation ne doit jamais consister à modifier discrètement les lois du monde pour économiser des ressources.

## 11. Cycle de vie des données

Toute famille de données importante doit être classée explicitement parmi :

- état canonique courant ;
- historique causal ou d’audit ;
- snapshot de restauration ;
- archive ;
- agrégat ou synthèse dérivée ;
- donnée reconstructible ;
- donnée transitoire ;
- donnée supprimable selon une politique documentée.

Le principe de mémoire d’Avelune protège son identité et son histoire utile ; il n’impose pas de conserver sans limite toute télémétrie brute, tous les caches ni toutes les données dérivées.

Les textures, meshes, caches audio/visuels et autres artefacts reconstructibles sont supprimables avant les informations canoniques ou historiques nécessaires.

## 12. Dégradation gracieuse

En cas de panne ou de saturation, l’ordre normal est de dégrader d’abord ce qui n’est pas nécessaire à la vérité canonique.

Exemples de réponses admissibles selon le contexte :

- réduire la qualité ou la fréquence d’un rendu ;
- suspendre un interpréteur sonore ou visuel ;
- espacer un calcul analytique dérivé ;
- servir le dernier snapshot validé dans une façade non canonique ;
- différer une tâche d’archive ou d’indexation ;
- réduire l’observabilité non critique.

Ne sont pas admissibles comme simple mécanisme de secours : inventer une évolution canonique côté client, modifier silencieusement les lois, produire une seconde histoire ou faire dépendre la reprise d’un moteur de représentation.

## 13. Arbitrage matériel

Le matériel est dimensionné et renouvelé à partir de mesures et de criticité, pas d’un calendrier arbitraire.

Les déclencheurs peuvent inclure :

- panne ou dérive de santé ;
- saturation ou marge insuffisante ;
- contrainte thermique ;
- consommation permanente disproportionnée ;
- manque de capacité ;
- incompatibilité ou fin de support ;
- besoin de redondance ;
- coût d’exploitation ;
- besoin scientifique ou de production mesuré.

Avant un changement de plateforme, vérifier lorsque pertinent : optimisation logicielle ; cadence adaptée ; extension ciblée ; migration ; puis séparation de services ou ajout de nœuds.

Toute évolution matérielle significative doit préciser son déclencheur, le gain attendu, les dépendances, la procédure de migration, la possibilité de retour arrière et la validation après migration.

## 14. Consolidation et dette

Une phase de développement peut être volontairement consacrée à :

- tests de restauration ou migration ;
- réduction de dette technique ;
- mise à jour de dépendances ;
- documentation ;
- mesure de consommation ou de capacité ;
- remplacement de matériel ;
- simplification d’architecture.

Ces travaux sont des livrables de pérennité, pas du temps perdu par rapport aux nouvelles fonctionnalités.

## 15. Fiche minimale d’un arbitrage structurant

Pour une décision technique ou matérielle significative, conserver au minimum :

- problème observé ;
- métriques disponibles ;
- options envisagées ;
- effet sur le Cœur et l’état canonique ;
- réversibilité et coût de migration ;
- coût permanent attendu ;
- effet sur le budget cumulé ;
- risques et mode dégradé ;
- décision ;
- condition de réexamen.

Un ADR est approprié lorsqu’un choix modifie durablement l’architecture. Les valeurs opérationnelles et seuils mesurés restent dans les documents d’exploitation correspondants.

## 16. Observabilité et capacité d’action

Une instrumentation n’acquiert pas un pouvoir de commande simplement parce que le matériel ou l’API observés le permettent techniquement.

Séparer explicitement lorsque pertinent :

- acquisition de mesures ;
- stockage et historisation ;
- agrégation et diagnostic ;
- présentation ;
- alertes ;
- actions automatiques ou manuelles.

Une chaîne d’observation peut être volontairement **lecture seule**. Sa panne doit au pire rendre une mesure ancienne, inconnue ou indisponible ; elle ne doit pas modifier le système observé.

Toute capacité d’action future doit être décidée séparément, justifier son besoin, ses droits, ses garde-fous, sa réversibilité et son comportement en cas de perte de communication. Cette séparation s’applique notamment au matériel d’alimentation et à l’observabilité du laboratoire.
