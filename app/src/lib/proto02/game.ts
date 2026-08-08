export type ResourceId = 'organic' | 'mineral' | 'refined' | 'component';
export type GroundResource = 'organic' | 'mineral' | null;
export type BuildingId =
	| 'storage'
	| 'energy'
	| 'maintenance'
	| 'workshop'
	| 'extractor-organic'
	| 'extractor-mineral'
	| 'transformer'
	| 'recycler'
	| 'defense-factory';
export type ItemId = BuildingId | 'weakening-tower';
export type ResearchId =
	| 'transformation'
	| 'better-extraction'
	| 'better-transformation'
	| 'better-fabrication'
	| 'better-recycling'
	| 'better-storage';

export type Resources = Record<ResourceId, number>;
export interface HexCell { id: string; q: number; r: number; ground: GroundResource; building: BuildingInstance | null }
export interface BuildingInstance { uid: string; definitionId: BuildingId; active: boolean; staffed: boolean; order: ProductionOrder | null; blockedOutput: { id: ItemId | ResourceId; quantity: number } | null }
export interface InventoryItem { id: ItemId; quantity: number; dismantled: number; remountReadyTurn?: number }
export interface ProductionOrder { id: string; recipeId: string; turnsLeft: number; reserved: Resources; started: boolean }
export type IdleClassification = 'not_idle' | 'voluntary_wait' | 'forced_wait';
export type ForcedWaitCause = 'insufficient_resources' | 'production_busy' | 'research_busy' | 'deployment_or_capacity_constraint' | 'no_useful_unlocked_action';
export type CycleEventType = 'resource_produced' | 'resource_consumed' | 'production_started' | 'production_progressed' | 'production_completed' | 'production_blocked' | 'research_progressed' | 'research_completed' | 'wave_resolved' | 'run_finished';
export interface CycleEvent { type: CycleEventType; label: string; resource?: ResourceId; quantity?: number; recipeId?: string; plannedDuration?: number; observedDuration?: number; turnsLeft?: number }
export interface CycleResolution {
	cycle: number;
	nextCycle: number;
	events: CycleEvent[];
	resourceDeltas: Resources;
	wave: WaveReport | null;
	playerActionCount: number;
	meaningfulActionAvailable: boolean;
	idleClassification: IdleClassification;
	forcedWaitCauses: ForcedWaitCause[];
}
export interface ResearchState { completed: Partial<Record<ResearchId, number>>; active: { id: ResearchId; turnsLeft: number } | null; repeatableLevels: number }
export interface DefenseSlot { position: number; tower: boolean }
export interface WaveReport { number: number; initialPower: number; steps: { position: number; before: number; reduction: number; after: number }[]; residualPower: number; integrityBefore: number; integrityAfter: number; result: RunStatus }
export type RunStatus = 'playing' | 'tester-victory' | 'game-victory';
export interface GameLog { turn: number; message: string }
export interface GameState {
	version: 3;
	seed: number;
	turn: number;
	status: RunStatus;
	deployment: boolean;
	deploymentKit: ItemId[];
	deploymentResources: Resources;
	resources: Resources;
	reserved: Resources;
	board: HexCell[];
	inventory: InventoryItem[];
	defenses: DefenseSlot[];
	research: ResearchState;
	integrity: number;
	nextWaveTurn: number;
	waveNumber: number;
	lastWave: WaveReport | null;
	logs: GameLog[];
	sequence: number;
}

export const RESOURCE_LABELS: Record<ResourceId, string> = {
	organic: 'Organique', mineral: 'Minéral', refined: 'Transformé', component: 'Composant'
};

export const BUILDINGS: Record<BuildingId, { label: string; description: string; energy: number; population: number; maintenance: number; storage: number }> = {
	storage: { label: 'Membrane de stockage', description: 'Étend l’inventaire global du Corcite.', energy: 0, population: 0, maintenance: 1, storage: 16 },
	energy: { label: 'Gemme énergétique', description: 'Diffuse la capacité énergétique du Corcite.', energy: -10, population: 0, maintenance: 1, storage: 0 },
	maintenance: { label: 'Nodule d’entretien', description: 'Soutient les fonctions implantées.', energy: 1, population: 1, maintenance: -10, storage: 0 },
	workshop: { label: 'Atelier de construction', description: 'Fabrique les bâtiments économiques, notamment de nouveaux extracteurs, ainsi que les composants.', energy: 2, population: 1, maintenance: 1, storage: 0 },
	'extractor-organic': { label: 'Extracteur organique', description: 'Récolte les filaments organiques du sol.', energy: 1, population: 1, maintenance: 1, storage: 0 },
	'extractor-mineral': { label: 'Extracteur minéral', description: 'Récolte les excroissances minérales du sol.', energy: 1, population: 1, maintenance: 1, storage: 0 },
	transformer: { label: 'Transformateur opalin', description: 'Fusionne les matières primaires.', energy: 2, population: 1, maintenance: 1, storage: 0 },
	recycler: { label: 'Recyclerie', description: 'Rend une partie des objets à la matière.', energy: 1, population: 1, maintenance: 1, storage: 0 },
	'defense-factory': { label: 'Fabrique défensive', description: 'Fabrique les tours d’Affaiblissement.', energy: 2, population: 1, maintenance: 1, storage: 0 }
};

