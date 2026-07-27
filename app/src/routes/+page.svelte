<script lang="ts">
	const phases = [
		{
			name: 'Murmures',
			description: 'Observer la vague, réduire l’incertitude et lire les premiers signes.'
		},
		{
			name: 'Veille',
			description: 'Produire, stocker et préparer les défenses du corps-cité.'
		},
		{
			name: 'Scellement',
			description: 'Fixer le plan qui sera utilisé pendant le Passage.'
		},
		{
			name: 'Passage',
			description: 'Résoudre la progression de la vague anneau après anneau.'
		},
		{
			name: 'Retombées',
			description: 'Mesurer les dégâts, réparer la Lisière et traiter les Échos.'
		}
	];

	const foundations = [
		'Carte hexagonale R7 avec Fracture F1',
		'Un joueur réel et quatre corps-cités simulés',
		'Moteur déterministe et résultats explicables',
		'Trois ressources : Matière, Flux et Mémoire',
		'Trame RPG et piste de Dissonance',
		'Sauvegarde persistante dans PostgreSQL'
	];
</script>

<header class="site-header">
	<div class="site-header__content">
		<p class="eyebrow">Prototype navigateur · v0.9</p>
		<h1>Les Lisières d’Avelune</h1>
		<p class="lead">
			Un premier cycle jouable reliant préparation du corps-cité, résolution de la vague et
			conséquences RPG.
		</p>
	</div>
</header>

<main>
	<section class="status-panel" aria-labelledby="status-title">
		<div>
			<p class="eyebrow">État du prototype</p>
			<h2 id="status-title">Fondation technique en cours</h2>
			<p>
				L’application SvelteKit fonctionne. Le moteur, la carte et la persistance seront ajoutés
				par lots vérifiables.
			</p>
		</div>

		<div class="status-badge">
			<span class="status-dot" aria-hidden="true"></span>
			Socle actif
		</div>
	</section>

	<section aria-labelledby="cycle-title">
		<p class="eyebrow">Boucle principale</p>
		<h2 id="cycle-title">Un cycle complet à rendre jouable</h2>

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

	<section class="foundation" aria-labelledby="foundation-title">
		<div>
			<p class="eyebrow">Périmètre validé</p>
			<h2 id="foundation-title">Le socle du prototype P1</h2>
		</div>

		<ul>
			{#each foundations as foundation}
				<li>{foundation}</li>
			{/each}
		</ul>
	</section>
</main>

<footer>
	<p>Les Lisières d’Avelune · La Genèse · Prototype privé</p>
</footer>
