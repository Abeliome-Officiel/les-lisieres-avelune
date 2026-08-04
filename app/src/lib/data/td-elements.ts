import type { GameElement } from '$lib/domain/types';
import { createElement, quantity } from './factory';

type WaveKey = 'impact' | 'corrosion' | 'interference';

type DefenseDefinition = {
  key: WaveKey;
  label: string;
  resourceId: string;
};

const defenseDefinitions: DefenseDefinition[] = [
  {
    key: 'impact',
    label: 'Impact',
    resourceId: 'tf.resource.product-a1'
  },
  {
    key: 'corrosion',
    label: 'Corrosion',
    resourceId: 'tf.resource.product-b1'
  },
  {
    key: 'interference',
    label: 'Interférence',
    resourceId: 'tf.resource.product-c1'
  }
];

export const tdDefenses: GameElement[] = [
  ...defenseDefinitions.map(({ key, label, resourceId }) =>
    createElement({
      id: `td.defense.${key}-1`,
      displayName: `Défense ${label} 1`,
      axis: 'td',
      type: 'defense',
      family: key,
      level: 1,
      function: `Défense spécialisée contre la Vague ${label} 1.`,
      costs: [
        quantity(resourceId, 2),
        quantity('tf.resource.material-a0', 1)
      ],
      consequences: [
        {
          timing: 'during-wave',
          domain: 'wave',
          target: `td.wave.${key}-1`,
          metric: 'power',
          operation: 'subtract',
          value: 8,
          description: `Absorbe jusqu’à 8 points contre une Vague ${label}.`
        }
      ],
      impactDomains: ['defense', 'wave', 'city'],
      targets: ['corps-cité', 'vague'],
      factors: [
        {
          id: 'specialized-absorption',
          value: 8,
          unit: 'points',
          appliesTo: `td.wave.${key}-1`
        },
        {
          id: 'other-absorption',
          value: 3,
          unit: 'points',
          appliesTo: 'autres vagues'
        }
      ],
      formula: 'absorption = 8 si type correspondant, sinon 3',
      duration: { unit: 'persistent', value: 1 },
      integrity: { enabled: true, maximum: 12 },
      interactions: [
        {
          elementId: `td.wave.${key}-1`,
          relation: 'opposes',
          description: `Spécialisation contre la Vague ${label} 1.`
        }
      ],
      tags: ['td', 'defense', 'specialisee', key]
    })
  ),

  createElement({
    id: 'td.defense.general-1',
    displayName: 'Défense Générale 1',
    axis: 'td',
    type: 'defense',
    family: 'general',
    level: 1,
    function: 'Absorption moyenne contre tous les types de vagues.',
    costs: [
      quantity('tf.resource.product-a1', 1),
      quantity('tf.resource.product-b1', 1),
      quantity('tf.resource.product-c1', 1)
    ],
    consequences: [
      {
        timing: 'during-wave',
        domain: 'wave',
        target: 'vague',
        metric: 'power',
        operation: 'subtract',
        value: 5,
        description: 'Absorbe jusqu’à 5 points de vague.'
      }
    ],
    impactDomains: ['defense', 'wave', 'city'],
    targets: ['corps-cité', 'vague'],
    factors: [
      {
        id: 'general-absorption',
        value: 5,
        unit: 'points',
        appliesTo: 'toutes les vagues'
      }
    ],
    formula: 'absorption = min(5, puissance entrante)',
    duration: { unit: 'persistent', value: 1 },
    integrity: { enabled: true, maximum: 14 },
    tags: ['td', 'defense', 'generale']
  })
];

export const tdWaves: GameElement[] = [
  createElement({
    id: 'td.wave.impact-1',
    displayName: 'Vague Impact 1',
    axis: 'td',
    type: 'wave',
    family: 'impact',
    level: 1,
    function: 'Teste les dégâts directs au corps-cité.',
    consequences: [
      {
        timing: 'during-wave',
        domain: 'city',
        target: 'corps-cité',
        metric: 'integrity',
        operation: 'damage',
        value: 1,
        description: 'Le résidu inflige des dégâts directs.'
      }
    ],
    impactDomains: ['wave', 'world', 'city', 'defense'],
    targets: ['corps-cité', 'monde'],
    factors: [
      {
        id: 'reference-power',
        value: 30,
        unit: 'points',
        appliesTo: 'trajectoire'
      }
    ],
    formula: 'résidu = puissance entrante − absorptions',
    duration: { unit: 'wave', value: 1 },
    stacking: { allowed: false, cap: 1 },
    tags: ['td', 'vague', 'impact']
  }),

  createElement({
    id: 'td.wave.corrosion-1',
    displayName: 'Vague Corrosion 1',
    axis: 'td',
    type: 'wave',
    family: 'corrosion',
    level: 1,
    function: 'Teste les dégâts persistants au terrain et aux bâtiments.',
    consequences: [
      {
        timing: 'after-wave',
        domain: 'terrain',
        target: 'terrain',
        metric: 'integrity',
        operation: 'damage',
        value: 1,
        description: 'Le résidu altère le terrain.'
      },
      {
        timing: 'after-wave',
        domain: 'building',
        target: 'bâtiments',
        metric: 'integrity',
        operation: 'damage',
        value: 1,
        description: 'Les bâtiments subissent une dégradation différée.'
      }
    ],
    impactDomains: ['wave', 'world', 'terrain', 'building', 'city'],
    targets: ['terrain', 'bâtiments', 'corps-cité'],
    factors: [
      {
        id: 'reference-power',
        value: 30,
        unit: 'points',
        appliesTo: 'trajectoire'
      }
    ],
    formula: 'résidu = puissance entrante − absorptions',
    duration: { unit: 'wave', value: 1 },
    stacking: { allowed: false, cap: 1 },
    tags: ['td', 'vague', 'corrosion']
  }),

  createElement({
    id: 'td.wave.interference-1',
    displayName: 'Vague Interférence 1',
    axis: 'td',
    type: 'wave',
    family: 'interference',
    level: 1,
    function: 'Teste la perturbation de la production et du RPG.',
    consequences: [
      {
        timing: 'next-turn',
        domain: 'production',
        target: 'production',
        metric: 'efficiency',
        operation: 'multiply',
        value: 0.75,
        description: 'La production suivante fonctionne à 75 %.'
      },
      {
        timing: 'next-turn',
        domain: 'character',
        target: 'personnage',
        metric: 'modifier',
        operation: 'subtract',
        value: 1,
        description: 'Une compétence reçoit un modificateur temporaire de −1.'
      }
    ],
    impactDomains: ['wave', 'world', 'production', 'character', 'city'],
    targets: ['production', 'personnage', 'corps-cité'],
    factors: [
      {
        id: 'reference-power',
        value: 30,
        unit: 'points',
        appliesTo: 'trajectoire'
      }
    ],
    formula: 'résidu = puissance entrante − absorptions',
    duration: { unit: 'wave', value: 1 },
    stacking: { allowed: false, cap: 1 },
    tags: ['td', 'vague', 'interference']
  })
];
