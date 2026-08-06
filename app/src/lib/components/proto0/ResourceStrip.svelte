<script lang="ts">
	interface ResourceStripItem { id: string; label: string; value: string | number; }
	export let items: readonly ResourceStripItem[] = [];
</script>

<section class="resource-strip" aria-label="Ressources actuelles">
	{#each items as item (item.id)}
		<div><span>{item.label}</span><strong>{item.value}</strong></div>
	{/each}
</section>

<style>
	.resource-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: .35rem; margin-top: .6rem; }
	.resource-strip div { display: flex; align-items: center; justify-content: space-between; gap: .5rem; padding: .45rem .55rem; border: 1px solid var(--border); border-radius: .6rem; background: var(--panel-solid); }
	.resource-strip span { color: var(--muted); }
</style>
