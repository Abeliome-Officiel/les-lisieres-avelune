<script lang="ts">
  const resources = [
    {
      name: 'Matière',
      role: 'Construire, renforcer, réparer et stocker.',
      tension: 'La dépenser maintenant ou la conserver pour les Retombées.'
    },
    {
      name: 'Flux',
      role: 'Activer les structures et soutenir les défenses.',
      tension: 'Concentrer la puissance ou maintenir plusieurs systèmes.'
    },
    {
      name: 'Mémoire',
      role: 'Lire les Murmures, prévoir la vague et comprendre les Échos.',
      tension: 'Réduire l’incertitude ou conserver une réserve de connaissance.'
    }
  ];

  const testerQuestions = [
    'Comprends-tu ce que chaque action coûte et produit ?',
    'Les choix semblent-ils réellement différents ?',
    'Le résultat du Passage paraît-il explicable ?',
    'Le journal donne-t-il trop ou pas assez d’informations ?',
    'As-tu envie de recommencer avec une autre stratégie ?'
  ];
</script>

<section class="page-heading">
  <p class="eyebrow">Guide du testeur</p>
  <h1>Comprendre avant de jouer</h1>
  <p class="lead">
    Cette version ne cherche pas encore l’équilibre définitif. Elle cherche à vérifier
    que les mécaniques centrales sont lisibles et interdépendantes.
  </p>
</section>

<main class="content-stack">
  <section>
    <p class="eyebrow">Situation</p>
    <h2>Le monde est protégé par la Lisière</h2>
    <p class="wide-copy">
      Au centre se trouve la Fracture. Des vagues en émergent et traversent les anneaux
      du monde. Les corps-cités anticipent leur trajectoire, préparent des défenses et
      traitent les conséquences laissées après leur Passage.
    </p>
  </section>

  <section>
    <p class="eyebrow">Économie minimale</p>
    <h2>Trois ressources, trois tensions</h2>

    <div class="card-grid card-grid--three">
      {#each resources as resource}
        <article class="info-card">
          <h3>{resource.name}</h3>
          <p>{resource.role}</p>
          <p class="note">{resource.tension}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="split-section">
    <div>
      <p class="eyebrow">Ce qui est fixé</p>
      <h2>Le cadre du test</h2>
    </div>

    <ul class="locked-list">
      <li>Carte de rayon 7 avec Fracture de rayon 1</li>
      <li>Un joueur réel et quatre corps-cités simulés</li>
      <li>Cinq phases dans un ordre déterminé</li>
      <li>Trois ressources fondamentales</li>
      <li>Résolution déterministe et explicable</li>
    </ul>
  </section>

  <section class="split-section">
    <div>
      <p class="eyebrow">Ce qui est testé</p>
      <h2>Les paramètres encore ouverts</h2>
    </div>

    <ul class="test-list">
      <li>Puissance initiale de la vague</li>
      <li>Coût et efficacité des préparations</li>
      <li>Valeur réelle de la prévision</li>
      <li>Lisibilité de la résolution anneau par anneau</li>
      <li>Gravité des Retombées et rythme de la Dissonance</li>
    </ul>
  </section>

  <section>
    <p class="eyebrow">Retour attendu</p>
    <h2>Questions à garder en tête</h2>

    <ol class="question-list">
      {#each testerQuestions as question}
        <li>{question}</li>
      {/each}
    </ol>
  </section>
</main>
