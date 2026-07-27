# Infrastructure du prototype v0.9

Le prototype utilise deux conteneurs :

- `avelune-proto-app` : application SvelteKit ;
- `avelune-proto-db` : PostgreSQL.

PostgreSQL est uniquement présent sur le réseau interne
`avelune-proto-internal`.

L’application rejoint également `nginxpm_default` afin d’être accessible
depuis Nginx Proxy Manager sous `proto.avelune.duckdns.org`.

Le fichier `.env` réel ne doit jamais être ajouté à Git.
