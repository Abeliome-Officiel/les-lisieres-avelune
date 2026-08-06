<script lang="ts">
        import {
                RESOURCE_IDS,
                playerResourceLabel,
                type ResourceAmounts,
                type ResourceCosts
        } from '$lib/proto0/index.js';

        export let available:
                ResourceAmounts;

        export let costs:
                ResourceCosts;
</script>

<div class="cost-preview">
        {#each RESOURCE_IDS as resourceId}
                {@const cost =
                        costs[
                                resourceId
                        ] ?? 0}

                {#if cost > 0}
                        {@const current =
                                available[
                                        resourceId
                                ]}

                        <div
                                class:blocked={
                                        current <
                                        cost
                                }
                        >
                                <span>
                                        {playerResourceLabel(resourceId)}
                                </span>

                                <strong>
                                        {current}
                                        →
                                        {Math.max(
                                                0,
                                                current - cost
                                        )}
                                </strong>

                                <small>
                                        coût {cost}
                                </small>
                        </div>
                {/if}
        {/each}
</div>

<style>
        .cost-preview {
                display: grid;
                gap: 0.35rem;
                margin:
                        0.65rem
                        0;
        }

        .cost-preview > div {
                display: grid;
                grid-template-columns:
                        minmax(0, 1fr)
                        auto;
                gap:
                        0.15rem
                        0.65rem;
                padding: 0.45rem;
                border:
                        1px solid
                        currentColor;
                border-radius: 0.55rem;
                opacity: 0.9;
        }

        strong {
                white-space: nowrap;
        }

        small {
                grid-column: 1 / -1;
                opacity: 0.72;
        }

        .blocked {
                border-style: dashed;
        }
</style>
