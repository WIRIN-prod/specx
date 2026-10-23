# Plane Community Edition — local self-host

Plane CE v1.4.1, all state on local bind mounts. Derived from the
[official self-host bundle](https://developers.plane.so/self-hosting/methods/docker-compose);
same images and topology, different storage strategy.

## Why not `setup.sh`

Plane's official installer uses Docker **named volumes**, which live inside the
Docker VM and can only be inspected through a container. This setup uses **bind
mounts** under `./data` instead, so:

- every byte of state is visible on the host
- backup is `Copy-Item -Recurse data data-backup`
- moving the instance to another disk is one variable (`PLANE_DATA`)

Everything else — images, service topology, environment contract — matches
upstream, so official docs and upgrade notes still apply.

## Layout

```
deploy/plane/
  docker-compose.yml     the stack
  plane.env              real secrets          (gitignored)
  plane.env.example      committed template
  data/                  all container state   (gitignored)
    postgres/            database
    redis/               valkey
    rabbitmq/            queue
    minio/               file uploads
    proxy/               caddy config + certs
    logs/                api, worker, beat-worker, migrator
```

## Run it

```bash
docker compose --env-file plane.env up -d
```

Then open **http://localhost:8080**. The first account you create becomes the
instance admin.

God-mode / instance settings live at **http://localhost:8080/god-mode/**.

## Everyday commands

Run these from `deploy/plane/`.

```bash
docker compose --env-file plane.env ps
```

```bash
docker compose --env-file plane.env logs -f api
```

```bash
docker compose --env-file plane.env stop
```

```bash
docker compose --env-file plane.env up -d
```

## Ports

`8080` (HTTP) and `8443` (HTTPS), not 80/443 — port 80 is left free for anything
else on the machine. To change them, edit `LISTEN_HTTP_PORT` in `plane.env` and
update `APP_DOMAIN`, `WEB_URL`, and `CORS_ALLOWED_ORIGINS` to match. Those three
must agree or the browser will be blocked by CORS.

`SITE_ADDRESS=:80` is the proxy's *internal* listen address and does not change
when you change the published port.

## Pointing specX at it

Create an API token in Plane: **Workspace Settings → API Tokens**. Then in the
project you want to track:

```bash
specx link --workspace <slug> --create "My Project"
```

Add to `.specx/specx.yaml`:

```yaml
plane:
  workspace: <slug>
  base_url: http://localhost:8080/api/v1
```

`base_url` is what redirects specX from Plane Cloud to this instance. Put the
token in that project's gitignored `.env` as `PLANE_API_KEY`.

Self-hosted has no rate limit worth worrying about — `API_KEY_RATE_LIMIT` in
`plane.env` is yours to raise if you fan out more agents than the default
60/minute allows.

## Backup

Stop the stack first so Postgres is not mid-write:

```bash
docker compose --env-file plane.env stop
```

Then copy `data/`. To restore, put the directory back and start the stack.

For a database-only dump you can take while running:

```bash
docker compose --env-file plane.env exec plane-db pg_dump -U plane plane > backup.sql
```

## Upgrading

Change `APP_RELEASE` in `plane.env` to the new tag, then:

```bash
docker compose --env-file plane.env pull
```

```bash
docker compose --env-file plane.env up -d
```

The `migrator` service runs Django migrations and every database-touching
service waits for it to exit successfully, so an upgrade will not race the
schema. Back up `data/` before a major version jump.

## Notes

- **Postgres on Windows bind mounts works** on Docker Desktop's current
  virtiofs backend — verified on this machine. On older backends it could fail
  to set directory permissions during `initdb`; if you hit that after a Docker
  downgrade, move `PLANE_DATA` to a path inside WSL2.
- Secrets in `plane.env` were generated with a CSPRNG and are hex-only, because
  `DATABASE_URL` and `AMQP_URL` embed them and punctuation would break URL
  parsing.
- `restart: unless-stopped` replaces upstream's `deploy.restart_policy`, which
  only applies under Swarm and is silently ignored by plain Compose.
