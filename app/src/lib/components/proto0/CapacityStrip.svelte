<script lang="ts">
	interface CapacityStripItem { id: string; label: string; value: string | number; detail?: string; danger?: boolean; }
	export let items: readonly CapacityStripItem[] = [];
</script>

<section class="capacity-strip" aria-label="État du Corcite">
	{#each items as item (item.id)}
		<div><span>{item.label}</span><strong class:danger={item.danger}>{item.value}</strong>{#if item.detail}<small>{item.detail}</small>{/if}</div>
	{/each}
</section>

<style>
	.capacity-strip { position: sticky; z-index: 20; top: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr)); gap: .35rem; padding: .45rem; border: 1px solid var(--border); border-radius: .85rem; background: var(--panel-solid); box-shadow: 0 .75rem 2rem rgb(0 0 0 / 24%); }
	.capacity-strip div { display: flex; min-width: 0; flex-direction: column; padding: .42rem; border-radius: .55rem; background: var(--panel-soft); }
	span, small { color: var(--muted); }
	span { font-size: .72rem; }
	strong { overflow: hidden; font-size: .91rem; text-overflow: ellipsis; white-space: nowrap; }
	.danger { color: var(--danger); }
</style>
