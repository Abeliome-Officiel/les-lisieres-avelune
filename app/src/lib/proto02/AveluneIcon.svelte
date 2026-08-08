<script lang="ts">
	let { name, size = 20, label = '' }: { name: string; size?: number; label?: string } = $props();
</script>

<svg
	class="icon"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden={label ? undefined : 'true'}
	aria-label={label || undefined}
	role={label ? 'img' : undefined}
>
	{#if name === 'organic'}
		<path d="M12 21c-1-6 1-10 7-14-1 7-3 11-7 14Z"/><path d="M12 21c0-5-2-8-7-11 0 6 2 9 7 11Zm0 0v-9"/>
	{:else if name === 'mineral'}
		<path d="m12 2 7 6-3 12H8L5 8l7-6Z"/><path d="m5 8 7 3 7-3m-7 3-4 9m4-9 4 9"/>
	{:else if name === 'refined'}
		<path d="M6 5c5-3 9 0 12-2-1 4 2 7 0 11-2 5-9 6-12 2-3-4 1-7 0-11Z"/><path d="m8 14 3-5 5 4"/>
	{:else if name === 'component' || name === 'construction'}
		<path d="M4 8h7V3h4v5h5v5h-5v8h-4v-8H4V8Z"/><path d="m4 13 4 4m12-4-4 4"/>
	{:else if name === 'storage'}
		<path d="M4 7c0-3 16-3 16 0v10c0 3-16 3-16 0V7Z"/><path d="M4 7c0 3 16 3 16 0m-16 5c0 3 16 3 16 0"/>
	{:else if name === 'energy'}
		<path d="m13 2-7 12h6l-1 8 7-12h-6l1-8Z"/>
	{:else if name === 'maintenance'}
		<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4"/><circle cx="12" cy="12" r="4"/>
	{:else if name === 'population'}
		<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20c0-5 12-5 12 0m0-5c3-1 6 1 6 4"/>
	{:else if name === 'integrity'}
		<path d="M12 21S4 17 4 9V5l8-3 8 3v4c0 8-8 12-8 12Z"/><path d="m8 12 3 3 5-7"/>
	{:else if name === 'extract-organic'}
		<path d="M5 20c1-8 5-13 14-16-1 9-6 15-14 16Z"/><path d="m6 19 8-9m-2 3-4-1"/>
	{:else if name === 'extract-mineral'}
		<path d="m4 20 4-14 5-3 7 6-5 11H4Z"/><path d="m8 6 5 5 7-2m-7 2 2 9"/>
	{:else if name === 'defense'}
		<path d="M12 3 4 8v5c0 5 3 8 8 9 5-1 8-4 8-9V8l-8-5Z"/><path d="M8 14h8m-4-5v8"/>
	{:else if name === 'recycler'}
		<path d="m8 5 3-3 3 3M11 2v6m7 4 3 3-3 3m3-3h-6M6 19l-3-3 3-3m-3 3h6"/>
	{:else if name === 'research'}
		<path d="M12 3c5 0 8 4 7 9-1 4-4 4-5 8h-4c-1-4-4-4-5-8-1-5 2-9 7-9Z"/><path d="M9 10c2 0 3-1 3-3 0 2 1 3 3 3-2 0-3 1-3 3 0-2-1-3-3-3Z"/>
	{:else if name === 'production'}
		<path d="M4 20V9l5 3V8l5 3V4h6v16H4Z"/><path d="M8 16h2m4 0h2"/>
	{:else if name === 'cycle'}
		<path d="M20 7V3l-3 3a8 8 0 1 0 2 10"/><path d="M20 3h-4"/>
	{:else}
		<path d="M12 2c4 4 7 6 7 11a7 7 0 1 1-14 0c0-5 3-7 7-11Z"/><circle cx="12" cy="13" r="2"/>
	{/if}
</svg>

<style>.icon{display:inline-block;flex:none;overflow:visible}</style>
