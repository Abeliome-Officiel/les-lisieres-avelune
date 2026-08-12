# Avelune — état de développement au 12 août 2026

## Situation générale

Trois chantiers sont maintenant explicitement séparés :

1. **PROTO-0.2.2** : prototype jouable distribué destiné au playtest ;
2. **Cœur vivant / CŒUR-0** : laboratoire headless du monde autonome, distinct du prototype ;
3. **Tableau Réel (TA3)** : instrument persistant du projet réel, indépendant du cycle de vie des prototypes.

## Dépôt GitHub

Le chantier de nettoyage de l'ancien historique est clos et la synchronisation normale du dépôt est de nouveau autorisée. Les anciens clones et worktrees doivent être contrôlés avant réutilisation afin de ne pas réintroduire un ancien historique.

`main` reste la baseline stable d'intégration. Le candidat jouable courant reste `develop/proto-0.2.2-playtest`, référence fonctionnelle `d3b080c`. Son intégration dans `main` reste une décision explicite et ne doit pas être remplacée par un reset ou une fusion automatique.

## PROTO-0.2.2

Le candidat distribué a validé :

- `svelte-check` sans erreur ni warning ;
- 380 tests PROTO réussis ;
- build production ;
- PostgreSQL réel et migration ;
- création, reprise et sauvegarde des sessions ;
- journalisation des conflits LWW ;
- feedback persistant et notification SMTP non destructive ;
- revue desktop/mobile acceptable pour diffusion.

## Cœur vivant — laboratoire

R1.1 a validé la première baseline saine du moteur du monde : stabilité longue, persistance, reprise exacte, divergence régionale et effets persistants des vagues.

R2.6 a réfuté l'hypothèse d'un favoritisme direct caché de l'établissement vers les cellules déjà partiellement occupées. Le signal mesuré s'explique surtout par le contexte écologique et spatial.

R2.7 est retenu comme baseline de travail pour l'établissement. Les campagnes longues montrent environ 15 % d'arrivées rejetées avant établissement, une coexistence moyenne augmentée d'environ 17 %, un turnover local réduit d'environ 14 à 15 %, et pas de modification démontrée de l'occupation globale ou de la persistance longue des lignées.

R2.8 et R2.9 montrent que les lignées disparues meurent presque toujours avant leur première propagation locale et alors qu'elles occupent encore une implantation unique. Les vagues apparaissent très souvent comme cause terminale, sans suffire à distinguer à elles seules la cause profonde.

R2.10 mesure donc le goulot précoce : atteinte de l'état permettant la première propagation, délai avant propagation, exposition cumulée aux vagues et contexte de disparition. Une campagne de 128 paires × 100 ans, soit 25 600 années simulées, est en cours le 12 août. Aucun verdict n'est consigné avant son résultat.

L'implémentation détaillée du laboratoire reste hors du dépôt GitHub ; GitHub ne conserve que le contrat de production et les résultats agrégés utiles à la validation.

## Tableau Réel (TA3)

Le Gate 0 est validé. TA3 doit être une brique persistante autonome et non une fonctionnalité dépendante de la base ou du conteneur éphémère d'un PROTO.

Principes retenus :

- stockage et runtime propres ;
- adaptateurs unidirectionnels vers les sources ;
- historique propre des métriques importées ;
- une source indisponible rend sa donnée ancienne ou inconnue mais ne rend pas TA3 indisponible ;
- événements et provenance avant agrégats ;
- séparation stricte entre données destinées à la publication et données internes.

La prochaine phase commence par l'audit des capacités persistantes disponibles hors PROTO. Aucune migration TA3 ne doit être créée dans la base du PROTO.

Le précédent brouillon de PR du Tableau Réel ne doit pas être fusionné tel quel : son hypothèse d'intégration directe à l'application existante est dépassée par le Gate 0.

## Frontière documentaire

GitHub redevient la source de vérité des contrats, décisions partageables et du code destiné au dépôt. Drive peut rester un espace de travail et d'archives, mais ne doit plus remplacer GitHub pour la documentation partageable. Les informations propriétaires et opérationnelles restent dans les espaces privés prévus à cet effet.

## Suite

1. Lire R2.10 avant d'introduire un nouveau mécanisme écologique.
2. Tester en parallèle deux mécanismes concurrents si deux hypothèses restent plausibles.
3. Reprendre TA3 à la Phase B sur son architecture autonome.
4. Décider séparément de l'intégration de PROTO-0.2.2 dans `main` après vérification de la branche post-nettoyage.
