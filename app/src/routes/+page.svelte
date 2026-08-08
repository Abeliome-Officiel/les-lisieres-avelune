<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BUILDINGS, LAB, RECIPES, RESEARCH, RESOURCE_LABELS,
		capacities, cancelProduction, collectBlockedOutput, createGame, dismantle, endTurn,
		placeBuilding, placementPreview, placeTower, queueProduction, recycleItem, removeTower,
		startResearch, threatHint, toggleBuilding, toggleStaff,
		type BuildingId, type GameState, type HexCell, type ItemId, type ResearchId, type ResourceId
	} from '$lib/proto02/game.js';
	import {
		DEFAULT_TESTER, LAST_TESTER_KEY, TESTER_IDS, isTesterId, loadTesterGame,
		saveTesterGame, type TesterId
	} from '$lib/proto02/testers.js';

	type View = 'corcite' | 'research' | 'defense';
	type CycleDelta = { label: string; delta: number };
	type CycleReport = {
		cycle: number;
		deltas: CycleDelta[];
		completedResearch: string[];
		wave: GameState['lastWave'];
	};

	const resourceIds: ResourceId[] = ['organic', 'mineral', 'refined', 'component'];
	let state: GameState = createGame();
	let activeTester: TesterId = DEFAULT_TESTER;
	let view: View = 'corcite';
	let selectedCellId: string | null = null;
	let placing: BuildingId | null = null;
	let notice = '';
	let saveRestored = false;
	let cycleReport: CycleReport | null = null;

	onMount(() => {
		const lastTester = localStorage.getItem(LAST_TESTER_KEY);
		activeTester = isTesterId(lastTester) ? lastTester : DEFAULT_TESTER;
		const loaded = loadTesterGame(localStorage, activeTester);
		state = loaded.state;
		if (loaded.restored) notice = `Partie de ${activeTester} restaurée.`;
		else if (loaded.invalid) notice = `La sauvegarde invalide de ${activeTester} a été ignorée.`;
		saveRestored = true;
	});

	$: caps = capacities(state);
	$: selectedCell = state.board.find((cell) => cell.id === selectedCellId) ?? null;
	$: selectedBuilding = selectedCell?.building ?? null;
	$: availableResources = Object.fromEntries(resourceIds.map((id) => [id, state.resources[id] - state.reserved[id]])) as Record<ResourceId, number>;
	$: towerInventory = state.inventory.find((entry) => entry.id === 'weakening-tower')?.quantity ?? 0;
	$: totalWeakening = state.defenses.filter((slot) => slot.tower).length * LAB.towerWeakening;
	$: storagePending = state.deploymentKit.includes('storage');
	$: if (saveRestored) saveTesterGame(localStorage, activeTester, state);

	function commit(error: string | null, success = '') {
		notice = error ?? success;
		state = { ...state };
		if (saveRestored) saveTesterGame(localStorage, activeTester, state);
	}

	function changeTester(event: Event) {
		const tester = (event.currentTarget as HTMLSelectElement).value;
		if (!isTesterId(tester) || tester === activeTester) return;
		saveTesterGame(localStorage, activeTester, state);
		activeTester = tester;
		localStorage.setItem(LAST_TESTER_KEY, tester);
		const loaded = loadTesterGame(localStorage, tester);
		state = loaded.state;
		selectedCellId = null;
		placing = null;
		cycleReport = null;
		view = 'corcite';
		notice = loaded.restored ? `Partie de ${tester} restaurée.` : loaded.invalid ? `La sauvegarde invalide de ${tester} a été ignorée.` : `Nouvelle partie créée pour ${tester}.`;
	}

	function chooseCell(cell: HexCell) {
		selectedCellId = cell.id;
		if (placing && !cell.building) notice = placementPreview(state, cell.id, placing);
		else placing = null;
	}

	function confirmPlacement() {
		if (!placing || !selectedCellId) return;
		const label = BUILDINGS[placing].label;
		const error = placeBuilding(state, selectedCellId, placing);
		commit(error, `${label} implanté.`);
		if (!error) placing = null;
	}

	function nextTurn() {
		const cycle = state.turn;
		const beforeWave = state.waveNumber;
		const beforeResources = { ...state.resources };
		const beforeResearch = { ...state.research.completed };
		const beforeInventory = new Map(state.inventory.map((entry) => [entry.id, entry.quantity]));
		const error = endTurn(state);

		if (error) {
			commit(error);
			return;
		}

		const deltas: CycleDelta[] = [];
		for (const id of resourceIds) {
			const delta = state.resources[id] - beforeResources[id];
			if (delta !== 0) deltas.push({ label: RESOURCE_LABELS[id], delta });
		}
		for (const entry of state.inventory) {
			const delta = entry.quantity - (beforeInventory.get(entry.id) ?? 0);
			if (delta !== 0) deltas.push({ label: itemLabel(entry.id), delta });
		}

		const completedResearch = Object.entries(state.research.completed)
			.filter(([rawId, level]) => (level ?? 0) > (beforeResearch[rawId as ResearchId] ?? 0))
			.map(([rawId]) => RESEARCH[rawId as ResearchId].label);

		cycleReport = {
			cycle,
			deltas,
			completedResearch,
			wave: state.waveNumber > beforeWave ? state.lastWave : null
		};
		notice = '';
		state = { ...state };
		if (saveRestored) saveTesterGame(localStorage, activeTester, state);
		if (state.waveNumber > beforeWave) view = 'defense';
	}

	function newRun() {
		if (!confirm('Abandonner ce run et réveiller un nouveau Corcite ?')) return;
		state = createGame();
		selectedCellId = null;
		placing = null;
		cycleReport = null;
		view = 'corcite';
		saveRestored = true;
		saveTesterGame(localStorage, activeTester, state);
		notice = `Nouvelle partie créée pour ${activeTester}.`;
	}

	function itemLabel(id: ItemId) {
		return id === 'weakening-tower' ? 'Tour d’Affaiblissement' : BUILDINGS[id].label;
	}

	function recipeLabel(id: string) {
		return id === 'component' ? 'Fabriquer 1 composant' : RECIPES[id].label;
	}

	function buildingDescription(id: BuildingId) {
		if (id === 'workshop') return 'Fabrique les bâtiments économiques, notamment de nouveaux extracteurs, ainsi que les composants.';
		if (id === 'defense-factory') return 'Fabrique les tours d’Affaiblissement.';
		return BUILDINGS[id].description;
	}

	function outputLabel(id: ItemId | ResourceId) {
		return id in RESOURCE_LABELS ? RESOURCE_LABELS[id as ResourceId] : itemLabel(id as ItemId);
	}

	function groundLabel(ground: HexCell['ground']) {
		return ground === 'organic' ? 'Filaments organiques' : ground === 'mineral' ? 'Gemme minérale' : 'Membrane neutre';
	}

	function depositLabel(ground: HexCell['ground']) {
		return ground ? RESOURCE_LABELS[ground] : 'Aucun';
	}
