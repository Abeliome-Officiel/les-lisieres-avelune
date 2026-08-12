# Cœur vivant — références scientifiques et méthode de recherche

> Date : 13 août 2026  
> Statut : **cahier partageable de recherche**.  
> Ce document trace les sources extérieures utilisées pour éclairer la conception et l'analyse du Cœur vivant. Il ne contient ni recette secrète, ni seuil caché, ni paramètre permettant de reconstruire le moteur propriétaire.

## 1. Règle de traçabilité

Toute influence extérieure significative reçoit une citation permettant de retrouver la source et un rôle explicite dans le raisonnement. Comme pour le cahier MUSIQUE-0, quatre statuts restent distincts :

- **[RÉFÉRENCE]** : ce qu'une source extérieure établit, modélise ou documente ;
- **[HYPOTHÈSE AVELUNE]** : ce que nous proposons d'en tirer pour le Cœur ;
- **[TESTÉ]** : résultat obtenu avec nos propres simulations et protocoles ;
- **[ACTÉ]** : décision de conception explicitement retenue.

Une référence ne devient jamais une loi d'Avelune par autorité. Les études servent à formuler de meilleures hypothèses, construire des observateurs et confronter nos résultats. Les valeurs numériques, espèces et équations terrestres ne sont pas importées automatiquement dans Avelune.

### Traçabilité historique

Une partie des jalons R1 à R2.10 a été conçue et testée avant la constitution formelle de cette bibliographie. Le présent registre **ne prétend pas rétroactivement** qu'une publication précise a causé une décision antérieure lorsqu'aucune citation n'avait alors été consignée. Dans ce cas, la source est qualifiée de référence de confrontation rétrospective et sert surtout à orienter les diagnostics suivants.

## 2. Corpus initial — coexistence, dispersion et structure spatiale

**[RÉFÉRENCE]** Tilman, D. (1994), « Competition and Biodiversity in Spatially Structured Habitats », *Ecology* 75(1), 2–16. DOI : `10.2307/1939377`.  
Intérêt : la coexistence spatiale peut dépendre de compromis entre capacité compétitive, colonisation et longévité ; la dispersion et le voisinage peuvent permettre des coexistences impossibles dans un modèle non spatial.

**[RÉFÉRENCE]** Brown, J. H.; Kodric-Brown, A. (1977), « Turnover Rates in Insular Biogeography: Effect of Immigration on Extinction », *Ecology* 58(2), 445–449. DOI : `10.2307/1935620`.  
Intérêt : formalisation du **rescue effect** : l'immigration peut réduire le risque d'extinction d'une population locale.

**[RÉFÉRENCE]** Hanski, I.; Ovaskainen, O. (2000), « The metapopulation capacity of a fragmented landscape », *Nature* 404, 755–758. DOI : `10.1038/35008063`.  
Intérêt : la persistance dépend non seulement du nombre de sites mais de leur configuration et de leur connectivité ; un paysage possède une capacité de métapopulation liée à sa structure spatiale.

**[RÉFÉRENCE]** Holt, R. D. (1985), « Population dynamics in two-patch environments: Some anomalous consequences of an optimal habitat distribution », *Theoretical Population Biology* 28(2), 181–208. DOI : `10.1016/0040-5809(85)90027-9`.  
Intérêt : dynamique source–puits et rôle de la dispersion entre habitats de qualité différente.

**[RÉFÉRENCE]** Snyder, R. E. (2003), « Local dispersal can facilitate coexistence in the presence of permanent spatial heterogeneity », *Ecology Letters* 6(4), 301–309. DOI : `10.1046/j.1461-0248.2003.00434.x`.  
Intérêt : une dispersion locale, combinée à une hétérogénéité environnementale, peut renforcer la coexistence au lieu de simplement homogénéiser le système.

## 3. Corpus initial — établissement, seuils et histoire d'assemblage

**[RÉFÉRENCE]** Keitt, T. H.; Lewis, M. A.; Holt, R. D. (2001), « Allee Effects, Invasion Pinning, and Species' Borders », *The American Naturalist* 157(2), 203–216. DOI : `10.1086/318633`.  
Intérêt : une dépendance positive à la densité et un seuil critique peuvent empêcher l'expansion d'une population même en environnement autrement compatible.