export const LAB = {
	population: 8,
	baseIntegrity: 60,
	firstWaveTurn: 6,
	minimumWaveGap: 5,
	waveDelayRange: 3,
	waveInitialPower: 18,
	waveGrowth: 8,
	waveAcceleration: 1,
	towerWeakening: 9,
	extractionBase: 2,
	storageUpgrade: 6,
	repeatableLimit: 4
} as const;

const ZERO = (): Resources => ({ organic: 0, mineral: 0, refined: 0, component: 0 });
const KIT: ItemId[] = ['storage', 'energy', 'maintenance', 'workshop', 'extractor-organic', 'extractor-mineral', 'defense-factory'];

export const RECIPES: Record<string, { producer: 'workshop' | 'defense-factory'; label: string; cost: Resources; turns: number; result: ItemId | ResourceId; quantity: number; requires?: ResearchId }> = {
	component: { producer: 'workshop', label: 'Fabriquer 1 composant', cost: { organic: 0, mineral: 1, refined: 1, component: 0 }, turns: 1, result: 'component', quantity: 1, requires: 'transformation' },
	storage: { producer: 'workshop', label: 'Membrane de stockage', cost: { organic: 3, mineral: 0, refined: 1, component: 0 }, turns: 2, result: 'storage', quantity: 1 },
	energy: { producer: 'workshop', label: 'Gemme énergétique', cost: { organic: 0, mineral: 3, refined: 1, component: 0 }, turns: 2, result: 'energy', quantity: 1 },
	maintenance: { producer: 'workshop', label: 'Nodule d’entretien', cost: { organic: 3, mineral: 0, refined: 1, component: 0 }, turns: 2, result: 'maintenance', quantity: 1 },
	transformer: { producer: 'workshop', label: 'Transformateur opalin', cost: { organic: 2, mineral: 2, refined: 0, component: 0 }, turns: 2, result: 'transformer', quantity: 1, requires: 'transformation' },
	recycler: { producer: 'workshop', label: 'Recyclerie', cost: { organic: 3, mineral: 1, refined: 0, component: 0 }, turns: 2, result: 'recycler', quantity: 1 },
	'extractor-organic': { producer: 'workshop', label: 'Extracteur organique', cost: { organic: 2, mineral: 1, refined: 1, component: 0 }, turns: 2, result: 'extractor-organic', quantity: 1 },
	'extractor-mineral': { producer: 'workshop', label: 'Extracteur minéral', cost: { organic: 1, mineral: 2, refined: 1, component: 0 }, turns: 2, result: 'extractor-mineral', quantity: 1 },
	'weakening-tower': { producer: 'defense-factory', label: 'Tour d’Affaiblissement', cost: { organic: 1, mineral: 3, refined: 0, component: 0 }, turns: 2, result: 'weakening-tower', quantity: 1 }
};

export const RESEARCH: Record<ResearchId, { label: string; description: string; cost: Resources; turns: number; repeatable: boolean; prerequisite?: ResearchId; maxLevel?: number }> = {
	transformation: { label: 'Transformation', description: 'Débloque le Transformateur et les composants.', cost: { organic: 2, mineral: 2, refined: 0, component: 0 }, turns: 1, repeatable: false },
	'better-extraction': { label: 'Extraction améliorée', description: '+1 matière produite par extracteur.', cost: { organic: 1, mineral: 1, refined: 2, component: 0 }, turns: 2, repeatable: true, prerequisite: 'transformation' },
	'better-transformation': { label: 'Transformation améliorée', description: '+1 matériau transformé par cycle.', cost: { organic: 1, mineral: 1, refined: 2, component: 0 }, turns: 2, repeatable: true, prerequisite: 'transformation' },
	'better-fabrication': { label: 'Fabrication améliorée', description: 'Réduit d’un tour les nouvelles fabrications.', cost: { organic: 0, mineral: 1, refined: 2, component: 1 }, turns: 2, repeatable: true, prerequisite: 'transformation', maxLevel: 1 },
	'better-recycling': { label: 'Recyclerie améliorée', description: 'Améliore le rendement du recyclage.', cost: { organic: 1, mineral: 0, refined: 2, component: 1 }, turns: 2, repeatable: true, prerequisite: 'transformation' },
	'better-storage': { label: 'Stockage amélioré', description: '+6 capacité par membrane posée.', cost: { organic: 1, mineral: 1, refined: 2, component: 0 }, turns: 2, repeatable: true, prerequisite: 'transformation' }
};

