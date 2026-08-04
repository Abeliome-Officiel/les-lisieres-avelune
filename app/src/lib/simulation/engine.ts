import {
  assertCatalogueIntegrity,
  getElementById
} from '$lib/data/catalogue';
import type { ElementQuantity, GameElement } from '$lib/domain/types';
import type {
  CityId,
  CityModifiers,
  CitySnapshot,
  CityState,
  CityTurnOrders,
  FamilyId,
  LogEntry,
  OwnedElement,
  RpgOrder,
  SessionConfiguration,
  SimulationSession,
  TdOrder,
  TfOrder,
  WaveFamily
} from './types';

const VERSION = '0.9.0-dev.3' as const;

const defaultOrders: CityTurnOrders = {
  td: { type: 'maintain' },
  tf: { type: 'extract', family: 'a' },
  rpg: { type: 'observe-fracture' }
};

const familyLabels: Record<FamilyId, string> = {
  a: 'A',
  b: 'B',
  c: 'C'
};

const partnerFamily: Record<FamilyId, FamilyId> = {
  a: 'b',
  b: 'c',
  c: 'a'
};

function cloneSession(session: SimulationSession): SimulationSession {
  return structuredClone(session);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function emptyModifiers(): CityModifiers {
  return {
    tfOutputBonus: 0,
    preparedDefenseBonus: 0,
    nextProductionMultiplier: 1,
    nextRpgPenalty: 0
  };
}

function owned(elementId: string, quantity = 1): OwnedElement {
  const element = getElementById(elementId);
  const maximumIntegrity = element?.integrity.enabled
    ? element.integrity.maximum
    : 0;

  return {
    elementId,
    quantity,
    integrity: maximumIntegrity,
    maximumIntegrity,
    enabled: true
  };
}

function createCharacter(index: number) {
  const characteristics = Object.fromEntries(
    Array.from({ length: 4 }, (_, item) => [
      `rpg.characteristic.${item + 1}`,
      { base: 2, modifier: 0, final: 2 }
    ])
  );

  const skills = Object.fromEntries(
    Array.from({ length: 6 }, (_, item) => [
      `rpg.skill.${item + 1}`,
      { base: 1, modifier: 0, final: 1 }
    ])
  );

  return {
    name: `Personnage ${index}`,
    pronouns: '',
    biography: '',
    characteristics,
    skills,
    fatigue: 0,
    conditions: [],
    equipment: []
  };
}

function createCity(
  id: CityId,
  index: number,
  ring: number,
  sector: string
): CityState {
  return {
    id,
    name: `Corps-cité ${String.fromCharCode(65 + index)}`,
    ring,
    sector,
    integrity: 100,
    maximumIntegrity: 100,
    terrainIntegrity: 100,
    stockCapacity: 60,
    stock: {
      'tf.resource.material-a0': 6,
      'tf.resource.material-b0': 6,
      'tf.resource.material-c0': 6,
      'tf.resource.product-a1': 0,
      'tf.resource.product-b1': 0,
      'tf.resource.product-c1': 0,
      'tf.resource.advanced-a2': 0,
      'tf.resource.advanced-b2': 0,
      'tf.resource.advanced-c2': 0
    },
    buildings: [
      owned('tf.building.extractor-a1'),
      owned('tf.building.extractor-b1'),
      owned('tf.building.extractor-c1')
    ],
    defenses: [],
    character: createCharacter(index + 1),
    modifiers: emptyModifiers(),
    activeEffects: [],
    queuedOrders: structuredClone(defaultOrders),
    history: []
  };
}

function sessionId(seed: string): string {
  const clean = seed.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `dev3-${clean || 'session'}-${Date.now().toString(36)}`;
}

function appendLog(
  session: SimulationSession,
  code: string,
  message: string,
  cityId: CityId | null = null,
  data: Record<string, string | number | boolean> = {}
): void {
  const entry: LogEntry = {
    sequence: session.log.length + 1,
    turn: session.currentTurn,
    phase: session.phase,
    code,
    cityId,
    message,
    data
  };

  session.log.push(entry);
}

function hashText(value: string): number {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function deterministicIndex(
  session: SimulationSession,
  length: number,
  key: string
): number {
  if (length <= 1) {
    return 0;
  }

  const hash = hashText(`${session.seed}:${session.rngCursor}:${key}`);
  session.rngCursor += 1;
  return hash % length;
}

function currentStockTotal(city: CityState): number {
  return Object.values(city.stock).reduce((sum, value) => sum + value, 0);
}

function addStock(
  city: CityState,
  elementId: string,
  amount: number
): number {
  const availableCapacity = Math.max(
    0,
    city.stockCapacity - currentStockTotal(city)
  );
  const accepted = Math.min(availableCapacity, Math.max(0, amount));

  city.stock[elementId] = (city.stock[elementId] ?? 0) + accepted;
  return accepted;
}

function hasStock(city: CityState, costs: ElementQuantity[]): boolean {
  return costs.every(
    (cost) => (city.stock[cost.elementId] ?? 0) >= cost.amount
  );
}

function consumeStock(city: CityState, costs: ElementQuantity[]): boolean {
  if (!hasStock(city, costs)) {
    return false;
  }

  for (const cost of costs) {
    city.stock[cost.elementId] -= cost.amount;
  }

  return true;
}

function findOwned(
  elements: OwnedElement[],
  elementId: string
): OwnedElement | undefined {
  return elements.find((element) => element.elementId === elementId);
}

function isOperational(
  elements: OwnedElement[],
  elementId: string
): boolean {
  const item = findOwned(elements, elementId);

  return Boolean(
    item &&
      item.enabled &&
      item.quantity > 0 &&
      (item.maximumIntegrity === 0 || item.integrity > 0)
  );
}

function addOwnedElement(
  collection: OwnedElement[],
  element: GameElement
): OwnedElement {
  const existing = findOwned(collection, element.id);

  if (existing) {
    existing.quantity += 1;
    existing.integrity = Math.min(
      existing.maximumIntegrity * existing.quantity,
      existing.integrity + element.integrity.maximum
    );
    existing.maximumIntegrity =
      element.integrity.maximum * existing.quantity;
    return existing;
  }

  const created = owned(element.id);
  collection.push(created);
  return created;
}

function repairOwned(
  element: OwnedElement,
  amount: number
): number {
  const before = element.integrity;
  element.integrity = Math.min(
    element.maximumIntegrity,
    element.integrity + amount
  );
  return element.integrity - before;
}

function damageOwned(
  element: OwnedElement,
  amount: number
): number {
  const before = element.integrity;
  element.integrity = Math.max(0, element.integrity - amount);

  if (element.integrity === 0) {
    element.enabled = false;
  }

  return before - element.integrity;
}

function updateCharacterFinalValues(city: CityState): void {
  for (const value of Object.values(city.character.characteristics)) {
    value.final = Math.max(0, value.base + value.modifier);
  }

  for (const value of Object.values(city.character.skills)) {
    value.final = Math.max(
      0,
      value.base + value.modifier + city.modifiers.nextRpgPenalty
    );
  }
}

function snapshotCity(
  city: CityState,
  turn: number,
  phase: SimulationSession['phase']
): CitySnapshot {
  return {
    turn,
    phase,
    stock: structuredClone(city.stock),
    integrity: city.integrity,
    terrainIntegrity: city.terrainIntegrity,
    characterFatigue: city.character.fatigue,
    buildings: structuredClone(city.buildings),
    defenses: structuredClone(city.defenses),
    modifiers: structuredClone(city.modifiers)
  };
}

export function createSession(
  configuration: SessionConfiguration
): SimulationSession {
  assertCatalogueIntegrity();

  const cityLayout: Array<{
    id: CityId;
    ring: number;
    sector: string;
  }> = [
    { id: 'city-a', ring: 2, sector: configuration.wave.sector },
    { id: 'city-b', ring: 3, sector: configuration.wave.sector },
    { id: 'city-c', ring: 4, sector: 'Nord' },
    { id: 'city-d', ring: 5, sector: configuration.wave.sector },
    { id: 'city-e', ring: 4, sector: 'Sud' },
    { id: 'city-f', ring: 6, sector: configuration.wave.sector }
  ];

  const cities = cityLayout
    .slice(0, configuration.cityCount)
    .map((item, index) =>
      createCity(item.id, index, item.ring, item.sector)
    );

  const session: SimulationSession = {
    version: VERSION,
    sessionId:
      configuration.sessionId ?? sessionId(configuration.seed),
    seed: configuration.seed,
    rngCursor: 0,
    phase: 'preparation',
    currentTurn: 1,
    completedPreparationTurns: 0,
    maximumPreparationTurns: 10,
    wave: structuredClone(configuration.wave),
    waveKnowledge: {
      typeKnown: false,
      sectorKnown: false,
      powerBandKnown: false,
      exactPowerKnown: false,
      observations: 0,
      analyses: 0
    },
    waveRuntime: {
      currentRing: 1,
      residualPower: configuration.wave.power,
      comparisonResiduals: {},
      citiesResolved: [],
      lisiereIntegrity: 100
    },
    cities,
    log: []
  };

  appendLog(
    session,
    'SESSION.CREATED',
    `Session ${session.sessionId} créée avec ${cities.length} corps-cités.`,
    null,
    {
      seed: session.seed,
      waveMode: session.wave.mode,
      revealTurn: session.wave.revealTurn,
      wavePower: session.wave.power
    }
  );

  return session;
}

export function queueOrders(
  session: SimulationSession,
  cityId: CityId,
  orders: CityTurnOrders
): SimulationSession {
  const next = cloneSession(session);
  const city = next.cities.find((candidate) => candidate.id === cityId);

  if (!city) {
    throw new Error(`Corps-cité introuvable : ${cityId}`);
  }

  if (next.phase !== 'preparation' && next.phase !== 'pre-wave') {
    throw new Error('Les ordres sont verrouillés pendant la vague.');
  }

  city.queuedOrders = structuredClone(orders);

  appendLog(
    next,
    'ORDER.QUEUED',
    `${city.name} a enregistré ses trois ordres.`,
    city.id,
    {
      td: orders.td.type,
      tf: orders.tf.type,
      rpg: orders.rpg.type
    }
  );

  return next;
}

function applyFatigue(
  session: SimulationSession,
  city: CityState,
  amount: number,
  reason: string
): void {
  city.character.fatigue = clamp(
    city.character.fatigue + amount,
    0,
    12
  );

  appendLog(
    session,
    'RPG.FATIGUE',
    `${city.name} : fatigue ${amount >= 0 ? '+' : ''}${amount} (${reason}).`,
    city.id,
    {
      amount,
      fatigue: city.character.fatigue
    }
  );
}

function resolveRpgOrder(
  session: SimulationSession,
  city: CityState,
  order: RpgOrder
): void {
  updateCharacterFinalValues(city);

  switch (order.type) {
    case 'recover': {
      const before = city.character.fatigue;
      city.character.fatigue = Math.max(0, before - 2);

      appendLog(
        session,
        'RPG.RECOVER',
        `${city.name} récupère 2 points de fatigue.`,
        city.id,
        {
          before,
          after: city.character.fatigue
        }
      );
      return;
    }

    case 'observe-fracture': {
      session.waveKnowledge.observations += 1;

      if (session.waveKnowledge.observations >= 1) {
        session.waveKnowledge.sectorKnown = true;
      }

      if (session.waveKnowledge.observations >= 2) {
        session.waveKnowledge.powerBandKnown = true;
      }

      appendLog(
        session,
        'RPG.OBSERVE',
        `${city.name} observe la Fracture.`,
        city.id,
        {
          observations: session.waveKnowledge.observations,
          sectorKnown: session.waveKnowledge.sectorKnown,
          powerBandKnown: session.waveKnowledge.powerBandKnown
        }
      );

      applyFatigue(session, city, 1, 'observation');
      return;
    }

    case 'analyze-wave': {
      session.waveKnowledge.analyses += 1;

      if (
        session.waveKnowledge.typeKnown ||
        session.waveKnowledge.analyses >= 2
      ) {
        session.waveKnowledge.exactPowerKnown = true;
      } else {
        session.waveKnowledge.powerBandKnown = true;
      }

      appendLog(
        session,
        'RPG.ANALYZE',
        `${city.name} analyse les informations de vague.`,
        city.id,
        {
          analyses: session.waveKnowledge.analyses,
          exactPowerKnown: session.waveKnowledge.exactPowerKnown
        }
      );

      applyFatigue(session, city, 1, 'analyse');
      return;
    }

    case 'optimize-tf': {
      const score =
        city.character.skills['rpg.skill.2']?.final ?? 1;
      city.modifiers.tfOutputBonus += Math.max(1, score);

      appendLog(
        session,
        'RPG.OPTIMIZE_TF',
        `${city.name} améliore sa production de ${Math.max(1, score)}.`,
        city.id,
        {
          tfOutputBonus: city.modifiers.tfOutputBonus
        }
      );

      applyFatigue(session, city, 1, 'optimisation');
      return;
    }

    case 'reinforce-td': {
      const score =
        city.character.skills['rpg.skill.4']?.final ?? 1;
      city.modifiers.preparedDefenseBonus += Math.max(1, score * 2);

      appendLog(
        session,
        'RPG.REINFORCE_TD',
        `${city.name} prépare un bonus défensif de ${Math.max(1, score * 2)}.`,
        city.id,
        {
          preparedDefenseBonus: city.modifiers.preparedDefenseBonus
        }
      );

      applyFatigue(session, city, 1, 'renforcement');
      return;
    }

    case 'repair-city': {
      const score =
        city.character.skills['rpg.skill.3']?.final ?? 1;
      const before = city.integrity;
      const repair = 4 + score;
      city.integrity = Math.min(
        city.maximumIntegrity,
        city.integrity + repair
      );

      const damaged = city.buildings.filter(
        (building) =>
          building.maximumIntegrity > 0 &&
          building.integrity < building.maximumIntegrity
      );

      let buildingRepair = 0;

      if (damaged.length > 0) {
        const target = damaged[
          deterministicIndex(
            session,
            damaged.length,
            `${city.id}:repair-building`
          )
        ];
        buildingRepair = repairOwned(target, 2 + score);
      }

      appendLog(
        session,
        'RPG.REPAIR_CITY',
        `${city.name} répare son intégrité et un bâtiment disponible.`,
        city.id,
        {
          cityRepair: city.integrity - before,
          buildingRepair
        }
      );

      applyFatigue(session, city, 1, 'réparation');
      return;
    }

    case 'aid-city': {
      const target = session.cities.find(
        (candidate) => candidate.id === order.targetCityId
      );

      if (!target || target.id === city.id) {
        appendLog(
          session,
          'RPG.AID_FAILED',
          `${city.name} ne trouve pas de cible valide pour l’aide.`,
          city.id
        );
        return;
      }

      target.modifiers.tfOutputBonus += 1;
      target.modifiers.preparedDefenseBonus += 1;

      appendLog(
        session,
        'RPG.AID_CITY',
        `${city.name} aide ${target.name}.`,
        city.id,
        {
          targetCityId: target.id,
          tfBonus: 1,
          tdBonus: 1
        }
      );

      applyFatigue(session, city, 1, 'aide');
      return;
    }
  }
}

function productionAmount(city: CityState, base: number): number {
  const multiplied = Math.floor(
    base * city.modifiers.nextProductionMultiplier
  );

  return Math.max(0, multiplied + city.modifiers.tfOutputBonus);
}

function resolveTfOrder(
  session: SimulationSession,
  city: CityState,
  order: TfOrder
): void {
  const family = 'family' in order ? order.family : null;
  const label = family ? familyLabels[family] : '';

  switch (order.type) {
    case 'extract': {
      const buildingId = `tf.building.extractor-${order.family}1`;

      if (!isOperational(city.buildings, buildingId)) {
        appendLog(
          session,
          'TF.EXTRACT_BLOCKED',
          `${city.name} ne possède pas d’extracteur ${label} opérationnel.`,
          city.id,
          { buildingId }
        );
        return;
      }

      const outputId = `tf.resource.material-${order.family}0`;
      const requested = productionAmount(city, 3);
      const produced = addStock(city, outputId, requested);

      appendLog(
        session,
        'TF.EXTRACT',
        `${city.name} produit ${produced} Matériau ${label}0.`,
        city.id,
        {
          outputId,
          requested,
          produced
        }
      );
      return;
    }

    case 'transform': {
      const buildingId = `tf.building.transformer-${order.family}1`;
      const inputId = `tf.resource.material-${order.family}0`;
      const outputId = `tf.resource.product-${order.family}1`;
      const costs = [{ elementId: inputId, amount: 2 }];

      if (!isOperational(city.buildings, buildingId)) {
        appendLog(
          session,
          'TF.TRANSFORM_BLOCKED',
          `${city.name} ne possède pas de transformateur ${label} opérationnel.`,
          city.id,
          { buildingId }
        );
        return;
      }

      if (!consumeStock(city, costs)) {
        appendLog(
          session,
          'TF.INSUFFICIENT_STOCK',
          `${city.name} manque de Matériau ${label}0.`,
          city.id,
          { inputId, required: 2 }
        );
        return;
      }

      const requested = productionAmount(city, 1);
      const produced = addStock(city, outputId, requested);

      appendLog(
        session,
        'TF.TRANSFORM',
        `${city.name} transforme 2 Matériau ${label}0 en ${produced} Produit ${label}1.`,
        city.id,
        {
          inputId,
          outputId,
          produced
        }
      );
      return;
    }

    case 'assemble': {
      const buildingId = `tf.building.assembler-${order.family}2`;
      const ownProductId = `tf.resource.product-${order.family}1`;
      const partner = partnerFamily[order.family];
      const partnerProductId = `tf.resource.product-${partner}1`;
      const outputId = `tf.resource.advanced-${order.family}2`;
      const costs = [
        { elementId: ownProductId, amount: 2 },
        { elementId: partnerProductId, amount: 1 }
      ];

      if (!isOperational(city.buildings, buildingId)) {
        appendLog(
          session,
          'TF.ASSEMBLE_BLOCKED',
          `${city.name} ne possède pas d’assembleur ${label} opérationnel.`,
          city.id,
          { buildingId }
        );
        return;
      }

      if (!consumeStock(city, costs)) {
        appendLog(
          session,
          'TF.INSUFFICIENT_STOCK',
          `${city.name} ne possède pas les produits nécessaires à l’assemblage ${label}.`,
          city.id,
          {
            ownProductId,
            partnerProductId
          }
        );
        return;
      }

      const requested = productionAmount(city, 1);
      const produced = addStock(city, outputId, requested);

      appendLog(
        session,
        'TF.ASSEMBLE',
        `${city.name} fabrique ${produced} Avancé ${label}2.`,
        city.id,
        {
          outputId,
          produced
        }
      );
      return;
    }

    case 'build-building': {
      const element = getElementById(order.buildingId);

      if (!element || element.type !== 'building') {
        appendLog(
          session,
          'TF.BUILD_INVALID',
          `${city.name} reçoit un identifiant de bâtiment invalide.`,
          city.id,
          { buildingId: order.buildingId }
        );
        return;
      }

      if (!consumeStock(city, element.costs)) {
        appendLog(
          session,
          'TF.INSUFFICIENT_STOCK',
          `${city.name} ne peut pas construire ${element.displayName}.`,
          city.id,
          { buildingId: element.id }
        );
        return;
      }

      addOwnedElement(city.buildings, element);

      if (element.id === 'tf.building.storage-1') {
        city.stockCapacity += 20;
      }

      appendLog(
        session,
        'TF.BUILD',
        `${city.name} construit ${element.displayName}.`,
        city.id,
        {
          buildingId: element.id,
          stockCapacity: city.stockCapacity
        }
      );
      return;
    }
  }
}

function resolveTdOrder(
  session: SimulationSession,
  city: CityState,
  order: TdOrder
): void {
  switch (order.type) {
    case 'maintain': {
      const repaired = city.defenses.reduce(
        (sum, defense) => sum + repairOwned(defense, 1),
        0
      );

      appendLog(
        session,
        'TD.MAINTAIN',
        `${city.name} entretient ses défenses.`,
        city.id,
        { repaired }
      );
      return;
    }

    case 'build-defense': {
      const element = getElementById(order.defenseId);

      if (!element || element.type !== 'defense') {
        appendLog(
          session,
          'TD.BUILD_INVALID',
          `${city.name} reçoit un identifiant de défense invalide.`,
          city.id,
          { defenseId: order.defenseId }
        );
        return;
      }

      if (!consumeStock(city, element.costs)) {
        appendLog(
          session,
          'TD.INSUFFICIENT_STOCK',
          `${city.name} ne peut pas construire ${element.displayName}.`,
          city.id,
          { defenseId: element.id }
        );
        return;
      }

      addOwnedElement(city.defenses, element);

      appendLog(
        session,
        'TD.BUILD',
        `${city.name} construit ${element.displayName}.`,
        city.id,
        { defenseId: element.id }
      );
      return;
    }

    case 'repair-defense': {
      const defense = findOwned(city.defenses, order.defenseId);

      if (!defense) {
        appendLog(
          session,
          'TD.REPAIR_BLOCKED',
          `${city.name} ne possède pas la défense demandée.`,
          city.id,
          { defenseId: order.defenseId }
        );
        return;
      }

      const repaired = repairOwned(defense, 4);

      appendLog(
        session,
        'TD.REPAIR',
        `${city.name} répare une défense de ${repaired} points.`,
        city.id,
        {
          defenseId: order.defenseId,
          repaired
        }
      );
      return;
    }
  }
}

function revealWave(session: SimulationSession): void {
  session.waveKnowledge.typeKnown = true;
  session.waveKnowledge.sectorKnown = true;
  session.waveKnowledge.powerBandKnown = true;

  appendLog(
    session,
    'WAVE.REVEALED',
    `La vague est révélée : ${session.wave.family}, secteur ${session.wave.sector}.`,
    null,
    {
      family: session.wave.family,
      sector: session.wave.sector,
      exactPowerKnown: session.waveKnowledge.exactPowerKnown
    }
  );
}

function resetTurnModifiers(city: CityState): void {
  city.modifiers.tfOutputBonus = 0;
  city.modifiers.nextProductionMultiplier = 1;
  city.modifiers.nextRpgPenalty = 0;
  updateCharacterFinalValues(city);
}

export function resolvePreparationTurn(
  session: SimulationSession
): SimulationSession {
  if (session.phase !== 'preparation' && session.phase !== 'pre-wave') {
    throw new Error('Aucun tour de préparation ne peut être résolu.');
  }

  const next = cloneSession(session);
  const phaseAtStart = next.phase;

  appendLog(
    next,
    'TURN.START',
    `Début du tour ${next.currentTurn} (${phaseAtStart}).`
  );

  for (const city of next.cities) {
    resolveRpgOrder(next, city, city.queuedOrders.rpg);
  }

  for (const city of next.cities) {
    resolveTfOrder(next, city, city.queuedOrders.tf);
  }

  for (const city of next.cities) {
    resolveTdOrder(next, city, city.queuedOrders.td);
  }

  for (const city of next.cities) {
    city.history.push(
      snapshotCity(city, next.currentTurn, phaseAtStart)
    );
    resetTurnModifiers(city);
  }

  next.completedPreparationTurns += 1;

  appendLog(
    next,
    'TURN.END',
    `Fin du tour ${next.currentTurn}.`,
    null,
    {
      completedPreparationTurns: next.completedPreparationTurns
    }
  );

  if (phaseAtStart === 'pre-wave') {
    next.phase = 'wave';
    next.waveRuntime.currentRing = 1;
    next.waveRuntime.residualPower = next.wave.power;

    appendLog(
      next,
      'WAVE.START',
      'La vague commence à la Fracture.',
      null,
      {
        family: next.wave.family,
        power: next.wave.power,
        sector: next.wave.sector,
        mode: next.wave.mode
      }
    );

    return next;
  }

  if (next.currentTurn === next.wave.revealTurn) {
    revealWave(next);
    next.phase = 'pre-wave';
    next.currentTurn += 1;
    return next;
  }

  if (next.currentTurn >= next.maximumPreparationTurns) {
    revealWave(next);
    next.phase = 'wave';
    next.waveRuntime.currentRing = 1;
    next.waveRuntime.residualPower = next.wave.power;
    return next;
  }

  next.currentTurn += 1;
  return next;
}

function defenseAbsorption(
  city: CityState,
  waveFamily: WaveFamily
): {
  total: number;
  details: Record<string, number>;
} {
  const details: Record<string, number> = {};
  let total = city.modifiers.preparedDefenseBonus;

  for (const defense of city.defenses) {
    if (
      !defense.enabled ||
      defense.quantity <= 0 ||
      defense.integrity <= 0
    ) {
      continue;
    }

    const element = getElementById(defense.elementId);

    if (!element) {
      continue;
    }

    const matching = element.family === waveFamily;
    const general = element.family === 'general';
    const perDefense = matching ? 8 : general ? 5 : 3;
    const activeUnits = Math.max(
      1,
      Math.ceil(
        defense.integrity /
          Math.max(1, element.integrity.maximum)
      )
    );
    const absorption = perDefense * activeUnits;

    details[defense.elementId] = absorption;
    total += absorption;
  }

  return { total, details };
}

function damageDefenses(
  session: SimulationSession,
  city: CityState,
  incomingPower: number
): number {
  const active = city.defenses.filter(
    (defense) =>
      defense.enabled &&
      defense.integrity > 0 &&
      defense.maximumIntegrity > 0
  );

  if (active.length === 0) {
    return 0;
  }

  const target = active[
    deterministicIndex(
      session,
      active.length,
      `${city.id}:wave-defense`
    )
  ];
  const damage = Math.max(1, Math.ceil(incomingPower / 12));

  return damageOwned(target, damage);
}

function damageRandomBuilding(
  session: SimulationSession,
  city: CityState,
  damage: number
): number {
  const active = city.buildings.filter(
    (building) =>
      building.enabled &&
      building.integrity > 0 &&
      building.maximumIntegrity > 0
  );

  if (active.length === 0 || damage <= 0) {
    return 0;
  }

  const target = active[
    deterministicIndex(
      session,
      active.length,
      `${city.id}:wave-building`
    )
  ];

  return damageOwned(target, damage);
}

function applyWaveToCity(
  session: SimulationSession,
  city: CityState,
  incomingPower: number
): number {
  const absorption = defenseAbsorption(city, session.wave.family);
  const residual = Math.max(0, incomingPower - absorption.total);
  const defenseDamage = damageDefenses(
    session,
    city,
    incomingPower
  );

  let cityDamage = 0;
  let terrainDamage = 0;
  let buildingDamage = 0;

  switch (session.wave.family) {
    case 'impact':
      cityDamage = Math.ceil(residual * 0.6);
      terrainDamage = Math.ceil(residual * 0.1);
      break;

    case 'corrosion':
      cityDamage = Math.ceil(residual * 0.2);
      terrainDamage = Math.ceil(residual * 0.45);
      buildingDamage = damageRandomBuilding(
        session,
        city,
        Math.ceil(residual * 0.2)
      );
      break;

    case 'interference':
      cityDamage = Math.ceil(residual * 0.1);
      city.modifiers.nextProductionMultiplier = 0.75;
      city.modifiers.nextRpgPenalty = -1;
      applyFatigue(
        session,
        city,
        Math.ceil(residual / 10),
        'interférence'
      );
      city.activeEffects.push(
        'Production ×0,75 au prochain tour',
        'Compétences −1 au prochain tour'
      );
      break;
  }

  city.integrity = Math.max(0, city.integrity - cityDamage);
  city.terrainIntegrity = Math.max(
    0,
    city.terrainIntegrity - terrainDamage
  );
  city.modifiers.preparedDefenseBonus = 0;

  appendLog(
    session,
    'WAVE.CITY_RESOLVED',
    `${city.name} reçoit ${incomingPower}, absorbe ${absorption.total} et transmet un résidu de ${residual}.`,
    city.id,
    {
      incomingPower,
      absorption: absorption.total,
      residual,
      cityDamage,
      terrainDamage,
      buildingDamage,
      defenseDamage
    }
  );

  return residual;
}

function completeWave(session: SimulationSession): void {
  const residual =
    session.wave.mode === 'trajectory'
      ? session.waveRuntime.residualPower
      : Math.max(
          0,
          ...Object.values(
            session.waveRuntime.comparisonResiduals
          )
        );

  const lisiereDamage = Math.ceil(residual * 0.25);
  session.waveRuntime.lisiereIntegrity = Math.max(
    0,
    session.waveRuntime.lisiereIntegrity - lisiereDamage
  );
  session.phase = 'complete';

  appendLog(
    session,
    'WAVE.COMPLETE',
    'La vague atteint la Lisière et la session se termine.',
    null,
    {
      residual,
      lisiereDamage,
      lisiereIntegrity: session.waveRuntime.lisiereIntegrity
    }
  );
}

export function advanceWave(
  session: SimulationSession
): SimulationSession {
  if (session.phase !== 'wave') {
    throw new Error('La vague ne peut pas être avancée maintenant.');
  }

  const next = cloneSession(session);
  const ring = next.waveRuntime.currentRing;

  appendLog(
    next,
    'WAVE.RING_START',
    `La vague progresse vers l’anneau ${ring}.`,
    null,
    {
      ring,
      mode: next.wave.mode,
      residualPower: next.waveRuntime.residualPower
    }
  );

  const affected = next.cities.filter(
    (city) =>
      city.ring === ring &&
      (
        next.wave.mode === 'comparison' ||
        city.sector === next.wave.sector
      )
  );

  for (const city of affected) {
    const incoming =
      next.wave.mode === 'comparison'
        ? next.wave.power
        : next.waveRuntime.residualPower;

    const residual = applyWaveToCity(next, city, incoming);
    next.waveRuntime.citiesResolved.push(city.id);

    if (next.wave.mode === 'comparison') {
      next.waveRuntime.comparisonResiduals[city.id] = residual;
    } else {
      next.waveRuntime.residualPower = residual;
    }
  }

  appendLog(
    next,
    'WAVE.RING_END',
    `Résolution de l’anneau ${ring} terminée.`,
    null,
    {
      ring,
      affectedCities: affected.length,
      residualPower: next.waveRuntime.residualPower
    }
  );

  if (ring >= next.wave.maximumRing) {
    completeWave(next);
    return next;
  }

  next.waveRuntime.currentRing += 1;
  return next;
}

export function getVisibleWaveInformation(
  session: SimulationSession
): Record<string, string | number | boolean> {
  const knowledge = session.waveKnowledge;
  const lowerPower = Math.floor(session.wave.power / 10) * 10;
  const upperPower = lowerPower + 9;

  return {
    type: knowledge.typeKnown ? session.wave.family : 'inconnu',
    sector: knowledge.sectorKnown ? session.wave.sector : 'inconnu',
    power:
      knowledge.exactPowerKnown
        ? session.wave.power
        : knowledge.powerBandKnown
          ? `${lowerPower}–${upperPower}`
          : 'inconnue',
    exactPowerKnown: knowledge.exactPowerKnown
  };
}
