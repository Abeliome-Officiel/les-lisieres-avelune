import assert from 'node:assert/strict';
import test from 'node:test';
import { FeedbackService } from '../../src/lib/server/playtest/feedback-service.js';
import { MemoryFeedbackRepository, MemoryTelemetryRepository } from '../../src/lib/server/playtest/memory-repositories.js';
import type { FeedbackMailer } from '../../src/lib/server/playtest/types.js';

const input={sessionId:'00000000-0000-4000-8000-000000000001',publicCode:'4827',category:'bug' as const,message:'Le bouton ne répond pas.',turn:4,view:'structure',context:{viewport:{width:390,height:844}}};

test('le feedback est inséré avant SMTP puis marqué envoyé', async () => {
	const repository=new MemoryFeedbackRepository(), telemetry=new MemoryTelemetryRepository(); let presentDuringMail=false;
	const mailer:FeedbackMailer={configured:true,async send(){presentDuringMail=repository.feedback.length===1;}};
	await new FeedbackService(repository,telemetry,mailer).submit(input);
	assert.equal(presentDuringMail,true); assert.equal(repository.feedback[0].mailStatus,'sent'); assert.equal(telemetry.events[0].eventType,'feedback_sent');
});

test('un échec SMTP ne détruit jamais le feedback stocké', async () => {
	const repository=new MemoryFeedbackRepository(), telemetry=new MemoryTelemetryRepository();
	const mailer:FeedbackMailer={configured:true,async send(){throw new Error('SMTP indisponible');}};
	const stored=await new FeedbackService(repository,telemetry,mailer).submit(input);
	assert.equal(repository.feedback.length,1); assert.equal(repository.feedback[0].id,stored.id); assert.equal(repository.feedback[0].mailStatus,'failed'); assert.match(repository.feedback[0].mailError??'',/SMTP/);
});

test('SMTP absent conserve le feedback sans tentative externe', async () => {
	const repository=new MemoryFeedbackRepository(), telemetry=new MemoryTelemetryRepository(); let called=false;
	const mailer:FeedbackMailer={configured:false,async send(){called=true;}};
	await new FeedbackService(repository,telemetry,mailer).submit(input);
	assert.equal(called,false); assert.equal(repository.feedback[0].mailStatus,'not_requested');
});