function makeBoard(): HexCell[] {
	const cells: HexCell[] = [];
	for (let q = -2; q <= 2; q += 1) for (let r = -2; r <= 2; r += 1) if (Math.abs(q + r) <= 2) {
		const id = `${q}:${r}`;
		const ground: GroundResource = id === '-2:2' || id === '2:-1' ? 'organic' : id === '-2:0' || id === '1:1' ? 'mineral' : null;
		cells.push({ id, q, r, ground, building: null });
	}
	return cells;
}

export function createGame(seed = 20260807): GameState {
	return {
		version: 3, seed, turn: 1, status: 'playing', deployment: true,
		deploymentKit: [...KIT], deploymentResources: { organic: 4, mineral: 4, refined: 0, component: 0 },
		resources: ZERO(), reserved: ZERO(), board: makeBoard(), inventory: [],
		defenses: Array.from({ length: 8 }, (_, i) => ({ position: i + 1, tower: false })),
		research: { completed: {}, active: null, repeatableLevels: 0 }, integrity: LAB.baseIntegrity,
		nextWaveTurn: LAB.firstWaveTurn, waveNumber: 0, lastWave: null,
		logs: [{ turn: 1, message: 'Le Corcite s’éveille. Posez d’abord sa membrane de stockage.' }], sequence: 0
	};
}

export function capacities(state: GameState) {
	let storage = 0, energy = 0, energyUsed = 0, maintenance = 0, maintenanceUsed = 0, populationUsed = 0;
	for (const cell of state.board) if (cell.building) {
		const def = BUILDINGS[cell.building.definitionId];
		if (cell.building.definitionId === 'storage') storage += def.storage + (state.research.completed['better-storage'] ?? 0) * LAB.storageUpgrade;
		if (cell.building.active && def.energy < 0) energy += -def.energy;
		if (cell.building.active && def.maintenance < 0) maintenance += -def.maintenance;
		if (cell.building.active) { energyUsed += Math.max(0, def.energy); maintenanceUsed += Math.max(0, def.maintenance); }
		if (cell.building.staffed) populationUsed += def.population;
	}
	const load = Object.values(state.resources).reduce((a, b) => a + b, 0) + state.inventory.reduce((a, item) => a + item.quantity, 0);
	return { storage, load, energy, energyUsed, maintenance, maintenanceUsed, population: LAB.population, populationUsed };
}

const item = (state: GameState, id: ItemId) => state.inventory.find((entry) => entry.id === id);
const log = (state: GameState, message: string) => state.logs = [...state.logs.slice(-15), { turn: state.turn, message }];
const completed = (state: GameState, id: ResearchId) => (state.research.completed[id] ?? 0) > 0;
const available = (state: GameState, cost: Resources) => (Object.keys(cost) as ResourceId[]).every((id) => state.resources[id] - state.reserved[id] >= cost[id]);

export interface ActionAvailability { available: boolean; reasons: string[] }

export function productionDuration(state: GameState, recipeId: string): number {
	const recipe = RECIPES[recipeId];
	return recipe ? Math.max(1, recipe.turns - (state.research.completed['better-fabrication'] ?? 0)) : 0;
}

export function productionAvailability(state: GameState, cellId: string, recipeId: string): ActionAvailability {
	const reasons: string[] = [];
	const building = state.board.find((cell) => cell.id === cellId)?.building;
	const recipe = RECIPES[recipeId];
	if (state.deployment) reasons.push('Terminez le déploiement initial.');
	if (!building || !recipe || building.definitionId !== recipe.producer) reasons.push('Cette recette ne peut pas être lancée ici.');
	if (building?.order) reasons.push('Producteur occupé par un ordre en cours.');
	if (building?.blockedOutput) reasons.push('Sortie bloquée : stockage insuffisant.');
	if (building && !building.active) reasons.push('Fonction inactive.');
	if (building && BUILDINGS[building.definitionId].population > 0 && !building.staffed) reasons.push('Fonction non peuplée.');
	if (recipe?.requires && !completed(state, recipe.requires)) reasons.push(`${RESEARCH[recipe.requires].label} non recherchée.`);
	if (recipe) for (const id of Object.keys(recipe.cost) as ResourceId[]) {
		const missing = recipe.cost[id] - (state.resources[id] - state.reserved[id]);
		if (missing > 0) reasons.push(`Manque ${missing} ${RESOURCE_LABELS[id]}.`);
	}
	return { available: reasons.length === 0, reasons };
}

