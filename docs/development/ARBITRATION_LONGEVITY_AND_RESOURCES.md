# Arbitrage transversal — pérennité, ressources et matériel

Statut : **doctrine technique partageable**.  
Date : 13 août 2026.

Ce document traduit en règles d’architecture les principes de la Constitution vivante d’Avelune v0.2. Il ne contient ni recette propriétaire du Cœur, ni seuil canonique caché, ni choix prématuré de moteur de rendu.

## 1. Position dans l’architecture

L’arbitrage n’est pas un nouveau moteur d’Avelune. Il sert à trancher les choix transversaux de technologie, données, calcul, énergie, matériel et maintenance entre des chantiers qui ont des cycles de vie différents.

Hiérarchie de référence :

```text
Cœur vivant
    ↓
état canonique / données durables
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

## 4. Permanent, périodique et à la demande

Toute charge significative doit être classée :

- **permanente** : nécessaire à la continuité canonique ou au service explicitement attendu en permanence ;
- **périodique** : peut être calculée à une cadence adaptée ;
- **à la demande** : déclenchée uniquement lorsqu’un utilisateur, un outil ou une opération en a besoin.

Un calcul ponctuel ne devient pas permanent par commodité. Un rendu visuel ou musical coûteux n’a pas à tourner 24/7 s’il peut être reconstruit ou produit au moment utile sans perdre d’information canonique.

## 5. Budget de ressources

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

Le bon indicateur n’est pas seulement « cela fonctionne aujourd’hui », mais la marge disponible et le coût marginal lorsque le monde, l’historique ou le nombre de représentations augmentent.

Aucun seuil universel n’est fixé ici. Les seuils d’exploitation appartiennent aux procédures et registres mesurés et doivent être révisables.

## 6. Précision et échelles temporelles

La résolution maximale n’est pas une valeur en soi.

Un phénomène lent peut être calculé moins fréquemment qu’un phénomène rapide si cette cadence préserve :

- les lois ;
- les invariants ;
- la causalité significative ;
- les résultats observables pertinents ;
- la reproductibilité attendue.

Avant d’ajouter du matériel pour soutenir une fréquence de calcul élevée, vérifier si cette fréquence est réellement nécessaire au phénomène simulé. Cette optimisation ne doit jamais consister à modifier discrètement les lois du monde pour économiser des ressources.

## 7. Cycle de vie des données

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

Une politique de rétention doit tenir compte à la fois de la reconstruction scientifique, de l’audit, de la restauration, du coût de stockage et de la sensibilité des données.

## 8. Dégradation gracieuse

En cas de panne ou de saturation, l’ordre normal est de dégrader d’abord ce qui n’est pas nécessaire à la vérité canonique.

Exemples de réponses admissibles selon le contexte :

- réduire la qualité ou la fréquence d’un rendu ;
- suspendre un interpréteur sonore ou visuel ;
- espacer un calcul analytique dérivé ;
- servir le dernier snapshot validé dans une façade non canonique ;
- différer une tâche d’archive ou d’indexation ;
- réduire l’observabilité non critique.

Ne sont pas admissibles comme simple mécanisme de secours : inventer une évolution canonique côté client, modifier silencieusement les lois, produire une seconde histoire ou faire dépendre la reprise d’un moteur de représentation.

## 9. Arbitrage matériel

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

## 10. Consolidation et dette

Une phase de développement peut être volontairement consacrée à :

- tests de restauration ou migration ;
- réduction de dette technique ;
- mise à jour de dépendances ;
- documentation ;
- mesure de consommation ou de capacité ;
- remplacement de matériel ;
- simplification d’architecture.

Ces travaux sont des livrables de pérennité, pas du temps perdu par rapport aux nouvelles fonctionnalités.

## 11. Fiche minimale d’un arbitrage structurant

Pour une décision technique ou matérielle significative, conserver au minimum :

- problème observé ;
- métriques disponibles ;
- options envisagées ;
- effet sur le Cœur et l’état canonique ;
- réversibilité et coût de migration ;
- coût permanent attendu ;
- risques et mode dégradé ;
- décision ;
- condition de réexamen.

Un ADR est approprié lorsqu’un choix modifie durablement l’architecture. Les valeurs opérationnelles et seuils mesurés restent dans les documents d’exploitation correspondants.
