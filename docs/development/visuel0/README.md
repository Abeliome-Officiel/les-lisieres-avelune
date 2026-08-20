# VISUEL-0 — préparation technique du contrat et du replay

Statut : **préparation de la première gate technique**.  
Branche : `develop/visuel-0-contract`.  
Date : 13 août 2026.

Ce lot prépare le raccordement futur du visuel au Cœur sans développer encore l’Orée, sans choisir un renderer final et sans exposer d’information réservée.

## 1. But

VISUEL-0 doit démontrer qu’un interpréteur visuel peut être construit avant l’achèvement du Cœur puis raccordé plus tard **sans réécriture globale**.

Chaîne cible :

```text
source privée / replay synthétique
        ↓
adaptateur privé
        ↓
projection autorisée
        ↓
contrat sémantique versionné
        ↓
profil VISUEL-0
        ↓
renderer factice puis renderer expérimental
```

Le renderer ne connaît jamais les structures internes de la source.

## 2. Périmètre de cette branche

Cette branche peut contenir :

- schémas de contrat partageables ;
- profils de projection explicitement autorisés ;
- fixtures entièrement synthétiques ;
- cas de continuité d’identité et de transformation visuelle ;
- cas de resynchronisation ;
- tests de validation et de non-régression du contrat ;
- renderer factice sans direction artistique définitive ;
- mesures de taille de payload et, plus tard, de coût du LAB.

Cette branche ne doit pas contenir :

- export brut du Cœur ;
- nom de variable, table, colonne, coefficient ou paramètre privé ;
- identifiant canonique non destiné au client ;
- recette de projection privée ;
- règle biologique réservée ;
- causalité interne ;
- design définitif de race ;
- choix définitif de renderer.

## 3. Règle de projection

Le client reçoit une **vue de publication** et non l’état interne.

Les identifiants présents dans les fixtures et futurs payloads sont des identifiants de projection ou de replay. Ils ne garantissent aucune correspondance avec un identifiant interne du Cœur.

Les descripteurs du profil VISUEL-0 décrivent uniquement une apparence ou un comportement visuel autorisé. Ils ne constituent pas un vocabulaire biologique canonique.

Le profil utilise une liste positive de champs. Tout champ non prévu est rejeté au niveau du profil.

## 4. Relation avec le contrat partagé

`docs/contracts/representation-semantic-v0.schema.json` fournit l’enveloppe générale : version, source de publication, séquence, temps logique, portée, descripteurs et événements.

VISUEL-0 ajoute un **profil plus restrictif**, sans élargir l’autorité du contrat partagé. Le profil visuel doit pouvoir évoluer indépendamment du renderer.

Le contrat partagé est déjà utilisé par un autre interpréteur expérimental. VISUEL-0 ne doit donc pas le spécialiser silencieusement pour le seul visuel.

## 5. Premiers cas de référence

Le paquet initial prépare quatre cas :

1. `stable-full.json` — scène synthétique stable ;
2. `transition-before.json` — même entité avant transformation majeure ;
3. `transition-after.json` — même entité après transformation, avec identité de projection conservée ;
4. `resync-full.json` — état complet pouvant remplacer une séquence manquante.

Aucun de ces fichiers ne provient d’une simulation réelle du Cœur.

## 6. Gate VISUEL-0

VISUEL-0 ne passe au travail graphique substantiel que si les points suivants sont démontrés :

- [ ] le profil refuse les champs non autorisés ;
- [ ] aucune donnée privée n’est requise pour reconstruire les fixtures ;
- [ ] le même consommateur accepte fixture locale, replay et flux simulé ;
- [ ] une interruption de séquence se résout par un état complet ;
- [ ] une transformation conserve l’identité de projection sans imposer sa cause biologique ;
- [ ] une source fictive B, structurellement différente d’une source fictive A, peut produire le même profil via un autre adaptateur ;
- [ ] un renderer factice peut consommer le profil sans dépendre du Cœur ;
- [ ] le renderer peut être remplacé sans modifier les fixtures ni le contrat ;
- [ ] les versions source, contrat/profil, grammaire et renderer restent distinguables ;
- [ ] les payloads restent bornés à la scène utile ;
- [ ] les premiers coûts CPU/RAM/réseau sont mesurables séparément du futur renderer riche.

## 7. Séquence de travail préparée

### V0-A — contrat

- profil VISUEL-0 fermé par whitelist ;
- fixtures synthétiques ;
- validation de schéma ;
- règle de resynchronisation.

### V0-B — anti-réécriture

Créer deux sources synthétiques incompatibles en interne :

```text
source A → adaptateur A ┐
                       ├→ même profil VISUEL-0
source B → adaptateur B ┘
```

Le consommateur ne change pas.

### V0-C — renderer factice

Un renderer factice ne produit qu’une représentation abstraite minimale. Son seul objectif est de prouver que le contrat est consommable et remplaçable.

### V0-D — premier renderer expérimental

Seulement après V0-A à V0-C. PixiJS peut être évalué ici comme candidat, sans devenir une dépendance du contrat.

## 8. Critère d’arrêt

Si le LAB doit lire une structure privée de la source pour obtenir un résultat correct, ou si une évolution fictive de la source impose une réécriture de la grammaire/renderer, **la gate échoue**. On corrige l’adaptateur ou le contrat avant de poursuivre le travail artistique.

## 9. Frontière documentaire

La documentation GitHub décrit les interfaces, les garanties, les fixtures synthétiques et les résultats de tests partageables. Les recettes propriétaires, mappings réels, mécanismes causaux et informations réservées restent dans les espaces privés appropriés.
