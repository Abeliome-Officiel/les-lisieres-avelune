import assert from 'node:assert/strict';
import test from 'node:test';
import {
	LAB, capacities, collectBlockedOutput, createGame, dismantle, endTurn, placeBuilding, placeTower,
	placementPreview, queueProduction, restoreGame, serializeGame, wavePower
} from '../../src/lib/proto02/game.js';
import { SIMULATION_PROFILES, simulateProfile } from '../../src/lib/proto02/simulation.js';

function placeKit() {
	const state = createGame(42);
	const placements = [
		['0:0', 'storage'], ['0:1', 'energy'], ['1:0', 'maintenance'], ['-1:0', 'workshop'],
		['-2:2', 'extractor-organic'], ['-2:0', 'extractor-mineral'],
		['0:-1', 'defense-factory']
	] as const;
	for (const [cell, building] of placements) assert.equal(placeBuilding(state, cell, building), null);
	return state;
}

test('le kit démarre hors plateau et le stockage doit être posé en premier', () => {
	const state = createGame();
	assert.equal(state.board.every((cell) => cell.building === null), true);
	assert.equal(capacities(state).storage, 0);
	assert.match(placeBuilding(state, '0:0', 'energy') ?? '', /première implantation/);
	assert.equal(placeBuilding(state, '0:0', 'storage'), null);
	assert.equal(capacities(state).storage, 16);
});

test('le plateau prévisualise la compatibilité sans interdire un extracteur', () => {
	const state = createGame();
	const organic = state.board.find((cell) => cell.ground === 'organic')!;
	const neutral = state.board.find((cell) => cell.ground === null)!;
	assert.match(placementPreview(state, organic.id, 'extractor-organic'), /\+2/);
	assert.match(placementPreview(state, neutral.id, 'extractor-organic'), /^0/);
});

test('le déploiement complet lance une économie sans espace abstrait', () => {
	const state = placeKit();
	assert.equal(state.deployment, false);
	const before = state.resources.organic + state.resources.mineral;
	assert.equal(endTurn(state), null);
	assert.ok(state.resources.organic + state.resources.mineral > before);
	assert.ok(capacities(state).energyUsed <= capacities(state).energy);
});

test('un stockage chargé ne peut pas être retiré et un remontage prend un cycle', () => {
	const state = placeKit();
	assert.match(dismantle(state, '0:0') ?? '', /stock ne tiendrait/);
	state.resources = { organic: 0, mineral: 0, refined: 0, component: 0 };
	assert.equal(dismantle(state, '0:0'), null);
	assert.match(placeBuilding(state, '0:0', 'storage') ?? '', /cycle 2/);
	assert.equal(endTurn(state), null);
	assert.equal(placeBuilding(state, '0:0', 'storage'), null);
});

test('la sauvegarde P02 est versionnée et rejette les données incompatibles', () => {
	const state = placeKit();
	assert.deepEqual(restoreGame(serializeGame(state)), state);
	assert.equal(restoreGame('{"version":1}'), null);
	assert.equal(restoreGame('cassé'), null);
});

test('les coûts sont réservés physiquement puis consommés au démarrage', () => {
	const state = placeKit();
	const before = { ...state.resources };
	assert.equal(queueProduction(state, '-1:0', 'recycler'), null);
	assert.deepEqual(state.resources, before);
	assert.equal(state.reserved.organic, 2);
	assert.equal(state.reserved.mineral, 2);
	assert.equal(endTurn(state), null);
	assert.equal(state.reserved.organic, 0);
	assert.equal(state.resources.organic, before.organic);
});

test('une sortie pleine reste localement bloquée sans perte', () => {
	const state = placeKit();
	state.resources = { organic: 8, mineral: 8, refined: 0, component: 0 };
	assert.equal(endTurn(state), null);
	const extractor = state.board.find((cell) => cell.building?.definitionId === 'extractor-organic')!.building!;
	assert.deepEqual(extractor.blockedOutput, { id: 'organic', quantity: 2 });
	state.resources.mineral -= 2;
	assert.equal(collectBlockedOutput(state, '-2:2'), null);
	assert.equal(extractor.blockedOutput, null);
});

test('la puissance croît strictement et les trajectoires finissent', () => {
	for (let wave = 2; wave < 20; wave += 1) assert.ok(wavePower(wave) > wavePower(wave - 1));
	const results = SIMULATION_PROFILES.map((profile) => simulateProfile(profile));
	assert.equal(results[0].result, 'tester-victory');
	assert.equal(results[1].result, 'game-victory');
	assert.equal(results[2].result, 'game-victory');
	assert.equal(results[3].result, 'tester-victory');
});

test('une tour est un objet physique placé dans un ordre tactique', () => {
	const state = createGame();
	state.inventory.push({ id: 'weakening-tower', quantity: 1, dismantled: 0 });
	assert.equal(placeTower(state, 3), null);
	assert.equal(state.defenses[2].tower, true);
	assert.equal(state.inventory.find((item) => item.id === 'weakening-tower')?.quantity, 0);
	assert.equal(LAB.towerWeakening, 9);
});
