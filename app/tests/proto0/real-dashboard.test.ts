import assert from 'node:assert/strict';
import test from 'node:test';

import { buildRealDashboardSnapshot, daysSince } from '../../src/lib/real-dashboard/aggregate.js';
import { PUBLIC_REAL_DASHBOARD_SEED } from '../../src/lib/real-dashboard/reference.js';

test('Tableau réel : une date absente reste inconnue', () => {
	assert.equal(daysSince(null, new Date('2026-08-11T00:00:00+02:00')), null);
});

test('Tableau réel : les coûts connus additionnent matériel, lab, serveur partagé et autres coûts', () => {
	const seed = structuredClone(PUBLIC_REAL_DASHBOARD_SEED);
	seed.labElectricityCostEur.value = 12.5;
	seed.sharedServerElectricityCostEur.value = 3.5;
	seed.otherCostEur.value = 14;
	seed.supportGrossEur.value = 50;
	seed.supportFeesEur.value = 2;

	const snapshot = buildRealDashboardSnapshot(seed, new Date('2026-08-11T00:00:00+02:00'));

	assert.equal(snapshot.knownCostEur, 300);
	assert.equal(snapshot.netSupportEur, 48);
	assert.equal(snapshot.knownSelfFundedEur, 252);
	assert.equal(snapshot.coverageRatio, 0.16);
});

test('Tableau réel : une valeur inconnue ne devient pas une fausse dépense', () => {
	const snapshot = buildRealDashboardSnapshot(
		PUBLIC_REAL_DASHBOARD_SEED,
		new Date('2026-08-11T00:00:00+02:00')
	);

	assert.equal(snapshot.knownCostEur, 270);
	assert.equal(snapshot.netSupportEur, 0);
	assert.equal(snapshot.knownSelfFundedEur, 270);
});
