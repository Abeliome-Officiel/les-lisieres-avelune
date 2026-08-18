# Cœur vivant — contrat de lecture des modules

> **Statut : architecture partageable — v0.2**  
> Date : 18 août 2026  
> Ce document décrit la frontière de raccordement sans exposer les structures, recettes, paramètres ou causalités propriétaires du Cœur.

## 1. Principe

Le Cœur d’une instance est l’autorité sur l’état canonique de ce monde. Les modules externes — Fenêtre sur la Lisière, visuel, sonore, Tableaux, panneaux et jeu — sont des **clients en aval**.

Ils ne doivent pas importer durablement les structures internes du Cœur ni devenir nécessaires à sa survie.

Architecture de référence :

```text
état privé du Cœur
        ↓
adaptateur de version
        ↓
projection sémantique autorisée
        ↓
contrat de lecture versionné
        ↓
transport remplaçable
        ↓
module client
```

Le contrat sémantique est la frontière durable. Le protocole de transport est un choix technique remplaçable.

## 2. Identité d’instance et pluralité des mondes

Une instance du Cœur possède une identité persistante, un état, un âge canonique et une histoire de versions/migrations.

À version, configuration, état initial, seed et entrées identiques, le laboratoire doit pouvoir reproduire la même trajectoire. Des instances utilisant des seeds différentes ou recevant des entrées différentes produisent normalement des histoires différentes tout en obéissant aux mêmes lois.

Une différence de seed ne constitue pas une garantie mathématique que chaque état agrégé sera unique à chaque instant. Elle permet une divergence stochastique des trajectoires.

Plusieurs **instances canoniques de production** peuvent exister en parallèle lorsque la capacité de jeu l’exige. Chaque instance possède sa propre histoire canonique et n’échange ni état, ressource, événement, Corcite ni effet de gameplay avec une autre instance.

Le « monde partagé unique » signifie qu’à l’intérieur d’une instance tous les clients et joueurs partagent une seule vérité canonique. Il ne signifie pas que le service Avelune doit rester un singleton mondial pour toute sa population humaine.

Les mondes de laboratoire, tests, replays ou validations restent explicitement non canoniques. Un redémarrage, une migration ou une restauration contrôlée ne crée pas une nouvelle identité de monde.

Voir `docs/33_multi_monde_capacite_et_tableau_univers.md`.

## 3. Ce que fournit le contrat

La projection dépend du rôle du client et suit une logique de liste positive : ne publier que ce qui est nécessaire.

Le contrat peut notamment contenir, sans révéler les mécanismes réservés :

- version du contrat et métadonnées de compatibilité ;
- `world_instance_id` ou identité équivalente de l’instance source ;
- révision ou ordre canonique de l’état publié ;
- âge ou temps canonique sous une forme adaptée au client ;
- descripteurs sémantiques autorisés du monde ou de régions ;
- identifiants stables nécessaires à la continuité d’identité ;
- événements ou marqueurs de changement autorisés ;
- snapshot complet de la projection pour initialisation et resynchronisation.

L’identité d’instance fait partie du contrat afin qu’un client ne puisse jamais mélanger deux histoires canoniques.

Ce document ne définit volontairement pas la liste concrète des champs internes qui alimentent ces descripteurs.

## 4. Ce que le contrat ne fournit pas aux clients publics

Un client public ne reçoit pas directement :

- classes ou objets internes du moteur ;
- schéma privé de persistance ;
- configuration ou seed canonique ;
- seuils, coefficients ou recettes ;
- métriques de laboratoire inutiles au client ;
- mappings permettant de reconstruire une causalité réservée ;
- journal causal propriétaire complet.

L’Observatoire propriétaire peut disposer d’une projection privée plus riche. Cette projection reste distincte de la projection publique.

## 5. Branchements possibles sans modifier le Cœur

Un même client doit pouvoir fonctionner contre :

```text
fixture synthétique
replay enregistré
snapshot de test
instance de laboratoire
instance canonique de production sélectionnée
```

à condition que ces sources présentent le même contrat versionné et une identité de source explicite.

Ainsi, développer ou remplacer un renderer, un interpréteur sonore ou une Fenêtre ne requiert pas de modifier la biologie du Cœur.

Si un nouveau module a besoin d’une information absente, la première question est : **cette information appartient-elle réellement au contrat sémantique ?** Si oui, la projection peut être étendue de façon minimale, versionnée et testée. Cela ne justifie pas une dépendance directe aux internes.

## 6. Transport indépendant

Le transport pourra évoluer selon les besoins : fichier/replay hors ligne, lecture locale, HTTP, flux d’événements, connexion persistante ou autre mécanisme approprié.

