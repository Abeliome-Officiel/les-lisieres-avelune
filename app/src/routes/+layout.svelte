<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Les Lisières d’Avelune — Prototype v0.9</title>
	<meta
		name="description"
		content="Prototype navigateur du cycle intégré des Lisières d’Avelune."
	/>
	<meta name="theme-color" content="#251d35" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{@render children()}
