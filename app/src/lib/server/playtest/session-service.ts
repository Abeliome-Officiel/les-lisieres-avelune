import { randomInt, randomUUID } from 'node:crypto';
import { createGame, restoreGame } from '../../proto02/game.js';
import { PLAYTEST_VERSION } from '../../playtest/version.js';
import type { SessionRepository, TelemetryRepository } from './types.js';

export class SessionService {
	constructor(private readonly sessions: SessionRepository, private readonly telemetry: TelemetryRepository, private readonly codeGenerator = () => randomInt(0, 10_000).toString().padStart(4, '0')) {}
	async create() {
		for (let attempt = 0; attempt < 10_000; attempt += 1) {
			const value = await this.sessions.create({ id: randomUUID(), code: this.codeGenerator(), gameVersion: PLAYTEST_VERSION, gameState: createGame() });
			if (value) { await this.telemetry.insert({ sessionId: value.id, turn: 1, eventType: 'session_created', payload: {}, gameVersion: PLAYTEST_VERSION }); return value; }
		}
		throw new Error('Aucun code de playtest disponible.');
	}
	async resume(code: string) { const value = await this.sessions.findByCode(code); if (!value || value.status === 'archived') return null; await this.telemetry.insert({ sessionId: value.id, turn: value.gameState.turn, eventType: 'session_resumed', payload: { stateVersion: value.stateVersion }, gameVersion: PLAYTEST_VERSION }); return value; }
	async save(code: string, expectedVersion: number, rawState: unknown) {
		const restored = restoreGame(JSON.stringify(rawState)); if (!restored) throw new TypeError('État de partie invalide.');
		const status = restored.status === 'playing' ? 'active' : 'finished';
		const saved = await this.sessions.save(code, expectedVersion, restored, status, restored.status === 'playing' ? null : restored.status);
		if (saved?.conflict) await this.telemetry.insert({ sessionId: saved.session.id, turn: restored.turn, eventType: 'save_conflict', payload: { expectedVersion, acceptedVersion: saved.session.stateVersion }, gameVersion: PLAYTEST_VERSION });
		return saved;
	}
}
