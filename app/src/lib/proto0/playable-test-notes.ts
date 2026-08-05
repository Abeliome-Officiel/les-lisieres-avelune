export const PLAYABLE_TEST_NOTE_CATEGORIES = [
        {
                id: 'strategy',
                label: 'Stratégie'
        },
        {
                id: 'intention',
                label: 'Intention'
        },
        {
                id: 'friction',
                label: 'Friction'
        },
        {
                id: 'surprise',
                label: 'Surprise'
        },
        {
                id: 'bug',
                label: 'Bug'
        },
        {
                id: 'other',
                label: 'Autre'
        }
] as const;

export type PlayableTestNoteCategory =
        typeof PLAYABLE_TEST_NOTE_CATEGORIES[number]['id'];

export interface PlayableTestNoteContext {
        runId: string;
        turn: number;
        view: string;

        waveNumber:
                number |
                null;

        wavePhase: string;

        statusMessage: string;

        integrity: number;
        energyReserve: number;
        maintenanceDebt: number;
}

export interface PlayableTestNote {
        id: string;
        createdAtIso: string;
        category:
                PlayableTestNoteCategory;
        text: string;
        context:
                PlayableTestNoteContext;
}

export interface CreatePlayableTestNoteInput {
        category:
                PlayableTestNoteCategory;
        text: string;
        context:
                PlayableTestNoteContext;

        id?: string;
        createdAtIso?: string;
}

function isCategory(
        value: unknown
): value is PlayableTestNoteCategory {
        return (
                typeof value ===
                        'string' &&
                PLAYABLE_TEST_NOTE_CATEGORIES
                        .some(
                                (entry) =>
                                        entry.id ===
                                        value
                        )
        );
}

function isFiniteNumber(
        value: unknown
): value is number {
        return (
                typeof value ===
                        'number' &&
                Number.isFinite(
                        value
                )
        );
}

function isNote(
        value: unknown
): value is PlayableTestNote {
        if (
                typeof value !==
                        'object' ||
                value ===
                        null
        ) {
                return false;
        }

        const note =
                value as Partial<
                        PlayableTestNote
                >;

        const context =
                note.context;

        return (
                typeof note.id ===
                        'string' &&
                note.id.length > 0 &&
                typeof note.createdAtIso ===
                        'string' &&
                isCategory(
                        note.category
                ) &&
                typeof note.text ===
                        'string' &&
                note.text.trim().length >
                        0 &&
                typeof context ===
                        'object' &&
                context !== null &&
                typeof context.runId ===
                        'string' &&
                isFiniteNumber(
                        context.turn
                ) &&
                typeof context.view ===
                        'string' &&
                (
                        context.waveNumber ===
                                null ||
                        isFiniteNumber(
                                context.waveNumber
                        )
                ) &&
                typeof context.wavePhase ===
                        'string' &&
                typeof context.statusMessage ===
                        'string' &&
                isFiniteNumber(
                        context.integrity
                ) &&
                isFiniteNumber(
                        context.energyReserve
                ) &&
                isFiniteNumber(
                        context.maintenanceDebt
                )
        );
}

export function createPlayableTestNote(
        input:
                CreatePlayableTestNoteInput
): PlayableTestNote {
        const text =
                input.text.trim();

        if (!text) {
                throw new Error(
                        'Une note de test ne peut pas être vide.'
                );
        }

        const createdAtIso =
                input.createdAtIso ??
                new Date().toISOString();

        const id =
                input.id ??
                [
                        'note',
                        Date.now(),
                        Math.random()
                                .toString(36)
                                .slice(2, 9)
                ].join('-');

        return {
                id,
                createdAtIso,
                category:
                        input.category,
                text,
                context:
                        structuredClone(
                                input.context
                        )
        };
}

export function serializePlayableTestNotes(
        notes:
                readonly PlayableTestNote[]
): string {
        return JSON.stringify(
                notes,
                null,
                2
        );
}

export function parsePlayableTestNotes(
        serialized:
                string |
                null
): PlayableTestNote[] {
        if (!serialized) {
                return [];
        }

        try {
                const parsed:
                        unknown =
                        JSON.parse(
                                serialized
                        );

                if (
                        !Array.isArray(
                                parsed
                        )
                ) {
                        return [];
                }

                return parsed
                        .filter(
                                isNote
                        )
                        .map(
                                (note) =>
                                        structuredClone(
                                                note
                                        )
                        );
        } catch {
                return [];
        }
}
