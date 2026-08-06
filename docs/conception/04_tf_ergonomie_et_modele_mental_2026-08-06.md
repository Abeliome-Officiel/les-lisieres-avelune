# v0.8.4 — Remise à plat TF, lisibilité et modèle mental

Date : 2026-08-06

Statut : document de conception issu du playtest du PROTO-0.1. Il distingue les décisions actées des propositions d'interface encore à arbitrer.

---

# 1. Diagnostic : une mécanique doit-elle se suffire à elle-même ?

## Conclusion

**Non, une mécanique de jeu n'a pas à être agréable ni même facilement jouable sous forme textuelle pour être viable.**

Une mécanique peut être intrinsèquement spatiale, visuelle ou manipulatoire. Dans ce cas, le plateau, la carte, les icônes, les relations graphiques et les affordances d'interface font partie du dispositif de jeu au même titre que les règles.

En revanche, une mécanique devient suspecte si une représentation visuelle simple ne suffit toujours pas à rendre lisibles :

- l'état courant ;
- les possibilités d'action ;
- les prérequis ;
- les relations de cause à effet ;
- les conséquences principales d'une décision.

Le PROTO-0.1 révèle donc deux problèmes différents :

1. **problème de représentation dominant** : l'interface expose le modèle de données et demande au joueur de reconstruire mentalement les relations ;
2. **complexité mécanique gratuite ponctuelle** : certaines couches, notamment la réserve énergétique courte et la sélection manuelle source + destination + ressource, ajoutent du travail cognitif sans décision intéressante correspondante.

Le bon critère n'est pas « est-ce jouable en texte ? », mais :

> Une fois l'état matérialisé de façon simple, un joueur peut-il comprendre rapidement ce qui fonctionne, ce qui manque, ce qu'il peut faire et pourquoi ce choix compte ?

Si la réponse reste non après une représentation correcte, la mécanique elle-même doit être simplifiée.

## Gate UX pour la prochaine itération

Un testeur découvrant le système doit pouvoir, sans mémoriser un manuel :

1. identifier en moins de 10 secondes ses ressources principales ;
2. identifier les fonctions actives et leurs coûts ;
3. comprendre d'où vient une ressource et où elle va ;
4. savoir pourquoi une action est possible ou bloquée ;
5. prédire l'effet principal d'une décision sans recomposer plusieurs écrans mentalement.

---

# 2. Énergie

## Suppression de la réserve courte

**Acté — remplace explicitement le modèle hybride de v0.8.1.**

La réserve énergétique courte est supprimée du socle courant.

L'énergie devient une capacité simple :

```text
⚡ ÉNERGIE  2 / 4 utilisées
            2 disponibles
```

Règles :

- une fonction active mobilise sa charge énergétique en continu ;
- elle reste active jusqu'à arrêt volontaire du joueur ;
- une fonction inactive libère immédiatement sa charge énergétique et son travail ;
- une activation qui ferait dépasser la capacité énergétique est refusée ;
- il n'existe plus de second compteur de réserve à surveiller.

Si un événement extérieur réduit ultérieurement la capacité disponible sous la charge déjà active, la conséquence précise reste à arbitrer ; le joueur devra au minimum pouvoir identifier immédiatement les fonctions responsables et réduire la charge.

---

# 3. Modèle TF retenu : étoile centrée sur les stocks

## Intention

**Acté pour le modèle mental ; représentation graphique exacte encore ouverte.**

Le TF n'est pas conçu comme un graphe libre affiché en permanence dans le premier prototype jouable.

Le modèle mental principal est **radial / en étoile** :

- les stocks du Corcite constituent le centre logistique ;
- les branches d'extraction, transformation et fabrication se développent autour de ce centre ;
- une branche peut comporter un ou plusieurs bâtiments ;
- par défaut, une production retourne au stockage ;
- lorsqu'un bâtiment aval compatible existe, une connexion directe peut court-circuiter le stockage général ;
- la ressource transportée par une connexion directe est déduite automatiquement de la sortie et de l'entrée compatibles ; le joueur ne choisit jamais arbitrairement une ressource dans une liste.

