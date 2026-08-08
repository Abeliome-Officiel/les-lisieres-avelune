import nodemailer from 'nodemailer';
import type { FeedbackMailer, StoredFeedback } from './types.js';

export class SmtpFeedbackMailer implements FeedbackMailer {
	readonly configured = Boolean(process.env.AVELUNE_SMTP_HOST && process.env.AVELUNE_FEEDBACK_FROM && process.env.AVELUNE_FEEDBACK_TO);
	async send(feedback: StoredFeedback, publicCode: string | null) {
		if (!this.configured) return;
		const transport=nodemailer.createTransport({host:process.env.AVELUNE_SMTP_HOST,port:Number(process.env.AVELUNE_SMTP_PORT||587),secure:process.env.AVELUNE_SMTP_SECURE==='true',auth:process.env.AVELUNE_SMTP_USER?{user:process.env.AVELUNE_SMTP_USER,pass:process.env.AVELUNE_SMTP_PASSWORD}:undefined});
		await transport.sendMail({from:process.env.AVELUNE_FEEDBACK_FROM,to:process.env.AVELUNE_FEEDBACK_TO,subject:`[Avelune P02] ${feedback.category.toUpperCase()} — session ${publicCode??'inconnue'} — cycle ${feedback.turn}`,text:`Catégorie : ${feedback.category}\nSession : ${publicCode??'inconnue'}\nVersion : ${feedback.gameVersion}\nCycle : ${feedback.turn}\nVue : ${feedback.view}\n\n${feedback.message}\n\nContexte compact : ${JSON.stringify(feedback.context)}`});
	}
}
