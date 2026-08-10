export type RealDataStatus = 'measured' | 'calculated' | 'estimated' | 'symbolic';

export type RealMetricFamily = 'time' | 'cost' | 'energy' | 'funding' | 'world';

export type RealSourceEnvironment = 'project' | 'proto' | 'production';

export interface QualifiedValue<T> {
	value: T | null;
	status: RealDataStatus;
	sourceId: string;
	sourceEnvironment?: RealSourceEnvironment;
	note?: string;
}

export interface RealDashboardSeed {
	projectBirthDate: QualifiedValue<string>;
	humanHours: QualifiedValue<number>;
	hardwareCostEur: QualifiedValue<number>;
	labElectricityKwh: QualifiedValue<number>;
	labElectricityCostEur: QualifiedValue<number>;
	sharedServerAllocationPct: QualifiedValue<number>;
	sharedServerElectricityCostEur: QualifiedValue<number>;
	otherCostEur: QualifiedValue<number>;
	supportGrossEur: QualifiedValue<number>;
	supportFeesEur: QualifiedValue<number>;
	worldCount: QualifiedValue<number>;
	players: QualifiedValue<number>;
	corcitesCreated: QualifiedValue<number>;
	corcitesActive: QualifiedValue<number>;
	lifeHours: QualifiedValue<number>;
}

export interface RealDashboardSnapshot {
	daysAlive: number | null;
	knownCostEur: number;
	netSupportEur: number;
	knownSelfFundedEur: number;
	coverageRatio: number | null;
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
