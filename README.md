# ✦ Les Lisières d’Avelune

> **Un monde partagé à habiter, comprendre et transformer.**

**Les Lisières d’Avelune** est un projet de jeu navigateur persistant centré sur le développement d’un **Corcite**, corps-cité organique vivant. Le projet mêle gestion systémique, production, recherche, défense contre les vagues issues de la Fracture, progression RPG transversale, narration textuelle et monde partagé évolutif.

**Poétique · Onirique · Féerique · Organique · Minéral · Floral-abstrait · Queer**

---

## État du projet — 8 août 2026

Trois repères doivent être distingués :

| Repère | Statut |
|---|---|
| **PROTO-0.1** | baseline jouable intégrée à `main`, conservée comme jalon stable |
| **PROTO-0.2.1** | passe UX/règles intermédiaire, conservée comme jalon de travail |
| **PROTO-0.2.2** | **candidat de playtest distribué finalisé, validé et poussé** sur `develop/proto-0.2.2-playtest` |

Le développement courant est maintenant figé sur :

**[`develop/proto-0.2.2-playtest`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest)**

Commit de référence du lot fonctionnel : **`d3b080c` — `PROTO-0.2.2: finaliser le playtest distribue`**.

PROTO-0.2.2 est considéré **prêt à être distribué à des testeurs**, mais il n’est pas présenté comme intégré à `main` ni comme déployé publiquement tant qu’une bascule explicite n’a pas été effectuée.

### Validation finale acquise

- `svelte-check` : **0 erreur, 0 warning** ;
- suite PROTO-0 : **380/380 tests réussis** ;
- build Docker/production : **PASS** ;
- PostgreSQL 17 réel + migration : **PASS** ;
- création/reprise/sauvegarde de session et conflits LWW : **PASS** ;
- validation HTTP des entrées invalides : **PASS** ;
- feedback PostgreSQL puis notification SMTP : **PASS de bout en bout** ;
- revue humaine desktop et mobile : **acceptable pour diffusion**.

Défauts visuels mineurs connus et acceptés pour ce jalon : bordures/superpositions légères des hexagones et optimisation encore possible de l’espace autour du plateau et du panneau droit. Ils ne sont pas considérés bloquants pour le playtest.

### Accès rapide

- **Baseline stable** : [`main`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/main)
- **Candidat distribué PROTO-0.2.2** : [`develop/proto-0.2.2-playtest`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest)
- **Cahier PROTO-0.2** : [`docs/development/proto0.2`](docs/development/proto0.2)
- **Spécification playtest distribué** : [`10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md`](docs/development/proto0.2/10_P02_2_DISTRIBUTED_PLAYTEST_SPEC.md)
- **Arbitrages finaux P02.2** : [`11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md`](docs/development/proto0.2/11_P02_2_FINAL_PLAYTEST_ARBITRATIONS.md)
- **Rapport d’implémentation** : [`IMPLEMENTATION_REPORT.md`](docs/development/proto0.2/IMPLEMENTATION_REPORT.md)
- **Vision générale** : [`docs/00_vision.md`](docs/00_vision.md)
- **Accessibilité et éthique** : [`docs/06_accessibilite_ethique.md`](docs/06_accessibilite_ethique.md)

---

# PROTO-0.2.2 — objectif du jalon

PROTO-0.2.2 est un **mini-jeu de validation distribué**, pas le jeu final. Il doit tester une boucle complète et compréhensible :

```text
implanter
→ extraire
→ transformer / fabriquer
→ rechercher / évoluer
→ préparer les défenses
→ subir une vague
→ lire les conséquences
→ adapter le Corcite
→ gagner ou perdre le run
```

L’objectif est de pouvoir juger réellement :

- le modèle mental du Corcite ;
- le plaisir de manipulation ;
- les arbitrages économiques ;
- la progression ;
- la préparation défensive ;
- le challenge ;
- la lisibilité de l’interface ;
- la cohérence visuelle d’Avelune ;
- le rythme des cycles, notamment les attentes contraintes ;
- les incompréhensions, désaccords et propositions exprimés par les testeurs.

