import type { GameElement } from '$lib/domain/types';
import { createElement, quantity } from './factory';

type FamilyDefinition = {
  id: 'a' | 'b' | 'c';
  label: 'A' | 'B' | 'C';
  advancedPartner: 'a' | 'b' | 'c';
};

const families: FamilyDefinition[] = [
  { id: 'a', label: 'A', advancedPartner: 'b' },
  { id: 'b', label: 'B', advancedPartner: 'c' },
  { id: 'c', label: 'C', advancedPartner: 'a' }
];

export const tfResources: GameElement[] = families.flatMap(
  ({ id, label, advancedPartner }) => {
    const materialId = `tf.resource.material-${id}0`;
    const productId = `tf.resource.product-${id}1`;
    const advancedId = `tf.resource.advanced-${id}2`;

    return [
      createElement({
        id: materialId,
        displayName: `Matériau ${label}0`,
        axis: 'tf',
        type: 'resource',
        family: label,
        level: 0,
        function: `Ressource de base de la chaîne ${label}.`,
        impactDomains: ['stock', 'production'],
        targets: ['corps-cité'],
        duration: { unit: 'persistent', value: 1 },
        stacking: { allowed: true, cap: 999 },
        tags: ['tf', 'ressource', 'base', `chaine-${id}`]
      }),

      createElement({
        id: productId,
        displayName: `Produit ${label}1`,
        axis: 'tf',
        type: 'resource',
        family: label,
        level: 1,
        function: `Premier produit transformé de la chaîne ${label}.`,
        prerequisites: [`tf.building.transformer-${id}1`],
        inputs: [quantity(materialId, 2)],
        impactDomains: ['stock', 'production'],
        targets: ['corps-cité'],
        formula: `2 Matériau ${label}0 → 1 Produit ${label}1`,
        duration: { unit: 'persistent', value: 1 },
        stacking: { allowed: true, cap: 999 },
        interactions: [
          {
            elementId: `tf.building.transformer-${id}1`,
            relation: 'produces',
            description: `Le Transformateur ${label}1 produit cette ressource.`
          }
        ],
        tags: ['tf', 'ressource', 'niveau-1', `chaine-${id}`]
      }),

      createElement({
        id: advancedId,
        displayName: `Avancé ${label}2`,
        axis: 'tf',
        type: 'resource',
        family: label,
        level: 2,
        function: `Produit avancé de la chaîne ${label}.`,
        prerequisites: [`tf.building.assembler-${id}2`],
        inputs: [
          quantity(productId, 2),
          quantity(`tf.resource.product-${advancedPartner}1`, 1)
        ],
        impactDomains: ['stock', 'production'],
        targets: ['corps-cité'],
        formula:
          `2 Produit ${label}1 + 1 produit complémentaire → 1 Avancé ${label}2`,
        duration: { unit: 'persistent', value: 1 },
        stacking: { allowed: true, cap: 999 },
        interactions: [
          {
            elementId: `tf.building.assembler-${id}2`,
            relation: 'produces',
            description: `L’Assembleur ${label}2 produit cette ressource.`
          }
        ],
        tags: ['tf', 'ressource', 'niveau-2', 'avance', `chaine-${id}`]
      })
    ];
  }
);
