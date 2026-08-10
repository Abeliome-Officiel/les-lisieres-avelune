import assert from 'node:assert/strict';
import test from 'node:test';

import { buildRealDashboardSnapshot, daysSince } from '../../src/lib/real-dashboard/aggregate.js';
import { PUBLIC_REAL_DASHBOARD_SEED } from '../../src/lib/real-dashboard/reference.js';

test('Tableau réel : une date absente reste inconnue', () => {
	assert.equal(daysSince(null, new Date('2026-08-11T00:00:00+02:00')), null);
});

test('Tableau réel : les coûts connus additionnent matériel, énergie, service IA et autres coûts', () => {
	const seed = structuredClone(PUBLIC_REAL_DASHBOARD_SEED);
	seed.labElectricityCostEur.value = 12.5;
	seed.sharedServerElectricityCostEur.value = 3.5;
	seed.otherCostEur.value = 14;
	seed.supportGrossEur.value = 50;
	seed.supportFeesEur.value = 2;

	const snapshot = buildRealDashboardSnapshot(seed, new Date('2026-08-11T00:00:00+02:00'));

	assert.equal(snapshot.knownCostEur, 322.77);
	assert.equal(snapshot.netSupportEur, 48);
	assert.equal(snapshot.knownSelfFundedEur, 274.77);
	assert.equal(snapshot.coverageRatio, 48 / 322.77);
});

test('Tableau réel : le coût IA attribué est inclus, pas la facture brute entière', () => {
	const snapshot = buildRealDashboardSnapshot(
		PUBLIC_REAL_DASHBOARD_SEED,
		new Date('2026-08-11T00:00:00+02:00')
	);

	assert.equal(PUBLIC_REAL_DASHBOARD_SEED.aiSubscriptionChargeEur.value, 23);
	assert.equal(PUBLIC_REAL_DASHBOARD_SEED.aiSubscriptionAllocationPct.value, 99);
	assert.equal(PUBLIC_REAL_DASHBOARD_SEED.aiSubscriptionAttributedCostEur.value, 22.77);
	assert.equal(snapshot.knownCostEur, 292.77);
	assert.equal(snapshot.netSupportEur, 0);
	assert.equal(snapshot.knownSelfFundedEur, 292.77);
});
