<script lang="ts">
  import '../app.css';

  let { children } = $props();

  const navigation = [
    { href: '/', label: 'Présentation' },
    { href: '/guide', label: 'Guide' },
    { href: '/prototype', label: 'Prototype' },
    { href: '/journal', label: 'Journal' }
  ];
</script>

<svelte:head>
  <title>Les Lisières d’Avelune — Prototype v0.9</title>
  <meta
    name="description"
    content="Prototype navigateur du cycle intégré des Lisières d’Avelune."
  />
  <meta name="theme-color" content="#17111f" />
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<header class="topbar">
  <div class="topbar__inner">
    <a class="brand" href="/">
      <span class="brand__mark" aria-hidden="true">◈</span>
      <span>
        <strong>Les Lisières d’Avelune</strong>
        <small>Prototype privé · v0.9-dev.3</small>
      </span>
    </a>

    <nav aria-label="Navigation principale">
      {#each navigation as item}
        <a href={item.href}>{item.label}</a>
      {/each}
    </nav>
  </div>
</header>

<div class="page-shell">
  {@render children()}
</div>

<footer class="site-footer">
  <div>
    <span>Les Lisières d’Avelune</span>
    <span>La Genèse</span>
    <span>Prototype privé</span>
  </div>
</footer>
