# Les Lisières d'Avelune - Audit de développement et d'architecture

Date de référence : 6 août 2026  
Branche auditée : `develop/proto-0.1-playable`  
Commit de départ : `fdc3743`  
Statut : audit technique du PROTO-0 jouable, avant verdict expérientiel du playtest humain.

## 1. Conclusion

Le PROTO-0 n'est pas un assemblage one-shot. Son coeur métier est déjà organisé en briques réutilisables : modèle de domaine explicite, moteurs TF/RPG/TD, réservations, réseau et tampons, cycle de vague déterministe, conséquences persistantes, sérialisation/validation, orchestration navigateur séparée, simulations et batterie de tests.

La dette principale se situe ailleurs : interface Svelte monolithique, contenu encore compilé en TypeScript, coexistence de plusieurs générations de données, absence de versionnement de l'état Corcite, absence de CI/E2E et absence de frontière serveur autoritaire pour le futur monde partagé.

Verdict : **bonne fondation de prototype, pas encore architecture de production**. La prochaine consolidation doit être ciblée, pas une réécriture générale.

## 2. Position dans une méthode de développement de jeu vidéo

Séquence de référence adaptée à Avelune :

1. vision, piliers, public cible ;
2. boucles et interactions entre systèmes ;
3. prototypes fonctionnels des systèmes ;
4. prototype intégré jouable ;
5. validation qualitative par playtest ;
6. consolidation architecture et pipeline de contenu ;
7. vertical slice représentative ;
8. production de contenu ;
9. équilibrage/UX/accessibilité à grande échelle ;
10. persistance, monde partagé, opérations serveur et montée en charge ;
11. alpha/bêta/production.

Avelune se situe **à la sortie de l'étape 4 et à l'entrée de l'étape 5** : le prototype intégré est techniquement jouable ; le verdict sur l'intérêt, la compréhension et le rythme reste humain.

### Dérives observées

- **P10 historique trop proche d'un banc de test.** Il a validé les moteurs mais pas suffisamment le jeu. Cette dérive a été corrigée par le principe « réduire la quantité, pas la nature du jeu ».
- **Documentation racine restée partiellement sur P0-P10.** README, ROADMAP et manifeste continuaient à présenter `develop/proto-0`, dix tours et une vague comme état courant alors que la branche jouable était multi-vagues.
- **UI monolithique.** `app/src/routes/+page.svelte` dépasse 116 Ko. C'est acceptable comme accélérateur de prototype, pas comme architecture à prolonger.
- **Sur-risque de conclusion par simulation.** Les 384 parties vérifient stabilité et contrats mais ne permettent pas de conclure à l'intérêt du jeu.

## 3. Méthode de codage réellement mise en place

Le schéma dominant est :

`domaine explicite -> moteurs déterministes -> orchestration -> UI`

La page navigateur n'est pas le moteur. `playable-browser-controller.ts` orchestre des fonctions spécialisées déjà testées : construction, activation, réseau TF, recherche, fabrication/placement TD, résolution de tour et résolution de vague.

### Briques réutilisables constatées

- `domain/` : états et contrats Corcite, ressources, TF, TD, RPG, vague, conséquences ;
- `turn/` : planification, réservations, arbitrage, commit et ordre de résolution ;
- `tf/` : extraction, transformation, fabrication, réseau, routage et règle N -> N+1 ;
- `rpg/` : recherche, découverte, validation, modificateurs ;
- `td/` : état, effets, inventaire physique, placement et résolution ;
- `corcite/` : création, construction, capacités, soutenabilité, récupération, validation, sérialisation ;
- `wave/` : cycle multi-vagues, prévision, résolution et conséquences ;
- `simulation/` et `scripts/` : exécution headless et batteries ;
- `playable-browser-controller.ts` : couche d'application du prototype jouable.

### Ce qui reste prototype-spécifique

- la grosse page Svelte ;
- seed, tester et identifiant de session de démonstration dans l'UI ;
- carnet stocké en `localStorage` ;
- stratégies automatiques simplifiées du script d'équilibrage ;
- état de jeu exécuté côté navigateur ;
- nombreuses unions d'identifiants de contenu compilées dans TypeScript.

## 4. Qualité du code selon les critères demandés

| Critère | État | Commentaire |
|---|---|---|
| Évolutif | Bon pour le prototype | Les systèmes sont séparés ; certains catalogues restent liés à des unions/IDs compilés. |
| Réfléchi | Bon | Les invariants sont explicites et testés. |
| Modulable | Bon coeur / faible UI | Les moteurs sont composables ; l'UI doit être découpée. |
| Réutilisable | Bon | Les mêmes moteurs alimentent tests, simulations et navigateur. |
| Optimisé | Adapté au stade | `structuredClone` privilégie la sûreté ; profiler avant optimisation. |
| Sécurisé | Bon conteneur / insuffisant jeu partagé | Le futur serveur doit être autoritaire. |
| Testable | Très bon | 338 tests au dernier passage complet + batteries headless. |
| Data-driven | Partiel | Les paramètres sont centralisés mais encore compilés avec l'application. |

## 5. Architecture des données actuelle

### 5.1 Données de conception historiques

`data/design_data.json`, `csv/` et les classeurs `design-data/` décrivent une partie importante de la conception mais correspondent principalement aux baselines v0.8 et antérieures. Ils ne sont pas le catalogue runtime actuel du PROTO-0 jouable.

### 5.2 Références de laboratoire P0-P10

Les fichiers `config/*-reference.ts` historiques conservent les valeurs de laboratoire nécessaires aux tests de régression et à l'historique.

### 5.3 Références jouables actuelles

