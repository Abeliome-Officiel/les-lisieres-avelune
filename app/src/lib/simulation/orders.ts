import { getElementById } from '$lib/data/catalogue';
import type {
  FamilyId,
  OrderOption,
  RpgOrder,
  TdOrder,
  TfOrder
} from './types';

const families: FamilyId[] = ['a', 'b', 'c'];

export const tdOrderOptions: OrderOption<TdOrder>[] = [
  {
    id: 'td.maintain',
    label: 'Maintenir les défenses',
    description: 'Restaure légèrement les défenses déjà construites.',
    order: { type: 'maintain' }
  },
  ...[
    'td.defense.impact-1',
    'td.defense.corrosion-1',
    'td.defense.interference-1',
    'td.defense.general-1'
  ].map((defenseId) => {
    const element = getElementById(defenseId);

    return {
      id: `td.build.${defenseId}`,
      label: `Construire ${element?.displayName ?? defenseId}`,
      description: element?.function ?? 'Construire une défense.',
      order: {
        type: 'build-defense' as const,
        defenseId
      },
      relatedElement: element
    };
  })
];

export const tfOrderOptions: OrderOption<TfOrder>[] = [
  ...families.map((family) => ({
    id: `tf.extract.${family}`,
    label: `Extraire ${family.toUpperCase()}`,
    description: `Produit le matériau de base de la chaîne ${family.toUpperCase()}.`,
    order: { type: 'extract' as const, family }
  })),
  ...families.map((family) => ({
    id: `tf.transform.${family}`,
    label: `Transformer ${family.toUpperCase()}`,
    description: `Transforme le matériau ${family.toUpperCase()}0 en produit ${family.toUpperCase()}1.`,
    order: { type: 'transform' as const, family }
  })),
  ...families.map((family) => ({
    id: `tf.assemble.${family}`,
    label: `Assembler ${family.toUpperCase()}`,
    description: `Fabrique le produit avancé ${family.toUpperCase()}2.`,
    order: { type: 'assemble' as const, family }
  })),
  ...[
    'tf.building.transformer-a1',
    'tf.building.transformer-b1',
    'tf.building.transformer-c1',
    'tf.building.assembler-a2',
    'tf.building.assembler-b2',
    'tf.building.assembler-c2',
    'tf.building.storage-1'
  ].map((buildingId) => {
    const element = getElementById(buildingId);

    return {
      id: `tf.build.${buildingId}`,
      label: `Construire ${element?.displayName ?? buildingId}`,
      description: element?.function ?? 'Construire un bâtiment.',
      order: {
        type: 'build-building' as const,
        buildingId
      },
      relatedElement: element
    };
  })
];

export const rpgOrderOptions: OrderOption<RpgOrder>[] = [
  {
    id: 'rpg.recover',
    label: 'Récupérer',
    description: 'Réduit la fatigue du personnage.',
    order: { type: 'recover' }
  },
  {
    id: 'rpg.observe',
    label: 'Observer la Fracture',
    description: 'Ajoute une observation et révèle progressivement la vague.',
    order: { type: 'observe-fracture' }
  },
  {
    id: 'rpg.analyze',
    label: 'Analyser la vague',
    description: 'Précise les informations connues sur la vague.',
    order: { type: 'analyze-wave' }
  },
  {
    id: 'rpg.optimize-tf',
    label: 'Optimiser la production',
    description: 'Augmente la sortie de l’ordre TF du même tour.',
    order: { type: 'optimize-tf' }
  },
  {
    id: 'rpg.reinforce-td',
    label: 'Renforcer la défense',
    description: 'Ajoute une absorption temporaire conservée jusqu’à la vague.',
    order: { type: 'reinforce-td' }
  },
  {
    id: 'rpg.repair-city',
    label: 'Réparer le corps-cité',
    description: 'Restaure l’intégrité du corps-cité et d’un bâtiment.',
    order: { type: 'repair-city' }
  }
];
