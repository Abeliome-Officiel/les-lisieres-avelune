import assert from 'node:assert/strict';
import test from 'node:test';
import { createGame } from '../../src/lib/proto02/game.js';
import type { SqlClient } from '../../src/lib/server/playtest/db.js';
import { MemorySessionRepository, MemoryTelemetryRepository } from '../../src/lib/server/playtest/memory-repositories.js';
import { PostgresSessionRepository } from '../../src/lib/server/playtest/postgres-repositories.js';
import { SessionService } from '../../src/lib/server/playtest/session-service.js';
import { cleanFeedbackMessage, validCode, validCompactContext, validStatePayload, validStateVersion, validTurn } from '../../src/lib/server/playtest/validation.js';

test('une session possède un identifiant interne distinct du code public et se reprend', async () => {
	const sessions=new MemorySessionRepository(), telemetry=new MemoryTelemetryRepository();
	const service=new SessionService(sessions,telemetry,()=> '4827');
	const created=await service.create();
	assert.equal(created.code,'4827'); assert.notEqual(created.id,created.code); assert.equal(created.stateVersion,1);
	const resumed=await service.resume('4827'); assert.equal(resumed?.id,created.id); assert.equal(telemetry.events.at(-1)?.eventType,'session_resumed');
});

test('une collision de code choisit un autre code sans limiter les sessions', async () => {
	const sessions=new MemorySessionRepository(), telemetry=new MemoryTelemetryRepository(); let index=0; const codes=['1111','1111','2222'];
	const service=new SessionService(sessions,telemetry,()=>codes[index++] ?? '3333');
	assert.equal((await service.create()).code,'1111'); assert.equal((await service.create()).code,'2222'); assert.equal(index,3); assert.equal(sessions.sessions.size,2);
});

test('le repository PostgreSQL cible explicitement l’unicité des sessions non archivées', async () => {
	const queries: Array<{ text: string; values?: unknown[] }> = [];
	const db: SqlClient = {
		async query<Row extends Record<string, unknown>>(text: string, values?: unknown[]) {
			queries.push({ text, values });
			return { rows: [] as Row[], rowCount: 0 };
		}
	};
	const repository = new PostgresSessionRepository(db);
	const created = await repository.create({ id: '00000000-0000-4000-8000-000000000001', code: '1111', gameVersion: 'test', gameState: createGame() });

	assert.equal(created, null, 'DO NOTHING sans RETURNING simule une collision de code');
	assert.ok(queries[0].text.includes("ON CONFLICT (code) WHERE status <> 'archived' DO NOTHING"));
	assert.deepEqual(queries[0].values?.slice(0, 3), ['00000000-0000-4000-8000-000000000001', '1111', 'test']);
});

test('la sauvegarde incrémente la version et signale un conflit sans perdre le nouvel état', async () => {
	const sessions=new MemorySessionRepository(), telemetry=new MemoryTelemetryRepository(); const service=new SessionService(sessions,telemetry,()=> '1234'); await service.create();
	const state=createGame(); state.turn=3; const saved=await service.save('1234',1,state); assert.equal(saved?.session.stateVersion,2); assert.equal(saved?.conflict,false);
	state.turn=4; const conflict=await service.save('1234',1,state); assert.equal(conflict?.conflict,true); assert.equal(conflict?.session.gameState.turn,4); assert.equal(telemetry.events.at(-1)?.eventType,'save_conflict');
});

test('la validation API refuse codes, états et textes invalides', () => {
	assert.equal(validCode('0000'),true); assert.equal(validCode('123'),false); assert.equal(validCode('12a4'),false);
	assert.equal(validTurn(-1),false); assert.equal(validTurn(0),true);
	assert.equal(validStateVersion(0),false); assert.equal(validStateVersion(-1),false); assert.equal(validStateVersion(1.5),false); assert.equal(validStateVersion('1'),false); assert.equal(validStateVersion(1),true);
	assert.equal(validStatePayload({value:'x'.repeat(300_000)}),false); assert.equal(validStatePayload(createGame()),true);
	assert.equal(cleanFeedbackMessage('   '),null); assert.equal(cleanFeedbackMessage('x'.repeat(4001)),null); assert.equal(cleanFeedbackMessage(' utile '),'utile');
	assert.equal(validCompactContext({value:'x'.repeat(16_000)}),false); assert.equal(validCompactContext({viewport:{width:390,height:844}}),true);
});
