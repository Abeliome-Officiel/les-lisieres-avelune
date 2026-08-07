# ✦ Les Lisières d’Avelune

> **Un monde partagé à habiter, comprendre et transformer.**

**Les Lisières d’Avelune** est un projet de jeu navigateur persistant centré sur le développement d’un **Corcite**, corps-cité organique vivant. Le projet mêle gestion systémique, production, recherche, défense contre les vagues issues de la Fracture, progression RPG transversale, narration textuelle et monde partagé évolutif.

**Poétique · Onirique · Féerique · Organique · Minéral · Floral-abstrait · Queer**

---

## État du projet — août 2026

Deux repères doivent être distingués :

| Repère | Statut |
|---|---|
| **PROTO-0.1** | baseline jouable intégrée à `main`, déployée et conservée comme jalon stable actuel |
| **PROTO-0.2** | développement actif destiné à tester un modèle de Corcite plus concret, une boucle de jeu complète et une UX nettement plus proche du cahier des charges |

`main` reste donc la **baseline stable du dépôt** tant que PROTO-0.2 n’a pas été revu et intégré.

Le développement courant se fait sur :

**[`develop/proto-0.2-ux-rules`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2-ux-rules)**

PROTO-0.2 n’est pas encore présenté comme une version stable ni comme la version déployée de référence.

### Accès rapide

- **Prototype actuellement déployé — PROTO-0.1** : https://proto.avelune.duckdns.org
- **Baseline stable** : [`main`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/main)
- **Développement PROTO-0.2** : [`develop/proto-0.2-ux-rules`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2-ux-rules)
- **Cahier PROTO-0.2** : [`docs/development/proto0.2`](docs/development/proto0.2)
- **Règles actives PROTO-0.2** : [`01_RULES_AND_SCOPE.md`](docs/development/proto0.2/01_RULES_AND_SCOPE.md)
- **Spécification UX** : [`02_UX_SPEC.md`](docs/development/proto0.2/02_UX_SPEC.md)
- **Brief visuel Gen3 corrigé** : [`06_VISUAL_BRIEF_GEN3.md`](docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)
- **Vision générale** : [`docs/00_vision.md`](docs/00_vision.md)
- **Accessibilité et éthique** : [`docs/06_accessibilite_ethique.md`](docs/06_accessibilite_ethique.md)

---

# PROTO-0.2 — objectif du jalon actif

PROTO-0.2 est un **mini-jeu de validation**, pas le jeu final. Il doit tester une boucle complète et compréhensible :

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
- la cohérence visuelle d’Avelune.

Le prototype reste volontairement limité pour éviter de confondre **validation d’une boucle** et développement prématuré du jeu complet.

---

## Le Corcite devient un espace concret

Le cœur économique de PROTO-0.2 est un **plateau hexagonal** représentant l’organisation du Corcite.

Principes actifs du prototype :

- `1 bâtiment = 1 case` ;
- certaines cases possèdent des ressources de sol ;
- les extracteurs produisent lorsqu’ils sont placés sur un gisement compatible ;
- hors extraction, la position n’a pas encore d’effet mécanique ;
- pas d’adjacence, routes, orientation, bâtiments multi-cases ou logistique spatiale ;
- pas de réseau direct, ports, câbles ou routage Factorio dans le parcours actif PROTO-0.2.

La piste de réseaux productifs reste une possibilité de conception future, mais elle n’est pas nécessaire pour valider ce jalon.

---

## Une économie physique mais simplifiée

PROTO-0.2 teste notamment :

- extraction de matières primaires ;
- transformation ;
- fabrication de composants et bâtiments nécessaires au run ;
- Atelier de construction ;
- Fabrique défensive ;
- Recyclerie ;
- énergie sous forme `utilisée / capacité` ;
- population affectée ou disponible ;
- entretien global ;
- inventaire mécanique global ;
- stockage fourni **uniquement par les bâtiments de stockage**.

Un bâtiment est fabriqué, entre dans l’inventaire puis est posé. Un bâtiment posé peut être démonté et remonté avec un coût en temps.

Les ordres réservent leurs matières. Une production terminée ne détruit pas son résultat si le stockage est plein : elle bloque proprement la sortie du producteur jusqu’à ce que de la place soit libérée.

---

## Recherche et évolution

Le RPG n’est pas une troisième boucle artificiellement symétrique à la production et à la défense. Il reste **transversal**.

PROTO-0.2 teste une petite progression utile, notamment :

- déblocage de la Transformation ;
- améliorations d’Extraction ;
- améliorations de Transformation ;
- améliorations de Fabrication ;
- amélioration de la Recyclerie ;
- **Stockage amélioré**.

Les améliorations répétables sont volontairement bornées afin que le run reste lisible et simulable.

---

## Défense et vagues — simplification de laboratoire

La vague du jeu final devra être redéfinie plus finement après ce jalon. Les anciennes caractéristiques `pression / structure / charge / matière capturable` ne sont donc pas considérées comme le canon futur.

Pour PROTO-0.2, le challenge défensif utilise volontairement **une seule caractéristique active : la Puissance**.

Une seule famille de défense est testée : **Affaiblissement**.

```text
Puissance de la vague
→ réductions successives des défenses
→ Puissance résiduelle
```

- si la Puissance résiduelle atteint `0` : **victoire immédiate du testeur** ;
- sinon elle endommage l’**Intégrité du Corcite** ;
- si l’Intégrité atteint `0` : **victoire du jeu / défaite du testeur** ;
- sinon le développement reprend avant une nouvelle vague plus puissante.

Il n’y a plus de victoire arbitraire après un nombre fixe de vagues. Le run doit être **borné par ses conditions de victoire/défaite** : les vagues deviennent progressivement assez puissantes pour finir par tuer un Corcite qui ne parvient jamais à les annuler, tout en laissant une trajectoire raisonnable de victoire.

Aucune matière issue des vagues et aucune captation n’entrent dans l’économie de PROTO-0.2.

---

# UX et direction visuelle du prototype

La troisième proposition visuelle dite **Gen3** sert de référence de **composition ergonomique**, pas de direction artistique à recopier.

Composition recherchée sur desktop :

- HUD ressources/capacités en haut ;
- fiche du Corcite à gauche ;
- grand plateau hexagonal central ;
- panneau contextuel de sélection à droite ;
- inventaire et ordres en bas ;
- vue Défenses séparée mais facilement accessible.

Le prototype doit déjà se rapprocher de l’identité d’Avelune :

- onirique ;
- féerique abstraite ;
- queer sans caricature ;
- organique et minérale ;
- biomorphique ;
- violet, prune, lavande, opalin et iridescent ;
- Corcite non anthropomorphe.

À éviter : personnage humain/humanoïde, fantasy médiévale générique, forêt fantasy naturaliste ou usine sci-fi industrielle générique.

Le visuel de PROTO-0.2 n’est pas la direction artistique finale, mais il doit déjà permettre de tester **une expérience de jeu**, pas un back-office technique.

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

- PROTO-0.1 reste le prototype déployé de référence ;
- PROTO-0.2 est le jalon de développement actif ;
- sa documentation de travail est disponible sur `develop/proto-0.2-ux-rules` ;
- il ne doit être considéré stable qu’après revue, tests, playtest et intégration explicite.
