# Infrastructure du prototype v0.9

Le prototype utilise deux conteneurs :

- `avelune-proto-app` : application SvelteKit ;
- `avelune-proto-db` : PostgreSQL.

PostgreSQL est uniquement présent sur le réseau interne
`avelune-proto-internal`.

L’application rejoint également `nginxpm_default` afin d’être accessible
depuis Nginx Proxy Manager sous `proto.avelune.duckdns.org`.

Le fichier `.env` réel ne doit jamais être ajouté à Git.

## PROTO-0.2.2 playtest distribué

Avant de démarrer l’image candidate, appliquer une fois la migration additive :

`````bash
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f app/migrations/001_playtest_distributed.sql
`````

La migration crée `playtest_sessions`, `playtest_events` et
`playtest_feedback` avec `CREATE ... IF NOT EXISTS`. Elle ne supprime ni ne
modifie les tables historiques.

Variables requises :

- `AVELUNE_DB_PASSWORD` et `AVELUNE_DB_DATA` pour Compose ;
- `DATABASE_URL` côté application (construite par Compose) ;
- `AVELUNE_BUILD_COMMIT` pour identifier le build.

Chaque retour est enregistré en PostgreSQL avant toute tentative d’envoi.
SMTP est facultatif : pour l’activer, fournir `AVELUNE_SMTP_HOST`,
`AVELUNE_SMTP_PORT`, `AVELUNE_SMTP_SECURE`, `AVELUNE_SMTP_USER`,
`AVELUNE_SMTP_PASSWORD`, `AVELUNE_FEEDBACK_FROM` et
`AVELUNE_FEEDBACK_TO`. Un échec SMTP ne supprime pas le retour enregistré ;
il conserve l’état d’envoi `failed`. Sans configuration SMTP, le retour reste
enregistré avec l’état `not_requested`.