export function researchAvailability(state: GameState, id: ResearchId): ActionAvailability {
	const reasons: string[] = [], node = RESEARCH[id], level = state.research.completed[id] ?? 0;
	// Un plafond atteint rend l'action définitivement impossible : les ressources
	// disponibles et les blocages temporaires ne sont alors plus des causes utiles.
	if (!node.repeatable && level > 0) return { available: false, reasons: ['Recherche déjà acquise.'] };
	if (node.maxLevel !== undefined && level >= node.maxLevel) return { available: false, reasons: ['Niveau utile maximal atteint.'] };
	if (node.repeatable && state.research.repeatableLevels >= LAB.repeatableLimit) return { available: false, reasons: [`Limite de ${LAB.repeatableLimit} niveaux cumulés atteinte.`] };
	if (state.deployment) reasons.push('Terminez le déploiement initial.');
	if (state.research.active) reasons.push('Une recherche est déjà en cours.');
	if (node.prerequisite && !completed(state, node.prerequisite)) reasons.push(`Prérequis manquant : ${RESEARCH[node.prerequisite].label}.`);
	for (const key of Object.keys(node.cost) as ResourceId[]) {
		const missing = node.cost[key] - (state.resources[key] - state.reserved[key]);
		if (missing > 0) reasons.push(`Manque ${missing} ${RESOURCE_LABELS[key]}.`);
	}
	return { available: reasons.length === 0, reasons };
}

export function placementPreview(state: GameState, cellId: string, definitionId: BuildingId): string {
	const cell = state.board.find((candidate) => candidate.id === cellId);
	if (!cell) return 'Case inconnue.';
	if (cell.building) return 'Cette case est déjà occupée.';
	if (definitionId === 'extractor-organic') return cell.ground === 'organic' ? `+${LAB.extractionBase + (state.research.completed['better-extraction'] ?? 0)} organique / tour` : '0 organique / tour';
	if (definitionId === 'extractor-mineral') return cell.ground === 'mineral' ? `+${LAB.extractionBase + (state.research.completed['better-extraction'] ?? 0)} minéral / tour` : '0 minéral / tour';
	return `${BUILDINGS[definitionId].label} peut être implanté ici.`;
}

export function placeBuilding(state: GameState, cellId: string, definitionId: BuildingId): string | null {
	if (state.status !== 'playing') return 'Le run est terminé.';
	const cell = state.board.find((candidate) => candidate.id === cellId);
	if (!cell || cell.building) return 'Choisissez une case libre.';
	const deploymentIndex = state.deployment ? state.deploymentKit.indexOf(definitionId) : -1;
	const stack = item(state, definitionId);
	if (deploymentIndex < 0 && (!stack || stack.quantity < 1)) return 'Ce bâtiment n’est pas disponible.';
	if (state.deployment && definitionId !== 'storage' && state.deploymentKit.includes('storage')) return 'La première implantation doit être une membrane de stockage.';
	const readyRegularItem = (stack?.quantity ?? 0) > (stack?.dismantled ?? 0);
	if (deploymentIndex < 0 && !readyRegularItem && (stack?.remountReadyTurn ?? 0) > state.turn) return `Le remontage sera disponible au cycle ${stack!.remountReadyTurn}.`;
	const def = BUILDINGS[definitionId];
	const caps = capacities(state);
	if (!state.deployment && def.energy > 0 && caps.energyUsed + def.energy > caps.energy) return 'Capacité énergétique insuffisante. Implantez une gemme ou désactivez une fonction.';
	if (!state.deployment && def.maintenance > 0 && caps.maintenanceUsed + def.maintenance > caps.maintenance) return 'Capacité d’entretien insuffisante.';
	state.sequence += 1;
	cell.building = { uid: `building-${state.sequence}`, definitionId, active: true, staffed: def.population > 0, order: null, blockedOutput: null };
	if (deploymentIndex >= 0) {
		state.deploymentKit.splice(deploymentIndex, 1);
		if (definitionId === 'storage') {
			state.resources = { ...state.deploymentResources };
			state.deploymentResources = ZERO();
		}
		state.deployment = state.deploymentKit.length > 0;
	} else {
		const wasDismantled = !readyRegularItem && stack!.dismantled > 0;
		stack!.quantity -= 1;
		if (wasDismantled) stack!.dismantled -= 1;
		log(state, `${BUILDINGS[definitionId].label} implanté${wasDismantled ? ' après remontage' : ''}.`);
		return null;
	}
	log(state, `${BUILDINGS[definitionId].label} implanté.`);
	return null;
}

export function toggleBuilding(state: GameState, cellId: string, active: boolean): string | null {
	if (state.deployment) return 'Terminez le déploiement initial avant de configurer les fonctions.';
	const building = state.board.find((cell) => cell.id === cellId)?.building;
	if (!building) return 'Aucun bâtiment sélectionné.';
	if (active) {
		const def = BUILDINGS[building.definitionId], caps = capacities(state);
		if (caps.energyUsed + Math.max(0, def.energy) > caps.energy) return 'Énergie insuffisante pour activer cette fonction.';
		if (caps.maintenanceUsed + Math.max(0, def.maintenance) > caps.maintenance) return 'Entretien insuffisant pour activer cette fonction.';
	} else {
		const def = BUILDINGS[building.definitionId], caps = capacities(state);
		if (def.energy < 0 && caps.energyUsed > caps.energy + def.energy) return 'Désactivez d’abord les fonctions qui utilisent cette capacité énergétique.';
		if (def.maintenance < 0 && caps.maintenanceUsed > caps.maintenance + def.maintenance) return 'Désactivez d’abord les fonctions qui utilisent cette capacité d’entretien.';
	}
	building.active = active;
	return null;
}

