import type {
	ResourceAmounts
} from '../domain/resources.js';
import type {
	StructureState
} from '../domain/corcite.js';

/**
 * Valeurs de départ PROVISOIRES du prototype jouable.
 *
 * Elles servent de première base d'équilibrage.
 * Elles ne constituent pas les valeurs définitives du jeu.
 */
export const PLAYABLE_START_REFERENCE = {
	resourceLabels: {
		R1: 'Ressource brute — extraction principale',
		R2: 'Ressource brute — extraction complémentaire',
		R3: 'Matériau transformé',
		R4: 'Composant fabriqué'
	},

	initialStocks: {
		R1: 4,
		R2: 4,
		R3: 2,
		R4: 0
	} satisfies ResourceAmounts,

	baseStorageCapacity: 12,

	population: {
		total: 4,
		workPerPopulation: 1
	},

	capacities: {
		energyNormal: 4,
		energyReserve: 3,
		maintenance: 5,
		space: 16
	},

	initialStructures: [
		{
			id: 'structure-corcite-core-1',
			kind: 'corcite-core-n1',
			name: 'Noyau du Corcite',
			status: 'active',
			usage: {
				energy: 0,
				maintenance: 1,
				work: 0,
				space: 2
			}
		},
		{
			id: 'structure-storage-base-1',
			kind: 'storage-n1',
			name: 'Stockage de base',
			status: 'active',
			usage: {
				energy: 0,
				maintenance: 1,
				work: 0,
				space: 2
			}
		}
	] satisfies StructureState[]
} as const;
