# Tableau Réel d’Avelune

Le **Tableau Réel (TA3)** est l’instrument persistant qui décrit ce qu’il faut réellement pour construire Avelune : temps, matériel, énergie, coûts, financement, carbone connu et quelques signes de vie du projet et des prototypes.

Il est distinct :

- du monde fictif d’Avelune ;
- du PROTO jouable courant ;
- du laboratoire du Cœur vivant ;
- du Tableau Monde ;
- du Tableau Univers.

## État au 19 août 2026

Les **Gate 0 et Gate B sont validés**.

TA3 doit rester disponible même lorsqu’un PROTO est arrêté, remplacé ou supprimé. Il dispose donc de son **propre stockage persistant et de son propre runtime**, et les autres briques ne sont que des sources remplaçables.

L’audit du socle permanent hors PROTO a conduit à retenir la solution autonome minimale suivante pour la v1 :

- un service applicatif TA3 unique ;
- SvelteKit/Node comme socle web initial ;
- SQLite comme registre persistant propre ;
- aucune base PostgreSQL supplémentaire ;
- aucune base partagée avec le PROTO ou un autre service ;
- publication via le reverse proxy existant sans port hôte dédié requis en production.

Une première source physique réelle est active pour l’énergie d’AvLab : une prise de mesure locale collecte la puissance et l’énergie au mur. La chaîne est **lecture seule**, légère et indépendante du runtime TA3. L’historique local sert de staging ; l’ingestion canonique TA3 passera par un adaptateur périodique et idempotent.

La baseline financière initiale établie au 19 août est :

- machine AVLAB : 230 EUR ;
- RAM AVLAB : 76 EUR ;
- prise énergie AVLAB : 13 EUR ;
- total matériel connu : **319 EUR calculés**.

Le paiement ChatGPT Plus du 24 juillet 2026 reste hors périmètre car antérieur à J0, fixé au 26 juillet 2026.

## Documents

- [Cahier des charges complet](CAHIER_DES_CHARGES.md)
- [Spécification fonctionnelle et architecture](SPECIFICATION.md)
- [Plan d’exécution](EXECUTION_PLAN.md)
- [Source énergie AvLab — télémétrie locale](AVLAB_POWER_TELEMETRY.md)

## Principes

- toute donnée est qualifiée `MESURÉE`, `CALCULÉE`, `ESTIMÉE` ou `SYMBOLIQUE` ;
- une inconnue reste inconnue, jamais remplacée par un faux zéro ;
- les événements et leur provenance précèdent les agrégats ;
- une correction historique reste traçable ;
- une source externe indisponible ne rend pas le Tableau Réel indisponible ;
- les métriques de PROTO sont importées avec provenance et ne deviennent pas une dépendance permanente ;
- la télémétrie électrique physique est ingérée par adaptateur et le rendu ne lit jamais directement l’instrument ;
- la mesure et le pilotage restent deux capacités distinctes ; aucun pilotage électrique n’est installé dans le jalon actuel ;
- le carbone reste séparé des euros ;
- l’instrumentation reste sobre ;
- aucune donnée interne ou d’exploitation n’est exposée par la partie publique ;
- une sauvegarde hors hôte dédiée est exigée avant clôture du jalon public.

## Étape active

La prochaine étape est **Gate C : domaine et stockage** : workspace propre, SQLite TA3, migrations, événements, provenance, corrections, idempotence, baseline initiale et restauration locale testée.

## Frontière avec les anciennes expérimentations

Le brouillon historique de PR `Tableau réel — socle, architecture et interface v0.1` avait commencé à intégrer `/reel` directement à l’application existante. Le Gate 0 a ensuite établi que cette dépendance au runtime du PROTO n’est pas l’architecture cible. Ce brouillon ne doit donc pas être fusionné tel quel.
