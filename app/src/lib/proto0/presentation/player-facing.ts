import {
        PLAYABLE_START_REFERENCE
} from '../config/playable-start-reference.js';

import {
        TF_EXTRACTION_LAB_REFERENCE
} from '../config/tf-extraction-reference.js';

import {
        TF_PROCESSING_LAB_REFERENCE
} from '../config/tf-processing-reference.js';

import type {
        PlayableConstructionDefinitionId
} from '../config/playable-construction-reference.js';

import type {
        ResourceId
} from '../domain/resources.js';

export type PlayerResearchCategory =
        | 'tf'
        | 'corcite'
        | 'wave'
        | 'td';

export function playerResourceLabel(
        resourceId: ResourceId
): string {
        return PLAYABLE_START_REFERENCE
                .resourceLabels[
                        resourceId
                ];
}

export function playerResearchCategoryLabel(
        category:
                PlayerResearchCategory
): string {
        switch (category) {
                case 'tf':
                        return 'Ressources';

                case 'corcite':
                        return 'Corcite';

                case 'wave':
                        return 'Vague';

                case 'td':
                        return 'Défenses';
        }

        return category;
}

export function playerResearchStatusLabel(
        status: string
): string {
        switch (status) {
                case 'active':
                        return 'En cours';

                case 'discovery-pending':
                        return 'Découverte à examiner';

                case 'validated':
                        return 'Validée';

                case 'completed':
                        return 'Achevée';

                default:
                        return status;
        }
}

export function playerStructureStatusLabel(
        status: string
): string {
        switch (status) {
                case 'active':
                        return 'Active';

                case 'inactive':
                        return 'En réserve';

                case 'constructing':
                        return 'En construction';

                default:
                        return status;
        }
}

function extractionAmount(
        extractorKind: string
): number {
        const rule =
                TF_EXTRACTION_LAB_REFERENCE
                        .rules.find(
                                (candidate) =>
                                        candidate.extractorKind ===
                                                extractorKind
                        );

        if (!rule) {
                return 0;
        }

        const source =
                TF_EXTRACTION_LAB_REFERENCE
                        .sources.find(
                                (candidate) =>
                                        candidate.id ===
                                                rule.sourceId
                        );

        if (!source) {
                return 0;
        }

        return Math.min(
                rule.capacityPerTurn,
                source.potentialPerTurn
        );
}

export function playerStructureDescription(
        kind: string
): string {
        if (kind === 'extractor-a-n1') {
                return (
                        `Extrait jusqu’à ${extractionAmount(kind)} unités de ` +
                        `${playerResourceLabel('R1')} par tour.`
                );
        }

        if (kind === 'extractor-b-n1') {
                return (
                        `Extrait jusqu’à ${extractionAmount(kind)} unités de ` +
                        `${playerResourceLabel('R2')} par tour.`
                );
        }

        if (kind === 'transformer-n1') {
                const recipe =
                        TF_PROCESSING_LAB_REFERENCE
                                .recipes.find(
                                        (candidate) =>
                                                candidate.id ===
                                                        'transform-r3-n1'
                                );

                return recipe
                        ? (
                                `Consomme ${recipe.inputs.R1 ?? 0} ${playerResourceLabel('R1')} ` +
                                `et ${recipe.inputs.R2 ?? 0} ${playerResourceLabel('R2')} ` +
                                `pour produire ${recipe.outputs.R3 ?? 0} ${playerResourceLabel('R3')}.`
                          )
                        : 'Transforme les matières brutes.';
        }

        if (kind === 'fabricator-n1') {
                const recipe =
                        TF_PROCESSING_LAB_REFERENCE
                                .recipes.find(
                                        (candidate) =>
                                                candidate.id ===
                                                        'fabricate-r4-n1'
                                );

                return recipe
                        ? (
                                `Consomme ${recipe.inputs.R3 ?? 0} ${playerResourceLabel('R3')} ` +
                                `pour produire ${recipe.outputs.R4 ?? 0} ${playerResourceLabel('R4')}.`
                          )
                        : 'Fabrique des composants.';
        }

        if (kind === 'energy-extension-n1') {
                return 'Augmente la capacité énergétique du Corcite.';
        }

        if (kind === 'maintenance-extension-n1') {
                return 'Augmente la capacité générale d’entretien du Corcite.';
        }

        return 'Fonction construite du Corcite.';
}

export function playerStructureFlow(
        kind: string
): string[] {
        switch (kind) {
                case 'extractor-a-n1':
                        return [
                                'Gisement organique',
                                'Extracteur organique',
                                playerResourceLabel('R1'),
                                'Stock'
                        ];

                case 'extractor-b-n1':
                        return [
                                'Gisement minéral',
                                'Extracteur minéral',
                                playerResourceLabel('R2'),
                                'Stock'
                        ];

                case 'transformer-n1':
                        return [
                                'Matières brutes',
                                'Atelier de transformation',
                                playerResourceLabel('R3'),
                                'Stock ou tampon'
                        ];

                case 'fabricator-n1':
                        return [
                                playerResourceLabel('R3'),
                                'Atelier de fabrication',
                                playerResourceLabel('R4'),
                                'Stock ou tampon'
                        ];

                case 'energy-extension-n1':
                        return [
                                'Extension énergétique',
                                'Capacité énergétique accrue'
                        ];

                case 'maintenance-extension-n1':
                        return [
                                'Unité d’entretien',
                                'Capacité d’entretien accrue'
                        ];

                default:
                        return [
                                'Fonction',
                                'Effet sur le Corcite'
                        ];
        }
}

export function playerConstructionFlow(
        id:
                PlayableConstructionDefinitionId
): string[] {
        switch (id) {
                case 'organic-extractor':
                        return playerStructureFlow(
                                'extractor-a-n1'
                        );

                case 'mineral-extractor':
                        return playerStructureFlow(
                                'extractor-b-n1'
                        );

                case 'primary-transformer':
                        return playerStructureFlow(
                                'transformer-n1'
                        );

                case 'component-workshop':
                        return playerStructureFlow(
                                'fabricator-n1'
                        );

                case 'storage-extension':
                        return [
                                'Ressources',
                                'Construction',
                                'Stockage supplémentaire'
                        ];

                case 'energy-extension':
                        return [
                                'Ressources',
                                'Construction',
                                'Capacité énergétique accrue'
                        ];

                case 'maintenance-unit':
                        return [
                                'Ressources',
                                'Construction',
                                'Capacité d’entretien accrue'
                        ];
        }
}
