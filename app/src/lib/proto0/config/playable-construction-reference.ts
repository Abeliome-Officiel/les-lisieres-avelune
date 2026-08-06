import type {
	ResourceCosts
} from '../domain/turn.js';
import type {
	StructureKind,
	StructureUsage
} from '../domain/corcite.js';

export type PlayableConstructionDefinitionId =
	| 'organic-extractor'
	| 'mineral-extractor'
	| 'primary-transformer'
	| 'component-workshop'
	| 'storage-extension'
	| 'energy-extension'
	| 'maintenance-unit';

export interface PlayableConstructionGrants {
	energyNormal?: number;
	maintenance?: number;
	storageCapacity?: number;
}

export interface PlayableConstructionDefinition {
	id: PlayableConstructionDefinitionId;
	label: string;
	description: string;
	structureKind: StructureKind;
	resourceCosts: ResourceCosts;
	usage: StructureUsage;
	grants: PlayableConstructionGrants;
}

/**
 * Petit catalogue de contenu destiné au prototype jouable.
 *
 * Les chiffres sont des paramètres initiaux d'équilibrage.
 * Ils ne constituent pas les coûts définitifs d'Avelune.
 */
export const PLAYABLE_CONSTRUCTION_CATALOG:
	readonly PlayableConstructionDefinition[] = [
	{
		id: 'organic-extractor',
		label: 'Extracteur organique',
		description:
			'Exploite la source de matière organique brute.',
		structureKind: 'extractor-a-n1',
		resourceCosts: {
			R1: 2,
			R2: 1
		},
		usage: {
			energy: 1,
			maintenance: 1,
			work: 1,
			space: 2
		},
		grants: {}
	},
	{
		id: 'mineral-extractor',
		label: 'Extracteur minéral',
		description:
			'Exploite la source de matière minérale brute.',
		structureKind: 'extractor-b-n1',
		resourceCosts: {
			R1: 1,
			R2: 2
		},
		usage: {
			energy: 1,
			maintenance: 1,
			work: 1,
			space: 2
		},
		grants: {}
	},
	{
		id: 'primary-transformer',
		label: 'Atelier de transformation',
		description:
			'Transforme les deux matières brutes en matériau transformé.',
		structureKind: 'transformer-n1',
		resourceCosts: {
			R1: 2,
			R2: 2,
			R3: 1
		},
		usage: {
			energy: 2,
			maintenance: 1,
			work: 1,
			space: 3
		},
		grants: {}
	},
	{
		id: 'component-workshop',
		label: 'Atelier de fabrication',
		description:
			'Fabrique des composants à partir du matériau transformé.',
		structureKind: 'fabricator-n1',
		resourceCosts: {
			R1: 1,
			R2: 1,
			R3: 2
		},
		usage: {
			energy: 2,
			maintenance: 1,
			work: 1,
			space: 3
		},
		grants: {}
	},
	{
		id: 'storage-extension',
		label: 'Stockage supplémentaire',
		description:
			'Ajoute une unité de stockage indépendante.',
		structureKind: 'storage-n1',
		resourceCosts: {
			R1: 2,
			R2: 1
		},
		usage: {
			energy: 0,
			maintenance: 1,
			work: 0,
			space: 2
		},
		grants: {
			storageCapacity: 12
		}
	},
	{
		id: 'energy-extension',
		label: 'Extension énergétique',
		description:
			'Augmente la capacité énergétique normale et sa réserve courte.',
		structureKind: 'energy-extension-n1',
		resourceCosts: {
			R1: 1,
			R2: 2,
			R3: 1
		},
		usage: {
			energy: 0,
			maintenance: 1,
			work: 1,
			space: 2
		},
		grants: {
			energyNormal: 4
		}
	},
	{
		id: 'maintenance-unit',
		label: "Unité d'entretien",
		description:
			"Augmente la capacité générale d'entretien du Corcite.",
		structureKind: 'maintenance-extension-n1',
		resourceCosts: {
			R1: 2,
			R2: 1,
			R3: 1
		},
		usage: {
			energy: 1,
			maintenance: 0,
			work: 1,
			space: 2
		},
		grants: {
			maintenance: 4
		}
	}
] as const;

export function getPlayableConstructionDefinition(
	id: PlayableConstructionDefinitionId
): PlayableConstructionDefinition {
	const definition =
		PLAYABLE_CONSTRUCTION_CATALOG.find(
			(candidate) => candidate.id === id
		);

	if (!definition) {
		throw new Error(
			`Construction jouable inconnue : ${id}.`
		);
	}

	return definition;
}
