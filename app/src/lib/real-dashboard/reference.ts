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
	aiSubscriptionChargeEur: {
		value: 23,
		status: 'measured',
		sourceId: 'chatgpt_plus_billing_2026_07_24',
		sourceEnvironment: 'project',
		note: 'Paiement ChatGPT Plus réellement effectué le 24/07/2026. Les paiements antérieurs visibles ne sont pas imputés tant que la date zéro d’Avelune n’est pas fixée.'
	},
	aiSubscriptionAllocationPct: {
		value: 99,
		status: 'estimated',
		sourceId: 'manual_ai_usage_allocation',
		sourceEnvironment: 'project',
		note: 'Attribution déclarée de l’usage actuel de ChatGPT Plus à Avelune. Ce coefficient peut évoluer pour les périodes futures.'
	},
	aiSubscriptionAttributedCostEur: {
		value: 22.77,
		status: 'calculated',
		sourceId: 'ai_cost_allocation_2026_07_24',
		sourceEnvironment: 'project',
		note: '23,00 EUR × 99 %. La facture est réelle ; le coefficient d’attribution reste une estimation déclarée.'
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
	playtestSessionsCreated: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_playtest_sessions',
		sourceEnvironment: 'proto',
		note: 'Nombre total de lignes de playtest_sessions. À lire directement dans PostgreSQL.'
	},
	playtestSessionsActive: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_playtest_sessions',
		sourceEnvironment: 'proto',
		note: "Nombre de lignes de playtest_sessions dont status = 'active'."
	},
	lifeHours: {
		value: null,
		status: 'calculated',
		sourceId: 'proto_public_metrics',
		sourceEnvironment: 'proto',
		note: 'Définition exacte du temps de vie cumulé à fixer avant connexion.'
	}
};
