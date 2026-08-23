# Portabilité — chantier parallèle non intrusif

> Statut : **OUVERT / PARALLÈLE / HORS CHEMIN CRITIQUE** — 23 août 2026

## Objet

Avelune ouvre un chantier de portabilité destiné à vérifier que ses composants durables peuvent, si nécessaire, être réimplémentés ou migrés vers un autre langage, runtime, moteur ou environnement sans perdre leur identité, leur histoire, leur sémantique ni les garanties déjà qualifiées.

Ce chantier **n’ordonne aucune réécriture** et ne sélectionne aucun langage de remplacement.

## Règle de non-intrusion

Le chantier commence uniquement par :

- audits read-only ;
- spécifications ;
- fixtures et vecteurs de test ;
- prototypes isolés non canoniques.

Il **ne modifie pas** les baselines P0, P0-AUTH, P1, P3 ou d’autres modules qualifiés pour produire ses preuves. Une baseline ne peut être rouverte qu’après démonstration d’un couplage concret, décision explicite de migration et définition des requalifications réellement nécessaires.

## Chronologie

L’ouverture intervient après la clôture de P0/CŒUR-0, P0-AUTH et P1/CREAD-LIVE.

P3 n’est pas entièrement clos au moment de cet acte : ORCH-0 est qualifié et ORCH-1 est la gate critique active. Le chantier de portabilité doit donc **auditer P3**, sans prétendre qu’il est ouvert après clôture de tout P3 et sans redessiner ORCH-0.

## Constat initial partageable

L’audit initial montre que l’architecture et les formats de haut niveau sont déjà largement favorables à la migration : état structuré, identité persistante explicite, révision canonique, âge canonique exact, contrats versionnés et transport P1 remplaçable.

La propriété suivante n’est toutefois **pas encore qualifiée** : remplacer l’implémentation actuelle du Cœur par une implémentation écrite dans un autre langage tout en garantissant une reprise et une trajectoire déterministe strictement équivalentes.

Des dépendances à des détails de runtime et de calcul numérique restent donc à inventorier et à contractualiser avant de pouvoir parler d’interchangeabilité inter-langages. Les détails privés de ces dépendances restent hors GitHub.

Ce constat **n’invalide aucun PASS existant**.

## Périmètre d’audit

- **P0 / Cœur** : état canonique, déterminisme, représentation numérique, sérialisation, migrations et équivalence de trajectoire ;
- **P0-AUTH** : indépendance inter-langages de `world_instance_id`, `state_revision`, `canonical_age` et de l’atomicité du committed state ;
- **P1 / CREAD** : absence de fuite d’hypothèses d’implémentation P0 dans le contrat sémantique et le transport ;
- **P3 / Orchestrateur** : hypothèses liées à l’exécutable, au lifecycle, au healthcheck, au backup/restore, au placement et aux migrations ;
- **futurs modules** : éviter de créer de nouvelles dépendances techniques non migrables sans nécessité démontrée.

## Séquence proposée

```text
PORT-A0 — inventaire read-only
→ PORT-A1 — spécification des invariants réellement portables
→ PORT-A2 — fixtures et vecteurs inter-langages
→ PORT-A3 — prototype alternatif non canonique
→ PORT-A4 — décision humaine : aucun changement / migration ciblée / portage réel
```

Aucune de ces étapes ne peut déclarer P0/P1/P3 invalide au seul motif qu’une implémentation diffère. Une divergence devient bloquante uniquement si elle viole une exigence de portabilité explicitement retenue ou empêche une migration réellement nécessaire.

## Chemin critique inchangé

Le chemin critique reste :

```text
P3 — ORCH-1
→ P2 — OBS-1 FINALIZATION
→ P4 — si nécessaire
→ O5-MIGRATION
→ P5A / P5B / P6 live
→ isolation intégrée
→ freeze intégré
→ endurance 240 h
→ analyse exhaustive
→ décision CŒUR-1
```

Le chantier de portabilité progresse en parallèle tant qu’il ne modifie pas les baselines actives et n’ajoute pas de dépendance au runtime canonique.

## Gouvernance

La Constitution vivante ajoute une règle spécifique de portabilité potentielle par conception et une règle de non-réouverture automatique après découverte d’une dette de portabilité. Ces règles complètent le principe déjà existant de technologies remplaçables et réversibles.

Les détails propriétaires, recettes, données aléatoires internes, paramètres, mappings privés et procédures sensibles restent hors GitHub conformément à la frontière de publication du projet.
