# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Workshop + mini-hackathon materials for **sdw Alumni** ("Netzwerk fürs Leben"). The centrepiece is `praesentation.html` — a self-contained, offline-ready German-language slide deck. The `.claude/skills/` directory holds three project-local skills that accelerate prototype building during the hackathon.

## Running the presentation

```bash
open praesentation.html   # macOS — no build step, no dependencies
```

## Project-local skills

Three skills are registered in `.claude/skills/`. Always use them rather than reinventing the wheel:

| Skill | When to use |
|---|---|
| `hackathon-prototype` | Scaffold FastAPI backend (JSON-file DB) + React/Vite frontend |
| `sdw-frontend` | Apply sdw Alumni branding to any web UI |
| `ngrok-share` | Expose a local port publicly via ngrok |

After editing a skill's `SKILL.md`, run `/reload-skills` so Claude Code picks up the changes.

## Running a scaffolded prototype

```bash
# Backend (from project root)
cd backend && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000   # docs at http://localhost:8000/docs

# Frontend (new terminal)
cd frontend && npm install && npm run dev   # http://localhost:5173
```

Set `VITE_API_URL` in `frontend/.env` when the backend is reachable via ngrok instead of localhost.

## Secrets

`NGROK_AUTHTOKEN` lives in `.env` (gitignored). Copy `.env.example` → `.env` and fill it in. Never echo or commit the token.

## sdw branding rules (short form)

All UI for sdw / sdw Alumni must use the CSS variables from the `sdw-frontend` skill — no stray hex codes. Light backgrounds, gold + teal CI matching `praesentation.html` (incl. the sdw Alumni logo). Copy in German, inclusive (`Stipendiat:innen`), warm tone. Gold (`--sdw-accent`) only for the single primary CTA / highlight per view; teal is the everyday accent.
