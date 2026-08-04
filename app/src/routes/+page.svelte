<script lang="ts">
  import { phases } from '$lib/prototype';

  const axes = [
    {
      title: 'Corps-cité',
      text: 'Construire un organisme urbain mobile, produire ses ressources et décider de ses priorités.'
    },
    {
      title: 'Défense du monde',
      text: 'Préparer le Passage, absorber les vagues et préserver les secteurs de la Lisière.'
    },
    {
      title: 'Trame RPG',
      text: 'Interpréter les Murmures, agir sur les Échos et accepter des conséquences persistantes.'
    }
  ];

  const ethics = [
    'La coopération doit être utile sans devenir une obligation permanente.',
    'Les conséquences doivent rester compréhensibles et éviter la punition arbitraire.',
    'Les autres joueurs ne sont pas seulement des adversaires ou des ressources.',
    'Le jeu doit proposer plusieurs profondeurs de lecture et limiter la surcharge.',
    'Les choix difficiles doivent porter sur des priorités, pas sur une domination obligatoire.'
  ];
</script>

<section class="hero">
  <p class="eyebrow">Prototype navigateur · v0.9-dev.3</p>
  <h1>Les Lisières d’Avelune</h1>
  <p class="lead">
    Un monde persistant où des corps-cités préparent ensemble la défense de la
    Lisière, interprètent les traces du Passage et transforment leurs conséquences.
  </p>

  <div class="hero__actions">
    <a class="button button--primary" href="/prototype">Ouvrir le prototype</a>
    <a class="button" href="/guide">Lire le guide du testeur</a>
  </div>
</section>

<main class="content-stack">
  <section class="status-panel" aria-labelledby="status-title">
    <div>
      <p class="eyebrow">État du prototype</p>
      <h2 id="status-title">Première tranche mécanique manipulable</h2>
      <p>
        Le socle technique est actif. La version dev.2 ajoute un scénario déterministe,
        des décisions de préparation, une résolution du Passage et un journal explicatif.
      </p>
    </div>

    <div class="status-badge">
      <span class="status-dot" aria-hidden="true"></span>
      dev.2 actif
    </div>
  </section>

  <section aria-labelledby="cycle-title">
    <p class="eyebrow">Boucle principale</p>
    <h2 id="cycle-title">Un cycle en cinq temps</h2>

    <ol class="phase-grid">
      {#each phases as phase, index}
        <li class="phase-card">
          <span class="phase-number">{String(index + 1).padStart(2, '0')}</span>
          <h3>{phase.name}</h3>
          <p>{phase.description}</p>
        </li>
      {/each}
    </ol>
  </section>

  <section aria-labelledby="axes-title">
    <p class="eyebrow">Axes mécaniques</p>
    <h2 id="axes-title">Trois systèmes qui doivent se répondre</h2>

    <div class="card-grid card-grid--three">
      {#each axes as axis}
        <article class="info-card">
          <h3>{axis.title}</h3>
          <p>{axis.text}</p>
        </article>
      {/each}
    </div>
  </section>

  <section class="split-section" aria-labelledby="resources-title">
    <div>
      <p class="eyebrow">Ressources fondamentales</p>
      <h2 id="resources-title">Matière, Flux et Mémoire</h2>
      <p>
        La Matière permet de construire. Le Flux permet d’activer et de faire circuler.
        La Mémoire permet de comprendre, prévoir et conserver des traces.
      </p>
    </div>

    <div class="resource-list">
      <article>
        <strong>Matière</strong>
        <span>Structure, réparation, stockage et transformation.</span>
      </article>
      <article>
        <strong>Flux</strong>
        <span>Énergie, circulation, activation et réaction.</span>
      </article>
      <article>
        <strong>Mémoire</strong>
        <span>Prévision, transmission, lecture et interprétation.</span>
      </article>
    </div>
  </section>

  <section aria-labelledby="ethics-title">
    <p class="eyebrow">Orientations de conception</p>
    <h2 id="ethics-title">Les choix éthiques du projet</h2>

    <ul class="principle-list">
      {#each ethics as principle}
        <li>{principle}</li>
      {/each}
    </ul>
  </section>
</main>
