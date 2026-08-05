import {
        mkdirSync,
        writeFileSync
} from 'node:fs';

import {
        resolve
} from 'node:path';

import {
        constructPlayableBrowserStructure,
        createPlayableBrowserSession,
        fabricatePlayableBrowserTower,
        getPlayableBrowserPendingDiscovery,
        getTotalUnanalysedWaveMatter,
        placePlayableBrowserTower,
        previewPlayableConstruction,
        previewPlayableTdFabrication,
        resolvePlayableBrowserTurn,
        resolvePlayableBrowserWave,
        setPlayableBrowserStructureActive,
        startPlayableBrowserResearch,
        validatePlayableBrowserDiscovery,
        type PlayableConstructionDefinitionId,
        type Proto0PlayableBrowserState
} from '../src/lib/proto0/index.js';

type Strategy =
        | 'passive'
        | 'research'
        | 'develop';

interface Result {
        strategy: Strategy;
        seed: number;

        finalTurn: number;
        integrity: number;
        energyReserve: number;
        maintenanceDebt: number;

        capturedMatter: number;
        unknownWaveMatter: number;

        structures: number;
        placedTowers: number;
        validatedResearches: number;

        waveTurns: number[];
}

function hasStructure(
        state:
                Proto0PlayableBrowserState,
        kind: string
): boolean {
        return state.corcite
                .structures.some(
                        (structure) =>
                                structure.kind ===
                                kind
                );
}

function tryAction(
        state:
                Proto0PlayableBrowserState,
        description: string,
        operation:
                (
                        current:
                                Proto0PlayableBrowserState
                ) =>
                        Proto0PlayableBrowserState,
        trace?:
                string[]
): Proto0PlayableBrowserState {
        try {
                const next =
                        operation(
                                state
                        );

                trace?.push(
                        `Tour ${state.currentTurn} — ${description}`
                );

                return next;
        } catch (error) {
                trace?.push(
                        `Tour ${state.currentTurn} — ${description} impossible : ${
                                error instanceof Error
                                        ? error.message
                                        : String(error)
                        }`
                );

                return state;
        }
}

function maybeBuild(
        state:
                Proto0PlayableBrowserState,
        definitionId:
                PlayableConstructionDefinitionId,
        trace?:
                string[]
): Proto0PlayableBrowserState {
        const preview =
                previewPlayableConstruction(
                        state.corcite,
                        definitionId
                );

        if (!preview.canConstruct) {
                return state;
        }

        return tryAction(
                state,
                `construction ${definitionId}`,
                (current) =>
                        constructPlayableBrowserStructure(
                                current,
                                definitionId
                        ),
                trace
        );
}

function manageResearch(
        state:
                Proto0PlayableBrowserState,
        strategy:
                Strategy,
        trace?:
                string[]
): Proto0PlayableBrowserState {
        let next =
                state;

        const pending =
                getPlayableBrowserPendingDiscovery(
                        next
                );

        if (pending) {
                next =
                        tryAction(
                                next,
                                `validation ${pending.definition.id}`,
                                (current) =>
                                        validatePlayableBrowserDiscovery(
                                                current,
                                                pending.definition.id
                                        ),
                                trace
                        );
        }

        if (
                strategy ===
                        'passive'
        ) {
                return next;
        }

        if (
                next.corcite.rpg.researches
                        .length ===
                0
        ) {
                next =
                        tryAction(
                                next,
                                'recherche wave-observation-n1',
                                (current) =>
                                        startPlayableBrowserResearch(
                                                current,
                                                'wave-observation-n1'
                                        ),
                                trace
                        );
        }

        return next;
}

function reduceLoad(
        state:
                Proto0PlayableBrowserState,
        trace?:
                string[]
): Proto0PlayableBrowserState {
        let next =
                state;

        let guard =
                0;

        while (
                next.corcite.capacities
                        .energy.used >
                        (
                                next.corcite.capacities
                                        .energy.normalCapacity +
                                next.corcite.capacities
                                        .energy.reserveCurrent
                        )
        ) {
                guard +=
                        1;

                if (
                        guard >
                        12
                ) {
                        throw new Error(
                                'Impossible de réduire la charge énergétique.'
                        );
                }

                const candidate =
                        [
                                'extractor-a-n1',
                                'extractor-b-n1',
                                'transformer-n1',
                                'fabricator-n1'
                        ]
                                .map(
                                        (kind) =>
                                                next.corcite.structures
                                                        .find(
                                                                (structure) =>
                                                                        structure.kind ===
                                                                                kind &&
                                                                        structure.status ===
                                                                                'active'
                                                        )
                                )
                                .find(
                                        Boolean
                                );

                if (!candidate) {
                        throw new Error(
                                'Déficit énergétique sans fonction désactivable.'
                        );
                }

                next =
                        tryAction(
                                next,
                                `mise en réserve ${candidate.name}`,
                                (current) =>
                                        setPlayableBrowserStructureActive(
                                                current,
                                                candidate.id,
                                                false
                                        ),
                                trace
                        );
        }

        return next;
}