Le prototype reste volontairement limité pour éviter de confondre **validation d’une boucle** et développement prématuré du jeu complet.

---

## Sessions distribuées et retours de test

PROTO-0.2.2 ajoute une couche minimale de playtest distribué :

- session anonyme identifiée en interne par UUID ;
- code public numérique à quatre chiffres pour créer/reprendre une partie ;
- sauvegarde PostgreSQL versionnée ;
- stratégie last-write-wins avec journalisation des conflits ;
- télémétrie structurée des événements utiles au playtest ;
- classification des cycles `not_idle`, `voluntary_wait` et `forced_wait` ;
- formulaire permanent **Signaler / proposer** ;
- feedback enregistré en PostgreSQL avant toute tentative de notification ;
- SMTP facultatif et non destructif en cas d’échec.

Aucun compte utilisateur, aucune donnée personnelle requise et aucun vrai multijoueur ne sont introduits par ce lot.

---

## Le Corcite devient un espace concret

Le cœur économique de PROTO-0.2 est un **plateau hexagonal** représentant l’organisation du Corcite.

Principes actifs du prototype :

- `1 bâtiment = 1 case` ;
- certaines cases possèdent des ressources de sol ;
- les extracteurs produisent lorsqu’ils sont placés sur un gisement compatible ;
- un extracteur incompatible peut être posé mais produit `0`, avec prévisualisation ;
- hors extraction, la position n’a pas encore d’effet mécanique ;
- pas d’adjacence, routes, orientation, bâtiments multi-cases ou logistique spatiale ;
- pas de réseau direct, ports, câbles ou routage Factorio dans le parcours actif PROTO-0.2.

La piste de réseaux productifs reste une possibilité de conception future, mais elle n’est pas nécessaire pour valider ce jalon.

---

## Une économie physique mais simplifiée

PROTO-0.2.2 teste notamment :

- matières primaires **Organique** et **Minéral** avec rôles légèrement différenciés ;
- transformation et composants ;
- fabrication de bâtiments et défenses ;
- Atelier ;
- Fabrique défensive ;
- Recyclerie ;
- énergie ;
- population ;
- entretien global ;
- inventaire mécanique global ;
- stockage fourni **uniquement par les bâtiments de stockage**.

Le démarrage utilise un kit de déploiement hors inventaire, puis les matières primaires entrent dans le stock après pose de la première membrane de stockage.

Un bâtiment est fabriqué, entre dans l’inventaire puis est posé. Un bâtiment posé peut être démonté et remonté avec un coût en temps.

Les ordres réservent leurs matières. Une production terminée ne détruit pas son résultat si le stockage est plein : elle bloque proprement la sortie du producteur jusqu’à ce que de la place soit libérée.

---

## Recherche et évolution

Le RPG n’est pas une troisième boucle artificiellement symétrique à la production et à la défense. Il reste **transversal**.

PROTO-0.2.2 teste une petite progression utile, notamment :

- déblocage de la Transformation ;
- améliorations d’Extraction ;
- améliorations de Transformation ;
- améliorations de Fabrication ;
- amélioration de la Recyclerie ;
- amélioration du Stockage.

Les améliorations répétables sont volontairement bornées afin que le run reste lisible et simulable.

---

## Défense et vagues — simplification de laboratoire

La vague du jeu final devra être redéfinie plus finement après ce jalon. Les anciennes caractéristiques `pression / structure / charge / matière capturable` ne sont donc pas considérées comme le canon futur.

Pour PROTO-0.2, le challenge défensif utilise volontairement **une seule caractéristique active : la Puissance**.

Une seule famille de défense est testée : **Affaiblissement**.

```text
Fracture
→ position 1
→ …
→ position 8
→ Corcite
```

Chaque tour réduit successivement la Puissance. La première défense est accessible depuis les matières primaires : la Transformation est une montée de sophistication et non un ticket d’entrée vers la défense de base.

