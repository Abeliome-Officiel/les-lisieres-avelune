<script lang="ts">
        import {
                RESOURCE_IDS,
                playerResourceLabel,
                type PlayerTurnReport
        } from '$lib/proto0/index.js';

        export let report:
                PlayerTurnReport;

        export let compact =
                false;

        export let onAcknowledge:
                (() => void) |
                null = null;

        function signed(
                value: number
        ): string {
                if (value > 0) {
                        return `+${value}`;
                }

                return String(
                        value
                );
        }
</script>

<article
        class:compact
        class="turn-report"
>
        <header>
                <div>
                        <p class="eyebrow">
                                TOUR RÉSOLU
                        </p>

                        <h2>
                                Ce qui s’est passé au tour
                                {report.turn}
                        </h2>
                </div>
        </header>

        <div class="resources">
                {#each RESOURCE_IDS as resourceId}
                        {@const delta =
                                report.resources[
                                        resourceId
                                ]}

                        <div>
                                <span>
                                        {playerResourceLabel(resourceId)}
                                </span>

                                <strong>
                                        {delta.before}
                                        →
                                        {delta.after}
                                </strong>

                                <small>
                                        {signed(delta.delta)}
                                </small>
                        </div>
                {/each}
        </div>

        {#if !compact}
                <div class="capacities">
                        <span>
                                Énergie :
                                {report.before.energy.used}/{report.before.energy.normalCapacity}
                                →
                                {report.after.energy.used}/{report.after.energy.normalCapacity}
                        </span>

                        <span>
                                Réserve :
                                {report.before.energy.reserveCurrent}
                                →
                                {report.after.energy.reserveCurrent}
                        </span>

                        <span>
                                Population disponible :
                                {report.before.population.available}
                                →
                                {report.after.population.available}
                        </span>

                        <span>
                                Entretien :
                                {report.before.maintenance.used}/{report.before.maintenance.capacity}
                                →
                                {report.after.maintenance.used}/{report.after.maintenance.capacity}
                        </span>

                        <span>
                                Dette :
                                {report.before.maintenance.debt}
                                →
                                {report.after.maintenance.debt}
                        </span>

                        <span>
                                Intégrité :
                                {report.before.integrity.current}
                                →
                                {report.after.integrity.current}
                        </span>

                        <span>
                                Stockage :
                                {report.before.storage.used}/{report.before.storage.capacity}
                                →
                                {report.after.storage.used}/{report.after.storage.capacity}
                        </span>
                </div>
        {/if}

        <div class="events">
                {#each report.events as event}
                        <p
                                class:warning={
                                        event.status ===
                                        'warning'
                                }
                        >
                                {event.message}
                        </p>
                {/each}
        </div>

        {#if onAcknowledge}
                <button
                        type="button"
                        onclick={() =>
                                onAcknowledge?.()}
                >
                        Continuer
                </button>
        {/if}
</article>

<style>
        .turn-report {
                display: grid;
                gap: 0.8rem;
                padding: 1rem;
                border:
                        1px solid
                        currentColor;
                border-radius: 0.9rem;
        }

        h2,
        p {
                margin: 0;
        }

        .eyebrow {
                margin-bottom: 0.3rem;
                font-size: 0.72rem;
                font-weight: 800;
                letter-spacing: 0.1em;
        }

        .resources {
                display: grid;
                grid-template-columns:
                        repeat(
                                auto-fit,
                                minmax(
                                        9rem,
                                        1fr
                                )
                        );
                gap: 0.45rem;
        }

        .resources > div {
                display: grid;
                gap: 0.15rem;
                padding: 0.5rem;
                border:
                        1px solid
                        currentColor;
                border-radius: 0.55rem;
                opacity: 0.9;
        }

        .capacities {
                display: flex;
                flex-wrap: wrap;
                gap: 0.35rem;
        }

        .capacities span {
                padding:
                        0.25rem
                        0.45rem;
                border:
                        1px solid
                        currentColor;
                border-radius: 999px;
                font-size: 0.76rem;
                opacity: 0.8;
        }

        .events {
                display: grid;
                gap: 0.35rem;
        }

        .events p {
                padding: 0.5rem;
                border-radius: 0.5rem;
                background:
                        rgb(
                                255 255 255 /
                                5%
                        );
        }

        .events .warning {
                border:
                        1px dashed
                        currentColor;
        }

        button {
                justify-self: end;
        }

        .compact {
                padding: 0.75rem;
        }

        .compact h2 {
                font-size: 1rem;
        }
</style>
