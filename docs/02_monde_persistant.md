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

Pour les futurs développements du jeu, **le tour n'est plus une unité fondamentale de gameplay**.

Les notions utiles deviennent notamment :

- **opération / action** : décision du joueur appliquée au monde à un instant donné ;
- **durée** : intervalle nécessaire à une construction, recherche, production, transport ou autre processus ;
- **échéance** : instant où une opération devient achevée, disponible ou produit une conséquence ;
- **cycle** : séquence causale complète associée à un phénomène du monde, lorsqu'une telle lecture est utile ;
- **régime / saison d'Avelune** : contexte long du monde si cette couche est retenue ; il ne s'agit pas nécessairement d'une saison terrestre calendaire ;
- **chapitre** : transformation importante du jeu ou du monde ;
- **époque** : changement historique exceptionnel, si ce niveau s'avère nécessaire.

La version logicielle reste distincte de cette chronologie.

## Décision de gameplay continu — 13 août 2026

La cible de développement est désormais un **monde persistant à temps continu, avec interactions asynchrones et sans notion de tour globale ou individuelle**.

Le joueur joue lorsqu'il le souhaite. Ses constructions, recherches, productions, transports et autres opérations sont datés et possèdent des durées ou cadences définies par le moteur de jeu. Aucun joueur ne fait « avancer le tour » du monde et aucun autre joueur n'attend qu'il termine une phase.

Une vague ou une autre perturbation appartient à la continuité du monde. Le gameplay ne repose pas structurellement sur un compteur de tours restant avant son arrivée ni sur une fenêtre fixe de préparation exprimée en tours. Des signes, estimations ou informations acquises peuvent exister, mais ils constituent une information de jeu et non une horloge fondamentale.

Cette décision s'applique à **toute nouvelle itération de prototype et à la production**.

Le **PROTO-0.2.2 existant constitue une exception historique volontaire** : son fonctionnement en tours reste inchangé jusqu'à sa clôture. Il ne doit pas être rétrofité pour adopter cette architecture ; sa fonction est de terminer la validation pour laquelle il a été construit.

## Trois temporalités à ne pas confondre

Le projet distingue trois notions qui ne jouent pas le même rôle :

1. **temps de laboratoire du Cœur** : ticks, cycles et unités accélérées utilisés pour simuler, comparer et qualifier les mécanismes ;
2. **temps canonique du monde** : continuité interne de l'instance persistante d'Avelune ;
3. **temps humain et orchestration du gameplay** : instants de connexion, décisions des joueurs, durées et échéances des opérations.

La troisième notion n'est pas une seconde horloge biologique. Elle décrit comment le moteur de jeu interface l'activité humaine avec le temps canonique.

Les « années » utilisées dans les campagnes accélérées actuelles du laboratoire ne constituent donc **pas encore une année calendaire canonique d'Avelune** et ne doivent pas être converties rétroactivement en durée fictionnelle.

Le Cœur doit pouvoir continuer à évoluer indépendamment du nombre de joueurs connectés. Le moteur de jeu traduit ensuite les actions humaines en opérations datées sans imposer de synchronisation collective.

## Conversion temps humain ↔ temps d'Avelune — décision ouverte

Au 14 août 2026, aucune équivalence canonique du type **« 1 année humaine = N années d'Avelune »** n'est actée.

Cette conversion devra être décidée après stabilisation suffisante du Cœur à partir de critères perceptifs et systémiques :

- vitesse à laquelle une lignée doit pouvoir apparaître, mûrir, diverger ou disparaître pour être perceptible aux joueurs ;
- fréquence acceptable des vagues et autres perturbations ;
- quantité d'histoire naturelle produite entre deux connexions ;
- capacité d'un joueur absent à revenir dans un monde transformé mais encore intelligible ;
- durée souhaitée des chapitres, saisons ou époques ;
- horizon réel de plusieurs années que l'instance canonique doit pouvoir traverser sans intervention structurelle.

Les diagnostics récents du Cœur ont renforcé un prérequis supplémentaire : la conversion ne doit pas être choisie avant d'avoir caractérisé le **spectre temporel écologique** du modèle. Il faut connaître les ordres relatifs d'établissement, récupération, accès à la propagation, reproduction, profondeur générationnelle et perturbations avant de transformer ces dynamiques en rythme perceptible pour les joueurs.

Cette caractérisation sert à éviter deux erreurs symétriques : accélérer le calendrier au point de transformer une pression écologique en succession artificiellement brutale, ou ralentir les phénomènes au point que la réponse évolutive du monde devienne pratiquement invisible à l'échelle humaine.

La conversion doit être **configurable et versionnée à l'interface temporelle**, et non enfouie dans les lois biologiques. Les durées de construction, recherche, production ou transport relèvent de l'orchestration du jeu ; elles peuvent être équilibrées sans réécrire les lois du Cœur.

Une fois l'instance canonique lancée, toute modification importante de cette conversion devient une décision majeure : elle doit préserver la continuité historique et ne pas produire de saut arbitraire de l'état du monde.

## Histoire réelle et histoire fictionnelle

Les mondes de laboratoire et les prototypes peuvent être réinitialisés. Une instance explicitement déclarée **canonique** ne doit en revanche plus être traitée comme une partie de test effaçable pour convenance de développement.

Le code peut évoluer par migrations et versions ; l'histoire du monde doit rester continue.

Les noms, étapes et vérités profondes de cette chronologie restent dans le **Codex secret** tant qu'ils ne sont pas explicitement destinés aux joueurs.
