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

function sumKnown(values: Array<number | null>): number | null {
	const defined = values.filter((value): value is number => value !== null);
	if (defined.length === 0) return null;
	return defined.reduce((sum, value) => sum + value, 0);
}

export function carbonKgFromEnergy(
	energyKwh: number | null,
	factorGCo2ePerKwh: number | null
): number | null {
	if (energyKwh === null || factorGCo2ePerKwh === null) return null;
	if (energyKwh < 0 || factorGCo2ePerKwh < 0) return null;
	return (energyKwh * factorGCo2ePerKwh) / 1000;
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

	const factor = seed.electricityCarbonFactor.valueGCo2ePerKwh;
	const labOperationalCarbonKgCo2e = carbonKgFromEnergy(seed.labElectricityKwh.value, factor);
	const sharedServerOperationalCarbonKgCo2e = carbonKgFromEnergy(
		seed.sharedServerElectricityKwh.value,
		factor
	);

	const knownOperationalCarbonKgCo2e = sumKnown([
		labOperationalCarbonKgCo2e,
		sharedServerOperationalCarbonKgCo2e,
		seed.aiServiceCarbonKgCo2e.value,
		seed.otherCarbonKgCo2e.value
	]);
	const knownEmbodiedCarbonKgCo2e = sumKnown([seed.hardwareEmbodiedCarbonKgCo2e.value]);
	const knownCarbonKgCo2e = sumKnown([
		knownEmbodiedCarbonKgCo2e,
		knownOperationalCarbonKgCo2e
	]);

	const unquantifiedCarbonSources: string[] = [];
	if (seed.hardwareEmbodiedCarbonKgCo2e.value === null) unquantifiedCarbonSources.push('matériel');
	if (seed.labElectricityKwh.value === null || factor === null) unquantifiedCarbonSources.push('électricité du lab');
	if (seed.sharedServerElectricityKwh.value === null || factor === null) unquantifiedCarbonSources.push('serveur partagé');
	if (seed.aiServiceCarbonKgCo2e.value === null) unquantifiedCarbonSources.push('IA / services numériques');

	return {
		daysAlive: daysSince(seed.projectBirthDate.value, now),
		knownCostEur,
		netSupportEur,
		knownSelfFundedEur,
		coverageRatio,
		labOperationalCarbonKgCo2e,
		sharedServerOperationalCarbonKgCo2e,
		knownOperationalCarbonKgCo2e,
		knownEmbodiedCarbonKgCo2e,
		knownCarbonKgCo2e,
		carbonIsComplete: unquantifiedCarbonSources.length === 0,
		unquantifiedCarbonSources
	};
}
