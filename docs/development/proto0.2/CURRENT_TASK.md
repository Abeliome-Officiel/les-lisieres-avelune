# CURRENT TASK — P02-001 — Construire l’alpha jouable PROTO-0.2

**Status : READY_FOR_LONG_CODEX_RUN**

**Base obligatoire : `develop/proto-0.2-ux-rules`**

## Mission

Transformer l’état actuel du dépôt en une **alpha PROTO-0.2 complète et réellement jouable**, suffisamment solide pour qu’au retour de l’utilisateur il reste principalement à relire, pousser si nécessaire et mettre en ligne.

Ce lot est volontairement large et prévu pour plusieurs heures d’autonomie. Ne pas s’arrêter après une première compilation verte ou un premier écran fonctionnel. Continuer jusqu’à ce que les gates de `04_ACCEPTANCE.md` soient satisfaites ou qu’une véritable décision humaine bloque tout travail indépendant.

Lire obligatoirement :
1. `/AGENTS.md`
2. `docs/development/proto0.2/00_CHARTER.md`
3. `docs/development/proto0.2/01_RULES_AND_SCOPE.md`
4. `docs/development/proto0.2/02_UX_SPEC.md`
5. `docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md`
6. `docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md`
7. `docs/development/proto0.2/04_ACCEPTANCE.md`
8. `docs/development/proto0.2/LEGACY_REFERENCES.md`
9. les documents `docs/conception/` utiles, uniquement s’ils ne contredisent pas les règles ci-dessus.

Puis inspecter le code réel avant de modifier.

---

# 1. Priorité absolue

Livrer un mini-jeu assemblé : **plateau + économie + recherche + défenses + vagues croissantes + victoire/défaite + persistance + habillage visuel Avelune provisoire**.

Le moteur existant doit être réutilisé lorsqu’il reste compatible. Les mécaniques historiques explicitement abandonnées pour PROTO-0.2 doivent être retirées du parcours actif au lieu d’être conservées comme seconde vérité.

---

# 2. Diagnostic initial obligatoire

Avant grosse modification :
- vérifier branche, Git status, historique récent ;
- inventorier `app/src/lib/proto0`, composants, routes et tests ;
- cartographier les anciennes dépendances : réserve énergie, espace abstrait, stockage natif, réseau direct, anciens champs de vague, captation ;
- identifier ce qui peut être migré proprement ;
- lire la stratégie Docker/validation avant d’exécuter les commandes ;
- ne pas écraser de modifications utilisateur non comprises.

Documenter brièvement le diagnostic dans `IMPLEMENTATION_REPORT.md`, puis travailler.

---

# 3. Lot mécanique

## A. Plateau hexagonal économique

Créer/adapter un plateau principal :
- cases hex ;
- ressources de sol ;
- 1 bâtiment par case ;
- placement libre ;
- prévisualisation ;
- extracteur compatible → production ; incompatible → 0 ;
- pas d’adjacence/logistique/réseau.

Supprimer du parcours joueur la vue réseau/ports/connexions directes.

## B. Déploiement initial

Plateau vide. Kit initial non posé : stockage, énergie, entretien, Atelier de construction, deux extracteurs, Fabrique défensive.

Pas de stockage natif permanent. Implémenter une phase de déploiement permettant de poser le premier stockage, puis faire entrer l’économie dans les règles normales.

Stock initial de référence : `4` organique, `4` minéral, `0` transformé, `0` composant. Ajustable par simulation uniquement si indispensable au bootstrap, mais ne jamais donner de transformé/composant au départ.

## C. Fabrication de bâtiments / défenses

- Atelier de construction → bâtiments économiques ;
- Fabrique défensive → tours ;
- fabriqué → inventaire → posé/utilisé ;
- commandes avec réservation correcte ;
- sortie producteur bloquée si inventaire plein ;
- rien perdu.

Ajouter Recyclerie fabricable dès le départ.

## D. Démontage/remontage

- bâtiment posé démontable ;
- objet démonté en inventaire ;
- recyclable ;
- remontable en 1 tour, sans nouveau coût matière ;
- aucun déplacement instantané ;
- stockage non retirable si capacité insuffisante ensuite.

## E. Énergie/population/entretien/stockage

- aucune réserve énergétique courte ;
- énergie used/capacity ;
- ON/OFF libère énergie mais garde population ;
- population retirable séparément ;
- stockage uniquement par bâtiments ;
- ancien espace abstrait désactivé pour le parcours P02.

## F. Recherche

Construire une petite progression réellement utile :
- unlock Transformation ;
- Extraction améliorée ;
- Transformation améliorée ;
- Fabrication améliorée ;
- Recyclerie améliorée ;
- **Stockage amélioré** ;
- autres petits nœuds seulement s’ils sont déjà justifiés par les sources et utiles au run.

Progression répétable : max 4 niveaux **au total cumulé** dans le proto, gains modestes/configurables.

## G. Défense simplifiée

