import { getElementById } from '$lib/data/catalogue';
import type {
  CityState,
  LogEntry,
  SimulationSession
} from './types';

function stringifyData(
  data: Record<string, string | number | boolean>
): string {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return '';
  }

  return ` | ${entries
    .map(([key, value]) => `${key}=${String(value)}`)
    .join(' ; ')}`;
}

function formatEntry(entry: LogEntry): string {
  const sequence = String(entry.sequence).padStart(4, '0');
  const city = entry.cityId ? ` | ${entry.cityId}` : '';

  return (
    `[${sequence}] T${entry.turn} | ${entry.phase} | ` +
    `${entry.code}${city} | ${entry.message}` +
    stringifyData(entry.data)
  );
}

function formatStock(city: CityState): string[] {
  return Object.entries(city.stock)
    .filter(([, amount]) => amount !== 0)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([elementId, amount]) => {
      const name = getElementById(elementId)?.displayName ?? elementId;
      return `  - ${name}: ${amount}`;
    });
}

function formatOwned(
  title: string,
  elements: CityState['buildings']
): string[] {
  const lines = [`${title}:`];

  if (elements.length === 0) {
    lines.push('  - aucun');
    return lines;
  }

  for (const item of elements) {
    const name =
      getElementById(item.elementId)?.displayName ?? item.elementId;

    lines.push(
      `  - ${name}: quantité=${item.quantity}, ` +
      `intégrité=${item.integrity}/${item.maximumIntegrity}, ` +
      `actif=${item.enabled}`
    );
  }

  return lines;
}

function formatCitySummary(city: CityState): string[] {
  return [
    `${city.name} (${city.id})`,
    `  Anneau: ${city.ring}`,
    `  Secteur: ${city.sector}`,
    `  Intégrité: ${city.integrity}/${city.maximumIntegrity}`,
    `  Terrain: ${city.terrainIntegrity}/100`,
    `  Fatigue: ${city.character.fatigue}/12`,
    `  Capacité de stock: ${city.stockCapacity}`,
    'Stock:',
    ...formatStock(city),
    ...formatOwned('Bâtiments', city.buildings),
    ...formatOwned('Défenses', city.defenses),
    `Effets actifs: ${
      city.activeEffects.length > 0
        ? city.activeEffects.join(' | ')
        : 'aucun'
    }`
  ];
}

export function exportSessionLog(
  session: SimulationSession
): string {
  const header = [
    'LES LISIÈRES D’AVELUNE — JOURNAL DE TEST',
    `Version: ${session.version}`,
    `Session: ${session.sessionId}`,
    `Seed: ${session.seed}`,
    `Phase finale: ${session.phase}`,
    `Tours de préparation résolus: ${session.completedPreparationTurns}`,
    `Mode de vague: ${session.wave.mode}`,
    `Type de vague: ${session.wave.family}`,
    `Puissance: ${session.wave.power}`,
    `Secteur: ${session.wave.sector}`,
    `Tour de révélation: ${session.wave.revealTurn}`,
    `Anneau final: ${session.wave.maximumRing}`,
    ''
  ];

  const journal = [
    '=== JOURNAL CONTINU ===',
    ...session.log.map(formatEntry),
    ''
  ];

  const summaries = [
    '=== ÉTAT FINAL DES CORPS-CITÉS ===',
    ...session.cities.flatMap((city) => [
      ...formatCitySummary(city),
      ''
    ]),
    '=== ÉTAT DU MONDE ===',
    `Intégrité de la Lisière: ${session.waveRuntime.lisiereIntegrity}/100`,
    `Résidu de trajectoire: ${session.waveRuntime.residualPower}`,
    `Résidus de comparaison: ${JSON.stringify(
      session.waveRuntime.comparisonResiduals
    )}`,
    ''
  ];

  return [...header, ...journal, ...summaries].join('\n');
}

export function downloadLogFilename(
  session: SimulationSession
): string {
  return `LOG_${session.version}_${session.sessionId}.txt`;
}
