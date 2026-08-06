# PROTO-0.2 — Références existantes à consulter sans les réappliquer aveuglément

PROTO-0.2 part d’un prototype déjà documenté. Ces fichiers contiennent l’état antérieur du moteur, du scope et des playtests. Ils sont utiles pour comprendre l’existant, mais les décisions PROTO-0.2 plus récentes priment en cas de contradiction.

Références principales dans `docs/proto0/` :

- `PROTO0_SPECIFICATION.md`
- `PROTO0_DATA_REFERENCE.json`
- `PROTO0_IMPLEMENTATION_BACKLOG.md`
- `PROTO0_PLAYABLE_SCOPE.md`
- `PROTO0_PLAYABLE_UX_TEMPORALITY_2026-08-06.md`
- `PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md`
- `PROTO0_PLAYABLE_BALANCE_REPORT.md`
- `PROTO0_PLAYTEST_READY.md`
- `PROTO0_SIMULATION_REPORT.md`
- `PROTO0_P9_ENGINE_REPORT.md`

Codex doit les utiliser notamment pour :
- ne pas réinventer les recettes, données ou identifiants déjà définis ;
- comprendre la temporalité existante ;
- préserver les comportements validés hors changements explicitement demandés ;
- retrouver les scénarios de référence et les contrôles historiques.

Ne pas recopier automatiquement leurs anciennes hypothèses lorsqu’elles ont été corrigées par :
- `01_RULES_AND_SCOPE.md` ;
- `02_UX_SPEC.md` ;
- `docs/conception/04_tf_ergonomie_et_modele_mental_2026-08-06.md` ;
- `CURRENT_TASK.md`.

Exemples de décisions anciennes explicitement remplacées : réserve énergétique courte, présentation d’une vague annoncée par compte à rebours, formulaire de connexion source + destination + ressource.
