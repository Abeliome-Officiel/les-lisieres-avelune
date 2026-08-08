import { database } from './db.js';
import { PostgresFeedbackRepository, PostgresSessionRepository, PostgresTelemetryRepository } from './postgres-repositories.js';
import { SessionService } from './session-service.js';

export async function playtestRuntime() {
	const db = await database();
	const telemetry = new PostgresTelemetryRepository(db);
	return { db, sessions: new PostgresSessionRepository(db), telemetry, feedback: new PostgresFeedbackRepository(db) };
}
export async function sessionService() { const runtime = await playtestRuntime(); return new SessionService(runtime.sessions, runtime.telemetry); }
