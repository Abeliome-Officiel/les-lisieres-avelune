# Cœur vivant — gate de suffisance et limite de recherche

> **Statut : règle méthodologique partageable — v0.3**  
> Date : 17 août 2026

## 1. Principe : viser la suffisance durable, pas la perfection

Le Cœur n’a pas besoin d’être un modèle biologique parfait. Il doit être **suffisamment robuste, riche, explicable et exploitable pour soutenir durablement un monde vivant en production**.

La recherche s’arrête lorsque les risques résiduels deviennent acceptables et connus, et que de nouvelles modifications apportent surtout des gains marginaux ou déplacent les compromis sans résoudre de défaillance structurelle.

L’absence de perfection n’est donc pas un motif pour prolonger indéfiniment la préproduction.

### 1.1 Robustesse ne signifie pas immortalité

La robustesse recherchée n’est pas une garantie de survie de chaque forme, lignée, région ou état du monde.

Avelune doit pouvoir subir des pertes, des crises, des raréfactions, des changements de régime, des extinctions locales, des cicatrices et des récupérations incomplètes. Une perturbation forte peut modifier durablement l’histoire du monde sans constituer à elle seule une défaillance du Cœur.

Ce que la qualification doit écarter est la **fragilité structurelle triviale** : un système qui s’effondre mécaniquement sous une situation admissible parce que ses dynamiques ne peuvent plus produire de réponse cohérente.

Inversement, aucun mécanisme caché ne doit être ajouté uniquement pour garantir la survie, restaurer automatiquement un état antérieur ou maintenir artificiellement une valeur cible de diversité. La réponse doit provenir des lois ordinaires du monde.

Une catastrophe cohérente produite par ces lois peut appartenir à l’histoire canonique. Un bug, une corruption d’état ou une dérive numérique reste un défaut technique et ne doit jamais être requalifié en événement narratif.

## 2. Runs multi-questions

Lorsqu’un même protocole peut répondre proprement à plusieurs hypothèses sans rendre l’interprétation ambiguë, les campagnes doivent être instrumentées pour mesurer plusieurs questions simultanément.

Conditions :

- les observateurs restent neutres ;
- les métriques sont définies avant le run ;
- les hypothèses et critères de réfutation sont pré-enregistrés ;
- la collecte supplémentaire reste peu coûteuse par rapport au coût de simulation ;
- une métrique secondaire ne doit pas contaminer le mécanisme principal ;
- les conclusions restent séparables : un run multi-questions ne doit pas devenir un run « fourre-tout ».

Cette règle vise à maximiser l’information scientifique obtenue par heure machine sans sacrifier la causalité.

## 3. Quand peut-on dire « nous avons ce qu’il faut » ?

CŒUR-0 peut être considéré comme **suffisamment mûr pour la production** lorsque les familles de critères suivantes sont satisfaites conjointement.

### 3.1 Robustesse écologique

- pas de dérive structurelle systématique non voulue aux horizons courts, moyens et longs ;
- pas de monoculture, extinction globale ou état absorbant récurrent hors comportements explicitement acceptés ;
- diversité, coexistence, renouvellement et persistance restent compatibles entre eux au lieu d’être optimisés séparément ;
- les lignées peuvent naître, échouer, persister, diverger et disparaître sans qu’un seul résultat domine mécaniquement toutes les trajectoires ;
- les perturbations peuvent produire de vraies pertes et transformations durables sans remettre continuellement le monde à zéro ni déclencher un sauvetage automatique.

Une forte baisse locale ou temporaire n’est donc pas automatiquement un échec de qualification. L’analyse doit distinguer une réponse écologique forte mais cohérente, une transition vers un autre régime viable, une catastrophe légitime et une fragilité structurelle.

### 3.2 Robustesse hors échantillon

La validation finale ne doit pas utiliser uniquement les seeds, conditions initiales et cas ayant servi à concevoir ou régler le modèle.

Une campagne de confirmation doit employer des seeds et scénarios **tenus à l’écart du réglage**, afin de vérifier que le Cœur ne fonctionne pas seulement sur les cas déjà observés.

### 3.3 Robustesse aux conditions limites

Le moteur doit rester cohérent sous des situations rares mais plausibles :

- faible et forte densité ;
- faible et forte diversité ;
- succession de perturbations défavorables ;
- longues périodes calmes ;
- régions très favorables ou défavorables ;
- configurations spatiales atypiques ;
- reprise après arrêt et redémarrage du runtime.

Les cas impossibles ou volontairement non supportés doivent être explicitement bornés. Les conditions adversariales ne doivent pas être fabriquées en modifiant arbitrairement une recette interne dont le domaine canonique n’est pas défini : elles doivent rester interprétables comme cas admissibles du système effectivement qualifié.

### 3.4 Stabilité temporelle

Les métriques pertinentes doivent être examinées par fenêtres temporelles successives, pas seulement en moyenne globale.

Le passage en production exige l’absence de « ratchet » caché : un indicateur qui paraît sain en moyenne mais dérive lentement vers un état pathologique au fil du temps.

La qualification temporelle longue de la baseline actuelle est désormais considérée **suffisamment close pour CŒUR-0** : les campagnes prolongées et leurs analyses de renouvellement ne montrent pas de trajectoire nécessitant une correction biologique pour éviter un effondrement lent ou une monoculture. Cette conclusion porte sur la suffisance durable, pas sur une stationnarité mathématique parfaite.

Lorsque l’échelle canonique de temps sera définitivement reliée au temps réel, la qualification opérationnelle devra encore vérifier que cette dynamique reste exploitable dans le runtime de production.

### 3.5 Explicabilité causale suffisante

