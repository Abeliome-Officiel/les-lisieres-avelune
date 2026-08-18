# Roadmap — Les Lisières d’Avelune

## État au 18 août 2026

Le projet avance sur plusieurs chantiers distincts, avec une règle de priorité claire : **le Cœur autonome doit être suffisamment viable, compris et exploitable avant de devenir le monde canonique de production**.

| Axe | État | Prochaine gate |
|---|---|---|
| PROTO jouable | PROTO-0.2.2 conservé comme jalon historique de validation | playtests puis clôture explicite, sans rétrofit de son architecture en tours |
| Cœur vivant | qualification biologique et adversariale suffisamment close ; aucun prolongement biologique ouvert | ingénierie du Cœur permanent, qualification opérationnelle, puis interface temporelle canonique |
| Fenêtre sur la Lisière | module contemplatif définitif cadré, LAB possible sur contrat/fixtures | production après qualification opérationnelle suffisante et stabilisation du contrat de lecture |
| Tableau Réel | Gate 0 validé | poursuivre son socle autonome hors PROTO |

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

Le Cœur est le monde autonome avant les joueurs. Son implémentation propriétaire de laboratoire reste séparée du dépôt partageable.

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

- [ ] définir l’identité persistante d’une instance et garantir qu’un redémarrage ne crée pas un second monde ;
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

Une catastrophe cohérente peut appartenir à l’histoire d’Avelune. Une corruption d’état, un bug ou une dérive numérique reste un défaut technique.

### Avant instance canonique

- [x] qualifier suffisamment le spectre temporel biologique pour cesser les prolongations exploratoires ;
- [ ] fixer et versionner l’interface temps biologique / temps canonique / orchestration humaine ;
- [ ] démontrer sauvegarde, restauration, reprise et migrations sans perte d’histoire ;
- [ ] éprouver le runtime en fonctionnement continu réel avec étapes d’endurance progressives ;
- [ ] stabiliser le contrat de lecture de production ;
- [ ] valider budgets cumulés, modes dégradés et stratégie de remplacement ;
- [ ] ne déclarer une instance canonique qu’après fermeture explicite de ces gates.

Voir : `docs/21_coeur_vivant_genese_canonique.md`, `docs/29_coeur_vivant_gate_suffisance.md`, `docs/30_coeur_vivant_selection_perturbations.md`, `docs/31_temporalite_canonique_genese.md` et `docs/32_coeur_contrat_lecture_modules.md`.

## 3. Périmètre v1.0 : relation jeu ↔ Cœur

La v1.0 conserve une frontière simple et volontaire :

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

Les rétroactions écologiques avancées — par exemple exploitation transformant le milieu ou modification indirecte de perturbations — restent des pistes de recherche post-v1. Elles ne doivent ni charger CŒUR-0 ni retarder la première production.

## 4. Fenêtre sur la Lisière / Orée

La **Fenêtre sur la Lisière** est un module permanent du projet final, pas une démo destinée à être supprimée.

Son emplacement exact reste ouvert : page d’accueil, page dédiée de contemplation ou accès multiples. Elle doit pouvoir rester disponible lorsque le jeu complet existe et continuer à montrer le même monde canonique. Elle affiche un âge d’Avelune dérivé de l’âge canonique sans exposer les paramètres internes du Cœur.

### Avant production

- [ ] stabiliser le contrat de lecture minimal nécessaire ;
- [ ] vérifier par liste positive qu’aucune donnée privée inutile n’est envoyée au client ;
- [ ] valider fixtures, replays et état réel derrière la même interface ;
- [ ] démontrer resynchronisation et reprise sur état complet ;
- [ ] mesurer budgets client/serveur et modes dégradés ;
- [ ] vérifier qu’un changement du Cœur peut être absorbé par adaptateur/migration sans réécrire la grammaire visuelle.

### Production

