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
