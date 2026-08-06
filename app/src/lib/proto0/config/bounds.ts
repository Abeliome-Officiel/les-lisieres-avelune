export const PROTO0_BOUNDS = {
	turns: {
		min: 6,
		reference: 10,
		max: 20
	},
	wave: {
		pressure: {
			min: 25,
			reference: 50,
			max: 100
		},
		structure: {
			min: 20,
			reference: 60,
			max: 90
		},
		charge: {
			min: 0,
			reference: 20,
			max: 60
		},
		capturableMatter: {
			min: 4,
			reference: 16,
			max: 40
		}
	},
	seed: {
		min: 1,
		max: 0xffffffff
	}
} as const;