export function toggleStaff(state: GameState, cellId: string, staffed: boolean): string | null {
	if (state.deployment) return 'Terminez le déploiement initial avant d’affecter la population.';
	const building = state.board.find((cell) => cell.id === cellId)?.building;
	if (!building) return 'Aucun bâtiment sélectionné.';
	const need = BUILDINGS[building.definitionId].population;
	if (staffed && capacities(state).populationUsed + need > LAB.population) return 'Population disponible insuffisante.';
	building.staffed = staffed;
	return null;
}

export function dismantle(state: GameState, cellId: string): string | null {
	if (state.deployment) return 'Terminez le déploiement initial avant de démonter une fonction.';
	const cell = state.board.find((candidate) => candidate.id === cellId);
	if (!cell?.building) return 'Aucun bâtiment à démonter.';
	if (cell.building.order || cell.building.blockedOutput) return 'Cette fonction doit terminer ou libérer sa production avant démontage.';
	if (cell.building.definitionId === 'storage') {
		const def = BUILDINGS.storage.storage + (state.research.completed['better-storage'] ?? 0) * LAB.storageUpgrade;
		const caps = capacities(state);
		if (caps.load > caps.storage - def) return 'Impossible : le stock ne tiendrait plus dans les membranes restantes.';
	}
	if (cell.building.definitionId === 'energy') {
		const caps = capacities(state);
		if (caps.energyUsed > caps.energy + BUILDINGS.energy.energy) return 'Impossible : les fonctions actives dépasseraient la capacité énergétique restante.';
	}
	if (cell.building.definitionId === 'maintenance') {
		const caps = capacities(state);
		if (caps.maintenanceUsed > caps.maintenance + BUILDINGS.maintenance.maintenance) return 'Impossible : les fonctions actives dépasseraient la capacité d’entretien restante.';
	}
	let stack = item(state, cell.building.definitionId);
	if (!stack) { stack = { id: cell.building.definitionId, quantity: 0, dismantled: 0 }; state.inventory.push(stack); }
	stack.quantity += 1; stack.dismantled += 1;
	stack.remountReadyTurn = state.turn + 1;
	log(state, `${BUILDINGS[cell.building.definitionId].label} démonté. Son remontage prendra le prochain tour.`);
	cell.building = null;
	return null;
}

export function queueProduction(state: GameState, cellId: string, recipeId: string): string | null {
	const building = state.board.find((cell) => cell.id === cellId)?.building;
	const recipe = RECIPES[recipeId];
	const availability = productionAvailability(state, cellId, recipeId);
	if (!availability.available) return availability.reasons.join(' ');
	if (!building || !recipe) return 'Cette recette ne peut pas être lancée ici.';
	(Object.keys(recipe.cost) as ResourceId[]).forEach((id) => state.reserved[id] += recipe.cost[id]);
	state.sequence += 1;
	building.order = { id: `order-${state.sequence}`, recipeId, turnsLeft: productionDuration(state, recipeId), reserved: { ...recipe.cost }, started: false };
	log(state, `${recipe.label} réservé. Les matières restent dans le stock jusqu’au prochain tour.`);
	return null;
}

export function cancelProduction(state: GameState, cellId: string): string | null {
	const building = state.board.find((cell) => cell.id === cellId)?.building;
	if (!building?.order || building.order.started) return 'Seul un ordre non démarré peut être annulé.';
	(Object.keys(building.order.reserved) as ResourceId[]).forEach((id) => state.reserved[id] -= building.order!.reserved[id]);
	building.order = null;
	return null;
}

export function startResearch(state: GameState, id: ResearchId): string | null {
	const node = RESEARCH[id], availability = researchAvailability(state, id);
	if (!availability.available) return availability.reasons.join(' ');
	(Object.keys(node.cost) as ResourceId[]).forEach((key) => state.resources[key] -= node.cost[key]);
	state.research.active = { id, turnsLeft: node.turns };
	log(state, `Recherche ${node.label} lancée.`);
	return null;
}

function addOutput(state: GameState, output: ItemId | ResourceId, quantity: number): boolean {
	const caps = capacities(state);
	if (caps.load + quantity > caps.storage) return false;
	if (output in RESOURCE_LABELS) state.resources[output as ResourceId] += quantity;
	else {
		let stack = item(state, output as ItemId);
		if (!stack) { stack = { id: output as ItemId, quantity: 0, dismantled: 0 }; state.inventory.push(stack); }
		stack.quantity += quantity;
	}
	return true;
}

export function collectBlockedOutput(state: GameState, cellId: string): string | null {
	const building = state.board.find((cell) => cell.id === cellId)?.building;
	if (!building?.blockedOutput) return 'Aucune sortie en attente.';
	if (!addOutput(state, building.blockedOutput.id, building.blockedOutput.quantity)) return 'Le stockage est encore plein.';
	log(state, 'La sortie en attente rejoint l’inventaire global.');
	building.blockedOutput = null;
	return null;
}

