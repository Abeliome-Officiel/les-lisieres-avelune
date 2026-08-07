# PROTO-0.2 — Brief visuel Gen3 corrigé

## Rôle de Gen3

Gen3 est une **référence de composition ergonomique**, pas une direction artistique à copier. Son intérêt principal est la répartition des zones :

- HUD ressources/capacités en haut ;
- fiche Corcite à gauche ;
- grand plateau hexagonal central ;
- panneau contextuel de sélection à droite ;
- inventaire / ordres en bas ;
- accès aux défenses visible sans quitter mentalement le run.

Codex doit préserver cette hiérarchie générale si elle fonctionne dans le code réel, puis l’adapter au responsive.

## Ce qu’il faut reprendre

- priorité visuelle donnée au plateau central ;
- sélection d’une case/bâtiment avec détail contextuel immédiat ;
- ressources permanentes ;
- inventaire visible comme réserve concrète ;
- séparation économique / vue défensive ;
- fiche Corcite lisible comme une fiche RPG et non un tableau administratif ;
- composition dense mais structurée, typée jeu de gestion/stratégie.

## Ce qu’il ne faut PAS reprendre de Gen3

- personnage/humanoïde ;
- forêt fantasy naturaliste ;
- architecture médiévale ;
- adjacences ou connexions inventées ;
- bouton `Move` pour un bâtiment posé ;
- stats dupliquées dans plusieurs zones ;
- timer temps-réel / sentiment de RTS temps réel ;
- ressources non prévues ;
- tours/fonctions anciennes non retenues.

## Direction Avelune provisoire

Chercher une identité :
- onirique ;
- queer sans codes caricaturaux ;
- féerique abstraite ;
- organique + minérale ;
- formes souples, membranes, gemmes, nervures, pétales abstraits, excroissances cristallines ;
- Corcite non anthropomorphe, davantage organisme/structure vivante que ville médiévale ;
- palette dominante violet sombre / prune / lavande / opalin avec irisations et accents lumineux mesurés ;
- fonds profonds mais pas noirs bouchés ;
- contrastes fonctionnels nets.

## Plateau

Le plateau doit sembler appartenir au Corcite, pas être une carte de terrain réaliste. Les hexagones peuvent avoir :
- texture subtile ;
- ressource de sol lisible par symbole + matière visuelle ;
- léger relief/halo ;
- état libre, occupé, sélectionné, compatible clairement distinct.

Bâtiments : silhouettes simples mais différenciables, organiques/minérales, évitant l’usine sci-fi conventionnelle.

## HUD et panneaux

- panneaux semi-opaques ou opalins ;
- bordures/ornements biomorphiques légers ;
- typographie sobre et lisible ;
- valeurs essentielles grosses, libellés secondaires plus discrets ;
- tooltips/panneaux de détail pour les explications ;
- pas de surcharge décorative.

## États importants à styliser

- sélection ;
- actif / OFF ;
- population insuffisante ;
- énergie insuffisante ;
- stockage plein ;
- sortie bloquée ;
- ressource réservée ;
- bâtiment démonté ;
- recherche disponible/en cours/terminée ;
- défense disponible/placée ;
- onde en cours ;
- victoire testeur / victoire jeu.

## Niveau de finition attendu

Ce lot n’a pas à trouver la DA finale. Il doit cependant dépasser la maquette fonctionnelle grise :
- cohérence de palette ;
- composants alignés ;
- spacing/typographie propres ;
- plateau agréable à manipuler ;
- responsive acceptable ;
- quelques micro-transitions CSS légères si elles améliorent la compréhension ;
- aucun gros chantier d’illustration qui empêcherait de finir le mini-jeu.

Le critère : **on doit reconnaître un prototype d’Avelune et avoir envie de le manipuler**, même si les assets sont encore temporaires.
