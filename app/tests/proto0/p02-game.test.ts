import assert from 'node:assert/strict';
import test from 'node:test';
import {
	LAB, cancelProduction, capacities, collectBlockedOutput, createGame, dismantle, endTurn, placeBuilding, placeTower,
	placementPreview, queueProduction, recycleItem, restoreGame, serializeGame, startResearch, wavePower
} from '../../src/lib/proto02/game.js';
import { SIMULATION_PROFILES, simulateBatch, simulateProfile } from '../../src/lib/proto02/simulation.js';

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

test('le kit et les ressources démarrent hors du stockage mécanique', () => {
	const state = createGame();
	assert.equal(state.board.every((cell) => cell.building === null), true);
	assert.deepEqual(capacities(state), { storage: 0, load: 0, energy: 0, energyUsed: 0, maintenance: 0, maintenanceUsed: 0, population: 8, populationUsed: 0 });
	assert.equal(state.deploymentKit.length, 7);
	assert.deepEqual(state.resources, { organic: 0, mineral: 0, refined: 0, component: 0 });
	assert.deepEqual(state.deploymentResources, { organic: 4, mineral: 4, refined: 0, component: 0 });
	assert.equal(state.inventory.length, 0);

	assert.match(placeBuilding(state, '0:0', 'energy') ?? '', /première implantation/);
	assert.match(startResearch(state, 'transformation') ?? '', /déploiement initial/);
	state.inventory.push({ id: 'weakening-tower', quantity: 1, dismantled: 0 });
	assert.match(placeTower(state, 1) ?? '', /déploiement initial/);
	assert.match(endTurn(state) ?? '', /déploiement du kit initial/);
});

test('la première membrane active le stock économique sans y ranger le kit', () => {
	const state = createGame();
	assert.equal(placeBuilding(state, '0:0', 'storage'), null);
	assert.deepEqual({ storage: capacities(state).storage, load: capacities(state).load }, { storage: 16, load: 8 });
	assert.equal(state.resources.organic, 4);
	assert.equal(state.resources.mineral, 4);
	assert.equal(state.deploymentKit.length, 6);
	assert.equal(state.inventory.length, 0);

	const load = capacities(state).load;
	const placements = [
		['0:1', 'energy'], ['1:0', 'maintenance'], ['-1:0', 'workshop'],
		['-2:2', 'extractor-organic'], ['-2:0', 'extractor-mineral'], ['0:-1', 'defense-factory']
	] as const;
	for (const [cell, building] of placements) {
		assert.equal(placeBuilding(state, cell, building), null);
		assert.equal(capacities(state).load, load);
	}
	assert.equal(state.deployment, false);
	assert.deepEqual(state.deploymentKit, []);
	assert.equal(startResearch(state, 'transformation'), null);
});

test('le plateau prévisualise la compatibilité sans interdire un extracteur', () => {
	const state = createGame();
	const organic = state.board.find((cell) => cell.ground === 'organic')!;
	const neutral = state.board.find((cell) => cell.ground === null)!;
	assert.match(placementPreview(state, organic.id, 'extractor-organic'), /\+2/);
	assert.match(placementPreview(state, neutral.id, 'extractor-organic'), /^0/);
});

