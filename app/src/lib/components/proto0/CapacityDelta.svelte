<script lang="ts">
        import type {
                ConstructionCapacitySnapshot
        } from '$lib/proto0/index.js';

        export let before:
                ConstructionCapacitySnapshot;

        export let after:
                ConstructionCapacitySnapshot;
</script>

<div class="capacity-preview">
        <span>
                Énergie
                {before.energyUsed}/{before.energyNormal}
                →
                {after.energyUsed}/{after.energyNormal}
        </span>

        <span>
                Population
                {before.workUsed}/{before.workCapacity}
                →
                {after.workUsed}/{after.workCapacity}
        </span>

        <span>
                Entretien
                {before.maintenanceUsed}/{before.maintenanceCapacity}
                →
                {after.maintenanceUsed}/{after.maintenanceCapacity}
        </span>

        <span>
                Espace
                {before.spaceUsed}/{before.spaceCapacity}
                →
                {after.spaceUsed}/{after.spaceCapacity}
        </span>

        {#if
                before.storageCapacity !==
                after.storageCapacity
        }
                <span>
                        Stockage
                        {before.storageCapacity}
                        →
                        {after.storageCapacity}
                </span>
        {/if}
</div>

<style>
        .capacity-preview {
                display: flex;
                flex-wrap: wrap;
                gap: 0.35rem;
                margin:
                        0.55rem
                        0;
        }

        span {
                padding:
                        0.25rem
                        0.45rem;
                border:
                        1px solid
                        currentColor;
                border-radius: 999px;
                font-size: 0.75rem;
                opacity: 0.8;
        }
</style>
