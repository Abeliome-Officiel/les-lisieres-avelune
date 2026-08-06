import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createPlayableCorciteState,
	getStructureAssignedWork,
	recalculatePlayableCapacities,
	resolvePlayableTfTurn,
	setPlayableStructureActive,
	setPlayableStructureStaffed
} from '../../src/lib/proto0/index.js';

function withExtractor() {
	const state = createPlayableCorciteState({ id: 'population-control', name: 'Population', controller: 'human' });
	state.structures.push({
		id: 'extractor', kind: 'extractor-a-n1', name: 'Extracteur', status: 'active',
		assignedWork: 1,
		usage: { energy: 1, maintenance: 1, work: 1, space: 2 }
	});
	recalculatePlayableCapacities(state);
	return state;
}

test('OFF libère l’énergie mais conserve la population affectée', () => {
	const off = setPlayableStructureActive(withExtractor(), 'extractor', false);
	assert.equal(off.capacities.energy.used, 0);
	assert.equal(off.capacities.work.used, 1);
	assert.equal(getStructureAssignedWork(off.structures.at(-1)!), 1);
});

test('retirer la population libère le travail et suspend la production', () => {
	const unstaffed = setPlayableStructureStaffed(withExtractor(), 'extractor', false);
	assert.equal(unstaffed.capacities.work.used, 0);
	assert.equal(unstaffed.structures.at(-1)?.status, 'active');
	assert.equal(resolvePlayableTfTurn(unstaffed, 1).extraction.events[0].status, 'inactive');
});