test('la densité visuelle de laboratoire conserve deux gisements de chaque matière', () => {
	const state = createGame();
	assert.equal(state.board.filter((cell) => cell.ground === 'organic').length, 2);
	assert.equal(state.board.filter((cell) => cell.ground === 'mineral').length, 2);
	assert.equal(state.board.find((cell) => cell.id === '-2:2')?.ground, 'organic');
	assert.equal(state.board.find((cell) => cell.id === '-2:0')?.ground, 'mineral');
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
	assert.equal(restoreGame('{"version":2,"board":[],"inventory":[],"defenses":[],"turn":1}'), null);
	assert.equal(restoreGame('cassé'), null);
	assert.equal(restoreGame(JSON.stringify({ ...state, resources: { organic: -1, mineral: 0, refined: 0, component: 0 } })), null);
	assert.equal(restoreGame(JSON.stringify({ ...state, defenses: [] })), null);
	assert.equal(restoreGame(JSON.stringify({ ...state, research: { ...state.research, repeatableLevels: 5 } })), null);
	assert.equal(restoreGame(JSON.stringify({ ...state, board: state.board.map((cell, index) => index ? cell : { ...cell, building: { uid: 'x', definitionId: 'inconnu', active: true, staffed: true } }) })), null);
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

test('une transformation automatique ne consomme jamais les matières réservées', () => {
	const state = placeKit();
	state.research.completed.transformation = 1;
	state.inventory.push({ id: 'transformer', quantity: 1, dismantled: 0 });
	assert.equal(placeBuilding(state, '1:-1', 'transformer'), null);
	state.resources = { organic: 2, mineral: 2, refined: 0, component: 0 };
	assert.equal(queueProduction(state, '-1:0', 'recycler'), null);
	assert.equal(endTurn(state), null);
	assert.deepEqual(state.resources, { organic: 1, mineral: 1, refined: 2, component: 0 });
	assert.deepEqual(state.reserved, { organic: 0, mineral: 0, refined: 0, component: 0 });
});

test('un ordre non démarré est annulable sans dépense', () => {
	const state = placeKit();
	const before = { ...state.resources };
	assert.equal(queueProduction(state, '-1:0', 'recycler'), null);
	assert.equal(cancelProduction(state, '-1:0'), null);
	assert.deepEqual(state.resources, before);
	assert.deepEqual(state.reserved, { organic: 0, mineral: 0, refined: 0, component: 0 });
});

test('chaque niveau de recherche acheté garde un effet utile et la limite cumulée reste ferme', () => {
	const state = placeKit();
	state.research.completed.transformation = 1;
	state.research.completed['better-fabrication'] = 1;
	state.research.repeatableLevels = 1;
	assert.match(startResearch(state, 'better-fabrication') ?? '', /niveau utile maximal/);
	state.research.repeatableLevels = LAB.repeatableLimit;
	assert.match(startResearch(state, 'better-storage') ?? '', /limite de 4 niveaux/);
});

test('les objets produits ou démontés après le déploiement occupent le stockage normal', () => {
	const state = placeKit();
	for (const cell of state.board) if (cell.building?.definitionId.includes('extractor')) cell.building.active = false;
	assert.equal(capacities(state).load, 8);
	assert.equal(queueProduction(state, '-1:0', 'recycler'), null);
	assert.equal(endTurn(state), null);
	assert.equal(capacities(state).load, 4);
	assert.equal(endTurn(state), null);
	assert.equal(capacities(state).load, 5);
	assert.equal(state.inventory.find((entry) => entry.id === 'recycler')?.quantity, 1);
	assert.equal(dismantle(state, '0:-1'), null);
	assert.equal(capacities(state).load, 6);
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

test('les fournisseurs de capacité ne sont pas démontables si cela surcharge le Corcite', () => {
	const state = placeKit();
	assert.match(dismantle(state, '0:1') ?? '', /capacité énergétique restante/);
	assert.match(dismantle(state, '1:0') ?? '', /capacité d’entretien restante/);
	state.inventory.push({ id: 'energy', quantity: 1, dismantled: 0 }, { id: 'maintenance', quantity: 1, dismantled: 0 });
	assert.equal(placeBuilding(state, '1:-1', 'energy'), null);
	assert.equal(placeBuilding(state, '2:-1', 'maintenance'), null);
	assert.equal(dismantle(state, '0:1'), null);
	assert.equal(dismantle(state, '1:0'), null);
});

test('un objet neuf reste implantable même si un exemplaire démonté attend son remontage', () => {
	const state = placeKit();
	state.inventory.push({ id: 'recycler', quantity: 1, dismantled: 0 });
	assert.equal(dismantle(state, '0:-1'), null);
	const stack = state.inventory.find((entry) => entry.id === 'defense-factory')!;
	assert.equal(stack.dismantled, 1);
	stack.quantity += 1;
	assert.equal(placeBuilding(state, '0:-1', 'defense-factory'), null);
});

test('la Recyclerie exige activité et population et ne détruit rien si le stock est trop plein', () => {
	const state = placeKit();
	state.inventory.push({ id: 'recycler', quantity: 1, dismantled: 0 });
	assert.equal(placeBuilding(state, '1:-1', 'recycler'), null);
	state.inventory.push({ id: 'weakening-tower', quantity: 1, dismantled: 0 });
	state.resources = { organic: 8, mineral: 7, refined: 0, component: 0 };
	assert.match(recycleItem(state, 'weakening-tower') ?? '', /Libérez du stockage/);
	assert.equal(state.inventory.find((entry) => entry.id === 'weakening-tower')?.quantity, 1);
});

test('la puissance croît strictement et les trajectoires finissent', () => {
	for (let wave = 2; wave < 20; wave += 1) assert.ok(wavePower(wave) > wavePower(wave - 1));
	const results = SIMULATION_PROFILES.map((profile) => simulateProfile(profile));
	assert.equal(results[0].result, 'tester-victory');
	assert.equal(results[1].result, 'game-victory');
	assert.equal(results[2].result, 'game-victory');
	assert.equal(results[3].result, 'tester-victory');
	assert.equal(results[4].result, 'tester-victory');
	assert.equal(results[5].result, 'game-victory');
	const batch = simulateBatch(20260807, 1000);
	assert.equal(batch.runs, 1000);
	assert.ok(batch.testerVictories > 0);
	assert.ok(batch.gameVictories > 0);
	assert.deepEqual(simulateBatch(20260807, 1000), batch);
});

test('une tour est un objet physique placé dans un ordre tactique', () => {
	const state = placeKit();
	state.inventory.push({ id: 'weakening-tower', quantity: 1, dismantled: 0 });
	assert.equal(placeTower(state, 3), null);
	assert.equal(state.defenses[2].tower, true);
	assert.equal(state.inventory.find((item) => item.id === 'weakening-tower')?.quantity, 0);
	assert.equal(LAB.towerWeakening, 9);
});