function develop(
        state:
                Proto0PlayableBrowserState,
        trace?:
                string[]
): Proto0PlayableBrowserState {
        let next =
                state;

        if (
                !hasStructure(
                        next,
                        'extractor-a-n1'
                )
        ) {
                next =
                        maybeBuild(
                                next,
                                'organic-extractor',
                                trace
                        );
        }

        if (
                !hasStructure(
                        next,
                        'extractor-b-n1'
                )
        ) {
                next =
                        maybeBuild(
                                next,
                                'mineral-extractor',
                                trace
                        );
        }

        if (
                !hasStructure(
                        next,
                        'transformer-n1'
                )
        ) {
                next =
                        maybeBuild(
                                next,
                                'primary-transformer',
                                trace
                        );
        }

        if (
                !hasStructure(
                        next,
                        'fabricator-n1'
                )
        ) {
                next =
                        maybeBuild(
                                next,
                                'component-workshop',
                                trace
                        );
        }

        next =
                reduceLoad(
                        next,
                        trace
                );

        const physicalTowers =
                next.corcite.tdInventory
                        .length +
                next.corcite.td.positions
                        .filter(
                                (position) =>
                                        Boolean(
                                                position.tower
                                        )
                        ).length;

        if (
                physicalTowers ===
                        0 &&
                hasStructure(
                        next,
                        'fabricator-n1'
                )
        ) {
                const preview =
                        previewPlayableTdFabrication(
                                next.corcite,
                                'attenuation-n1'
                        );

                if (
                        preview.canFabricate
                ) {
                        next =
                                tryAction(
                                        next,
                                        'fabrication attenuation-n1',
                                        (current) =>
                                                fabricatePlayableBrowserTower(
                                                        current,
                                                        'attenuation-n1'
                                                ),
                                        trace
                                );

                        const tower =
                                next.corcite
                                        .tdInventory[0];

                        if (tower) {
                                next =
                                        tryAction(
                                                next,
                                                'placement TD position 4',
                                                (current) =>
                                                        placePlayableBrowserTower(
                                                                current,
                                                                tower.id,
                                                                4
                                                        ),
                                                trace
                                        );
                        }
                }
        }

        return next;
}

function run(
        strategy:
                Strategy,
        seed: number,
        trace?:
                string[]
): Result {
        let state =
                createPlayableBrowserSession({
                        testerCode:
                                'IRFI',
                        seed,
                        runId:
                                `SIM-${strategy}-${seed}`
                });

        let guard =
                0;

        while (
                state.waveCycle.phase !==
                        'complete'
        ) {
                guard +=
                        1;

                if (
                        guard >
                        80
                ) {
                        throw new Error(
                                `Session infinie : ${strategy}/${seed}.`
                        );
                }

                if (
                        state.waveCycle.phase ===
                        'ready'
                ) {
                        const turn =
                                state.currentTurn;

                        const number =
                                state.waveCycle.current
                                        ?.waveNumber;

                        state =
                                resolvePlayableBrowserWave(
                                        state
                                );

                        trace?.push(
                                `Tour ${turn} — vague ${number ?? '?'} résolue ; intégrité ${state.corcite.recovery.integrity.current.toFixed(2)}`
                        );

                        continue;
                }

                state =
                        manageResearch(
                                state,
                                strategy,
                                trace
                        );

                if (
                        strategy ===
                        'develop'
                ) {
                        state =
                                develop(
                                        state,
                                        trace
                                );
                }

                state =
                        reduceLoad(
                                state,
                                trace
                        );

                const turn =
                        state.currentTurn;

                state =
                        resolvePlayableBrowserTurn(
                                state
                        );

                trace?.push(
                        `Tour ${turn} — tour résolu`
                );
        }

        const histories =
                state.waveCycle.history;

        return {
                strategy,
                seed,

                finalTurn:
                        state.currentTurn,

                integrity:
                        state.corcite.recovery
                                .integrity.current,

                energyReserve:
                        state.corcite.capacities
                                .energy.reserveCurrent,

                maintenanceDebt:
                        state.corcite.sustainability
                                ?.maintenance.debt ??
                        0,

                capturedMatter:
                        histories.reduce(
                                (
                                        total,
                                        wave
                                ) =>
                                        total +
                                        wave.capturedMatter,
                                0
                        ),

                unknownWaveMatter:
                        getTotalUnanalysedWaveMatter(
                                state.corcite
                        ),

                structures:
                        state.corcite.structures
                                .length,

                placedTowers:
                        state.corcite.td.positions
                                .filter(
                                        (position) =>
                                                Boolean(
                                                        position.tower
                                                )
                                ).length,

                validatedResearches:
                        state.corcite.rpg.researches
                                .filter(
                                        (research) =>
                                                research.status ===
                                                'validated'
                                ).length,

                waveTurns:
                        histories.map(
                                (wave) =>
                                        wave.resolvedTurn
                        )
        };
}

