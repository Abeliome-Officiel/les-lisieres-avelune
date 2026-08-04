import type { Seed } from '../domain/ids.js';

/**
 * Petit PRNG xorshift32.
 *
 * Il ne sert pas à la sécurité.
 * Son intérêt dans PROTO-0 est uniquement d'obtenir des simulations
 * rapides et exactement reproductibles à partir d'une graine 32 bits.
 */
export class SeededRng {
	private state: number;

	constructor(seed: Seed) {
		const normalized = seed >>> 0;
		this.state = normalized === 0 ? 0x6d2b79f5 : normalized;
	}

	nextUint32(): number {
		let x = this.state;

		x ^= x << 13;
		x ^= x >>> 17;
		x ^= x << 5;

		this.state = x >>> 0;
		return this.state;
	}

	next(): number {
		return this.nextUint32() / 0x100000000;
	}

	between(min: number, max: number): number {
		if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
			throw new RangeError('Intervalle aléatoire invalide.');
		}

		return min + (max - min) * this.next();
	}

	integer(min: number, max: number): number {
		if (!Number.isInteger(min) || !Number.isInteger(max) || max < min) {
			throw new RangeError('Intervalle entier aléatoire invalide.');
		}

		return Math.floor(this.between(min, max + 1));
	}
}
