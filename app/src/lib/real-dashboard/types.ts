export type RealDataStatus = 'measured' | 'calculated' | 'estimated' | 'symbolic';

export type RealMetricFamily = 'time' | 'cost' | 'energy' | 'carbon' | 'funding' | 'world';

export type RealSourceEnvironment = 'project' | 'proto' | 'production';

export interface QualifiedValue<T> {
	value: T | null;
	status: RealDataStatus;
	sourceId: string;
	sourceEnvironment?: RealSourceEnvironment;
	note?: string;
}

export interface CarbonFactorReference {
	valueGCo2ePerKwh: number | null;
	sourceId: string;
	version?: string;
	validFrom?: string;
	perimeter: string;
	note?: string;
}

export interface RealDashboardSeed {
	projectBirthDate: QualifiedValue<string>;
	humanHours: QualifiedValue<number>;
	hardwareCostEur: QualifiedValue<number>;
	labElectricityKwh: QualifiedValue<number>;
	labElectricityCostEur: QualifiedValue<number>;
	sharedServerAllocationPct: QualifiedValue<number>;
	sharedServerElectricityKwh: QualifiedValue<number>;
	sharedServerElectricityCostEur: QualifiedValue<number>;
	aiSubscriptionChargeEur: QualifiedValue<number>;
	aiSubscriptionAllocationPct: QualifiedValue<number>;
	aiSubscriptionAttributedCostEur: QualifiedValue<number>;
	otherCostEur: QualifiedValue<number>;
	hardwareEmbodiedCarbonKgCo2e: QualifiedValue<number>;
	aiServiceCarbonKgCo2e: QualifiedValue<number>;
	otherCarbonKgCo2e: QualifiedValue<number>;
	electricityCarbonFactor: CarbonFactorReference;
	supportGrossEur: QualifiedValue<number>;
	supportFeesEur: QualifiedValue<number>;
	worldCount: QualifiedValue<number>;
	playtestSessionsCreated: QualifiedValue<number>;
	playtestSessionsActive: QualifiedValue<number>;
	lifeHours: QualifiedValue<number>;
}

export interface RealDashboardSnapshot {
	daysAlive: number | null;
	knownCostEur: number;
	netSupportEur: number;
	knownSelfFundedEur: number;
	coverageRatio: number | null;
	labOperationalCarbonKgCo2e: number | null;
	sharedServerOperationalCarbonKgCo2e: number | null;
	knownOperationalCarbonKgCo2e: number | null;
	knownEmbodiedCarbonKgCo2e: number | null;
	knownCarbonKgCo2e: number | null;
	carbonIsComplete: boolean;
	unquantifiedCarbonSources: string[];
}

export interface RealEvent {
	id: string;
	timestamp: string;
	family: RealMetricFamily;
	metric: string;
	value: number;
	unit: string;
	status: RealDataStatus;
	sourceId: string;
	sourceEnvironment?: RealSourceEnvironment;
	scope: string;
	note?: string;
}
