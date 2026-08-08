import assert from 'node:assert/strict';
import test from 'node:test';
import { RECIPES, createGame, placeBuilding, productionAvailability, productionDuration, queueProduction, resolveCycle, type BuildingId } from '../../src/lib/proto02/game.js';

function deployed() {
	const state = createGame(7);
	const kit: [string, BuildingId][] = [['0:0','storage'],['0:1','energy'],['1:0','maintenance'],['-1:0','workshop'],['-2:2','extractor-organic'],['-2:0','extractor-mineral'],['0:-1','defense-factory']];
	for (const [cell, building] of kit) assert.equal(placeBuilding(state, cell, building), null);
	return state;
}

test('les coûts P02.2 sont asymétriques et la première Tour ne dépend que des matières primaires', () => {
	assert.deepEqual(RECIPES.component.cost, { organic: 0, mineral: 1, refined: 1, component: 0 });
	assert.deepEqual(RECIPES.storage.cost, { organic: 3, mineral: 0, refined: 1, component: 0 });
	assert.deepEqual(RECIPES.energy.cost, { organic: 0, mineral: 3, refined: 1, component: 0 });
	assert.deepEqual(RECIPES['weakening-tower'].cost, { organic: 1, mineral: 3, refined: 0, component: 0 });
	assert.equal(RECIPES['weakening-tower'].requires, undefined);
	const state = deployed();
	assert.equal(queueProduction(state, '0:-1', 'weakening-tower'), null);
});

test('les temporalités suivent la grammaire 1/2 cycles avec plancher à 1', () => {
	const state = deployed();
	assert.equal(productionDuration(state, 'component'), 1);
	assert.equal(productionDuration(state, 'storage'), 2);
	state.research.completed['better-fabrication'] = 1;
	assert.equal(productionDuration(state, 'component'), 1);
	assert.equal(productionDuration(state, 'storage'), 1);
});

test('une indisponibilité de Production expose toutes les causes exactes', () => {
	const state = deployed();
	state.resources = { organic: 0, mineral: 1, refined: 0, component: 0 };
	const availability = productionAvailability(state, '0:-1', 'weakening-tower');
	assert.equal(availability.available, false);
	assert.deepEqual(availability.reasons, ['Manque 1 Organique.', 'Manque 2 Minéral.']);
});

test('le résultat de cycle est structuré, exhaustif et classifie attente volontaire', () => {
	const state = deployed();
	assert.equal(queueProduction(state, '0:-1', 'weakening-tower'), null);
	const result = resolveCycle(state, 1);
	assert.equal(typeof result, 'object');
	if (typeof result === 'string') return;
	assert.equal(result.cycle, 1);
	assert.equal(result.idleClassification, 'not_idle');
	assert.ok(result.events.some((event) => event.type === 'production_started'));
	assert.ok(result.events.some((event) => event.type === 'production_progressed'));
	assert.ok(result.events.some((event) => event.type === 'resource_produced' && event.resource === 'organic'));
	const wait = resolveCycle(state, 0);
	assert.equal(typeof wait === 'string' ? wait : wait.idleClassification, 'voluntary_wait');
});

test('un cycle sans action utile est classé forced_wait avec causes', () => {
	const state = deployed();
	state.resources = { organic: 0, mineral: 0, refined: 0, component: 0 };
	for (const cell of state.board) if (cell.building?.definitionId.includes('extractor')) cell.building.active = false;
	const result = resolveCycle(state, 0);
	assert.equal(typeof result === 'string' ? result : result.idleClassification, 'forced_wait');
	if (typeof result !== 'string') assert.ok(result.forcedWaitCauses.includes('insufficient_resources'));
});
