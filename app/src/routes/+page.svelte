<script lang="ts">
	import { onMount } from 'svelte';
	import {
		BUILDINGS, LAB, RECIPES, RESEARCH, RESOURCE_LABELS,
		capacities, cancelProduction, collectBlockedOutput, createGame, dismantle, endTurn,
		placeBuilding, placementPreview, placeTower, queueProduction, recycleItem, removeTower,
		restoreGame, serializeGame, startResearch, threatHint, toggleBuilding, toggleStaff,
		type BuildingId, type GameState, type HexCell, type ItemId, type ResearchId, type ResourceId
	} from '$lib/proto02/game.js';

	type View = 'corcite' | 'research' | 'defense';
	const SAVE_KEY = 'avelune:proto02:save:v2';
	const resourceIds: ResourceId[] = ['organic', 'mineral', 'refined', 'component'];
	let state: GameState = createGame();
	let view: View = 'corcite';
	let selectedCellId: string | null = null;
	let placing: BuildingId | null = null;
	let notice = '';
	let saveRestored = false;

	onMount(() => {
		const restored = restoreGame(localStorage.getItem(SAVE_KEY));
		if (restored) { state = restored; notice = 'Sauvegarde locale restaurée.'; saveRestored = true; }
		else if (localStorage.getItem(SAVE_KEY)) notice = 'L’ancienne sauvegarde était incompatible et a été écartée.';
	});

	$: caps = capacities(state);
	$: selectedCell = state.board.find((cell) => cell.id === selectedCellId) ?? null;
	$: selectedBuilding = selectedCell?.building ?? null;
	$: availableResources = Object.fromEntries(resourceIds.map((id) => [id, state.resources[id] - state.reserved[id]])) as Record<ResourceId, number>;
	$: towerInventory = state.inventory.find((entry) => entry.id === 'weakening-tower')?.quantity ?? 0;
	$: totalWeakening = state.defenses.filter((slot) => slot.tower).length * LAB.towerWeakening;
	$: if (saveRestored) localStorage.setItem(SAVE_KEY, serializeGame(state));

	function commit(error: string | null, success = '') {
		notice = error ?? success;
		state = { ...state };
		if (saveRestored) localStorage.setItem(SAVE_KEY, serializeGame(state));
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
		const beforeWave = state.waveNumber;
		commit(endTurn(state), 'Le Corcite a traversé un nouveau cycle.');
		if (state.waveNumber > beforeWave) view = 'defense';
	}

	function newRun() {
		if (!confirm('Abandonner ce run et réveiller un nouveau Corcite ?')) return;
		state = createGame(Date.now() % 1_000_000);
		selectedCellId = null; placing = null; view = 'corcite'; saveRestored = true;
		localStorage.setItem(SAVE_KEY, serializeGame(state));
		notice = 'Nouveau Corcite éveillé.';
	}

	function itemLabel(id: ItemId) { return id === 'weakening-tower' ? 'Tour d’Affaiblissement' : BUILDINGS[id].label; }
	function groundLabel(ground: HexCell['ground']) { return ground === 'organic' ? 'Filaments organiques' : ground === 'mineral' ? 'Gemme minérale' : 'Membrane neutre'; }
</script>

