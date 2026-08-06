/**
 * Paramètres PROVISOIRES du prototype miniature.
 *
 * Ils servent à observer la dynamique du Corcite.
 * Ils ne constituent pas l'équilibrage définitif d'Avelune.
 */
export const PLAYABLE_SUSTAINABILITY_REFERENCE = {
	energy: {
		reserveRecoveryPerStableTurn: 1
	},

	maintenance: {
		degradedAfterConsecutiveDeficitTurns: 2,
		criticalAfterConsecutiveDeficitTurns: 4,
		criticalDebt: 6
	}
} as const;
