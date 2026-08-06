import type { Proto0SessionConfiguration } from '../domain/session.js';

export const REFERENCE_SESSION_CONFIGURATION: Proto0SessionConfiguration = {
	schema: 'avelune.proto0.session',
	schemaVersion: 1,
	testerCode: 'IRFI',
	seed: 20260804,
	turns: 10,
	waves: 1,
	internalPathPositions: 8,
	humanControlledCorcites: 1,
	simulatedCorcites: 4,
	wave: {
		nominal: {
			pressure: 50,
			structure: 60,
			charge: 20,
			capturableMatter: 16
		},
		variation: {
			minimumPercent: -2,
			maximumPercent: 2
		},
		forecast: {
			tMinus3Percent: 10,
			tMinus2Percent: 6,
			tMinus1Percent: 3
		}
	}
};