<svelte:head><title>Les Lisières d’Avelune — PROTO-0.2</title><meta name="description" content="Alpha jouable des Lisières d’Avelune" /></svelte:head>

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
			<span title="Population affectée sur totale">Population <b>{caps.populationUsed}/{caps.population}</b></span>
			<span title="Entretien mobilisé sur capacité">Entretien <b>{caps.maintenanceUsed}/{caps.maintenance}</b></span>
			<span class="integrity">Intégrité <b>{state.integrity}/{LAB.baseIntegrity}</b></span>
		</div>
	</header>

	<div class="shell">
		<aside class="corcite-card panel">
			<div class="corcite-orb" aria-label="Corcite non anthropomorphe"><i></i><i></i><i></i></div>
			<p class="eyebrow">CYCLE {state.turn} · ONDE {state.waveNumber + 1}</p>
			<h1>Corcite opalin</h1>
			<p class="muted">Organisme minéral en déploiement à la lisière de la Fracture.</p>
			<div class="integrity-bar"><span style:width={`${state.integrity / LAB.baseIntegrity * 100}%`}></span></div>
			<strong>{state.integrity} Intégrité</strong>
			<p class="threat">{threatHint(state)}</p>
			<nav aria-label="Vues du Corcite">
				<button class:active={view === 'corcite'} onclick={() => view = 'corcite'}>Plateau</button>
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
					<button class="primary" onclick={newRun}>Recommencer un run</button>
				</div>
			{/if}

			{#if view === 'corcite'}
				<header class="stage-title"><div><p class="eyebrow">PLATEAU ÉCONOMIQUE</p><h2>Membranes du Corcite</h2></div><p>Une fonction par case. Seuls les extracteurs dépendent du sol.</p></header>
				{#if state.deployment}<div class="callout"><b>Déploiement initial</b><span>Choisissez la membrane de stockage dans le kit, puis une case libre.</span></div>{/if}
				<div class="board" aria-label="Plateau hexagonal">
					{#each state.board as cell}
						<button class:occupied={cell.building} class:selected={selectedCellId === cell.id} class:organic={cell.ground === 'organic'} class:mineral={cell.ground === 'mineral'} class:preview={placing && !cell.building} style={`--q:${cell.q};--r:${cell.r}`} onclick={() => chooseCell(cell)} aria-label={`${groundLabel(cell.ground)}${cell.building ? `, ${BUILDINGS[cell.building.definitionId].label}` : ', libre'}`}>
							<span class="ground">{cell.ground === 'organic' ? '✦' : cell.ground === 'mineral' ? '◆' : '·'}</span>
							{#if cell.building}<span class="building-mark">{cell.building.definitionId === 'storage' ? '◉' : cell.building.definitionId.includes('extractor') ? '⌁' : cell.building.definitionId === 'energy' ? 'ϟ' : cell.building.definitionId === 'maintenance' ? '❈' : cell.building.definitionId === 'workshop' ? '◇' : cell.building.definitionId === 'defense-factory' ? '△' : cell.building.definitionId === 'transformer' ? '◈' : '♲'}</span><small>{BUILDINGS[cell.building.definitionId].label}</small>{/if}
						</button>
					{/each}
				</div>
				<div class="legend"><span><i class="dot organic-dot"></i>Organique</span><span><i class="dot mineral-dot"></i>Minéral</span><span><i class="dot neutral-dot"></i>Neutre</span></div>
			{:else if view === 'research'}
				<header class="stage-title"><div><p class="eyebrow">ÉVOLUTION TRANSVERSALE</p><h2>Résonances du Corcite</h2></div><p>{state.research.repeatableLevels}/{LAB.repeatableLimit} niveaux répétés acquis</p></header>
				{#if state.research.active}<div class="callout"><b>{RESEARCH[state.research.active.id].label}</b><span>{state.research.active.turnsLeft} cycle(s) restant(s)</span></div>{/if}
				<div class="research-grid">
					{#each Object.entries(RESEARCH) as [rawId, node]}
						{@const id = rawId as ResearchId}{@const level = state.research.completed[id] ?? 0}{@const locked = node.prerequisite && !(state.research.completed[node.prerequisite] ?? 0)}
						<article class:locked class:complete={!node.repeatable && level > 0}>
							<div><span class="research-gem">◇</span><small>{node.repeatable ? `Niveau ${level}` : level ? 'Acquise' : 'Découverte'}</small></div>
							<h3>{node.label}</h3><p>{node.description}</p>
							<div class="costs">{#each resourceIds as resource}{#if node.cost[resource]}<span>{node.cost[resource]} {RESOURCE_LABELS[resource]}</span>{/if}{/each}<span>{node.turns} cycle(s)</span></div>
							<button disabled={Boolean(locked || state.research.active || (!node.repeatable && level) || (node.repeatable && state.research.repeatableLevels >= LAB.repeatableLimit))} onclick={() => commit(startResearch(state, id), 'Recherche lancée.')}>{locked ? 'Prérequis manquant' : 'Rechercher'}</button>
						</article>
					{/each}
				</div>
			{:else}
				<header class="stage-title"><div><p class="eyebrow">LISIÈRE TACTIQUE</p><h2>Chemin d’Affaiblissement</h2></div><p>{totalWeakening} Puissance réduite · {towerInventory} tour(s) disponible(s)</p></header>
				<div class="defense-summary"><span>Fracture</span><i></i><strong>Puissance →</strong><i></i><span>Corcite</span></div>
				<div class="defense-path">
					{#each state.defenses as slot}
						<button class:tower={slot.tower} onclick={() => commit(slot.tower ? removeTower(state, slot.position) : placeTower(state, slot.position), slot.tower ? 'Tour retirée.' : 'Tour placée.')}>
							<small>POSITION {slot.position}</small><b>{slot.tower ? '◇' : '+'}</b><span>{slot.tower ? `−${LAB.towerWeakening} Puissance` : 'Placer une tour'}</span>
						</button>
					{/each}
				</div>
				{#if state.lastWave}
					<article class="wave-report"><p class="eyebrow">RAPPORT D’ONDE {state.lastWave.number}</p><h3>Puissance {state.lastWave.initialPower} → {state.lastWave.residualPower}</h3>
						<div class="wave-steps">{#each state.lastWave.steps as step}<span>Position {step.position} : {step.before} − {step.reduction} = <b>{step.after}</b></span>{:else}<span>Aucune défense n’a affaibli cette onde.</span>{/each}</div>
						<p>Intégrité : {state.lastWave.integrityBefore} → <b>{state.lastWave.integrityAfter}</b></p>
					</article>
				{/if}
			{/if}
		</section>

		<aside class="context panel">
			<p class="eyebrow">CONTEXTE</p>
			{#if view === 'corcite' && selectedCell}
				<h2>{selectedBuilding ? BUILDINGS[selectedBuilding.definitionId].label : groundLabel(selectedCell.ground)}</h2>
				{#if selectedBuilding}
					{@const def = BUILDINGS[selectedBuilding.definitionId]}
					<p>{def.description}</p>
					<div class="facts"><span>Énergie <b>{Math.max(0, def.energy)}</b></span><span>Population <b>{def.population}</b></span><span>Entretien <b>{Math.max(0, def.maintenance)}</b></span></div>
					{#if selectedBuilding.definitionId.includes('extractor')}<div class="formula"><span>Production</span><b>{placementPreview(state, selectedCell.id, selectedBuilding.definitionId)}</b></div>{/if}
					<label class="switch"><input type="checkbox" checked={selectedBuilding.active} onchange={(event) => commit(toggleBuilding(state, selectedCell.id, event.currentTarget.checked), 'État modifié.')} /><span></span>Fonction {selectedBuilding.active ? 'active' : 'en veille'}</label>
					{#if def.population}<label class="switch"><input type="checkbox" checked={selectedBuilding.staffed} onchange={(event) => commit(toggleStaff(state, selectedCell.id, event.currentTarget.checked), 'Population réaffectée.')} /><span></span>{selectedBuilding.staffed ? 'Population affectée' : 'Sans population'}</label>{/if}
					{#if selectedBuilding.definitionId === 'workshop' || selectedBuilding.definitionId === 'defense-factory'}
						<h3>Fabrication</h3>
						{#if selectedBuilding.blockedOutput}<div class="blocked"><b>Sortie bloquée</b><span>{selectedBuilding.blockedOutput.quantity} {selectedBuilding.blockedOutput.id}</span><button onclick={() => commit(collectBlockedOutput(state, selectedCell.id), 'Sortie récupérée.')}>Récupérer</button></div>
						{:else if selectedBuilding.order}<div class="order"><b>{RECIPES[selectedBuilding.order.recipeId].label}</b><span>{selectedBuilding.order.started ? `${selectedBuilding.order.turnsLeft} cycle(s)` : 'Matières réservées'}</span>{#if !selectedBuilding.order.started}<button onclick={() => commit(cancelProduction(state, selectedCell.id), 'Ordre annulé, matières libérées.')}>Annuler</button>{/if}</div>
						{:else}<div class="recipe-list">{#each Object.entries(RECIPES).filter(([, recipe]) => recipe.producer === selectedBuilding.definitionId) as [recipeId, recipe]}<button onclick={() => commit(queueProduction(state, selectedCell.id, recipeId), 'Fabrication réservée.')}><b>{recipe.label}</b><small>{resourceIds.filter((id) => recipe.cost[id]).map((id) => `${recipe.cost[id]} ${RESOURCE_LABELS[id]}`).join(' · ')} · {recipe.turns} cycles</small></button>{/each}</div>{/if}
					{/if}
					<button class="danger" onclick={() => commit(dismantle(state, selectedCell.id), 'Bâtiment démonté et rangé.')}>Démonter</button>
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

	<section class="inventory panel">
		<header><div><p class="eyebrow">INVENTAIRE GLOBAL</p><h2>Objets du Corcite</h2></div><span>{caps.load} / {caps.storage} unités</span></header>
		<div class="inventory-scroll">
			{#each state.inventory.filter((entry) => entry.quantity > 0) as entry}
				<article class:selected={placing === entry.id}>
					<span class="item-glyph">{entry.id === 'weakening-tower' ? '△' : '◇'}</span><div><b>{itemLabel(entry.id)}</b><small>{entry.dismantled ? `${entry.dismantled} démonté(s) · remontage au prochain cycle` : entry.id === 'weakening-tower' ? 'Défense physique' : 'Bâtiment non posé'}</small></div><strong>×{entry.quantity}</strong>
					{#if entry.id === 'weakening-tower'}<button onclick={() => view = 'defense'}>Ouvrir Défenses</button>{:else}<button onclick={() => { placing = entry.id as BuildingId; view = 'corcite'; notice = 'Choisissez une case libre puis confirmez.'; }}>Implanter</button>{/if}
					{#if state.board.some((cell) => cell.building?.definitionId === 'recycler')}<button class="quiet" onclick={() => commit(recycleItem(state, entry.id), 'Objet recyclé.')}>Recycler</button>{/if}
				</article>
			{:else}<p class="muted">Aucun objet en attente d’implantation.</p>{/each}
		</div>
		<div class="turn-actions"><div class:alert={notice}><span>{notice || 'Organisez vos fonctions, puis laissez le Corcite traverser un cycle.'}</span><small>La prochaine onde reste impromptue.</small></div><button class="primary pulse" disabled={state.status !== 'playing'} onclick={nextTurn}>Terminer le cycle {state.turn}</button><button class="quiet" onclick={newRun}>Nouvelle partie</button></div>
	</section>
</main>

<style>
	:global(*){box-sizing:border-box} :global(body){margin:0;background:#130c1d;color:#f2eafd;font-family:Inter,ui-sans-serif,system-ui,sans-serif} :global(button){font:inherit}
	main{min-height:100vh;background:radial-gradient(circle at 50% 30%,#442057 0,transparent 38%),linear-gradient(135deg,#100918,#21102e 55%,#110a1a);padding-bottom:1rem;position:relative;overflow:hidden} main:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.14;background-image:radial-gradient(#e8ceff 1px,transparent 1px);background-size:28px 28px;mask-image:linear-gradient(to bottom,black,transparent)}
	.hud{min-height:76px;display:flex;align-items:stretch;gap:1rem;padding:.65rem 1rem;border-bottom:1px solid #a873c955;background:#160d21e8;backdrop-filter:blur(14px);position:relative;z-index:5}.brand{display:flex;align-items:center;gap:.7rem;min-width:210px}.brand small,.eyebrow{display:block;color:#c89be4;font-size:.66rem;font-weight:800;letter-spacing:.13em;margin:0 0 .25rem}.brand strong{font-family:Georgia,serif;font-size:1.15rem}.sigil{display:grid;place-items:center;width:43px;height:43px;border:1px solid #d6a9ed;border-radius:50% 45% 52% 43%;font-size:1.7rem;color:#f0cfff;box-shadow:0 0 24px #bd62e477 inset,0 0 18px #bd62e455}.resources{display:grid;grid-template-columns:repeat(4,minmax(90px,1fr));gap:.45rem;flex:1}.resource{padding:.45rem .65rem;border:1px solid #80569a66;border-radius:9px;background:#ffffff09;display:grid;grid-template-columns:1fr auto;align-items:center}.resource span{font-size:.7rem;color:#d8c5e4}.resource strong{font-size:1.15rem}.resource small{grid-column:1/-1;color:#f0b6d1;font-size:.62rem}.capacities{display:grid;grid-template-columns:repeat(2,auto);gap:.25rem .8rem;align-content:center;font-size:.72rem;color:#cbb7d7}.capacities b{color:#fff;margin-left:.25rem}.integrity b{color:#f6aecb}
	.shell{display:grid;grid-template-columns:230px minmax(530px,1fr) 275px;gap:.75rem;padding:.75rem;max-width:1800px;margin:auto}.panel{border:1px solid #9467ad55;border-radius:15px;background:linear-gradient(145deg,#2d1739d9,#170f22e8);box-shadow:0 12px 40px #08030d66,inset 0 1px #ffffff12}.corcite-card,.context{padding:1rem;min-width:0}.corcite-card h1{font:1.5rem Georgia,serif;margin:.2rem 0}.muted{color:#ad9bb8;font-size:.8rem}.corcite-orb{height:116px;position:relative;display:grid;place-items:center}.corcite-orb:before{content:"";width:92px;height:92px;border-radius:46% 54% 43% 57%;background:radial-gradient(circle at 37% 32%,#fff 0 4%,#e9b9ff 5% 13%,#9b49be 38%,#331840 70%);box-shadow:0 0 30px #cf75f099,inset -15px -12px 24px #26102e;transform:rotate(18deg)}.corcite-orb i{position:absolute;width:25px;height:54px;border:2px solid #d59ceb;border-radius:100% 0 100% 0;filter:drop-shadow(0 0 6px #eabaff);transform:translate(43px,-20px) rotate(28deg)}.corcite-orb i:nth-child(2){transform:translate(-45px,20px) rotate(190deg);height:38px}.corcite-orb i:nth-child(3){transform:translate(8px,50px) rotate(130deg);height:30px}.integrity-bar{height:7px;background:#0e0915;border-radius:9px;overflow:hidden;margin:.8rem 0 .35rem}.integrity-bar span{display:block;height:100%;background:linear-gradient(90deg,#b34780,#f4b7db);box-shadow:0 0 10px #f48ecb}.threat{padding:.65rem;border-left:2px solid #dc94f3;background:#ffffff08;font-size:.76rem;line-height:1.4}.corcite-card nav{display:grid;gap:.4rem;margin:1rem 0}.corcite-card nav button{border:1px solid transparent;background:#ffffff08;color:#d6c8de;text-align:left;padding:.65rem .8rem;border-radius:8px;cursor:pointer}.corcite-card nav button.active{background:#a05fc42b;border-color:#b875d3;color:#fff}.corcite-card nav span{float:right;background:#9a50b8;padding:.05rem .4rem;border-radius:9px}.effects h2,.journal h3,.context h3{font-size:.75rem;text-transform:uppercase;letter-spacing:.08em;color:#c89be4;margin-top:1.2rem}.effects span{display:block;padding:.35rem 0;font-size:.75rem;border-bottom:1px solid #ffffff0d}
	.stage{min-height:580px;border:1px solid #8c5ca544;border-radius:18px;padding:1.1rem;background:radial-gradient(circle at center,#4c24543d,transparent 65%),#160d20aa;position:relative;overflow:auto}.stage-title{display:flex;align-items:end;justify-content:space-between;gap:1rem}.stage-title h2{font:1.7rem Georgia,serif;margin:0}.stage-title>p{max-width:320px;color:#b3a1bf;font-size:.75rem;text-align:right}.callout{display:flex;justify-content:space-between;gap:1rem;padding:.75rem 1rem;margin:.8rem 0;border:1px solid #d68dea88;background:#8c48a12b;border-radius:9px;font-size:.8rem}.board{height:470px;position:relative;margin:1rem auto;max-width:680px;filter:drop-shadow(0 18px 30px #06020a)}.board button{--size:90px;position:absolute;width:var(--size);height:calc(var(--size)*.88);left:calc(50% + (var(--q) * 77px) + (var(--r) * 38.5px) - var(--size)/2);top:calc(50% + (var(--r) * 67px) - var(--size)*.44);clip-path:polygon(25% 3%,75% 3%,100% 50%,75% 97%,25% 97%,0 50%);border:0;background:linear-gradient(145deg,#41254d,#291734);color:#c5a8d3;cursor:pointer;transition:transform .15s,filter .15s;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.6rem}.board button:after{content:"";position:absolute;inset:4px;clip-path:inherit;border:1px solid #b681c455;pointer-events:none}.board button:hover,.board button:focus-visible{transform:scale(1.07);z-index:2;filter:brightness(1.25)}.board button.organic{background:radial-gradient(circle,#934b8199,#31203d 70%)}.board button.mineral{background:radial-gradient(circle,#7a63a599,#28223c 70%)}.board button.occupied{background:radial-gradient(circle,#9c63b2,#372144 65%)}.board button.selected{filter:drop-shadow(0 0 10px #f3bcff) brightness(1.35);z-index:3}.board button.preview{animation:breathe 1.8s infinite}.ground{font-size:1rem;opacity:.75}.building-mark{font-size:1.8rem;color:#f5d8ff;text-shadow:0 0 10px #ebafff}.board button small{font-size:.52rem;line-height:1.05;max-width:72px;color:white}.legend{display:flex;justify-content:center;gap:1.3rem;font-size:.7rem;color:#baa5c4}.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:.3rem}.organic-dot{background:#b75b9e}.mineral-dot{background:#8d78c5}.neutral-dot{background:#4e345c}
	.context h2{font:1.35rem Georgia,serif;margin:.3rem 0}.context>p{font-size:.8rem;line-height:1.5;color:#bfaec9}.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:.3rem;margin:.8rem 0}.facts span{padding:.45rem .2rem;background:#ffffff08;text-align:center;font-size:.62rem;border-radius:6px}.facts b{display:block;color:#fff;font-size:.9rem}.formula,.preview,.blocked,.order{display:grid;gap:.4rem;padding:.7rem;margin:.7rem 0;border:1px solid #a675bc55;border-radius:8px;background:#ffffff08;font-size:.74rem}.switch{display:flex;align-items:center;gap:.5rem;font-size:.75rem;margin:.55rem 0;cursor:pointer}.switch input{position:absolute;opacity:0}.switch span{width:34px;height:18px;border-radius:12px;background:#493253;position:relative}.switch span:after{content:"";position:absolute;width:12px;height:12px;border-radius:50%;background:#bca8c7;left:3px;top:3px;transition:.2s}.switch input:checked+span{background:#995ab5}.switch input:checked+span:after{left:19px;background:white}.recipe-list{display:grid;gap:.35rem;max-height:195px;overflow:auto}.recipe-list button{display:grid;text-align:left;gap:.15rem}.recipe-list small{color:#bca7c5}.context button,.research-grid button,.inventory button{border:1px solid #9d68b5;background:#4b2b59;color:#f5eaff;padding:.45rem .6rem;border-radius:7px;cursor:pointer}.context button:hover,.research-grid button:hover,.inventory button:hover{background:#673677}.context button:disabled,.research-grid button:disabled{opacity:.35;cursor:not-allowed}.danger{width:100%;margin-top:.8rem;border-color:#9c526c!important;background:#492435!important}.journal{border-top:1px solid #ffffff13;margin-top:1rem}.journal p{font-size:.67rem!important;margin:.45rem 0!important;color:#a998b3!important}.journal b{color:#daa4eb;margin-right:.25rem}
	.research-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.7rem;margin-top:1rem}.research-grid article{border:1px solid #86589e66;border-radius:12px;padding:1rem;background:linear-gradient(145deg,#42234f99,#21142ccc);position:relative}.research-grid article.locked{filter:saturate(.3);opacity:.62}.research-grid article.complete{border-color:#ddaaf0}.research-grid article>div:first-child{display:flex;justify-content:space-between}.research-gem{font-size:1.5rem;color:#e4aefa}.research-grid h3{font:1.05rem Georgia,serif;margin:.5rem 0}.research-grid p{font-size:.75rem;color:#bfaec8;min-height:34px}.costs{display:flex;gap:.3rem;flex-wrap:wrap;margin:.6rem 0}.costs span{font-size:.6rem;background:#ffffff0b;padding:.25rem .35rem;border-radius:4px}.research-grid button{width:100%}.defense-summary{height:80px;display:flex;align-items:center;justify-content:center;gap:.8rem;color:#d3a6e4}.defense-summary i{height:1px;background:linear-gradient(90deg,#ce7de7,transparent);width:80px}.defense-path{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem}.defense-path button{min-height:126px;border:1px dashed #86559e;background:#25152f;color:#bba5c6;border-radius:50% 50% 45% 55% / 45% 55%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3rem;cursor:pointer}.defense-path button.tower{border-style:solid;background:radial-gradient(circle,#a35ab877,#281633 65%);box-shadow:inset 0 0 20px #c974e64d}.defense-path b{font-size:2rem;color:#e9b9fb}.defense-path small{font-size:.57rem}.defense-path span{font-size:.68rem}.wave-report{margin-top:1.2rem;padding:1rem;border:1px solid #bc79d277;border-radius:12px;background:#120c1cd9}.wave-report h3{font:1.2rem Georgia,serif;margin:.4rem 0}.wave-steps{display:flex;flex-wrap:wrap;gap:.4rem}.wave-steps span{font-size:.68rem;background:#ffffff0a;padding:.4rem}.end-screen{position:absolute;inset:0;z-index:10;display:grid;place-content:center;text-align:center;padding:2rem;background:#1b0d27f2;backdrop-filter:blur(8px)}.end-screen h2{font:2.4rem Georgia,serif;margin:.4rem;color:#f0c9ff}.primary{border:1px solid #e3aaf6!important;background:linear-gradient(135deg,#9754b5,#63316f)!important;color:white!important;font-weight:700}.end-screen .primary{justify-self:center;padding:.8rem 1.2rem;margin-top:1rem}
	.inventory{margin:0 .75rem;max-width:1776px;margin-inline:auto;padding:.8rem 1rem}.inventory header{display:flex;justify-content:space-between;align-items:center}.inventory h2{font:1.15rem Georgia,serif;margin:0}.inventory header>span{font-size:.7rem;color:#c4adcf}.inventory-scroll{display:flex;gap:.55rem;overflow:auto;padding:.65rem 0}.inventory article{display:grid;grid-template-columns:auto 1fr auto;gap:.45rem;align-items:center;min-width:240px;padding:.6rem;border:1px solid #80529466;border-radius:9px;background:#ffffff07}.inventory article.selected{border-color:#e7b0f8;box-shadow:0 0 12px #b85ddd55}.item-glyph{font-size:1.5rem;color:#deaaf1}.inventory article div{display:grid}.inventory article b{font-size:.72rem}.inventory article small{font-size:.58rem;color:#a894b3}.inventory article strong{font-size:.85rem}.inventory article button{font-size:.66rem;padding:.3rem}.quiet{background:transparent!important;border-color:#6d4d7b!important}.turn-actions{display:grid;grid-template-columns:1fr auto auto;gap:.6rem;align-items:center;border-top:1px solid #ffffff11;padding-top:.7rem}.turn-actions>div{display:grid;font-size:.78rem}.turn-actions small{color:#9c89a7}.turn-actions .alert span{color:#f0c4dd}.turn-actions button{padding:.65rem .9rem}.pulse{box-shadow:0 0 20px #b95cd344}.ended .pulse{opacity:.4}
	@keyframes breathe{50%{filter:drop-shadow(0 0 9px #d895ef) brightness(1.25)}}
	@media(max-width:1150px){.hud{flex-wrap:wrap}.brand{min-width:180px}.capacities{flex:1}.resources{order:3;flex-basis:100%}.shell{grid-template-columns:190px minmax(450px,1fr)}.context{grid-column:1/-1}.board{transform:scale(.88);margin:-15px auto}.inventory{margin-inline:.75rem}}
	@media(max-width:760px){main{overflow:visible}.hud{position:relative;padding:.6rem}.brand{width:100%}.capacities{grid-template-columns:repeat(2,1fr)}.resources{grid-template-columns:repeat(2,1fr)}.resource{min-width:0}.shell{display:flex;flex-direction:column;padding:.5rem}.corcite-card{order:1}.stage{order:2;min-height:540px;padding:.7rem}.context{order:3}.corcite-orb{display:none}.corcite-card nav{grid-template-columns:repeat(3,1fr)}.corcite-card nav button{text-align:center;padding:.6rem .2rem}.effects{display:none}.stage-title{align-items:start}.stage-title>p{display:none}.board{height:420px;width:520px;left:50%;transform:translateX(-50%) scale(.7);transform-origin:center}.research-grid{grid-template-columns:1fr}.defense-path{grid-template-columns:repeat(2,1fr)}.inventory{margin:.5rem;padding:.7rem}.inventory-scroll{scroll-snap-type:x mandatory}.inventory article{scroll-snap-align:start}.turn-actions{grid-template-columns:1fr}.turn-actions button{width:100%}.callout{flex-direction:column}.context{min-height:auto}}
</style>