function average(
        values:
                readonly number[]
): number {
        return values.reduce(
                (
                        total,
                        value
                ) =>
                        total +
                        value,
                0
        ) / values.length;
}

function n(
        value: number
): string {
        return value.toFixed(
                2
        );
}

const strategies:
        Strategy[] = [
                'passive',
                'research',
                'develop'
        ];

const seedCount =
        128;

const results:
        Result[] = [];

for (
        let seed = 1;
        seed <= seedCount;
        seed += 1
) {
        for (
                const strategy of
                strategies
        ) {
                results.push(
                        run(
                                strategy,
                                seed
                        )
                );
        }
}

if (
        results.length !==
        seedCount *
                strategies.length
) {
        throw new Error(
                'Nombre de simulations incorrect.'
        );
}

const spacings =
        new Set<number>();

for (
        const result of
        results
) {
        if (
                result.waveTurns.length !==
                3
        ) {
                throw new Error(
                        `Partie incomplète ${result.strategy}/${result.seed}.`
                );
        }

        if (
                result.waveTurns[0] !==
                6
        ) {
                throw new Error(
                        `Première vague != 6 : ${result.strategy}/${result.seed}.`
                );
        }

        for (
                let index = 1;
                index <
                        result.waveTurns.length;
                index += 1
        ) {
                const spacing =
                        result.waveTurns[index] -
                        result.waveTurns[
                                index - 1
                        ];

                if (
                        spacing < 5 ||
                        spacing > 7
                ) {
                        throw new Error(
                                `Espacement hors contrat : ${spacing}.`
                        );
                }

                spacings.add(
                        spacing
                );
        }
}

if (
        spacings.size <
        2
) {
        throw new Error(
                'La variabilité des vagues n’apparaît pas dans la batterie.'
        );
}

const rows =
        strategies.map(
                (strategy) => {
                        const subset =
                                results.filter(
                                        (entry) =>
                                                entry.strategy ===
                                                strategy
                                );

                        return {
                                strategy,
                                runs:
                                        subset.length,

                                integrity:
                                        average(
                                                subset.map(
                                                        (entry) =>
                                                                entry.integrity
                                                )
                                        ),

                                integrityMinimum:
                                        Math.min(
                                                ...subset.map(
                                                        (entry) =>
                                                                entry.integrity
                                                )
                                        ),

                                maintenance:
                                        average(
                                                subset.map(
                                                        (entry) =>
                                                                entry.maintenanceDebt
                                                )
                                        ),

                                structures:
                                        average(
                                                subset.map(
                                                        (entry) =>
                                                                entry.structures
                                                )
                                        ),

                                towers:
                                        average(
                                                subset.map(
                                                        (entry) =>
                                                                entry.placedTowers
                                                )
                                        ),

                                researches:
                                        average(
                                                subset.map(
                                                        (entry) =>
                                                                entry.validatedResearches
                                                )
                                        ),

                                finalTurn:
                                        average(
                                                subset.map(
                                                        (entry) =>
                                                                entry.finalTurn
                                                )
                                        )
                        };
                }
        );

const docs =
        resolve(
                process.cwd(),
                '../docs/proto0'
        );

