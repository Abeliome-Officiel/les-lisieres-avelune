export const TESTER_CODES = ['IRFI', 'AUBE', 'BRUM', 'ORBE', 'SILE'] as const;

export type TesterCode = (typeof TESTER_CODES)[number];

export type RunId = string;
export type CorciteId = string;
export type SessionId = string;

/**
 * Graine numérique 32 bits non signée.
 *
 * La valeur est stockée avec la partie afin qu'une même configuration
 * puisse être rejouée exactement.
 */
export type Seed = number;
