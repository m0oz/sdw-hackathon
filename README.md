# sdw Alumni – Hackathon: Agenten, Harnesses & soziales Engagement

Materialien für einen Workshop + Mini-Hackathon der **sdw Alumni** („Netzwerk fürs Leben").
Die Idee: gemeinsam verstehen, wie aus einem Sprachmodell ein handelnder **Agent** wird –
und das Gelernte sofort nutzen, um in wenigen Stunden etwas **Gemeinnütziges** zu bauen.

Genau das ist passiert. Hier ist das Ergebnis.

---

## Das Ergebnis: „EhrenMoin – Ehrenamt in Hamburg"

> **Entstanden beim sdw Mini-Hackathon am 11. Juni 2026.** In wenigen Stunden mit
> Claude Code gebaut – als Beispiel dafür, wie aus einem Agenten ein echtes,
> nützliches Produkt für die Community wird.

![EhrenMoin – Matching-Ergebnis: „Diese 4 Engagements passen zu dir"](pitch-assets/03-ergebnis.png)

**Die Idee in einem Satz:** Stipendiat:innen und Alumni beantworten **fünf kurze
Fragen** – und bekommen **vier passende Ehrenamts-Vorschläge** in Hamburg (oder
remote), die wirklich zu ihnen passen.

Was die App kann:

- **Persönliches Matching** – fünf Fragen zu Themen, Zeit, Art des Engagements und
  Wunsch-Zielgruppe, daraus vier konkrete Vorschläge mit Begründung, *warum* sie passen.
- **Alle Angebote durchstöbern** – durchsuchbare Liste mit Filtern nach Thema, Ort und Zeitaufwand.
- **Merkliste** – interessante Angebote vormerken und später wiederfinden.
- **Gruppen-Matching** – mehrere Personen beantworten die Fragen, die App findet die
  Veranstaltungen, die **für alle** passen. Ideal, um sich gemeinsam zu engagieren.
- **Community-Einträge** – Organisationen und Veranstaltungen lassen sich selbst eintragen.

Die Angebote sind **24 echte, recherchierte Ehrenamts-Möglichkeiten aus Hamburg** –
keine Platzhalter.

Weitere Eindrücke liegen im Ordner [`pitch-assets/`](pitch-assets/) (Login, Quiz,
Angebotsliste, Gruppen-Matching, Merkliste).

---

## Die Workshop-Präsentation

Eine deutschsprachige Präsentation (≈ 10–12 Min) erklärt anschaulich, wie aus einem
Sprachmodell ein Agent wird – im sdw-Alumni-Look, ganz ohne Technik-Vorkenntnisse.

```bash
open praesentation.html        # macOS – oder die Datei einfach doppelklicken
```

**Steuerung:** `→` / `←` (oder Klick rechts/links) blättern · `F` Vollbild. Beamer-tauglich.

---

## Worum ging es beim Mini-Hackathon?

Die Aufgabe: mit einem Agenten (z. B. Claude Code) in kurzer Zeit etwas Echtes bauen.

- **Option A – Engagement-Portal:** eine Website, die Wege zum sozialen Engagement
  entdeckbar macht (genau das ist „EhrenMoin" geworden).
- **Option B – Initiative-Website:** ein Auftritt für eine soziale Initiative eurer Wahl.

Ablauf: **Team & Idee (5 Min) → Plan → Bauen → 2-Min-Pitch.**

---

<br>

<details>
<summary><strong>🛠️ Für Technik-Interessierte: App selbst starten & Details</strong></summary>

<br>

### Aufbau

| Datei / Ordner | Zweck |
|---|---|
| `praesentation.html` | Workshop-Präsentation (offline, keine Abhängigkeiten). |
| `pitch.html` + `pitch-assets/` | Pitch-Deck und Screenshots der App. |
| `backend/` | **FastAPI**-Backend mit einer **JSON-Datei** (`data.json`) als Datenbank. |
| `frontend/` | **React (Vite)**-Frontend. |
| `.claude/skills/` | Wiederverwendbare Claude-Code-Skills für den Hackathon (siehe unten). |
| `.env` / `.env.example` | Lokale Secrets bzw. Vorlage – `.env` ist **nicht eingecheckt**. |

### Prototyp lokal starten

```bash
# Backend
cd backend && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000      # API-Docs: http://localhost:8000/docs

# Frontend (neues Terminal)
cd frontend && npm install && npm run dev   # http://localhost:5173
```

### Wie das Matching funktioniert

- **Daten:** `backend/data.json` — 24 kuratierte, echte Hamburger Angebote
  (recherchiert aus `docs/datenquellen-ehrenamt.md`); Community-Einträge landen in
  derselben Datei mit `"quelle": "community"`.
- **Matching:** `POST /api/matching` gewichtet Themen ×3, Tätigkeit ×2, Zeit ×2,
  Format ×2, Zielgruppe ×1,5 und liefert die Top 4 mit Begründung.
- **Quiz-Fragen:** zentral in `backend/main.py` (`FRAGEN`) — Wording dort anpassen,
  das Frontend rendert dynamisch.
- **Gruppen-Matching:** Gruppe starten → Code teilen → jede:r beantwortet die Fragen
  → `GET /api/gruppen/{code}/ergebnis` liefert die 2 Veranstaltungen, die für alle
  passen (max-min-fair: erst zählt die Person mit der geringsten Übereinstimmung,
  dann die Gruppensumme).
- **Bilder:** Logo, Hamburg-Skyline und Themen-Artworks liegen als offline-fähige
  SVGs in `frontend/public/`. Mit einem `PEXELS_API_KEY` in `.env` lassen sich echte
  Fotos nachrüsten (Skill `stock-image`).

### Skills

Projektlokale Claude-Code-Skills, die beim schnellen Bauen halfen. Nach Änderungen
`/reload-skills` ausführen.

- **`sdw-frontend`** – UI im sdw-Alumni-Corporate-Design (Farben, Typografie, Tonalität).
- **`hackathon-prototype`** – scaffoldet FastAPI-Backend (JSON-Datei) + React-Frontend.
- **`ngrok-share`** – macht die lokale App über ngrok öffentlich erreichbar.
- **`stock-image`** – findet freie Fotos über die Pexels-API.

### Einrichtung & Teilen

```bash
cp .env.example .env     # dann NGROK_AUTHTOKEN / PEXELS_API_KEY eintragen
```

In Claude Code z. B.: *„Mach die laufende App mit dem ngrok-share-Skill erreichbar."*

### Sicherheit

- **`.env` niemals committen.** Steht in `.gitignore`; Tokens bleiben lokal.
- Die App hat **keine Authentifizierung** und offene CORS – das ist für eine
  Demo okay, aber **nicht** für dauerhaften öffentlichen Betrieb. Keine echten
  personenbezogenen Daten exponieren.
- `backend/data.json` wird hier **ohne** Nutzer-/Interessen-Daten ausgeliefert
  (nur die 24 Angebote). Login/Merkliste schreiben E-Mails hinein – vor einem
  Commit `nutzer`/`interessen`/`gruppen` leeren oder `git checkout backend/data.json`.

</details>

---

*sdw Alumni · Netzwerk fürs Leben*
