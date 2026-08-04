<script lang="ts">
  const sample = [
    '[001] PHASE=Murmures CODE=SCENARIO_LOAD | seed=genese-001 wave=24',
    '[002] PHASE=Murmures CODE=READ_MURMURS | memory=-2 precision=2',
    '[003] PHASE=Veille CODE=BUILD_RAMPART | matter=-3 flow=-2 defense_pool=7',
    '[004] PHASE=Passage CODE=RING_RESOLUTION | incoming=24 defense=2 absorbed=2 remaining=22',
    '[005] PHASE=Retombées CODE=FALLOUT_MEASURED | lisiere=76 dissonance=3 echo=true'
  ];

  const fields = [
    ['Identifiant', 'Ordre de l’événement dans la simulation.'],
    ['Phase', 'Moment du cycle pendant lequel l’événement se produit.'],
    ['Code', 'Nom technique stable permettant de comparer les essais.'],
    ['Message', 'Explication lisible de ce qui vient de se passer.'],
    ['Données', 'Valeurs d’entrée, calculs et résultats utiles au diagnostic.']
  ];
</script>

<section class="page-heading">
  <p class="eyebrow">Journal de simulation</p>
  <h1>Comprendre les résultats</h1>
  <p class="lead">
    Le journal sert à la fois de récit mécanique, d’outil de comparaison et de trace
    de débogage. Aucun résultat important ne doit rester opaque.
  </p>
</section>

<main class="content-stack">
  <section class="log-panel">
    <p class="eyebrow">Exemple</p>
    <h2>Format du journal</h2>

    <div class="code-log">
      {#each sample as line}
        <div>{line}</div>
      {/each}
    </div>
  </section>

  <section>
    <p class="eyebrow">Structure</p>
    <h2>Ce que chaque ligne indique</h2>

    <dl class="definition-list">
      {#each fields as field}
        <div>
          <dt>{field[0]}</dt>
          <dd>{field[1]}</dd>
        </div>
      {/each}
    </dl>
  </section>

  <section>
    <p class="eyebrow">Objectif</p>
    <h2>Pourquoi exposer les calculs</h2>
    <p class="wide-copy">
      Pendant la Genèse, les valeurs doivent pouvoir être contestées et comparées.
      Le journal permet d’identifier si un choix est faible parce qu’il est mal
      équilibré, mal expliqué ou simplement inadapté au scénario.
    </p>
  </section>
</main>
