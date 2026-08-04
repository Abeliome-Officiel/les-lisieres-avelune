import type { GameElement } from '$lib/domain/types';

export type FamilyId = 'a' | 'b' | 'c';
export type CityId = 'city-a' | 'city-b' | 'city-c' | 'city-d' | 'city-e' | 'city-f';

export type SessionPhase =
  | 'configuration'
  | 'preparation'
  | 'pre-wave'
  | 'wave'
  | 'complete';

export type WaveMode = 'comparison' | 'trajectory';
export type WaveFamily = 'impact' | 'corrosion' | 'interference';

export type TdOrder =
  | { type: 'maintain' }
  | { type: 'build-defense'; defenseId: string }
  | { type: 'repair-defense'; defenseId: string };

export type TfOrder =
  | { type: 'extract'; family: FamilyId }
  | { type: 'transform'; family: FamilyId }
  | { type: 'assemble'; family: FamilyId }
  | { type: 'build-building'; buildingId: string };

export type RpgOrder =
  | { type: 'recover' }
  | { type: 'observe-fracture' }
  | { type: 'analyze-wave' }
  | { type: 'optimize-tf' }
  | { type: 'reinforce-td' }
  | { type: 'repair-city' }
  | { type: 'aid-city'; targetCityId: CityId };

export type CityTurnOrders = {
  td: TdOrder;
  tf: TfOrder;
  rpg: RpgOrder;
};

export type OwnedElement = {
  elementId: string;
  quantity: number;
  integrity: number;
  maximumIntegrity: number;
  enabled: boolean;
};

export type CharacterValue = {
  base: number;
  modifier: number;
  final: number;
};

export type CharacterState = {
  name: string;
  pronouns: string;
  biography: string;
  characteristics: Record<string, CharacterValue>;
  skills: Record<string, CharacterValue>;
  fatigue: number;
  conditions: string[];
  equipment: string[];
};

export type CityModifiers = {
  tfOutputBonus: number;
  preparedDefenseBonus: number;
  nextProductionMultiplier: number;
  nextRpgPenalty: number;
};

export type CitySnapshot = {
  turn: number;
  phase: SessionPhase;
  stock: Record<string, number>;
  integrity: number;
  terrainIntegrity: number;
  characterFatigue: number;
  buildings: OwnedElement[];
  defenses: OwnedElement[];
  modifiers: CityModifiers;
};

export type CityState = {
  id: CityId;
  name: string;
  ring: number;
  sector: string;
  integrity: number;
  maximumIntegrity: number;
  terrainIntegrity: number;
  stockCapacity: number;
  stock: Record<string, number>;
  buildings: OwnedElement[];
  defenses: OwnedElement[];
  character: CharacterState;
  modifiers: CityModifiers;
  activeEffects: string[];
  queuedOrders: CityTurnOrders;
  history: CitySnapshot[];
};

export type WaveConfiguration = {
  elementId: string;
  family: WaveFamily;
  mode: WaveMode;
  power: number;
  sector: string;
  revealTurn: 7 | 8 | 9;
  maximumRing: number;
};

export type WaveKnowledge = {
  typeKnown: boolean;
  sectorKnown: boolean;
  powerBandKnown: boolean;
  exactPowerKnown: boolean;
  observations: number;
  analyses: number;
};

export type WaveRuntime = {
  currentRing: number;
  residualPower: number;
  comparisonResiduals: Record<string, number>;
  citiesResolved: string[];
  lisiereIntegrity: number;
};

export type LogEntry = {
  sequence: number;
  turn: number;
  phase: SessionPhase;
  code: string;
  cityId: CityId | null;
  message: string;
  data: Record<string, string | number | boolean>;
};

export type SessionConfiguration = {
  sessionId?: string;
  seed: string;
  cityCount: 4 | 6;
  wave: WaveConfiguration;
};

export type SimulationSession = {
  version: '0.9.0-dev.3';
  sessionId: string;
  seed: string;
  rngCursor: number;
  phase: SessionPhase;
  currentTurn: number;
  completedPreparationTurns: number;
  maximumPreparationTurns: 10;
  wave: WaveConfiguration;
  waveKnowledge: WaveKnowledge;
  waveRuntime: WaveRuntime;
  cities: CityState[];
  log: LogEntry[];
};

export type OrderOption<T> = {
  id: string;
  label: string;
  description: string;
  order: T;
  relatedElement?: GameElement;
};
