# MUSIQUE-0 — Gate 0 — terrain prêt

Date : **13 août 2026**  
Statut : **VERT**

## Verdict

Le terrain technique minimal de MUSIQUE-0 est prêt pour une première intervention **hors ligne, réversible et indépendante du Cœur**.

Ce Gate ne valide ni une grammaire musicale définitive, ni un moteur audio, ni un contrat canonique définitif, ni un branchement live.

## Contrôles passés

- frontière documentaire public / classé alignée avec la Constitution vivante v0.5 ;
- aucune recette réelle du Cœur requise par le corpus public ;
- enveloppe expérimentale `avelune.representation.semantic` version `0.2.0` présente ;
- trois fixtures publiques neutres A/B/C présentes ;
- SHA-256 des trois fixtures identiques aux valeurs du manifeste ;
- séquences synthétiques cohérentes et distinctes ;
- contrôleur autonome `tools/musique0/check_public_fixtures.py` exécuté avec succès sur le corpus courant ;
- aucune dépendance Python externe nécessaire au contrôle minimal ;
- répertoires locaux sensibles et rendus de travail protégés par `lab/musique0/.gitignore` ;
- aucun import du jeu ni du Cœur dans le contrôleur ;
- aucun moteur audio choisi.

Sortie attendue du contrôle :

```text
MUSIQUE-0: 3 fixtures publiques neutres valides — contrat 0.2.0
```

## Ce qui est désormais autorisé

1. créer localement le laboratoire de travail à partir de `lab/musique0/` ;
2. conserver les entrées et sorties classées uniquement dans les zones locales ignorées ;
3. inspecter un export provenant d'une campagne Cœur close ;
4. classer cet export avant transformation ;
5. concevoir **hors GitHub** un adaptateur de source limité à la projection explicitement autorisée ;
6. vérifier ensuite que fixture synthétique et replay réel peuvent alimenter la même frontière contractuelle.

## Gate suivant

**G1-ADAPTATEUR PRIVÉ** ne peut commencer qu'après inspection de la forme réelle d'un export clos.

Conditions avant écriture de l'adaptateur :

- format réel constaté, pas supposé ;
- provenance et version identifiées ;
- champs classés avant copie ;
- sortie cible limitée au contrat nécessaire ;
- aucune donnée réelle du Cœur ajoutée au dépôt partagé ;
- aucune modification de la grammaire musicale nécessaire pour connaître la structure de la source.

## Point d'arrêt

Si l'export réel oblige la grammaire à connaître des structures internes du Cœur, **Gate échoué** : corriger l'adaptateur ou le contrat avant de poursuivre.

Si la projection nécessaire révèle une information classée, **Gate échoué** : rester dans le laboratoire privé et revoir la frontière de publication.

Le prochain travail utile n'est donc plus de préparer GitHub : c'est d'observer proprement un export CŒUR-0 clos sur la machine de laboratoire, puis de construire l'adaptateur privé à partir de faits constatés.
