import { validateRpgState } from '../rpg/validate.js';
import {
        validateTdState,
        validateTdTowerState
} from '../td/validate.js';
import { validateTfNetworkState } from '../tf/network-validate.js';
import type { CorciteState } from '../domain/corcite.js';
import { RESOURCE_IDS } from '../domain/resources.js';

export interface CorciteValidationResult {
	valid: boolean;
	errors: string[];
}

function isNonNegativeFinite(value: number): boolean {
	return Number.isFinite(value) && value >= 0;
}

function findDuplicates(values: readonly string[]): string[] {
	const seen = new Set<string>();
	const duplicates = new Set<string>();

	for (const value of values) {
		if (seen.has(value)) duplicates.add(value);
		seen.add(value);
	}

	return [...duplicates];
}

export function validateCorciteState(
	state: CorciteState
): CorciteValidationResult {
	const errors: string[] = [];


	if (state.population !== undefined) {
		if (
			!Number.isInteger(
				state.population.total
			) ||
			state.population.total < 1
		) {
			errors.push(
				'Population totale invalide'
			);
		}

		if (
			!isNonNegativeFinite(
				state.population
					.workPerPopulation
			) ||
			state.population
				.workPerPopulation <= 0
		) {
			errors.push(
				'Production de travail par habitant invalide'
			);
		}

		const expectedWorkCapacity =
			state.population.total *
			state.population.workPerPopulation;

		if (
			Number.isFinite(
				expectedWorkCapacity
			) &&
			state.capacities.work.capacity !==
				expectedWorkCapacity
		) {
			errors.push(
				'La capacité de travail ne correspond pas à la population'
			);
		}
	}

	if (state.sustainability !== undefined) {
		const sustainability =
			state.sustainability;

		if (
			!Number.isInteger(
				sustainability.lastResolvedTurn
			) ||
			sustainability.lastResolvedTurn < 0
		) {
			errors.push(
				'Tour de soutenabilité invalide'
			);
		}

		const nonNegativeValues = [
			sustainability.energy.overload,
			sustainability.energy
				.reserveSpentLastTurn,
			sustainability.energy
				.reserveRecoveredLastTurn,
			sustainability.maintenance.deficit,
			sustainability.maintenance.debt,
			sustainability.work.free,
			sustainability.work.shortage
		];

		if (
			nonNegativeValues.some(
				(value) =>
					!isNonNegativeFinite(value)
			)
		) {
			errors.push(
				'Etat de soutenabilité négatif ou invalide'
			);
		}

		if (
			!Number.isInteger(
				sustainability.maintenance
					.consecutiveDeficitTurns
			) ||
			sustainability.maintenance
				.consecutiveDeficitTurns < 0
		) {
			errors.push(
				'Série de déficit d’entretien invalide'
			);
		}

		const conditions = [
			'stable',
			'strained',
			'degraded',
			'critical'
		];

		if (
			!conditions.includes(
				sustainability.maintenance
					.condition
			)
		) {
			errors.push(
				'Etat d’entretien inconnu'
			);
		}

		const expectedOverload =
			Math.max(
				0,
				state.capacities.energy.used -
					state.capacities.energy
						.normalCapacity
			);

		if (
			sustainability.energy.overload !==
			expectedOverload
		) {
			errors.push(
				'Le dépassement énergétique mémorisé ne correspond pas aux capacités'
			);
		}

		const expectedMaintenanceDeficit =
			Math.max(
				0,
				state.capacities.maintenance.used -
					state.capacities.maintenance
						.capacity
			);

		if (
			sustainability.maintenance.deficit !==
			expectedMaintenanceDeficit
		) {
			errors.push(
				'Le déficit d’entretien mémorisé ne correspond pas aux capacités'
			);
		}

		const expectedFreeWork =
			Math.max(
				0,
				state.capacities.work.capacity -
					state.capacities.work.used
			);

		const expectedWorkShortage =
			Math.max(
				0,
				state.capacities.work.used -
					state.capacities.work.capacity
			);

		if (
			sustainability.work.free !==
				expectedFreeWork ||
			sustainability.work.shortage !==
				expectedWorkShortage
		) {
			errors.push(
				'L’état de travail mémorisé ne correspond pas aux capacités'
			);
		}
	}

        if (state.recovery !== undefined) {
                const recovery =
                        state.recovery;

                if (
                        !Number.isInteger(
                                recovery.lastResolvedTurn
                        ) ||
                        recovery.lastResolvedTurn < 0
                ) {
                        errors.push(
                                'Tour de récupération invalide'
                        );
                }

                const integrityValues = [
                        recovery.integrity.current,
                        recovery.integrity.maximum,
                        recovery.integrity
                                .damageTakenLastWave,
                        recovery.integrity
                                .recoveredLastTurn
                ];

                if (
                        integrityValues.some(
                                (value) =>
                                        !isNonNegativeFinite(
                                                value
                                        )
                        ) ||
                        recovery.integrity.maximum <=
                                0 ||
                        recovery.integrity.current >
                                recovery.integrity.maximum
                ) {
                        errors.push(
                                'Etat de récupération invalide'
                        );
                }

                const duplicateAppliedConsequences =
                        findDuplicates(
                                recovery
                                        .appliedWaveConsequenceIds
                        );

                if (
                        duplicateAppliedConsequences.length >
                        0
                ) {
                        errors.push(
                                `Conséquences recovery dupliquées : ${duplicateAppliedConsequences.join(', ')}`
                        );
                }

                for (
                        const consequenceId of
                        recovery
                                .appliedWaveConsequenceIds
                ) {
                        if (
                                !consequenceId.trim()
                        ) {
                                errors.push(
                                        'Identifiant de conséquence recovery vide'
                                );

                                continue;
                        }

                        if (
                                !state.waveConsequences.some(
                                        (consequence) =>
                                                consequence.id ===
                                                consequenceId
                                )
                        ) {
                                errors.push(
                                        `Conséquence recovery non persistée : ${consequenceId}`
                                );
                        }
                }

                if (
                        recovery.lastWaveImpact !==
                        null
                ) {
                        const impact =
                                recovery.lastWaveImpact;

                        if (
                                !impact.consequenceId.trim() ||
                                !Number.isInteger(
                                        impact.turn
                                ) ||
                                impact.turn < 1 ||
                                !isNonNegativeFinite(
                                        impact.integrityDamage
                                ) ||
                                !isNonNegativeFinite(
                                        impact.energyReserveDrain
                                ) ||
                                !isNonNegativeFinite(
                                        impact.maintenanceDebtAdded
                                )
                        ) {
                                errors.push(
                                        'Dernier impact de vague recovery invalide'
                                );
                        }

                        if (
                                !recovery
                                        .appliedWaveConsequenceIds
                                        .includes(
                                                impact.consequenceId
                                        )
                        ) {
                                errors.push(
                                        'Dernier impact recovery non référencé comme appliqué'
                                );
                        }
                }
        }


	if (
	        state.captureEconomy !==
	        undefined
	) {
	        const recoveries =
	                state.captureEconomy
	                        .recoveries;

	        const duplicateRecoveryIds =
	                findDuplicates(
	                        recoveries.map(
	                                (recovery) =>
	                                        recovery.id
	                        )
	                );

	        if (
	                duplicateRecoveryIds.length >
	                0
	        ) {
	                errors.push(
	                        `Identifiants de récupération de captation dupliqués : ${duplicateRecoveryIds.join(', ')}`
	                );
	        }

	        const duplicateConsequenceIds =
	                findDuplicates(
	                        recoveries.map(
	                                (recovery) =>
	                                        recovery
	                                                .consequenceId
	                        )
	                );

	        if (
	                duplicateConsequenceIds.length >
	                0
	        ) {
	                errors.push(
	                        `Une conséquence possède plusieurs récupérations de captation : ${duplicateConsequenceIds.join(', ')}`
	                );
	        }

	        for (
	                const recovery of
	                recoveries
	        ) {
	                const numericValues = [
	                        recovery.interceptedMatter,
	                        recovery.baseRecoveryRatio,
	                        recovery.effectiveRecoveryRatio,
	                        recovery.recoverableMatter,
	                        recovery.recoveredMatter,
	                        recovery.lostDuringRecovery,
	                        recovery.lostForLackOfStorage
	                ];

	                if (
	                        !recovery.id.trim() ||
	                        !recovery
	                                .consequenceId
	                                .trim() ||
	                        !Number.isInteger(
	                                recovery.turn
	                        ) ||
	                        recovery.turn < 1 ||
	                        numericValues.some(
	                                (value) =>
	                                        !isNonNegativeFinite(
	                                                value
	                                        )
	                        )
	                ) {
	                        errors.push(
	                                `Etat de récupération de captation invalide : ${recovery.id || '(sans identifiant)'}`
	                        );

	                        continue;
	                }

	                if (
	                        recovery.baseRecoveryRatio >
	                                1 ||
	                        recovery.effectiveRecoveryRatio >
	                                1 ||
	                        recovery.recoverableMatter >
	                                recovery.interceptedMatter +
	                                        1e-6 ||
	                        recovery.recoveredMatter >
	                                recovery.recoverableMatter +
	                                        1e-6
	                ) {
	                        errors.push(
	                                `Récupération de captation incohérente : ${recovery.id}`
	                        );
	                }

	                const expectedRecoveryLoss =
	                        recovery.interceptedMatter -
	                        recovery.recoverableMatter;

	                const expectedStorageLoss =
	                        recovery.recoverableMatter -
	                        recovery.recoveredMatter;

	                if (
	                        Math.abs(
	                                recovery.lostDuringRecovery -
	                                expectedRecoveryLoss
	                        ) >
	                                1e-6 ||
	                        Math.abs(
	                                recovery.lostForLackOfStorage -
	                                expectedStorageLoss
	                        ) >
	                                1e-6
	                ) {
	                        errors.push(
	                                `Pertes de captation incohérentes : ${recovery.id}`
	                        );
	                }

	                const placementTotal =
	                        recovery.storagePlacements.reduce(
	                                (
	                                        total,
	                                        placement
	                                ) =>
	                                        total +
	                                        placement.amount,
	                                0
	                        );

	                if (
	                        recovery.storagePlacements.some(
	                                (placement) =>
	                                        !placement
	                                                .storageUnitId
	                                                .trim() ||
	                                        !Number.isFinite(
	                                                placement.amount
	                                        ) ||
	                                        placement.amount <=
	                                                0 ||
	                                        !state.storageUnits.some(
	                                                (storage) =>
	                                                        storage.id ===
	                                                        placement
	                                                                .storageUnitId
	                                        )
	                        ) ||
	                        Math.abs(
	                                placementTotal -
	                                recovery.recoveredMatter
	                        ) >
	                                1e-6
	                ) {
	                        errors.push(
	                                `Placements de captation incohérents : ${recovery.id}`
	                        );
	                }

	                for (
	                        const modifier of
	                        recovery.appliedModifiers
	                ) {
	                        if (
	                                !modifier.id.trim() ||
	                                !modifier.source.trim() ||
	                                !modifier.target.trim() ||
	                                (
	                                        modifier.operation !==
	                                                'add' &&
	                                        modifier.operation !==
	                                                'multiply'
	                                ) ||
	                                !Number.isFinite(
	                                        modifier.value
	                                )
	                        ) {
	                                errors.push(
	                                        `Modificateur de captation invalide : ${recovery.id}`
	                                );
	                        }
	                }

	                const consequence =
	                        state.waveConsequences.find(
	                                (candidate) =>
	                                        candidate.id ===
	                                        recovery.consequenceId
	                        );

	                if (
	                        !consequence ||
	                        Math.abs(
	                                (
	                                        consequence
	                                                ?.capturedMatter ??
	                                        -1
	                                ) -
	                                recovery.interceptedMatter
	                        ) >
	                                1e-6 ||
	                        consequence?.turn !==
	                                recovery.turn
	                ) {
	                        errors.push(
	                                `Récupération ${recovery.id} non reliée à sa conséquence de vague`
	                        );
	                }
	        }
	}

	const tdValidation =
		validateTdState(
			state.td
		);

	errors.push(
		...tdValidation.errors
	);

	if (state.tdInventory !== undefined) {
                const inventoryTowerIds =
                        state.tdInventory.map(
                                (tower) =>
                                        tower.id
                        );

                const duplicateInventoryTowerIds =
                        findDuplicates(
                                inventoryTowerIds
                        );

                if (
                        duplicateInventoryTowerIds.length >
                        0
                ) {
                        errors.push(
                                `Identifiants de tours TD dupliqués dans l'inventaire : ${duplicateInventoryTowerIds.join(', ')}`
                        );
                }

                for (
                        const tower of
                        state.tdInventory
                ) {
                        const towerValidation =
                                validateTdTowerState(
                                        tower
                                );

                        errors.push(
                                ...towerValidation.errors.map(
                                        (error) =>
                                                `Inventaire TD : ${error}`
                                )
                        );
                }

                const placedTowerIds =
                        state.td.positions.flatMap(
                                (position) =>
                                        position.tower
                                                ? [
                                                        position.tower.id
                                                ]
                                                : []
                        );

                const inventoryIds =
                        new Set(
                                inventoryTowerIds
                        );

                const duplicatedBetweenInventoryAndPath =
                        placedTowerIds.filter(
                                (id) =>
                                        inventoryIds.has(
                                                id
                                        )
                        );

                if (
                        duplicatedBetweenInventoryAndPath.length >
                        0
                ) {
                        errors.push(
                                `Une tour TD ne peut pas être simultanément placée et en inventaire : ${duplicatedBetweenInventoryAndPath.join(', ')}`
                        );
                }
        }

        const tfNetworkValidation =
		validateTfNetworkState(
			state.tfNetwork,
			state.structures
		);

	errors.push(
		...tfNetworkValidation.errors
	);

	const rpgValidation =
		validateRpgState(
			state.rpg
		);

	errors.push(
		...rpgValidation.errors
	);

	const duplicateStorageIds = findDuplicates(
		state.storageUnits.map((storage) => storage.id)
	);

	if (duplicateStorageIds.length > 0) {
		errors.push(
			`Identifiants de stockage dupliqués : ${duplicateStorageIds.join(', ')}`
		);
	}

	const duplicateStructureIds = findDuplicates(
		state.structures.map((structure) => structure.id)
	);

	if (duplicateStructureIds.length > 0) {
		errors.push(
			`Identifiants de structure dupliqués : ${duplicateStructureIds.join(', ')}`
		);
	}

	for (const storage of state.storageUnits) {
		if (!isNonNegativeFinite(storage.capacity)) {
			errors.push(
				`Capacité invalide pour ${storage.id}`
			);
			continue;
		}

		let load = 0;

		for (const resourceId of RESOURCE_IDS) {
			const amount = storage.contents[resourceId];

			if (!isNonNegativeFinite(amount)) {
				errors.push(
					`Quantité ${resourceId} invalide dans ${storage.id}`
				);
			}

			load += amount;
		}

		const unanalysedWaveMatter =
		        storage.unanalysedWaveMatter ??
		        0;

		if (
		        !isNonNegativeFinite(
		                unanalysedWaveMatter
		        )
		) {
		        errors.push(
		                `Matière de vague non analysée invalide dans ${storage.id}`
		        );
		} else {
		        load +=
		                unanalysedWaveMatter;
		}

		if (load > storage.capacity) {
			errors.push(
				`${storage.id} dépasse sa capacité : ${load}/${storage.capacity}`
			);
		}

		const storageStructure = state.structures.find(
			(structure) => structure.id === storage.structureId
		);

		if (!storageStructure) {
			errors.push(
				`${storage.id} référence une structure inexistante`
			);
		} else if (storageStructure.kind !== 'storage-n1') {
			errors.push(
				`${storage.id} référence une structure qui n'est pas un stockage`
			);
		}
	}

	const capacities = [
		[
			'maintenance',
			state.capacities.maintenance.capacity,
			state.capacities.maintenance.used
		],
		[
			'work',
			state.capacities.work.capacity,
			state.capacities.work.used
		],
		[
			'space',
			state.capacities.space.capacity,
			state.capacities.space.used
		]
	] as const;

	for (const [name, capacity, used] of capacities) {
		if (
			!isNonNegativeFinite(capacity) ||
			!isNonNegativeFinite(used)
		) {
			errors.push(`Capacité ${name} invalide`);
		}
	}

	if (
		!isNonNegativeFinite(
			state.capacities.energy.normalCapacity
		) ||
		!isNonNegativeFinite(state.capacities.energy.used) ||
		!isNonNegativeFinite(
			state.capacities.energy.reserveMaximum
		) ||
		!isNonNegativeFinite(
			state.capacities.energy.reserveCurrent
		)
	) {
		errors.push('Etat énergétique invalide');
	}

	if (
		state.capacities.energy.reserveCurrent >
		state.capacities.energy.reserveMaximum
	) {
		errors.push(
			'La réserve énergétique courante dépasse son maximum'
		);
	}

	const duplicateModifierIds =
		findDuplicates(
			state.modifiers.map(
				(modifier) =>
					modifier.id
			)
		);

	if (
		duplicateModifierIds.length > 0
	) {
		errors.push(
			`Identifiants de modificateur dupliqués : ${duplicateModifierIds.join(', ')}`
		);
	}

	for (
		const modifier of
		state.modifiers
	) {
		if (!modifier.id.trim()) {
			errors.push(
				'Un modificateur possède un identifiant vide'
			);
		}

		if (!modifier.source.trim()) {
			errors.push(
				`Modificateur ${modifier.id} : origine vide`
			);
		}

		if (!modifier.target.trim()) {
			errors.push(
				`Modificateur ${modifier.id} : cible vide`
			);
		}

		if (
			!Number.isFinite(
				modifier.value
			)
		) {
			errors.push(
				`Modificateur ${modifier.id} : valeur invalide`
			);
		}
	}

	const duplicateWaveConsequenceIds =
		findDuplicates(
			state.waveConsequences.map(
				(consequence) =>
					consequence.id
			)
		);

	if (
		duplicateWaveConsequenceIds.length >
			0
	) {
		errors.push(
			`Identifiants de conséquences de vague dupliqués : ${duplicateWaveConsequenceIds.join(', ')}`
		);
	}

	for (
		const consequence of
		state.waveConsequences
	) {
		if (
			!consequence.id.trim() ||
			!consequence.runId.trim()
		) {
			errors.push(
				'Une conséquence de vague possède un identifiant vide'
			);
		}

		if (
			!Number.isInteger(
				consequence.turn
			) ||
			consequence.turn < 1
		) {
			errors.push(
				`Conséquence ${consequence.id} : tour invalide`
			);
		}

		for (
			const [
				name,
				value
			] of Object.entries(
				consequence.finalWave
			)
		) {
			if (
				!isNonNegativeFinite(
					value
				)
			) {
				errors.push(
					`Conséquence ${consequence.id} : ${name} final invalide`
				);
			}
		}

		if (
			!isNonNegativeFinite(
				consequence
					.capturedMatter
			)
		) {
			errors.push(
				`Conséquence ${consequence.id} : matière captée invalide`
			);
		}

		for (
			const consumption of
			consequence.consumptions
		) {
			if (
				!Number.isFinite(
					consumption.amount
				) ||
				consumption.amount <=
					0 ||
				!consumption.source.trim()
			) {
				errors.push(
					`Conséquence ${consequence.id} : consommation invalide`
				);
			}
		}

		for (
			const knowledge of
			consequence.knowledgeProduced
		) {
			const persisted =
				state.rpg.knowledge.find(
					(entry) =>
						entry.id ===
							knowledge.id
				);

			if (
				!persisted ||
				persisted.source !==
					knowledge.source ||
				persisted.key !==
					knowledge.key ||
				persisted.value !==
					knowledge.value
			) {
				errors.push(
					`Conséquence ${consequence.id} : connaissance ${knowledge.id} non persistée dans le RPG`
				);
			}
		}
	}

	for (const reservation of state.reservations) {
		if (
			!Number.isFinite(reservation.amount) ||
			reservation.amount <= 0
		) {
			errors.push(
				`Réservation ${reservation.id} : quantité invalide`
			);
		}

		const storage = state.storageUnits.find(
			(candidate) =>
				candidate.id === reservation.storageUnitId
		);

		if (!storage) {
			errors.push(
				`Réservation ${reservation.id} : stockage inexistant`
			);
		}
	}

	for (const storage of state.storageUnits) {
		for (const resourceId of RESOURCE_IDS) {
			const reserved = state.reservations
				.filter(
					(reservation) =>
						reservation.status === 'active' &&
						reservation.storageUnitId === storage.id &&
						reservation.resourceId === resourceId
				)
				.reduce(
					(total, reservation) =>
						total + reservation.amount,
					0
				);

			if (reserved > storage.contents[resourceId]) {
				errors.push(
					`Réservations ${resourceId} supérieures au stock dans ${storage.id}`
				);
			}
		}
	}

	return {
		valid: errors.length === 0,
		errors
	};
}
