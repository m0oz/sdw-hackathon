# sdw Alumni – Hackathon: Agenten, Harnesses & soziales Engagement

Materialien für einen Workshop + Mini-Hackathon der **sdw Alumni** ("Netzwerk fürs Leben").
Ziel: erklären, wie aus einem Sprachmodell ein handelnder **Agent** wird – und das Gelernte
direkt nutzen, um etwas Gemeinnütziges zu bauen.

## Inhalt

| Datei / Ordner | Zweck |
|---|---|
| `praesentation.html` | Deutschsprachige Workshop-Präsentation (≈ 10–12 Min) zu LLMs, Harnesses, Kontext, Subagenten & Skills, im sdw-Alumni-Look. |
| `.claude/skills/` | Wiederverwendbare Claude-Code-Skills für den Hackathon (siehe unten). |
| `.env` | Lokale Secrets (z. B. `NGROK_AUTHTOKEN`) – **nicht eingecheckt** (gitignored). |
| `.env.example` | Vorlage zum Kopieren nach `.env`. |

## Präsentation ansehen

Einfach im Browser öffnen – keine Abhängigkeiten, läuft offline:

```bash
open praesentation.html        # macOS
# oder die Datei per Doppelklick öffnen
```

**Steuerung:** `→` / `←` (oder Klick rechts/links) blättern · `F` Vollbild ·
Fortschrittsbalken oben, Folienzähler unten rechts. Beamer-tauglich.

## Mini-Hackathon

Baut mit einem Agenten (z. B. Claude Code) in kurzer Zeit etwas Echtes:

- **Option A – Engagement-Portal:** Website, die Wege zum sozialen Engagement entdeckbar macht
  (Initiativen finden, nach Thema/Ort filtern, Mitmach-Möglichkeiten zeigen).
- **Option B – Initiative-Website:** Auftritt für eine soziale Initiative eurer Wahl
  (Mission, Mitmachen, Spenden, Kontakt).

Ablauf: **Team & Idee (5 Min) → Plan → Bauen → 2-Min-Pitch.**

## Skills

Drei projektlokale Skills helfen beim schnellen Bauen. Nach Änderungen `/reload-skills`
ausführen, damit Claude Code sie lädt.

- **`sdw-frontend`** – baut UI im sdw-Alumni-Corporate-Design (Farben, Typografie, Tonalität,
  deutsche, inklusive Sprache). Greift bei jeder Web-Oberfläche für sdw / sdw Alumni.
- **`hackathon-prototype`** – scaffoldet einen schnellen Prototyp: **FastAPI**-Backend mit
  einer **JSON-Datei als Datenbank** + **React (Vite)**-Frontend.
- **`ngrok-share`** – macht die lokal laufende App über **ngrok** öffentlich erreichbar;
  liest den Authtoken aus `.env`.

## Einrichtung

```bash
# 1. Secrets anlegen
cp .env.example .env
# .env öffnen und NGROK_AUTHTOKEN eintragen

# 2. Prototyp bauen lassen — in Claude Code z. B.:
#    "Baue mit dem hackathon-prototype-Skill ein Engagement-Portal im sdw-Design."

# 3. Öffentlich teilen
#    "Mach die laufende App mit dem ngrok-share-Skill erreichbar."
```

### Prototyp lokal starten (Standard-Layout des Skills)

```bash
# Backend
cd backend && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000      # API-Docs: http://localhost:8000/docs

# Frontend (neues Terminal)
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## Sicherheit

- **`.env` niemals committen.** Steht in `.gitignore`; der ngrok-Authtoken bleibt lokal.
- Eine ngrok-URL ist öffentlich – keine echten personenbezogenen Daten exponieren.

---

*sdw Alumni · Netzwerk fürs Leben*
