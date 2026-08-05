<script lang="ts">
	import {
		RPG_LAB_REFERENCE,
		TD_LAB_REFERENCE,
		TESTER_CODES,
		createBrowserSession,
		getBrowserVisibleForecast,
		prepareBrowserTower,
		resolveBrowserTurn,
		resolveBrowserWave,
		startBrowserResearch,
		summarizeStoredResources,
		type Proto0BrowserState,
		type TdPathPosition,
		type TdTowerDefinitionId,
		type TesterCode
	} from '$lib/proto0';

	let testerCode: TesterCode =
		'IRFI';

	let seed =
		20260804;

	let state:
		Proto0BrowserState | null =
			null;

	let activeView:
		'pilotage' | 'journal' =
			'pilotage';

	let largeText =
		false;

	let highContrast =
		false;

	let reducedMotion =
		false;

	let compact =
		false;

	let errorMessage =
		'';

	let visibleForecast:
		ReturnType<
			typeof getBrowserVisibleForecast
		> = null;

	let stocks:
		ReturnType<
			typeof summarizeStoredResources
		> | null = null;

	$: visibleForecast =
		state
			? getBrowserVisibleForecast(
					state
				)
			: null;

	$: stocks =
		state
			? summarizeStoredResources(
					state.corcite
				)
			: null;

	function apply(
		action:
			() =>
				Proto0BrowserState
	): void {
		errorMessage = '';

		try {
			state =
				action();
		} catch (error) {
			errorMessage =
				error instanceof Error
					? error.message
					: String(error);
		}
	}

	function newSession(): void {
		apply(
			() =>
				createBrowserSession({
					testerCode,
					seed
				})
		);

		activeView =
			'pilotage';
	}

	function startResearch(): void {
		if (!state) return;

		apply(
			() =>
				startBrowserResearch(
					state as Proto0BrowserState
				)
		);
	}

	function endCurrentTurn(): void {
		if (!state) return;

		apply(
			() =>
				resolveBrowserTurn(
					state as Proto0BrowserState
				)
		);
	}

	function prepareTower(
		position:
			TdPathPosition,
		definitionId:
			TdTowerDefinitionId
	): void {
		if (!state) return;

		apply(
			() =>
				prepareBrowserTower(
					state as Proto0BrowserState,
					position,
					definitionId
				)
		);
	}

	function launchWave(): void {
		if (!state) return;

		apply(
			() =>
				resolveBrowserWave(
					state as Proto0BrowserState
				)
		);
	}
</script>

<svelte:head>
	<title>
		Les Lisières d’Avelune — PROTO-0
	</title>
</svelte:head>

<a
	class="skip-link"
	href="#main-content"
>
	Aller au contenu
</a>

<div
	class:large-text={largeText}
	class:high-contrast={highContrast}
	class:reduced-motion={reducedMotion}
	class:compact={compact}
	class="proto-shell"
