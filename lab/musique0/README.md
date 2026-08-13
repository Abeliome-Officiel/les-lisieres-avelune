# MUSIQUE-0 — terrain de laboratoire

Statut : **préparé pour démarrage hors ligne**.

Ce répertoire matérialise la frontière entre la documentation/les contrats partageables et les futurs essais locaux de MUSIQUE-0. Il ne fait pas partie du PROTO jouable, ne charge pas le Cœur et ne sélectionne aucun moteur audio.

## 1. But immédiat

Le premier objectif n'est pas de produire une bande-son définitive. Il est de prouver qu'une chaîne de représentation sonore peut être développée, testée et remplacée sans transformer les structures internes du Cœur en API durable.

Chaîne de travail autorisée :

```text
fixture synthétique neutre / replay explicitement autorisé
                    ↓
             adaptateur de source
                    ↓
        projection sémantique autorisée
                    ↓
          contrat versionné public
                    ↓
      planification / grammaire musicale
                    ↓
            renderer expérimental
```

## 2. Ce qui est déjà prêt

- contrat expérimental : `docs/contracts/representation-semantic-v0.schema.json` ;
- fixtures publiques neutres A/B/C : `docs/contracts/musique0-fixtures/` ;
- manifeste avec SHA-256 ;
- contrôleur autonome : `tools/musique0/check_public_fixtures.py` ;
- cahier d'intégration : `docs/27_musique0_cahier_integration.md` ;
- références et méthode : `docs/26_univers_sonore_references_methode.md`.

Contrôle local de base :

```bash
python3 tools/musique0/check_public_fixtures.py
```

Le contrôleur utilise uniquement la bibliothèque standard Python. Il ne dépend ni du code du jeu ni du code du Cœur.

## 3. Répertoires locaux réservés

Les essais réels utilisent des répertoires locaux ignorés par Git :

- `private-input/` : entrées classées ou replays autorisés non publiables ;
- `private-output/` : sorties intermédiaires susceptibles de révéler la traduction ;
- `renders/` : rendus audio de travail ;
- `reports-local/` : rapports non encore classés pour publication.

Ces emplacements sont des zones de travail, pas des sources de vérité canoniques.

## 4. Prochaine étape autorisée

Après validation du corpus synthétique :

1. inspecter **hors GitHub** la forme réelle d'un export provenant d'une campagne Cœur close ;
2. classer les champs avant toute copie ;
3. construire un adaptateur privé qui ne sort que la projection explicitement autorisée ;
4. faire consommer cette sortie par le même lecteur utilisé pour les fixtures ;
5. vérifier qu'aucune modification de la grammaire n'est nécessaire pour passer d'une fixture à un replay.

L'adaptateur réel n'est pas préparé à l'aveugle : sa forme dépend de l'export effectivement observé.

## 5. Point d'arrêt obligatoire

Ne pas franchir ces limites sans nouveau gate :

- aucun export réel du Cœur dans GitHub ;
- aucune recette de traduction ou taxonomie interne publiée ;
- aucun accès direct de la grammaire aux tables/classes/champs du Cœur ;
- aucune intégration live au Cœur canonique ;
- aucun moteur audio déclaré définitif ;
- aucun choix musical propriétaire inscrit dans les fixtures publiques neutres.

## 6. Critère de réussite du terrain préparé

Le terrain est considéré prêt lorsque :

- les fixtures A/B/C passent le contrôle d'intégrité et d'enveloppe ;
- un poste local peut créer ses répertoires privés sans risque de commit accidentel ;
- la prochaine intervention peut se limiter à l'inspection d'un export clos et à l'écriture d'un adaptateur privé ;
- le Cœur, le PROTO et le renderer restent indépendants.

À ce stade, le chantier est prêt à recevoir des données réelles **sans que ces données ni leur logique interne deviennent publiques par défaut**.
