---
name: docker-manager
description: >
  Manage local Docker containers: run services (databases, caches),
  build/test apps in containers, and keep a dev environment isolated
  from the host. Use when the user asks to run something "in Docker",
  spin up a local Postgres/Redis/etc, or wants an isolated dev/test
  environment. Requires Docker Desktop (Windows/Mac) or the Docker
  engine (Linux) installed and running.
---

# Docker Manager

## When to use

- Run a local service (DB, cache) without installing it on the host.
- Build and test an app inside a container.
- Keep a dev environment isolated from the host machine.

## Prerequisites

Check before running anything:

```bash
docker info
```

If this fails, Docker isn't installed or the daemon isn't running —
stop and tell the user, don't attempt commands that depend on it.

**Install (if missing):**
- Windows: `winget install Docker.DockerDesktop`, then start Docker Desktop
- macOS: `brew install --cask docker`, then start Docker Desktop
- Linux: follow the distro-specific instructions at docs.docker.com — the
  daemon runs natively, no Desktop app needed

## Safety

- Never expose a container port to `0.0.0.0`/public interfaces by default.
  Bind to `127.0.0.1` unless the user explicitly asks for external access
  (e.g. `-p 127.0.0.1:5432:5432`, not `-p 5432:5432`, when in doubt).
- Never put real credentials in `-e` flags on a shared/multi-user machine;
  use an env file (`--env-file`) instead and remind the user to gitignore it.
- Confirm with the user before `docker rm -f`, `docker system prune`, or
  anything that deletes volumes — volumes can hold data the user needs.
- Don't run containers as `--privileged` unless the task specifically
  requires it and the user has confirmed they understand the risk.

## Process

1. **Pull the image**: `docker pull postgres:16`
2. **Run it** (bind to localhost, name it so it's easy to manage):
   ```bash
   docker run --name mydb -p 127.0.0.1:5432:5432 \
     -e POSTGRES_PASSWORD=pass -d postgres:16
   ```
3. **Verify**: `docker ps` — confirm the container is `Up` and the port
   mapping looks right.
4. **Multi-service**: prefer `docker compose up -d` with a `compose.yaml`
   over multiple manual `docker run` calls once there's more than one
   service — easier to tear down and reproduce.
5. **Stop/clean up**: `docker stop mydb` (keeps the container/volume) or
   `docker rm mydb` (removes it — confirm with the user first if it has
   a volume with data).

## Output contract

After running commands, report back:
- Container name(s) and image(s) running
- Port mappings (and whether they're bound to localhost or public)
- One line on how to stop/clean up what was just started

## Don't

- Don't leave containers running exposed to public interfaces.
- Don't accumulate unused containers/images — flag stale ones (`docker ps -a`,
  `docker images`) and offer to clean up, but don't delete without confirming.

## Integration

- `postgresql-tools` — for working with a database running in a container
- `api-client` / similar — for testing an API running in a container
