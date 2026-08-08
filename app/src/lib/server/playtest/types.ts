import type { GameState } from '../../proto02/game.js';

export type SessionStatus = 'active' | 'finished' | 'archived';
export interface PlaytestSession { id: string; code: string; status: SessionStatus; gameVersion: string; stateVersion: number; gameState: GameState; createdAt: Date; updatedAt: Date; lastSeenAt: Date; result: string | null }
export interface NewSession { id: string; code: string; gameVersion: string; gameState: GameState }
export interface SaveResult { session: PlaytestSession; conflict: boolean }
export interface TelemetryEvent { sessionId: string; turn: number; eventType: string; payload: Record<string, unknown>; gameVersion: string }
export const FEEDBACK_CATEGORIES = ['bug', 'interface', 'idea', 'rule_disagreement', 'balance', 'optimization', 'proposal', 'other'] as const;
export type FeedbackCategory = typeof FEEDBACK_CATEGORIES[number];
export type InitialFeedbackMailStatus = 'not_requested' | 'pending';
export type FeedbackMailStatus = InitialFeedbackMailStatus | 'sent' | 'failed';
interface FeedbackData { id: string; sessionId: string | null; category: FeedbackCategory; message: string; turn: number; view: string; gameVersion: string; context: Record<string, unknown> }
export interface NewFeedback extends FeedbackData { mailStatus: InitialFeedbackMailStatus }
export interface StoredFeedback extends FeedbackData { createdAt: Date; mailStatus: FeedbackMailStatus; mailError: string | null }

export interface SessionRepository {
	findByCode(code: string): Promise<PlaytestSession | null>;
	create(value: NewSession): Promise<PlaytestSession | null>;
	save(code: string, expectedVersion: number, gameState: GameState, status: SessionStatus, result: string | null): Promise<SaveResult | null>;
}
export interface TelemetryRepository { insert(event: TelemetryEvent): Promise<void> }
export interface FeedbackRepository { insert(value: NewFeedback): Promise<StoredFeedback>; updateMail(id: string, status: 'sent' | 'failed', error?: string): Promise<void> }
export interface FeedbackMailer { configured: boolean; send(feedback: StoredFeedback, publicCode: string | null): Promise<void> }