</script>

<svelte:head>
	<title>Les Lisières d’Avelune — PROTO-0.2</title>
	<meta name="description" content="Alpha jouable des Lisières d’Avelune" />
</svelte:head>

<main class:ended={state.status !== 'playing'}>
	<header class="hud">
		<div class="brand"><span class="sigil" aria-hidden="true">◇</span><div><small>LES LISIÈRES D’AVELUNE</small><strong>Corcite opalin</strong></div></div>
		<div class="resources" aria-label="Ressources">
			{#each resourceIds as id}
				<div class="resource resource-{id}"><span>{RESOURCE_LABELS[id]}</span><strong>{availableResources[id]}</strong>{#if state.reserved[id]}<small>{state.reserved[id]} engagé</small>{/if}</div>
			{/each}
		</div>
		<div class="capacities">
			<span title="Stockage utilisé sur capacité">Stock <b>{caps.load}/{caps.storage}</b></span>
			<span title="Énergie utilisée sur capacité">Énergie <b>{caps.energyUsed}/{caps.energy}</b></span>
			<span title="Population affectée sur totale et disponible">Population <b>{caps.populationUsed}/{caps.population}</b> · {caps.population - caps.populationUsed} libre</span>
			<span title="Entretien mobilisé sur capacité">Entretien <b>{caps.maintenanceUsed}/{caps.maintenance}</b></span>
			<span class="integrity">Intégrité <b>{state.integrity}/{LAB.baseIntegrity}</b></span>
		</div>
	</header>

	<div class="shell">
		<aside class="corcite-card panel">
			<div class="corcite-orb" aria-label="Corcite non anthropomorphe"><i></i><i></i><i></i></div>
			<label class="tester-picker">Testeur
				<select value={activeTester} onchange={changeTester} aria-label="Testeur actif">
					{#each TESTER_IDS as tester}<option value={tester}>{tester}</option>{/each}
				</select>
			</label>
			<p class="eyebrow">CYCLE {state.turn} · ONDE {state.waveNumber + 1}</p>
			<h1>Corcite opalin</h1>
			<p class="muted">Organisme minéral en déploiement à la lisière de la Fracture.</p>
			<div class="integrity-bar"><span style:width={`${state.integrity / LAB.baseIntegrity * 100}%`}></span></div>
			<strong>{state.integrity} Intégrité</strong>
			<p class="threat">{threatHint(state)}</p>
			<nav aria-label="Vues du Corcite">
				<button class:active={view === 'corcite'} onclick={() => view = 'corcite'}>Structure</button>
				<button class:active={view === 'research'} onclick={() => view = 'research'}>Évolution</button>
				<button class:active={view === 'defense'} onclick={() => view = 'defense'}>Défenses <span>{totalWeakening}</span></button>
			</nav>
			<div class="effects">
				<h2>Évolutions actives</h2>
				{#each Object.entries(state.research.completed) as [id, level]}
					{#if level}<span>{RESEARCH[id as ResearchId].label} {RESEARCH[id as ResearchId].repeatable ? `N${level}` : ''}</span>{/if}
				{:else}<p class="muted">Aucune évolution acquise.</p>{/each}
			</div>
		</aside>

		<section class="stage">
			{#if state.status !== 'playing'}
				<div class="end-screen">
					<p class="eyebrow">RUN TERMINÉ · {state.waveNumber} ONDE{state.waveNumber > 1 ? 'S' : ''}</p>
					<h2>{state.status === 'tester-victory' ? 'La vague se dissout' : 'Le Corcite se fracture'}</h2>
					<p>{state.status === 'tester-victory' ? 'Votre ligne d’Affaiblissement a ramené la Puissance à zéro.' : 'L’Intégrité a cédé sous la Puissance résiduelle.'}</p>
					<div class="run-summary"><span><b>{state.turn}</b> cycles</span><span><b>{state.waveNumber}</b> ondes</span><span><b>{state.defenses.filter((slot) => slot.tower).length}</b> tours</span><span><b>{Object.values(state.research.completed).reduce((sum, level) => sum + (level ?? 0), 0)}</b> évolutions</span></div>
					<button class="primary" onclick={newRun}>Recommencer un run</button>
				</div>
			{/if}

			{#if view === 'corcite'}
				<header class="stage-title"><div><p class="eyebrow">ESPACE DE TRAVAIL</p><h2>Structure du Corcite</h2></div><p>Une fonction par case. Seuls les extracteurs dépendent du gisement.</p></header>
				{#if state.deployment}<div class="callout"><b>Déploiement initial</b><span>{storagePending ? 'Implantez d’abord la Membrane de stockage.' : 'Le stockage est actif : implantez librement les fonctions restantes.'}</span></div>{/if}
				<div class="board" aria-label="Structure hexagonale contiguë du Corcite">
					{#each state.board as cell}
						<button class:occupied={cell.building} class:selected={selectedCellId === cell.id} class:organic={cell.ground === 'organic'} class:mineral={cell.ground === 'mineral'} class:preview={placing && !cell.building} style={`--q:${cell.q};--r:${cell.r}`} onclick={() => chooseCell(cell)} aria-label={`${groundLabel(cell.ground)}${cell.building ? `, ${BUILDINGS[cell.building.definitionId].label}` : ', libre'}`}>
							{#if cell.ground}<span class="deposit-marker" aria-hidden="true">{cell.ground === 'organic' ? '✦' : '◆'}</span>{/if}
							{#if cell.building}<span class="building-mark">{cell.building.definitionId === 'storage' ? '◉' : cell.building.definitionId.includes('extractor') ? '⌁' : cell.building.definitionId === 'energy' ? 'ϟ' : cell.building.definitionId === 'maintenance' ? '❈' : cell.building.definitionId === 'workshop' ? '◇' : cell.building.definitionId === 'defense-factory' ? '△' : cell.building.definitionId === 'transformer' ? '◈' : '♲'}</span><small>{BUILDINGS[cell.building.definitionId].label}</small>{/if}
						</button>
					{/each}
				</div>
				<div class="legend"><span><i class="organic-dot">✦</i>Organique</span><span><i class="mineral-dot">◆</i>Minéral</span><span><i class="neutral-dot">·</i>Sans gisement</span></div>
			{:else if view === 'research'}
				<header class="stage-title"><div><p class="eyebrow">ÉVOLUTION TRANSVERSALE</p><h2>Résonances du Corcite</h2></div><p>{state.research.repeatableLevels}/{LAB.repeatableLimit} niveaux répétés acquis</p></header>
				{#if state.deployment}<div class="callout"><b>Déploiement en cours</b><span>Les recherches seront disponibles lorsque les fonctions initiales seront implantées. Revenez dans Structure pour poursuivre.</span></div>{/if}
				{#if state.research.active}<div class="callout"><b>{RESEARCH[state.research.active.id].label}</b><span>{state.research.active.turnsLeft} cycle(s) restant(s)</span></div>{/if}
				<div class="research-grid">
					{#each Object.entries(RESEARCH) as [rawId, node]}
						{@const id = rawId as ResearchId}
						{@const level = state.research.completed[id] ?? 0}
						{@const locked = node.prerequisite && !(state.research.completed[node.prerequisite] ?? 0)}
						<article class:locked class:research-root={id === 'transformation'} class:research-child={Boolean(node.prerequisite)} class:complete={(!node.repeatable && level > 0) || (node.maxLevel !== undefined && level >= node.maxLevel)}>
							{#if node.prerequisite}<small class="research-prerequisite">↑ depuis {RESEARCH[node.prerequisite].label}</small>{/if}
							<div><span class="research-gem">◇</span><small>{node.repeatable ? `Niveau ${level}` : level ? 'Acquise' : 'Découverte'}</small></div>
							<h3>{node.label}</h3><p>{node.description}</p>
							<div class="costs">{#each resourceIds as resource}{#if node.cost[resource]}<span>{node.cost[resource]} {RESOURCE_LABELS[resource]}</span>{/if}{/each}<span>{node.turns} cycle(s)</span></div>
							<button disabled={Boolean(state.deployment || locked || state.research.active || (!node.repeatable && level) || (node.maxLevel !== undefined && level >= node.maxLevel) || (node.repeatable && state.research.repeatableLevels >= LAB.repeatableLimit))} onclick={() => commit(startResearch(state, id), 'Recherche lancée.')}>{state.deployment ? 'Après le déploiement' : locked ? 'Prérequis manquant' : node.maxLevel !== undefined && level >= node.maxLevel ? 'Niveau maximal' : 'Rechercher'}</button>
						</article>
					{/each}
				</div>
			{:else}
				<header class="stage-title"><div><p class="eyebrow">LISIÈRE TACTIQUE</p><h2>Chemin d’Affaiblissement</h2></div><p>{totalWeakening} Puissance réduite · {towerInventory} tour(s) disponible(s)</p></header>
				{#if state.deployment}<div class="callout"><b>Déploiement en cours</b><span>La préparation défensive sera disponible lorsque le kit initial sera entièrement implanté. Revenez dans Structure pour poursuivre.</span></div>{/if}
				<div class="defense-summary"><span>Fracture</span><i></i><strong>Puissance →</strong><i></i><span>Corcite</span></div>
				<div class="defense-path" aria-label="Trajet séquentiel de la vague, de la Fracture vers le Corcite">
					{#each state.defenses as slot}
						<div class="defense-step">
							<button class:tower={slot.tower} disabled={state.deployment} onclick={() => commit(slot.tower ? removeTower(state, slot.position) : placeTower(state, slot.position), slot.tower ? 'Tour retirée.' : 'Tour placée.')}>
								<small>POSITION {slot.position}</small><b>{slot.tower ? '◇' : '+'}</b><span>{slot.tower ? `−${LAB.towerWeakening} Puissance` : 'Placer une tour'}</span>
							</button>
							{#if slot.position < state.defenses.length}<span class="defense-link" aria-hidden="true">→</span>{/if}
						</div>
					{/each}
				</div>
				{#if state.lastWave}
					<article class="wave-report"><p class="eyebrow">RAPPORT D’ONDE {state.lastWave.number}</p><h3>Puissance {state.lastWave.initialPower} → {state.lastWave.residualPower}</h3>
						<div class="wave-steps">{#each state.lastWave.steps as step}<span>Position {step.position} : {step.before} − {step.reduction} = <b>{step.after}</b></span>{:else}<span>Aucune défense n’a affaibli cette onde.</span>{/each}</div>
						<p>Intégrité : {state.lastWave.integrityBefore} → <b>{state.lastWave.integrityAfter}</b></p>
						<strong class="wave-result">{state.lastWave.result === 'tester-victory' ? 'Victoire du testeur · onde annulée' : state.lastWave.result === 'game-victory' ? 'Victoire du jeu · Intégrité épuisée' : 'Le Corcite tient · le développement continue'}</strong>
					</article>
				{/if}
			{/if}
		</section>

		<aside class="context panel">
			<p class="eyebrow">CONTEXTE</p>
			{#if view === 'corcite' && selectedCell}
				<h2>{selectedBuilding ? BUILDINGS[selectedBuilding.definitionId].label : groundLabel(selectedCell.ground)}</h2>
				<p class="deposit-detail">Gisement : <b>{depositLabel(selectedCell.ground)}</b></p>
				{#if selectedBuilding}
					{@const def = BUILDINGS[selectedBuilding.definitionId]}
					<p>{buildingDescription(selectedBuilding.definitionId)}</p>
					<div class="facts"><span>Énergie <b>{Math.max(0, def.energy)}</b></span><span>Population <b>{def.population}</b></span><span>Entretien <b>{Math.max(0, def.maintenance)}</b></span></div>
					{#if selectedBuilding.definitionId === 'storage'}<div class="formula"><span>Capacité · base + évolution</span><b>{def.storage} + {(state.research.completed['better-storage'] ?? 0) * LAB.storageUpgrade} = {def.storage + (state.research.completed['better-storage'] ?? 0) * LAB.storageUpgrade}</b><small>Capacité globale fournie par cette membrane.</small></div>{/if}
					{#if selectedBuilding.definitionId === 'energy'}<div class="formula"><span>Capacité fournie</span><b>{-def.energy} Énergie</b><small>Disponible tant que la gemme reste active.</small></div>{/if}
					{#if selectedBuilding.definitionId === 'maintenance'}<div class="formula"><span>Capacité fournie</span><b>{-def.maintenance} Entretien</b><small>Disponible tant que le nodule reste actif.</small></div>{/if}
					{#if selectedBuilding.definitionId.includes('extractor')}<div class="formula"><span>Production · base + évolution</span><b>{LAB.extractionBase} + {state.research.completed['better-extraction'] ?? 0} = {LAB.extractionBase + (state.research.completed['better-extraction'] ?? 0)} / cycle</b><small>{placementPreview(state, selectedCell.id, selectedBuilding.definitionId)}</small></div>{/if}
					{#if selectedBuilding.definitionId === 'transformer'}<div class="formula"><span>Transformation · base + évolution</span><b>2 + {state.research.completed['better-transformation'] ?? 0} = {2 + (state.research.completed['better-transformation'] ?? 0)} Transformé / cycle</b><small>Consomme 1 Organique + 1 Minéral disponibles.</small></div>{/if}
					{#if selectedBuilding.blockedOutput}<div class="blocked" role="status"><b>Sortie bloquée · stockage plein</b><span>{selectedBuilding.blockedOutput.quantity} {outputLabel(selectedBuilding.blockedOutput.id)} attend localement. Rien n’est perdu.</span><button onclick={() => commit(collectBlockedOutput(state, selectedCell.id), 'Sortie récupérée.')}>Transférer vers l’inventaire</button></div>{/if}
					<label class="switch"><input type="checkbox" disabled={state.deployment} checked={selectedBuilding.active} onchange={(event) => commit(toggleBuilding(state, selectedCell.id, event.currentTarget.checked), 'État modifié.')} /><span></span>Fonction {selectedBuilding.active ? 'active' : 'en veille'}</label>
					{#if def.population}<label class="switch"><input type="checkbox" disabled={state.deployment} checked={selectedBuilding.staffed} onchange={(event) => commit(toggleStaff(state, selectedCell.id, event.currentTarget.checked), 'Population réaffectée.')} /><span></span>{selectedBuilding.staffed ? 'Population affectée' : 'Sans population'}</label>{/if}
					{#if selectedBuilding.definitionId === 'workshop' || selectedBuilding.definitionId === 'defense-factory'}
						<h3>Fabrication</h3>
						{#if selectedBuilding.definitionId === 'workshop'}<p class="context-note">L’Atelier peut fabriquer de nouveaux extracteurs. Une fois terminés, ils rejoignent l’inventaire puis peuvent être implantés sur une case libre.</p>{/if}
						{#if selectedBuilding.order}<div class="order"><b>{recipeLabel(selectedBuilding.order.recipeId)}</b><span>{selectedBuilding.order.started ? `${selectedBuilding.order.turnsLeft} cycle(s)` : 'Matières réservées'}</span>{#if !selectedBuilding.order.started}<button onclick={() => commit(cancelProduction(state, selectedCell.id), 'Ordre annulé, matières libérées.')}>Annuler</button>{/if}</div>
						{:else if !selectedBuilding.blockedOutput}<div class="recipe-list">{#each Object.entries(RECIPES).filter(([, recipe]) => recipe.producer === selectedBuilding.definitionId) as [recipeId, recipe]}<button disabled={state.deployment} onclick={() => commit(queueProduction(state, selectedCell.id, recipeId), 'Fabrication réservée.')}><b>{recipeLabel(recipeId)}</b><small>{state.deployment ? 'Disponible après le déploiement initial' : `${resourceIds.filter((id) => recipe.cost[id]).map((id) => `${recipe.cost[id]} ${RESOURCE_LABELS[id]}`).join(' · ')} · ${recipe.turns} cycles`}</small></button>{/each}</div>
						{/if}
					{/if}
					<button class="danger" disabled={state.deployment} onclick={() => commit(dismantle(state, selectedCell.id), 'Bâtiment démonté et rangé.')}>Démonter</button>
				{:else}
					<p>Case libre. {selectedCell.ground ? 'Un extracteur compatible y produira normalement.' : 'Un extracteur peut y être posé, mais produira 0.'}</p>
					{#if placing}<div class="preview"><b>Prévisualisation</b><span>{placementPreview(state, selectedCell.id, placing)}</span><button class="primary" onclick={confirmPlacement}>Confirmer la pose</button></div>{/if}
				{/if}
			{:else}
				<h2>{view === 'research' ? 'Progression' : 'Défense'}</h2><p>{view === 'research' ? 'Les recherches modifient directement les fonctions du Corcite. Les quatre niveaux répétés sont partagés.' : 'Les tours agissent dans l’ordre des huit positions. Chaque tour retire jusqu’à 9 Puissance.'}</p>
			{/if}
			<div class="journal"><h3>Échos récents</h3>{#each [...state.logs].reverse().slice(0, 5) as entry}<p><b>C{entry.turn}</b> {entry.message}</p>{/each}</div>
		</aside>
	</div>

	{#if !state.deployment || view === 'corcite'}
		<section class="inventory panel">
			<header><div><p class="eyebrow">{state.deployment ? 'DÉPLOIEMENT INITIAL' : 'INVENTAIRE GLOBAL'}</p><h2>{state.deployment ? 'Kit du Corcite' : 'Objets du Corcite'}</h2></div><span>{state.deployment ? `${state.deploymentKit.length} fonction(s) à implanter · hors stockage` : `${caps.load} / ${caps.storage} unités`}</span></header>
			<div class="inventory-scroll">
				{#if state.deployment}
					{#each state.deploymentKit as id}
						<article class:selected={placing === id} class:locked={storagePending && id !== 'storage'}>
							<span class="item-glyph">◇</span><div><b>{itemLabel(id)}</b><small>{storagePending && id !== 'storage' ? 'Posez d’abord la Membrane de stockage' : 'Élément du kit · hors stockage'}</small></div><strong>×1</strong>
							<button disabled={storagePending && id !== 'storage'} onclick={() => { placing = id as BuildingId; view = 'corcite'; notice = id === 'storage' ? 'Choisissez la première membrane, puis confirmez sa pose.' : 'Choisissez une case libre puis confirmez.'; }}>Implanter</button>
						</article>
					{/each}
				{:else}{#each state.inventory.filter((entry) => entry.quantity > 0) as entry}
					<article class:selected={placing === entry.id}>
						<span class="item-glyph">{entry.id === 'weakening-tower' ? '△' : '◇'}</span><div><b>{itemLabel(entry.id)}</b><small>{entry.dismantled ? `${entry.dismantled} démonté(s) · remontage au prochain cycle` : entry.id === 'weakening-tower' ? 'Défense physique' : 'Bâtiment non posé'}</small></div><strong>×{entry.quantity}</strong>
						{#if entry.id === 'weakening-tower'}<button onclick={() => view = 'defense'}>Ouvrir Défenses</button>{:else}<button onclick={() => { placing = entry.id as BuildingId; view = 'corcite'; notice = 'Choisissez une case libre puis confirmez.'; }}>Implanter</button>{/if}
						{#if state.board.some((cell) => cell.building?.definitionId === 'recycler')}<button class="quiet" onclick={() => commit(recycleItem(state, entry.id), 'Objet recyclé.')}>Recycler</button>{/if}
					</article>
				{:else}<p class="muted">Aucun objet dans l’inventaire global.</p>{/each}{/if}
			</div>
			<div class="turn-actions"><div class:alert={notice || state.deployment} role="status" aria-live="polite"><span>{notice || (state.deployment ? 'Implantez tout le kit initial pour commencer le premier cycle.' : 'Organisez vos fonctions, puis laissez le Corcite traverser un cycle.')}</span><small>{state.deployment ? (storagePending ? 'Le kit et les ressources d’amorçage restent hors stockage jusqu’à la première pose.' : 'Seul le kit reste hors stockage ; les ressources d’amorçage occupent la capacité.') : 'La prochaine onde reste impromptue.'}</small></div><button class="primary pulse" disabled={state.status !== 'playing' || state.deployment} title={state.deployment ? 'Terminez le déploiement initial.' : ''} onclick={nextTurn}>Terminer le cycle {state.turn}</button><button class="quiet" onclick={newRun}>Nouvelle partie</button></div>
		</section>
	{:else}
		<section class="compact-actions panel"><span>Déploiement initial en cours.</span><button onclick={() => view = 'corcite'}>Retourner dans Structure</button></section>
	{/if}

	{#if cycleReport}
		<div class="cycle-report-backdrop">
			<section class="cycle-report-modal panel" role="dialog" aria-modal="true" aria-labelledby="cycle-report-title">
				<p class="eyebrow">CYCLE RÉSOLU</p>
				<h2 id="cycle-report-title">Cycle {cycleReport.cycle} → {cycleReport.cycle + 1}</h2>
				{#if cycleReport.deltas.length}
					<div class="cycle-deltas">
						{#each cycleReport.deltas as delta}<span class:negative={delta.delta < 0}><b>{delta.delta > 0 ? '+' : ''}{delta.delta}</b> {delta.label}</span>{/each}
					</div>
				{:else}<p class="muted">Aucune variation nette de stock sur ce cycle.</p>{/if}
				{#each cycleReport.completedResearch as label}<p class="cycle-event">Recherche <b>{label}</b> achevée.</p>{/each}
				{#if cycleReport.wave}
					<div class="cycle-wave">
						<strong>Onde {cycleReport.wave.number}</strong><span>Puissance {cycleReport.wave.initialPower} → {cycleReport.wave.residualPower}</span><span>Intégrité {cycleReport.wave.integrityBefore} → {cycleReport.wave.integrityAfter}</span>
					</div>
				{/if}
				<button class="primary" onclick={() => cycleReport = null}>Continuer</button>
			</section>
		</div>
	{/if}
</main>

<style>
	:global(*){box-sizing:border-box} :global(body){margin:0;background:#130c1d;color:#f2eafd;font-family:Inter,ui-sans-serif,system-ui,sans-serif} :global(button){font:inherit}
	main{min-height:100vh;background:radial-gradient(circle at 50% 30%,#442057 0,transparent 38%),linear-gradient(135deg,#100918,#21102e 55%,#110a1a);padding-bottom:.75rem;position:relative;overflow-x:hidden} main:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.14;background-image:radial-gradient(#e8ceff 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,black,transparent)}
	.hud{min-height:72px;display:flex;align-items:stretch;gap:.7rem;padding:.55rem .85rem;border-bottom:1px solid #a873c955;background:#160d21e8;backdrop-filter:blur(14px);position:relative;z-index:5}.brand{display:flex;align-items:center;gap:.7rem;min-width:205px}.brand small,.eyebrow{display:block;color:#c89be4;font-size:.66rem;font-weight:800;letter-spacing:.13em;margin:0 0 .25rem}.brand strong{font-family:Georgia,serif;font-size:1.15rem}.sigil{display:grid;place-items:center;width:43px;height:43px;border:1px solid #d6a9ed;border-radius:50% 45% 52% 43%;font-size:1.7rem;color:#f0cfff;box-shadow:0 0 24px #bd62e477 inset,0 0 18px #bd62e455}.resources{display:grid;grid-template-columns:repeat(4,minmax(90px,1fr));gap:.38rem;flex:1}.resource{padding:.38rem .55rem;border:1px solid #80569a66;border-radius:9px;background:#ffffff09;display:grid;grid-template-columns:1fr auto;align-items:center;min-height:48px}.resource span{font-size:.68rem;color:#d8c5e4}.resource strong{font-size:1.05rem}.resource small{grid-column:1/-1;color:#f0b6d1;font-size:.58rem}.capacities{display:grid;grid-template-columns:repeat(2,auto);gap:.2rem .7rem;align-content:center;font-size:.69rem;color:#cbb7d7}.capacities b{color:#fff;margin-left:.25rem}.integrity b{color:#f6aecb}
	.shell{display:grid;grid-template-columns:220px minmax(560px,1fr) 265px;gap:.65rem;padding:.65rem;max-width:1800px;margin:auto;align-items:stretch}.panel{border:1px solid #9467ad55;border-radius:15px;background:linear-gradient(145deg,#2d1739d9,#170f22e8);box-shadow:0 12px 40px #08030d66,inset 0 1px #ffffff12}.corcite-card,.context{padding:.9rem;min-width:0}.corcite-card h1{font:1.45rem Georgia,serif;margin:.2rem 0}.tester-picker{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.6rem;margin:.15rem 0 .65rem;color:#d9c4e5;font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.tester-picker select{min-width:0;padding:.4rem .5rem;border:1px solid #a875bd;border-radius:7px;background:#1b1025;color:#fff;font:700 .76rem system-ui;color-scheme:dark}.tester-picker select:focus-visible{outline:2px solid #efbaff;outline-offset:2px}.tester-picker option{background:#1b1025;color:#fff}.muted{color:#ad9bb8;font-size:.78rem}.corcite-orb{height:104px;position:relative;display:grid;place-items:center}.corcite-orb:before{content:"";width:82px;height:88px;border-radius:56% 34% 48% 39%;background:radial-gradient(circle at 38% 28%,#fff 0 4%,#e9b9ff 5% 11%,#a354c2 30%,#55205f 55%,#25102f 78%);box-shadow:0 0 28px #cf75f088,inset -18px -14px 22px #16091d;transform:rotate(23deg)}.corcite-orb i{position:absolute;width:22px;height:50px;border:2px solid #d59ceb;border-radius:100% 0 100% 0;filter:drop-shadow(0 0 6px #eabaff);transform:translate(43px,-18px) rotate(34deg)}.corcite-orb i:nth-child(2){transform:translate(-43px,18px) rotate(194deg);height:35px}.corcite-orb i:nth-child(3){transform:translate(4px,48px) rotate(138deg);height:27px}.integrity-bar{height:7px;background:#0e0915;border-radius:9px;overflow:hidden;margin:.7rem 0 .3rem}.integrity-bar span{display:block;height:100%;background:linear-gradient(90deg,#b34780,#f4b7db);box-shadow:0 0 10px #f48ecb}.threat{padding:.6rem;border-left:2px solid #dc94f3;background:#ffffff08;font-size:.73rem;line-height:1.35}.corcite-card nav{display:grid;gap:.3rem;margin:.8rem 0}.corcite-card nav button{border:1px solid transparent;background:#ffffff08;color:#d6c8de;text-align:left;padding:.56rem .7rem;border-radius:8px;cursor:pointer}.corcite-card nav button.active{background:#a05fc42b;border-color:#b875d3;color:#fff}.corcite-card nav span{float:right;background:#9a50b8;padding:.05rem .4rem;border-radius:9px}.effects h2,.journal h3,.context h3{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:#c89be4;margin-top:1rem}.effects span{display:block;padding:.3rem 0;font-size:.72rem;border-bottom:1px solid #ffffff0d}
	.stage{min-height:590px;border:1px solid #8c5ca544;border-radius:18px;padding:1rem;background:radial-gradient(circle at center,#4c24543d,transparent 65%),#160d20aa;position:relative;overflow:auto}.stage-title{display:flex;align-items:end;justify-content:space-between;gap:1rem}.stage-title h2{font:1.65rem Georgia,serif;margin:0}.stage-title>p{max-width:320px;color:#b3a1bf;font-size:.73rem;text-align:right}.callout{display:flex;justify-content:space-between;gap:1rem;padding:.65rem .85rem;margin:.65rem 0;border:1px solid #d68dea88;background:#8c48a12b;border-radius:9px;font-size:.76rem}
	.board{--hex-w:126px;--hex-h:109px;width:min(100%,650px);height:550px;position:relative;margin:.2rem auto 0;filter:drop-shadow(0 18px 30px #06020a);transform:none!important}.board button{position:absolute;width:var(--hex-w);height:var(--hex-h);left:calc(50% + (var(--q) * 94.5px) - var(--hex-w)/2);top:calc(50% + (var(--r) * 109px) + (var(--q) * 54.5px) - var(--hex-h)/2);clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);border:0;background:linear-gradient(145deg,#41254d,#291734);color:#c5a8d3;cursor:pointer;transition:filter .15s,background .15s;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.75rem}.board button:after{content:"";position:absolute;inset:2px;clip-path:inherit;border:1px solid #c399d055;pointer-events:none}.board button:hover,.board button:focus-visible{z-index:2;filter:brightness(1.18)}.board button.occupied{background:radial-gradient(circle,#9c63b2,#372144 67%)}.board button.selected{filter:drop-shadow(0 0 10px #f3bcff) brightness(1.28);z-index:3}.board button.preview{animation:breathe 1.8s infinite}.deposit-marker{position:absolute;left:18px;bottom:18px;top:auto;z-index:1;display:grid;place-items:center;width:18px;height:18px;border:1px solid currentColor;border-radius:50%;background:#1c1027e8;font-size:.7rem;font-weight:800;line-height:1;box-shadow:0 0 5px currentColor;opacity:.78}.board button.occupied .deposit-marker{width:15px;height:15px;font-size:.55rem;opacity:.58;box-shadow:none}.board button.organic .deposit-marker{color:#e287c6}.board button.mineral .deposit-marker{color:#ad9be1}.building-mark{font-size:2rem;color:#f5d8ff;text-shadow:0 0 10px #ebafff;line-height:1}.board button small{font-size:.52rem;line-height:1.05;max-width:86px;color:white;text-align:center;margin-top:.18rem}.legend{display:flex;justify-content:center;gap:1.3rem;font-size:.7rem;color:#baa5c4;margin-top:-.15rem}.legend i{display:inline-block;width:1.2rem;margin-right:.2rem;font-style:normal;font-weight:800;text-align:center}.organic-dot{color:#e287c6}.mineral-dot{color:#ad9be1}.neutral-dot{color:#8a7196}
	.context h2{font:1.35rem Georgia,serif;margin:.3rem 0}.context>p{font-size:.78rem;line-height:1.45;color:#bfaec9}.context .deposit-detail{margin:.35rem 0 .65rem;color:#d8c7e2}.deposit-detail b{color:#fff}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;margin:.7rem 0}.facts span{padding:.42rem .2rem;background:#ffffff08;text-align:center;font-size:.6rem;border-radius:6px}.facts b{display:block;color:#fff;font-size:.86rem}.formula,.preview,.blocked,.order{display:grid;gap:.35rem;padding:.65rem;margin:.65rem 0;border:1px solid #a675bc55;border-radius:8px;background:#ffffff08;font-size:.72rem}.context-note{font-size:.7rem!important;line-height:1.4!important;padding:.5rem;border-left:2px solid #c286da;background:#ffffff07}.switch{display:flex;align-items:center;gap:.5rem;font-size:.73rem;margin:.5rem 0;cursor:pointer}.switch input{position:absolute;opacity:0}.switch span{width:34px;height:18px;border-radius:12px;background:#493253;position:relative}.switch span:after{content:"";position:absolute;width:12px;height:12px;border-radius:50%;background:#bca8c7;left:3px;top:3px;transition:.2s}.switch input:checked+span{background:#995ab5}.switch input:checked+span:after{left:19px;background:white}.recipe-list{display:grid;gap:.3rem;max-height:220px;overflow:auto}.recipe-list button{display:grid;text-align:left;gap:.15rem}.recipe-list small{color:#bca7c5}.context button,.research-grid button,.inventory button,.compact-actions button{border:1px solid #9d68b5;background:#4b2b59;color:#f5eaff;padding:.42rem .55rem;border-radius:7px;cursor:pointer}.context button:hover,.research-grid button:hover,.inventory button:hover,.compact-actions button:hover{background:#673677}.context button:disabled,.research-grid button:disabled,.inventory button:disabled{opacity:.35;cursor:not-allowed}.danger{width:100%;margin-top:.7rem;border-color:#9c526c!important;background:#492435!important}.journal{border-top:1px solid #ffffff13;margin-top:.9rem}.journal p{font-size:.66rem!important;margin:.4rem 0!important;color:#a998b3!important}.journal b{color:#daa4eb;margin-right:.25rem}
	.research-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem 1.25rem;margin-top:.8rem;align-items:start}.research-grid article{border:1px solid #86589e66;border-radius:11px;padding:.72rem .82rem;background:linear-gradient(145deg,#42234f99,#21142ccc);position:relative;min-height:0}.research-grid article.research-root{grid-column:1/-1;width:min(100%,560px);justify-self:center;margin-bottom:1.05rem;border-color:#ba78d2aa}.research-grid article.research-root:after{content:"";position:absolute;left:50%;bottom:-1.1rem;width:2px;height:1.1rem;background:linear-gradient(#d69ae9,#7c4d92)}.research-grid article.research-child:before{content:"";position:absolute;left:50%;top:-1rem;width:2px;height:1rem;background:#9b69b888}.research-prerequisite{display:block;text-align:center;color:#c99ee0;font-size:.58rem;margin:-.15rem 0 .25rem}.research-grid article.locked{filter:saturate(.45);opacity:.68}.research-grid article.complete{border-color:#ddaaf0}.research-grid article>div:first-of-type{display:flex;justify-content:space-between}.research-gem{font-size:1.2rem;color:#e4aefa}.research-grid h3{font:1rem Georgia,serif;margin:.32rem 0}.research-grid p{font-size:.7rem;color:#bfaec8;margin:.25rem 0}.costs{display:flex;gap:.25rem;flex-wrap:wrap;margin:.45rem 0}.costs span{font-size:.57rem;background:#ffffff0b;padding:.22rem .32rem;border-radius:4px}.research-grid button{width:100%;padding:.36rem .5rem}
	.defense-summary{height:62px;display:flex;align-items:center;justify-content:center;gap:.8rem;color:#d3a6e4}.defense-summary i{height:1px;background:linear-gradient(90deg,#ce7de7,transparent);width:80px}.defense-path{display:flex;align-items:center;gap:0;width:100%;overflow-x:auto;padding:1rem .2rem 1.2rem;scrollbar-width:thin}.defense-step{display:flex;align-items:center;flex:1 1 0;min-width:108px}.defense-step button{width:92px;min-width:92px;height:96px;border:1px dashed #86559e;background:#25152f;color:#bba5c6;border-radius:42% 58% 48% 52% / 48% 42% 58% 52%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.25rem;cursor:pointer;position:relative;z-index:1}.defense-step button.tower{border-style:solid;background:radial-gradient(circle,#a35ab877,#281633 65%);box-shadow:inset 0 0 20px #c974e64d}.defense-step b{font-size:1.65rem;color:#e9b9fb}.defense-step small{font-size:.53rem}.defense-step span{font-size:.61rem;text-align:center}.defense-link{flex:1;min-width:16px;color:#d38ce9;font-size:1.05rem;text-align:center;text-shadow:0 0 8px #c76ce6}.wave-report{margin-top:.9rem;padding:.85rem;border:1px solid #bc79d277;border-radius:12px;background:#120c1cd9}.wave-report h3{font:1.15rem Georgia,serif;margin:.35rem 0}.wave-steps{display:flex;flex-wrap:wrap;gap:.35rem}.wave-steps span{font-size:.65rem;background:#ffffff0a;padding:.35rem}.end-screen{position:absolute;inset:0;z-index:10;display:grid;place-content:center;text-align:center;padding:2rem;background:#1b0d27f2;backdrop-filter:blur(8px)}.end-screen h2{font:2.4rem Georgia,serif;margin:.4rem;color:#f0c9ff}.primary{border:1px solid #e3aaf6!important;background:linear-gradient(135deg,#9754b5,#63316f)!important;color:white!important;font-weight:700}.end-screen .primary{justify-self:center;padding:.8rem 1.2rem;margin-top:1rem}
	.inventory{max-width:1780px;margin:0 auto;padding:.62rem .85rem}.inventory header{display:flex;justify-content:space-between;align-items:center}.inventory h2{font:1.05rem Georgia,serif;margin:0}.inventory header>span{font-size:.67rem;color:#c4adcf}.inventory-scroll{display:flex;gap:.42rem;overflow:auto;padding:.45rem 0}.inventory article{display:grid;grid-template-columns:auto 1fr auto;gap:.38rem;align-items:center;min-width:190px;max-width:230px;padding:.45rem;border:1px solid #80529466;border-radius:8px;background:#ffffff07}.inventory article.selected{border-color:#e7b0f8;box-shadow:0 0 12px #b85ddd55}.item-glyph{font-size:1.2rem;color:#deaaf1}.inventory article div{display:grid}.inventory article b{font-size:.68rem}.inventory article small{font-size:.54rem;color:#a894b3}.inventory article strong{font-size:.8rem}.inventory article button{font-size:.62rem;padding:.25rem}.quiet{background:transparent!important;border-color:#6d4d7b!important}.turn-actions{display:grid;grid-template-columns:1fr auto auto;gap:.5rem;align-items:center;border-top:1px solid #ffffff11;padding-top:.5rem}.turn-actions>div{display:grid;font-size:.74rem}.turn-actions small{color:#9c89a7}.turn-actions .alert span{color:#f0c4dd}.turn-actions button{padding:.55rem .8rem}.pulse{box-shadow:0 0 20px #b95cd344}.ended .pulse{opacity:.4}.compact-actions{max-width:1780px;margin:0 auto;padding:.55rem .8rem;display:flex;align-items:center;justify-content:space-between;gap:1rem;font-size:.73rem}.compact-actions button{padding:.4rem .65rem}
	.defense-step button:disabled{opacity:.35;cursor:not-allowed}.inventory article.locked{opacity:.55}.switch input:focus-visible+span{outline:2px solid #efbaff;outline-offset:3px}.wave-result{display:block;margin-top:.7rem;color:#efc4ff}.run-summary{display:flex;justify-content:center;flex-wrap:wrap;gap:.55rem;margin:1rem 0}.run-summary span{display:grid;min-width:78px;padding:.55rem;border:1px solid #a56cbb66;border-radius:8px;background:#ffffff0a;font-size:.72rem}.run-summary b{font-size:1.1rem;color:#f1c9ff}
	.cycle-report-backdrop{position:fixed;inset:0;z-index:40;display:grid;place-items:center;padding:1rem;background:#09050eb8;backdrop-filter:blur(6px)}.cycle-report-modal{width:min(560px,calc(100vw - 2rem));padding:1.15rem 1.2rem;text-align:left;box-shadow:0 24px 80px #050208cc}.cycle-report-modal h2{font:1.65rem Georgia,serif;margin:.15rem 0 .8rem}.cycle-deltas{display:flex;flex-wrap:wrap;gap:.45rem;margin:.6rem 0}.cycle-deltas span{padding:.45rem .6rem;border:1px solid #9563ab66;border-radius:8px;background:#ffffff09;font-size:.72rem}.cycle-deltas b{color:#f2c9ff;font-size:.9rem}.cycle-deltas span.negative b{color:#efa6bd}.cycle-event{font-size:.76rem;padding:.45rem .55rem;border-left:2px solid #d292e8;background:#ffffff07}.cycle-wave{display:grid;grid-template-columns:1fr auto;gap:.35rem .8rem;margin:.75rem 0;padding:.7rem;border:1px solid #b876ce66;border-radius:9px;background:#7b3e9022;font-size:.74rem}.cycle-wave strong{grid-column:1/-1;color:#edc5ff}.cycle-report-modal>.primary{display:block;margin:.9rem 0 0 auto;padding:.55rem .9rem}
	@keyframes breathe{50%{filter:drop-shadow(0 0 9px #d895ef) brightness(1.22)}}
	@media(max-width:1150px){.hud{flex-wrap:wrap}.brand{min-width:180px}.capacities{flex:1}.resources{order:3;flex-basis:100%}.shell{grid-template-columns:190px minmax(450px,1fr)}.context{grid-column:1/-1}.board{--hex-w:110px;--hex-h:95px;width:570px;height:490px}.board button{width:var(--hex-w);height:var(--hex-h);left:calc(50% + (var(--q) * 82.5px) - var(--hex-w)/2);top:calc(50% + (var(--r) * 95px) + (var(--q) * 47.5px) - var(--hex-h)/2)}.inventory,.compact-actions{margin-inline:.65rem}}
	@media(max-width:760px){main{overflow:visible}.hud{position:relative;padding:.55rem}.brand{width:100%}.capacities{grid-template-columns:repeat(2,1fr)}.resources{grid-template-columns:repeat(2,1fr)}.resource{min-width:0}.shell{display:flex;flex-direction:column;padding:.5rem}.corcite-card{order:1}.stage{order:2;min-height:540px;padding:.7rem}.context{order:3}.corcite-orb{display:none}.corcite-card nav{grid-template-columns:repeat(3,1fr)}.corcite-card nav button{text-align:center;padding:.6rem .2rem}.effects{display:none}.stage-title{align-items:start}.stage-title>p{display:none}.board{--hex-w:92px;--hex-h:80px;width:430px;max-width:none;height:410px;left:50%;transform:translateX(-50%)!important;transform-origin:center}.board button{width:var(--hex-w);height:var(--hex-h);left:calc(50% + (var(--q) * 69px) - var(--hex-w)/2);top:calc(50% + (var(--r) * 80px) + (var(--q) * 40px) - var(--hex-h)/2);padding:.45rem}.board button small{font-size:.46rem;max-width:68px}.building-mark{font-size:1.55rem}.deposit-marker{left:13px;bottom:13px}.research-grid{grid-template-columns:1fr}.research-grid article.research-root{grid-column:auto;margin-bottom:.8rem}.research-grid article.research-root:after,.research-grid article.research-child:before{display:none}.research-prerequisite{text-align:left}.defense-path{padding-inline:.1rem}.defense-step{min-width:116px}.inventory{margin:.45rem;padding:.6rem}.inventory-scroll{scroll-snap-type:x mandatory}.inventory article{scroll-snap-align:start;min-width:190px}.turn-actions{grid-template-columns:1fr}.turn-actions button{width:100%}.callout{flex-direction:column}.context{min-height:auto}.context button,.research-grid button,.inventory button,.corcite-card nav button{min-height:44px}.compact-actions{margin:.45rem;flex-direction:column;align-items:stretch}.compact-actions button{min-height:44px}.cycle-wave{grid-template-columns:1fr}}
	@media(prefers-reduced-motion:reduce){.board button.preview{animation:none}.pulse{box-shadow:none}}
</style>
