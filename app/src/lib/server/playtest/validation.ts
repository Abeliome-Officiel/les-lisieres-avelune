import { FEEDBACK_CATEGORIES, type FeedbackCategory } from './types.js';

export const MAX_GAME_STATE_BYTES = 256_000;
export const MAX_FEEDBACK_LENGTH = 4_000;
export const MAX_CONTEXT_BYTES = 16_000;
export function validCode(value: unknown): value is string { return typeof value === 'string' && /^\d{4}$/.test(value); }
export function objectBody(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' && !Array.isArray(value); }
export function validTurn(value: unknown): value is number { return typeof value === 'number' && Number.isInteger(value) && value >= 0; }
export function validStateVersion(value: unknown): value is number { return typeof value === 'number' && Number.isInteger(value) && value >= 1; }
export function validStatePayload(value: unknown): boolean {
	if (!objectBody(value)) return false;
	try { return JSON.stringify(value).length <= MAX_GAME_STATE_BYTES; } catch { return false; }
}
export function validFeedbackCategory(value: unknown): value is FeedbackCategory { return typeof value === 'string' && FEEDBACK_CATEGORIES.includes(value as FeedbackCategory); }
export function validCompactContext(value: unknown): value is Record<string, unknown> {
	if (!objectBody(value)) return false;
	try { return JSON.stringify(value).length <= MAX_CONTEXT_BYTES; } catch { return false; }
}
export function cleanFeedbackMessage(value: unknown): string | null {
	if (typeof value !== 'string') return null;
	const clean = value.trim();
	return clean.length > 0 && clean.length <= MAX_FEEDBACK_LENGTH ? clean : null;
}
