import type { Proto0PlayableBrowserState } from './playable-browser-controller.js';
import { validateCorciteState } from './corcite/validate.js';
import { validatePlayableWaveCycle } from './wave/playable-cycle.js';

export const PLAYABLE_BROWSER_SAVE_KEY = 'avelune:proto0.2:run:v1';
export const PLAYABLE_BROWSER_SAVE_VERSION = 1;

interface PlayableBrowserSave {
	version: typeof PLAYABLE_BROWSER_SAVE_VERSION;
	savedAt: string;
	state: Proto0PlayableBrowserState;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function serializePlayableBrowserSave(
	state: Proto0PlayableBrowserState
): string {
	const save: PlayableBrowserSave = {
		version: PLAYABLE_BROWSER_SAVE_VERSION,
		savedAt: new Date().toISOString(),
		state: structuredClone(state)
	};

	return JSON.stringify(save);
}

export function parsePlayableBrowserSave(
	serialized: string | null
): Proto0PlayableBrowserState | null {
	if (!serialized) return null;

	try {
		const parsed: unknown = JSON.parse(serialized);

		if (
			!isRecord(parsed) ||
			parsed.version !== PLAYABLE_BROWSER_SAVE_VERSION ||
			!isRecord(parsed.state)
		) {
			return null;
		}

		const state = parsed.state;

		if (
			typeof state.runId !== 'string' ||
			typeof state.currentTurn !== 'number' ||
			!isRecord(state.corcite) ||
			!isRecord(state.waveCycle) ||
			!Array.isArray(state.turnReports) ||
			!Array.isArray(state.plannedActions) ||
			!Array.isArray(state.waveConsumptions) ||
			!isRecord(state.turnPlan) ||
			!Array.isArray(state.turnPlan.operations)
		) {
			return null;
		}

		const candidate = structuredClone(state) as unknown as Proto0PlayableBrowserState;
		if (
			!validateCorciteState(candidate.corcite).valid ||
			!validatePlayableWaveCycle(candidate.waveCycle).valid
		) {
			return null;
		}

		return candidate;
	} catch {
		return null;
	}
}
