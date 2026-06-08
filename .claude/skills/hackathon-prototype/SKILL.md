---
name: hackathon-prototype
description: Scaffold a fast local hackathon prototype — FastAPI backend with a JSON file as the database, plus a React (Vite) frontend. Use when the user wants to quickly build a web app prototype, MVP, or demo with a Python API and a React UI without setting up a real database.
---

# Hackathon Prototype Scaffold

Optimized for **speed and demoability**, not production. Stack:

- **Backend:** FastAPI + Uvicorn, a single JSON file as the "database".
- **Frontend:** React via Vite.
- **No real DB, no auth, no ORM.** Keep it dead simple so it can be built and shown in hours.

If the UI is for sdw / sdw Alumni, also apply the **`sdw-frontend`** skill for branding.
To expose the running prototype publicly, use the **`ngrok-share`** skill.

## Standard layout

```
project/
  backend/
    main.py            # FastAPI app + all routes
    db.py              # tiny JSON load/save helpers
    data.json          # the "database" (gitignore if it holds real data)
    requirements.txt
  frontend/            # Vite React app (created with npm create vite)
    src/
      api.js           # fetch helpers pointing at the backend
      App.jsx
  README.md            # how to run both
```

## Backend pattern

`requirements.txt`:
```
fastapi
uvicorn[standard]
```

`db.py` — JSON as database (atomic write, sensible default):
```python
import json, os, tempfile
from pathlib import Path

DB_PATH = Path(__file__).parent / "data.json"

def load(default=None):
    if not DB_PATH.exists():
        return default if default is not None else {}
    return json.loads(DB_PATH.read_text(encoding="utf-8"))

def save(data):
    # atomic write so a crash never corrupts the file
    fd, tmp = tempfile.mkstemp(dir=DB_PATH.parent, suffix=".tmp")
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp, DB_PATH)
```

`main.py` — note CORS (so the Vite dev server can call it) and the item-CRUD shape:
```python
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import db

app = FastAPI(title="Hackathon Prototype")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # fine for a hackathon; tighten for real use
    allow_methods=["*"],
    allow_headers=["*"],
)

class Item(BaseModel):
    title: str
    description: str = ""

@app.get("/api/items")
def list_items():
    return db.load({"items": []})["items"]

@app.post("/api/items")
def create_item(item: Item):
    data = db.load({"items": []})
    record = {"id": str(uuid.uuid4()), **item.model_dump()}
    data["items"].append(record)
    db.save(data)
    return record

@app.delete("/api/items/{item_id}")
def delete_item(item_id: str):
    data = db.load({"items": []})
    before = len(data["items"])
    data["items"] = [i for i in data["items"] if i["id"] != item_id]
    if len(data["items"]) == before:
        raise HTTPException(404, "not found")
    db.save(data)
    return {"ok": True}
```

Run the backend:
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Docs auto-available at http://localhost:8000/docs.

## Frontend pattern

Create the app:
```bash
npm create vite@latest frontend -- --template react
cd frontend && npm install
```

`src/api.js` — single base URL via env, default to local backend:
```js
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = {
  list:   ()      => fetch(`${BASE}/api/items`).then(r => r.json()),
  create: (item)  => fetch(`${BASE}/api/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  }).then(r => r.json()),
  remove: (id)    => fetch(`${BASE}/api/items/${id}`, { method: "DELETE" }),
};
```

Run the frontend:
```bash
cd frontend && npm run dev   # serves on http://localhost:5173
```

Set `VITE_API_URL` in `frontend/.env` if the backend isn't on localhost:8000
(e.g. when exposing via ngrok).

## Conventions & guardrails

- Keep **all routes under `/api/...`** so frontend/backend separation is clean.
- Seed `data.json` with a couple of example records so the UI isn't empty on first load.
- One JSON file per entity is fine; for related data keep one file with top-level keys.
- It's a prototype: skip migrations, auth, and tests unless asked. Prioritize a working demo.
- Add `data.json` to `.gitignore` if it will contain real/personal data.
- When done, give the user the exact two commands to run (backend + frontend) in the README.
