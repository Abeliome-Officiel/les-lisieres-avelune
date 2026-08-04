import type {
  ElementType,
  GameAxis,
  GameElement
} from '$lib/domain/types';
import { rpgCharacteristics, rpgSkills } from './rpg-elements';
import { tdDefenses, tdWaves } from './td-elements';
import { tfBuildings } from './tf-buildings';
import { tfResources } from './tf-resources';

export const catalogue: GameElement[] = [
  ...tfResources,
  ...tfBuildings,
  ...tdDefenses,
  ...tdWaves,
  ...rpgCharacteristics,
  ...rpgSkills
];

export function getElementById(id: string): GameElement | undefined {
  return catalogue.find((element) => element.id === id);
}

export function getElementsByAxis(axis: GameAxis): GameElement[] {
  return catalogue.filter((element) => element.axis === axis);
}

export function getElementsByType(type: ElementType): GameElement[] {
  return catalogue.filter((element) => element.type === type);
}

export function assertCatalogueIntegrity(): void {
  const ids = new Set<string>();

  for (const element of catalogue) {
    if (ids.has(element.id)) {
      throw new Error(`Identifiant dupliqué : ${element.id}`);
    }

    ids.add(element.id);
  }
}
