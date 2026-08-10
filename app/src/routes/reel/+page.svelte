<script lang="ts">
	import { buildRealDashboardSnapshot } from '$lib/real-dashboard/aggregate.js';
	import { PUBLIC_REAL_DASHBOARD_SEED as seed } from '$lib/real-dashboard/reference.js';
	import type { RealDataStatus } from '$lib/real-dashboard/types.js';

	const snapshot = buildRealDashboardSnapshot(seed);
	const euro = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
	const number = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });
	const percent = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 });

	const labels: Record<RealDataStatus, string> = {
		measured: 'MESURÉ',
		calculated: 'CALCULÉ',
		estimated: 'ESTIMÉ',
		symbolic: 'SYMBOLIQUE'
	};

	function statusLabel(status: RealDataStatus) {
		return labels[status];
	}

	function maybeNumber(value: number | null, suffix = '') {
		return value === null ? 'À connecter' : `${number.format(value)}${suffix}`;
	}
</script>

<svelte:head>
	<title>Tableau réel — Avelune</title>
	<meta
		name="description"
		content="Le Tableau réel d’Avelune : temps humain, matériel, énergie, financement et signes de vie du monde."
	/>
</svelte:head>

<main class="real-page">
	<header class="hero">
		<p class="eyebrow">Les Lisières d’Avelune</p>
		<h1>Tableau réel</h1>
		<p class="lead">
			Derrière le monde imaginaire : du temps, des watts, du matériel et quelques humains.
		</p>
		<p class="intro">
			Avelune est un monde imaginaire en construction, pensé pour faire réfléchir plutôt que lutter
			contre l’interface, laisser plusieurs manières de jouer, accueillir les absences et faire de
			l’échec une source de jeu. Ici, on regarde simplement ce qu’il faut réellement pour le faire
			exister.
		</p>
	</header>

	<section class="age" aria-labelledby="age-title">
		<p id="age-title">Avelune existe depuis</p>
		<strong>{snapshot.daysAlive === null ? 'Date zéro à fixer' : `${snapshot.daysAlive} jours`}</strong>
		<span>Le temps passe aussi de ce côté de la Lisière.</span>
	</section>

	<section aria-labelledby="real-title">
		<div class="section-title">
			<div>
				<p class="eyebrow">Monde réel</p>
				<h2 id="real-title">Ce qu’il a fallu jusqu’ici</h2>
			</div>
			<p>Les chiffres inconnus restent inconnus. Pas de précision inventée.</p>
		</div>

		<div class="metric-grid">
			<article class="metric">
				<div class="metric-head"><span>Temps humain</span><small>{statusLabel(seed.humanHours.status)}</small></div>
				<strong>{maybeNumber(seed.humanHours.value, ' h')}</strong>
				<p>Conception, développement, infrastructure, documentation et tests.</p>
			</article>

			<article class="metric">
				<div class="metric-head"><span>Matériel engagé</span><small>{statusLabel(seed.hardwareCostEur.status)}</small></div>
				<strong>{euro.format(seed.hardwareCostEur.value ?? 0)}</strong>
				<p>Estimation déclarée du coût machine / laboratoire Avelune.</p>
			</article>

			<article class="metric">
				<div class="metric-head"><span>Énergie du lab</span><small>{statusLabel(seed.labElectricityKwh.status)}</small></div>
				<strong>{maybeNumber(seed.labElectricityKwh.value, ' kWh')}</strong>
				<p>Mesure directe par la prise placée sur l’alimentation du lab.</p>
			</article>

			<article class="metric">
				<div class="metric-head"><span>Quote-part serveur</span><small>{statusLabel(seed.sharedServerElectricityCostEur.status)}</small></div>
				<strong>{seed.sharedServerElectricityCostEur.value === null ? 'À définir' : euro.format(seed.sharedServerElectricityCostEur.value)}</strong>
				<p>Le serveur est partagé : seule une part raisonnable de son électricité sera imputée à Avelune.</p>
			</article>

			<article class="metric prominent">
				<div class="metric-head"><span>Coûts connus</span><small>CALCULÉ</small></div>
				<strong>{euro.format(snapshot.knownCostEur)}</strong>
				<p>Total des dépenses actuellement renseignées, pas une estimation du coût final du projet.</p>
			</article>
		</div>
	</section>

	<section class="funding" aria-labelledby="funding-title">
		<div class="section-title">
			<div>
				<p class="eyebrow">Soutien</p>
				<h2 id="funding-title">Ce qui a été soutenu</h2>
			</div>
			<p>Une jauge décrit un fait ; elle ne fabrique pas un besoin.</p>
		</div>

		<div class="funding-grid">
			<div>
				<span>Soutien net</span>
				<strong>{euro.format(snapshot.netSupportEur)}</strong>
			</div>
			<div>
				<span>Autofinancement connu</span>
				<strong>{euro.format(snapshot.knownSelfFundedEur)}</strong>
			</div>
		</div>

		<div class="bar" aria-label="Part des coûts connus couverte par le soutien">
			<span style={`width: ${(snapshot.coverageRatio ?? 0) * 100}%`}></span>
		</div>
		<p class="bar-label">
			{snapshot.coverageRatio === null
				? 'Pas encore de base de coût pour calculer une couverture.'
				: `${percent.format(snapshot.coverageRatio)} des coûts connus couverts.`}
		</p>
	</section>

	<section aria-labelledby="world-title">
		<div class="section-title">
			<div>
				<p class="eyebrow">Vie d’Avelune</p>
				<h2 id="world-title">Ce qui vit de l’autre côté</h2>
			</div>
			<p>Les environnements de test et de développement ne comptent pas comme des mondes.</p>
		</div>

		<div class="metric-grid world-grid">
			<article class="metric">
				<div class="metric-head"><span>Mondes</span><small>{statusLabel(seed.worldCount.status)}</small></div>
				<strong>{seed.worldCount.value ?? '—'}</strong>
				<p>Un monde partagé. C’est déjà beaucoup.</p>
			</article>
			<article class="metric">
				<div class="metric-head"><span>Joueurs</span><small>{statusLabel(seed.players.status)}</small></div>
				<strong>{maybeNumber(seed.players.value)}</strong>
				<p>Compteur public à connecter.</p>
			</article>
			<article class="metric">
				<div class="metric-head"><span>Corcites nées</span><small>{statusLabel(seed.corcitesCreated.status)}</small></div>
				<strong>{maybeNumber(seed.corcitesCreated.value)}</strong>
				<p>Compteur public à connecter.</p>
			</article>
			<article class="metric">
				<div class="metric-head"><span>Temps de vie</span><small>{statusLabel(seed.lifeHours.status)}</small></div>
				<strong>{maybeNumber(seed.lifeHours.value, ' h')}</strong>
				<p>La définition exacte sera figée avant instrumentation.</p>
			</article>
		</div>
	</section>

	<footer>
		<div class="legend" aria-label="Légende de provenance">
			<span>MESURÉ</span><span>CALCULÉ</span><span>ESTIMÉ</span><span>SYMBOLIQUE</span>
		</div>
		<p>Le monde est imaginaire. Les chiffres, eux, ne le sont pas.</p>
	</footer>
