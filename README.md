# ✦ Les Lisières d’Avelune

> **Un monde partagé à habiter, comprendre et transformer.**

**Les Lisières d’Avelune** est un projet de jeu navigateur persistant centré sur le développement d’un **Corcite**, corps-cité organique vivant. Le projet mêle gestion systémique, production, recherche, défense contre les vagues issues de la Fracture, progression RPG transversale, narration textuelle et monde partagé évolutif.

**Poétique · Onirique · Féerique · Organique · Minéral · Floral-abstrait · Queer**

---

## État du projet — 12 août 2026

Avelune avance désormais sur trois chantiers distincts :

| Chantier | État |
|---|---|
| **PROTO-0.2.2** | candidat de playtest distribué validé sur `develop/proto-0.2.2-playtest` |
| **Cœur vivant / CŒUR-0** | laboratoire headless autonome ; diagnostic de persistance R2.10 en cours |
| **Tableau Réel (TA3)** | Gate 0 validé ; architecture persistante autonome ; Phase B suivante |

Le nettoyage contrôlé de l’ancien historique GitHub est **clos** et la synchronisation normale du dépôt est rétablie. Les anciens clones/worktrees doivent être contrôlés avant réutilisation.

`main` reste la **baseline stable d’intégration** tant qu’une fusion plus récente n’est pas décidée explicitement.

### Accès rapide

- [État détaillé au 12 août 2026](docs/development/PROJECT_STATUS_2026-08-12.md)
- [Roadmap](ROADMAP.md)
- [Index documentaire](docs/index.md)
- [Cœur vivant — contrat de production](docs/21_coeur_vivant_genese_canonique.md)
- [Cœur vivant — état agrégé de validation](docs/22_coeur_vivant_validation_2026-08-12.md)
- [Tableau Réel](docs/real/README.md)
- [Candidat PROTO-0.2.2](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2.2-playtest)

---

## PROTO-0.2.2

PROTO-0.2.2 est un **mini-jeu de validation distribué**, pas le jeu final. Il teste une boucle complète et compréhensible :

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

Référence fonctionnelle : `d3b080c` — `PROTO-0.2.2: finaliser le playtest distribue`.

Validation acquise :

- `svelte-check` : 0 erreur, 0 warning ;
- 380/380 tests PROTO réussis ;
- build production validé ;
- PostgreSQL 17 réel + migration validés ;
- création, reprise et sauvegarde des sessions validées ;
- conflits last-write-wins journalisés ;
- feedback enregistré avant notification ;
- SMTP facultatif et non destructif ;
- revue desktop/mobile acceptable pour diffusion.

### Modèle de jeu du jalon

Le Corcite est représenté par un plateau hexagonal concret :

- `1 bâtiment = 1 case` ;
- ressources de sol pour l’extraction ;
- stockage fourni par les bâtiments de stockage ;
- inventaire mécanique global ;
- extraction, transformation et fabrication ;
- énergie, population et entretien ;
- recherche courte et bornée ;
- défense volontairement simplifiée pour le playtest.

Le RPG reste une couche transversale, pas une troisième boucle artificiellement symétrique à la production et à la défense.

Pour ce jalon uniquement, la vague de test est volontairement plus simple que la future vague du jeu. Les anciennes caractéristiques historiques ne constituent pas automatiquement le canon du Cœur vivant.

### Playtest distribué

PROTO-0.2.2 apporte une couche minimale de sessions distribuées :

- session anonyme ;
- code public de reprise ;
- sauvegarde PostgreSQL versionnée ;
- stratégie last-write-wins avec journalisation ;
- télémétrie structurée utile au playtest ;
- formulaire permanent de signalement/proposition ;
- aucune création de compte joueur nécessaire pour ce lot.

Après diffusion, le jalon doit rester gelé hors bugs bloquants pendant la collecte des retours.

---

## Cœur vivant

