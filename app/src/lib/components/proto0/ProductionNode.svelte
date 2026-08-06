<script lang="ts">
	import FlowDiagram from './FlowDiagram.svelte';

	export let name: string;
	export let description: string;
	export let flow: readonly string[] = [];
	export let active: boolean;
	export let assignedWork: number;
	export let requiredWork: number;
	export let energy: number;
	export let maintenance: number;
	export let disabled = false;
	export let onToggle: () => void;
	export let onStaff: () => void;

	$: staffed = assignedWork >= requiredWork;
</script>

<article class:inactive={!active} class:unstaffed={!staffed} class="production-node">
	<div>
		<div class="heading"><h4>{name}</h4><span class="state">{active ? 'ON' : 'OFF'}</span></div>
		<p>{description}</p>
		<FlowDiagram nodes={flow} />
		<p class="usage">⚡ {energy} · 👤 {assignedWork}/{requiredWork} · 🔧 {maintenance}</p>
		<p class="operation">{active && staffed ? 'Prête à fonctionner au prochain tour' : active ? 'Suspendue : personnel requis' : 'Arrêtée : liens conservés'}</p>
	</div>
	<div class="actions">
		<button type="button" class="secondary" {disabled} onclick={onToggle}>{active ? 'Mettre OFF' : 'Mettre ON'}</button>
		{#if requiredWork > 0}
			<button type="button" class="secondary" {disabled} onclick={onStaff}>{staffed ? 'Retirer la population' : 'Affecter la population'}</button>
		{/if}
	</div>
</article>

<style>
	.production-node { display: flex; flex-direction: column; justify-content: space-between; gap: .8rem; padding: .85rem; border: 1px solid var(--border); border-radius: .8rem; background: var(--panel-soft); }
	.heading, .actions { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .5rem; }
	h4, p { margin-top: 0; }
	.state { padding: .2rem .45rem; border-radius: 999px; background: var(--accent); color: #17131f; font-weight: 800; }
	.usage, .operation { color: var(--muted); font-size: .82rem; }
	.inactive, .unstaffed { border-style: dashed; }
	.inactive { opacity: .72; }
</style>
