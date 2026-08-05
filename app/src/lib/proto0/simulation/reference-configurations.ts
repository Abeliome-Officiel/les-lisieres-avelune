import {
	TD_TOWER_DEFINITION_IDS,
	type TdTowerDefinitionId
} from '../domain/td.js';

export type TdReferenceConfigurationKind =
	| 'four-family-permutation'
	| 'paired-family-order';

export interface TdReferenceConfiguration {
	id: string;
	kind: TdReferenceConfigurationKind;
	order: TdTowerDefinitionId[];
}

function uniquePermutations(
	values: readonly TdTowerDefinitionId[]
): TdTowerDefinitionId[][] {
	if (values.length === 0) {
		return [[]];
	}

	const permutations:
		TdTowerDefinitionId[][] = [];

	const seen =
		new Set<string>();

	function visit(
		prefix: TdTowerDefinitionId[],
		remaining: TdTowerDefinitionId[]
	): void {
		if (
			remaining.length === 0
		) {
			const key =
				prefix.join('|');

			if (!seen.has(key)) {
				seen.add(key);
				permutations.push(
					[...prefix]
				);
			}

			return;
		}

		for (
			let index = 0;
			index <
				remaining.length;
			index += 1
		) {
			visit(
				[
					...prefix,
					remaining[index]
				],
				[
					...remaining.slice(
						0,
						index
					),
					...remaining.slice(
						index + 1
					)
				]
			);
		}
	}

	visit(
		[],
		[...values]
	);

	return permutations;
}

function createReferenceConfigurations():
	TdReferenceConfiguration[] {
	const configurations:
		TdReferenceConfiguration[] = [];

	const fourFamilyPermutations =
		uniquePermutations(
			TD_TOWER_DEFINITION_IDS
		);

	for (
		const order of
		fourFamilyPermutations
	) {
		configurations.push({
			id:
				`td-reference-${String(
					configurations.length +
						1
				).padStart(3, '0')}`,
			kind:
				'four-family-permutation',
			order
		});
	}

	for (
		let firstIndex = 0;
		firstIndex <
			TD_TOWER_DEFINITION_IDS.length;
		firstIndex += 1
	) {
		for (
			let secondIndex =
				firstIndex + 1;
			secondIndex <
				TD_TOWER_DEFINITION_IDS.length;
			secondIndex += 1
		) {
			const first =
				TD_TOWER_DEFINITION_IDS[
					firstIndex
				];

			const second =
				TD_TOWER_DEFINITION_IDS[
					secondIndex
				];

			const orders =
				uniquePermutations([
					first,
					first,
					second,
					second
				]);

			for (
				const order of
				orders
			) {
				configurations.push({
					id:
						`td-reference-${String(
							configurations.length +
								1
						).padStart(
							3,
							'0'
						)}`,
					kind:
						'paired-family-order',
					order
				});
			}
		}
	}

	if (
		configurations.length !==
		60
	) {
		throw new Error(
			`Référence P9 invalide : ${configurations.length} configurations au lieu de 60.`
		);
	}

	const uniqueOrders =
		new Set(
			configurations.map(
				(configuration) =>
					configuration.order.join(
						'|'
					)
			)
		);

	if (
		uniqueOrders.size !==
		60
	) {
		throw new Error(
			'Référence P9 invalide : les 60 configurations TD doivent être uniques.'
		);
	}

	return configurations;
}

export const PROTO0_REFERENCE_TD_CONFIGURATIONS =
	createReferenceConfigurations();
