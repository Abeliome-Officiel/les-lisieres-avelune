import { createGame, restoreGame, serializeGame, type GameState } from './game.js';

export const TESTER_IDS = ['IRFI', 'AUBE', 'BRUM', 'ORBE', 'SILE'] as const;
export type TesterId = (typeof TESTER_IDS)[number];

export const DEFAULT_TESTER: TesterId = 'IRFI';
export const LAST_TESTER_KEY = 'avelune:proto02:last-tester:v3';

export interface LocalSaveStore {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
}

export function isTesterId(value: string | null): value is TesterId {
	return TESTER_IDS.some((id) => id === value);
}

export function testerSaveKey(tester: TesterId): string {
	return `avelune:proto02:save:v3:${tester}`;
}

export function loadTesterGame(store: LocalSaveStore, tester: TesterId): { state: GameState; invalid: boolean; restored: boolean } {
	const serialized = store.getItem(testerSaveKey(tester));
	const restored = restoreGame(serialized);
	return restored
		? { state: restored, invalid: false, restored: true }
		: { state: createGame(), invalid: serialized !== null, restored: false };
}

export function saveTesterGame(store: LocalSaveStore, tester: TesterId, state: GameState): void {
	store.setItem(testerSaveKey(tester), serializeGame(state));
}