Le **Cœur vivant** est le moteur autonome qui doit faire vivre Avelune indépendamment du gameplay et de la présence des joueurs.

Une future instance canonique devra pouvoir :

- fonctionner avant l’arrivée des joueurs ;
- conserver son histoire ;
- produire des transformations locales persistantes ;
- être sauvegardée, restaurée et migrée ;
- continuer ensuite dans le jeu produit sans remise à zéro de convenance.

Le laboratoire CŒUR-0 est séparé du prototype jouable. Son implémentation détaillée reste hors GitHub ; le dépôt contient seulement les contrats et résultats agrégés partageables.

### Validation actuelle

Les campagnes R2 ont isolé un goulot de persistance des formes pré-corcitiques : les lignées disparues meurent presque toujours alors qu’elles sont encore limitées à leur première implantation et avant leur première propagation locale.

La baseline de travail R2.7 réduit le turnover local et allonge la coexistence sans modification importante démontrée de l’occupation globale. R2.10 mesure maintenant si le goulot vient principalement de l’atteinte de l’état reproductif, de l’attente avant propagation ou de l’érosion par les vagues.

Voir [l’état agrégé de validation](docs/22_coeur_vivant_validation_2026-08-12.md).

---

## Tableau Réel

Le **Tableau Réel (TA3)** mesure le projet Avelune dans le monde réel : âge du projet, temps humain, matériel, énergie, coûts, financement, empreinte carbone connue et métriques globales de vie.

Le Gate 0 a établi une contrainte structurante : TA3 ne doit dépendre ni du conteneur ni de la base d’un PROTO éphémère.

Architecture retenue :

```text
sources temporaires / instruments / saisies
                    ↓
            adaptateurs de source
                    ↓
          stockage persistant TA3
                    ↓
              agrégats
                    ↓
          interface publique
```

Une source indisponible rend sa donnée ancienne ou inconnue ; elle ne rend pas TA3 indisponible.

La Phase B doit auditer le socle persistant disponible hors PROTO puis choisir le plus petit runtime autonome adapté. Aucune migration TA3 ne doit être créée dans la base du PROTO.

Voir [`docs/real/`](docs/real/README.md).

---

## Direction du jeu à long terme

Les Lisières d’Avelune vise un monde partagé unique dans lequel les Corcites contribuent collectivement à la préservation de la Lisière sans imposer une présence sociale permanente.

Principes structurants :

- monde partagé unique ;
- Corcite comme personnage, organisme et cité ;
- progression principalement horizontale ;
- plusieurs styles de jeu légitimes ;
- coopération possible sans obligation permanente ;
- échec fertile ;
- absence non punitive ;
- pas de classement humiliant ;
- pas de FOMO ou de micro-dopamine comme moteur de rétention ;
- challenge systémique plutôt que punition artificielle ;
- accessibilité intégrée, notamment pour les profils TSA, TDAH et dys ;
- identité queer et non genrée intégrée à la conception.

Le contenu et les systèmes futurs ne sont ajoutés qu’après validation de leur besoin et de leur intérêt joueur.

---

## Architecture de développement

Socle applicatif : **SvelteKit + TypeScript**.  
Persistance du playtest distribué : **PostgreSQL 17**.

Principes :

- règles métier testables hors UI ;
- séparation données, logique, état et présentation ;
- simulations utilisant les mêmes règles que le runtime correspondant ;
- pas d’abstraction spéculative ;
- paramètres de laboratoire versionnés ;
- attention explicite aux coûts CPU, RAM et réseau ;
- séparation stricte entre PROTO jouable, Cœur vivant, Tableau Réel et rendu graphique.

---

## Frontière de publication

GitHub est la source de vérité des contrats, décisions partageables, documentation de développement et code destiné au dépôt.

Les informations propriétaires du moteur du monde, données privées et détails d’exploitation restent dans les espaces internes appropriés. Le fait que le dépôt soit privé ne transforme pas ces informations en contenu GitHub acceptable.
