export type Phase =
  | 'Murmures'
  | 'Veille'
  | 'Scellement'
  | 'Passage'
  | 'Retombées'
  | 'Cycle clos';

export type Resources = {
  matter: number;
  flow: number;
  memory: number;
};

export type LogEntry = {
  id: string;
  phase: Phase;
  code: string;
  message: string;
  data?: string;
};

export const fixedDefaults = {
  mapRadius: 7,
  fractureRadius: 1,
  cityCount: 5,
  realPlayers: 1,
  simulatedCities: 4
};

export const testDefaults = {
  seed: 'genese-001',
  wavePower: 24,
  initialMatter: 12,
  initialFlow: 10,
  initialMemory: 8
};

export const phases: Array<{
  name: Phase;
  description: string;
}> = [
  {
    name: 'Murmures',
    description: 'Observer la vague et réduire l’incertitude.'
  },
  {
    name: 'Veille',
    description: 'Produire, stocker et préparer les défenses.'
  },
  {
    name: 'Scellement',
    description: 'Figer les décisions utilisées pendant le Passage.'
  },
  {
    name: 'Passage',
    description: 'Résoudre la vague anneau après anneau.'
  },
  {
    name: 'Retombées',
    description: 'Mesurer les dégâts, la Dissonance et les Échos.'
  }
];

export function hexPoints(
  centerX: number,
  centerY: number,
  radius: number
): string {
  return Array.from({ length: 6 }, (_, index) => {
    const angle = (Math.PI / 180) * (60 * index - 30);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}

export function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}