**[RÉFÉRENCE]** Fukami, T.; Bezemer, T. M.; Mortimer, S. R.; van der Putten, W. H. (2005), « Species divergence and trait convergence in experimental plant community assembly », *Ecology Letters* 8(12), 1283–1290. DOI : `10.1111/j.1461-0248.2005.00829.x`.  
Intérêt : l'histoire initiale d'assemblage peut laisser des trajectoires d'identité durablement différentes alors que certains traits convergent ; les effets de priorité peuvent coexister avec un filtrage déterministe.

**[RÉFÉRENCE]** Connell, J. H.; Slatyer, R. O. (1977), « Mechanisms of Succession in Natural Communities and Their Role in Community Stability and Organization », *The American Naturalist* 111(982), 1119–1144. DOI : `10.1086/283241`.  
Intérêt : distingue plusieurs mécanismes d'assemblage/succession — facilitation, tolérance, inhibition — et rappelle que l'ouverture d'espace et l'histoire des occupants modifient les successions possibles.

## 4. Corpus initial — perturbation, mosaïque et temporalités

**[RÉFÉRENCE]** Levin, S. A.; Paine, R. T. (1974), « Disturbance, Patch Formation, and Community Structure », *Proceedings of the National Academy of Sciences* 71(7), 2744–2747. DOI : `10.1073/pnas.71.7.2744`.  
Intérêt : des perturbations localisées créent une hétérogénéité spatio-temporelle et renouvellent des opportunités qui peuvent empêcher le seul compétiteur dominant de monopoliser l'espace.

**[RÉFÉRENCE]** Paine, R. T.; Levin, S. A. (1981), « Intertidal Landscapes: Disturbance and the Dynamics of Pattern », *Ecological Monographs* 51(2), 145–178. DOI : `10.2307/2937261`.  
Intérêt : observations et expériences sur naissance/mort des patches, âge et taille des ouvertures, colonisation et interaction entre régime de perturbation et calendrier reproductif.

**[RÉFÉRENCE]** Hastings, A. (1980), « Disturbance, coexistence, history, and competition for space », *Theoretical Population Biology* 18(3), 363–373. DOI : `10.1016/0040-5809(80)90059-3`.  
Intérêt : montre qu'un même niveau de perturbation peut avoir des conséquences complexes selon l'histoire et la hiérarchie compétitive ; la perturbation n'est ni intrinsèquement bénéfique ni intrinsèquement destructrice.

## 5. Résultats internes déjà établis à confronter à ce corpus

**[TESTÉ]** Les diagnostics R2.6 ont réfuté, dans la précision mesurée, l'hypothèse d'un favoritisme direct caché des cellules déjà occupées ; les différences d'établissement observées sont surtout compatibles avec le contexte spatial, la viabilité et l'exposition aux propagules.

**[TESTÉ]** R2.7 réduit nettement le turnover local et augmente la coexistence sans gain démontré de persistance finale des lignées.

**[TESTÉ]** R2.8 et R2.9 montrent que la quasi-totalité des lignées éteintes disparaît alors qu'elle ne possède encore qu'une implantation et avant sa première propagation locale. L'exposition aux vagues précède presque toujours cette première propagation.

**[TESTÉ]** R2.10 est un observateur neutre destiné à séparer : incapacité à atteindre l'état de propagation, attente après éligibilité, et érosion par les vagues. Aucun verdict n'est inscrit avant clôture et analyse de la campagne.

## 6. Hypothèses nouvelles alimentées par la littérature — pas encore actées

**[HYPOTHÈSE AVELUNE — temporalités]** Le goulot précoce pourrait être avant tout un **désaccord d'échelles de temps** : maturation/propagation trop lente relativement au régime de perturbation. Cela rappellerait, sans l'assimiler, le problème R1 où la cadence des vagues et les temps de récupération étaient incompatibles. R2.10 doit quantifier ce rapport avant toute nouvelle mécanique.