export function recycleItem(state: GameState, id: ItemId): string | null {
	if (state.deployment) return 'Terminez le déploiement initial avant de recycler.';
	const recycler = state.board.find((cell) => cell.building?.definitionId === 'recycler')?.building;
	const stack = item(state, id);
	if (!recycler?.active || !recycler.staffed) return 'Une Recyclerie active et peuplée est nécessaire.';
	if (!stack || stack.quantity < 1) return 'Cet objet n’est pas dans l’inventaire.';
	const bonus = state.research.completed['better-recycling'] ?? 0;
	if (capacities(state).load - 1 + 2 + bonus > capacities(state).storage) return 'Libérez du stockage avant de recycler cet objet.';
	stack.quantity -= 1;
	if (stack.dismantled > 0) stack.dismantled -= 1;
	state.resources.organic += 1 + bonus;
	state.resources.mineral += 1;
	log(state, `${id === 'weakening-tower' ? 'Tour' : BUILDINGS[id as BuildingId].label} recyclé.`);
	return null;
}

export function placeTower(state: GameState, position: number): string | null {
	if (state.deployment) return 'Terminez le déploiement initial avant de préparer les défenses.';
	const slot = state.defenses.find((entry) => entry.position === position), stack = item(state, 'weakening-tower');
	if (!slot || slot.tower) return 'Choisissez une position défensive libre.';
	if (!stack || stack.quantity < 1) return 'Aucune tour d’Affaiblissement disponible.';
	slot.tower = true; stack.quantity -= 1;
	return null;
}

export function removeTower(state: GameState, position: number): string | null {
	if (state.deployment) return 'Terminez le déploiement initial avant de modifier les défenses.';
	const slot = state.defenses.find((entry) => entry.position === position);
	if (!slot?.tower) return 'Aucune tour à retirer.';
	let stack = item(state, 'weakening-tower');
	if (!stack) { stack = { id: 'weakening-tower', quantity: 0, dismantled: 0 }; state.inventory.push(stack); }
	stack.quantity += 1; slot.tower = false;
	return null;
}

export function wavePower(number: number) { return LAB.waveInitialPower + (number - 1) * LAB.waveGrowth + ((number - 1) * (number - 2) / 2) * LAB.waveAcceleration; }
function nextDelay(seed: number, wave: number) { return (Math.abs(seed + wave * 17) % LAB.waveDelayRange); }

function resolveWave(state: GameState) {
	state.waveNumber += 1;
	const initialPower = wavePower(state.waveNumber), integrityBefore = state.integrity;
	let power = initialPower;
	const steps = state.defenses.filter((slot) => slot.tower).map((slot) => {
		const before = power, reduction = Math.min(power, LAB.towerWeakening); power -= reduction;
		return { position: slot.position, before, reduction, after: power };
	});
	if (power === 0) state.status = 'tester-victory';
	else { state.integrity = Math.max(0, state.integrity - power); if (state.integrity === 0) state.status = 'game-victory'; }
	state.lastWave = { number: state.waveNumber, initialPower, steps, residualPower: power, integrityBefore, integrityAfter: state.integrity, result: state.status };
	log(state, power === 0 ? `Onde ${state.waveNumber} annulée : le Corcite l’emporte.` : `Onde ${state.waveNumber} : ${power} Puissance résiduelle, Intégrité ${state.integrity}.`);
	state.nextWaveTurn = state.turn + LAB.minimumWaveGap + nextDelay(state.seed, state.waveNumber);
}

export function meaningfulActions(state: GameState): { available: boolean; forcedWaitCauses: ForcedWaitCause[] } {
	if (state.deployment) return { available: true, forcedWaitCauses: [] };
	const hasPlaceable = state.board.some((cell) => !cell.building) && state.inventory.some((entry) => entry.quantity > entry.dismantled || ((entry.remountReadyTurn ?? 0) <= state.turn && entry.dismantled > 0));
	const production = state.board.flatMap((cell) => Object.entries(RECIPES).filter(([, recipe]) => recipe.producer === cell.building?.definitionId).map(([id]) => productionAvailability(state, cell.id, id).available)).some(Boolean);
	const research = (Object.keys(RESEARCH) as ResearchId[]).some((id) => researchAvailability(state, id).available);
	const tower = item(state, 'weakening-tower');
	const defense = (tower?.quantity ?? 0) > 0 && state.defenses.some((slot) => !slot.tower);
	if (hasPlaceable || production || research || defense) return { available: true, forcedWaitCauses: [] };
	const causes = new Set<ForcedWaitCause>();
	if (state.board.some((cell) => cell.building?.order || cell.building?.blockedOutput)) causes.add('production_busy');
	if (state.research.active) causes.add('research_busy');
	if (state.board.every((cell) => cell.building) || capacities(state).load >= capacities(state).storage) causes.add('deployment_or_capacity_constraint');
	const unlockedCosts = [...Object.values(RECIPES).filter((recipe) => !recipe.requires || completed(state, recipe.requires)).map((recipe) => recipe.cost), ...Object.values(RESEARCH).filter((node) => !node.prerequisite || completed(state, node.prerequisite)).map((node) => node.cost)];
	if (unlockedCosts.some((cost) => !available(state, cost))) causes.add('insufficient_resources');
	if (!causes.size) causes.add('no_useful_unlocked_action');
	return { available: false, forcedWaitCauses: [...causes] };
}

