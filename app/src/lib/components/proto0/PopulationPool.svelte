<script lang="ts">
	export let total: number;
	export let assigned: number;
	$: available = Math.max(0, total - assigned);
</script>

<aside class="pool" aria-label="Pool de population">
	<div><span>Population disponible</span><strong>{available}/{total}</strong></div>
	<small>{assigned} affectée{assigned > 1 ? 's' : ''}. Utilisez les commandes des fonctions pour la déplacer.</small>
</aside>

<style>
	.pool { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: .6rem; padding: .65rem .8rem; border: 1px solid var(--border); border-radius: .7rem; background: var(--panel-solid); }
	.pool div { display: flex; align-items: baseline; gap: .6rem; }
	span, small { color: var(--muted); }
	strong { font-size: 1.1rem; }
</style>
