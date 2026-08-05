import type {
	ResourceCosts
} from '../domain/turn.js';

export type Proto0TdPreparationId =
	'attenuation-n1';

export interface Proto0TdPreparationReference {
	id: Proto0TdPreparationId;
	family: 'attenuation';
	label: string;
	resourceCosts: ResourceCosts;
}

export const TD_PREPARATION_LAB_REFERENCE:
	Proto0TdPreparationReference = {
		id: 'attenuation-n1',
		family: 'attenuation',
		label:
			'Préparer une tour Atténuation N1',
	/*
	 * Valeurs de laboratoire PROTO-0.
	 *
	 * Elles existent uniquement pour vérifier qu'une
	 * préparation TD dépend réellement de la chaîne TF,
	 * notamment de R4 produit par la fabrication.
	 */
	resourceCosts: {
		R3: 2,
		R4: 1
	}
};
