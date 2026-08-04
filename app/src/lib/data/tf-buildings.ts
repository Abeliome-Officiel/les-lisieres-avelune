import type { GameElement } from '$lib/domain/types';
import { createElement, quantity } from './factory';

type Family = {
  id: 'a' | 'b' | 'c';
  label: 'A' | 'B' | 'C';
  partner: 'a' | 'b' | 'c';
};

const families: Family[] = [
  { id: 'a', label: 'A', partner: 'b' },
  { id: 'b', label: 'B', partner: 'c' },
  { id: 'c', label: 'C', partner: 'a' }
];

export const tfBuildings: GameElement[] = [
  ...families.flatMap(({ id, label, partner }) => [
    createElement({
      id: `tf.building.extractor-${id}1`,
      displayName: `Extracteur ${label}1`,
      axis: 'tf',
      type: 'building',
      family: label,
      level: 1,
      function: `Produit le Matériau ${label}0.`,
      costs: [
        quantity('tf.resource.material-a0', 2),
        quantity('tf.resource.material-b0', 1)
      ],
      outputs: [quantity(`tf.resource.material-${id}0`, 3)],
      consequences: [
        {
          timing: 'end-turn',
          domain: 'stock',
          target: `tf.resource.material-${id}0`,
          metric: 'quantity',
          operation: 'add',
          value: 3,
          description: `Ajoute 3 unités de Matériau ${label}0.`
        }
      ],
      impactDomains: ['building', 'production', 'stock'],
      targets: ['corps-cité'],
      factors: [
        {
          id: 'production',
          value: 3,
          unit: 'flat',
          appliesTo: `tf.resource.material-${id}0`
        }
      ],
      formula: 'production = niveau × 3',
      duration: { unit: 'persistent', value: 1 },
      integrity: { enabled: true, maximum: 10 },
      tags: ['tf', 'batiment', 'extraction', `chaine-${id}`]
    }),

    createElement({
      id: `tf.building.transformer-${id}1`,
      displayName: `Transformateur ${label}1`,
      axis: 'tf',
      type: 'building',
      family: label,
      level: 1,
      function: `Transforme le Matériau ${label}0 en Produit ${label}1.`,
      costs: [
        quantity('tf.resource.material-a0', 2),
        quantity('tf.resource.material-c0', 1)
      ],
      inputs: [quantity(`tf.resource.material-${id}0`, 2)],
      outputs: [quantity(`tf.resource.product-${id}1`, 1)],
      impactDomains: ['building', 'production', 'stock'],
      targets: ['corps-cité'],
      formula: `2 Matériau ${label}0 → 1 Produit ${label}1`,
      duration: { unit: 'persistent', value: 1 },
      integrity: { enabled: true, maximum: 10 },
      interactions: [
        {
          elementId: `tf.resource.product-${id}1`,
          relation: 'produces',
          description: `Produit le Produit ${label}1.`
        }
      ],
      tags: ['tf', 'batiment', 'transformation', `chaine-${id}`]
    }),

    createElement({
      id: `tf.building.assembler-${id}2`,
      displayName: `Assembleur ${label}2`,
      axis: 'tf',
      type: 'building',
      family: label,
      level: 2,
      function: `Fabrique Avancé ${label}2.`,
      prerequisites: [`tf.building.transformer-${id}1`],
      costs: [
        quantity(`tf.resource.product-${id}1`, 2),
        quantity(`tf.resource.product-${partner}1`, 1)
      ],
      inputs: [
        quantity(`tf.resource.product-${id}1`, 2),
        quantity(`tf.resource.product-${partner}1`, 1)
      ],
      outputs: [quantity(`tf.resource.advanced-${id}2`, 1)],
      impactDomains: ['building', 'production', 'stock'],
      targets: ['corps-cité'],
      formula:
        `2 Produit ${label}1 + 1 produit complémentaire → 1 Avancé ${label}2`,
      duration: { unit: 'persistent', value: 1 },
      integrity: { enabled: true, maximum: 12 },
      interactions: [
        {
          elementId: `tf.resource.advanced-${id}2`,
          relation: 'produces',
          description: `Produit Avancé ${label}2.`
        }
      ],
      tags: ['tf', 'batiment', 'assemblage', `chaine-${id}`]
    })
  ]),

  createElement({
    id: 'tf.building.storage-1',
    displayName: 'Stockage 1',
    axis: 'tf',
    type: 'building',
    family: 'stockage',
    level: 1,
    function: 'Augmente la capacité totale du stock.',
    costs: [
      quantity('tf.resource.material-a0', 2),
      quantity('tf.resource.material-b0', 2)
    ],
    consequences: [
      {
        timing: 'immediate',
        domain: 'stock',
        target: 'corps-cité',
        metric: 'capacity',
        operation: 'add',
        value: 20,
        description: 'Augmente la capacité de stockage de 20.'
      }
    ],
    impactDomains: ['building', 'stock'],
    targets: ['corps-cité'],
    factors: [
      {
        id: 'capacity',
        value: 20,
        unit: 'flat',
        appliesTo: 'stock total'
      }
    ],
    formula: 'capacité totale += 20',
    duration: { unit: 'persistent', value: 1 },
    integrity: { enabled: true, maximum: 10 },
    tags: ['tf', 'batiment', 'stockage']
  })
];
