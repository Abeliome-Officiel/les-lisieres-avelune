export type GameAxis = 'td' | 'tf' | 'rpg' | 'shared';

export type ElementType =
  | 'resource'
  | 'building'
  | 'production'
  | 'defense'
  | 'wave'
  | 'characteristic'
  | 'skill'
  | 'order'
  | 'status';

export type ImpactDomain =
  | 'terrain'
  | 'city'
  | 'world'
  | 'wave'
  | 'defense'
  | 'building'
  | 'production'
  | 'stock'
  | 'character';

export type ElementQuantity = {
  elementId: string;
  amount: number;
};

export type ElementFactor = {
  id: string;
  value: number;
  unit: 'flat' | 'ratio' | 'percent' | 'points' | 'turns';
  appliesTo: string;
};

export type ElementConsequence = {
  timing:
    | 'immediate'
    | 'end-turn'
    | 'next-turn'
    | 'during-wave'
    | 'after-wave'
    | 'persistent';
  domain: ImpactDomain;
  target: string;
  metric: string;
  operation:
    | 'add'
    | 'subtract'
    | 'multiply'
    | 'set'
    | 'reveal'
    | 'unlock'
    | 'damage'
    | 'repair';
  value: number | string | boolean;
  description: string;
};

export type ElementInteraction = {
  elementId: string;
  relation:
    | 'requires'
    | 'produces'
    | 'improves'
    | 'reduces'
    | 'opposes'
    | 'damages'
    | 'repairs'
    | 'reveals';
  description: string;
};

export type GameElement = {
  id: string;
  displayName: string;

  axis: GameAxis;
  type: ElementType;
  family: string;
  level: number;

  function: string;
  prerequisites: string[];
  requirements: string[];

  costs: ElementQuantity[];
  inputs: ElementQuantity[];
  outputs: ElementQuantity[];

  consequences: ElementConsequence[];
  impactDomains: ImpactDomain[];
  targets: string[];

  factors: ElementFactor[];
  formula: string;

  duration: {
    unit: 'instant' | 'turn' | 'wave' | 'session' | 'persistent';
    value: number;
  };

  triggerConditions: string[];

  stacking: {
    allowed: boolean;
    cap: number;
  };

  integrity: {
    enabled: boolean;
    maximum: number;
  };

  interactions: ElementInteraction[];

  media: {
    image: string;
    icon: string;
    altText: string;
  };

  test: {
    status: 'draft' | 'testable' | 'validated' | 'retired';
    introducedVersion: string;
    balancingNotes: string;
  };

  tags: string[];
};