Le futur système de réseau libre de type LabVIEW / Factorio avancé est **remisé** jusqu'à ce que le volume de contenu le justifie.

---

# 4. Ressources : référence ergonomique RTS

**Acté comme principe de présentation.**

Les ressources principales doivent être visibles en permanence sous forme compacte, à la manière d'un RTS : icône + nom court si nécessaire + quantité.

Exemple :

```text
◉ Organique  12    ◆ Minéral  9    ⬢ Transformé  4    ⬡ Composants  2

⚡ 2/4    👤 3/4    🔧 4/5    ▣ 9/12
```

Le joueur ne doit pas devoir ouvrir une page de stocks pour connaître son état économique immédiat.

Les détails par bâtiment de stockage restent accessibles à la demande, car le stockage physique par unité reste une règle mécanique pertinente.

---

# 5. Connexions directes

## Règle joueur

**Acté.**

Le joueur ne sélectionne plus :

```text
Source + Destination + Ressource
```

Il choisit seulement une relation valide entre deux fonctions existantes.

Exemple :

```text
[Extracteur organique] ─────▶ [Atelier de transformation]
           sortie ◉                 entrée ◉
```

La ressource `◉ matière organique` est implicite.

Une cible incompatible n'est pas proposée comme destination normale.

Dans le premier prototype :

- si une sortie n'est pas reliée directement, elle retourne au stockage général ;
- si une entrée n'est pas alimentée directement, elle prélève dans le stockage général ;
- la connexion directe sert à éviter le détour par le stock et à préparer le futur TF avancé ;
- aucune interface de câblage libre complexe n'est nécessaire à ce stade.

---

# 6. Quatre représentations candidates

## A — Étoile stricte autour du stock

```text
                         [Source organique]
                                │
                                ▼
                         [Extracteur ◉]
                                │
                                ▼
                    ╭────────────────────╮
                    │   ▣ STOCK CENTRAL  │
                    │ ◉ 12 ◆ 9 ⬢ 4 ⬡ 2 │
                    ╰────────────────────╯
                       ▲       │       ▲
                       │       │       │
                  retour       │       retour
                       │       ▼       │
               [Fabrication] [Transformation]
                       ▲             ▲
                       │             │
                       └──── stock ──┘
```

**Avantages** : extrêmement lisible ; correspond au modèle RTS ; le stock est la référence immédiate.

**Limite** : masque les chaînes longues et peut devenir très chargé avec beaucoup de fonctions.

---

## B — Étoile avec branches longues

```text
[Source ◉] → [Extracteur] → [Prétraitement] ───────────┐
                                                      │
[Source ◆] → [Extracteur] ────────────────────────────┤
                                                      ▼
                                             ╭────────────────╮
                                             │  ▣ STOCK       │
                                             ╰────────────────╯
                                                      │
                         ┌────────────────────────────┴──────────────┐
                         ▼                                           ▼
               [Transformation] → [Fabrication]             [Autre branche]
                         │                │                          │
                         └─────────────── retour au stock ──────────┘
```

**Avantages** : traduit directement l'idée « une branche peut contenir plusieurs bâtiments » ; reste simple tant que le nombre de branches est réduit.

**Limite** : nécessite un bon placement automatique pour éviter les croisements.

---

## C — Hub par défaut + raccourcis directs

```text
                         ╭────────────────╮
                         │   ▣ STOCK      │
                         ╰────────────────╯
                           ▲   ▲      │
                    défaut │   │      │ défaut
                           │   │      ▼
[Source ◉] → [Extracteur ◉]   │   [Fabrication]
                  │            │
                  └────────────┼────────▶ [Transformation]
                       lien direct             │
                                               └──▶ stock
```

Lecture :

- la flèche vers le stock est le fonctionnement normal ;
- le lien direct `Extracteur → Transformation` est une optimisation explicite ;
- aucune sélection de ressource n'est nécessaire.