Changer de transport ne doit pas changer la signification du contrat.

Le Cœur ne doit pas augmenter sa cadence biologique pour satisfaire une fréquence d’animation. Les clients peuvent mettre en cache, interpoler ou lisser une représentation entre états publiés, mais ne doivent pas inventer une évolution canonique profonde.

## 7. Snapshots, événements et resynchronisation

Un client ne doit pas supposer qu’il recevra chaque mise à jour sans interruption.

Le modèle de lecture doit donc permettre :

1. chargement d’un snapshot cohérent d’une instance identifiée ;
2. consommation ordonnée des changements autorisés de cette même instance ;
3. détection d’une rupture, d’un retard ou d’un changement inattendu d’identité de source ;
4. resynchronisation depuis un nouvel état complet.

Cette règle évite qu’une coupure réseau, un redémarrage de client ou une erreur de routage produise une seconde interprétation de l’histoire ou mélange deux mondes.

## 8. Lecture seule en v1.0

Pour la v1.0, la frontière avec la biologie est unidirectionnelle :

```text
Cœur autonome
    ↓
état canonique
    ↓
contrat de lecture
    ↓
modules
```

Les actions de gameplay d’un Corcite ne sont pas renvoyées vers la biologie du Cœur dans cette version.

Une future API d’actions, si elle est un jour décidée pour une version ultérieure, sera une responsabilité distincte du contrat de lecture et devra posséder ses propres lois, validations et contrôles.

## 9. Dégradation et indépendance

La panne, le remplacement ou l’arrêt d’un module externe ne doit pas arrêter un Cœur sain ni modifier sa trajectoire.

Si un client ne peut plus lire le flux, il peut conserver le dernier état validé et dégrader sa représentation. Il ne doit pas fabriquer un nouvel état canonique local.

Cette indépendance permet plusieurs générations de Fenêtre, visuel, sonore ou interface au-dessus du même monde persistant, et permet à un même type de client d’observer plusieurs instances sans les fusionner.

## 10. Gates avant branchement de production

Avant de considérer un module raccordé proprement :

- le module fonctionne sur fixture et replay sans Cœur actif ;
- une révision simulée de la source est absorbée par l’adaptateur ou une migration explicite ;
- la perte d’événements est récupérable par resynchronisation ;
- l’arrêt du module n’affecte pas le Cœur ;
- la projection publique passe un audit de fuite ;
- les versions du Cœur, de l’adaptateur/contrat, du transport et du renderer/interpréteur restent distinguées ;
- l’identité d’instance est transportée et vérifiée de bout en bout ;
- un test prouve qu’aucun cache, replay ou flux d’un monde ne peut être appliqué silencieusement à un autre ;
- les coûts de publication et de consommation sont mesurés avec les autres composants réellement actifs.

## 11. Fenêtre sur la Lisière et sélection d’instance

La **Fenêtre sur la Lisière** est destinée à être le premier consommateur permanent privilégié de ce contrat de lecture. Elle reste ensuite présente lorsque d’autres modules et le jeu complet sont ajoutés.

Elle doit pouvoir sélectionner la Lisière/instance observée par une interaction simple, par exemple un menu déroulant. Changer de sélection change uniquement la source canonique lue par la Fenêtre ; cela ne déplace aucun Corcite et ne modifie aucun monde.

Le sonore, les Tableaux, panneaux et futurs clients doivent suivre la même discipline de frontière plutôt que créer chacun un accès propriétaire différent aux internes du Cœur.

## 12. Tableau Univers

Le Tableau Univers est un client/superviseur multi-instance distinct du Tableau Monde.

Il peut agréger les informations d’exploitation autorisées de plusieurs mondes et permettre de sélectionner le Tableau Monde correspondant, mais il ne devient pas l’autorité sur leur état canonique. Une panne du Tableau Univers ne doit pas arrêter les Cœurs sains.

Le Tableau Univers peut piloter des opérations d’exploitation explicites — création, placement, migration ou ouverture d’une instance — à travers des interfaces administratives séparées du contrat de lecture biologique. Ces actions doivent rester auditables et ne doivent jamais être confondues avec une écriture dans la biologie d’un monde existant.

Voir `docs/33_multi_monde_capacite_et_tableau_univers.md`.

## 13. Frontière de confidentialité

GitHub peut documenter l’existence du contrat, ses propriétés, son versionnement, ses tests, la pluralité d’instances et les catégories sémantiques nécessaires à l’interopérabilité.

Restent hors dépôt les détails permettant de reconstruire les mécanismes du Cœur : champs sources privés, mappings exacts, paramètres, seeds, seuils, recettes, causalités réservées et tout background confidentiel non nécessaire à l’architecture publique.
