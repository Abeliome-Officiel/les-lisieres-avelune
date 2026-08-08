<script lang="ts">
	import { onMount } from 'svelte';
	import AveluneIcon from '$lib/proto02/AveluneIcon.svelte';
	import { fullPlaytestVersion } from '$lib/playtest/version.js';
	import type { PageData } from './$types.js';
	import {
		BUILDINGS, LAB, RECIPES, RESEARCH, RESOURCE_LABELS,
		capacities, cancelProduction, collectBlockedOutput, createGame, dismantle, productionAvailability, productionDuration, resolveCycle,
		placeBuilding, placementPreview, placeTower, queueProduction, recycleItem, removeTower,
		startResearch, threatHint, toggleBuilding, toggleStaff,
		type BuildingId, type CycleResolution, type GameState, type HexCell, type ItemId, type ResearchId, type ResourceId
	} from '$lib/proto02/game.js';

	type View = 'structure' | 'stock' | 'research' | 'production' | 'defense';
	type SaveStatus = 'loading' | 'saved' | 'saving';
	export let data: PageData;
	const fullVersion = fullPlaytestVersion(data.buildCommit ?? undefined);
	const resourceIds: ResourceId[] = ['organic', 'mineral', 'refined', 'component'];
	let state: GameState = createGame();
	let sessionCode = '';
	let resumeCode = '';
	let stateVersion = 0;
	let sessionReady = false;
	let entryError = '';
	let view: View = 'structure';
	let selectedCellId: string | null = null;
	let placing: BuildingId | null = null;
	let notice = '';
	let saveRestored = false;
	let saveStatus: SaveStatus = 'loading';
	let cycleReport: CycleResolution | null = null;
	let actionCount = 0;
	let resolving = false;
	let feedbackOpen = false;
	let feedbackCategory = 'bug';
	let feedbackMessage = '';
	let feedbackStatus = '';
	let introAccepted = false;
	let rulesOpen = false;

	onMount(() => {
		saveStatus = 'loading';
	});

	$: caps = capacities(state);
	$: selectedCell = state.board.find((cell) => cell.id === selectedCellId) ?? null;
	$: selectedBuilding = selectedCell?.building ?? null;
	$: availableResources = Object.fromEntries(resourceIds.map((id) => [id, state.resources[id] - state.reserved[id]])) as Record<ResourceId, number>;
	$: towerInventory = state.inventory.find((entry) => entry.id === 'weakening-tower')?.quantity ?? 0;
	$: totalWeakening = state.defenses.filter((slot) => slot.tower).length * LAB.towerWeakening;
	$: storagePending = state.deploymentKit.includes('storage');
	$: displayResources = storagePending ? state.deploymentResources : state.resources;
	$: productionBuildings = state.board.filter((cell) => cell.building && ['workshop', 'transformer', 'defense-factory', 'recycler'].includes(cell.building.definitionId));
	$: productionAvailable = productionBuildings.length > 0 && !state.deployment;

	function commit(error: string | null, success = '') {
		notice = error ?? success;
		if (!error) actionCount += 1;
		state = { ...state };
		if (saveRestored) persistNow();
	}

	async function persistNow() {
		if (!sessionReady || !sessionCode) return;
		saveStatus = 'saving';
		try { const response = await fetch(`/api/playtest/session/${sessionCode}`, { method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({stateVersion,state}) }); const body=await response.json(); if(!response.ok) throw new Error(body.message); stateVersion=body.stateVersion; saveStatus='saved'; notice=body.conflict?'Sauvegarde acceptée après conflit de version.':'Sauvegarde serveur à jour.'; } catch(error) { saveStatus='saved'; notice=error instanceof Error?error.message:'Sauvegarde temporairement indisponible.'; }
	}

	async function openSession(kind:'create'|'resume') {
		entryError=''; saveStatus='loading';
		try { const response=await fetch(kind==='create'?'/api/playtest/session':'/api/playtest/session/resume',{method:'POST',headers:{'content-type':'application/json'},body:kind==='resume'?JSON.stringify({code:resumeCode}):undefined}); const body=await response.json(); if(!response.ok) throw new Error(body.message); sessionCode=body.code; stateVersion=body.stateVersion; state=body.state; sessionReady=true; saveRestored=true; saveStatus='saved'; notice=kind==='create'?'Partie créée. Notez votre code.':'Partie restaurée depuis le serveur.'; } catch(error) { entryError=error instanceof Error?error.message:'Serveur temporairement indisponible.'; saveStatus='loading'; }
	}

	async function sendFeedback() {
		feedbackStatus='Enregistrement…';
		try { const response=await fetch('/api/playtest/feedback',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({publicCode:sessionCode,category:feedbackCategory,message:feedbackMessage,turn:state.turn,view,context:{wave:state.waveNumber,status:state.status,resources:state.resources,storage:{load:caps.load,capacity:caps.storage},research:state.research.completed,defenses:state.defenses.filter((slot)=>slot.tower).length,viewport:{width:innerWidth,height:innerHeight}}})}); const body=await response.json(); if(!response.ok)throw new Error(body.message); feedbackStatus='Retour enregistré. Merci !'; feedbackMessage=''; } catch(error){feedbackStatus=error instanceof Error?error.message:'Retour non enregistré.';}
	}

	function sendCycleTelemetry(result: CycleResolution) {
		const post=(eventType:string,payload:Record<string,unknown>)=>fetch('/api/playtest/event',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({publicCode:sessionCode,turn:result.cycle,eventType,payload})});
		void post('cycle_ended',{player_action_count_since_last_cycle:result.playerActionCount,meaningful_action_available:result.meaningfulActionAvailable,idle_classification:result.idleClassification,forced_wait_causes:result.forcedWaitCauses,events:result.events.map((event)=>({type:event.type,recipeId:event.recipeId,plannedDuration:event.plannedDuration,observedDuration:event.observedDuration}))});
		for(const event of result.events){const mapped=event.type==='production_completed'?'production_completed':event.type==='production_blocked'?'production_blocked':event.type==='research_completed'?'research_completed':event.type==='wave_resolved'?'wave_resolved':event.type==='run_finished'?'run_finished':null;if(mapped)void post(mapped,{label:event.label,recipeId:event.recipeId,plannedDuration:event.plannedDuration,observedDuration:event.observedDuration});}
	}

	function chooseCell(cell: HexCell) {
		selectedCellId = cell.id;
		if (cell.building?.definitionId === 'storage') { view = 'stock'; placing = null; return; }
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
		const beforeWave = state.waveNumber;
		resolving = true;
		const result = resolveCycle(state, actionCount);
		if (typeof result === 'string') {
			resolving = false;
			commit(result);
			return;
		}
		cycleReport = result; actionCount = 0;
		sendCycleTelemetry(result);
		commit(null, 'Le Corcite a traversé un nouveau cycle.');
		actionCount = 0;
		setTimeout(() => resolving = false, 220);
		if (state.waveNumber > beforeWave) view = 'defense';
	}

	function newRun() {
		if (!confirm('Quitter cette session et créer un nouveau code ?')) return;
		sessionReady=false; sessionCode=''; stateVersion=0; state=createGame(); selectedCellId=null; placing=null; cycleReport=null; view='structure'; saveRestored=false;
	}

	function itemLabel(id: ItemId) { return id === 'weakening-tower' ? 'Tour d’Affaiblissement' : BUILDINGS[id].label; }
	function outputLabel(id: ItemId | ResourceId) { return id in RESOURCE_LABELS ? RESOURCE_LABELS[id as ResourceId] : itemLabel(id as ItemId); }
	function groundLabel(ground: HexCell['ground']) { return ground === 'organic' ? 'Filaments organiques' : ground === 'mineral' ? 'Gemme minérale' : 'Case neutre'; }
	function depositLabel(ground: HexCell['ground']) { return ground ? RESOURCE_LABELS[ground] : 'Aucun'; }
	function buildingIcon(id: BuildingId) { return id === 'storage' ? 'storage' : id === 'energy' ? 'energy' : id === 'maintenance' ? 'maintenance' : id === 'workshop' ? 'construction' : id === 'extractor-organic' ? 'extract-organic' : id === 'extractor-mineral' ? 'extract-mineral' : id === 'defense-factory' ? 'defense' : id === 'recycler' ? 'recycler' : 'refined'; }
	function researchIcon(id: ResearchId) { return id === 'transformation' || id === 'better-transformation' ? 'refined' : id === 'better-extraction' ? 'extract-organic' : id === 'better-fabrication' ? 'construction' : id === 'better-recycling' ? 'recycler' : 'storage'; }
