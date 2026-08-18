# Roadmap — Les Lisières d’Avelune

## État au 19 août 2026

Le projet avance sur plusieurs chantiers distincts, avec une règle de priorité claire : **le Cœur autonome doit être suffisamment viable, compris et exploitable avant de porter des mondes canoniques de production**.

| Axe | État | Prochaine gate |
|---|---|---|
| PROTO jouable | PROTO-0.2.2 conservé comme jalon historique de validation | playtests puis clôture explicite, sans rétrofit de son architecture en tours |
| Cœur vivant | qualification biologique et adversariale suffisamment close ; aucun prolongement biologique ouvert | ingénierie du Cœur permanent, qualification opérationnelle, puis interface temporelle canonique |
| Multi-monde / exploitation | pluralité d’instances canoniques actée architecturalement ; Tableau Univers cadré | rendre l’identité de monde portable, qualifier création/migration/capacité avant ouverture multi-instance |
| Fenêtre sur la Lisière | module contemplatif définitif cadré, LAB possible sur contrat/fixtures | production après qualification opérationnelle suffisante et stabilisation du contrat de lecture multi-instance |
| Tableau Réel | Gate B validé ; architecture v1 figée | Gate C : domaine, SQLite, migrations, baseline et restauration locale |

Les univers visuel et sonore sont des **interpréteurs en aval**. Ils ne constituent pas une seconde vérité du monde et ne doivent pas devenir des dépendances de survie du Cœur.

Le nettoyage de l’historique GitHub est clos. Le dépôt peut être synchronisé normalement, avec contrôle obligatoire des anciens clones/worktrees avant réutilisation.

## 1. PROTO-0.2.2

Le candidat distribué a passé sa gate technique.

### À faire

- [ ] distribuer/continuer le playtest humain ;
- [ ] centraliser les retours sans modifier le jalon hors bug bloquant ;
- [ ] analyser compréhension, rythme, arbitrages, fatigue cognitive et identité visuelle ;
- [ ] décider explicitement de la clôture et de ce qui doit être repris dans les développements ultérieurs ;
- [ ] ne pas rétrofiter le PROTO pour adopter le gameplay continu de production ;
- [ ] ne pas injecter automatiquement les moteurs du Cœur dans le prototype.

Le tour par tour reste propre à ce prototype. Toute nouvelle itération de production vise un monde et un gameplay continus et asynchrones.

## 2. Cœur vivant / CŒUR-0

Le Cœur est le moteur autonome d’un monde avant les joueurs. Son implémentation propriétaire de laboratoire reste séparée du dépôt partageable.

### Acquis

- [x] moteur headless et simulations accélérées ;
- [x] reproductibilité de campagnes et reprise de baseline ;
- [x] divergence régionale et mémoire locale ;
- [x] campagnes longues multi-seeds et contrôles hors échantillon ;
- [x] diagnostic de l’établissement et du cycle précoce des lignées ;
- [x] chaîne fonctionnelle de variation, succès reproductif différentiel, transmission et changement générationnel démontrée ;
- [x] rôle des perturbations qualifié comme composante réelle du renouvellement et du filtrage, sans en faire un simple mécanisme destructeur à supprimer ;
- [x] absence de course monotone simple vers un optimum unique sur les horizons qualifiés ;
- [x] qualification temporelle longue jugée suffisante pour écarter, à ce stade, un ratchet conduisant à l’effondrement ou à la monoculture ;
- [x] qualification de largeur hors échantillon close sans nouvelle classe de fragilité structurelle ;
- [x] recherche biologique ouverte suffisamment close ; aucun prolongement biologique automatique justifié ;
- [x] principe d’un contrat sémantique de représentation indépendant des internes du Cœur ;
- [x] doctrine de robustesse explicitée : **robuste ne signifie pas immortel ni protégé par un sauvetage automatique**.

### Gate active — Cœur permanent / qualification opérationnelle

- [ ] définir `world_instance_id` et l’identité persistante d’un monde ;
- [ ] garantir qu’un redémarrage ne crée pas un second monde ;
- [ ] démontrer snapshots et restauration cohérents ;
- [ ] tester arrêt propre, reprise, crash et atomicité ;
- [ ] arbitrer et tester la politique de temps écoulé pendant une panne du Cœur ;
- [ ] valider migrations/versionnement sans perte d’histoire ;
- [ ] mesurer croissance des données, rétention, CPU, RAM, I/O, stockage et latence ;
- [ ] éprouver le runtime en fonctionnement continu réel par étapes d’endurance progressives ;
- [ ] conserver des cas adversariaux connus comme sentinelles privées de non-régression plutôt que les « corriger ».

