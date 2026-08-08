import type { FeedbackRepository, NewFeedback, NewSession, PlaytestSession, SaveResult, SessionRepository, StoredFeedback, TelemetryEvent, TelemetryRepository } from './types.js';

export class MemorySessionRepository implements SessionRepository {
	readonly sessions = new Map<string, PlaytestSession>();
	async findByCode(code: string) { return this.sessions.get(code) ?? null; }
	async create(value: NewSession) {
		if (this.sessions.has(value.code)) return null;
		const now = new Date();
		const session: PlaytestSession = { ...value, status: 'active', stateVersion: 1, createdAt: now, updatedAt: now, lastSeenAt: now, result: null };
		this.sessions.set(value.code, session); return session;
	}
	async save(code: string, expectedVersion: number, gameState: PlaytestSession['gameState'], status: PlaytestSession['status'], result: string | null): Promise<SaveResult | null> {
		const current = this.sessions.get(code); if (!current) return null;
		const conflict = current.stateVersion !== expectedVersion;
		const session = { ...current, gameState, status, result, stateVersion: current.stateVersion + 1, updatedAt: new Date(), lastSeenAt: new Date() };
		this.sessions.set(code, session); return { session, conflict };
	}
}
export class MemoryTelemetryRepository implements TelemetryRepository { readonly events: TelemetryEvent[] = []; async insert(event: TelemetryEvent) { this.events.push(event); } }
export class MemoryFeedbackRepository implements FeedbackRepository {
	readonly feedback: StoredFeedback[] = [];
	async insert(value: NewFeedback) { const stored: StoredFeedback = { ...value, createdAt: new Date(), mailError: null }; this.feedback.push(stored); return stored; }
	async updateMail(id: string, status: 'sent' | 'failed', error?: string) { const entry = this.feedback.find((item) => item.id === id); if (entry) { entry.mailStatus = status; entry.mailError = error?.slice(0, 500) ?? null; } }
}
