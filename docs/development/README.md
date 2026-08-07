# Développement et architecture

Ce dossier regroupe la documentation technique, la méthode de développement et les cahiers de travail des prototypes.

## Baseline stable

`main` contient actuellement la baseline jouable **PROTO-0.1**.

Documents structurants :

- [Audit du développement et de l'architecture](AUDIT_DEVELOPPEMENT_ARCHITECTURE_2026-08-06.md)
- [Architecture actuelle et cible](ARCHITECTURE_CURRENT_AND_TARGET.md)
- [Politique données/configuration](DATA_CONFIGURATION_POLICY.md)
- [Méthode de développement jeu vidéo](GAME_DEVELOPMENT_METHOD.md)
- [Dette technique et prochaines étapes](TECHNICAL_DEBT_AND_NEXT_STEPS.md)
- [Tests, sécurité et persistance](TEST_SECURITY_PERSISTENCE_STRATEGY.md)
- [ADR-0001 — cœur métier indépendant de l'UI](adr/ADR-0001-FUNCTIONAL-CORE.md)
- [ADR-0002 — contenu data-driven](adr/ADR-0002-DATA-DRIVEN-CONTENT.md)

## Développement actif — PROTO-0.2

Le jalon courant est développé sur :

[`develop/proto-0.2-ux-rules`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2-ux-rules)

Son cahier complet est disponible dans :

[`docs/development/proto0.2`](https://github.com/Avelune-Officiel/les-lisieres-avelune/tree/develop/proto-0.2-ux-rules/docs/development/proto0.2)

Sources de travail principales :

- [Mission active](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/CURRENT_TASK.md)
- [Règles et périmètre](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/01_RULES_AND_SCOPE.md)
- [Spécification UX](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/02_UX_SPEC.md)
- [Garde-fous techniques](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/03_TECHNICAL_GUARDRAILS.md)
- [Critères d'acceptation](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/04_ACCEPTANCE.md)
- [Brief visuel Gen3 corrigé](https://github.com/Avelune-Officiel/les-lisieres-avelune/blob/develop/proto-0.2-ux-rules/docs/development/proto0.2/06_VISUAL_BRIEF_GEN3.md)

PROTO-0.2 teste un plateau hexagonal concret, une économie simplifiée, un inventaire/stockage physique, une recherche courte, une défense unique `Affaiblissement`, des vagues à `Puissance` croissante, une vraie condition de victoire/défaite et une UX/DA de prototype nettement plus incarnée.

## Règle de lecture

Les documents historiques P0–P10 restent conservés pour traçabilité, mais ne doivent pas être utilisés comme description de l’état jouable ou du périmètre actif lorsqu’ils sont contredits par :

1. le cahier du jalon en cours ;
2. les ADR et règles d’architecture plus récents ;
3. l’état réel du code de la branche concernée.

Le principe directeur reste : **architecture suffisamment propre et réutilisable pour éviter les refontes inutiles, sans construire prématurément les systèmes futurs.**