export function resolveCycle(state: GameState, playerActionCount = 0): CycleResolution | string {
	if (state.status !== 'playing') return 'Le run est terminé.';
	if (state.deployment) return 'Terminez le déploiement du kit initial avant le premier cycle.';
	const cycle = state.turn, beforeResources = { ...state.resources }, beforeWave = state.waveNumber;
	const opportunity = meaningfulActions(state);
	const events: CycleEvent[] = [];
	const caps = capacities(state);
	for (const cell of state.board) {
		const building = cell.building;
		if (!building || building.blockedOutput || !building.active || (BUILDINGS[building.definitionId].population > 0 && !building.staffed)) continue;
		if (caps.energyUsed > caps.energy || caps.maintenanceUsed > caps.maintenance) continue;
		if (building.definitionId === 'extractor-organic' && cell.ground === 'organic') {
			const quantity = LAB.extractionBase + (state.research.completed['better-extraction'] ?? 0);
			if (!addOutput(state, 'organic', quantity)) { building.blockedOutput = { id: 'organic', quantity }; events.push({ type: 'production_blocked', label: `${BUILDINGS[building.definitionId].label} : sortie bloquée (${quantity} Organique)`, resource: 'organic', quantity }); }
			else events.push({ type: 'resource_produced', label: `${BUILDINGS[building.definitionId].label} produit ${quantity} Organique`, resource: 'organic', quantity });
		}
		if (building.definitionId === 'extractor-mineral' && cell.ground === 'mineral') {
			const quantity = LAB.extractionBase + (state.research.completed['better-extraction'] ?? 0);
			if (!addOutput(state, 'mineral', quantity)) { building.blockedOutput = { id: 'mineral', quantity }; events.push({ type: 'production_blocked', label: `${BUILDINGS[building.definitionId].label} : sortie bloquée (${quantity} Minéral)`, resource: 'mineral', quantity }); }
			else events.push({ type: 'resource_produced', label: `${BUILDINGS[building.definitionId].label} produit ${quantity} Minéral`, resource: 'mineral', quantity });
		}
		if (building.definitionId === 'transformer' && available(state, { organic: 1, mineral: 1, refined: 0, component: 0 })) {
			const quantity = 2 + (state.research.completed['better-transformation'] ?? 0);
			state.resources.organic -= 1;
			state.resources.mineral -= 1;
			events.push({ type: 'resource_consumed', label: 'Transformation consomme 1 Organique et 1 Minéral' });
			if (!addOutput(state, 'refined', quantity)) { building.blockedOutput = { id: 'refined', quantity }; events.push({ type: 'production_blocked', label: `Transformateur : sortie bloquée (${quantity} Transformé)`, resource: 'refined', quantity }); }
			else events.push({ type: 'resource_produced', label: `Transformateur produit ${quantity} Transformé`, resource: 'refined', quantity });
		}
		if (building.order) {
			const recipeId = building.order.recipeId, plannedDuration = productionDuration(state, recipeId);
			if (!building.order.started) {
				(Object.keys(building.order.reserved) as ResourceId[]).forEach((id) => { state.resources[id] -= building.order!.reserved[id]; state.reserved[id] -= building.order!.reserved[id]; });
				building.order.started = true;
				events.push({ type: 'production_started', label: `${RECIPES[recipeId].label} démarre`, recipeId, plannedDuration, observedDuration: 1 });
			}
			building.order.turnsLeft -= 1;
			if (building.order.turnsLeft <= 0) {
				const recipe = RECIPES[building.order.recipeId];
				if (!addOutput(state, recipe.result, recipe.quantity)) { building.blockedOutput = { id: recipe.result, quantity: recipe.quantity }; events.push({ type: 'production_blocked', label: `${recipe.label} achevée mais sortie bloquée`, recipeId, plannedDuration, observedDuration: plannedDuration }); }
				else events.push({ type: 'production_completed', label: `${recipe.label} achevée`, recipeId, quantity: recipe.quantity, plannedDuration, observedDuration: plannedDuration });
				building.order = null;
			} else events.push({ type: 'production_progressed', label: `${RECIPES[recipeId].label} : ${building.order.turnsLeft} cycle restant`, recipeId, turnsLeft: building.order.turnsLeft, plannedDuration });
		}
	}
	if (state.research.active) {
		const activeResearch = state.research.active, researchId = activeResearch.id;
		activeResearch.turnsLeft -= 1;
		if (activeResearch.turnsLeft <= 0) {
			const id = activeResearch.id;
			state.research.completed[id] = (state.research.completed[id] ?? 0) + 1;
			if (RESEARCH[id].repeatable) state.research.repeatableLevels += 1;
			log(state, `Recherche ${RESEARCH[id].label} achevée.`);
			events.push({ type: 'research_completed', label: `Recherche ${RESEARCH[id].label} achevée`, plannedDuration: RESEARCH[id].turns, observedDuration: RESEARCH[id].turns });
			state.research.active = null;
		} else events.push({ type: 'research_progressed', label: `Recherche ${RESEARCH[researchId].label} : ${activeResearch.turnsLeft} cycle restant`, turnsLeft: activeResearch.turnsLeft, plannedDuration: RESEARCH[researchId].turns });
	}
	state.turn += 1;
	if (state.turn >= state.nextWaveTurn) resolveWave(state);
	const wave = state.waveNumber > beforeWave ? state.lastWave : null;
	if (wave) events.push({ type: 'wave_resolved', label: `Onde ${wave.number} : Puissance ${wave.initialPower} → ${wave.residualPower}` });
	if (state.status !== 'playing') events.push({ type: 'run_finished', label: state.status === 'tester-victory' ? 'Victoire du testeur' : 'Victoire du jeu' });
	const resourceDeltas = Object.fromEntries((Object.keys(RESOURCE_LABELS) as ResourceId[]).map((id) => [id, state.resources[id] - beforeResources[id]])) as Resources;
	const idleClassification: IdleClassification = playerActionCount > 0 ? 'not_idle' : opportunity.available ? 'voluntary_wait' : 'forced_wait';
	return { cycle, nextCycle: state.turn, events, resourceDeltas, wave, playerActionCount, meaningfulActionAvailable: opportunity.available, idleClassification, forcedWaitCauses: idleClassification === 'forced_wait' ? opportunity.forcedWaitCauses : [] };
}

