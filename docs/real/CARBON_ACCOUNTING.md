# Tableau réel — Comptabilité carbone

## Objet

Le Tableau réel suit aussi l'empreinte carbone attribuable à Avelune, en **kgCO2e**.

Le carbone est un registre parallèle aux euros : une dépense financière n'est jamais convertie automatiquement en CO2e à partir de son prix.

## Trois niveaux publics

1. **Carbone incorporé** : fabrication, distribution et éventuellement fin de vie du matériel attribué à Avelune.
2. **Carbone d'usage** : émissions liées au fonctionnement au fil du temps, notamment l'électricité du lab et la quote-part du serveur partagé.
3. **Empreinte carbone connue** : somme des postes quantifiés sur des périmètres compatibles.

Tant qu'un poste matériel ou numérique important reste non quantifié, l'interface dit **empreinte carbone connue** et signale que le périmètre est incomplet. Elle ne présente jamais cette valeur comme un total exhaustif.

## Électricité du lab

La prise connectée mesure l'énergie réellement consommée par le lab en kWh.

Le calcul carbone est ensuite :

```text
énergie mesurée (kWh) × facteur d'émission (gCO2e/kWh) / 1000
= kgCO2e
```

Le facteur d'émission doit être issu de la **Base Carbone / Base Empreinte ADEME**, avec son identifiant logique, sa valeur, sa version, sa date de validité et son périmètre conservés dans la provenance.

La Base Carbone publiée par l'ADEME est accessible par API publique. Le Tableau réel ne doit pas dépendre de cette API à chaque affichage : le facteur peut être rafraîchi ponctuellement, contrôlé, puis stocké/versionné côté serveur.

## RTE : signal complémentaire, pas facteur interchangeable

RTE publie une estimation continue des émissions de la production électrique française. Ce signal peut être ajouté ultérieurement pour montrer le contexte électrique au moment de la consommation.

Il ne doit pas remplacer silencieusement le facteur de comptabilité carbone ADEME : le périmètre RTE ne couvre notamment pas la construction des moyens de production, le cycle amont des combustibles ni les échanges aux interconnexions.

## Serveur partagé

Le serveur principal n'est pas dédié à Avelune.

Son carbone d'usage suit le même principe que son coût électrique : seule une quote-part Avelune raisonnable est comptabilisée, avec une méthode et un coefficient documentés.

Le serveur complet ne doit jamais être attribué à Avelune par défaut.

## Matériel

Le coût d'achat de 270 EUR du lab ne permet pas de connaître son empreinte carbone.

Le carbone incorporé du lab doit être calculé à partir de données physiques ou d'un facteur de matériel documenté : modèle exact, catégorie ADEME/ARCEP pertinente, déclaration environnementale fabricant ou autre source méthodologiquement défendable.

Si seul un facteur générique est disponible, le résultat est marqué **ESTIMÉ** et le facteur exact est conservé.

## IA et services numériques

Le paiement de ChatGPT Plus et son attribution financière à 99 % à Avelune ne permettent pas de déduire une empreinte carbone fiable.

Tant qu'une donnée d'activité exploitable et un facteur suffisamment robuste ne sont pas disponibles, le carbone de l'IA reste **NON QUANTIFIÉ**. Le Tableau réel préfère un trou déclaré à une conversion monétaire arbitraire.

La même règle s'applique aux autres services numériques.

## Historisation des facteurs

Un changement de facteur d'émission ne doit pas réécrire silencieusement l'histoire.

Chaque calcul doit pouvoir retrouver :

- la donnée d'activité ;
- le facteur utilisé ;
- sa source ;
- sa version ou période de validité ;
- le résultat calculé ;
- le statut MESURÉ / CALCULÉ / ESTIMÉ.

Lorsqu'un facteur de référence évolue, les nouvelles périodes utilisent le nouveau facteur. Une réévaluation historique éventuelle est une opération explicite et documentée.

## Lois carbone

1. **Le CO2e n'est pas déduit des euros.**
2. **Le carbone incorporé et le carbone d'usage restent distincts.**
3. **Un total incomplet s'appelle empreinte connue, jamais empreinte totale.**
4. **Tout facteur d'émission est sourcé et versionné.**
5. **La précision du résultat ne dépasse pas celle du facteur et de la donnée d'activité.**
6. **Les émissions du lab suivent les kWh réellement mesurés dès que la prise est opérationnelle.**
7. **La période pré-instrumentation reste estimée.**
8. **Le serveur partagé n'est imputé qu'au prorata Avelune.**
9. **L'IA reste non quantifiée tant qu'une méthode défendable manque.**
10. **Deux facteurs de périmètres différents ne sont pas additionnés comme s'ils mesuraient la même chose.**
11. **L'instrumentation carbone reste sobre : aucun appel temps réel n'est requis pour afficher la page.**

## Données v0.1

Au démarrage :

- carbone incorporé du lab : à établir ;
- carbone d'usage du lab : en attente de la prise ;
- facteur électricité ADEME : à récupérer et verrouiller avant le premier calcul automatique ;
- quote-part carbone du serveur : à établir avec la quote-part énergétique ;
- carbone IA : non quantifié ;
- empreinte carbone connue : inconnue tant qu'aucun poste carbone n'est quantifié.
