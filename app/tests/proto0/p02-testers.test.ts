import assert from 'node:assert/strict';
import test from 'node:test';
import { createGame } from '../../src/lib/proto02/game.js';
import { TESTER_IDS, loadTesterGame, saveTesterGame, testerSaveKey } from '../../src/lib/proto02/testers.js';

class MemoryStore {
	items = new Map<string, string>();
	getItem(key: string) { return this.items.get(key) ?? null; }
	setItem(key: string, value: string) { this.items.set(key, value); }
}

test('les cinq profils et leurs clés v3 sont uniques', () => {
	assert.deepEqual(TESTER_IDS, ['IRFI', 'AUBE', 'BRUM', 'ORBE', 'SILE']);
	assert.equal(new Set(TESTER_IDS).size, 5);
	const keys = TESTER_IDS.map(testerSaveKey);
	assert.equal(new Set(keys).size, 5);
	TESTER_IDS.forEach((tester, index) => assert.match(keys[index], new RegExp(`:v3:${tester}$`)));
});

test('sauvegarder ou recommencer un profil ne modifie aucun autre profil', () => {
	const store = new MemoryStore();
	const irfi = createGame(); irfi.turn = 7;
	const aube = createGame(); aube.turn = 12;
	saveTesterGame(store, 'IRFI', irfi);
	saveTesterGame(store, 'AUBE', aube);
	saveTesterGame(store, 'IRFI', createGame());
	assert.equal(loadTesterGame(store, 'IRFI').state.turn, 1);
	assert.equal(loadTesterGame(store, 'AUBE').state.turn, 12);
});

test('une sauvegarde invalide est isolée à son profil', () => {
	const store = new MemoryStore();
	const sile = createGame(); sile.turn = 9;
	store.setItem(testerSaveKey('ORBE'), '{invalide');
	saveTesterGame(store, 'SILE', sile);
	const invalid = loadTesterGame(store, 'ORBE');
	assert.equal(invalid.invalid, true);
	assert.equal(invalid.state.turn, 1);
	assert.equal(loadTesterGame(store, 'SILE').state.turn, 9);
});