export function endTurn(state: GameState): string | null {
	const result = resolveCycle(state);
	return typeof result === 'string' ? result : null;
}

export function serializeGame(state: GameState): string { return JSON.stringify(state); }
export function restoreGame(raw: string | null): GameState | null {
	if (!raw) return null;
	try {
		const value = JSON.parse(raw) as Partial<GameState>;
		if (
			value.version !== 3 || !Number.isInteger(value.turn) || value.turn! < 1 ||
			!Number.isInteger(value.sequence) || !Number.isInteger(value.waveNumber) ||
			!Array.isArray(value.board) || value.board.length !== 19 ||
			!value.board.every((cell) => typeof cell?.id === 'string' && Number.isInteger(cell.q) && Number.isInteger(cell.r) && (cell.ground === null || cell.ground === 'organic' || cell.ground === 'mineral') && validBuilding(cell.building)) ||
			!Array.isArray(value.inventory) || !value.inventory.every((entry) => validItemId(entry?.id) && Number.isInteger(entry.quantity) && entry.quantity >= 0 && Number.isInteger(entry.dismantled) && entry.dismantled >= 0 && entry.dismantled <= entry.quantity) ||
			!Array.isArray(value.deploymentKit) || !value.deploymentKit.every(validItemId) ||
			!Array.isArray(value.defenses) || value.defenses.length !== 8 ||
			!value.defenses.every((slot, index) => slot?.position === index + 1 && typeof slot.tower === 'boolean') ||
			!validResources(value.resources) || !validResources(value.reserved) || !validResources(value.deploymentResources) ||
			!value.research || !Number.isInteger(value.research.repeatableLevels) || value.research.repeatableLevels! < 0 || value.research.repeatableLevels! > LAB.repeatableLimit ||
			!Number.isFinite(value.integrity) || value.integrity! < 0 || value.integrity! > LAB.baseIntegrity ||
			(value.status !== 'playing' && value.status !== 'tester-victory' && value.status !== 'game-victory')
		) return null;
		return value as GameState;
	} catch { return null; }
}

function validResources(value: unknown): value is Resources {
	if (!value || typeof value !== 'object') return false;
	return (Object.keys(RESOURCE_LABELS) as ResourceId[]).every((id) => Number.isInteger((value as Resources)[id]) && (value as Resources)[id] >= 0);
}

function validItemId(value: unknown): value is ItemId {
	return value === 'weakening-tower' || (typeof value === 'string' && value in BUILDINGS);
}

function validBuilding(value: unknown): value is BuildingInstance | null {
	if (value === null) return true;
	if (!value || typeof value !== 'object') return false;
	const building = value as BuildingInstance;
	return typeof building.uid === 'string' && typeof building.active === 'boolean' && typeof building.staffed === 'boolean' && building.definitionId in BUILDINGS;
}

export function threatHint(state: GameState): string {
	const distance = state.nextWaveTurn - state.turn;
	if (distance <= 1) return 'La Fracture vibre avec violence.';
	if (distance <= 3) return 'Des irisations instables parcourent la lisière.';
	return 'La Fracture demeure silencieuse.';
}
