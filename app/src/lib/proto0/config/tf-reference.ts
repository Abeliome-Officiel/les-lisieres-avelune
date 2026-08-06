import type { ResourceAmounts } from '../domain/resources.js';
import type { StructureState } from '../domain/corcite.js';

export const TF_LAB_REFERENCE = {
	initialStocks: {
		R1: 4,
		R2: 4,
		R3: 4,
		R4: 1
	} satisfies ResourceAmounts,

	storageUnitCapacityN1: 12,

	capacities: {
		energyNormal: 8,
		energyReserve: 6,
		maintenance: 12,
		work: 8,
		space: 30
	},

	initialStructures: [
		{
			id: 'structure-extractor-a-1',
			kind: 'extractor-a-n1',
			name: 'Extracteur A N1',
			status: 'active',
			usage: {
				energy: 1,
				maintenance: 1,
				work: 1,
				space: 2
			}
		},
		{
			id: 'structure-extractor-b-1',
			kind: 'extractor-b-n1',
			name: 'Extracteur B N1',
			status: 'active',
			usage: {
				energy: 1,
				maintenance: 1,
				work: 1,
				space: 2
			}
		},
		{
			id: 'structure-transformer-1',
			kind: 'transformer-n1',
			name: 'Transformateur N1',
			status: 'active',
			usage: {
				energy: 2,
				maintenance: 1,
				work: 1,
				space: 3
			}
		},
		{
			id: 'structure-fabricator-1',
			kind: 'fabricator-n1',
			name: 'Fabricateur N1',
			status: 'active',
			usage: {
				energy: 2,
				maintenance: 1,
				work: 1,
				space: 3
			}
		},
		{
			id: 'structure-storage-1',
			kind: 'storage-n1',
			name: 'Stockage N1 — A',
			status: 'active',
			usage: {
				energy: 0,
				maintenance: 1,
				work: 0,
				space: 2
			}
		},
		{
			id: 'structure-storage-2',
			kind: 'storage-n1',
			name: 'Stockage N1 — B',
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