### Règle de robustesse

Le Cœur n’a pas pour objectif de maintenir la vie coûte que coûte. Il doit pouvoir subir des pertes, raréfactions, crises, transformations durables, extinctions locales et récupérations incomplètes lorsque ces conséquences découlent de ses lois.

Ce qui doit être exclu est une fragilité triviale sous des situations admissibles, pas l’existence de conséquences sévères. Aucun mécanisme caché ne doit restaurer automatiquement l’état antérieur, garantir la survie ou maintenir artificiellement une diversité cible.

Une catastrophe cohérente peut appartenir à l’histoire d’un monde. Une corruption d’état, un bug ou une dérive numérique reste un défaut technique.

### Avant première production canonique

- [x] qualifier suffisamment le spectre temporel biologique pour cesser les prolongations exploratoires ;
- [ ] fixer et versionner l’interface temps biologique / temps canonique / orchestration humaine ;
- [ ] démontrer sauvegarde, restauration, reprise et migrations sans perte d’histoire ;
- [ ] éprouver le runtime en fonctionnement continu réel avec étapes d’endurance progressives ;
- [ ] stabiliser le contrat de lecture de production ;
- [ ] valider budgets cumulés, modes dégradés et stratégie de remplacement ;
- [ ] ne déclarer une instance canonique qu’après fermeture explicite de ces gates.

Voir : `docs/21_coeur_vivant_genese_canonique.md`, `docs/29_coeur_vivant_gate_suffisance.md`, `docs/30_coeur_vivant_selection_perturbations.md`, `docs/31_temporalite_canonique_genese.md`, `docs/32_coeur_contrat_lecture_modules.md` et `docs/33_multi_monde_capacite_et_tableau_univers.md`.

## 3. Périmètre v1.0 : relation jeu ↔ Cœur

La v1.0 conserve une frontière simple et volontaire à l’intérieur de chaque instance :

```text
Cœur autonome
    ↓
état canonique
    ↓
adaptateur de version
    ↓
projection / contrat de lecture versionné
    ↓
Fenêtre sur la Lisière, sonore, Tableaux, panneaux et jeu
```

Pour la **v1.0**, les actions de gameplay d’un Corcite **ne renvoient pas d’effet vers la biologie du Cœur**. Le jeu consomme le monde vivant ; il ne réécrit pas sa trajectoire biologique.

Un module ne lit pas directement les structures privées du Cœur. Le transport est remplaçable et distinct de la sémantique ; fixtures, replays et instance active doivent pouvoir présenter le même contrat. L’arrêt d’un client ne doit pas arrêter un Cœur sain.

Les rétroactions écologiques avancées restent des pistes de recherche post-v1. Elles ne doivent ni charger CŒUR-0 ni retarder la première production.

## 4. Multi-monde, capacité et Tableau Univers

### Décisions actées

- [x] le monde partagé unique est unique **par instance**, pas nécessairement pour toute la population humaine du service ;
- [x] plusieurs instances canoniques de production autonomes peuvent fonctionner en parallèle ;
- [x] chaque nouvelle instance part du même socle de lois/genèse versionné avec une seed privée distincte et développe sa propre histoire ;
- [x] aucune interaction canonique ou de gameplay n’existe entre les instances ;
- [x] un Corcite appartient à une seule instance et n’est ni migré ni copié vers une autre ;
- [x] un compte peut posséder plusieurs Corcites indépendants sur des mondes différents ;
- [x] le joueur choisit un monde ouvert disposant de capacité et peut rejoindre celui d’un proche si une place reste disponible ;
- [x] un monde peut fermer les nouvelles implantations puis rouvrir si de la capacité redevient réellement disponible ;
- [x] l’identité d’un monde est indépendante de la machine qui l’héberge ;
- [x] un Tableau Univers supervise l’ensemble des instances/hôtes et ouvre le Tableau Monde d’une instance sélectionnée ;
- [x] la Fenêtre sur la Lisière peut changer d’instance observée via un sélecteur simple sans déplacer le Corcite ni mélanger les histoires.

### À concevoir / tester

