import { LAB, wavePower } from './game.js';

export interface SimulationProfile {
	name: string;
	towersAtWave: (wave: number) => number;
}

export interface SimulationResult {
	profile: string;
	result: 'tester-victory' | 'game-victory';
	wave: number;
	integrity: number;
	powers: number[];
	residuals: number[];
}

export const SIMULATION_PROFILES: SimulationProfile[] = [
	{ name: 'développement raisonnable', towersAtWave: (wave) => Math.min(8, Math.max(0, wave * 2 - 2)) },
	{ name: 'défense tardive', towersAtWave: (wave) => wave < 3 ? 0 : 1 },
	{ name: 'économie sans défense', towersAtWave: () => 0 },
	{ name: 'recherche puis défense', towersAtWave: (wave) => Math.min(5, Math.max(0, wave * 2 - 3)) }
];

export function simulateProfile(profile: SimulationProfile, maximumWaves = 20): SimulationResult {
	let integrity: number = LAB.baseIntegrity;
	const powers: number[] = [], residuals: number[] = [];
	for (let wave = 1; wave <= maximumWaves; wave += 1) {
		const power = wavePower(wave);
		const residual = Math.max(0, power - profile.towersAtWave(wave) * LAB.towerWeakening);
		powers.push(power); residuals.push(residual);
		if (residual === 0) return { profile: profile.name, result: 'tester-victory', wave, integrity, powers, residuals };
		integrity = Math.max(0, integrity - residual);
		if (integrity === 0) return { profile: profile.name, result: 'game-victory', wave, integrity, powers, residuals };
	}
	throw new Error(`La simulation ${profile.name} n’a pas terminé en ${maximumWaves} ondes.`);
}

if (process.argv[1]?.endsWith('simulation.ts')) {
	for (const profile of SIMULATION_PROFILES) console.log(JSON.stringify(simulateProfile(profile)));
}
