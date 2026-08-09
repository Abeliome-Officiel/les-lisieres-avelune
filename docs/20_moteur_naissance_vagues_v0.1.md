# Avelune — Moteur de naissance des vagues — contrat expurgé

> **Statut : baseline comportementale de production expurgée**  
> Date : 9 août 2026  
> La recette exacte du moteur de cadence est classée **Cœur d'Avelune** et conservée hors GitHub.

## 1. Rôle

Le moteur de naissance décide **quand** une nouvelle vague peut naître à partir de signaux synthétiques fournis par le monde.

La cadence n'est pas un calendrier fixe et ne doit pas produire une routine horaire ou quotidienne trivialement exploitable.

La représentation interne utilisée pour obtenir ce comportement, ses fonctions, pondérations, seuils, mémoires, références de calibration et distributions détaillées ne sont pas documentées dans le dépôt courant.

Le moteur appartient au chantier **Cœur vivant / genèse canonique** décrit dans [`21_coeur_vivant_genese_canonique.md`](21_coeur_vivant_genese_canonique.md).

## 2. Contrat comportemental

Le moteur doit :

- continuer à produire des naissances sans activité de joueur ;
- accepter une cadence centrale paramétrable ;
- pouvoir ralentir dans des situations globalement calmes et accélérer dans certaines situations de tension ;
- conserver des bornes empêchant à la fois l'attente infinie et les empilements absurdes ;
- permettre occasionnellement des intervalles inhabituels lorsque le système mondial les autorise ;
- ne pas favoriser durablement une heure réelle ou un jour de semaine ;
- rester indépendant de toute donnée terrestre en temps réel ;
- journaliser chaque naissance et la version de recette utilisée ;
- rester indépendant de l'interface joueur et de l'Observatoire.

## 3. Interfaces

### Entrées

Le moteur reçoit uniquement les signaux synthétiques nécessaires à son calcul, par exemple :

- état/tendance globale du monde ;
- signaux de régime ou de phénomène exceptionnel autorisés ;
- temps écoulé depuis les événements précédents ;
- multiplicateur administrateur de cadence ;
- informations de maintenance ou suspension explicite.

La transformation exacte de ces entrées en décision de naissance relève du **Cœur d'Avelune**.

### Sortie

Lorsqu'une naissance est décidée, le moteur émet un événement versionné contenant au minimum :

- identifiant de vague ;
- horodatage de naissance ;
- référence au snapshot mondial utilisé ;
- version du moteur/recette ;
- métadonnées de traçabilité autorisées.

La génération détaillée des caractéristiques de la vague appartient au moteur d'évolution / de vague et n'est pas du ressort du moteur de cadence.

## 4. Multiplicateur administrateur de cadence

La Console du Monde doit exposer un multiplicateur global de cadence :

- `1` = comportement nominal du moteur ;
- valeur supérieure à `1` = tendance globale à davantage de naissances ;
- valeur comprise entre `0` et `1` = tendance globale à moins de naissances.

Ce multiplicateur doit agir **à l'intérieur du mécanisme normal de naissance**, sans transformer le système en délai fixe ou calendrier manuel.

Exigences :

- bornes normales définies côté serveur ;
- simulation d'impact avant modification lorsque l'écart est important ;
- motif obligatoire ;
- auteur et horodatage ;
- durée facultative avec retour automatique à `1` ;
- suspension complète traitée par une commande de maintenance distincte plutôt que par un multiplicateur ordinaire.

Les bornes et la fonction exacte d'application du multiplicateur sont secrètes.

## 5. Cadence de travail

La cadence finale n'est **pas actée**.

Les essais ont seulement montré qu'une cadence de l'ordre de la journée au sens large pouvait constituer un laboratoire utile. La valeur de production dépendra notamment :

- du coût réel d'une vague pour un joueur ;
- de la qualité de la résolution automatique pendant l'absence ;
- de la quantité d'information produite ;
- du temps nécessaire à une adaptation importante ;
- de l'effet de plusieurs jours d'absence ;
- de la manière dont le monde autonome traite les vagues avant l'arrivée des joueurs.

Les distributions et calibrations numériques détaillées sont conservées dans le Cœur d'Avelune.

## 6. Fronts résiduels et nouvelles naissances

Le contrat distingue conceptuellement :

- les fronts ou traînes appartenant encore au **même événement physique** qu'une vague déjà née ;
- une **nouvelle naissance** décidée de nouveau par le moteur de cadence ;
- des phénomènes exceptionnels avancés dont l'implantation reste ultérieure.

Un front résiduel du même événement ne doit pas être comptabilisé comme une nouvelle naissance uniquement pour produire un second passage.

Les conditions, décroissances, parentés, causalités et recettes exactes restent classées Cœur d'Avelune.

## 7. Couplage avec le moteur du monde

Les moteurs sont autonomes mais interdépendants par une interface étroite :

```text
horloge mondiale continue
        ↓
état synthétique du monde
        ↓
moteur de naissance
        ↓ événement éventuel de naissance
moteur d'évolution / de vague
        ↓
propagation et conséquences dans le substrat
        ↓
retour d'effets agrégés vers le monde
```

Aucun moteur ne doit consulter librement l'état interne complet d'un autre moteur.

## 8. Validation headless puis Observatoire

Avant toute instance canonique, le moteur doit fonctionner :

1. en laboratoire headless avec temps accéléré et seeds reproductibles ;
2. dans des campagnes longues détectant périodicité, stagnation, empilement et dérive ;
3. ensuite seulement dans un Observatoire analytique persistant.

Le port hôte `8091` est réservé à l'éventuel Observatoire HTTP ; il n'est pas requis par le moteur headless.

## 9. Confidentialité

Le dépôt courant ne doit pas contenir :

- formule de naissance ;
- seuils ou fonctions de probabilité ;
- mécanisme exact de mémoire/résiduel ;
- paramètres de calibration ;
- sources précises de rythmes cachés ;
- distributions détaillées permettant de reconstruire la recette ;
- fonction exacte du multiplicateur administrateur ;
- conditions secrètes des phénomènes exceptionnels.

Ces éléments sont stockés dans le **Cœur d'Avelune**.

## 10. Historique Git

Le contenu sensible a été retiré de la branche courante. Des commits antérieurs conservent encore des recettes exploratoires et devront faire l'objet d'une purge d'historique contrôlée séparément.
