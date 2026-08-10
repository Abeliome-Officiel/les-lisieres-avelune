import type { RealDashboardSeed } from './types.js';

export const PUBLIC_REAL_DASHBOARD_SEED: RealDashboardSeed = {
	projectBirthDate: {
		value: null,
		status: 'estimated',
		sourceId: 'project_history',
		sourceEnvironment: 'project',
		note: 'La date zéro officielle doit être fixée explicitement.'
	},
	humanHours: {
		value: null,
		status: 'measured',
		sourceId: 'manual_human_time',
		sourceEnvironment: 'project',
		note: 'Compteur à connecter.'
	},
	hardwareCostEur: {
		value: 270,
		status: 'estimated',
		sourceId: 'manual_hardware_cost',
		sourceEnvironment: 'project',
		note: 'Estimation déclarée du coût machine/laboratoire Avelune.'
	},
	labElectricityKwh: {
		value: null,
		status: 'measured',
		sourceId: 'lab_power_meter_01',
		sourceEnvironment: 'project',
		note: 'À connecter à la prise située sur l’alimentation du lab après vérification du modèle et du protocole officiel.'
	},
	labElectricityCostEur: {
		value: null,
		status: 'calculated',
		sourceId: 'lab_energy_aggregate',
		sourceEnvironment: 'project'
	},
	sharedServerAllocationPct: {
		value: null,
		status: 'estimated',
		sourceId: 'shared_server_allocation',
		sourceEnvironment: 'project',
		note: 'Quote-part Avelune du serveur partagé à définir avec une méthode documentée.'
	},
	sharedServerElectricityCostEur: {
		value: null,
		status: 'estimated',
		sourceId: 'shared_server_allocation',
		sourceEnvironment: 'project',
		note: 'Le serveur n’est pas dédié à Avelune ; seul un coût électrique proportionnel sera imputé.'
	},
	otherCostEur: {
		value: 0,
		status: 'measured',
		sourceId: 'manual_other_cost',
		sourceEnvironment: 'project'
	},
	supportGrossEur: {
		value: 0,
		status: 'measured',
		sourceId: 'funding_aggregate',
		sourceEnvironment: 'project'
	},
	supportFeesEur: {
		value: 0,
		status: 'calculated',
		sourceId: 'funding_aggregate',
		sourceEnvironment: 'project'
	},
	worldCount: {
		value: 1,
		status: 'symbolic',
		sourceId: 'world_public_metrics',
		sourceEnvironment: 'project',
		note: 'Les environnements techniques ne sont pas des mondes.'
	},
	players: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_public_metrics',
		sourceEnvironment: 'proto',
		note: 'À connecter aux métriques agrégées du ou des PROTO avant la production.'
	},
	corcitesCreated: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_public_metrics',
		sourceEnvironment: 'proto',
		note: 'À connecter aux métriques agrégées du ou des PROTO avant la production.'
	},
	corcitesActive: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_public_metrics',
		sourceEnvironment: 'proto',
		note: 'À connecter aux métriques agrégées du ou des PROTO avant la production.'
	},
	lifeHours: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_public_metrics',
		sourceEnvironment: 'proto',
		note: 'Définition exacte du temps de vie cumulé à fixer avant connexion.'
	}
};
