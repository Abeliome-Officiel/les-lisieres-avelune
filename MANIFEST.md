# Manifeste du dépôt

## État courant — 20 août 2026

Projet : **Les Lisières d’Avelune**  
Baseline d’intégration : `main`  
PROTO : **CLOS / HISTORIQUE**  
Chantiers structurants : **Cœur permanent / qualification opérationnelle**, **P1–P6**, **Tableau Réel (TA3)**, **gouvernance GitHub et sécurité**.

Le dépôt GitHub contient uniquement les éléments destinés au développement partagé. Les informations classées dans les espaces internes ne sont pas inventoriées ici. La frontière de publication porte sur le contenu comme sur la structure documentaire.

## Politique d’intégrité

Git est la source d’intégrité fichier par fichier. `MANIFEST.md` décrit les ensembles sémantiques du dépôt et ne duplique pas les SHA que Git maintient déjà.

Le nettoyage contrôlé de l’ancien historique GitHub est **clos**. Les références actuelles sont la source de vérité. Un ancien clone ou worktree issu d’un graphe antérieur doit être contrôlé avant réutilisation afin de ne pas réintroduire un historique obsolète.

Cette clôture historique n’équivaut pas à une fin de l’hygiène GitHub courante : classification des branches, PR draft historiques, protection de `main`, CI et sécurité restent des sujets distincts.

---

## Ensembles principaux

### Application historique / PROTO

`app/` et `infra/` contiennent notamment les implémentations issues des prototypes jouables intégrés au dépôt.

Leur présence est **historique**. Depuis le 20 août 2026, la lignée PROTO-0 → PROTO-0.2.2 n’est plus une cible de développement, de modernisation ou de production.

Référence : `docs/development/PROTO_CLOSURE_2026-08-20.md`.

Les branches PROTO peuvent rester disponibles pendant l’hygiène GitHub pour traçabilité ; leur présence ne leur confère aucun statut actif.

### Cœur vivant et contrat de lecture

Documentation partageable principale :

- `docs/21_coeur_vivant_genese_canonique.md`
- `docs/22_coeur_vivant_validation_2026-08-12.md` — état historique daté ;
- `docs/25_coeur_vivant_references_methode.md`
- `docs/28_coeur_vivant_synthese_trans_echelles.md`
- `docs/29_coeur_vivant_gate_suffisance.md`
- `docs/30_coeur_vivant_selection_perturbations.md`
- `docs/31_temporalite_canonique_genese.md`
- `docs/32_coeur_contrat_lecture_modules.md`
- `docs/33_multi_monde_capacite_et_tableau_univers.md`

La recherche biologique ouverte de CŒUR-0 est considérée suffisamment close. Le chantier actif est la qualification opérationnelle du Cœur permanent selon les gates prévues.

Le moteur détaillé, les paramètres, seeds, causalités propriétaires et données privées restent hors GitHub.

### P1 — Lecteur du Cœur

`docs/32_coeur_contrat_lecture_modules.md` est l’autorité partageable de la frontière Cœur → modules.

Contrats :

- `docs/contracts/world-read-envelope-v0.1.schema.json`
- `docs/contracts/avelune-semantic-replay-v0.1.md`

Architecture de principe :

```text
Cœur privé
   ↓
P1 / normalisation privée
   ↓
WorldReadEnvelope
   ↓
projections allowlistées
   ├─ VisualPayload
   └─ MusicPayload
```

P1 possède la continuité de publication et la resynchronisation. Les consommateurs ne reconstituent pas cette autorité chacun de leur côté.

### P2 — Observabilité

Observabilité non autoritative, qualifiée offline : santé, fraîcheur, métriques, incidents et rétention. Elle ne peut ni muter le canon ni déclencher une action d’exploitation par elle-même.

### P3 — Orchestrateur

Control plane séparé, qualifié offline : inventaire monde/host, opérations idempotentes, locks, confirmations et recovery. Les secrets restent référencés sans être embarqués dans les artefacts partageables.

