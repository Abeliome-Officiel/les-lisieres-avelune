import type { GameState } from '../../proto02/game.js';
import type { SqlClient } from './db.js';
import type { FeedbackRepository, NewFeedback, NewSession, PlaytestSession, SaveResult, SessionRepository, StoredFeedback, TelemetryEvent, TelemetryRepository } from './types.js';

type SessionRow = { id: string; code: string; status: PlaytestSession['status']; game_version: string; state_version: number; game_state: GameState; created_at: Date; updated_at: Date; last_seen_at: Date; result: string | null };
const session = (row: SessionRow): PlaytestSession => ({ id: row.id, code: row.code, status: row.status, gameVersion: row.game_version, stateVersion: row.state_version, gameState: row.game_state, createdAt: row.created_at, updatedAt: row.updated_at, lastSeenAt: row.last_seen_at, result: row.result });

export class PostgresSessionRepository implements SessionRepository {
	constructor(private readonly db: SqlClient) {}
	async findByCode(code: string) { const result = await this.db.query<SessionRow>('SELECT id, code, status, game_version, state_version, game_state, created_at, updated_at, last_seen_at, result FROM playtest_sessions WHERE code = $1 AND status <> \'archived\'', [code]); return result.rows[0] ? session(result.rows[0]) : null; }
	async create(value: NewSession) { const result = await this.db.query<SessionRow>('INSERT INTO playtest_sessions (id, code, game_version, game_state) VALUES ($1,$2,$3,$4::jsonb) ON CONFLICT (code) WHERE status <> \'archived\' DO NOTHING RETURNING id, code, status, game_version, state_version, game_state, created_at, updated_at, last_seen_at, result', [value.id, value.code, value.gameVersion, JSON.stringify(value.gameState)]); return result.rows[0] ? session(result.rows[0]) : null; }
	async save(code: string, expectedVersion: number, gameState: GameState, status: PlaytestSession['status'], resultValue: string | null): Promise<SaveResult | null> {
		const result = await this.db.query<SessionRow>('UPDATE playtest_sessions SET game_state=$2::jsonb, state_version=state_version+1, status=$3, result=$4, updated_at=now(), last_seen_at=now(), finished_at=CASE WHEN $3=\'finished\' THEN COALESCE(finished_at,now()) ELSE finished_at END WHERE code=$1 AND status <> \'archived\' RETURNING id, code, status, game_version, state_version, game_state, created_at, updated_at, last_seen_at, result', [code, JSON.stringify(gameState), status, resultValue]);
		if (!result.rows[0]) return null;
		const saved = session(result.rows[0]); return { session: saved, conflict: saved.stateVersion !== expectedVersion + 1 };
	}
}
export class PostgresTelemetryRepository implements TelemetryRepository { constructor(private readonly db: SqlClient) {} async insert(value: TelemetryEvent) { await this.db.query('INSERT INTO playtest_events (session_id, turn, event_type, payload, game_version) VALUES ($1,$2,$3,$4::jsonb,$5)', [value.sessionId, value.turn, value.eventType, JSON.stringify(value.payload), value.gameVersion]); } }
export class PostgresFeedbackRepository implements FeedbackRepository {
	constructor(private readonly db: SqlClient) {}
	async insert(value: NewFeedback) { const result = await this.db.query<{ created_at: Date }>('INSERT INTO playtest_feedback (id,session_id,category,message,turn,view,game_version,context,mail_status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9) RETURNING created_at', [value.id,value.sessionId,value.category,value.message,value.turn,value.view,value.gameVersion,JSON.stringify(value.context),value.mailStatus]); return { ...value, createdAt: result.rows[0].created_at, mailError: null } as StoredFeedback; }
	async updateMail(id: string, status: 'sent'|'failed', error?: string) { await this.db.query('UPDATE playtest_feedback SET mail_status=$2, mail_error=$3 WHERE id=$1', [id,status,error?.slice(0,500) ?? null]); }
}