Remplacer le parcours à quatre familles par une seule famille joueur : **Affaiblissement**.

- fabrication physique ;
- inventaire ;
- vue tactique séparée ;
- chemin de 8 positions comme base ;
- ordre mécanique visible ;
- réduction séquentielle de la Puissance.

Aucune captation, matière de vague, Déstructuration ou Stabilisation active.

## H. Onde / challenge

Remplacer la résolution active complexe par la règle P02 :
- une `Puissance` ;
- chaque onde suivante strictement plus puissante ;
- rythme impromptu/déterministe conforme aux règles ;
- résidu 0 → victoire immédiate testeur ;
- résidu >0 → dégâts d’Intégrité ;
- Intégrité 0 → victoire du jeu ;
- sinon continuer.

Le run n’a pas un nombre fixe de vagues.

Centraliser tous les paramètres. Faire des simulations nombreuses pour calibrer un challenge continu, non trivial mais gagnable. Une mauvaise trajectoire doit finir par mourir ; une bonne trajectoire doit pouvoir atteindre une onde à résidu zéro avant cela.

Ne pas chercher l’équilibrage du jeu final.

---

# 4. Lot UX / visuel — obligatoire

Ne pas remettre à plus tard toute la présentation.

Utiliser `06_VISUAL_BRIEF_GEN3.md` : Gen3 donne la composition, pas la DA.

Cible desktop :
- HUD haut ;
- fiche Corcite gauche ;
- plateau central dominant ;
- contexte droit ;
- inventaire/ordres bas ;
- accès Défenses clair.

Faire une vraie passe visuelle :
- palette Avelune violet/prune/lavande/opaline ;
- biomorphisme organique/minéral ;
- Corcite non anthropomorphe ;
- composants cohérents ;
- états interactifs clairs ;
- responsive mobile ;
- pas de fantasy médiévale, humain/humanoïde ou sci-fi industrielle générique.

Le résultat peut être provisoire mais doit ressembler à un jeu Avelune testable, pas à un back-office.

---

# 5. Rapports et sauvegarde

- rapport de vague séparé ;
- puissance initiale ;
- réductions successives ;
- résidu ;
- Intégrité avant/après ;
- résultat du run ;
- sauvegarde locale versionnée ;
- anciennes sauvegardes incompatibles rejetées/migrées proprement ;
- nouvelle partie explicite.

---

# 6. Tests et simulations

Boucle attendue :

`inspecter → implémenter → formatter/typecheck → tester → build → simuler → smoke tester → corriger → recommencer`

Ne pas s’arrêter à la première passe verte.

Avant `REVIEW_READY`, viser :
- `npm run check` vert ;
- `npm run test:proto0` vert ;
- `npm run build` vert ;
- tests unitaires ciblés ;
- simulations de plusieurs stratégies ;
- smoke desktop ;
- vérification responsive/mobile raisonnable ;
- aucune régression historique silencieuse hors périmètre.

Si Playwright est déjà disponible ou rapide à exploiter, ajouter les parcours E2E prioritaires sans transformer le lot en chantier d’infrastructure.

---

# 7. Autonomie accordée

Décider seul : architecture locale, refactors nécessaires, composants, CSS, mise en page, responsive, accessibilité, stratégie de tests, fixtures, paramètres numériques de laboratoire, nombre de simulations, petits ajustements de coûts nécessaires à un bootstrap/challenge sain.

Ne pas demander confirmation pour un problème purement technique.

Consigner dans `DECISIONS_NEEDED.md` uniquement une vraie bifurcation de game design non couverte par les sources. Continuer tout ce qui est indépendant avant de s’arrêter.

---

# 8. Interdictions

Ne pas :
- réintroduire réseau direct/ports/Factorio ;
- réintroduire réserve énergie ;
- utiliser ancien espace abstrait en parallèle ;
- créer stockage natif ;
- ajouter matière de vague/captation ;
- réinventer 4 familles de tours ;
- ajouter une caractéristique de vague autre que Puissance au challenge P02 ;
- inventer lore/races/classes/social ;
- force-push ;
- merger `main` ;
- déployer publiquement ;
- supprimer des tests pour obtenir du vert.

---

# 9. Rapport final obligatoire

Mettre à jour `IMPLEMENTATION_REPORT.md` avec :
- statut `REVIEW_READY`, `PARTIAL`, `DECISION_REQUIRED` ou `BLOCKED_TECHNICAL` ;
- branche + SHA final ;
- résumé jouable ;
- architecture/primitives créées ;
- migrations des anciennes mécaniques ;
- résultats tests/build ;
- résultats simulations et paramètres retenus ;
- état visuel/desktop/mobile ;
- dette restante ;
- décisions réellement requises ;
- commandes exactes pour revue et déploiement.

**Ne pas pousser vers `main` et ne pas déployer.** Le résultat doit rester prêt à être revu/poussé/mis en ligne par l’utilisateur à son retour.
