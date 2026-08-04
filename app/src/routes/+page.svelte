<main>
	<section>
		<p class="eyebrow">Les Lisières d’Avelune</p>
		<h1>PROTO-0</h1>

		<p class="lead">
			Banc d’essai de la boucle intégrée TF → RPG → TD → vague → conséquences.
		</p>

		<p>
			Le socle technique est actif. Le moteur PROTO-0 va maintenant être construit
			à partir de la spécification expérimentale gelée.
		</p>

		<div class="status">
			<span aria-hidden="true"></span>
			Socle PROTO-0
		</div>
	</section>
</main>

<style>
	main {
		min-height: 100vh;
		display: grid;
		place-items: center;
		padding: 2rem;
	}

	section {
		width: min(48rem, 100%);
		padding: 3rem;
		border: 1px solid rgb(255 255 255 / 12%);
		border-radius: 1.25rem;
		background: rgb(18 14 27 / 72%);
		box-shadow: 0 2rem 6rem rgb(0 0 0 / 24%);
	}

	.eyebrow {
		margin: 0 0 0.5rem;
		font-size: 0.8rem;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		opacity: 0.65;
	}

	h1 {
		margin: 0;
		font-size: clamp(3rem, 10vw, 6rem);
		line-height: 0.95;
	}

	.lead {
		margin-top: 2rem;
		font-size: 1.25rem;
		line-height: 1.6;
	}

	p {
		line-height: 1.7;
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		margin-top: 1rem;
		padding: 0.6rem 0.9rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 7%);
	}

	.status span {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 999px;
		background: #9bd5ad;
	}
</style>
