# ✦ Les Lisières d’Avelune

> **Un monde partagé à habiter, comprendre et transformer.**

**Les Lisières d’Avelune** est un projet de jeu navigateur persistant centré sur le développement d’un **Corcite**, corps-cité organique vivant, dans un monde autonome qui continue d’exister indépendamment de la présence des joueurs.

**Poétique · Onirique · Féerique · Organique · Minéral · Floral-abstrait · Queer**

---

## État du projet — 22 août 2026

| Axe | État actuel |
|---|---|
| **PROTO-0 → PROTO-0.2.2** | **CLOS / HISTORIQUE** — objectif de validation rempli ; aucun nouveau développement, playtest structurant ou retrofit de production |
| **Cœur vivant / CŒUR-0** | qualification biologique suffisamment close ; O1 72 h **PASS / CLOSED / FROZEN** ; **P0-AUTH + neutralité + O2/O3/O4 PASS / CLOSED** ; P0 reste fermé |
| **P1 — Lecteur du Cœur** | baseline offline et convergence transverse qualifiées ; **CREAD-LIVE PASS au niveau applicatif / FROZEN** |
| **P3 — Orchestrateur** | ORCH-0 offline qualifié et gelé ; **ORCH-1 est la gate critique active** |
| **P2 — Observabilité** | surface autonome OBS-1 qualifiée ; finalisation unique gelée jusqu’après ORCH-1 |
| **P4 — Tableaux Monde / Univers** | baseline offline qualifiée ; raccord live après disponibilité des sources qualifiées |
| **P5A — Visuel** | baseline offline qualifiée ; frontière convergée avec P1 qualifiée ; live après les gates amont |
| **P5B — Musique / Sonore** | baseline offline globale qualifiée ; frontière convergée avec P1 qualifiée ; live après les gates amont |
| **P6 — Fenêtre sur les Avelunes** | P6-0 offline qualifié ; contrat de fondation prêt ; intégration live après P3/P2/O5 |
| **Tableau Réel — TA3** | service autonome séparé du PROTO ; surfaces publique et privée distinctes ; écritures privées toujours soumises à leurs gates de sécurité |

Le nettoyage contrôlé de l’ancien historique GitHub est **clos**. Les références actuelles sont la source de vérité ; tout ancien clone ou worktree issu d’un graphe antérieur doit être contrôlé avant réutilisation.

`main` reste la **baseline stable d’intégration** du dépôt partageable.

### Accès rapide

- [Roadmap actuelle](ROADMAP.md)
- [Index documentaire](docs/index.md)
- [CREAD-LIVE — architecture et PASS applicatif](docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md)
- [Clôture P0-AUTH / O2 / O3 / O4](docs/development/P0_AUTH_CLOSURE_2026-08-21.md)
- [Clôture du PRE-P6 transverse](docs/development/PRE_P6_TRANSVERSE_2026-08-21.md)
- [Clôture du PROTO](docs/development/PROTO_CLOSURE_2026-08-20.md)
- [Cœur vivant — genèse canonique](docs/21_coeur_vivant_genese_canonique.md)
- [Cœur vivant — contrat de lecture des modules](docs/32_coeur_contrat_lecture_modules.md)
- [Multi-monde, capacité et Tableau Univers](docs/33_multi_monde_capacite_et_tableau_univers.md)
- [Univers sonore](docs/23_univers_sonore_contrat_public.md)
- [Visuel du Cœur](docs/24_visuel_coeur_contrat_public.md)
- [Tableau Réel](docs/real/README.md)

---

## PROTO — chantier terminé

La lignée **PROTO-0 / PROTO-0.1 / PROTO-0.2 / PROTO-0.2.2** a servi à éprouver rapidement des boucles de jeu, l’interface et un mode de diffusion de playtest. Elle constitue désormais un **jalon historique**, pas une base de production.

Conséquences :

- le PROTO n’est plus un chantier actif ;
- aucune dette technique propre au PROTO ne remonte automatiquement dans le backlog courant ;
- aucune modernisation ou migration de son architecture n’est engagée pour préparer le futur jeu ;
- ses branches, tests et documents peuvent être conservés pour traçabilité ;
- le tour par tour du PROTO ne devient pas la structure temporelle du jeu final ;
- le Cœur, TA3 et les modules P1–P8 ne dépendent pas du runtime ou de la base du PROTO ;
- une éventuelle instance encore en ligne est seulement en maintien transitoire jusqu’à son décommissionnement.

Une expérience locale de durcissement des secrets a été testée mais **non intégrée** : elle n’a été ni poussée ni déployée et est volontairement abandonnée avec le prototype. Elle ne constitue pas un chantier restant.

Voir [la décision de clôture](docs/development/PROTO_CLOSURE_2026-08-20.md).

---

## Cœur vivant et architecture durable

Le **Cœur vivant** est l’autorité canonique sur l’état vivant d’une Avelune. Il doit pouvoir fonctionner avant les joueurs, conserver son histoire et survivre au remplacement de ses représentations.

O1 a qualifié le fonctionnement continu initial du Cœur sur 72 h réelles. **P0-AUTH est fermé avec PASS**, ainsi que la neutralité biologique/RNG, O2 arrêt/reprise, O3 crash/atomicité et O4. L’autorité canonique associe au même état committé l’identité persistante du monde, sa révision canonique et son âge canonique exact. La politique qualifiée d’indisponibilité du Cœur est **PAUSE** : le temps mural écoulé pendant l’arrêt n’est pas transformé automatiquement en vieillissement canonique.

