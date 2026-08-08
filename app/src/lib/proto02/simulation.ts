import { LAB, createGame, placeBuilding, queueProduction, resolveCycle, wavePower, type BuildingId } from './game.js';

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

export interface SimulationBatch {
	runs: number;
	testerVictories: number;
	gameVictories: number;
	averageTerminalWave: number;
}

export const SIMULATION_PROFILES: SimulationProfile[] = [
	{ name: 'développement raisonnable', towersAtWave: (wave) => Math.min(8, Math.max(0, wave * 2 - 2)) },
	{ name: 'défense tardive', towersAtWave: (wave) => wave < 3 ? 0 : 1 },
	{ name: 'économie sans défense', towersAtWave: () => 0 },
	{ name: 'recherche puis défense', towersAtWave: (wave) => Math.min(5, Math.max(0, wave * 2 - 3)) },
	{ name: 'extraction améliorée puis défense', towersAtWave: (wave) => Math.min(6, Math.max(0, wave * 2 - 3)) },
	{ name: 'surinvestissement économique', towersAtWave: (wave) => wave < 4 ? 0 : Math.min(3, wave - 3) }
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

/** Balayage reproductible de trajectoires proches du profil raisonnable.
 * Le bruit représente un cycle économique gagné ou perdu, pas une nouvelle règle de jeu. */
export function simulateBatch(seed = 20260807, runs = 1000): SimulationBatch {
	let randomState = seed >>> 0;
	const random = () => {
		randomState ^= randomState << 13; randomState ^= randomState >>> 17; randomState ^= randomState << 5;
		return (randomState >>> 0) / 0x100000000;
	};
	let testerVictories = 0, gameVictories = 0, terminalWaves = 0;
	for (let run = 0; run < runs; run += 1) {
		const firstTowerWave = random() < 0.72 ? 2 : 3;
		const growth = random() < 0.68 ? 2 : 1;
		const result = simulateProfile({
			name: `balayage-${run}`,
			towersAtWave: (wave) => Math.min(8, Math.max(0, (wave - firstTowerWave + 1) * growth))
		});
		if (result.result === 'tester-victory') testerVictories += 1;
		else gameVictories += 1;
		terminalWaves += result.wave;
	}
	return { runs, testerVictories, gameVictories, averageTerminalWave: terminalWaves / runs };
}

export function simulatePrimaryDefenseOpening() {
	const state = createGame(20260808);
	const kit: [string, BuildingId][] = [['0:0','storage'],['0:1','energy'],['1:0','maintenance'],['-1:0','workshop'],['-2:2','extractor-organic'],['-2:0','extractor-mineral'],['0:-1','defense-factory']];
	for (const [cell, building] of kit) { const error = placeBuilding(state, cell, building); if (error) throw new Error(error); }
	const queued = queueProduction(state, '0:-1', 'weakening-tower');
	if (queued) throw new Error(`Tour primaire inaccessible : ${queued}`);
	const first = resolveCycle(state, 1), second = resolveCycle(state, 0);
	if (typeof first === 'string' || typeof second === 'string') throw new Error('Résolution économique impossible.');
	const tower = state.inventory.find((entry) => entry.id === 'weakening-tower')?.quantity ?? 0;
	if (tower !== 1 || (state.research.completed.transformation ?? 0) !== 0) throw new Error('La défense primaire dépend encore de Transformation.');
	return { profile: 'ouverture primaire P02.2', towerReadyAtCycle: state.turn, transformation: false, organic: state.resources.organic, mineral: state.resources.mineral, forcedWaits: [first, second].filter((result) => result.idleClassification === 'forced_wait').length };
}

if (process.argv[1]?.endsWith('simulation.ts')) {
	for (const profile of SIMULATION_PROFILES) console.log(JSON.stringify(simulateProfile(profile)));
	console.log(JSON.stringify(simulatePrimaryDefenseOpening()));
	console.log(JSON.stringify({ profile: 'balayage reproductible', ...simulateBatch() }));
}
