import {
	TD_LAB_REFERENCE
} from '../config/td-reference.js';
import type {
	TdTowerFamily,
	TdWaveDelta
} from '../domain/td.js';
import type {
	WaveState
} from '../domain/wave.js';

export interface TdTowerEffectResult {
	wave: WaveState;
	effect: TdWaveDelta;
}

function clamp(
	value: number,
	minimum: number,
	maximum: number
): number {
	return Math.max(
		minimum,
		Math.min(
			maximum,
			value
		)
	);
}

function nonNegative(
	value: number
): number {
	return Math.max(
		0,
		value
	);
}

function createDelta(
	before: WaveState,
	after: WaveState,
	capturedMatter = 0
): TdWaveDelta {
	return {
		pressure:
			after.pressure -
			before.pressure,
		structure:
			after.structure -
			before.structure,
		charge:
			after.charge -
			before.charge,
		capturableMatter:
			after.capturableMatter -
			before.capturableMatter,
		capturedMatter
	};
}

function attenuation(
	before: WaveState
): TdTowerEffectResult {
	const coefficients =
		TD_LAB_REFERENCE
			.coefficients
			.attenuation;

	const structureFactor =
		clamp(
			before.structure /
				TD_LAB_REFERENCE
					.referenceStructure,
			coefficients
				.structureFactorMinimum,
			coefficients
				.structureFactorMaximum
		);

	const pressureReduction =
		Math.min(
			before.pressure,
			coefficients
				.basePressureReduction *
				structureFactor
		);

	const matterLoss =
		Math.min(
			before.capturableMatter,
			pressureReduction *
				coefficients
					.capturableMatterLossPerPressure
		);

	const after: WaveState = {
		pressure:
			nonNegative(
				before.pressure -
					pressureReduction
			),
		structure:
			before.structure +
				coefficients
					.structureIncrease,
		charge:
			before.charge,
		capturableMatter:
			nonNegative(
				before.capturableMatter -
					matterLoss
			)
	};

	return {
		wave: after,
		effect:
			createDelta(
				before,
				after
			)
	};
}

function destructuration(
	before: WaveState
): TdTowerEffectResult {
	const coefficients =
		TD_LAB_REFERENCE
			.coefficients
			.destructuration;

	const after: WaveState = {
		pressure:
			nonNegative(
				before.pressure -
					coefficients
						.pressureReduction
			),
		structure:
			nonNegative(
				before.structure -
					coefficients
						.structureReduction
			),
		charge:
			before.charge +
				coefficients
					.chargeIncrease,
		capturableMatter:
			before.capturableMatter
	};

	return {
		wave: after,
		effect:
			createDelta(
				before,
				after
			)
	};
}

function captation(
	before: WaveState
): TdTowerEffectResult {
	const coefficients =
		TD_LAB_REFERENCE
			.coefficients
			.captation;

	const structureFactor =
		clamp(
			1 +
				(
					TD_LAB_REFERENCE
						.referenceStructure -
					before.structure
				) /
					TD_LAB_REFERENCE
						.referenceStructure,
			coefficients
				.structureFactorMinimum,
			coefficients
				.structureFactorMaximum
		);

	const capturedMatter =
		Math.min(
			before.capturableMatter,
			coefficients.baseCapture *
				structureFactor
		);

	const after: WaveState = {
		pressure:
			nonNegative(
				before.pressure -
					capturedMatter *
						coefficients
							.pressureReductionPerCaptured
			),
		structure:
			before.structure,
		charge:
			before.charge +
				coefficients
					.chargeIncrease,
		capturableMatter:
			nonNegative(
				before.capturableMatter -
					capturedMatter
			)
	};

	return {
		wave: after,
		effect:
			createDelta(
				before,
				after,
				capturedMatter
			)
	};
}

function stabilisation(
	before: WaveState
): TdTowerEffectResult {
	const coefficients =
		TD_LAB_REFERENCE
			.coefficients
			.stabilisation;

	const neutralisedCharge =
		before.charge *
			coefficients
				.chargeNeutralisationRatio;

	const after: WaveState = {
		pressure:
			before.pressure +
				neutralisedCharge *
					coefficients
						.pressureReturnPerNeutralisedCharge,
		structure:
			before.structure +
				coefficients
					.structureIncrease,
		charge:
			nonNegative(
				before.charge -
					neutralisedCharge
			),
		capturableMatter:
			before.capturableMatter
	};

	return {
		wave: after,
		effect:
			createDelta(
				before,
				after
			)
	};
}

export function applyTdTowerEffect(
	family: TdTowerFamily,
	before: WaveState
): TdTowerEffectResult {
	switch (family) {
		case 'attenuation':
			return attenuation(
				before
			);

		case 'destructuration':
			return destructuration(
				before
			);

		case 'captation':
			return captation(
				before
			);

		case 'stabilisation':
			return stabilisation(
				before
			);
	}
}