- [ ] brancher la Fenêtre sur le vrai état canonique après qualification suffisante du Cœur ;
- [ ] la mettre en ligne comme premier consommateur permanent privilégié du monde vivant ;
- [ ] conserver la priorité à la contemplation, l’onirisme, la féerie et l’imagination ;
- [ ] ne jamais transformer la façade publique en exposition des mécanismes propriétaires du Cœur.

Voir : `docs/24_visuel_coeur_contrat_public.md` et `docs/32_coeur_contrat_lecture_modules.md`.

## 5. Univers sonore

### Acquis de conception

- [x] le Cœur reste le moteur de l’état canonique ;
- [x] le sonore est un interpréteur en aval, au même niveau conceptuel que le visuel ;
- [x] direction : satisfaisante, contemplative, onirique et féerique ;
- [x] séparation musique du monde / sons du jeu / signaux d’information ;
- [x] accessibilité sensorielle paramétrique ;
- [x] séparation explicite entre contrat partageable et recettes internes.

### À reprendre

- [ ] définir la grammaire musicale d’Avelune ;
- [ ] définir mémoire et transformation des motifs ;
- [ ] arbitrer la part commune au monde et l’adaptation locale ;
- [ ] fixer contraintes de sécurité et de confort sonore ;
- [ ] mesurer le budget cumulé avec le jeu et le visuel ;
- [ ] comparer les moteurs de rendu sur un prototype isolé ;
- [ ] choisir une technologie seulement à partir de besoins stabilisés.

Voir : `docs/23_univers_sonore_contrat_public.md`.

## 6. Tableau Réel — TA3

Le Gate 0 a invalidé l’idée de dépendre du conteneur ou de la base du PROTO.

### Phase A — terminée

- [x] audit du runtime et de la base PROTO ;
- [x] métriques temporaires de sessions identifiées ;
- [x] architecture autonome décidée ;
- [x] date zéro fixée au 26 juillet 2026 ;
- [x] séparation des données destinées à la publication et des données internes.

### Phase B — prochaine

- [ ] auditer le socle persistant hors PROTO ;
- [ ] choisir le plus petit runtime autonome approprié ;
- [ ] créer le stockage TA3 propre ;
- [ ] migrations réversibles et testées si nécessaire ;
- [ ] démontrer que TA3 reste disponible PROTO arrêté.

Voir `docs/real/`.

## 7. Recherche post-v1 — interaction Corcite / monde vivant

Le pool d’idées conserve, sans les transformer en décisions de production :

- ressources éventuellement épuisables avec renouvellement, transformation ou nouvelles opportunités ;
- possibilité que certaines ressources soient une traduction gameplay de populations ou lignées vivantes ;
- conséquences écologiques positives, négatives ou mixtes de certaines exploitations ;
- modifications externes du milieu ou de perturbations ;
- déplacement ou réancrage avancé d’un Corcite.

Ces pistes peuvent être étudiées ultérieurement en laboratoire. Elles ne constituent pas des fonctionnalités promises de la v1.0 et ne doivent pas être introduites dans le Cœur autonome sans gate explicite.

## 8. Documentation et gouvernance

- [x] GitHub est la source de vérité des contenus destinés au dépôt ;
- [x] frontière public/secret du Cœur et des interpréteurs formalisée ;
- [x] contrats visuel et sonore partageables séparés des recettes propriétaires ;
- [x] projection publique, resynchronisation et frontières de version documentées ;
- [x] séparation explicite v1.0 entre lecture du Cœur et futures rétroactions écologiques ;
- [x] statut permanent de la Fenêtre sur la Lisière documenté ;
- [x] robustesse du Cœur distinguée explicitement d’une immortalité ou d’un sauvetage administratif ;
- [x] qualification biologique/adversariale suffisamment close ;
- [x] frontière générale de lecture des modules documentée ;
- [ ] conserver hors dépôt les détails propriétaires et opérationnels ;
- [ ] ne supprimer une information sensible d’un stockage temporaire qu’après vérification de sa copie de référence.

## 9. Principes invariants

- monde partagé persistant ;
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