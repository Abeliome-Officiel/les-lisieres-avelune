# Tableau Réel d’Avelune

Le **Tableau Réel (TA3)** est l’instrument persistant qui décrit ce qu’il faut réellement pour construire Avelune : temps, matériel, énergie, coûts, financement, carbone connu et quelques signes de vie du projet et des prototypes.

Il est distinct :

- du monde fictif d’Avelune ;
- du PROTO jouable courant ;
- du laboratoire du Cœur vivant.

## État au 13 août 2026

Le **Gate 0 est validé**.

La décision structurante est que TA3 doit rester disponible même lorsqu’un PROTO est arrêté, remplacé ou supprimé. Il dispose donc de son **propre stockage persistant et de son propre runtime**, et les autres briques ne sont que des sources remplaçables.

La Phase B doit commencer par l’audit des capacités persistantes déjà disponibles hors PROTO, puis choisir la solution autonome minimale. Aucune migration TA3 ne doit être ajoutée dans la base éphémère du PROTO.

Une première source physique réelle est désormais active pour l’énergie d’AvLab : une prise de mesure locale collecte la puissance et l’énergie au mur. La chaîne actuelle est **lecture seule**, légère et indépendante du runtime TA3. L’historique local sert de staging ; l’ingestion canonique TA3 passera plus tard par un adaptateur.

## Documents

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
- aucune donnée interne ou d’exploitation n’est exposée par la partie publique.

## Frontière avec les anciennes expérimentations

Le brouillon historique de PR `Tableau réel — socle, architecture et interface v0.1` avait commencé à intégrer `/reel` directement à l’application existante. Le Gate 0 a ensuite établi que cette dépendance au runtime du PROTO n’est pas l’architecture cible. Ce brouillon ne doit donc pas être fusionné tel quel.
