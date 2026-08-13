# Cœur vivant — gate de suffisance et limite de recherche

> **Statut : règle méthodologique partageable — v0.1**  
> Date : 13 août 2026

## 1. Principe : viser la suffisance durable, pas la perfection

Le Cœur n’a pas besoin d’être un modèle biologique parfait. Il doit être **suffisamment robuste, riche, explicable et exploitable pour soutenir durablement un monde vivant en production**.

La recherche s’arrête lorsque les risques résiduels deviennent acceptables et connus, et que de nouvelles modifications apportent surtout des gains marginaux ou déplacent les compromis sans résoudre de défaillance structurelle.

L’absence de perfection n’est donc pas un motif pour prolonger indéfiniment la préproduction.

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
- les perturbations peuvent être traversées et produire des conséquences durables sans remettre continuellement le monde à zéro.

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

Les cas impossibles ou volontairement non supportés doivent être explicitement bornés.

### 3.4 Stabilité temporelle

Les métriques pertinentes doivent être examinées par fenêtres temporelles successives, pas seulement en moyenne globale.

Le passage en production exige l’absence de « ratchet » caché : un indicateur qui paraît sain en moyenne mais dérive lentement vers un état pathologique au fil du temps.

Lorsque l’échelle canonique de temps sera définitivement reliée au temps réel, la campagne de qualification finale devra couvrir en simulation accélérée un horizon nettement supérieur à l’intervalle de production que l’on souhaite pouvoir traverser sans intervention structurelle.

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
2. **Qualification adversariale** : campagnes volontairement difficiles et cas limites ne révèlent pas de faiblesse structurelle non acceptée.
3. **Qualification opérationnelle** : persistance, redémarrage, sauvegarde, migration, coût et observabilité permettent une exploitation de longue durée.

Le gel ne signifie pas que le Cœur ne changera plus jamais. Il signifie que les changements ultérieurs passent par des versions, migrations et preuves de non-régression, plutôt que par une recherche ouverte permanente.

## 5. Critère d’arrêt de la recherche ouverte

Le nombre de runs n’est pas à lui seul un critère d’arrêt. Cependant, la recherche doit avoir une limite pour éviter une optimisation sans fin.

Après le diagnostic R2.10, la stratégie est :

- exploiter en priorité les runs capables de départager plusieurs hypothèses à la fois ;
- privilégier d’abord les explications utilisant les mécanismes déjà présents ;
- tester seulement les familles de mécanismes nouvelles soutenues par les diagnostics ;
- une famille candidate qui échoue à un test de falsification clair est mise de côté ;
- une famille prometteuse reçoit une campagne de confirmation longue et hors échantillon.

Si plusieurs cycles successifs de recherche n’améliorent plus la compréhension causale ni les critères de qualification, on considère que la recherche ouverte a atteint son rendement décroissant et l’on passe à la stratégie de repli définie ci-dessous plutôt que d’empiler de nouvelles idées.

Les seuils quantitatifs internes de décision sont pré-enregistrés dans la documentation propriétaire avant les campagnes concernées.

## 6. Si aucun modèle ne franchit la gate

L’échec à atteindre la gate complète n’implique pas l’abandon d’Avelune. L’ordre de repli est :

### Repli A — réduire l’ambition du Cœur, pas la cohérence du monde

Geler le sous-ensemble de lois qui est robuste et retirer ou différer les dimensions qui provoquent l’instabilité. Un Cœur plus simple mais fiable est préférable à un écosystème théoriquement plus riche qui exige des corrections permanentes.

### Repli B — ajouter des garde-fous structurels explicites

Si un petit nombre de pathologies extrêmes subsiste, introduire des lois de conservation, bornes ou mécanismes homéostatiques minimaux, documentés comme lois du monde et testés comme tels. Ils ne doivent pas maquiller une dynamique mal comprise ni déclencher des corrections arbitraires au cas par cas.

### Repli C — architecture hybride bornée

Si l’émergence totalement libre reste impraticable, conserver un moteur dynamique local mais encadrer certains renouvellements globaux par une couche canonique déterministe et versionnée. Le monde demeure autonome, mais certaines transitions extrêmes sont administrées par des règles explicites plutôt que laissées à une dynamique non maîtrisée.

### Repli D — dissocier profondeur simulée et profondeur perçue

En dernier recours, conserver un Cœur plus parcimonieux et produire une partie de la richesse perceptible par les interpréteurs visuel, sonore et narratif à partir des traces réellement disponibles, sans prétendre que le Cœur simule ce qu’il ne simule pas.

Ce dernier repli préserve l’intégrité du projet : aucune représentation ne doit inventer un état canonique fictif, mais elle peut exprimer richement un état canonique plus simple.

## 7. Règle finale

On arrête lorsque le modèle est **suffisamment bon pour être exploité et suffisamment compris pour être surveillé**, pas lorsqu’il est parfait.

La question de qualification n’est donc pas « peut-il fonctionner éternellement ? », impossible à démontrer, mais :

> **avons-nous accumulé assez de preuves indépendantes pour considérer que les principaux modes d’échec sont connus, rares ou bornés, récupérables, et que le modèle peut traverser une durée de production largement inférieure à son horizon testé sans intervention structurelle régulière ?**

Si la réponse est oui, CŒUR-0 est gelable. Si elle reste non après épuisement raisonnable des hypothèses causales les plus prometteuses, on applique un repli contrôlé au lieu de prolonger indéfiniment la recherche.
