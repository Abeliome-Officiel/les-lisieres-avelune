# Avelune — Modèle évolutif de vague — notice historique expurgée

> **Statut : historique — contenu détaillé retiré du dépôt courant**  
> Date : 9 août 2026

Ce fichier conserve uniquement la trace qu'une première baseline exploratoire du moteur d'évolution des vagues a existé et a été simulée.

La spécification détaillée, les dimensions internes, chemins de transition, mécanismes de mémoire, seuils, pondérations, résultats exploitables et autres éléments permettant de reconstituer la recette sont désormais classés **Cœur d'Avelune** et conservés hors GitHub.

## Contrat de production conservé

Le futur système doit :

- permettre une évolution progressive des caractéristiques de vague ;
- éviter les ruptures arbitraires instantanément ingérables ;
- rester stable sur de longues simulations ;
- continuer à fonctionner lorsque l'activité des joueurs est faible ou nulle ;
- accepter ultérieurement une influence agrégée des Corcites ;
- produire une télémétrie suffisante pour l'Observatoire et la Console du Monde ;
- être versionnable, reproductible à partir d'un snapshot autorisé et testable hors gameplay.

## Confidentialité

La recette historique elle-même ne doit plus être reproduite dans le dépôt courant.

**Important :** des versions antérieures de ce fichier et d'anciens commits peuvent encore contenir des informations aujourd'hui classées secrètes. Une réécriture/purge contrôlée de l'historique Git devra être réalisée séparément ; la simple modification de `main` ne supprime pas les anciens objets Git.
