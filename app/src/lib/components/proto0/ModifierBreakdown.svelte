<script lang="ts">
	export let base: number;
	export let delta: number;
	export let source: string;
	export let unit = '';

	$: result = base + delta;
</script>

<dl class="breakdown" aria-label="Décomposition de l’effet">
	<div><dt>Base</dt><dd>{base} {unit}</dd></div>
	<div><dt>{source}</dt><dd class="bonus">+{delta} {unit}</dd></div>
	<div class="result"><dt>Résultat</dt><dd>{result} {unit}</dd></div>
</dl>

<style>
	.breakdown { margin: 0.75rem 0; }
	.breakdown div { display: flex; justify-content: space-between; gap: 1rem; padding: 0.25rem 0; }
	.breakdown dt, .breakdown dd { margin: 0; }
	.bonus { color: var(--success, #8fd8ad); }
	.result { border-top: 1px solid currentColor; font-weight: 800; }
</style>
