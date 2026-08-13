# Monde persistant, carte et chronologie

## Géométrie de développement historique

Les premiers prototypes ont utilisé un disque hexagonal de rayon **R = 7** comme géométrie de laboratoire :

- 169 hexagones au total ;
- zone centrale initialement inutilisable ;
- dernier anneau non constructible ;
- deux anneaux jouables extérieurs servant de réserve de confort ;
- simulations initiales à petite population.

Cette géométrie appartient à l'histoire des prototypes et **ne fixe pas à elle seule la taille du futur monde canonique**.

## Substrat canonique du Cœur vivant

Le chantier du [Cœur vivant et de la genèse canonique](21_coeur_vivant_genese_canonique.md) fixe désormais une contrainte plus fondamentale : avant tout lancement canonique, Avelune doit posséder un substrat spatial persistant capable de porter son histoire.

Ce substrat doit conserver :

- la Fracture ;
- le Sol ;
- la Lisière ;
- les voisinages et la propagation ;
- les états locaux ;
- la mémoire et les cicatrices ;
- une organisation compatible avec les anneaux et le futur plateau hexagonal.

La taille finale peut rester ouverte. L'architecture doit permettre une extension ultérieure sans réinitialiser les régions déjà nées.

## Persistance des lieux

L'identité d'un lieu est distincte de ses seules coordonnées techniques. Toute transformation future de la géométrie du monde devra préserver autant que possible les secteurs, ensembles, voisinages, traces et relations historiques.

Des régions initialement comparables peuvent diverger au fil du temps en fonction de leur histoire naturelle, des vagues reçues et de leurs transformations persistantes.

Les causes profondes, conditions exactes et scénarios futurs de transformation de la carte sont classés **Cœur d'Avelune** lorsqu'ils constituent une surprise narrative ou une causalité propriétaire.

## Genèse et arrivée des joueurs

Une future instance canonique peut vivre longtemps avant l'arrivée des joueurs. Lorsque les premiers Corcites jouables apparaissent, ils doivent s'implanter dans l'état réellement atteint par le monde plutôt que dans une carte remise à neuf.

L'implantation initiale doit toutefois conserver un garde-fou d'équité : positions viables et comparables sans exiger des terrains identiques ni effacer l'histoire locale.

## Temporalité fictionnelle

- **Tour** : unité abstraite de calcul et de choix lorsque le gameplay l'utilise.
- **Phase** : période définissant les actions autorisées.
- **Cycle** : séquence complète associée à une vague et ses conséquences.
- **Régime / saison d'Avelune** : contexte long du monde si cette couche est retenue ; il ne s'agit pas nécessairement d'une saison terrestre calendaire.
- **Chapitre** : transformation importante du jeu ou du monde.
- **Époque** : changement historique exceptionnel, si ce niveau s'avère nécessaire.

La version logicielle reste distincte de cette chronologie.

## Trois horloges à ne pas confondre

Le projet distingue désormais trois temporalités qui peuvent coexister sans imposer le même mode de jeu :

1. **temps de laboratoire du Cœur** : ticks, cycles et unités accélérées utilisés pour simuler, comparer et qualifier les mécanismes ;
2. **temps canonique du monde** : continuité interne de l'instance persistante d'Avelune ;
3. **temps de gameplay / temps humain** : sessions, tours, délais ou actions vécus par les joueurs.

Les « années » utilisées dans les campagnes accélérées actuelles du laboratoire ne constituent donc **pas encore une année calendaire canonique d'Avelune** et ne doivent pas être converties rétroactivement en durée fictionnelle.

Un jeu au tour par tour peut parfaitement coexister avec un Cœur continu : les commandes du joueur sont discrètes tandis que le monde peut évoluer entre elles. De même, un passage ultérieur du gameplay vers davantage de temps réel ne doit pas nécessiter de modifier les lois du Cœur si les interfaces temporelles restent découplées.

## Conversion temps humain ↔ temps d'Avelune — décision ouverte

Au 13 août 2026, aucune équivalence canonique du type **« 1 année humaine = N années d'Avelune »** n'est actée.

Cette conversion devra être décidée après stabilisation suffisante du Cœur à partir de critères perceptifs et systémiques :

- vitesse à laquelle une lignée doit pouvoir apparaître, mûrir, diverger ou disparaître pour être perceptible aux joueurs ;
- fréquence acceptable des vagues et autres perturbations ;
- quantité d'histoire naturelle produite entre deux connexions ;
- capacité d'un joueur absent à revenir dans un monde transformé mais encore intelligible ;
- durée souhaitée des chapitres, saisons ou époques ;
- horizon réel de plusieurs années que l'instance canonique doit pouvoir traverser sans intervention structurelle.

La conversion doit être **configurable et versionnée à l'interface temporelle**, et non enfouie dans les lois biologiques. Cela permet de tester plusieurs accélérations, de ralentir ou accélérer la présentation du temps avant lancement canonique et de faire évoluer le mode de jeu sans réécrire le Cœur.

Une fois l'instance canonique lancée, toute modification de cette conversion devient une décision majeure : elle doit préserver la continuité historique et ne pas produire de saut arbitraire de l'état du monde.

## Histoire réelle et histoire fictionnelle

Les mondes de laboratoire et les prototypes peuvent être réinitialisés. Une instance explicitement déclarée **canonique** ne doit en revanche plus être traitée comme une partie de test effaçable pour convenance de développement.

Le code peut évoluer par migrations et versions ; l'histoire du monde doit rester continue.

Les noms, étapes et vérités profondes de cette chronologie restent dans le **Codex secret** tant qu'ils ne sont pas explicitement destinés aux joueurs.