</script>

<svelte:head><title>Les Lisières d’Avelune — PROTO-0.2</title><meta name="description" content="Alpha jouable des Lisières d’Avelune" /></svelte:head>

{#if !sessionReady}
	<main class="entry-screen"><section class="entry-card panel"><p class="eyebrow">PLAYTEST DISTRIBUÉ · PROTO-0.2.2</p><h1>Bienvenue dans Les Lisières d’Avelune</h1>{#if !introAccepted}<p>Vous allez éveiller et développer un Corcite, une structure vivante à la frontière de la Fracture.</p><p>Cette version n’est pas le jeu final. Elle teste une boucle volontairement réduite : organiser le Corcite, extraire et transformer des matières, faire évoluer ses fonctions, préparer des défenses puis affronter des ondes de plus en plus puissantes.</p><p>Développez-le assez efficacement pour qu’une ligne de défenses ramène un jour la Puissance d’une onde à zéro avant que son Intégrité ne tombe elle-même à zéro.</p><p>Une mécanique étrange, un cycle vide ou une règle qui vous paraît mauvaise est une information utile. Pendant toute la partie, utilisez <b>Signaler / proposer</b> pour envoyer bugs, incompréhensions, critiques, désaccords, idées, optimisations, simplifications et propositions.</p><button class="primary" onclick={()=>introAccepted=true}>J’ai compris — jouer</button>{:else}<p>Créez une partie anonyme ou reprenez-la depuis cet appareil ou un autre grâce à son code à 4 chiffres.</p><div class="entry-actions"><article><h2>Nouvelle partie</h2><button class="primary" onclick={() => openSession('create')}>Créer une partie</button></article><article><h2>Reprendre une partie</h2><label>Code à 4 chiffres<input bind:value={resumeCode} inputmode="numeric" maxlength="4" pattern="[0-9]{4}" placeholder="4827" /></label><button disabled={!/^\d{4}$/.test(resumeCode)} onclick={() => openSession('resume')}>Reprendre</button></article></div>{#if entryError}<p class="blocked" role="alert">{entryError}</p>{/if}<small>Aucune identité ni donnée personnelle n’est demandée.</small>{/if}<footer>{fullVersion}</footer></section></main>
{:else}
<main class:ended={state.status !== 'playing'}>
	<header class="hud">
		<div class="resources block-resources" aria-label="Ressources">
			{#each resourceIds as id}
				<div class="resource resource-{id}" class:bootstrap={storagePending && (id === 'organic' || id === 'mineral')} title={state.reserved[id] ? `${state.reserved[id]} engagé · ${state.resources[id]} total` : undefined}>
					<AveluneIcon name={id} size={20} /><span>{RESOURCE_LABELS[id]}</span><strong>{storagePending ? displayResources[id] : availableResources[id]}</strong>
					<small>{storagePending && displayResources[id] ? 'amorçage · hors capacité' : state.reserved[id] ? `${state.reserved[id]} engagé · ${state.resources[id]} total` : id === 'organic' || id === 'mineral' ? 'disponible' : '—'}</small>
				</div>
			{/each}
		</div>
		<div class="save-control" aria-live="polite">
			<span class:saving={saveStatus === 'saving'}>{saveStatus === 'loading' ? 'Chargement…' : saveStatus === 'saving' ? 'Sauvegarde…' : 'Sauvegarde à jour'}</span>
			<button class="quiet save-button" aria-label="Sauvegarder maintenant" title="Sauvegarder maintenant" onclick={persistNow}><AveluneIcon name="storage" size={16} /><span>Enregistrer</span></button>
		</div>
	</header>

	<div class="shell">
		<aside class="corcite-card panel">
			<div class="corcite-form" role="img" aria-label="Corcite biomorphique opalin, croissance organique et cristalline"><i></i><i></i><i></i><i></i></div>
			<section class="session-card"><p class="eyebrow">SESSION</p><strong>Code {sessionCode}</strong><button class="quiet" onclick={() => navigator.clipboard?.writeText(sessionCode)}>Copier le code</button><button class="quiet" onclick={()=>rulesOpen=true}>Règles</button><small>Sauvegarde serveur v{stateVersion}</small></section>
			<p class="eyebrow">IDENTITÉ · CYCLE {state.turn} · ONDE {state.waveNumber + 1}</p>
			<h1>Corcite opalin</h1>
			<p class="muted">Structure vivante organique et minérale, éveillée à la lisière de la Fracture.</p>
			<div class="integrity-bar"><span style:width={`${state.integrity / LAB.baseIntegrity * 100}%`}></span></div>
			<div class="corcite-stats" aria-label="État du Corcite">
				<span><AveluneIcon name="integrity" /><small>Intégrité</small><b>{state.integrity}/{LAB.baseIntegrity}</b></span>
				<span><AveluneIcon name="energy" /><small>Énergie</small><b>{caps.energyUsed}/{caps.energy}</b></span>
				<span><AveluneIcon name="population" /><small>Population</small><b>{caps.populationUsed}/{caps.population}</b></span>
				<span><AveluneIcon name="maintenance" /><small>Entretien</small><b>{caps.maintenanceUsed}/{caps.maintenance}</b></span>
				<span><AveluneIcon name="storage" /><small>Stockage</small><b>{caps.load}/{caps.storage}</b></span>
				<span><AveluneIcon name="cycle" /><small>Cycle</small><b>{state.turn}</b></span>
			</div>
			<p class="threat">{threatHint(state)}</p>
			<nav class="block-navigation" aria-label="Vues du Corcite">
				<button aria-label="Structure" title="Structure" class:active={view === 'structure'} onclick={() => view = 'structure'}><AveluneIcon name="corcite" /><span class="nav-label">Structure</span></button>
				<button aria-label="Stock" title="Stock" class:active={view === 'stock'} onclick={() => view = 'stock'}><AveluneIcon name="storage" /><span class="nav-label">Stock</span></button>
				<button aria-label="Évolution" title="Évolution" class:active={view === 'research'} onclick={() => view = 'research'}><AveluneIcon name="research" /><span class="nav-label">Évolution</span></button>
				<button aria-label="Production" class:active={view === 'production'} disabled={!productionAvailable} title={productionAvailable ? 'Production' : 'Disponible après le déploiement'} onclick={() => view = 'production'}><AveluneIcon name="production" /><span class="nav-label">Production</span></button>
				<button aria-label="Défenses" title="Défenses" class:active={view === 'defense'} onclick={() => view = 'defense'}><AveluneIcon name="defense" /><span class="nav-label">Défenses</span> <span class="nav-badge">{totalWeakening}</span></button>
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

			{#if state.deployment && view !== 'structure'}<div class="deployment-reminder"><span>Le déploiement bloque encore cette fonction.</span><button onclick={() => view = 'structure'}>Revenir à Structure</button></div>{/if}

			{#if view === 'structure'}
				<header class="stage-title"><div><p class="eyebrow">ESPACE DE TRAVAIL</p><h2>Structure du Corcite</h2></div><p>Une fonction par case. Seuls les extracteurs dépendent du gisement.</p></header>
				{#if state.deployment}<div class="callout"><b>Déploiement initial</b><span>{storagePending ? 'Implantez d’abord la Membrane de stockage.' : 'Le stockage est actif : implantez librement les six fonctions restantes.'}</span></div>{/if}
				<div class="board" aria-label="Structure hexagonale du Corcite">
					{#each state.board as cell}
						<button class:occupied={cell.building} class:selected={selectedCellId === cell.id} class:organic={cell.ground === 'organic'} class:mineral={cell.ground === 'mineral'} class:preview={placing && !cell.building} style={`--q:${cell.q};--r:${cell.r}`} onclick={() => chooseCell(cell)} aria-label={`${groundLabel(cell.ground)}${cell.building ? `, ${BUILDINGS[cell.building.definitionId].label}` : ', libre'}`}>
							{#if cell.ground}<span class="deposit-marker" aria-hidden="true"><AveluneIcon name={cell.ground} size={15} /></span>{/if}
							{#if cell.building}<span class="building-mark"><AveluneIcon name={buildingIcon(cell.building.definitionId)} size={29} /></span><small>{BUILDINGS[cell.building.definitionId].label}</small>{/if}
						</button>
					{/each}
				</div>
				<div class="legend"><span><AveluneIcon name="organic" size={15} />Organique</span><span><AveluneIcon name="mineral" size={15} />Minéral</span><span><i class="neutral-dot">·</i>Sans gisement</span></div>
			{:else if view === 'stock'}
				<header class="stage-title"><div><p class="eyebrow">STOCK GLOBAL</p><h2>Stock du Corcite</h2></div><p>{caps.load}/{caps.storage} unités occupées · toutes les membranes partagent ce stock</p></header>
				<div class="stock-groups">
					<section><h3>Matières primaires · niveau 0 / brut</h3>{#each resourceIds.slice(0,2) as id}<article class="stock-row"><AveluneIcon name={id} size={24}/><div><b>{RESOURCE_LABELS[id]}</b><small>{state.reserved[id]} engagé</small></div><strong>{state.resources[id]} en stock</strong></article>{/each}</section>
					<section><h3>Matières transformées · niveau 1</h3><article class="stock-row"><AveluneIcon name="refined" size={24}/><div><b>Transformé</b><small>{state.reserved.refined} engagé</small></div><strong>{state.resources.refined} en stock</strong></article></section>
					<section><h3>Composants · niveau 2</h3><article class="stock-row"><AveluneIcon name="component" size={24}/><div><b>Composant</b><small>{state.reserved.component} engagé</small></div><strong>{state.resources.component} en stock</strong></article></section>
					<section><h3>Fonctions / bâtiments</h3>{#each (Object.keys(BUILDINGS) as BuildingId[]) as id}{@const stack = state.inventory.find((entry) => entry.id === id)}<article class="stock-row"><AveluneIcon name={buildingIcon(id)} size={24}/><div><b>{BUILDINGS[id].label}</b><small>{state.board.filter((cell) => cell.building?.definitionId === id).length} implanté(s)</small></div><strong>{stack?.quantity ?? 0} en stock</strong></article>{/each}</section>
					<section><h3>Défenses</h3><article class="stock-row"><AveluneIcon name="defense" size={24}/><div><b>Tour d’Affaiblissement</b><small>{state.defenses.filter((slot) => slot.tower).length} posée(s)</small></div><strong>{towerInventory} en stock</strong></article></section>
				</div>
			{:else if view === 'research'}
				<header class="stage-title"><div><p class="eyebrow">ÉVOLUTION TRANSVERSALE</p><h2>Résonances du Corcite</h2></div><p>{state.research.repeatableLevels}/{LAB.repeatableLimit} niveaux répétés acquis</p></header>
				{#if state.research.active}<div class="callout"><b>{RESEARCH[state.research.active.id].label}</b><span>{state.research.active.turnsLeft} cycle(s) restant(s)</span></div>{/if}
				<div class="research-grid">
					{#each Object.entries(RESEARCH) as [rawId, node]}
						{@const id = rawId as ResearchId}{@const level = state.research.completed[id] ?? 0}{@const locked = node.prerequisite && !(state.research.completed[node.prerequisite] ?? 0)}
						<article class:root={!node.prerequisite} class:locked class:complete={(!node.repeatable && level > 0) || (node.maxLevel !== undefined && level >= node.maxLevel)}>
							{#if node.prerequisite}<span class="relation" aria-label={`Débloquée par ${RESEARCH[node.prerequisite].label}`}>← {RESEARCH[node.prerequisite].label}</span>{/if}
							<div><span class="research-gem"><AveluneIcon name={researchIcon(id)} size={23} /></span><small>{node.repeatable ? `Niveau ${level}${node.maxLevel ? `/${node.maxLevel}` : ''}` : level ? 'Acquise' : 'Non acquise'}</small></div>
							<h3>{node.label}</h3><p>{node.description}</p>
							<div class="costs">{#each resourceIds as resource}{#if node.cost[resource]}<span>{node.cost[resource]} {RESOURCE_LABELS[resource]}</span>{/if}{/each}<span>{node.turns} cycle(s)</span></div>
							<button disabled={Boolean(state.deployment || locked || state.research.active || (!node.repeatable && level) || (node.maxLevel !== undefined && level >= node.maxLevel) || (node.repeatable && state.research.repeatableLevels >= LAB.repeatableLimit))} onclick={() => commit(startResearch(state, id), 'Recherche lancée.')}>{state.deployment ? 'Après le déploiement' : locked ? 'Prérequis manquant' : node.maxLevel !== undefined && level >= node.maxLevel ? 'Niveau maximal' : 'Rechercher'}</button>
						</article>
					{/each}
				</div>
			{:else if view === 'production'}
				<header class="stage-title"><div><p class="eyebrow">GESTION DES FLUX</p><h2>Production</h2></div><p>Fabrications, transformations et sorties réunies sans quitter l’espace de travail.</p></header>
				<div class="production-list">
					{#each productionBuildings as cell}
						{@const building = cell.building!}{@const def = BUILDINGS[building.definitionId]}
						<article class:blocked-production={building.blockedOutput}>
							<header><span class="function-icon"><AveluneIcon name={buildingIcon(building.definitionId)} size={25} /></span><div><h3>{def.label}</h3><small>{building.active && (!def.population || building.staffed) ? 'Active' : 'En veille ou sans population'} · case {cell.id}</small></div><button class="quiet" onclick={() => { selectedCellId = cell.id; view = 'structure'; }}>Voir dans Structure</button></header>
							{#if building.blockedOutput}<div class="blocked" role="status"><b>Sortie bloquée</b><span>{building.blockedOutput.quantity} {outputLabel(building.blockedOutput.id)} attend localement.</span><button onclick={() => commit(collectBlockedOutput(state, cell.id), 'Sortie récupérée.')}>Transférer</button></div>
							{:else if building.order}<div class="order"><b>{RECIPES[building.order.recipeId].label}</b><span>{building.order.started ? `${building.order.turnsLeft} cycle(s) restant(s)` : 'Matières réservées · démarrage au prochain cycle'}</span>{#if !building.order.started}<button onclick={() => commit(cancelProduction(state, cell.id), 'Ordre annulé, matières libérées.')}>Annuler</button>{/if}</div>
						{:else if building.definitionId === 'workshop' || building.definitionId === 'defense-factory'}<div class="production-recipes">{#each Object.entries(RECIPES).filter(([, recipe]) => recipe.producer === building.definitionId) as [recipeId, recipe]}{@const availability = productionAvailability(state, cell.id, recipeId)}<button class:unavailable={!availability.available} disabled={!availability.available} onclick={() => commit(queueProduction(state, cell.id, recipeId), 'Fabrication réservée.')}><b>{recipe.label}</b><small>Stock {recipe.result in RESOURCE_LABELS ? state.resources[recipe.result as ResourceId] : state.inventory.find((entry) => entry.id === recipe.result)?.quantity ?? 0} · posé {recipe.result in BUILDINGS ? state.board.filter((candidate) => candidate.building?.definitionId === recipe.result).length : recipe.result === 'weakening-tower' ? state.defenses.filter((slot) => slot.tower).length : 0}</small><small>Coût : {resourceIds.filter((id) => recipe.cost[id]).map((id) => `${recipe.cost[id]} ${RESOURCE_LABELS[id]}`).join(' · ')} · durée {productionDuration(state, recipeId)} cycle(s) · prêt fin cycle {state.turn + productionDuration(state, recipeId)}</small>{#if !availability.available}<small class="reasons">{availability.reasons.join(' ')}</small>{/if}</button>{/each}</div>
							{:else}<p class="muted">{building.definitionId === 'transformer' ? 'Transformation automatique à chaque cycle lorsque les matières sont disponibles.' : 'Recycler les objets depuis l’inventaire global.'}</p>{/if}
						</article>
					{/each}
				</div>
			{:else}
				<header class="stage-title"><div><p class="eyebrow">LISIÈRE TACTIQUE</p><h2>Chemin d’Affaiblissement</h2></div><p>{totalWeakening} Puissance réduite · {towerInventory} tour(s) disponible(s)</p></header>
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
			{#if view === 'structure' && selectedCell}
				<h2>{selectedBuilding ? BUILDINGS[selectedBuilding.definitionId].label : groundLabel(selectedCell.ground)}</h2>
				<p class="deposit-detail">Gisement : <b>{depositLabel(selectedCell.ground)}</b></p>
				{#if selectedBuilding}
					{@const def = BUILDINGS[selectedBuilding.definitionId]}
					<p>{def.description}</p>
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
						{#if selectedBuilding.order}<div class="order"><b>{RECIPES[selectedBuilding.order.recipeId].label}</b><span>{selectedBuilding.order.started ? `${selectedBuilding.order.turnsLeft} cycle(s)` : 'Matières réservées'}</span>{#if !selectedBuilding.order.started}<button onclick={() => commit(cancelProduction(state, selectedCell.id), 'Ordre annulé, matières libérées.')}>Annuler</button>{/if}</div>
						{:else if !selectedBuilding.blockedOutput}<div class="recipe-list">{#each Object.entries(RECIPES).filter(([, recipe]) => recipe.producer === selectedBuilding.definitionId) as [recipeId, recipe]}<button disabled={state.deployment} onclick={() => commit(queueProduction(state, selectedCell.id, recipeId), 'Fabrication réservée.')}><b>{recipe.label}</b><small>{state.deployment ? 'Disponible après le déploiement initial' : `${resourceIds.filter((id) => recipe.cost[id]).map((id) => `${recipe.cost[id]} ${RESOURCE_LABELS[id]}`).join(' · ')} · ${recipe.turns} cycles`}</small></button>{/each}</div>
						{/if}
					{/if}
					<button class="danger" disabled={state.deployment} onclick={() => commit(dismantle(state, selectedCell.id), 'Bâtiment démonté et rangé.')}>Démonter</button>
				{:else}
					<p>Case libre. {selectedCell.ground ? 'Un extracteur compatible y produira normalement.' : 'Un extracteur peut y être posé, mais produira 0.'}</p>
					{#if !placing}<h3>Implanter</h3><div class="recipe-list">{#each (state.deployment ? state.deploymentKit : state.inventory.filter((entry) => entry.quantity > 0 && entry.id !== 'weakening-tower').map((entry) => entry.id)) as id}<button disabled={storagePending && id !== 'storage'} onclick={() => { placing = id as BuildingId; notice = placementPreview(state, selectedCell.id, id as BuildingId); }}><AveluneIcon name={buildingIcon(id as BuildingId)} size={18}/><b>{itemLabel(id)}</b><small>{state.deployment ? 'Kit disponible' : `${state.inventory.find((entry) => entry.id === id)?.quantity ?? 0} en stock`}</small></button>{:else}<p class="muted">Aucun bâtiment réellement disponible en stock.</p>{/each}</div>{/if}
					{#if placing}<div class="preview"><b>Prévisualisation</b><span>{placementPreview(state, selectedCell.id, placing)}</span><button class="primary" onclick={confirmPlacement}>Confirmer la pose</button></div>{/if}
				{/if}
			{:else}
				<h2>{view === 'research' ? 'Progression' : view === 'production' ? 'Flux du Corcite' : 'Défense'}</h2><p>{view === 'research' ? 'Les recherches modifient directement les fonctions du Corcite. Les quatre niveaux répétés sont partagés.' : view === 'production' ? 'Sélectionnez une fonction dans la vue Production, ou retrouvez-la ici dans la Structure.' : 'Les tours agissent dans l’ordre des huit positions. Chaque tour retire jusqu’à 9 Puissance.'}</p>
			{/if}
			<div class="journal"><h3>Échos récents</h3>{#each [...state.logs].reverse().slice(0, 5) as entry}<p><b>C{entry.turn}</b> {entry.message}</p>{/each}</div>
		</aside>
	</div>

	<section class="inventory panel block-activity">
		{#if state.deployment}
		<header><div><p class="eyebrow">{state.deployment ? 'DÉPLOIEMENT INITIAL' : 'INVENTAIRE GLOBAL'}</p><h2>{state.deployment ? 'Kit du Corcite' : 'Objets du Corcite'}</h2></div><span>{state.deployment ? `${state.deploymentKit.length} fonction(s) à implanter · hors stockage` : `${caps.load} / ${caps.storage} unités`}</span></header>
		<div class="inventory-scroll">
			{#if state.deployment}
				{#each state.deploymentKit as id}
					<article class:selected={placing === id} class:locked={storagePending && id !== 'storage'}>
						<span class="item-glyph">◇</span><div><b>{itemLabel(id)}</b><small>{storagePending && id !== 'storage' ? 'Posez d’abord la Membrane de stockage' : 'Élément du kit · hors stockage'}</small></div><strong>×1</strong>
						<button disabled={storagePending && id !== 'storage'} onclick={() => { placing = id as BuildingId; view = 'structure'; notice = id === 'storage' ? 'Choisissez la première case, puis confirmez sa pose.' : 'Choisissez une case libre puis confirmez.'; }}>Implanter</button>
					</article>
				{/each}
			{/if}
		</div>
		{/if}
		<div class="turn-actions"><div class:alert={notice || state.deployment} role="status" aria-live="polite"><span>{resolving ? 'Résolution du cycle…' : notice || (state.deployment ? 'Implantez tout le kit initial pour commencer le premier cycle.' : 'Organisez vos fonctions, puis laissez le Corcite traverser un cycle.')}</span><small>{state.deployment ? (storagePending ? 'Les matières d’amorçage existent déjà hors capacité ; le stockage les rend stockables.' : 'Le kit reste hors stockage ; les matières d’amorçage occupent maintenant la capacité.') : 'La prochaine onde reste impromptue.'}</small></div><button class="primary pulse" class:resolving disabled={state.status !== 'playing' || state.deployment || resolving} title={state.deployment ? 'Terminez le déploiement initial.' : ''} onclick={nextTurn}>Terminer le cycle {state.turn}</button><button class="quiet" onclick={newRun}>Nouvelle partie</button></div>
	</section>

	{#if cycleReport}
		<div class="cycle-report-backdrop">
			<div class="cycle-report-modal panel" role="dialog" aria-modal="true" aria-labelledby="cycle-report-title" aria-live="polite">
				<p class="eyebrow">CYCLE RÉSOLU</p>
				<h2 id="cycle-report-title">Cycle {cycleReport.cycle} → {cycleReport.cycle + 1}</h2>
				<div class="cycle-deltas">{#each resourceIds as id}{#if cycleReport.resourceDeltas[id]}<span class:negative={cycleReport.resourceDeltas[id] < 0}><AveluneIcon name={id} size={16}/><b>{cycleReport.resourceDeltas[id] > 0 ? '+' : ''}{cycleReport.resourceDeltas[id]}</b> {RESOURCE_LABELS[id]}</span>{/if}{/each}</div>
				{#each cycleReport.events as event}<p class="cycle-event"><b>{event.label}</b>{#if event.plannedDuration} · durée prévue {event.plannedDuration} cycle(s){/if}</p>{:else}<p class="muted">Aucun changement mécanique pendant ce cycle.</p>{/each}
				<p class="cycle-event">Rythme : <b>{cycleReport.idleClassification}</b> · {cycleReport.playerActionCount} action(s){#if cycleReport.forcedWaitCauses.length} · {cycleReport.forcedWaitCauses.join(', ')}{/if}</p>
				{#if cycleReport.wave}<div class="cycle-wave"><strong>Onde {cycleReport.wave.number}</strong><span>Puissance {cycleReport.wave.initialPower} → {cycleReport.wave.residualPower}</span><span>Intégrité {cycleReport.wave.integrityBefore} → {cycleReport.wave.integrityAfter}</span><small>Le rapport d’onde détaillé reste distinct dans Défenses.</small></div>{/if}
				<button class="primary" onclick={() => cycleReport = null}>Continuer</button>
			</div>
		</div>
	{/if}
	<button class="feedback-fab" onclick={() => feedbackOpen=true}>Signaler / proposer</button>
		{#if feedbackOpen}<div class="cycle-report-backdrop"><form class="feedback-modal panel" onsubmit={(event)=>{event.preventDefault();void sendFeedback();}}><button type="button" class="modal-close" aria-label="Fermer" onclick={()=>feedbackOpen=false}>×</button><p class="eyebrow">RETOUR DE PLAYTEST</p><h2>Signaler / proposer</h2><p>N’hésitez pas à signaler bug, incompréhension, idée, désaccord, règle inutile, amélioration, raccourci possible ou proposition.</p><label>Catégorie<select bind:value={feedbackCategory}><option value="bug">Bug / comportement anormal</option><option value="interface">Interface / lisibilité</option><option value="idea">Idée</option><option value="rule_disagreement">Désaccord avec une règle</option><option value="balance">Équilibrage / rythme</option><option value="optimization">Optimisation / simplification</option><option value="proposal">Proposition</option><option value="other">Autre</option></select></label><label>Votre retour<textarea bind:value={feedbackMessage} required maxlength="4000" rows="7"></textarea></label><small>Aucune identité n’est demandée. Le contexte mécanique et la taille d’écran sont joints automatiquement.</small><button class="primary" disabled={!feedbackMessage.trim()}>Enregistrer le retour</button>{#if feedbackStatus}<p role="status">{feedbackStatus}</p>{/if}</form></div>{/if}
	{#if rulesOpen}<div class="cycle-report-backdrop"><article class="rules-modal panel"><button class="modal-close" aria-label="Fermer" onclick={()=>rulesOpen=false}>×</button><p class="eyebrow">NOTICE · {fullVersion}</p><h2>Règles du prototype</h2><h3>But</h3><p>Renforcez le Corcite, produisez, recherchez et placez des Tours d’Affaiblissement. Ramenez la Puissance d’une onde à 0 avant que l’Intégrité tombe à 0.</p><h3>Cycle</h3><p>Préparez vos décisions puis « Terminer le cycle » résout extraction, transformation, fabrications, recherche et événements. Certaines actions prennent plusieurs cycles ; attendre peut être nécessaire.</p><h3>Structure</h3><p>Une fonction occupe une case. Seuls les extracteurs dépendent du gisement ; les autres bâtiments vont sur toute case libre.</p><h3>Ressources et Production</h3><p>Les matières financent recherches et fabrications. Les matières engagées ne se dépensent pas deux fois. Une sortie reste bloquée si le stockage est plein.</p><h3>Évolution</h3><p>Transformation ouvre une partie de la production. Les améliorations répétables sont limitées à quatre niveaux cumulés.</p><h3>Défenses</h3><p>Les tours agissent dans l’ordre du chemin, chacune réduit la Puissance, puis le résidu frappe l’Intégrité.</p><h3>Important</h3><p>Ce prototype est incomplet : aucun choix n’est supposé évident. Signalez aussi bugs, critiques, désaccords, idées, optimisations, simplifications et propositions.</p></article></div>{/if}
</main>
{/if}

<style>
	:global(*){box-sizing:border-box} :global(body){margin:0;background:#130c1d;color:#f2eafd;font-family:Inter,ui-sans-serif,system-ui,sans-serif} :global(button){font:inherit}
	main{min-height:100vh;background:radial-gradient(circle at 50% 30%,#442057 0,transparent 38%),linear-gradient(135deg,#100918,#21102e 55%,#110a1a);padding-bottom:1rem;position:relative;overflow:hidden} main:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.14;background-image:radial-gradient(#e8ceff 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,black,transparent)}
	.hud{min-height:76px;display:flex;align-items:stretch;gap:1rem;padding:.65rem 1rem;border-bottom:1px solid #a873c955;background:#160d21e8;backdrop-filter:blur(14px);position:relative;z-index:5}.brand{display:flex;align-items:center;gap:.7rem;min-width:210px}.brand small,.eyebrow{display:block;color:#c89be4;font-size:.66rem;font-weight:800;letter-spacing:.13em;margin:0 0 .25rem}.brand strong{font-family:Georgia,serif;font-size:1.15rem}.sigil{display:grid;place-items:center;width:43px;height:43px;border:1px solid #d6a9ed;border-radius:50% 45% 52% 43%;font-size:1.7rem;color:#f0cfff;box-shadow:0 0 24px #bd62e477 inset,0 0 18px #bd62e455}.resources{display:grid;grid-template-columns:repeat(4,minmax(90px,1fr));gap:.45rem;flex:1}.resource{padding:.45rem .65rem;border:1px solid #80569a66;border-radius:9px;background:#ffffff09;display:grid;grid-template-columns:1fr auto;align-items:center}.resource span{font-size:.7rem;color:#d8c5e4}.resource strong{font-size:1.15rem}.resource small{grid-column:1/-1;color:#f0b6d1;font-size:.62rem}
	.shell{display:grid;grid-template-columns:230px minmax(530px,1fr) 275px;gap:.75rem;padding:.75rem;max-width:1800px;margin:auto}.panel{border:1px solid #9467ad55;border-radius:15px;background:linear-gradient(145deg,#2d1739d9,#170f22e8);box-shadow:0 12px 40px #08030d66,inset 0 1px #ffffff12}.corcite-card,.context{padding:1rem;min-width:0}.corcite-card h1{font:1.5rem Georgia,serif;margin:.2rem 0}.muted{color:#ad9bb8;font-size:.8rem}.integrity-bar{height:7px;background:#0e0915;border-radius:9px;overflow:hidden;margin:.8rem 0 .35rem}.integrity-bar span{display:block;height:100%;background:linear-gradient(90deg,#b34780,#f4b7db);box-shadow:0 0 10px #f48ecb}.threat{padding:.65rem;border-left:2px solid #dc94f3;background:#ffffff08;font-size:.76rem;line-height:1.4}.corcite-card nav{display:grid;gap:.4rem;margin:1rem 0}.corcite-card nav button{border:1px solid transparent;background:#ffffff08;color:#d6c8de;text-align:left;padding:.65rem .8rem;border-radius:8px;cursor:pointer}.corcite-card nav button.active{background:#a05fc42b;border-color:#b875d3;color:#fff}.corcite-card nav span{float:right;background:#9a50b8;padding:.05rem .4rem;border-radius:9px}.effects h2,.journal h3,.context h3{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#c89be4;margin-top:1.2rem}.effects span{display:block;padding:.35rem 0;font-size:.75rem;border-bottom:1px solid #ffffff0d}
	.stage{min-height:580px;border:1px solid #8c5ca544;border-radius:18px;padding:1.1rem;background:radial-gradient(circle at center,#4c24543d,transparent 65%),#160d20aa;position:relative;overflow:auto}.stage-title{display:flex;align-items:end;justify-content:space-between;gap:1rem}.stage-title h2{font:1.7rem Georgia,serif;margin:0}.stage-title>p{max-width:320px;color:#b3a1bf;font-size:.75rem;text-align:right}.callout{display:flex;justify-content:space-between;gap:1rem;padding:.75rem 1rem;margin:.8rem 0;border:1px solid #d68dea88;background:#8c48a12b;border-radius:9px;font-size:.8rem}.board{height:470px;position:relative;margin:1rem auto;max-width:680px;filter:drop-shadow(0 18px 30px #06020a)}.board button{--size:90px;position:absolute;width:var(--size);height:calc(var(--size)*.88);left:calc(50% + (var(--q) * 77px) + (var(--r) * 38.5px) - var(--size)/2);top:calc(50% + (var(--r) * 67px) - var(--size)*.44);clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%);border:0;background:linear-gradient(145deg,#41254d,#291734);color:#c5a8d3;cursor:pointer;transition:transform .15s,filter .15s;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.6rem}.board button:after{content:"";position:absolute;inset:4px;clip-path:inherit;border:1px solid #b681c455;pointer-events:none}.board button:hover,.board button:focus-visible{transform:scale(1.07);z-index:2;filter:brightness(1.25)}.board button.occupied{background:radial-gradient(circle,#9c63b2,#372144 65%)}.board button.selected{filter:drop-shadow(0 0 10px #f3bcff) brightness(1.35);z-index:3}.board button.preview{animation:breathe 1.8s infinite}.deposit-marker{position:absolute;top:12px;left:18px;z-index:1;display:grid;place-items:center;width:22px;height:22px;border:1px solid currentColor;border-radius:50%;background:#1c1027e6;font-size:1rem;font-weight:800;line-height:1;box-shadow:0 0 8px currentColor}.board button.organic .deposit-marker{color:#e287c6}.board button.mineral .deposit-marker{color:#ad9be1}.building-mark{font-size:1.8rem;color:#f5d8ff;text-shadow:0 0 10px #ebafff}.board button small{font-size:.52rem;line-height:1.05;max-width:72px;color:white}.legend{display:flex;justify-content:center;gap:1.3rem;font-size:.7rem;color:#baa5c4}.legend i{display:inline-block;width:1.2rem;margin-right:.2rem;font-style:normal;font-weight:800;text-align:center}.organic-dot{color:#e287c6}.mineral-dot{color:#ad9be1}.neutral-dot{color:#8a7196}
	.context h2{font:1.35rem Georgia,serif;margin:.3rem 0}.context>p{font-size:.8rem;line-height:1.5;color:#bfaec9}.context .deposit-detail{margin:.35rem 0 .7rem;color:#d8c7e2}.deposit-detail b{color:#fff}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;margin:.8rem 0}.facts span{padding:.45rem .2rem;background:#ffffff08;text-align:center;font-size:.62rem;border-radius:6px}.facts b{display:block;color:#fff;font-size:.9rem}.formula,.preview,.blocked,.order{display:grid;gap:.4rem;padding:.7rem;margin:.7rem 0;border:1px solid #a675bc55;border-radius:8px;background:#ffffff08;font-size:.74rem}.switch{display:flex;align-items:center;gap:.5rem;font-size:.75rem;margin:.55rem 0;cursor:pointer}.switch input{position:absolute;opacity:0}.switch span{width:34px;height:18px;border-radius:12px;background:#493253;position:relative}.switch span:after{content:"";position:absolute;width:12px;height:12px;border-radius:50%;background:#bca8c7;left:3px;top:3px;transition:.2s}.switch input:checked+span{background:#995ab5}.switch input:checked+span:after{left:19px;background:white}.recipe-list{display:grid;gap:.35rem;max-height:195px;overflow:auto}.recipe-list button{display:grid;text-align:left;gap:.15rem}.recipe-list small{color:#bca7c5}.context button,.research-grid button,.inventory button{border:1px solid #9d68b5;background:#4b2b59;color:#f5eaff;padding:.45rem .6rem;border-radius:7px;cursor:pointer}.context button:hover,.research-grid button:hover,.inventory button:hover{background:#673677}.context button:disabled,.research-grid button:disabled,.inventory button:disabled{opacity:.35;cursor:not-allowed}.danger{width:100%;margin-top:.8rem;border-color:#9c526c!important;background:#492435!important}.journal{border-top:1px solid #ffffff13;margin-top:1rem}.journal p{font-size:.67rem!important;margin:.45rem 0!important;color:#a998b3!important}.journal b{color:#daa4eb;margin-right:.25rem}
	.research-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem;margin-top:1rem}.research-grid article{border:1px solid #86589e66;border-radius:12px;padding:1rem;background:linear-gradient(145deg,#42234f99,#21142ccc);position:relative}.research-grid article.locked{filter:saturate(.3);opacity:.62}.research-grid article.complete{border-color:#ddaaf0}.research-grid article>div:first-child{display:flex;justify-content:space-between}.research-gem{font-size:1.5rem;color:#e4aefa}.research-grid h3{font:1.05rem Georgia,serif;margin:.5rem 0}.research-grid p{font-size:.75rem;color:#bfaec8;min-height:34px}.costs{display:flex;gap:.3rem;flex-wrap:wrap;margin:.6rem 0}.costs span{font-size:.6rem;background:#ffffff0b;padding:.25rem .35rem;border-radius:4px}.research-grid button{width:100%}.defense-summary{height:80px;display:flex;align-items:center;justify-content:center;gap:.8rem;color:#d3a6e4}.defense-summary i{height:1px;background:linear-gradient(90deg,#ce7de7,transparent);width:80px}.defense-path{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem}.defense-path button{min-height:126px;border:1px dashed #86559e;background:#25152f;color:#bba5c6;border-radius:50% 50% 45% 55% / 45% 55%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;cursor:pointer}.defense-path button.tower{border-style:solid;background:radial-gradient(circle,#a35ab877,#281633 65%);box-shadow:inset 0 0 20px #c974e64d}.defense-path b{font-size:2rem;color:#e9b9fb}.defense-path small{font-size:.57rem}.defense-path span{font-size:.68rem}.wave-report{margin-top:1.2rem;padding:1rem;border:1px solid #bc79d277;border-radius:12px;background:#120c1cd9}.wave-report h3{font:1.2rem Georgia,serif;margin:.4rem 0}.wave-steps{display:flex;flex-wrap:wrap;gap:.4rem}.wave-steps span{font-size:.68rem;background:#ffffff0a;padding:.4rem}.end-screen{position:absolute;inset:0;z-index:10;display:grid;place-content:center;text-align:center;padding:2rem;background:#1b0d27f2;backdrop-filter:blur(8px)}.end-screen h2{font:2.4rem Georgia,serif;margin:.4rem;color:#f0c9ff}.primary{border:1px solid #e3aaf6!important;background:linear-gradient(135deg,#9754b5,#63316f)!important;color:white!important;font-weight:700}.end-screen .primary{justify-self:center;padding:.8rem 1.2rem;margin-top:1rem}
	.inventory{margin:0 .75rem;max-width:1776px;margin-inline:auto;padding:.8rem 1rem}.inventory header{display:flex;justify-content:space-between;align-items:center}.inventory h2{font:1.15rem Georgia,serif;margin:0}.inventory header>span{font-size:.7rem;color:#c4adcf}.inventory-scroll{display:flex;gap:.55rem;overflow:auto;padding:.65rem 0}.inventory article{display:grid;grid-template-columns:auto 1fr auto;gap:.45rem;align-items:center;min-width:240px;padding:.6rem;border:1px solid #80529466;border-radius:9px;background:#ffffff07}.inventory article.selected{border-color:#e7b0f8;box-shadow:0 0 12px #b85ddd55}.item-glyph{font-size:1.5rem;color:#deaaf1}.inventory article div{display:grid}.inventory article b{font-size:.72rem}.inventory article small{font-size:.58rem;color:#a894b3}.inventory article strong{font-size:.85rem}.inventory article button{font-size:.66rem;padding:.3rem}.quiet{background:transparent!important;border-color:#6d4d7b!important}.turn-actions{display:grid;grid-template-columns:1fr auto auto;gap:.6rem;align-items:center;border-top:1px solid #ffffff11;padding-top:.7rem}.turn-actions>div{display:grid;font-size:.78rem}.turn-actions small{color:#9c89a7}.turn-actions .alert span{color:#f0c4dd}.turn-actions button{padding:.65rem .9rem}.pulse{box-shadow:0 0 20px #b95cd344}.ended .pulse{opacity:.4}
	.defense-path button:disabled{opacity:.35;cursor:not-allowed}.inventory article.locked{opacity:.55}
	.switch input:focus-visible+span{outline:2px solid #efbaff;outline-offset:3px}.wave-result{display:block;margin-top:.7rem;color:#efc4ff}.run-summary{display:flex;justify-content:center;flex-wrap:wrap;gap:.55rem;margin:1rem 0}.run-summary span{display:grid;min-width:78px;padding:.55rem;border:1px solid #a56cbb66;border-radius:8px;background:#ffffff0a;font-size:.72rem}.run-summary b{font-size:1.1rem;color:#f1c9ff}
	@keyframes breathe{50%{filter:drop-shadow(0 0 9px #d895ef) brightness(1.25)}}
	@media(max-width:1150px){.hud{flex-wrap:wrap}.brand{min-width:180px}.resources{order:3;flex-basis:100%}.shell{grid-template-columns:190px minmax(450px,1fr)}.context{grid-column:1/-1}.board{transform:scale(.88);margin:-15px auto}.inventory{margin-inline:.75rem}}
	@media(max-width:760px){main{overflow:visible}.hud{position:relative;padding:.6rem}.brand{width:100%}.resources{grid-template-columns:repeat(2,1fr)}.resource{min-width:0}.shell{display:flex;flex-direction:column;padding:.5rem}.corcite-card{order:1}.stage{order:2;min-height:540px;padding:.7rem}.context{order:3}.corcite-card nav{grid-template-columns:repeat(3,1fr)}.corcite-card nav button{text-align:center;padding:.6rem .2rem}.effects{display:none}.stage-title{align-items:start}.stage-title>p{display:none}.board{height:420px;width:520px;left:50%;transform:translateX(-50%) scale(.7);transform-origin:center}.research-grid{grid-template-columns:1fr}.defense-path{grid-template-columns:repeat(2,1fr)}.inventory{margin:.5rem;padding:.7rem}.inventory-scroll{scroll-snap-type:x mandatory}.inventory article{scroll-snap-align:start}.turn-actions{grid-template-columns:1fr}.turn-actions button{width:100%}.callout{flex-direction:column}.context{min-height:auto}.context button,.research-grid button,.inventory button,.corcite-card nav button{min-height:44px}}

	/* P02.1 — six blocs communs, densifiés puis réordonnés sans UI mobile parallèle. */
	.hud{min-height:66px;padding:.5rem .75rem;gap:.7rem}.brand{min-width:190px}.resources{gap:.35rem}.resource{grid-template-columns:auto 1fr auto;column-gap:.4rem;padding:.35rem .5rem}.resource span{font-weight:650}.resource small{grid-column:2/-1}.resource.bootstrap{border-color:#d594be99;background:#ba6d9a16}.save-control{display:flex;min-width:145px;align-items:center;justify-content:center;flex-direction:column;gap:.2rem;color:#bfa9c9;font-size:.66rem}.save-control span:before{content:"";display:inline-block;width:6px;height:6px;margin-right:.35rem;border-radius:50%;background:#9de0bb;box-shadow:0 0 7px #9de0bb}.save-control span.saving:before{background:#e6b6f5}.save-control button{padding:.25rem .4rem;font-size:.62rem;color:#d7c4e1}
	.shell{grid-template-columns:220px minmax(490px,1fr) 255px;gap:.55rem;padding:.55rem}.corcite-card,.context{padding:.75rem}.stage{min-height:500px;padding:.8rem}.stage-title h2{font-size:1.45rem}.stage-title>p{margin:.2rem 0}.corcite-form{height:92px;position:relative;isolation:isolate}.corcite-form:before{content:"";position:absolute;width:102px;height:69px;left:48%;top:9px;transform:translateX(-50%) rotate(-12deg);border-radius:71% 29% 61% 39% / 48% 64% 36% 52%;background:radial-gradient(ellipse at 30% 26%,#fff 0 3%,#e9c9fb 7%,#9a5aad 31%,#4b285b 62%,#23132e 100%);box-shadow:inset -18px -13px 21px #180a26cc,inset 10px 7px 15px #f3d2ff3d,0 8px 25px #b568d274}.corcite-form:after{content:"";position:absolute;width:38px;height:60px;left:63%;top:4px;z-index:-1;clip-path:polygon(45% 0,75% 58%,100% 100%,44% 74%,0 100%,24% 43%);background:linear-gradient(125deg,#f0d7ff,#7c4399 55%,#2a1738);filter:drop-shadow(0 0 8px #d58aec)}.corcite-form i{position:absolute;left:31%;top:41px;width:52px;height:16px;border:1px solid #edbfffaa;border-radius:50%;transform:rotate(17deg)}.corcite-form i:nth-child(2){left:39%;top:27px;width:60px;transform:rotate(-24deg)}.corcite-form i:nth-child(3){left:65%;top:62px;width:24px;height:24px;border-radius:70% 30%;transform:rotate(36deg)}.corcite-form i:nth-child(4){left:23%;top:48px;width:35px;height:31px;border-radius:30% 70%;transform:rotate(-35deg);border-color:#c680b9}.corcite-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:.3rem;margin:.55rem 0}.corcite-stats span{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:0 .35rem;padding:.35rem;border-radius:7px;background:#ffffff08;color:#ddb8ec}.corcite-stats small{color:#bca8c7;font-size:.61rem}.corcite-stats b{grid-column:2;font-size:.78rem;color:#fff}.corcite-card nav{grid-template-columns:1fr 1fr;gap:.3rem;margin:.65rem 0}.corcite-card nav button{display:flex;align-items:center;gap:.35rem;padding:.5rem;font-size:.72rem}.corcite-card nav button:disabled{opacity:.42;cursor:not-allowed}.corcite-card nav span{margin-left:auto}
	.board{--hex-w:108px;--hex-h:94px;width:min(100%,610px);height:520px;margin:0 auto;max-width:none;transform:none!important}.board button{width:var(--hex-w);height:var(--hex-h);left:calc(50% + (var(--q) * 81px) - var(--hex-w)/2);top:calc(50% + (var(--r) * 94px) + (var(--q) * 47px) - var(--hex-h)/2);clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);padding:.45rem;transition:filter .15s,background .15s}.board button:after{inset:2px}.board button:hover,.board button:focus-visible{transform:none;z-index:2;filter:brightness(1.22)}.board button.selected{transform:none}.board button small{font-size:.49rem;max-width:74px}.deposit-marker{top:auto;left:15px;bottom:14px;width:17px;height:17px;opacity:.72;box-shadow:none}.board button.occupied .deposit-marker{opacity:.48}.building-mark{height:32px;position:relative;z-index:2}.legend{margin-top:-.2rem}.legend span{display:flex;align-items:center;gap:.25rem}
	.deployment-reminder{display:flex;align-items:center;justify-content:space-between;gap:.5rem;padding:.55rem .7rem;margin-bottom:.6rem;border:1px solid #bd7fd266;border-radius:8px;background:#74418424;font-size:.75rem}.deployment-reminder button{border:1px solid #a76dba;border-radius:6px;background:#4a2955;color:#fff;padding:.4rem .6rem}.research-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem}.research-grid article{padding:.65rem .7rem;border-radius:9px}.research-grid article.root{grid-column:1/-1}.research-grid article:not(.root):before{content:"";position:absolute;top:-.46rem;left:1.25rem;width:1px;height:.45rem;background:#c795d4}.research-grid h3{font-size:.92rem;margin:.3rem 0}.research-grid p{min-height:0;margin:.25rem 0;font-size:.69rem}.research-grid button{padding:.35rem}.relation{display:block;color:#aa8ab7;font-size:.56rem;margin-bottom:.25rem}.costs{margin:.35rem 0}.defense-path{display:flex;align-items:center;gap:0;width:100%;overflow-x:auto;padding:.8rem .1rem 1rem}.defense-step{display:flex;align-items:center;flex:1 1 0;min-width:104px}.defense-step button{width:88px;min-width:88px;min-height:94px}.defense-link{flex:1;min-width:16px;color:#d38ce9;font-size:1rem;text-align:center;text-shadow:0 0 8px #c76ce6}.production-list{display:grid;gap:.5rem;margin-top:.7rem}.production-list>article{border:1px solid #84589b66;border-radius:10px;padding:.65rem;background:#ffffff07}.production-list>article>header{display:flex;align-items:center;gap:.55rem}.production-list h3{font:1rem Georgia,serif;margin:0}.production-list header div{flex:1}.production-list header small{color:#b6a3c0}.function-icon{display:grid;place-items:center;width:38px;height:38px;border-radius:12px 50% 35%;background:#9b5db733;color:#edc8fb}.production-recipes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.35rem;margin-top:.55rem}.production-recipes button{display:grid;text-align:left;gap:.15rem;padding:.45rem;border:1px solid #87579b;background:#3a2147;color:#f5eaff;border-radius:7px}.production-recipes small{color:#baa5c3;font-size:.6rem}.blocked-production{border-color:#bf708e!important}.resolving{animation:resolve-cycle .22s ease-out}.inventory{padding:.6rem .75rem}.inventory-scroll{padding:.45rem 0}.inventory article{min-width:220px;padding:.45rem}.turn-actions{padding-top:.5rem}.turn-actions button{padding:.55rem .7rem}
	.cycle-report-backdrop{position:fixed;inset:0;z-index:40;display:grid;place-items:center;padding:1rem;background:#09050eb8;backdrop-filter:blur(6px)}.cycle-report-modal{width:min(560px,calc(100vw - 2rem));padding:1.15rem 1.2rem;text-align:left;box-shadow:0 24px 80px #050208cc}.cycle-report-modal h2{font:1.65rem Georgia,serif;margin:.15rem 0 .8rem}.cycle-deltas{display:flex;flex-wrap:wrap;gap:.45rem;margin:.6rem 0}.cycle-deltas span{padding:.45rem .6rem;border:1px solid #9563ab66;border-radius:8px;background:#ffffff09;font-size:.72rem}.cycle-deltas b{color:#f2c9ff;font-size:.9rem}.cycle-deltas span.negative b{color:#efa6bd}.cycle-event{font-size:.76rem;padding:.45rem .55rem;border-left:2px solid #d292e8;background:#ffffff07}.cycle-wave{display:grid;grid-template-columns:1fr auto;gap:.35rem .8rem;margin:.75rem 0;padding:.7rem;border:1px solid #b876ce66;border-radius:9px;background:#7b3e9022;font-size:.74rem}.cycle-wave strong,.cycle-wave small{grid-column:1/-1}.cycle-wave strong{color:#edc5ff}.cycle-wave small{color:#bfa9c9}.cycle-report-modal>.primary{display:block;margin:.9rem 0 0 auto;padding:.55rem .9rem}
	@keyframes resolve-cycle{50%{filter:brightness(1.4);transform:scale(.98)}}
	@media(prefers-reduced-motion:reduce){*,*:before,*:after{scroll-behavior:auto!important;animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
	@media(max-width:1150px){.shell{grid-template-columns:200px minmax(430px,1fr)}.board{transform:none;margin:.4rem auto}.save-control{margin-left:auto}}
	@media(max-width:760px){main{overflow-x:hidden}.hud{display:grid;grid-template-columns:1fr auto}.brand{width:auto;min-width:0}.save-control{min-width:0}.resources{grid-column:1/-1;grid-template-columns:repeat(2,minmax(0,1fr));width:100%}.shell{display:flex;padding:.4rem;gap:.4rem}.corcite-card{order:1}.corcite-form{height:72px}.corcite-stats{grid-template-columns:repeat(3,minmax(0,1fr))}.corcite-card nav{grid-template-columns:repeat(2,minmax(0,1fr))}.stage{order:2;min-height:460px;width:100%;overflow:hidden}.context{order:3}.board{--hex-w:76px;--hex-h:65.818px;height:365px;width:100%;left:auto;transform:none}.board button{width:var(--hex-w);height:var(--hex-h);left:calc(50% + (var(--q) * 57px) - var(--hex-w)/2);top:calc(50% + (var(--r) * 65.818px) + (var(--q) * 32.909px) - var(--hex-h)/2);padding:.25rem}.board button small{font-size:.43rem;max-width:52px}.building-mark{height:25px}.deposit-marker{left:10px;bottom:9px;width:14px;height:14px}.research-grid,.stock-groups{grid-template-columns:1fr}.research-grid article.root{grid-column:auto}.defense-step{min-width:112px}.production-recipes{grid-template-columns:1fr}.production-list>article>header{align-items:flex-start;flex-wrap:wrap}.production-list>article>header button{width:100%}.inventory-scroll{display:grid;overflow:visible}.inventory article{min-width:0;width:100%}.cycle-wave{grid-template-columns:1fr}.turn-actions{grid-template-columns:1fr}.context{max-height:none}.effects{display:none}.corcite-card nav button,.context button,.research-grid button,.inventory button,.production-list button,.deployment-reminder button{min-height:44px}}
	.production-recipes button.unavailable{filter:saturate(.25);opacity:.58;cursor:not-allowed}.production-recipes .reasons{color:#f2b1c5;font-weight:700}.stock-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.7rem;margin-top:1rem}.stock-groups section{padding:.7rem;border:1px solid #86589e66;border-radius:11px;background:#ffffff06}.stock-groups h3{margin:.1rem 0 .6rem;color:#d7afe7;font-size:.72rem;text-transform:uppercase}.stock-row{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.55rem;padding:.5rem;border-top:1px solid #ffffff10}.stock-row div{display:grid}.stock-row small{color:#aa96b5;font-size:.62rem}.stock-row strong{font-size:.72rem}
	@media(max-width:760px){.stock-groups{grid-template-columns:1fr}}
	.entry-screen{display:grid;place-items:center;padding:1rem}.entry-card{width:min(720px,100%);padding:clamp(1.2rem,4vw,2.5rem)}.entry-card h1{font:clamp(2rem,6vw,3.5rem) Georgia,serif;margin:.3rem 0}.entry-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem;margin:1.4rem 0}.entry-actions article{display:grid;align-content:start;gap:.7rem;padding:1rem;border:1px solid #9467ad66;border-radius:12px;background:#ffffff08}.entry-actions h2{font:1.2rem Georgia,serif;margin:0}.entry-actions label{display:grid;gap:.35rem;font-size:.72rem}.entry-actions input{width:100%;padding:.75rem;border:1px solid #a875bd;border-radius:8px;background:#160d21;color:#fff;font-size:1.3rem;letter-spacing:.25em}.entry-actions button,.session-card button{border:1px solid #9d68b5;background:#4b2b59;color:#fff;padding:.65rem;border-radius:8px}.session-card{display:grid;gap:.25rem;padding:.55rem;border:1px solid #9467ad55;border-radius:8px;background:#ffffff07}.session-card strong{font-size:1.1rem;letter-spacing:.12em}.session-card small{color:#b8a4c3}@media(max-width:560px){.entry-actions{grid-template-columns:1fr}}
	.feedback-fab{position:fixed;right:1rem;bottom:4.5rem;z-index:25;padding:.7rem 1rem;border:1px solid #ddaaf0;border-radius:999px;background:#613274;color:#fff;box-shadow:0 7px 25px #09040dcc;font-weight:700}.feedback-modal{position:relative;width:min(560px,100%);padding:1.2rem}.feedback-modal h2{font:1.5rem Georgia,serif}.feedback-modal label{display:grid;gap:.3rem;margin:.8rem 0;font-size:.72rem}.feedback-modal select,.feedback-modal textarea{width:100%;padding:.65rem;border:1px solid #9d68b5;border-radius:8px;background:#160d21;color:#fff}.feedback-modal textarea{resize:vertical}.modal-close{position:absolute;right:.7rem;top:.7rem;border:0;background:transparent;color:#fff;font-size:1.5rem}
	.rules-modal{position:relative;width:min(680px,100%);max-height:calc(100vh - 2rem);overflow:auto;padding:1.2rem}.rules-modal h2{font:1.6rem Georgia,serif}.rules-modal h3{margin:1rem 0 .2rem;color:#dfb5ee;font-size:.86rem}.rules-modal p{margin:.2rem 0;color:#c9b7d3;font-size:.82rem;line-height:1.5}.entry-card footer{margin-top:1.4rem;color:#9685a1;font-size:.65rem}

	/* P02.2 — micro-passe finale : HUD compact et navigation strictement contenue. */
	.hud{min-height:40px;height:auto;align-items:center;gap:.45rem;padding:.25rem .6rem}
	.resources{grid-template-columns:repeat(4,minmax(0,1fr));min-width:0;gap:.3rem}
	.resource{min-width:0;min-height:32px;padding:.2rem .45rem;grid-template-columns:auto minmax(0,1fr) auto;column-gap:.35rem;line-height:1}
	.resource span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.68rem}
	.resource strong{font-size:.9rem}
	.resource small{display:none}
	.save-control{min-width:0;flex-direction:row;justify-content:flex-end;gap:.4rem;white-space:nowrap}
	.save-control>span{font-size:.62rem}
	.save-button{display:flex;align-items:center;gap:.25rem;min-height:30px}
	.corcite-card nav,.corcite-card nav button{min-width:0;width:100%}
	.corcite-card nav button{overflow:hidden;text-align:left}
	.corcite-card nav .nav-label{min-width:0;margin:0;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;background:none;border-radius:0}
	.corcite-card nav .nav-badge{flex:none;float:none;margin-left:auto;padding:.05rem .35rem}
	.stage{scrollbar-gutter:stable both-edges}
	.board{contain:layout;flex:none}
	@media(max-width:1150px){.hud{flex-wrap:nowrap}.resources{order:initial;flex-basis:auto}.save-control{margin-left:0}.save-control>span{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}}
	@media(max-width:760px){main{padding-bottom:4.5rem}.hud{display:flex;flex-wrap:wrap;padding:.3rem}.resources{order:initial;flex:1 1 100%;grid-template-columns:repeat(4,minmax(0,1fr))}.resource{padding:.25rem;column-gap:.2rem}.resource span{font-size:.6rem}.save-control{width:100%}.save-button span{display:none}.shell,.corcite-card,.stage,.context{min-width:0}.corcite-card nav button{justify-content:flex-start}.stage{scrollbar-gutter:auto}}
	@media(max-width:420px){.resource span{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.resource{justify-content:center}.corcite-card nav{grid-template-columns:repeat(5,minmax(0,1fr))}.corcite-card nav button{justify-content:center;padding:.45rem .2rem}.corcite-card nav .nav-label{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}.corcite-card nav .nav-badge{position:absolute;transform:translate(13px,-13px);font-size:.55rem}.feedback-fab{right:.6rem;bottom:.6rem}}
</style>
