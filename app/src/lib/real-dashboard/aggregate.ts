import type { RealDashboardSeed, RealDashboardSnapshot } from './types.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysSince(isoDate: string | null, now: Date = new Date()): number | null {
	if (!isoDate) return null;

	const start = new Date(isoDate);
	if (Number.isNaN(start.getTime())) return null;

	const elapsed = now.getTime() - start.getTime();
	return Math.max(0, Math.floor(elapsed / DAY_MS));
}

function known(value: number | null): number {
	return value ?? 0;
}

export function buildRealDashboardSnapshot(
	seed: RealDashboardSeed,
	now: Date = new Date()
): RealDashboardSnapshot {
	const knownCostEur =
		known(seed.hardwareCostEur.value) +
		known(seed.labElectricityCostEur.value) +
		known(seed.sharedServerElectricityCostEur.value) +
		known(seed.aiSubscriptionAttributedCostEur.value) +
		known(seed.otherCostEur.value);

	const netSupportEur = Math.max(
		0,
		known(seed.supportGrossEur.value) - known(seed.supportFeesEur.value)
	);

	const knownSelfFundedEur = Math.max(0, knownCostEur - netSupportEur);
	const coverageRatio = knownCostEur > 0 ? Math.min(1, netSupportEur / knownCostEur) : null;

	return {
		daysAlive: daysSince(seed.projectBirthDate.value, now),
		knownCostEur,
		netSupportEur,
		knownSelfFundedEur,
		coverageRatio
	};
}