- Puissance résiduelle `0` : **victoire immédiate du testeur** ;
- sinon elle endommage l’**Intégrité du Corcite** ;
- Intégrité `0` : **victoire du jeu / défaite du testeur** ;
- sinon le développement reprend avant une nouvelle vague plus puissante.

Il n’y a plus de victoire arbitraire après un nombre fixe de vagues. Le run est borné par ses conditions de victoire/défaite.

Aucune matière issue des vagues et aucune captation n’entrent dans l’économie de PROTO-0.2.2.

---

# UX et direction visuelle du prototype

La troisième proposition visuelle dite **Gen3** reste une référence de **composition ergonomique**, pas une direction artistique à recopier.

Composition actuellement testée :

- HUD de ressources compact ;
- identité/navigation du Corcite à gauche ;
- grand plateau hexagonal central ;
- panneau contextuel à droite ;
- Stock comme vue globale plutôt qu’inventaire permanent massif ;
- Production et Défenses séparées ;
- bloc Session et code de reprise visibles ;
- rapport de cycle et rapport de vague distincts ;
- feedback accessible en permanence.

Le prototype doit déjà se rapprocher de l’identité d’Avelune :

- onirique ;
- féerique abstraite ;
- queer sans caricature ;
- organique et minérale ;
- biomorphique ;
- violet, prune, lavande, opalin et iridescent ;
- Corcite non anthropomorphe.

À éviter : personnage humain/humanoïde, fantasy médiévale générique, forêt fantasy naturaliste ou usine sci-fi industrielle générique.

La représentation graphique du Corcite reste **ouverte** : une exploration visuelle dédiée doit suivre le gel fonctionnel de P02.2.

---

# Le cœur d’Avelune à long terme

Les Lisières d’Avelune vise un monde partagé unique dans lequel les Corcites contribuent collectivement à la préservation de la Lisière sans imposer une coopération sociale permanente.

Principes structurants :

- monde partagé unique ;
- Corcite comme personnage, organisme et cité ;
- progression principalement horizontale ;
- recherche et connaissance du monde ;
- plusieurs styles de jeu légitimes ;
- coopération possible mais non obligatoire en permanence ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO ou de micro-dopamine comme moteur de rétention ;
- challenge systémique plutôt que punition artificielle ;
- attention explicite aux profils TSA, TDAH et dys ;
- identité queer et non genrée intégrée à la conception.

Le jeu final pourra être beaucoup plus riche que PROTO-0.2. Les systèmes futurs ne doivent cependant être construits qu’après validation de leur besoin et de leur intérêt joueur.

---

# Architecture et développement

Application : **SvelteKit + TypeScript**.

Persistance de playtest : **PostgreSQL 17**, sans ORM lourd.

Principes de développement :

- séparer données, logique métier, état et présentation ;
- favoriser des composants réutilisables lorsqu’un besoin réel le justifie ;
- conserver un cœur testable indépendamment de l’UI ;
- éviter les abstractions et infrastructures spéculatives ;
- centraliser les paramètres de laboratoire utiles à l’équilibrage ;
- tester et simuler les règles actives ;
- limiter la charge réseau côté utilisateur et la charge CPU côté serveur lorsque l’architecture évolue vers la production.

Documentation :

- [`docs/index.md`](docs/index.md)
- [`docs/development/README.md`](docs/development/README.md)
- [`docs/development/proto0.2`](docs/development/proto0.2)

---

## Statut de publication

Au **8 août 2026** :

- PROTO-0.2.2 est **validé, poussé et prêt à être distribué** ;
- la branche de référence est `develop/proto-0.2.2-playtest` ;
- le lot fonctionnel de référence est `d3b080c` ;
- aucune fusion vers `main`, aucun tag de release et aucun déploiement public ne sont déclarés par cette documentation ;
- après distribution, P02.2 doit rester gelé hors bugs bloquants pendant la collecte de retours.
