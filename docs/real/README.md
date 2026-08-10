# Tableau réel

Le **Tableau réel** documente ce que le projet Avelune mobilise dans le monde réel et quelques signes de vie publics du monde de jeu.

Documents :

- [`SPECIFICATION.md`](SPECIFICATION.md) — cahier des charges et lois ;
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — hébergement serveur, mesure du lab, quote-part serveur partagé et interconnexions ;
- [`DATA_AND_SECRETS.md`](DATA_AND_SECRETS.md) — frontière public/privé, provenance et politique de secrets.

Implémentation préparatoire :

- `app/src/lib/real-dashboard/` — types, valeurs publiques initiales et agrégats purs ;
- `app/src/routes/reel/+page.svelte` — première interface légère ;
- `app/tests/proto0/real-dashboard.test.ts` — garde-fous de calcul intégrés à la suite de tests existante.

## État v0.1

- [x] principes et lois figés ;
- [x] hébergement cible décidé : serveur principal partagé ;
- [x] prise affectée à la consommation du lab ;
- [x] quote-part serveur modélisée comme estimation distincte ;
- [x] politique de secrets documentée ;
- [x] première interface préparée ;
- [x] 270 EUR de matériel préchargés comme estimation déclarée ;
- [ ] date zéro officielle à fixer ;
- [ ] modèle exact de la prise à identifier à réception ;
- [ ] API/protocole officiel de la prise à vérifier ;
- [ ] tarif électrique à enregistrer avec période de validité ;
- [ ] méthode et pourcentage de quote-part serveur à décider ;
- [ ] temps humain initial à consolider ;
- [ ] persistance PostgreSQL à activer ;
- [ ] collecte électrique à connecter ;
- [ ] métriques joueurs/Corcites à connecter ;
- [ ] financement PayPal à connecter seulement lorsqu'il existe un besoin réel.

Aucun secret d'exploitation ni recette classée du Cœur d'Avelune ne doit entrer dans ce dossier.
