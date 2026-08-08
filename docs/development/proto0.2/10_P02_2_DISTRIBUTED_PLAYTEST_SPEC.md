# PROTO-0.2.2 — Pack de playtest distribué

**Statut : READY_FOR_IMPLEMENTATION**  
**Branche : `develop/proto-0.2.2-playtest`**  
**Base : `27a703294498ec9b9cacd1175841f18405a36fa8`**

## 0. Finalité du lot

PROTO-0.2.2 n'est pas une nouvelle phase de conception du jeu et ne doit pas devenir une mini-production.

Son but est de transformer le prototype actuel en **version distribuable pendant quelques semaines à 10–15 testeurs**, afin de recueillir :

- parties réellement jouées ;
- métriques de rythme ;
- erreurs et blocages ;
- idées, désaccords et propositions ;
- problèmes d'interface desktop/mobile ;
- données utiles pour préparer le cahier des charges de la prochaine grande étape.

Le lot doit conserver la mécanique PROTO-0.2 actuelle sauf corrections explicites de ce document.

La sortie attendue est un **PROTO-0.2 Playtest** autonome, sauvegardé côté serveur, anonyme, simple à reprendre et instrumenté.

---

# 1. Principes de périmètre

## 1.1 À faire

1. Corriger les défauts de playtest déjà observés :
   - hexagones qui se chevauchent sur mobile ;
   - actions de Production impossibles visuellement trop proches des actions possibles ;
   - explication insuffisante de ce qui manque pour fabriquer ;
   - rapport de fin de cycle incomplet.
2. Permettre 10–15 testeurs simultanés indépendants.
3. Remplacer le profil testeur prédéfini par une session anonyme rappelable avec un code numérique à 4 chiffres.
4. Sauvegarder l'état de partie côté serveur dans PostgreSQL.
5. Journaliser les événements importants de playtest côté serveur.
6. Mesurer les cycles sans action utile disponible sans inventer de mécanique de remplissage.
7. Ajouter un formulaire intégré de retour : bug, idée, remarque, désaccord, optimisation, proposition, autre.
8. Stocker tout retour en base avant toute notification externe.
9. Envoyer une notification SMTP facultative après stockage réussi.
10. Fournir une introduction, une notice et un rappel permanent des règles/objectifs du prototype.
11. Identifier précisément la version/commit du prototype associée à chaque session et événement.
12. Tests, build et simulation verts.

## 1.2 À ne PAS faire dans ce lot

- pas de comptes utilisateur ;
- pas d'email, nom, téléphone ou donnée personnelle du testeur requis ;
- pas d'authentification de production ;
- pas de multijoueur coopératif ;
- pas de monde partagé ;
- pas de nouveau système RPG ;
- pas de nouvelle famille de défense ;
- pas de nouvelles ressources ;
- pas de refonte de la vague ;
- pas de réseau Factorio/ports/câbles ;
- pas de classement ;
- pas de score social ;
- pas de mécanique créée uniquement pour occuper un cycle vide ;
- pas d'analytics externe ;
- pas de service SaaS imposé ;
- pas de création automatique d'issues GitHub dans ce lot.

---

# 2. Sessions anonymes de playtest

## 2.1 Écran d'entrée

À l'ouverture du prototype, avant le Corcite, afficher un écran simple :

### Nouvelle partie
Bouton : `Créer une partie`

Le serveur crée une session et retourne un **code à 4 chiffres** entre `0000` et `9999`.

Afficher très clairement :

> Votre code de partie : **4827**  
> Notez-le pour reprendre cette partie plus tard ou depuis un autre appareil.

Prévoir un bouton `Copier le code`.

### Reprendre une partie
Champ numérique 4 chiffres + bouton `Reprendre`.

Messages explicites :

- code inconnu ;
- partie archivée ;
- erreur temporaire serveur ;
- partie restaurée.

## 2.2 Niveau de sécurité assumé

Le code à 4 chiffres n'est **pas une authentification de production**.

Il est accepté uniquement parce que :

- le prototype est un playtest fermé ;
- aucune donnée personnelle n'est demandée ;
- les sessions ne contiennent aucune information sensible ;
- la durée de vie de ce mécanisme est limitée au playtest.

Ajouter néanmoins :

- limitation raisonnable des tentatives de reprise par IP ou fenêtre temporelle ;
- aucune indication permettant d'énumérer massivement les codes actifs ;
- codes actifs uniques ;
- pas de réutilisation d'un code tant qu'une session correspondante est active ;
- réponses API génériques en cas d'abus.

Ne pas construire un système de sécurité complexe.

