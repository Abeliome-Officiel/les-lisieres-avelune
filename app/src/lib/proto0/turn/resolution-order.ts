/**
 * Contrat d'ordre du moteur PROTO-0.
 *
 * P2 n'implémente pas encore chacune de ces étapes.
 * Elles seront branchées progressivement par P3, P4, P5, etc.
 * L'ordre est néanmoins figé ici afin que les sous-moteurs futurs
 * ne puissent pas définir chacun leur propre séquence implicite.
 */
export const PROTO0_RESOLUTION_ORDER = [
	'lock-player-decisions',
	'prepare-simulated-corcites',
	'compute-effective-characteristics',
	'validate-capacities-and-constraints',
	'compute-needs',
	'extract',
	'produce-transform-fabricate',
	'resolve-direct-buffers-and-flows',
	'construct',
	'resolve-minimal-rpg-research',
	'commit',
	'resolve-deficits-and-internal-consequences',
	'update-knowledge',
	'update-world',
	'prepare-or-resolve-wave',
	'resolve-consequences',
	'log',
	'save'
] as const;

export type Proto0ResolutionStage =
	(typeof PROTO0_RESOLUTION_ORDER)[number];
