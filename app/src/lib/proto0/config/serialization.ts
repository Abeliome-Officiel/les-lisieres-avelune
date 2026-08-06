import { TESTER_CODES, type TesterCode } from '../domain/ids.js';
import type { Proto0SessionConfiguration } from '../domain/session.js';
import { validateSessionConfiguration } from './validate.js';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
	return typeof value === 'number' && Number.isFinite(value);
}

function isTesterCode(value: unknown): value is TesterCode {
	return (
		typeof value === 'string' &&
		TESTER_CODES.some((testerCode) => testerCode === value)
	);
}

function isProto0SessionConfiguration(
	value: unknown
): value is Proto0SessionConfiguration {
	if (!isRecord(value)) return false;

	if (
		value.schema !== 'avelune.proto0.session' ||
		value.schemaVersion !== 1 ||
		!isTesterCode(value.testerCode) ||
		!isFiniteNumber(value.seed) ||
		!isFiniteNumber(value.turns) ||
		value.waves !== 1 ||
		value.internalPathPositions !== 8 ||
		value.humanControlledCorcites !== 1 ||
		value.simulatedCorcites !== 4
	) {
		return false;
	}

	const wave = value.wave;

	if (!isRecord(wave)) return false;

	const nominal = wave.nominal;
	const variation = wave.variation;
	const forecast = wave.forecast;

	if (
		!isRecord(nominal) ||
		!isFiniteNumber(nominal.pressure) ||
		!isFiniteNumber(nominal.structure) ||
		!isFiniteNumber(nominal.charge) ||
		!isFiniteNumber(nominal.capturableMatter)
	) {
		return false;
	}

	if (
		!isRecord(variation) ||
		!isFiniteNumber(variation.minimumPercent) ||
		!isFiniteNumber(variation.maximumPercent)
	) {
		return false;
	}

	if (
		!isRecord(forecast) ||
		!isFiniteNumber(forecast.tMinus3Percent) ||
		!isFiniteNumber(forecast.tMinus2Percent) ||
		!isFiniteNumber(forecast.tMinus1Percent)
	) {
		return false;
	}

	return true;
}

export function serializeSessionConfiguration(
	config: Proto0SessionConfiguration
): string {
	const validation = validateSessionConfiguration(config);

	if (!validation.valid) {
		throw new Error(
			`Configuration PROTO-0 invalide : ${validation.errors.join(' | ')}`
		);
	}

	return JSON.stringify(config, null, 2);
}

export function deserializeSessionConfiguration(
	serialized: string
): Proto0SessionConfiguration {
	let parsed: unknown;

	try {
		parsed = JSON.parse(serialized) as unknown;
	} catch {
		throw new Error('Configuration PROTO-0 : JSON invalide.');
	}

	if (!isProto0SessionConfiguration(parsed)) {
		throw new Error(
			'Configuration PROTO-0 : structure JSON incompatible.'
		);
	}

	const validation = validateSessionConfiguration(parsed);

	if (!validation.valid) {
		throw new Error(
			`Configuration PROTO-0 invalide : ${validation.errors.join(' | ')}`
		);
	}

	return structuredClone(parsed);
}
