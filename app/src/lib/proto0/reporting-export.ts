import type {
	PlayerWaveReport,
	WaveReportingBundle
} from './domain/reporting.js';
import type {
	WaveState
} from './domain/wave.js';

function formatNumber(
	value: number
): string {
	return Number.isInteger(
		value
	)
		? String(value)
		: value.toFixed(3)
			.replace(
				/0+$/,
				''
			)
			.replace(
				/\.$/,
				''
			);
}

function formatWave(
	wave: WaveState
): string {
	return [
		`pression ${formatNumber(wave.pressure)}`,
		`structure ${formatNumber(wave.structure)}`,
		`charge ${formatNumber(wave.charge)}`,
		`matière capturable ${formatNumber(wave.capturableMatter)}`
	].join(' ; ');
}

export function exportWaveReportingMachine(
	bundle:
		WaveReportingBundle
): string {
	return JSON.stringify(
		bundle,
		null,
		2
	);
}

export function exportPlayerWaveReportReadable(
	report:
		PlayerWaveReport
): string {
	const lines: string[] = [
		'PROTO-0 — Rapport de fin de vague',
		'',
		`Session : ${report.runId}`,
		`Corcite : ${report.corciteId}`,
		`Tour : ${report.turn}`,
		'',
		`Résultat : ${report.summary.title}`,
		report.summary.message,
		`Matière captée : ${formatNumber(report.summary.capturedMatter)}`,
		'',
		'Prévision la plus précise (T−1)',
		formatWave(
			report.details
				.forecastWave
		),
		'',
		'Vague réellement rencontrée',
		formatWave(
			report.details
				.actualWave
		),
		'',
		'Avant traitement TD',
		formatWave(
			report.details
				.initialWave
		),
		'',
		'Après traitement TD',
		formatWave(
			report.details
				.finalWave
		),
		'',
		'Effets successifs'
	];

	for (
		const step of
		report.details.towerEffects
	) {
		if (!step.tower) {
			lines.push(
				`${step.position}. Position vide`
			);
			continue;
		}

		lines.push(
			`${step.position}. ${step.tower.label} — ${formatWave(step.before)} → ${formatWave(step.after)}`
		);
	}

	lines.push(
		'',
		'Consommations pertinentes'
	);

	if (
		report.details
			.consumptions.length ===
		0
	) {
		lines.push(
			'Aucune consommation pertinente enregistrée.'
		);
	} else {
		for (
			const consumption of
			report.details
				.consumptions
		) {
			lines.push(
				`- ${consumption.resourceId} : ${formatNumber(consumption.amount)} (${consumption.source})`
			);
		}
	}

	lines.push(
		'',
		'Connaissance produite'
	);

	if (
		report.details
			.knowledgeProduced.length ===
		0
	) {
		lines.push(
			'Aucune connaissance produite.'
		);
	} else {
		for (
			const knowledge of
			report.details
				.knowledgeProduced
		) {
			lines.push(
				`- ${knowledge.key} : ${formatNumber(knowledge.value)}`
			);
		}
	}

	return lines.join('\n');
}