>
	<header class="topbar">
		<div>
			<p class="eyebrow">
				Les Lisières d’Avelune
			</p>
			<h1>PROTO-0</h1>
			<p class="subtitle">
				TF → RPG → TD → vague →
				conséquences
			</p>
		</div>

		<div class="session-form">
			<label>
				Testeur
				<select
					bind:value={testerCode}
				>
					{#each TESTER_CODES as code}
						<option value={code}>
							{code}
						</option>
					{/each}
				</select>
			</label>

			<label>
				Graine
				<input
					type="number"
					min="0"
					max="4294967295"
					step="1"
					bind:value={seed}
				/>
			</label>

			<button
				class="primary"
				onclick={newSession}
			>
				Nouvelle session
			</button>
		</div>
	</header>

	<nav
		class="view-tabs"
		aria-label="Vues du prototype"
	>
		<button
			class:active={activeView ===
				'pilotage'}
			onclick={() =>
				(activeView =
					'pilotage')}
		>
			Pilotage
		</button>

		<button
			class:active={activeView ===
				'journal'}
			onclick={() =>
				(activeView =
					'journal')}
			disabled={!state}
		>
			Journal technique
		</button>
	</nav>

	{#if errorMessage}
		<div
			class="error"
			role="alert"
		>
			{errorMessage}
		</div>
	{/if}

	<div
		class="status-line"
		aria-live="polite"
	>
		{state?.statusMessage ??
			'Créez une session pour commencer.'}
	</div>

	<main id="main-content">
		{#if !state}
			<section class="welcome panel">
				<p class="eyebrow">
					Banc d’essai intégré
				</p>
				<h2>
					Créer une session
				</h2>
				<p>
					Le prototype utilise directement
					le moteur headless validé. La
					graine permet de reproduire la
					même vague et les mêmes
					prévisions.
				</p>
			</section>
		{:else if activeView === 'journal'}
			<section class="panel technical">
				<div class="section-heading">
					<div>
						<p class="eyebrow">
							Diagnostic
						</p>
						<h2>
							Journal technique
						</h2>
					</div>
					<button
						onclick={() =>
							(activeView =
								'pilotage')}
					>
						Retour au pilotage
					</button>
				</div>

				{#if state.technicalLog}
					<p>
						Cette trace est séparée du
						rapport joueur et sert à
						reconstruire les calculs.
					</p>

					<pre>{JSON.stringify(
						state.technicalLog,
						null,
						2
					)}</pre>
				{:else}
					<p>
						Le journal complet de vague
						sera disponible après sa
						résolution. Les journaux RPG
						et TF restent visibles dans
						le pilotage pendant la
						session.
					</p>
				{/if}
			</section>
		{:else}
			<div class="workspace">
				<aside class="sidebar">
					<section class="panel">
						<p class="eyebrow">
							Session
						</p>
						<h2>
							Tour {state.currentTurn}
							/
							{state.session
								.configuration
								.turns}
						</h2>

						<dl>
							<div>
								<dt>Testeur</dt>
								<dd>
									{state.session
										.configuration
										.testerCode}
								</dd>
							</div>
							<div>
								<dt>Graine</dt>
								<dd>
									{state.session
										.configuration
										.seed}
								</dd>
							</div>
							<div>
								<dt>Corcite</dt>
								<dd>
									{state.corcite.name}
								</dd>
							</div>
						</dl>
					</section>

					<section class="panel">
						<p class="eyebrow">
							Stocks
						</p>
						<div class="resource-grid">
							{#if stocks}
								{#each Object.entries(
									stocks
								) as [
									resource,
									amount
								]}
									<div>
										<span>
											{resource}
										</span>
										<strong>
											{amount}
										</strong>
									</div>
								{/each}
							{/if}
						</div>
					</section>

					<section class="panel">
						<p class="eyebrow">
							Capacités
						</p>
						<dl>
							<div>
								<dt>Énergie</dt>
								<dd>
									{state.corcite
										.capacities
										.energy.used}
									/
									{state.corcite
										.capacities
										.energy
										.normalCapacity}
								</dd>
							</div>
							<div>
								<dt>
									Entretien
								</dt>
								<dd>
									{state.corcite
										.capacities
										.maintenance
										.used}
									/
									{state.corcite
										.capacities
										.maintenance
										.capacity}
								</dd>
							</div>
							<div>
								<dt>Travail</dt>
								<dd>
									{state.corcite
										.capacities
										.work.used}
									/
									{state.corcite
										.capacities
										.work.capacity}
								</dd>
							</div>
							<div>
								<dt>Espace</dt>
								<dd>
									{state.corcite
										.capacities
										.space.used}
									/
									{state.corcite
										.capacities
										.space.capacity}
								</dd>
							</div>
						</dl>
					</section>
				</aside>

				<div class="content">
					<section class="panel forecast">
						<div class="section-heading">
							<div>
								<p class="eyebrow">
									Vague
								</p>
								<h2>
									Prévision
								</h2>
							</div>

							{#if visibleForecast}
								<span class="badge">
									{visibleForecast.label}
									±
									{visibleForecast
										.forecast
										.uncertaintyPercent}%
								</span>
							{/if}
						</div>

						{#if visibleForecast}
							<div class="wave-grid">
								<div>
									<span>
										Pression
									</span>
									<strong>
										{visibleForecast
											.forecast
											.estimatedWave
											.pressure}
									</strong>
								</div>
								<div>
									<span>
										Structure
									</span>
									<strong>
										{visibleForecast
											.forecast
											.estimatedWave
											.structure}
									</strong>
								</div>
								<div>
									<span>
										Charge
									</span>
									<strong>
										{visibleForecast
											.forecast
											.estimatedWave
											.charge}
									</strong>
								</div>
								<div>
									<span>
										Matière
									</span>
									<strong>
										{visibleForecast
											.forecast
											.estimatedWave
											.capturableMatter}
									</strong>
								</div>
							</div>
						{:else}
							<p class="muted">
								Aucune prévision fiable
								n’est encore disponible.
								Elle apparaîtra dans les
								trois derniers tours.
							</p>
						{/if}
					</section>

					<div class="two-columns">
						<section class="panel">
							<p class="eyebrow">
								TF
							</p>
							<h2>
								Production
							</h2>

							<p>
								La résolution du tour
								exécute la chaîne
								extraction →
								transformation →
								fabrication du moteur.
							</p>

							{#if state.lastTf}
								<div class="event-list">
									{#each state.lastTf
										.extraction
										.events as event}
										<p>
											<strong>
												Extraction
											</strong>
											—
											{event.message}
										</p>
									{/each}

									{#each state.lastTf
										.transformation
										.events as event}
										<p>
											<strong>
												Transformation
											</strong>
											—
											{event.message}
										</p>
									{/each}

									{#each state.lastTf
										.fabrication
										.events as event}
										<p>
											<strong>
												Fabrication
											</strong>
											—
											{event.message}
										</p>
									{/each}
								</div>
							{:else}
								<p class="muted">
									Aucun tour TF résolu.
								</p>
							{/if}
						</section>

						<section class="panel">
							<p class="eyebrow">
								RPG
							</p>
							<h2>
								Recherche
							</h2>

							{#if state.corcite.rpg
								.researches.length ===
							0}
								<p>
									{RPG_LAB_REFERENCE.label}
								</p>
								<p class="muted">
									Durée expérimentale :
									{RPG_LAB_REFERENCE
										.durationTurns}
									tours.
								</p>
								<button
									onclick={startResearch}
									disabled={state.waveReady ||
										state.waveResolved}
								>
									Démarrer la recherche
								</button>
							{:else}
								{#each state.corcite.rpg
									.researches as research}
									<div class="research">
										<strong>
											{research.label}
										</strong>
										<span>
											{research.status}
										</span>
										<progress
											max={research
												.durationTurns}
											value={research
												.progressTurns}
										></progress>
										<small>
											{research.progressTurns}
											/
											{research.durationTurns}
										</small>
									</div>
								{/each}
							{/if}

							{#if state.corcite
								.modifiers.length >
							0}
								<p class="success">
									Modificateur RPG actif
									sur la transformation.
								</p>
							{/if}
						</section>
					</div>

					<section class="panel">
						<div class="section-heading">
							<div>
								<p class="eyebrow">
									TD
								</p>
								<h2>
									Chemin interne —
									8 positions
								</h2>
							</div>

							<span class="badge">
								Atténuation :
								R3 2 + R4 1
							</span>
						</div>

						<p class="muted">
							Seule Atténuation possède
							un coût matériel instrumenté
							dans PROTO-0. Les autres
							familles testent leur effet
							et leur ordonnancement.
						</p>

						<div class="td-path">
							{#each state.corcite.td
								.positions as slot}
								<article
									class:occupied={Boolean(
										slot.tower
									)}
									class="td-slot"
								>
									<div class="position">
										{slot.position}
									</div>

									{#if slot.tower}
										<strong>
											{slot.tower.label}
										</strong>
										<small>
											{slot.tower.family}
										</small>
									{:else}
										<span class="muted">
											Vide
										</span>

										<div class="tower-actions">
											{#each TD_LAB_REFERENCE
												.towers as tower}
												<button
													onclick={() =>
														prepareTower(
															slot.position,
															tower.id
														)}
													disabled={state.waveResolved}
												>
													{tower.label}
												</button>
											{/each}
										</div>
									{/if}
								</article>
							{/each}
						</div>
					</section>

					<section class="panel turn-control">
						<div>
							<p class="eyebrow">
								Résolution
							</p>

							{#if !state.waveReady}
								<h2>
									Terminer le tour
									{state.currentTurn}
								</h2>
								<p>
									Le moteur résout TF,
									fait progresser la
									recherche RPG active,
									puis avance le temps.
								</p>
							{:else if !state.waveResolved}
								<h2>
									La vague est prête
								</h2>
								<p>
									Le tour 10 est
									terminé. La
									configuration TD
									actuelle sera appliquée
									à la vague réelle.
								</p>
							{:else}
								<h2>
									Vague résolue
								</h2>
							{/if}
						</div>

						{#if !state.waveReady}
							<button
								class="primary large"
								onclick={endCurrentTurn}
							>
								Résoudre le tour
							</button>
						{:else if !state.waveResolved}
							<button
								class="danger large"
								onclick={launchWave}
							>
								Résoudre la vague
							</button>
						{/if}
					</section>

					{#if state.playerReport}
						<section class="panel report">
							<div class="section-heading">
								<div>
									<p class="eyebrow">
										Fin de vague
									</p>
									<h2>
										{state.playerReport
											.summary.title}
									</h2>
								</div>

								<button
									onclick={() =>
										(activeView =
											'journal')}
								>
									Voir le journal
									technique
								</button>
							</div>

							<p class="lead">
								{state.playerReport
									.summary.message}
							</p>

							<div class="wave-grid">
								<div>
									<span>Pression</span>
									<strong>
										{state.playerReport.details.variables.pressure.before}
										→
										{state.playerReport.details.variables.pressure.after}
									</strong>
								</div>

								<div>
									<span>Structure</span>
									<strong>
										{state.playerReport.details.variables.structure.before}
										→
										{state.playerReport.details.variables.structure.after}
									</strong>
								</div>

								<div>
									<span>Charge</span>
									<strong>
										{state.playerReport.details.variables.charge.before}
										→
										{state.playerReport.details.variables.charge.after}
									</strong>
								</div>

								<div>
									<span>Matière capturable</span>
									<strong>
										{state.playerReport.details.variables.capturableMatter.before}
										→
										{state.playerReport.details.variables.capturableMatter.after}
									</strong>
								</div>

							</div>

							<p>
								Matière captée :
								<strong>
									{state.playerReport
										.details
										.capturedMatter}
								</strong>
							</p>

							<details>
								<summary>
									Détails des effets
									successifs
								</summary>

								<ol class="steps">
									{#each state.playerReport
										.details
										.towerEffects as step}
										<li>
											<strong>
												Position
												{step.position}
											</strong>
											—
											{step.tower?.label ??
												'vide'}
											<br />
											<small>
												Pression :
												{step.before.pressure}
												→
												{step.after.pressure}
												;
												structure :
												{step.before.structure}
												→
												{step.after.structure}
												;
												charge :
												{step.before.charge}
												→
												{step.after.charge}
											</small>
										</li>
									{/each}
								</ol>
							</details>
						</section>
					{/if}
				</div>
			</div>
		{/if}
	</main>

	<aside
		class="accessibility"
		aria-label="Réglages d’accessibilité"
	>
		<strong>Affichage</strong>

		<label>
			<input
				type="checkbox"
				bind:checked={largeText}
			/>
			Texte agrandi
		</label>

		<label>
			<input
				type="checkbox"
				bind:checked={highContrast}
			/>
			Contraste renforcé
		</label>

		<label>
			<input
				type="checkbox"
				bind:checked={reducedMotion}
			/>
			Réduire les animations
		</label>

		<label>
			<input
				type="checkbox"
				bind:checked={compact}
			/>
			Densité compacte
		</label>
	</aside>
</div>

<style>
	.proto-shell {
		min-height: 100vh;
		padding: 1.25rem;
		color: var(--text);
	}

	.topbar {
		max-width: 96rem;
		margin: 0 auto 1rem;
		display: flex;
		justify-content: space-between;
		gap: 2rem;
		align-items: flex-end;
	}

	h1,
	h2,
	p {
		margin-top: 0;
	}

	h1 {
		margin-bottom: 0.2rem;
		font-size: clamp(2.4rem, 6vw, 4.6rem);
		line-height: 0.9;
	}

	h2 {
		margin-bottom: 0.8rem;
		font-size: 1.3rem;
	}

	.eyebrow {
		margin-bottom: 0.35rem;
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.subtitle,
	.muted {
		color: var(--muted);
	}

	.session-form {
		display: flex;
		flex-wrap: wrap;
		gap: 0.7rem;
		align-items: end;
	}

	label {
		display: grid;
		gap: 0.35rem;
		font-size: 0.82rem;
	}

	select,
	input[type="number"],
	button {
		border: 1px solid var(--border);
		border-radius: 0.65rem;
		background: var(--control);
		color: var(--text);
	}

	select,
	input[type="number"] {
		min-height: 2.55rem;
		padding: 0.45rem 0.65rem;
	}

	button {
		padding: 0.65rem 0.85rem;
		cursor: pointer;
		transition:
			transform 120ms ease,
			background 120ms ease,
			border-color 120ms ease;
	}

	button:hover:not(:disabled) {
		transform: translateY(-1px);
		border-color: var(--accent);
	}

	button:focus-visible,
	input:focus-visible,
	select:focus-visible,
	summary:focus-visible {
		outline: 3px solid var(--focus);
		outline-offset: 3px;
	}

	button:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.primary {
		background: var(--accent-soft);
		border-color: var(--accent);
	}

	.danger {
		background: var(--danger-soft);
		border-color: var(--danger);
	}

	.large {
		padding: 0.9rem 1.2rem;
		font-weight: 800;
	}

	.view-tabs {
		max-width: 96rem;
		margin: 0 auto 1rem;
		display: flex;
		gap: 0.5rem;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.75rem;
	}

	.view-tabs button.active {
		border-color: var(--accent);
		background: var(--accent-soft);
	}

	.status-line,
	.error {
		max-width: 96rem;
		margin: 0 auto 1rem;
		padding: 0.7rem 0.9rem;
		border-radius: 0.65rem;
	}

	.status-line {
		background: var(--panel-soft);
		color: var(--muted);
	}

	.error {
		border: 1px solid var(--danger);
		background: var(--danger-soft);
	}

	main {
		max-width: 96rem;
		margin: 0 auto;
	}

	.workspace {
		display: grid;
		grid-template-columns: minmax(14rem, 18rem) 1fr;
		gap: 1rem;
		align-items: start;
	}

	.sidebar,
	.content {
		display: grid;
		gap: 1rem;
	}

	.panel {
		padding: 1.15rem;
		border: 1px solid var(--border);
		border-radius: 1rem;
		background: var(--panel);
		box-shadow: 0 1.2rem 3rem rgb(0 0 0 / 12%);
	}

	.welcome {
		max-width: 42rem;
		margin: 6rem auto;
	}

	.section-heading {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		align-items: start;
	}

	.badge {
		display: inline-flex;
		padding: 0.35rem 0.55rem;
		border: 1px solid var(--border);
		border-radius: 999px;
		font-size: 0.78rem;
		color: var(--muted);
		white-space: nowrap;
	}

	dl {
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	dl div {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	dt {
		color: var(--muted);
	}

	dd {
		margin: 0;
		font-weight: 700;
	}

	.resource-grid,
	.wave-grid {
		display: grid;
		grid-template-columns: repeat(
			4,
			minmax(0, 1fr)
		);
		gap: 0.65rem;
	}

	.resource-grid div,
	.wave-grid div {
		padding: 0.7rem;
		border-radius: 0.75rem;
		background: var(--panel-soft);
		display: grid;
		gap: 0.25rem;
	}

	.resource-grid span,
	.wave-grid span {
		font-size: 0.76rem;
		color: var(--muted);
	}

	.resource-grid strong,
	.wave-grid strong {
		font-size: 1.15rem;
	}

	.two-columns {
		display: grid;
		grid-template-columns: repeat(
			2,
			minmax(0, 1fr)
		);
		gap: 1rem;
	}

	.event-list {
		display: grid;
		gap: 0.45rem;
		max-height: 15rem;
		overflow: auto;
	}

	.event-list p {
		margin: 0;
		padding: 0.55rem;
		border-radius: 0.55rem;
		background: var(--panel-soft);
		font-size: 0.84rem;
	}

	.research {
		display: grid;
		gap: 0.55rem;
	}

	progress {
		width: 100%;
	}

	.success {
		margin-top: 1rem;
		color: var(--success);
	}

	.td-path {
		display: grid;
		grid-template-columns: repeat(
			8,
			minmax(7rem, 1fr)
		);
		gap: 0.6rem;
		overflow-x: auto;
		padding-bottom: 0.4rem;
	}

	.td-slot {
		min-height: 12rem;
		padding: 0.7rem;
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--panel-soft);
		display: grid;
		align-content: start;
		gap: 0.55rem;
	}

	.td-slot.occupied {
		border-color: var(--accent);
	}

	.position {
		width: 2rem;
		height: 2rem;
		display: grid;
		place-items: center;
		border-radius: 50%;
		background: var(--control);
		font-weight: 900;
	}

	.tower-actions {
		display: grid;
		gap: 0.35rem;
	}

	.tower-actions button {
		padding: 0.4rem;
		font-size: 0.72rem;
		text-align: left;
	}

	.turn-control {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem;
	}

	.report .lead {
		font-size: 1.05rem;
		line-height: 1.6;
	}

	details {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	summary {
		cursor: pointer;
		font-weight: 800;
	}

	.steps {
		display: grid;
		gap: 0.6rem;
	}

	.technical pre {
		max-height: 70vh;
		overflow: auto;
		padding: 1rem;
		border-radius: 0.8rem;
		background: #0b0910;
		font-size: 0.78rem;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.accessibility {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 10;
		display: grid;
		gap: 0.45rem;
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.8rem;
		background: var(--panel-solid);
		box-shadow: 0 1rem 3rem rgb(0 0 0 / 30%);
		font-size: 0.78rem;
	}

	.accessibility label {
		display: flex;
		grid-template-columns: none;
		align-items: center;
		gap: 0.45rem;
	}

	.skip-link {
		position: fixed;
		left: 1rem;
		top: -5rem;
		z-index: 100;
		padding: 0.7rem;
		background: white;
		color: black;
	}

	.skip-link:focus {
		top: 1rem;
	}

	.large-text {
		font-size: 118%;
	}

	.high-contrast {
		--text: #ffffff;
		--muted: #e6e1ef;
		--border: rgb(255 255 255 / 42%);
		--panel: #100d17;
		--panel-soft: #201a2c;
		--control: #09070d;
	}

	.compact .panel {
		padding: 0.75rem;
	}

	.compact .content,
	.compact .sidebar,
	.compact .workspace,
	.compact .two-columns {
		gap: 0.65rem;
	}

	.reduced-motion *,
	.reduced-motion *::before,
	.reduced-motion *::after {
		scroll-behavior: auto !important;
		transition: none !important;
		animation: none !important;
	}

	@media (max-width: 72rem) {
		.workspace {
			grid-template-columns: 1fr;
		}

		.sidebar {
			grid-template-columns:
				repeat(
					3,
					minmax(0, 1fr)
				);
		}
	}

	@media (max-width: 48rem) {
		.proto-shell {
			padding: 0.75rem;
		}

		.topbar,
		.turn-control,
		.section-heading {
			align-items: stretch;
			flex-direction: column;
		}

		.two-columns,
		.sidebar,
		.resource-grid,
		.wave-grid {
			grid-template-columns: 1fr 1fr;
		}

		.accessibility {
			position: static;
			margin-top: 1rem;
		}
	}

	@media (max-width: 32rem) {
		.two-columns,
		.sidebar,
		.resource-grid,
		.wave-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
