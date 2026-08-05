# Avelune — PROTO-0 — Backlog d'implémentation

Référence : `PROTO0_SPECIFICATION.md`

Jalon de spécification : `proto-0-spec.1`

Principe directeur : **moteur headless avant interface**.

---

## P0 — Fondation du prototype

- [x] créer les types PROTO-0 indépendants du moteur legacy dev.3 ;
- [x] charger une configuration de session ;
- [x] sérialiser la configuration ;
- [x] gérer la graine ;
- [x] créer plusieurs sessions indépendantes ;
- [x] utiliser 1 Corcite joueur + 4 Corcites simulés ;
- [x] tests de reproductibilité minimale.

### Critère de sortie

Même configuration + même graine = même état initial.

---

## P1 — État du Corcite

- [x] définir les stocks ;
- [x] définir les unités de stockage ;
- [x] définir les productions ;
- [x] définir les structures ;
- [x] définir les capacités ;
- [x] définir les modificateurs ;
- [x] définir les réservations de ressources ;
- [x] produire un snapshot sérialisable.

### Critère de sortie

Un état de Corcite complet peut être sauvegardé puis rechargé sans perte.

---

## P2 — Résolution de tour

- [ ] phase joueur sans quota arbitraire d'actions ;
- [ ] action explicite « terminer le tour » ;
- [ ] verrouillage des choix ;
- [ ] détection des conflits de ressources ;
- [ ] réservations ;
- [ ] arbitrage lorsqu'un conflit ne peut pas être résolu automatiquement ;
- [ ] résolution déterministe dans l'ordre fixé par la spécification ;
- [ ] journal de chaque opération.

### Critère de sortie

Le moteur ne dépend plus du modèle historique « 1 TD + 1 TF + 1 RPG ».

---

## P3 — TF minimal

- [ ] extraction ;
- [ ] transformation ;
- [ ] fabrication ;
- [ ] ressources de niveau supérieur ;
- [ ] capacité de stockage par unité ;
- [ ] blocage ou conséquence en cas de stockage saturé ;
- [ ] tampon automatique N → N+1 ;
- [ ] bifurcations ;
- [ ] priorités ou répartitions ;
- [ ] dépendance matérielle d'au moins une construction TD.

### Critère de sortie

Une chaîne TF doit réellement conditionner au moins une préparation TD.

---

## P4 — RPG minimal

- [ ] représenter les choix RPG hors file d'ordres artificielle ;
- [ ] au moins un modificateur ;
- [ ] au moins un déblocage ou accès ;
- [ ] au moins une recherche ou connaissance ;
- [ ] interaction RPG → TF ou RPG → TD mesurable ;
- [ ] journaliser l'origine du modificateur.

### Critère de sortie

Une décision RPG change au moins un choix mécanique utile.

---

## P5 — TD interne

- [ ] chemin interne de 8 positions ;
- [ ] placement ordonné des tours ;
- [ ] famille Atténuation N1 ;
- [ ] famille Déstructuration N1 ;
- [ ] famille Captation N1 ;
- [ ] famille Stabilisation N1 ;
- [ ] transformation progressive des quatre variables de vague ;
- [ ] journal avant/après chaque position ;
- [ ] vérification automatisée que l'ordre peut changer le résultat.

### Critère de sortie

Deux ordonnancements utilisant le même ensemble de tours peuvent produire des
résultats différents.

---

## P6 — Vague et prévisions

- [ ] pression ;
- [ ] structure ;
- [ ] charge ;
- [ ] matière capturable ;
- [ ] configuration nominale 50 / 60 / 20 / 16 ;
- [ ] perturbation seedée ±2 % ;
- [ ] prévision T−3 ±10 % ;
- [ ] prévision T−2 ±6 % ;
- [ ] prévision T−1 ±3 % ;
- [ ] conservation de la prévision et du réel.

### Critère de sortie

Une session peut être rejouée exactement et une autre graine peut produire une
variation bornée.

---

## P7 — Conséquences

- [ ] appliquer le résultat de vague au Corcite ;
- [ ] conserver les consommations ;
- [ ] conserver la matière captée ;
- [ ] produire les conséquences persistantes nécessaires au test ;
- [ ] conserver les connaissances produites ;
- [ ] snapshot après vague.

### Critère de sortie

Une défense imparfaite laisse un état mesurable après la vague.

---

## P8 — Rapport joueur et logs

- [ ] journal technique exhaustif ;
- [ ] rapport joueur distinct ;
- [ ] vague prévue / vague réelle ;
- [ ] effets successifs des tours ;
- [ ] quatre variables avant/après ;
- [ ] matière captée ;
- [ ] consommations pertinentes ;
- [ ] conséquences ;
- [ ] résultat ;
- [ ] connaissance produite ;
- [ ] résumé par défaut ;
- [ ] détails à la demande ;
- [ ] export machine ;
- [ ] export lisible.

### Critère de sortie

Le joueur comprend pourquoi il a obtenu le résultat sans lire le journal
technique.

---

## P9 — Batterie de simulations

- [ ] scénario nominal ;
- [ ] scénario aléatoire borné ;
- [ ] répétition par graine ;
- [ ] scénarios de stress ;
- [ ] comparaison d'ordonnancements TD ;
- [ ] réexécuter au minimum les 60 configurations de référence ;
- [ ] mesurer les stratégies dominantes éventuelles ;
- [ ] rechercher les boucles infinies et ressources gratuites ;
- [ ] rechercher les conflits non résolus ;
- [ ] rechercher les états impossibles.

### Critère de sortie

Les conclusions du rapport de conception peuvent être reproduites ou réfutées
par le moteur.

---

## P10 — Interface minimale

À commencer uniquement après validation suffisante du moteur headless.

- [ ] création / choix de session ;
- [ ] état du Corcite ;
- [ ] actions TF ;
- [ ] éléments RPG pertinents ;
- [ ] préparation TD sur 8 positions ;
- [ ] prévision de vague ;
- [ ] résolution ;
- [ ] rapport de fin de vague ;
- [ ] journal technique accessible séparément ;
- [ ] réglages d'accessibilité.

### Critère de sortie

L'interface pilote le moteur sans dupliquer ses règles.

---

# Ordre de priorité

Ordre d'implémentation :

**P0 → P1 → P2 → P3 → P4 → P5 → P6 → P7 → P8 → P9 → P10**

Les tâches d'interface ne doivent pas piloter la définition du domaine.

---

# Non bloquant pour PROTO-0

Ne pas ajouter pour « compléter » le prototype :

- commerce ;
- chat ;
- forum ;
- guildes ;
- PvP ;
- combat ;
- challenge final ;
- contenu massif ;
- progression longue ;
- équilibrage final ;
- système social complet.
