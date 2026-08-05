import assert from 'node:assert/strict';
import test from 'node:test';

import {
	createBrowserSession,
	getBrowserVisibleForecast,
	getStoredAmount,
	prepareBrowserTower,
	resolveBrowserTurn,
	resolveBrowserWave,
	startBrowserResearch
} from '../../src/lib/proto0/index.js';

function createSession() {
	return createBrowserSession({
		testerCode: 'IRFI',
		seed: 20260804,
		runId: 'P10-RUN'
	});
}

test("l'interface crée une session moteur avec un Corcite humain", () => {
	const state =
		createSession();

	assert.equal(
		state.session.runId,
		'P10-RUN'
	);

	assert.equal(
		state.corcite.controller,
		'human'
	);

	assert.equal(
		state.currentTurn,
		1
	);

	assert.equal(
		state.waveResolved,
		false
	);
});

test("résoudre un tour utilise le moteur TF et fait avancer le temps", () => {
	const initial =
		createSession();

	const result =
		resolveBrowserTurn(
			initial
		);

	assert.equal(
		result.currentTurn,
		2
	);

	assert.equal(
		result.lastResolvedTurn,
		1
	);

	assert.ok(
		result.lastTf
	);

	assert.ok(
		result.lastTf.extraction
			.events.length >
			0
	);

	assert.equal(
		initial.currentTurn,
		1
	);
});

test("la recherche RPG démarrée depuis l'interface progresse et s'achève via les tours", () => {
	let state =
		startBrowserResearch(
			createSession()
		);

	state =
		resolveBrowserTurn(
			state
		);

	state =
		resolveBrowserTurn(
			state
		);

	state =
		resolveBrowserTurn(
			state
		);

	const research =
		state.corcite.rpg
			.researches[0];

	assert.equal(
		research.status,
		'completed'
	);

	assert.equal(
		state.corcite.modifiers
			.some(
				(modifier) =>
					modifier.active
			),
		true
	);
});

test("préparer Atténuation passe par les réservations puis consomme réellement R3 et R4", () => {
	const initial =
		createSession();

	const beforeR3 =
		getStoredAmount(
			initial.corcite,
			'R3'
		);

	const beforeR4 =
		getStoredAmount(
			initial.corcite,
			'R4'
		);

	const prepared =
		prepareBrowserTower(
			initial,
			1,
			'attenuation-n1'
		);

	assert.equal(
		getStoredAmount(
			prepared.corcite,
			'R3'
		),
		beforeR3 - 2
	);

	assert.equal(
		getStoredAmount(
			prepared.corcite,
			'R4'
		),
		beforeR4 - 1
	);

	assert.equal(
		prepared.corcite.td
			.positions[0]
			.tower
			?.definitionId,
		'attenuation-n1'
	);

	assert.equal(
		prepared.corcite
			.reservations
			.filter(
				(reservation) =>
					reservation.status ===
						'consumed'
			)
			.length >
			0,
		true
	);

	assert.deepEqual(
		prepared.waveConsumptions
			.map(
				(consumption) => [
					consumption.resourceId,
					consumption.amount
				]
			)
			.sort(),
		[
			['R3', 2],
			['R4', 1]
		]
	);
});

test("une préparation Atténuation sans R4 reste bloquée et ne place aucune tour", () => {
	const initial =
		createSession();

	for (
		const storage of
		initial.corcite.storageUnits
	) {
		storage.contents.R4 =
			0;
	}

	const prepared =
		prepareBrowserTower(
			initial,
			1,
			'attenuation-n1'
		);

	assert.equal(
		prepared.corcite.td
			.positions[0]
			.tower,
		null
	);

	assert.match(
		prepared.statusMessage,
		/bloquée/
	);
});

test("les quatre familles TD peuvent être placées sur des positions distinctes", () => {
	let state =
		createSession();

	state =
		prepareBrowserTower(
			state,
			1,
			'attenuation-n1'
		);

	state =
		prepareBrowserTower(
			state,
			2,
			'destructuration-n1'
		);

	state =
		prepareBrowserTower(
			state,
			3,
			'captation-n1'
		);

	state =
		prepareBrowserTower(
			state,
			4,
			'stabilisation-n1'
		);

	assert.deepEqual(
		state.corcite.td
			.positions
			.slice(0, 4)
			.map(
				(position) =>
					position.tower
						?.definitionId
			),
		[
			'attenuation-n1',
			'destructuration-n1',
			'captation-n1',
			'stabilisation-n1'
		]
	);
});

test("les prévisions apparaissent uniquement dans les trois derniers tours", () => {
	let state =
		createSession();

	assert.equal(
		getBrowserVisibleForecast(
			state
		),
		null
	);

	for (
		let index = 0;
		index < 7;
		index += 1
	) {
		state =
			resolveBrowserTurn(
				state
			);
	}

	assert.equal(
		state.currentTurn,
		8
	);

	assert.equal(
		getBrowserVisibleForecast(
			state
		)?.label,
		'T−3'
	);

	state =
		resolveBrowserTurn(
			state
		);

	assert.equal(
		getBrowserVisibleForecast(
			state
		)?.label,
		'T−2'
	);

	state =
		resolveBrowserTurn(
			state
		);

	assert.equal(
		getBrowserVisibleForecast(
			state
		)?.label,
		'T−1'
	);
});

test("la vague ne peut pas être résolue avant la fin des dix tours", () => {
	assert.throws(
		() =>
			resolveBrowserWave(
				createSession()
			),
		/dixième tour/
	);
});

test("le parcours navigateur complet produit rapport joueur et journal technique distincts", () => {
	let state =
		createSession();

	state =
		startBrowserResearch(
			state
		);

	state =
		prepareBrowserTower(
			state,
			1,
			'attenuation-n1'
		);

	state =
		prepareBrowserTower(
			state,
			2,
			'destructuration-n1'
		);

	state =
		prepareBrowserTower(
			state,
			3,
			'captation-n1'
		);

	state =
		prepareBrowserTower(
			state,
			4,
			'stabilisation-n1'
		);

	for (
		let turn = 1;
		turn <= 10;
		turn += 1
	) {
		state =
			resolveBrowserTurn(
				state
			);
	}

	assert.equal(
		state.waveReady,
		true
	);

	state =
		resolveBrowserWave(
			state
		);

	assert.equal(
		state.waveResolved,
		true
	);

	assert.ok(
		state.playerReport
	);

	assert.ok(
		state.technicalLog
	);

	assert.equal(
		state.playerReport.schema,
		'avelune.proto0.player-wave-report'
	);

	assert.equal(
		state.technicalLog.schema,
		'avelune.proto0.technical-log'
	);

	assert.equal(
		state.corcite
			.waveConsequences.length,
		1
	);

	assert.equal(
		state.playerReport
			.details
			.towerEffects.length,
		8
	);
});
