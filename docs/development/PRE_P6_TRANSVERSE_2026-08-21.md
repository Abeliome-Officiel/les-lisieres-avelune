# PRE-P6 — Gate transverse P1 ↔ P5A ↔ P5B

**Date : 21 août 2026**  
**Statut : CLOSED / PASS**  
**Portée : partageable — aucune recette, seed, causalité privée ou donnée runtime Cœur**

## Verdict

Le gate transverse offline entre le Lecteur du Cœur, le Visuel et le Sonore est clos avec PASS.

```text
TRANSVERSE_P1_P5A_P5B_FORMAL_GATE=PASS
CONTRACT_READY_FOR_P6_1=YES
PRE_P6_TRANSVERSE=CLOSED
```

Ce verdict ferme une dette de preuve contractuelle. Il n’autorise pas à lui seul le raccord live au Cœur.

## Frontière qualifiée

```text
EnvelopeSource
      ↓
P1 ReadSession
      ↓
ReadSessionItem
├─ WorldReadEnvelope
└─ ContinuityDecision
      ↓
 ┌────┴────┐
 ↓         ↓
P5A       P5B
visuel   sonore
 └────┬────┘
      ↓
     P6
```

P1 est l’unique autorité de continuité. Les consommateurs aval peuvent vérifier la validité de leurs entrées, mais ne recalculent pas une seconde décision de continuité depuis `publication_seq`, `state_revision`, `canonical_age` ou des identifiants d’événements.

## Garanties fermées

- contrat commun P1/P5A/P5B : PASS ;
- P1 seule autorité de continuité : PASS ;
- second guard P5A : absent ;
- seconde autorité active P5B sur le chemin convergé : absente ;
- historique d’événements exploitable : décision portée par P1 ;
- projection visuelle convergée : consommation directe ;
- projection musicale convergée : consommation directe ;
- couche de traduction spécifique à P6 : non requise ;
- réparation contractuelle spécifique à P6 : non requise ;
- aucun accès au Cœur actif, à O1, au live ou au réseau n’a été requis pour cette qualification.

Des surfaces historiques peuvent rester présentes dans les implémentations pour compatibilité ou traçabilité ; leur présence ne leur rend pas autorité. P6 doit utiliser la frontière convergée qualifiée.

## canonical_age

La forme publique transportée est une **chaîne décimale exacte**. Les consommateurs qualifiés la conservent sans perte de précision.

Ce gate ne décide pas :

- l’unité canonique ;
- la primitive persistée côté P0 ;
- le facteur temps réel ↔ temps canonique ;
- la politique d’arrêt/rattrapage.

Ces sémantiques restent à fermer par P0-AUTH et les gates opérationnelles correspondantes.

## Matrice de continuité C01–C08

La matrice transverse qualifiée couvre :

- **C01** — premier snapshot ;
- **C02** — publication contiguë ;
- **C03** — saut de `state_revision` sans gap de publication ;
- **C04** — duplicate `publication_seq` rejeté par P1 ;
- **C05** — gap de publication ;
- **C06** — reprise contiguë sans invention d’un historique perdu ;
- **C07** — changement de stream → nouvelle session ;
- **C08** — changement de monde → nouvelle session.

Les trois modules convergés sont compatibles sur cette matrice.

## Conséquence pour P6

Le travail P6 doit désormais être distingué entre fondation offline et intégration live :

```text
P6_OFFLINE_FOUNDATION_CONTRACT_READY=YES
P6_OFFLINE_WORK=AUTHORIZED
P6_LIVE_INTEGRATION=WAIT_CREAD_LIVE
P6_LIVE_AUTHORIZED=NO
```

P6 peut donc poursuivre les contrats, fixtures, replays, assemblage, lifecycle, accessibilité et budgets sans accès au Cœur actif.

Le raccord live reste dépendant de la chaîne amont :

```text
P0-AUTH
  ↓
neutralité biologique / RNG
  ↓
O2
  ↓
O3
  ↓
O4
  ↓
CREAD-LIVE
  ↓
raccords live aval
```

## Frontière de publication

Ce document ne publie que les garanties d’architecture et de compatibilité nécessaires au développement partagé. Les mappings privés vers les représentations, recettes biologiques, seeds, RNG, paramètres, causalités réservées et détails runtime restent hors GitHub.