### P4 — Tableaux Monde / Univers

Vues opérateur construites à partir des surfaces P1/P2/P3. Les Tableaux ne lisent pas directement le Cœur et ne deviennent pas autorité.

### P5A — Visuel

Documentation partageable :

- `docs/24_visuel_coeur_contrat_public.md`

Le visuel consomme `VisualPayload` et reste strictement en aval du canon. Les baselines historiques VISUEL restent des preuves ; la trajectoire active est la baseline P5A qualifiée derrière P1.

### P5B — Musique / Sonore

Documentation et terrain partageables :

- `docs/23_univers_sonore_contrat_public.md`
- `docs/26_univers_sonore_references_methode.md`
- `docs/27_musique0_cahier_integration.md`
- `lab/musique0/` pour les éléments présents sur `main`.

P5B consomme `MusicPayload`, maintient une mémoire bornée et reconstructible et reste non autoritatif. Le renderer final reste remplaçable.

### P6 — Fenêtre sur les Avelunes

P6 assemble P1 + P5A + P5B dans un produit contemplatif permanent. La fondation P6-0 est qualifiée offline ; les phases live attendent les gates Cœur/P1 correspondantes.

### Tableau Réel

`docs/real/`

TA3 est une brique persistante autonome et indépendante du PROTO. Ses surfaces publique et privée sont séparées ; toute écriture privée reste soumise à ses gates de sécurité.

### Documentation architecture/développement

`docs/development/`

Contient les états datés, audits, architecture actuelle/cible, arbitrages de pérennité, politique de données, méthode de développement, stratégie tests/sécurité/persistance et ADR structurants.

Les états datés restent historiques. L’état courant se lit d’abord dans `README.md`, `ROADMAP.md` et `docs/index.md`.

### Conception et historique

- `docs/conception/`
- documents numérotés sous `docs/`
- `logs/`
- `csv/`
- `data/`
- `design-data/`

Plusieurs générations de conception sont volontairement conservées. Leur présence n’en fait pas toutes des références runtime actuelles.

---

## Frontière de publication

GitHub est traité comme une surface de publication même lorsque le dépôt est privé.

Le dépôt peut contenir :

- contrats et interfaces partageables ;
- exigences et décisions ;
- résultats suffisamment agrégés ;
- références scientifiques et artistiques ;
- code et outils destinés au dépôt.

Le dépôt ne doit pas contenir :

- credentials ou secrets runtime ;
- clés privées ou recovery codes ;
- seeds privées ;
- recettes propriétaires du Cœur ;
- causalités détaillées réservées ;
- CODEX ou inventaires de secrets ;
- dumps privés utilisés comme substitut à une projection shareable.

Un artefact partageable est généré explicitement par allowlist ; ce n’est pas un artefact privé dont quelques champs auraient été masqués.

---

## Source de vérité documentaire

Pour l’état courant :

1. `README.md`
2. `ROADMAP.md`
3. `docs/index.md`
4. `docs/development/PROTO_CLOSURE_2026-08-20.md` pour le statut du PROTO
5. documentation Cœur : `docs/21_*`, `docs/25_*`, `docs/28_*`, `docs/29_*`, `docs/30_*`, `docs/31_*`, `docs/32_*`, `docs/33_*`
6. contrats P1 : `docs/32_coeur_contrat_lecture_modules.md`, `docs/contracts/world-read-envelope-v0.1.schema.json`, `docs/contracts/avelune-semantic-replay-v0.1.md`
7. P5B : `docs/23_*`, `docs/26_*`, `docs/27_*`, `lab/musique0/`
8. P5A : `docs/24_visuel_coeur_contrat_public.md`
9. `docs/real/` pour TA3

Les documents PROTO et les états datés antérieurs restent disponibles pour la traçabilité mais ne reprennent pas autorité sur ces référentiels.