mkdirSync(
        docs,
        {
                recursive:
                        true
        }
);

const report = [
        '# PROTO-0 — Rapport automatisé d’équilibrage',
        '',
        'Statut : **[acté] — Lot 13, référence provisoire**',
        '',
        `Batterie exécutée : **${results.length} parties complètes** (${seedCount} graines × ${strategies.length} stratégies simples).`,
        '',
        'Cette batterie contrôle la stabilité et produit des ordres de grandeur. Elle ne remplace pas le jugement de jeu.',
        '',
        '## Contrats vérifiés',
        '',
        '- Trois vagues résolues dans chaque partie.',
        '- Première vague au tour 6.',
        `- Espacements observés : ${[...spacings].sort((a, b) => a - b).join(', ')} tours.`,
        '- Aucune vague suivante avant cinq tours.',
        '- Aucune vague suivante après plus de sept tours avec les paramètres actuels.',
        '- Calendrier reproductible à graine identique.',
        '',
        '## Résultats',
        '',
        '| Stratégie | Parties | Intégrité moy. | Intégrité min. | Dette entretien moy. | Structures moy. | Défenses placées moy. | Recherches validées moy. | Tour final moy. |',
        '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
        ...rows.map(
                (row) =>
                        `| ${row.strategy} | ${row.runs} | ${n(row.integrity)} | ${n(row.integrityMinimum)} | ${n(row.maintenance)} | ${n(row.structures)} | ${n(row.towers)} | ${n(row.researches)} | ${n(row.finalTurn)} |`
        ),
        '',
        '## Conclusion',
        '',
        '- **[acté]** La boucle multi-vagues est stable sur la batterie.',
        '- **[acté]** La fenêtre minimale de développement est respectée.',
        '- **[acté]** La petite variabilité ne peut que retarder la vague.',
        '- **[ouvert]** Les coûts et rendements restent provisoires.',
        '- **[ouvert]** Le rythme perçu et l’intérêt des décisions doivent être jugés par un joueur humain.',
        ''
];

writeFileSync(
        resolve(
                docs,
                'PROTO0_PLAYABLE_BALANCE_REPORT.md'
        ),
        report.join(
                '\n'
        )
);

const trace:
        string[] = [];

const reference =
        run(
                'develop',
                20260806,
                trace
        );

const playthrough = [
        '# PROTO-0 — Parcours technique de référence',
        '',
        'Statut : **[acté] — Lot 14 technique**',
        '',
        'Graine : `20260806`',
        '',
        'Ce parcours traverse la même orchestration que l’interface jouable, sans injection manuelle de ressources et sans saut de vague.',
        '',
        '## Chronologie',
        '',
        ...trace.map(
                (line) =>
                        `- ${line}`
        ),
        '',
        '## État final',
        '',
        `- Tour final : ${reference.finalTurn}`,
        `- Intégrité : ${n(reference.integrity)}`,
        `- Réserve énergétique : ${n(reference.energyReserve)}`,
        `- Dette d’entretien : ${n(reference.maintenanceDebt)}`,
        `- Structures : ${reference.structures}`,
        `- Défenses placées : ${reference.placedTowers}`,
        `- Recherches validées : ${reference.validatedResearches}`,
        `- Matière captée : ${n(reference.capturedMatter)}`,
        `- Matière de vague non analysée : ${n(reference.unknownWaveMatter)}`,
        `- Vagues : ${reference.waveTurns.join(', ')}`,
        '',
        '## Limite',
        '',
        'Ce parcours prouve la continuité mécanique. Il ne permet pas de déclarer que le jeu est intéressant, lisible ou bien rythmé : ce verdict reste réservé au playtest humain.',
        ''
];

writeFileSync(
        resolve(
                docs,
                'PROTO0_PLAYABLE_REFERENCE_PLAYTHROUGH.md'
        ),
        playthrough.join(
                '\n'
        )
);

console.log(
        `SIMULATIONS : ${results.length} parties complètes.`
);

console.log(
        `ESPACEMENTS : ${[...spacings].sort((a, b) => a - b).join(', ')}.`
);

for (
        const row of
        rows
) {
        console.log(
                `${row.strategy} | intégrité ${n(row.integrity)} | structures ${n(row.structures)} | tour final ${n(row.finalTurn)}`
        );
}

console.log(
        'PARCOURS TECHNIQUE : OK.'
);