Il n’est pas nécessaire de pouvoir prédire chaque trajectoire. En revanche, les grandes familles d’échec et de réussite doivent être comprises suffisamment pour distinguer :

- comportement émergent attendu ;
- événement rare mais valide ;
- dérive structurelle ;
- défaut d’implémentation ;
- paramétrage hors domaine de validité.

Un système qui « a l’air de marcher » mais dont les effondrements restent inexplicables n’est pas qualifié.

### 3.6 Exploitabilité informatique

Le modèle doit également tenir comme logiciel :

- coût CPU/RAM compatible avec le budget matériel ;
- croissance du stockage et de la télémétrie bornée ;
- sauvegarde, reprise et restauration testées ;
- reproductibilité des simulations de laboratoire ;
- migrations de version prévues ;
- absence de dépendance à un composant irremplaçable sans voie de migration ;
- modes dégradés possibles pour les représentations non canoniques sans altérer le Cœur.

## 4. Gate de qualification CŒUR-0

La décision de gel de CŒUR-0 doit comporter trois validations distinctes :

1. **Qualification scientifique** : comportement dynamique jugé suffisamment robuste sur campagnes indépendantes et horizons multiples.
2. **Qualification adversariale** : campagnes difficiles et hors échantillon ne révèlent pas de faiblesse structurelle non acceptée ; elles n’exigent pas que toute trajectoire reste confortable ou identique.
3. **Qualification opérationnelle** : persistance, redémarrage, sauvegarde, migration, coût et observabilité permettent une exploitation de longue durée.

Le gel ne signifie pas que le Cœur ne changera plus jamais. Il signifie que les changements ultérieurs passent par des versions, migrations et preuves de non-régression, plutôt que par une recherche ouverte permanente.

## 5. État de convergence au 17 août 2026

Les campagnes diagnostiques successives ont permis de passer d’un goulot de persistance encore opaque à une dynamique évolutive causalement mieux comprise, sans ajouter de mécanisme de survie artificiel.

La qualification de profondeur temporelle est considérée suffisamment acquise pour ne pas justifier une nouvelle prolongation par principe. Le chantier adversarial porte maintenant sur la **largeur hors échantillon** : observer un grand ensemble de mondes indépendants avec la biologie inchangée et rechercher des queues rares réellement problématiques.

Cette campagne n’a pas pour objectif de démontrer que le Cœur « survit coûte que coûte ». Une trajectoire sévère devient un cas à expliquer, pas automatiquement un FAIL. Un prolongement ciblé n’est justifié que si l’analyse révèle une question résiduelle précise que les données présentes ne permettent pas de trancher.

Si cette qualification est satisfaisante, le risque principal se déplace vers le runtime réel : persistance, reprise après interruption, rattrapage, croissance des données, coût et fonctionnement continu. L’interface temporelle canonique et le contrat de lecture de production sont stabilisés dans cette phase avant naissance canonique.

Les seuils quantitatifs, distributions détaillées, seeds, paramètres, recettes et mappings causaux utilisés pour ces décisions restent dans la documentation propriétaire.

## 6. Si aucun modèle ne franchit la gate

L’échec à atteindre la gate complète n’implique pas l’abandon d’Avelune. L’ordre de repli est :

### Repli A — réduire l’ambition du Cœur, pas la cohérence du monde

Geler le sous-ensemble de lois qui est robuste et retirer ou différer les dimensions qui provoquent l’instabilité. Un Cœur plus simple mais fiable est préférable à un écosystème théoriquement plus riche qui exige des corrections permanentes.

### Repli B — garde-fous structurels uniquement s’ils deviennent de vraies lois du monde

Si une pathologie extrême est clairement comprise et qu’une borne ou une loi de conservation est nécessaire, elle doit être explicite, causale, testable et cohérente avec le monde. Elle ne peut pas servir de filet invisible garantissant la survie, restaurant l’état antérieur ou maintenant une diversité cible.

Un garde-fou qui améliore une métrique en masquant une dynamique mal comprise est rejeté.

### Repli C — architecture hybride bornée

Si l’émergence totalement libre reste impraticable, conserver un moteur dynamique local mais encadrer certaines transitions extrêmes par une couche canonique déterministe et versionnée. Cette option n’est acceptable que si les règles correspondantes ont un statut explicite dans le monde ; elle ne doit pas simuler secrètement une immortalité administrative.

### Repli D — dissocier profondeur simulée et profondeur perçue

En dernier recours, conserver un Cœur plus parcimonieux et produire une partie de la richesse perceptible par les interpréteurs visuel, sonore et narratif à partir des traces réellement disponibles, sans prétendre que le Cœur simule ce qu’il ne simule pas.

Ce dernier repli préserve l’intégrité du projet : aucune représentation ne doit inventer un état canonique fictif, mais elle peut exprimer richement un état canonique plus simple.

## 7. Règle finale

On arrête lorsque le modèle est **suffisamment bon pour être exploité et suffisamment compris pour être surveillé**, pas lorsqu’il est parfait.

La question de qualification n’est donc pas « peut-il fonctionner éternellement ? », impossible à démontrer, ni « peut-il empêcher toute catastrophe ? », ce qui serait contraire au vivant recherché. Elle est :

> **avons-nous accumulé assez de preuves indépendantes pour considérer que les principaux modes de fragilité structurelle sont connus, rares ou bornés, que les réactions fortes restent causalement compréhensibles, et que le modèle peut traverser une durée de production largement inférieure à son horizon testé sans intervention structurelle régulière ?**

Si la réponse est oui, CŒUR-0 est gelable. Si elle reste non après épuisement raisonnable des hypothèses causales les plus prometteuses, on applique un repli contrôlé au lieu de prolonger indéfiniment la recherche.