- [ ] définir la capacité de jouabilité d’un monde indépendamment de la seule capacité CPU/RAM ;
- [ ] définir une marge d’exploitation sûre par host ;
- [ ] rendre stockage, sauvegardes, logs et contrats strictement namespacés par `world_instance_id` ;
- [ ] démontrer la migration d’un monde vers un autre host sans changement d’identité ;
- [ ] empêcher techniquement tout mélange de caches, flux, sauvegardes ou événements entre instances ;
- [ ] construire le Tableau Univers et son inventaire hôtes/instances ;
- [ ] calculer une prévision de saturation à partir des inscriptions, de l’activité, de la capacité restante et de la croissance ;
- [ ] intégrer le délai de provisionnement + genèse/maturation + marge pour alerter suffisamment tôt ;
- [ ] conserver d’abord une validation humaine explicite de l’action « faire naître un monde » ;
- [ ] définir le gate de maturité avant ouverture aux joueurs ;
- [ ] concevoir une politique d’inactivité très longue qui puisse libérer de la capacité sans supprimer silencieusement progression ou identité.

La fréquentation peut donc déclencher une **alerte de création d’une nouvelle instance**, mais elle ne modifie jamais le facteur temporel, la biologie ou les lois d’un monde existant.

Voir : `docs/33_multi_monde_capacite_et_tableau_univers.md`.

## 5. Fenêtre sur la Lisière / Orée

La **Fenêtre sur la Lisière** est un module permanent du projet final, pas une démo destinée à être supprimée.

Son emplacement exact reste ouvert : page d’accueil, page dédiée de contemplation ou accès multiples. Elle doit pouvoir rester disponible lorsque le jeu complet existe et continuer à montrer un vrai monde canonique sélectionné. Elle affiche un âge d’Avelune dérivé de l’âge canonique de l’instance observée sans exposer les paramètres internes du Cœur.

### Avant production

- [ ] stabiliser le contrat de lecture minimal nécessaire ;
- [ ] inclure et vérifier l’identité d’instance de bout en bout ;
- [ ] vérifier par liste positive qu’aucune donnée privée inutile n’est envoyée au client ;
- [ ] valider fixtures, replays et états réels derrière la même interface ;
- [ ] démontrer resynchronisation et reprise sur état complet ;
- [ ] mesurer budgets client/serveur et modes dégradés ;
- [ ] vérifier qu’un changement du Cœur peut être absorbé par adaptateur/migration sans réécrire la grammaire visuelle.

### Production

- [ ] brancher la Fenêtre sur les vrais états canoniques après qualification suffisante du Cœur ;
- [ ] la mettre en ligne comme premier consommateur permanent privilégié ;
- [ ] fournir un sélecteur simple de Lisière/instance observée ;
- [ ] conserver la priorité à la contemplation, l’onirisme, la féerie et l’imagination ;
- [ ] ne jamais transformer la façade publique en exposition des mécanismes propriétaires du Cœur ou d’un background réservé.

Voir : `docs/24_visuel_coeur_contrat_public.md`, `docs/32_coeur_contrat_lecture_modules.md` et `docs/33_multi_monde_capacite_et_tableau_univers.md`.

## 6. Univers sonore

### Acquis de conception

- [x] le Cœur reste le moteur de l’état canonique ;
- [x] le sonore est un interpréteur en aval, au même niveau conceptuel que le visuel ;
- [x] direction : satisfaisante, contemplative, onirique et féerique ;
- [x] séparation musique du monde / sons du jeu / signaux d’information ;
- [x] accessibilité sensorielle paramétrique ;
- [x] séparation explicite entre contrat partageable et recettes propriétaires.

### À reprendre

- [ ] définir la grammaire musicale d’Avelune ;
- [ ] définir mémoire et transformation des motifs ;
- [ ] arbitrer la part commune au monde et l’adaptation locale ;
- [ ] fixer contraintes de sécurité et de confort sonore ;
- [ ] mesurer le budget cumulé avec le jeu et le visuel ;
- [ ] comparer les moteurs de rendu sur un prototype isolé ;
- [ ] choisir une technologie seulement à partir de besoins stabilisés.

Voir : `docs/23_univers_sonore_contrat_public.md`.

## 7. Tableau Réel — TA3

Le Gate 0 a invalidé l’idée de dépendre du conteneur ou de la base du PROTO. Le Gate B a ensuite figé le socle autonome minimal.

### Phase A — terminée