**[HYPOTHÈSE AVELUNE — seuil effectif]** Si la première propagation exige un état local discret difficile à atteindre ou à conserver, le système peut produire un **effet de seuil analogue à un mécanisme d'Allee au niveau de l'expansion**, même si la croissance locale elle-même n'est pas un modèle d'Allee. Il faut distinguer cette analogie fonctionnelle d'une véritable dépendance démographique positive à la densité.

**[HYPOTHÈSE AVELUNE — absence de secours avant redondance]** Une lignée à implantation unique ne peut bénéficier d'aucun vrai secours spatial de sa propre lignée avant d'avoir déjà réussi sa première propagation. Le modèle peut donc posséder par construction une phase de **point unique de défaillance biologique**. La littérature métapopulationnelle invite à mesurer explicitement quand apparaît une redondance réellement protectrice.

**[HYPOTHÈSE AVELUNE — redondance corrélée]** Une seconde implantation voisine n'est pas nécessairement une redondance indépendante si les deux emplacements subissent les mêmes vagues ou les mêmes conditions. La métrique utile pourrait être le temps jusqu'à une **redondance de risque suffisamment décorrélée**, et non simplement le temps jusqu'au premier budding.

**[HYPOTHÈSE AVELUNE — compromis de vie]** Une diversité durable peut nécessiter des compromis réels entre colonisation, compétition, longévité, tolérance aux perturbations ou exploitation des milieux. Avant d'ajouter une capacité locale complexe, il faut vérifier si les traits existants produisent effectivement de tels compromis ou s'ils classent implicitement certaines lignées comme meilleures presque partout.

**[HYPOTHÈSE AVELUNE — perturbation fertile]** Les vagues ne devraient pas être évaluées seulement par les morts qu'elles causent. Une perturbation peut aussi créer des fenêtres de colonisation, modifier les voisinages et renouveler des opportunités. Il faut donc mesurer la naissance et l'établissement **après** perturbation, pas uniquement la cause terminale des extinctions.

**[HYPOTHÈSE AVELUNE — histoire locale]** L'amélioration de coexistence observée avec R2.7 peut être compatible avec une importance accrue de l'histoire locale et des effets de priorité. Cela reste une interprétation de travail : seule une analyse dédiée peut montrer si le mécanisme produit réellement cette contingence historique.

## 7. Diagnostics prioritaires après R2.10

Sous réserve du verdict R2.10, privilégier d'abord des mesures ou expériences minimales capables de départager les mécanismes :

1. comparer explicitement temps vers éligibilité, temps éligibilité→propagation et cadence/exposition réelle aux vagues ;
2. mesurer les compromis de traits des lignées survivantes et éteintes plutôt que seulement leurs moyennes globales ;
3. distinguer première propagation et première **redondance de risque** ;
4. mesurer la probabilité d'établissement et de diversification dans les fenêtres post-perturbation ;
5. mesurer connectivité, qualité locale et éventuels effets source–puits au niveau des lignées déjà multi-sites ;
6. si un seuil est causal, tester la **forme du mécanisme** avant de régler numériquement le seuil existant.

Ces diagnostics ne constituent pas une décision d'ajouter une banque de propagules, une dormance, un nouveau stade, une nouvelle capacité ou un nouveau paramètre. Toute nouvelle mécanique devra être justifiée par un résultat causal, puis testée contre un contrôle apparié.

## 8. Frontière public / secret

Ce cahier peut publier les références, leur rôle, les hypothèses générales et les résultats suffisamment agrégés.

Restent hors GitHub : recettes exactes du Cœur, paramètres, seuils, fonctions de fitness/viabilité, distributions secrètes, signatures de lignées ou de régions, mapping exact d'une publication vers un coefficient propriétaire, causalités narratives réservées et tout élément permettant de reconstruire le fonctionnement caché du monde.

## 9. Règle d'entretien

Le corpus est vivant. Toute nouvelle source effectivement utilisée doit être ajoutée avec son rôle et ses limites. Une source abandonnée peut rester avec la raison du rejet. Les décisions du Cœur doivent pouvoir être retracées jusqu'aux références, hypothèses et tests qui les ont éclairées, sans confondre plausibilité écologique et validation interne d'Avelune.
