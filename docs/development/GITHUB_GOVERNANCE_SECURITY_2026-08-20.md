# GitHub — gouvernance, historique et sécurité

**Snapshot partageable — 20 août 2026**

Ce document consigne les décisions de gouvernance Git/GitHub et les frontières de sécurité qui peuvent être publiées dans le dépôt. Il ne contient ni secrets techniques, ni chemins privés nécessaires à l’exploitation, ni inventaire du Coffre.

## 1. Nettoyage de l’historique sensible

Le nettoyage contrôlé de l’ancien historique sensible GitHub est **clos**.

Conséquences :

- les branches et tags réécrits actuels sont la source de vérité ;
- les références issues de l’ancien graphe ne doivent pas être repoussées ;
- un clone ou worktree créé avant la purge doit être explicitement contrôlé avant réutilisation ;
- lorsqu’une ancienne copie est douteuse, la solution préférée est une copie propre depuis les références actuelles plutôt qu’une tentative de « réparer » le graphe ;
- aucun nouveau rewrite global de l’historique n’est autorisé par défaut.

Cette clôture ne signifie pas que toute l’hygiène du dépôt est terminée : branches et PR historiques restent à rationaliser séparément.

## 2. Identité GitHub Avelune

Les procédures d’exploitation doivent distinguer explicitement :

- l’identité GitHub dédiée au projet Avelune ;
- les identités GitHub personnelles ou génériques.

Les opérations destinées au dépôt officiel doivent être routées vers l’identité Avelune prévue. Une identité SSH ou un agent local ne doit jamais être déduit implicitement d’un contexte ambigu.

Les **clés privées** restent locales et ne sont ni versionnées ni copiées dans la documentation du projet. Seules les clés publiques nécessaires peuvent être enregistrées côté GitHub.

## 3. Anciennes copies et worktrees

Une ancienne copie du dépôt n’est pas considérée fiable pour pousser simplement parce que son arbre de travail paraît correct.

Avant réutilisation :

1. vérifier son origine et son remote ;
2. vérifier qu’elle descend bien du graphe actuel ;
3. contrôler qu’elle ne contient pas d’ancien objet sensible ou de ref obsolète ;
4. préférer une copie neuve lorsque l’origine n’est pas démontrable.

Les copies mises en quarantaine ou dont le push est désactivé ne doivent pas être réactivées sans audit explicite.

## 4. Frontière des secrets

GitHub est une surface de publication même lorsque le dépôt est privé.

Ne jamais y stocker :

- mots de passe ;
- tokens ;
- secrets runtime ;
- clés privées ;
- recovery codes ;
- seeds privées ;
- recettes propriétaires du Cœur ;
- paramètres ou causalités réservés ;
- CODEX ou inventaires de secrets.

Politique générale :

- credentials humains → gestionnaire de secrets prévu ;
- secrets runtime des services durables → stockage de secrets hors Git, monté avec le moindre privilège lorsque justifié ;
- clés privées → emplacements locaux protégés ;
- recovery codes → coffre prévu ;
- pas d’introduction d’un système supplémentaire de chiffrement de secrets dans Git sans besoin démontré.

## 5. Snapshots et sauvegardes

Un snapshot stocké sur le **même support physique** que sa source protège contre certaines erreurs humaines, mais n’est pas une sauvegarde indépendante.

Une sauvegarde Avelune durable doit être qualifiée selon sa capacité réelle à survivre à la perte ou à la corruption de l’hôte source.

Les snapshots techniques peuvent contenir des données d’exploitation sensibles : ils ne sont jamais des sources Git et doivent être soumis aux mêmes règles de rétention et de suppression que les données qu’ils copient.

## 6. PROTO

Le PROTO est désormais **CLOS / HISTORIQUE**.

Une expérience locale de durcissement des secrets a été testée sans être intégrée au dépôt ni au runtime. Elle est abandonnée avec le PROTO et ne constitue pas une action GitHub ou sécurité restante.

La fermeture du PROTO ne modifie pas la politique de secrets des services durables futurs.

## 7. État GitHub au 20 août 2026

Au moment de cette synchronisation :

- `main` reste la branche d’intégration stable ;
- aucune issue n’est ouverte ;
- plusieurs PR draft VISUEL historiques restent à classer ;
- plusieurs branches de développement, documentation et prototype restent à rationaliser ;
- `tmp-unused` doit être vérifiée ;
- la branche `security/sentinel-baseline-2026-08-20` doit être revue ;
- la protection/ruleset de `main` reste à établir ;
- la politique `.github`, les audits de dépendances/images et les gates CI sécurité restent à renforcer.

Ces tâches constituent le chantier **hygiène GitHub / sécurité**, distinct de tout développement PROTO.

## 8. Règles de modification du dépôt

- pas de `--force` ni de rewrite historique sans opération explicitement autorisée et préparée ;
- pas de fusion mécanique d’une branche simplement parce qu’elle contient du travail ancien ;
- inspecter diff, portée et statut des tests avant promotion ;
- ne pas réintroduire une branche pré-purge dans le graphe actuel sans contrôle ;
- traiter les anciennes PR comme des traces tant qu’elles n’ont pas été requalifiées ;
- préférer des branches de travail propres depuis `main` pour les nouvelles modifications partageables ;
- les changements de sécurité critiques peuvent bloquer une mise en production même si la fonctionnalité est prête.

## 9. Sources de vérité

- **GitHub actuel** : code et documentation partageables ;
- **documentation privée/Coffre** : matière propriétaire et décisions non publiables ;
- **gestion des secrets techniques** : séparée de GitHub et du Coffre de conception selon la nature du secret.

Une décision de documentation doit toujours respecter cette frontière avant d’être poussée.