## 2.3 Concurrence

Une session correspond à **une partie solo indépendante**.

Si la même session est ouverte simultanément dans deux navigateurs, le prototype peut appliquer pour ce jalon une règle simple de type `last write wins`, mais doit :

- versionner les sauvegardes ;
- refuser silencieusement aucune sauvegarde ;
- journaliser un conflit de version si détecté.

Aucune synchronisation temps réel n'est nécessaire.

---

# 3. Persistance PostgreSQL

## 3.1 Architecture

Créer une petite couche serveur dédiée, par exemple :

- `src/lib/server/playtest/db.ts`
- `src/lib/server/playtest/session-repository.ts`
- `src/lib/server/playtest/telemetry-repository.ts`
- `src/lib/server/playtest/feedback-repository.ts`

Le moteur de jeu `proto02/game.ts` reste indépendant de PostgreSQL.

Le navigateur ne reçoit jamais `DATABASE_URL` ni aucun secret.

Ajouter le client PostgreSQL minimal nécessaire au projet (`pg` ou équivalent direct, pas d'ORM lourd).

## 3.2 Schéma minimal

### `playtest_sessions`

Champs recommandés :

- `id` UUID interne ;
- `code` char(4) unique actif ;
- `created_at` ;
- `updated_at` ;
- `last_seen_at` ;
- `status` (`active`, `finished`, `archived`) ;
- `game_version` ;
- `state_version` entier ;
- `game_state` JSONB ;
- `result` nullable ;
- `finished_at` nullable.

### `playtest_events`

- `id` bigserial/UUID ;
- `session_id` ;
- `created_at` ;
- `turn` ;
- `event_type` ;
- `payload` JSONB ;
- `game_version`.

### `playtest_feedback`

- `id` UUID ;
- `session_id` nullable mais normalement présent ;
- `created_at` ;
- `category` ;
- `message` texte ;
- `turn` ;
- `view` ;
- `game_version` ;
- `context` JSONB ;
- `mail_status` (`not_requested`, `pending`, `sent`, `failed`) ;
- `mail_error` nullable.

Prévoir une migration SQL explicite, versionnée dans le dépôt.

Ne pas supprimer/modifier les tables historiques sans nécessité.

---

# 4. API de session

API SvelteKit minimale, noms ajustables si cohérents :

- `POST /api/playtest/session` → crée une partie et retourne code + état ;
- `POST /api/playtest/session/resume` → reprend via code ;
- `PUT /api/playtest/session/:code` → sauvegarde état/version ;
- `POST /api/playtest/event` → événements explicites si nécessaire ;
- `POST /api/playtest/feedback` → stocke un retour puis tente notification SMTP.

Les endpoints doivent :

- valider strictement les entrées ;
- limiter la taille des payloads ;
- ne jamais exposer de stack trace ou secret au client ;
- renvoyer des erreurs utilisateur simples ;
- être testables avec repository fake/in-memory sans PostgreSQL réel.

L'état complet ne doit pas être envoyé au serveur à chaque hover/clic purement visuel.

Sauvegarde recommandée :

- après action mécanique validée ;
- après pose/démontage ;
- après lancement/annulation d'ordre ;
- après recherche ;
- après fin de cycle ;
- après résolution d'onde ;
- à la fin du run.

Débouncer les sauvegardes rapprochées si nécessaire.

---

# 5. Télémétrie de playtest

## 5.1 Principe

La télémétrie sert au game design, pas au profilage du joueur.

Ne collecter aucune donnée personnelle.

Les événements doivent être structurés et suffisamment stables pour comparaison entre sessions.

## 5.2 Événements prioritaires

Minimum :

- `session_created`
- `session_resumed`
- `deployment_completed`
- `building_placed`
- `building_dismantled`
- `building_toggled`
- `staffing_changed`
- `production_queued`
- `production_rejected`
- `production_completed`
- `production_blocked`
- `research_started`
- `research_rejected`
- `research_completed`
- `tower_placed`
- `tower_removed`
- `cycle_ended`
- `wave_resolved`
- `run_finished`
- `feedback_sent`
- `save_conflict`

Ne pas journaliser les simples changements de vue, hover ou sélection de case sauf besoin explicite.

## 5.3 Cycles vides / rythme

Le problème observé `2 cycles sur 4 sans autre chose à faire que passer` doit être **mesuré avant modification du game design**.

À chaque fin de cycle, calculer au minimum :

- `player_action_count_since_last_cycle` ;
- `meaningful_action_available` booléen ;
- `idle_classification` :
  - `not_idle` ;
  - `voluntary_wait` : action utile disponible mais joueur passe ;
  - `forced_wait` : aucune action utile disponible ;
- causes principales si `forced_wait` :
  - `insufficient_resources` ;
  - `production_busy` ;
  - `research_busy` ;
  - `deployment_or_capacity_constraint` ;
  - `no_useful_unlocked_action` ;
  - autre cause structurée pertinente.

Ne pas prétendre détecter parfaitement l'intention humaine. Cette classification est une métrique de laboratoire.

### Décision de ce lot

**Ne pas ajouter de nouvelle action de remplissage.**

Des actions supplémentaires ne seront envisagées qu'après plusieurs parties réelles si le taux de `forced_wait` est significatif.

---

# 6. Formulaire intégré « Remarque / bug / idée »

## 6.1 Accès

Bouton persistent mais non intrusif :

`Signaler / proposer`

Accessible depuis toutes les vues, desktop et mobile.

Ouvre une modale/bottom-sheet simple.

## 6.2 Catégories

Choix unique :

- Bug / comportement anormal
- Interface / lisibilité
- Idée
- Désaccord avec une règle
- Équilibrage / rythme
- Optimisation / simplification
- Proposition
- Autre

## 6.3 Contenu

Champ texte libre obligatoire.

Texte d'aide :

> N'hésitez pas à signaler tout ce qui vous surprend : bug, incompréhension, idée, désaccord, règle inutile, amélioration, raccourci possible ou proposition. Il n'est pas nécessaire d'avoir « raison » : le but du test est précisément de recueillir ces réactions.

Ne pas demander d'identité.

## 6.4 Contexte ajouté automatiquement

Au retour stocké, joindre :

- session interne ;
- code de partie pour corrélation administrative ;
- version/commit ;
- cycle ;
- vague ;
- vue active ;
- résultat si run terminé ;
- résumé non sensible de l'état (ressources/capacités/recherche/défenses) ;
- taille viewport ;
- user-agent uniquement si utile au diagnostic responsive.

Ne pas inclure de données personnelles saisies ailleurs.

## 6.5 Robustesse

Ordre obligatoire :

1. validation ;
2. écriture `playtest_feedback` en PostgreSQL ;
3. réponse de succès possible dès que la base a accepté ;
4. tentative SMTP ;
5. mise à jour `mail_status`.

Si SMTP échoue :

- le joueur voit `Retour enregistré` ;
- la base conserve le retour ;
- l'erreur SMTP est journalisée côté serveur ;
- ne jamais demander au joueur de ressaisir son message.

---

# 7. Notification SMTP

## 7.1 Choix de ce lot

Utiliser SMTP plutôt que création automatique d'issue GitHub.

Motifs :

- secrets SMTP simples à isoler côté serveur ;
- aucune permission d'écriture GitHub à exposer ;
- feedback conservé indépendamment de l'envoi ;
- faible volume attendu ;
- tri humain utile avant de transformer éventuellement certains retours en issues.

Ajouter une dépendance minimale type `nodemailer`.

## 7.2 Variables d'environnement

Ne jamais committer les valeurs réelles.

Documenter :

- `AVELUNE_SMTP_HOST`
- `AVELUNE_SMTP_PORT`
- `AVELUNE_SMTP_SECURE`
- `AVELUNE_SMTP_USER`
- `AVELUNE_SMTP_PASSWORD`
- `AVELUNE_FEEDBACK_FROM`
- `AVELUNE_FEEDBACK_TO`

SMTP doit être **facultatif** : si les variables ne sont pas configurées, le prototype fonctionne et stocke tout en base avec `mail_status = not_requested` ou équivalent.

## 7.3 Sujet conseillé

`[Avelune P02] BUG — session 4827 — cycle 7`

Corps lisible humainement avec : catégorie, message, version, cycle, vue et contexte compact.

Pas de dump JSON massif dans le corps principal ; éventuellement contexte technique compact en fin de mail.

---

# 8. Introduction, notice et rappel de règles

## 8.1 Écran d'introduction

Avant création/reprise de session, présenter un texte court.

### Texte cible

**Bienvenue dans Les Lisières d'Avelune — prototype de playtest**

Vous allez éveiller et développer un Corcite, une structure vivante à la frontière de la Fracture.

Cette version n'est pas le jeu final. Elle sert à tester une boucle volontairement réduite : organiser le Corcite, extraire et transformer des matières, faire évoluer certaines fonctions, préparer des défenses puis affronter des ondes de plus en plus puissantes.

Votre objectif dans ce prototype est de développer le Corcite assez efficacement pour qu'une ligne de défenses ramène un jour la Puissance d'une onde à zéro avant que l'Intégrité du Corcite ne tombe elle-même à zéro.

Certaines fonctions du futur jeu sont absentes ou simplifiées. Une mécanique étrange, un tour vide ou une règle qui vous paraît mauvaise est donc une information utile, pas quelque chose à ignorer.

**Pendant toute la partie, utilisez « Signaler / proposer » pour nous envoyer bugs, incompréhensions, idées, désaccords, optimisations ou propositions.**

Bouton : `J'ai compris — jouer`

## 8.2 Notice accessible pendant la partie

Ajouter un bouton `? Règles du prototype` ou `Notice` ouvrant un panneau.

Contenu minimal :

### But
- renforcer le Corcite ;
- produire et rechercher ;
- fabriquer et positionner des Tours d'Affaiblissement ;
- ramener la Puissance d'une onde à `0` avant que l'Intégrité ne tombe à `0`.

### Cycle
- vous préparez vos décisions ;
- `Terminer le cycle` résout productions, extraction, recherche et événements du cycle ;
- certaines actions prennent plusieurs cycles ;
- attendre peut parfois être nécessaire dans cette version de test.

### Structure
- une fonction = une case ;
- seuls les extracteurs dépendent du gisement ;
- les autres bâtiments peuvent être implantés sur toute case libre.

### Ressources / production
- les matières disponibles financent recherches et fabrications ;
- les matières engagées ne peuvent pas être dépensées deux fois ;
- une sortie peut rester bloquée si le stockage est plein.

### Évolution
- Transformation ouvre une partie de la production ;
- les améliorations répétables sont volontairement limitées dans ce prototype.

### Défenses
- les Tours d'Affaiblissement agissent dans l'ordre du chemin ;
- chaque tour réduit la Puissance ;
- la Puissance restante frappe l'Intégrité.

### Important
- ce prototype est incomplet ;
- aucun choix n'est supposé être « évident » ;
- signaler également les règles avec lesquelles vous n'êtes pas d'accord ;
- utiliser `Signaler / proposer` aussi souvent que nécessaire.

---

# 9. Corrections UX obligatoires avant diffusion

## 9.1 Mobile — géométrie hexagonale

Défaut observé : les hexagones se chevauchent sur mobile.

Critère absolu :

- même tessellation mathématique desktop/mobile ;
- deux voisines partagent une arête complète ;
- aucune superposition ;
- aucune gouttière ;
- aucun triangle noir ;
- aucune translation causée par sélection/placement ;
- test manuel au minimum `390×844` et `360×800`.

Ne pas corriger avec des marges arbitraires indépendantes de la géométrie.

## 9.2 Production — disponibilité explicite

Pour chaque recette/action :

- action possible → apparence normale ;
- action impossible → carte/bouton visuellement grisé et non activable ;
- afficher la ou les raisons précises, par exemple :
  - `manque 2 Minéral` ;
  - `manque 1 Transformé` ;
  - `Transformation non recherchée` ;
  - `Atelier déjà occupé` ;
  - `stockage insuffisant` ;
  - autre blocage réel.

Ne pas se contenter de `Ressources insuffisantes` si les quantités exactes sont calculables.

La logique de disponibilité doit être partagée entre UI et moteur autant que raisonnablement possible pour éviter les divergences.

## 9.3 Rapport de fin de cycle

Défaut observé : toutes les conséquences du cycle ne sont pas notifiées.

Le rapport doit synthétiser au minimum tout événement mécanique ayant effectivement changé pendant la résolution :

- ressources produites/consommées ;
- objets fabriqués ;
- ordre démarré ;
- ordre terminé ;
- sortie bloquée ;
- recherche progressée/terminée ;
- changement notable de stockage/capacité si pertinent ;
- onde déclenchée ;
- dégâts ;
- victoire/défaite ;
- avertissement important.

Ne pas reconstruire le rapport uniquement à partir de quelques deltas UI si cela masque des événements.

Préférer que le moteur retourne ou accumule un **résultat structuré de résolution de cycle**, réutilisable par :

- rapport joueur ;
- télémétrie ;
- tests.

Les logs techniques restent distincts.

---

# 10. Version du prototype

Définir une constante/version lisible correspondant au build de playtest.

Chaque session, feedback et événement stocke :

- version fonctionnelle (`PROTO-0.2.2-playtest` ou équivalent) ;
- commit Git si disponible au build via variable d'environnement/ARG.

Afficher discrètement la version dans la notice ou le footer afin qu'une capture permette de l'identifier.

---

# 11. Tests attendus

Minimum :

## Moteur / UI
- tests existants toujours verts ;
- disponibilité détaillée des recettes ;
- rapport de cycle exhaustif sur scénarios représentatifs ;
- classification forced/voluntary wait ;
- sérialisation/restauration inchangée ou migration explicitement testée.

## Sessions
- création code unique ;
- reprise ;
- mauvais code ;
- sauvegarde/version ;
- conflit simple ;
- validation payload.

## Feedback
- stockage réussi ;
- SMTP réussi mocké ;
- SMTP échoué mais feedback conservé ;
- catégorie/message invalides refusés ;
- taille maximale respectée.

## Qualité
- `npm run check`
- `npm run test:proto0`
- `npm run simulate:proto02`
- `npm run build`
- `git diff --check`

Smoke HTTP réel après déploiement.

---

# 12. Déploiement et configuration

Le déploiement final doit connecter l'application aux réseaux nécessaires et lui fournir `DATABASE_URL` côté serveur.

Ne pas recopier un mot de passe dans une commande affichée ou un commit.

Le SMTP reste facultatif au premier démarrage : si les identifiants ne sont pas encore fournis, déployer avec stockage feedback fonctionnel puis configurer SMTP ensuite.

Avant bascule publique :

- sauvegarder/identifier l'image actuellement fonctionnelle ;
- ne jamais supprimer le conteneur public tant que le candidat n'est pas validé ;
- utiliser un port de smoke libre ou un réseau interne sans publication ;
- rollback seulement si un backup réel existe ;
- conserver PostgreSQL.

---

# 13. Plan de travail Codex pour ce soir

Le lot est volontairement découpé. Chaque run doit finir proprement, tester et committer avant le suivant.

## RUN A — 45–60 min cible humain / Codex probablement plus rapide

**Fiabilisation UX immédiatement visible**

- mobile hexagones ;
- Production grisée + manque précis ;
- résultat structuré de fin de cycle + rapport complet ;
- instrumentation locale `forced_wait / voluntary_wait` prête pour télémétrie ;
- tests.

Gate A : le proto reste entièrement jouable sans serveur de session.

## RUN B — 60–90 min cible

**Sessions + PostgreSQL**

- schéma/migration ;
- repository serveur ;
- endpoints création/reprise/sauvegarde ;
- écran entrée code 4 chiffres ;
- suppression de la dépendance UX aux cinq profils prédéfinis pour le parcours public ;
- fallback d'erreur serveur propre ;
- tests repository/API.

Gate B : deux navigateurs avec deux codes jouent deux parties indépendantes et reprennent leur état.

## RUN C — 45–75 min cible

**Télémétrie + feedback**

- événements structurés ;
- métriques de cycle ;
- formulaire `Signaler / proposer` ;
- stockage DB ;
- SMTP facultatif ;
- tests succès/échec mail.

Gate C : un retour reste en base même lorsque SMTP est désactivé ou échoue.

## RUN D — 30–60 min cible

**Notice + intégration + durcissement de playtest**

- intro ;
- notice permanente ;
- rappel feedback ;
- version build ;
- responsive final ;
- tests complets ;
- build ;
- simulation ;
- smoke ;
- documentation ;
- commit(s) propres ;
- préparation déploiement.

Gate D : version distribuable pendant plusieurs semaines.

---

# 14. Critères de sortie PROTO-0.2 Playtest

Le lot est terminé quand :

1. un nouveau testeur peut créer une partie sans instruction externe ;
2. il obtient un code 4 chiffres ;
3. il peut reprendre la partie depuis un autre navigateur/appareil ;
4. 10–15 sessions indépendantes sont techniquement supportables ;
5. les sauvegardes sont serveur ;
6. la télémétrie essentielle est persistée ;
7. les cycles vides sont mesurables ;
8. un retour libre peut être envoyé à tout moment ;
9. le retour est conservé même si SMTP échoue ;
10. intro et notice expliquent correctement le prototype ;
11. Production explique précisément ses blocages ;
12. le rapport de cycle reflète les actions réellement résolues ;
13. les hexagones ne se chevauchent plus sur mobile ;
14. tests/check/build/simulation sont verts ;
15. smoke serveur est vert ;
16. aucune nouvelle mécanique majeure n'a été inventée pour remplir le prototype ;
17. aucune donnée personnelle n'est requise.

Après cette gate, **geler les modifications de conception importantes du PROTO-0.2**, le laisser vivre en playtest quelques semaines et passer le travail principal à la définition/verrouillage du jalon suivant.
