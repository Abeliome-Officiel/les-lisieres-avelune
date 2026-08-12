# Avelune — Cœur vivant — état agrégé de validation

> Date : 12 août 2026  
> Statut : **partageable / expurgé**.  
> Ce document publie uniquement des constats agrégés utiles au pilotage. Il ne décrit pas les recettes exactes, paramètres cachés ou mécanismes permettant de reconstruire le comportement propriétaire du Cœur.

## 1. Périmètre

Le laboratoire CŒUR-0 est un moteur headless séparé des PROTO jouables. Il sert à vérifier qu’Avelune peut évoluer sans joueur, conserver une histoire, subir des vagues, produire des différences spatiales durables et rester exploitable sur des horizons longs.

La logique exacte du laboratoire n’est pas hébergée dans ce dépôt. Le contrat public reste `21_coeur_vivant_genese_canonique.md`.

## 2. Baseline du monde

La première baseline stable a validé :

- exécution headless autonome ;
- persistance et reprise exacte ;
- reproductibilité à version et entrées identiques ;
- divergence de régions ;
- cicatrices et transformations persistantes ;
- comportement long terme sans extinction structurelle immédiate ni emballement évident ;
- coût matériel compatible avec un laboratoire dédié.

## 3. Diagnostic des formes pré-corcitiques

Les campagnes R2 ont progressivement déplacé l’analyse depuis les métriques globales d’occupation vers les causes locales d’établissement et de disparition.

### R2.6

L’hypothèse d’un favoritisme direct caché de l’établissement vers les cellules déjà partiellement occupées a été réfutée dans la précision mesurée. La recolonisation plus fréquente de certaines zones est surtout compatible avec leur contexte spatial et écologique.

Une variante expérimentale de compétition locale testée pendant ce diagnostic a produit une forte baisse de densité et de diversité ainsi qu’un turnover excessif. Elle a été abandonnée comme modèle de travail.

### R2.7

Un mécanisme minimal d’établissement a ensuite été retenu comme baseline de travail.

Sur les campagnes appariées longues :

- environ **15 %** des arrivées ne s’établissent pas ;
- l’occupation globale reste pratiquement inchangée ;
- densité et nombre de formes restent globalement neutres dans la précision mesurée ;
- la coexistence augmente d’environ **17 %** ;
- le turnover local baisse d’environ **14 à 15 %** ;
- aucun gain démontré de persistance longue des lignées n’apparaît encore.

Conclusion : le mécanisme améliore la qualité de l’établissement et réduit le renouvellement inutile, mais ne résout pas à lui seul la persistance des lignées.

### R2.8

L’analyse des extinctions montre que la quasi-totalité des lignées disparaît alors qu’elle est encore réduite à une seule implantation. Les vagues constituent la cause terminale la plus fréquente, mais cette classification terminale ne suffit pas à établir la cause profonde.

Le risque individuel de disparition est légèrement diminué par la baseline R2.7, sans hausse statistiquement démontrée du nombre final de lignées survivantes.

### R2.9

Le diagnostic de séquence montre que **plus de 99 % des lignées disparues meurent avant leur première propagation locale**. Une exposition aux vagues précède presque toujours cette propagation, mais il faut distinguer :

1. incapacité à atteindre l’état permettant la propagation ;
2. atteinte de cet état puis attente trop longue avant propagation ;
3. érosion répétée par les vagues avant cette première propagation.

## 4. R2.10 — campagne en cours

R2.10 est un observateur de diagnostic : il ne modifie pas la mécanique du monde.

Il mesure notamment :

- proportion de lignées atteignant l’état permettant une première propagation ;
- délai entre cette éligibilité et la propagation effective ;
- nombre d’expositions aux vagues avant propagation ou disparition ;
- contexte de la vague terminale ;
- cohortes de 5 et 10 ans pour limiter les biais de fin de trajectoire.

La campagne forte lancée le 12 août comprend **128 paires de trajectoires de 100 ans**, soit **25 600 années simulées** au total.

**Aucun résultat R2.10 n’est déclaré ici tant que la campagne n’est pas terminée et analysée.**

## 5. Règle de décision

Le prochain mécanisme ne doit pas être choisi par intuition ou par réglage opportuniste. R2.10 doit d’abord identifier le goulot dominant.

Si deux hypothèses causales restent sérieuses après analyse, elles pourront être testées en parallèle sur des campagnes appariées afin de réduire le temps de décision sans sacrifier la comparaison scientifique.

## 6. Ce que cette phase ne valide pas encore

Ces résultats ne signifient pas encore que le Cœur est prêt pour une naissance canonique.

Il reste notamment à valider suffisamment :

- la persistance écologique sur horizons plus longs ;
- l’absence de dérive lente indésirable ;
- la robustesse à plusieurs régimes du monde ;
- les opérations de sauvegarde/restauration/migration pour une instance durable ;
- l’observabilité nécessaire au suivi d’un monde canonique.

La naissance canonique reste donc postérieure à la clôture de cette phase de laboratoire.
