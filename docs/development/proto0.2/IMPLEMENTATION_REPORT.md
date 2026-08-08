# PROTO-0.2.2 — Rapport d’implémentation P02-003

**Statut : implémentation des Gates A–D terminée dans le worktree ; validation
Node/Docker à exécuter hors sandbox avant REVIEW_READY.**

## Git et périmètre

- branche inspectée : `develop/proto-0.2.2-playtest` ;
- HEAD initial : `2faf0642cfed1e8e3001cc1e21827234582708d6` ;
- aucun commit, push, merge, tag ni déploiement effectué ;
- aucune nouvelle ressource, famille défensive, règle RPG ou action destinée à
  remplir un cycle vide.

## Run correctif après validation Node 24

- garde-fous HTTP ajoutés avant accès repository : les cycles d’événement sont
  des entiers `>= 0` et les versions de sauvegarde des entiers `>= 1` ; les
  contrats partagés couvrent explicitement `turn=-1`, `turn=0`,
  `stateVersion=0`, les versions négatives/décimales/non numériques et
  `stateVersion=1`, sans modifier le last-write-wins des versions positives ;
- une validation réelle sous PostgreSQL 17 a découvert que le conflict target
  `ON CONFLICT (code)` ne permettait pas d’inférer l’index unique partiel des
  sessions accessibles ; `create()` émet désormais `ON CONFLICT (code) WHERE
  status <> 'archived' DO NOTHING`, sans modifier l’index ni la réutilisation
  des codes archivés ; un nouveau passage sur PostgreSQL 17 réel reste requis
  après ce correctif ;
- modèle de feedback séparé entre statut initial et statut stocké, sans
  élargissement de propriété hérité ni recours à `any` ;
- plafonds de recherche traités comme états terminaux : aucun déficit de
  ressource temporaire n’est affiché lorsqu’un achat est définitivement
  impossible ; tests rendus explicites sur la liste exacte des raisons ;
- CSS mort de l’ancien sélecteur public de testeurs supprimé ;
- dépendances runtime déclarées et imports serveur directs de `pg` et
  `nodemailer`, sans `new Function(...)` ;
- revue ciblée des frontières serveur/API : aucun import serveur depuis le
  client et aucun secret exposé ; contexte feedback désormais borné à 16 000
  caractères sérialisés.

## Gate A — UX et économie

- recettes alignées sur l’arbitrage 11, dont Tour primaire `1 Organique + 3
  Minéral`, sans Transformé, Composant ni recherche Transformation ;
- durées de 1/2 cycles et plancher de Fabrication améliorée centralisés ;
- disponibilité de Production calculée par le moteur avec toutes les causes
  exactes, coût, stock, posé, durée et cycle estimé ;
- résultat de cycle structuré : productions/consommations, démarrage,
  progression, fin, blocage, recherche, onde et fin de run ;
- `not_idle`, `voluntary_wait`, `forced_wait`, nombre d’actions et causes ;
- vue Stock globale catégorisée, inventaire permanent retiré, accès navigation
  et clic sur Membrane, implantation limitée aux objets réellement disponibles ;
- pictogrammes stables des quatre ressources réutilisés ;
- tessellation mobile issue de la même formule axiale que desktop : largeur 76,
  hauteur 65,818, pas horizontal 57 et demi-pas vertical 32,909 ;
- simulation d’ouverture primaire ajoutée, sans nouvelle mécanique.

## Gate B — sessions

- migration additive `app/migrations/001_playtest_distributed.sql` ;
- tables sessions, événements et feedback ; identifiant UUID interne et code
  public numérique unique parmi les sessions accessibles ;
- collision gérée par nouvelle tentative, sans quota de sessions ;
- repositories PostgreSQL et mémoire, service création/reprise/sauvegarde ;
- version d’état incrémentée, last-write-wins explicite et conflit journalisé ;
- endpoints création, reprise et sauvegarde avec validation/taille bornée ;
- écran public à code 4 chiffres ; profils IRFI/AUBE/BRUM/ORBE/SILE absents du
  parcours public.

## Gate C — télémétrie et feedback

- événements serveur structurés et métriques de cycle vide ;
- bouton permanent `Signaler / proposer`, huit catégories et contexte mécanique,
  version, cycle, vague, vue et viewport ; aucune identité requise ;
- écriture PostgreSQL effectuée avant SMTP ;
- SMTP facultatif, état `not_requested` sans configuration, échec marqué
  `failed` sans détruire le retour ni imposer de ressaisie ;
- secrets lus uniquement depuis les variables d’environnement.

## Gate D — intégration