Les fichiers `config/playable-*-reference.ts` portent déjà une grande partie des valeurs de playtest : départ, construction, recherches, soutenabilité, récupération, captation, fabrication TD et cycle de vagues.

### 5.4 Paramètres encore couplés

- Les recettes TF utilisées par le jouable sont encore dans `tf-processing-reference.ts`, héritée de la référence de laboratoire.
- Les coefficients mécaniques TD sont dans `td-reference.ts` (`TD_LAB_REFERENCE`) et utilisés directement par `td/effects.ts`.
- Les types `StructureKind`, IDs de constructions/recherches/tours et certaines cibles de modificateurs sont compilés dans TypeScript.
- `recalculatePlayableCapacities` connaît explicitement les kinds `energy-extension-n1` et `maintenance-extension-n1` et leur associe des définitions précises : ajouter un autre bâtiment de capacité impose actuellement de modifier le moteur.

Conclusion : **centralisation satisfaisante pour un prototype, pas encore contenu entièrement data-driven**.

## 6. Politique cible des variables

Chaque variable doit être classée avant implémentation :

| Catégorie | Exemple | Emplacement cible |
|---|---|---|
| Invariant | sortie TF N indisponible avant N+1 | code + tests |
| Paramètre d'équilibrage | coût, rendement, durée, coefficient | dataset versionné |
| Contenu | bâtiment, tour, recherche, race, métier | dataset versionné |
| État vivant | stock, intégrité, bâtiments possédés | BDD/sauvegarde versionnée |
| Présentation | libellés, descriptions, aides | contenu/localisation |
| Télémétrie | action, résultat, temps, cause | événements métier |

Le runtime devra charger un **ruleset/content registry** validé, plutôt que d'importer directement les catalogues TypeScript dans les moteurs.

## 7. Sérialisation et migrations

Point positif : la configuration historique possède déjà un couple `schema` / `schemaVersion`, et la sérialisation Corcite valide les structures avant écriture et après lecture.

Dette : `CorciteState` n'est pas enveloppé dans un schéma versionné. La compatibilité P0-P10 est actuellement gérée par des champs optionnels. Cette stratégie ne doit pas devenir permanente.

Avant persistance de production :

`{ schema, schemaVersion, rulesetVersion, payload }`

avec registre de migrations testées.

## 8. Sécurité et infrastructure

Points déjà corrects :

- image Docker multi-stage ;
- `npm ci` ;
- processus runtime non-root ;
- conteneur application en lecture seule ;
- `/tmp` en tmpfs ;
- `no-new-privileges` ;
- PostgreSQL sur réseau interne ;
- mot de passe obligatoire par variable d'environnement ;
- healthchecks application et base.

Limite majeure : le gameplay jouable est aujourd'hui exécuté dans le navigateur. Pour le futur monde persistant partagé, le client doit envoyer des **intentions/commandes** et le serveur doit valider, exécuter et persister les résultats. Les ressources, recherches, vagues et inventaires ne devront jamais être autoritaires côté client.

## 9. Tests et qualité

Le dépôt possède une couverture fonctionnelle remarquable pour ce stade : tests historiques P0-P10, tests jouables, sérialisation, invariants, réseau, réservations, recherches, TD, vague, conséquences, captation, contrôleur et carnet. La dernière validation complète comptait 338 tests.

Manques :

- pas de `.github/workflows` dans l'arbre audité ;
- branche jouable non protégée et sans checks requis ;
- pas de test E2E navigateur ;
- pas de couverture de code publiée ;
- pas encore de tests BDD/migration/concurrence ;
- pas de fuzz/property testing systématique.

## 10. Performance

Aucune optimisation lourde n'est justifiée avant profilage. Les zones à mesurer plus tard : clonage complet d'états, historiques, calcul simultané de nombreux Corcites, télémétrie, sérialisation, requêtes PostgreSQL et calculs globaux de monde.

Le choix actuel de `structuredClone` favorise la sûreté et la reproductibilité. C'est rationnel au stade prototype.

## 11. Dette technique priorisée

### P0 - après verdict de playtest, avant augmentation forte du contenu

1. Découper `+page.svelte` en vues/composants et selectors/view-models.
2. Définir un registre de contenu/ruleset injecté dans les moteurs.
3. Externaliser les paramètres d'équilibrage et contenus hors TypeScript compilé.
4. Désigner une source canonique et éliminer les doubles vérités design/runtime.
5. Versionner l'état persistant et écrire le mécanisme de migration.
6. Formaliser la frontière client/serveur autoritaire.

### P1 - avant vertical slice

7. GitHub Actions : test + check + build sur chaque PR.
8. Tests E2E des parcours critiques et responsive.
9. Télémétrie métier versionnée.
10. Persistance PostgreSQL avec transactions et concurrence explicites.
11. Politique dépendances, vulnérabilités et sauvegarde/restauration.
12. ADR pour les choix structurants.

### P2 - avant production de contenu massive

13. Outils import/export tableur pour équilibrage.
14. Comparateur de datasets et batteries A/B.
15. Pipeline de localisation.
16. Pipeline narratif/contenu.
17. Profiling et budgets de performance.

## 12. Prochaine décision

Ne pas lancer une réécriture maintenant. Faire le playtest humain. Ensuite :

- si la boucle est invalidée, corriger le jeu d'abord ;
- si elle est validée, faire une courte phase de consolidation P0 avant d'augmenter le contenu.

Le bon objectif n'est pas « rendre le prototype parfait », mais **préserver les briques qui ont prouvé leur valeur et retirer les couplages qui rendraient coûteuse la suite**.
