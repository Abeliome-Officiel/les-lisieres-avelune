<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Les Lisières d’Avelune — PROTO-0</title>
	<meta
		name="description"
		content="Prototype expérimental PROTO-0 des Lisières d’Avelune."
	/>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="theme-color" content="#17131f" />
</svelte:head>

{@render children()}
