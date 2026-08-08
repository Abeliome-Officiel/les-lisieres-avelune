import { randomUUID } from 'node:crypto';
import { PLAYTEST_VERSION } from '../../playtest/version.js';
import type { FeedbackCategory, FeedbackMailer, FeedbackRepository, TelemetryRepository } from './types.js';

export interface FeedbackInput { sessionId: string | null; publicCode: string | null; category: FeedbackCategory; message: string; turn: number; view: string; context: Record<string, unknown> }
export class FeedbackService {
	constructor(private readonly feedback: FeedbackRepository, private readonly telemetry: TelemetryRepository, private readonly mailer: FeedbackMailer) {}
	async submit(input: FeedbackInput) {
		const stored = await this.feedback.insert({ id: randomUUID(), sessionId: input.sessionId, category: input.category, message: input.message, turn: input.turn, view: input.view, gameVersion: PLAYTEST_VERSION, context: input.context, mailStatus: this.mailer.configured ? 'pending' : 'not_requested' });
		if (input.sessionId) await this.telemetry.insert({ sessionId: input.sessionId, turn: input.turn, eventType: 'feedback_sent', payload: { category: input.category, feedbackId: stored.id }, gameVersion: PLAYTEST_VERSION });
		if (this.mailer.configured) {
			try { await this.mailer.send(stored,input.publicCode); await this.feedback.updateMail(stored.id,'sent'); }
			catch(error) { await this.feedback.updateMail(stored.id,'failed',error instanceof Error?error.message:'SMTP error'); }
		}
		return stored;
	}
}