- [x] audit du runtime et de la base PROTO ;
- [x] métriques temporaires de sessions identifiées ;
- [x] architecture autonome décidée ;
- [x] date zéro fixée au 26 juillet 2026 ;
- [x] séparation des données destinées à la publication et des données internes.

### Phase B — terminée

- [x] audit du socle persistant hors PROTO ;
- [x] absence de socle TA3 existant pertinent établie ;
- [x] service applicatif autonome unique retenu ;
- [x] SQLite retenu comme stockage persistant propre ;
- [x] absence de PostgreSQL supplémentaire actée ;
- [x] publication sans port hôte dédié possible via le reverse proxy ;
- [x] staging énergie AVLAB existant identifié et qualifié comme non canonique ;
- [x] besoin d’une destination de sauvegarde Avelune dédiée hors hôte identifié.

### Phase C — prochaine

- [ ] créer le workspace et le runtime TA3 propres ;
- [ ] créer le schéma SQLite et ses migrations ;
- [ ] implémenter événements, provenance, statuts de vérité, corrections et idempotence ;
- [ ] charger la baseline financière et institutionnelle ;
- [ ] produire une sauvegarde SQLite cohérente ;
- [ ] démontrer une restauration locale complète.

Puis : adaptateurs énergie/PROTO, interface publique, sauvegarde hors hôte dédiée et tests d’indépendance.

Voir `docs/real/`, notamment `docs/real/CAHIER_DES_CHARGES.md`.

## 8. Recherche post-v1 — interaction Corcite / monde vivant

Le pool d’idées conserve, sans les transformer en décisions de production :

- ressources éventuellement épuisables avec renouvellement, transformation ou nouvelles opportunités ;
- possibilité que certaines ressources soient une traduction gameplay de populations ou lignées vivantes ;
- conséquences écologiques positives, négatives ou mixtes de certaines exploitations ;
- modifications externes du milieu ou de perturbations ;
- déplacement ou réancrage avancé d’un Corcite.

Ces pistes peuvent être étudiées ultérieurement en laboratoire. Elles ne constituent pas des fonctionnalités promises de la v1.0 et ne doivent pas être introduites dans le Cœur autonome sans gate explicite.

## 9. Documentation et gouvernance

- [x] GitHub est la source de vérité des contenus destinés au dépôt ;
- [x] frontière public/secret du Cœur et des interpréteurs formalisée ;
- [x] contrats visuel et sonore partageables séparés des recettes propriétaires ;
- [x] projection publique, resynchronisation et frontières de version documentées ;
- [x] séparation explicite v1.0 entre lecture du Cœur et futures rétroactions écologiques ;
- [x] statut permanent de la Fenêtre sur la Lisière documenté ;
- [x] robustesse du Cœur distinguée explicitement d’une immortalité ou d’un sauvetage administratif ;
- [x] qualification biologique/adversariale suffisamment close ;
- [x] frontière générale de lecture des modules documentée ;
- [x] architecture multi-monde et Tableau Univers documentés sans divulguer de background réservé ;
- [x] cahier des charges complet TA3 documenté après Gate B ;
- [ ] conserver hors dépôt les détails propriétaires et opérationnels ;
- [ ] ne supprimer une information sensible d’un stockage temporaire qu’après vérification de sa copie de référence.

## 10. Principes invariants

- monde partagé persistant **par instance** ;
- plusieurs mondes de production possibles sans interaction entre eux ;
- Corcite lié à son monde, sans migration de progression inter-instance ;
- identité d’instance indépendante de la machine physique ;
- Corcite comme personnage, organisme et cité ;
- progression principalement horizontale ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO comme moteur de rétention ;
- plusieurs styles de jeu légitimes ;
- accessibilité intégrée ;
- sobriété technique ;
- un monde robuste peut souffrir, perdre et changer : robustesse n’est ni immobilité ni immortalité ;
- séparation entre prototype, monde autonome, instrumentation du projet et représentations visuelle/sonore ;
- interpréteurs branchés sur un contrat versionné, jamais sur les internes provisoires du Cœur ;
- projection minimale avant envoi aux clients ;
- protocoles de transport distincts de la sémantique ;
- versions source/contrat/grammaire/renderer découplées ;
- budgets de ressources arbitrés au niveau du système complet ;
- aucune idée future ne devient une obligation simplement parce qu’elle est techniquement possible ou cohérente avec le monde.
