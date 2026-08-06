import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createPlayableBrowserSession,
	parsePlayableBrowserSave,
	serializePlayableBrowserSave
} from '../../src/lib/proto0/index.js';

test('la sauvegarde navigateur versionnée se restaure sans perte', () => {
	const state = createPlayableBrowserSession({
		testerCode: 'IRFI',
		seed: 20260806,
		runId: 'p02-save-roundtrip'
	});

	assert.deepEqual(
		parsePlayableBrowserSave(serializePlayableBrowserSave(state)),
		state
	);
});

test('une sauvegarde corrompue ou incompatible est rejetée proprement', () => {
	assert.equal(parsePlayableBrowserSave('{'), null);
	assert.equal(parsePlayableBrowserSave('{"version":999,"state":{}}'), null);
	assert.equal(parsePlayableBrowserSave('{"version":1,"state":{}}'), null);
});

test('une sauvegarde dont le Corcite ou le cycle est invalide est rejetée', () => {
	const state = createPlayableBrowserSession({ testerCode: 'IRFI', seed: 7 });
	const invalidCorcite = JSON.parse(serializePlayableBrowserSave(state));
	invalidCorcite.state.corcite.population.total = 0;
	assert.equal(parsePlayableBrowserSave(JSON.stringify(invalidCorcite)), null);

	const invalidWave = JSON.parse(serializePlayableBrowserSave(state));
	invalidWave.state.waveCycle.schemaVersion = 999;
	assert.equal(parsePlayableBrowserSave(JSON.stringify(invalidWave)), null);
});