**CREAD-LIVE v1 est désormais qualifié au niveau applicatif.** P1 ne lit pas directement le stockage privé du Cœur : la lecture, la validation, la normalisation et l’allowlist sont réalisées avant la frontière du Lecteur. Le transport local v1 utilise une Unix Domain Socket et reste remplaçable ; les détails d’exploitation et secrets techniques restent privés. Replay et live ont été qualifiés comme sémantiquement équivalents au niveau publié, et P1 demeure l’unique autorité de continuité.

La gate critique active est maintenant **P3 / ORCH-1**. Elle doit matérialiser l’isolation système et l’exploitation réelle du socle P0/P1 sans redessiner leurs contrats. Ensuite viennent **P2 / OBS-1 finalisation → P4 si nécessaire → O5-MIGRATION obligatoire**, puis les raccords live aval. Voir [CREAD-LIVE](docs/development/CREAD_LIVE_ARCHITECTURE_2026-08-22.md) et [la clôture P0-AUTH](docs/development/P0_AUTH_CLOSURE_2026-08-21.md).

L’architecture durable suit une séparation d’autorité stricte :

```text
CŒUR / état canonique privé
        ↓
frontière CREAD privée et allowlistée
        ↓
P1 — Lecteur du Cœur
        ↓
ReadSessionItem
├─ WorldReadEnvelope
└─ ContinuityDecision
        ↓
   ┌────┴────┐
   ↓         ↓
 P5A       P5B
visuel    sonore
   └────┬────┘
        ↓
P6 — Fenêtre sur les Avelunes
```

P1 est l’unique autorité de continuité. Les consommateurs aval peuvent valider la forme de leurs entrées, mais ne recalculent ni gap, ni doublon, ni changement de session ou de monde depuis `state_revision`, `publication_seq` ou `canonical_age`.

En parallèle :

- **P2 Observabilité** mesure sans devenir autorité ;
- **P3 Orchestrateur** porte le control plane et le cycle de vie des mondes ;
- **P4 Tableaux Monde / Univers** fournit les vues opérateur à partir de P1/P2/P3 ;
- le futur serveur de jeu restera une autorité de domaine séparée ;
- aucune représentation ne doit écrire dans la biologie du Cœur par commodité.

**P0 + P1 est maintenant le socle canonique fonctionnel d’Avelune au niveau théorique/LAB** : Cœur autoritatif + interface live applicative qualifiée. Cela ne remplace pas la qualification d’exploitation P3, l’observabilité complète P2, O5-MIGRATION ni l’endurance intégrée.

---

## Plusieurs Avelunes, une identité indépendante des machines

L’architecture autorise plusieurs instances canoniques autonomes en parallèle. Chaque Avelune :

- possède un `world_instance_id` stable ;
- conserve sa propre histoire ;
- ne se confond pas avec son host ;
- ne partage pas son canon avec une autre instance ;
- doit pouvoir être sauvegardée, restaurée et migrée sans changer d’identité.

Un compte pourra observer ou rejoindre plusieurs mondes selon les règles du futur jeu, mais un Corcite appartient à une seule Avelune et ne devient pas un objet migrable entre mondes.

---

## Fenêtre sur les Avelunes

La **Fenêtre sur les Avelunes** est un produit permanent, contemplatif et non administratif. Elle assemble les projections du Lecteur, le Visuel et le Sonore afin de montrer une Avelune vivante sans devenir une seconde vérité du monde.

La fondation P6-0 est qualifiée offline et le gate transverse P1↔P5A↔P5B est clos avec PASS. CREAD-LIVE est également qualifié au niveau applicatif. Le contrat de fondation P6 reste prêt et le travail offline peut continuer ; le **raccord live** attend désormais la séquence **P3 ORCH-1 → P2 OBS-1 FINALIZATION → O5-MIGRATION** et une autorisation explicite de phase.

---

## Tableau Réel

Le **Tableau Réel (TA3)** mesure le projet Avelune dans le monde réel : temps humain, matériel, énergie, dépenses, financement, empreinte carbone connue et quelques indicateurs agrégés.

TA3 est volontairement autonome : il ne dépend ni du conteneur ni de la base du PROTO. Sa surface publique est en lecture seule ; sa surface privée est distincte et les écritures restent bloquées tant que leurs gates d’authentification et de sécurité ne sont pas fermées.

Voir [`docs/real/`](docs/real/README.md).

---

## Direction du jeu à long terme

Principes structurants :

- monde partagé persistant par instance ;
- Corcite comme personnage, organisme et cité ;
- progression principalement horizontale ;
- plusieurs styles de jeu légitimes ;
- coopération possible sans obligation sociale permanente ;
- échec fertile et absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO ou de micro-dopamine comme moteur de rétention ;
- accessibilité intégrée ;
- identité queer et non genrée intégrée à la conception ;
- gameplay de production continu et asynchrone plutôt que dépendant d’un tour global ;
- représentations visuelles et sonores strictement en aval du canon.

---

## Frontière de publication

GitHub est la source de vérité du **code et de la documentation partageables**.

Les recettes propriétaires du Cœur, seeds, paramètres, causalités détaillées, CODEX, credentials, clés privées et informations d’exploitation sensibles restent hors dépôt. Le fait que le dépôt soit privé ne transforme pas ces éléments en contenu GitHub acceptable.

Les documents historiques restent disponibles pour la traçabilité, mais leur présence ne leur redonne pas autorité sur les référentiels plus récents.
