<script lang="ts">
        export let nodes:
                readonly string[] = [];
</script>

<div
        class="flow"
        role="list"
        aria-label="Enchaînement"
>
        {#each nodes as node, index}
                <span
                        class="node"
                        role="listitem"
                >
                        {node}
                </span>

                {#if index < nodes.length - 1}
                        <span
                                class="arrow"
                                aria-hidden="true"
                        >
                                →
                        </span>
                {/if}
        {/each}
</div>

<style>
        .flow {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 0.35rem;
                margin:
                        0.65rem
                        0;
        }

        .node {
                padding:
                        0.35rem
                        0.5rem;
                border:
                        1px solid
                        currentColor;
                border-radius: 0.55rem;
                font-size: 0.78rem;
                line-height: 1.25;
        }

        .arrow {
                font-weight: 800;
                opacity: 0.7;
        }
</style>