</main>

<style>
	:global(body) {
		margin: 0;
		background: #f4f2ec;
		color: #252a27;
		font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	}

	.real-page {
		width: min(1120px, calc(100% - 2rem));
		margin: 0 auto;
		padding: 4.5rem 0 3rem;
	}

	.hero {
		max-width: 820px;
		margin-bottom: 3rem;
	}

	.eyebrow {
		margin: 0 0 .45rem;
		font-size: .72rem;
		font-weight: 750;
		letter-spacing: .16em;
		text-transform: uppercase;
		color: #59675e;
	}

	h1, h2, p { margin-top: 0; }

	h1 {
		margin-bottom: .8rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(2.8rem, 7vw, 5.8rem);
		font-weight: 500;
		letter-spacing: -.045em;
		line-height: .96;
	}

	h2 {
		margin-bottom: 0;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(1.65rem, 3vw, 2.35rem);
		font-weight: 500;
		letter-spacing: -.025em;
	}

	.lead {
		max-width: 680px;
		font-size: clamp(1.2rem, 2.2vw, 1.55rem);
		line-height: 1.5;
		color: #3c4740;
	}

	.intro {
		max-width: 760px;
		line-height: 1.75;
		color: #586159;
	}

	.age {
		margin: 0 0 4.5rem;
		padding: 1.5rem 0 1.8rem;
		border-top: 1px solid #c9cec8;
		border-bottom: 1px solid #c9cec8;
	}

	.age p, .age span {
		margin-bottom: .35rem;
		color: #667069;
	}

	.age strong {
		display: block;
		margin-bottom: .5rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(2rem, 4vw, 3.6rem);
		font-weight: 500;
	}

	section { margin-bottom: 4.5rem; }

	.section-title {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 2rem;
		margin-bottom: 1.4rem;
	}

	.section-title > p {
		max-width: 390px;
		margin-bottom: 0;
		font-size: .9rem;
		line-height: 1.5;
		color: #6a736d;
	}

	.metric-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		border-top: 1px solid #c9cec8;
		border-left: 1px solid #c9cec8;
	}

	.metric {
		min-height: 200px;
		padding: 1.15rem;
		border-right: 1px solid #c9cec8;
		border-bottom: 1px solid #c9cec8;
		background: rgba(255, 255, 255, .28);
	}

	.metric.prominent { background: rgba(224, 229, 219, .55); }

	.metric-head {
		display: flex;
		justify-content: space-between;
		gap: .6rem;
		font-size: .86rem;
		color: #59635c;
	}

	.metric-head small {
		font-size: .61rem;
		letter-spacing: .08em;
		color: #7a847d;
	}

	.metric strong {
		display: block;
		margin: 2rem 0 .8rem;
		font-family: Georgia, "Times New Roman", serif;
		font-size: clamp(1.7rem, 3vw, 2.5rem);
		font-weight: 500;
	}

	.metric p {
		margin-bottom: 0;
		font-size: .82rem;
		line-height: 1.55;
		color: #69726c;
	}

	.funding {
		padding: 2rem;
		border: 1px solid #bcc4bd;
		background: rgba(255,255,255,.38);
	}

	.funding-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin: 2rem 0 1.6rem;
	}

	.funding-grid div {
		display: flex;
		flex-direction: column;
		gap: .4rem;
	}

	.funding-grid span { color: #667069; }
	.funding-grid strong { font-size: 1.8rem; font-weight: 600; }

	.bar {
		height: 9px;
		overflow: hidden;
		border-radius: 999px;
		background: #d9ddd8;
	}

	.bar span {
		display: block;
		height: 100%;
		background: #66796a;
	}

	.bar-label {
		margin: .65rem 0 0;
		font-size: .82rem;
		color: #68726b;
	}

	footer {
		padding-top: 1.4rem;
		border-top: 1px solid #c9cec8;
		color: #636d66;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: .5rem;
		margin-bottom: 1rem;
	}

	.legend span {
		padding: .3rem .5rem;
		border: 1px solid #c1c8c2;
		border-radius: 999px;
		font-size: .62rem;
		letter-spacing: .07em;
	}

	@media (max-width: 850px) {
		.section-title { align-items: start; flex-direction: column; gap: .7rem; }
	}

	@media (max-width: 540px) {
		.real-page { padding-top: 2.5rem; }
		.metric-grid, .funding-grid { grid-template-columns: 1fr; }
		.metric { min-height: 155px; }
		.funding { padding: 1.2rem; }
	}

	@media (prefers-reduced-motion: reduce) {
		* { scroll-behavior: auto !important; }
	}
</style>
