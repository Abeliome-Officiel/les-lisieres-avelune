import type {
  ElementConsequence,
  ElementFactor,
  ElementInteraction,
  ElementQuantity,
  GameElement,
  GameAxis,
  ElementType,
  ImpactDomain
} from '$lib/domain/types';

type ElementDraft = {
  id: string;
  displayName: string;
  axis: GameAxis;
  type: ElementType;
  family: string;
  level: number;
  function: string;

  prerequisites?: string[];
  requirements?: string[];

  costs?: ElementQuantity[];
  inputs?: ElementQuantity[];
  outputs?: ElementQuantity[];

  consequences?: ElementConsequence[];
  impactDomains?: ImpactDomain[];
  targets?: string[];

  factors?: ElementFactor[];
  formula?: string;

  duration?: GameElement['duration'];
  triggerConditions?: string[];

  stacking?: GameElement['stacking'];
  integrity?: GameElement['integrity'];

  interactions?: ElementInteraction[];

  image?: string;
  icon?: string;
  altText?: string;

  status?: GameElement['test']['status'];
  balancingNotes?: string;

  tags?: string[];
};

export function quantity(
  elementId: string,
  amount: number
): ElementQuantity {
  return {
    elementId,
    amount
  };
}

export function createElement(draft: ElementDraft): GameElement {
  return {
    id: draft.id,
    displayName: draft.displayName,

    axis: draft.axis,
    type: draft.type,
    family: draft.family,
    level: draft.level,

    function: draft.function,
    prerequisites: draft.prerequisites ?? [],
    requirements: draft.requirements ?? [],

    costs: draft.costs ?? [],
    inputs: draft.inputs ?? [],
    outputs: draft.outputs ?? [],

    consequences: draft.consequences ?? [],
    impactDomains: draft.impactDomains ?? [],
    targets: draft.targets ?? [],

    factors: draft.factors ?? [],
    formula: draft.formula ?? '',

    duration: draft.duration ?? {
      unit: 'instant',
      value: 0
    },

    triggerConditions: draft.triggerConditions ?? [],

    stacking: draft.stacking ?? {
      allowed: true,
      cap: 99
    },

    integrity: draft.integrity ?? {
      enabled: false,
      maximum: 0
    },

    interactions: draft.interactions ?? [],

    media: {
      image: draft.image ?? '',
      icon: draft.icon ?? '',
      altText: draft.altText ?? draft.displayName
    },

    test: {
      status: draft.status ?? 'testable',
      introducedVersion: '0.9.0-dev.3',
      balancingNotes:
        draft.balancingNotes ??
        'Valeur provisoire à vérifier pendant les tests.'
    },

    tags: draft.tags ?? []
  };
}
