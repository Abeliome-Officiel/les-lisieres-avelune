# PROTO — clôture définitive du chantier

**Date : 20 août 2026**  
**Statut : CLOS / HISTORIQUE**

## Décision

La lignée **PROTO-0 / PROTO-0.1 / PROTO-0.2 / PROTO-0.2.2** a rempli son rôle de prototype de validation. Elle n'est plus un chantier de développement actif.

À compter de cette clôture :

- aucun nouveau playtest structurant n'est attendu comme gate du projet ;
- aucun développement fonctionnel, retrofit architectural ou durcissement applicatif n'est entrepris pour prolonger le PROTO ;
- les branches, tests, mesures et documents associés restent disponibles comme **preuves historiques** et sources de connaissance ;
- leur présence dans GitHub ne signifie pas qu'ils doivent être repris ;
- le futur jeu, le Cœur et les modules durables P1–P8 ne dépendent ni du runtime, ni de la base, ni des sessions, ni du tour par tour du PROTO ;
- une connaissance issue du PROTO n'est réutilisée que si elle est explicitement requalifiée dans le chantier qui en devient propriétaire.

## Expérience locale de sécurisation non intégrée

Une expérience locale de lecture de secrets via fichiers `*_FILE` a été testée avec succès sur une branche de travail non publiée : environnement Node 24, vérification Svelte sans erreur ni avertissement, suite PROTO complète réussie et `diff-check` propre.

Cette expérience n'a été ni commitée, ni poussée, ni déployée. Elle est **volontairement abandonnée avec le PROTO** et ne constitue pas une dette active du projet.

La politique générale de gestion des secrets des services durables reste indépendante de cette décision.

## Décommissionnement

Une éventuelle instance PROTO encore déployée est uniquement en **maintien transitoire**. Sa suppression relève d'une opération de décommissionnement, pas d'un nouveau lot de développement.

Lors du retrait effectif, vérifier au minimum :

1. arrêt du service ;
2. retrait des routes et expositions devenues inutiles ;
3. suppression ou révocation des credentials exclusivement liés au PROTO ;
4. traitement des données runtime selon leur utilité réelle et leur politique de rétention ;
5. vérification qu'aucun service durable ne dépend encore du PROTO ;
6. conservation des seules preuves historiques utiles.

Aucune de ces opérations n'autorise un accès ou une modification du Cœur actif.

## Branches GitHub

Les branches dont le nom contient `proto`, ainsi que les branches de documentation ou d'automatisation créées pour ces jalons, doivent désormais être interprétées comme **historiques** sauf décision explicite contraire.

Elles seront classées lors de l'hygiène GitHub globale. Leur suppression éventuelle est une décision de nettoyage distincte ; elle n'est pas nécessaire pour considérer le chantier PROTO comme fermé.

## Règle de réouverture

Le PROTO ne doit être rouvert que pour l'une des deux raisons suivantes :

- obtenir une preuve historique précise qui n'existe nulle part ailleurs ;
- réaliser son décommissionnement sûr.

Il ne doit pas réapparaître comme chantier actif par simple présence d'une branche, d'un worktree, d'une dette technique locale ou d'un ancien document.
