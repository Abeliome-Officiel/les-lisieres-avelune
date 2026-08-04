import type { GameElement, ImpactDomain } from '$lib/domain/types';
import { createElement } from './factory';

type SkillDefinition = {
  index: number;
  function: string;
  domains: ImpactDomain[];
  targets: string[];
};

const skillDefinitions: SkillDefinition[] = [
  {
    index: 1,
    function: 'Analyser une vague.',
    domains: ['wave', 'character'],
    targets: ['vague']
  },
  {
    index: 2,
    function: 'Améliorer une production.',
    domains: ['production', 'character'],
    targets: ['production']
  },
  {
    index: 3,
    function: 'Construire ou réparer.',
    domains: ['building', 'character'],
    targets: ['bâtiment', 'corps-cité']
  },
  {
    index: 4,
    function: 'Renforcer une défense.',
    domains: ['defense', 'character'],
    targets: ['défense']
  },
  {
    index: 5,
    function: 'Réduire une conséquence.',
    domains: ['city', 'terrain', 'character'],
    targets: ['corps-cité', 'terrain']
  },
  {
    index: 6,
    function: 'Aider un autre corps-cité.',
    domains: ['city', 'world', 'character'],
    targets: ['autre corps-cité']
  }
];

export const rpgCharacteristics: GameElement[] = Array.from(
  { length: 4 },
  (_, index) => {
    const number = index + 1;

    return createElement({
      id: `rpg.characteristic.${number}`,
      displayName: `Caractéristique ${number}`,
      axis: 'rpg',
      type: 'characteristic',
      family: 'characteristic',
      level: 1,
      function: `Valeur de base temporaire de la caractéristique ${number}.`,
      impactDomains: ['character'],
      targets: ['personnage'],
      factors: [
        {
          id: 'initial-value',
          value: 2,
          unit: 'points',
          appliesTo: 'tests RPG'
        }
      ],
      formula: 'valeur finale = base + modificateurs',
      duration: { unit: 'persistent', value: 1 },
      stacking: { allowed: false, cap: 1 },
      tags: ['rpg', 'fiche', 'caracteristique']
    });
  }
);

export const rpgSkills: GameElement[] = skillDefinitions.map(
  ({ index, function: skillFunction, domains, targets }) =>
    createElement({
      id: `rpg.skill.${index}`,
      displayName: `Compétence ${index}`,
      axis: 'rpg',
      type: 'skill',
      family: 'skill',
      level: 1,
      function: skillFunction,
      impactDomains: domains,
      targets,
      factors: [
        {
          id: 'initial-value',
          value: 1,
          unit: 'points',
          appliesTo: 'tests RPG'
        }
      ],
      formula: 'résultat = caractéristique + compétence + modificateurs',
      duration: { unit: 'persistent', value: 1 },
      stacking: { allowed: false, cap: 1 },
      tags: ['rpg', 'fiche', 'competence']
    })
);
