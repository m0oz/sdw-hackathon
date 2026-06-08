---
name: ngrok-share
description: Expose a locally running app (e.g. a FastAPI backend or Vite/React dev server) to the public internet with ngrok, using the authtoken from the repo's .env. Use when the user wants to share a local prototype via a public URL, demo it on another device, or make localhost reachable externally.
---

# Share a local app with ngrok

Use this to give a locally running prototype a **public HTTPS URL** — for demos, phones,
or sharing with others during a hackathon.

## The authtoken lives in `.env`

The ngrok authtoken is stored in the repo's **`.env`** as `NGROK_AUTHTOKEN` and is
**gitignored — never commit it or print it in full**. Always read it from the environment;
never hard-code it into commands you save or into files.

Load it for the current shell:
```bash
set -a && source .env && set +a   # exports NGROK_AUTHTOKEN
```

## One-time setup

Check ngrok is installed; install on macOS if missing:
```bash
command -v ngrok || brew install ngrok
```

Register the token with the local ngrok config (reads it from the env, doesn't echo it):
```bash
set -a && source .env && set +a
ngrok config add-authtoken "$NGROK_AUTHTOKEN"
```

## Exposing a single port

Most prototypes: expose the **frontend** (Vite, 5173) or a single combined server.
```bash
ngrok http 5173        # React/Vite dev server
# or
ngrok http 8000        # FastAPI backend / API only
```
ngrok prints a `https://<random>.ngrok-free.app` "Forwarding" URL — that's the public link.

## Exposing a full-stack prototype (frontend + backend)

The frontend runs in the visitor's browser, so it must call a **publicly reachable** backend,
not `localhost`. Two clean options:

**Option A — tunnel the backend, point the frontend at it (recommended):**
1. Start backend on :8000, start an ngrok tunnel for it:
   ```bash
   ngrok http 8000
   ```
2. Put the resulting URL in `frontend/.env`:
   ```
   VITE_API_URL=https://<your-backend>.ngrok-free.app
   ```
3. Rebuild/restart the Vite dev server, then share **its** URL (tunnel 5173 too, or build & serve).

**Option B — single origin:** have FastAPI serve the built React app (`app.mount` the
`frontend/dist` as static files) and expose just that one port. Simplest to share, one URL.

> Tip: with a free ngrok plan you typically get **one** simultaneous tunnel/agent session.
> Prefer Option B, or serve the SPA from FastAPI, when you need both halves on one link.

## Running it without blocking the chat

When launching ngrok as part of a task, run it in the background so it keeps serving, then
read the public URL from its local API:
```bash
set -a && source .env && set +a
ngrok config add-authtoken "$NGROK_AUTHTOKEN"
# start ngrok (background), then fetch the assigned URL:
curl -s http://127.0.0.1:4040/api/tunnels | python3 -c "import sys,json;print(json.load(sys.stdin)['tunnels'][0]['public_url'])"
```
The local dashboard is at http://127.0.0.1:4040 (inspect requests, see the URL).

## Guardrails

- **Never echo the full token** in command output, logs, or committed files. Source it from
  `.env` and reference `$NGROK_AUTHTOKEN`.
- A public URL means **anyone with the link can reach the app** — fine for a demo, but don't
  expose anything with real personal data or write access you wouldn't want public.
- ngrok free URLs change on each restart and show an interstitial warning page on first visit.
- Stop the tunnel when the demo is done (Ctrl-C, or kill the background ngrok process).