**Avantages** : meilleur compromis pour le prototype ; explique le stockage et les connexions directes sans exposer un éditeur de réseau.

**Limite** : il faut distinguer graphiquement le chemin par défaut et le raccourci direct.

---

## D — Corcite radial / organique

```text
                              ◉ SOURCE
                                 │
                           [Extracteur]
                                 │
                                 ▼
                      ╭────────────────────╮
          ◆ SOURCE →  │                    │  → [Fabrication] → ⬡
         [Extracteur] │   ▣ CŒUR / STOCK   │
                      │                    │
                      ╰────────────────────╯
                                 │
                                 ▼
                         [Transformation]
                                 │
                                 ⬢

                ⚡ 2/4      👤 3/4      🔧 4/5      ▣ 9/12
```

Les fonctions sont présentées comme des organes ou excroissances fonctionnelles du Corcite plutôt que comme une usine classique.

**Avantages** : très cohérent avec l'identité corps-cité d'Avelune ; les relations sont visibles spatialement ; peut devenir une signature visuelle propre au jeu.

**Limite** : demande plus de travail d'ergonomie et de composition graphique que le schéma C.

---

# 7. Recommandation pour le prochain prototype d'interface

**Proposé : hybride C + D.**

Le prochain écran de test devrait combiner :

1. une barre de ressources permanente de type RTS ;
2. un stock/cœur central ;
3. des branches fonctionnelles disposées radialement ;
4. les flux ordinaires vers/depuis le stock implicites ou discrets ;
5. les connexions directes mises en évidence uniquement lorsqu'elles existent ;
6. un clic sur une fonction ouvre ses détails, coûts et commandes ;
7. les icônes servent de repères constants pour énergie, population, entretien, stockage et ressources.

Le but n'est pas encore de produire une direction artistique finale. Le but est de tester un modèle mental où **les relations importantes sont visibles sans devoir être mémorisées**.

---

# 8. Pas d'animation de flux en tour par tour brut

**Acté.**

Les animations de petites ressources circulant en permanence n'apportent pas assez de valeur dans le prototype tour par tour actuel.

Les liens doivent être statiques et lisibles. Un retour visuel bref lors d'une résolution peut être envisagé plus tard, mais le vrai intérêt d'une animation de flux apparaîtra lors d'un éventuel passage à un fonctionnement temps réel ou semi-temps réel.

---

# 9. Nature de la « vague »

## Correction conceptuelle

**Acté — corrige la représentation de la vague comme échéance régulière annoncée.**

Le terme « vague » décrit surtout la **propagation** du phénomène.

L'événement doit être pensé comme l'onde de choc d'une explosion / rupture provenant du centre du monde :

- brutal ;
- impromptu ;
- aléatoire ;
- provenant de la Fracture centrale ;
- se propageant vers l'extérieur ;
- quasi imprévisible sans moyens particuliers d'observation ou de connaissance.

La bonne représentation n'est donc pas une barre permanente « vague dans 4 tours ».

Pour un prototype déterministe et testable, le déclenchement peut rester piloté par une graine et une fenêtre cachée, mais l'interface joueur ne doit pas transformer ce mécanisme en calendrier connu.

Une capacité de détection, recherche ou observation pourra éventuellement transformer l'imprévisibilité en signes partiels, jamais en compte à rebours gratuit par défaut.

Nom joueur à arbitrer ultérieurement : `Onde`, `Onde de Fracture`, `Déflagration`, autre.

---

# 10. Conséquence générale sur l'interface

Le PROTO-0.1 a principalement montré que l'interface actuelle demande trop de mémoire de travail.

Le prochain prototype d'interface doit appliquer cette règle :

> Une relation mécanique importante doit être montrée visuellement ou spatialement lorsqu'elle peut l'être, plutôt que répartie entre plusieurs tableaux et libellés.

La lisibilité n'est pas un habillage final : elle fait désormais partie des critères de validation de la mécanique elle-même.