- introduction avant création/reprise et demande explicite de retours critiques ;
- notice complète accessible pendant la partie ;
- bloc Session (code, copie, sauvegarde, version) distinct du Contexte de case ;
- version fonctionnelle et commit de build visibles ;
- composition commune desktop/mobile, cibles tactiles et priorités 390×844 /
  360×800.

## Tests ajoutés

- `p02-distributed-economy.test.ts` : coûts, Tour primaire, durées,
  disponibilités, rapport et idle ;
- `p02-playtest-sessions.test.ts` : create/resume/save, collision, conflit,
  validation et repositories fakes ;
- `p02-feedback.test.ts` : insertion avant SMTP, SMTP réussi, absent et échoué.

## Contrôles réellement exécutés dans ce sandbox

| Contrôle | Résultat |
|---|---|
| lecture exhaustive des sources imposées | PASS |
| branche/worktree initial | PASS — branche attendue, modifications du premier run préservées |
| `git diff --check` intermédiaire | PASS |
| `npm run check` | TENTÉ, ÉCHEC ENVIRONNEMENT — `npm: command not found` |
| `npm run test:proto0` | TENTÉ, ÉCHEC ENVIRONNEMENT — npm/Node absents |
| `npm run simulate:proto02` | TENTÉ, ÉCHEC ENVIRONNEMENT — npm/Node absents |
| `npm run build` | TENTÉ, ÉCHEC ENVIRONNEMENT — npm/Node absents |
| PostgreSQL réel / migration | NON EXÉCUTÉ — accès Docker refusé |
| smoke HTTP/Docker | NON EXÉCUTÉ — accès Docker refusé |
| revue navigateur 390×844 / 360×800 | NON EXÉCUTÉ — navigateur absent |

La tentative Docker retourne `permission denied while trying to connect to the
docker API`. Aucun succès n’est revendiqué pour ces contrôles.

## Déploiement

Appliquer `app/migrations/001_playtest_distributed.sql`, puis fournir :
`DATABASE_URL`, `AVELUNE_BUILD_COMMIT` et, facultativement,
`AVELUNE_SMTP_HOST`, `AVELUNE_SMTP_PORT`, `AVELUNE_SMTP_SECURE`,
`AVELUNE_SMTP_USER`, `AVELUNE_SMTP_PASSWORD`, `AVELUNE_FEEDBACK_FROM`,
`AVELUNE_FEEDBACK_TO`. `pg@8.22.0` et `nodemailer@9.0.3` sont désormais des
dépendances runtime déclarées ; le Dockerfile utilise uniquement
`npm ci --omit=dev` pour l’étage runtime.

Le sandbox ne fournit ni Node ni npm et refuse l’accès au daemon Docker. Le
`package-lock.json` n’a donc pas pu être régénéré après cette normalisation et
reste provisoirement incohérent avec `package.json`. Exécuter dans `app/`
`npm install --package-lock-only --ignore-scripts`, contrôler le diff du lock,
puis lancer les validations npm avant toute construction d’image.

## Risques et contrôles hors sandbox

1. régénérer `package-lock.json`, puis exécuter check/tests/simulation/build et
   corriger toute erreur TypeScript ou Svelte avant revue ;
2. appliquer la migration sur une copie/instance de validation puis tester une
   création, reprise depuis un second navigateur et conflit de sauvegarde ;
3. tester SMTP configuré, absent et volontairement cassé sur PostgreSQL réel ;
4. contrôler visuellement les 19 hexagones à 390×844 et 360×800, avant/après
   implantation, ainsi que modales, Stock et absence de scroll horizontal ;
5. effectuer un smoke HTTP sur une image candidate isolée avant bascule.

## Micro-passe UI finale P02.2

- HUD ramené à une ligne d’environ 40 px sur desktop large : branding dupliqué
  retiré, quatre ressources conservées en `icône + nom + quantité`, sauvegarde
  compactée et accès aux règles déplacé dans Session ;
- navigation gauche contrainte par `min-width: 0`, enfants flex rétractables et
  libellés remplacés visuellement par les icônes sous 420 px, avec noms
  accessibles ;
- commit de build lu côté serveur depuis la seule variable
  `AVELUNE_BUILD_COMMIT`, transmis explicitement à la page et affiché dans
  l’accueil/notice ; repli visible `build local` ;
- plateau stabilisé contre les variations de largeur dues à la scrollbar de la
  zone centrale, sans modification de la géométrie hexagonale ;
- `git diff --check` : PASS. `npm run check`, tests et build restent non
  exécutables dans ce sandbox (Node/npm absents et daemon Docker inaccessible).
