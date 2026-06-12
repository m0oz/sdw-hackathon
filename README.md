# sdw Hackathon – Finde dein Ehrenamt

Materialien für einen Workshop + Mini-Hackathon der **sdw Alumni** („Netzwerk fürs Leben").
Die Idee: gemeinsam verstehen, wie aus einem Sprachmodell ein handelnder **Agent** wird –
und das Gelernte sofort nutzen, um etwas **Gemeinnütziges** zu bauen.

Das Ergebnis unten wurde in nur **45 Minuten mit KI** gebaut. Hier ist es.

---

## Das Ergebnis: „EhrenMoin – Ehrenamt in Hamburg"

> **Entstanden beim sdw Mini-Hackathon am 11. Juni 2026 – in nur 45 Minuten mit KI
> (Claude Code) gebaut.** Ein Beispiel dafür, wie aus einem Agenten in kürzester
> Zeit ein echtes, nützliches Produkt für die Community wird.
>
> Insgesamt entstanden an diesem Tag **vier Prototypen – alle gleichermaßen
> beeindruckend**. Stellvertretend zeigen wir hier einen davon.

### 🚀 Live ausprobieren

**→ [m0oz.github.io/sdw-hackathon](https://m0oz.github.io/sdw-hackathon/)**

<a href="https://m0oz.github.io/sdw-hackathon/"><img src="pitch-assets/qr-demo.png" alt="QR-Code zur Live-Demo" width="180" /></a>

<sub>QR-Code scannen oder dem Link folgen. Hinweis: Das Backend läuft auf einem
kostenlosen Tier und „schläft" bei Inaktivität – der erste Aufruf kann 30–60 s dauern.</sub>

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

Die Angebote sind **über 80 echte, recherchierte Ehrenamts-Möglichkeiten aus Hamburg
und Umgebung** – keine Platzhalter, von Bildung und Integration über Umwelt,
Soziales und Gesundheit bis Kultur, Digitales und Bevölkerungsschutz.

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

Die Aufgabe: mit einem Agenten (z. B. Claude Code) in kurzer Zeit ein
**Engagement-Portal** bauen – eine Website, die Wege zum sozialen Engagement
entdeckbar macht. Genau das ist „EhrenMoin" geworden.

Ablauf: **Team & Idee (5 Min) → Plan → Bauen → 2-Min-Pitch.**

### Vorbereitete Skills

Damit die Teams nicht bei null starten mussten, lagen im Repo vier vorbereitete
**Claude-Code-Skills** – wiederverwendbare Bauanleitungen, die der Agent bei
Bedarf selbst heranzieht:

- **`hackathon-prototype`** – erzeugt in Minuten ein lauffähiges Grundgerüst:
  FastAPI-Backend mit einer JSON-Datei als Datenbank plus React-Frontend.
- **`sdw-frontend`** – sorgt dafür, dass jede Oberfläche automatisch im
  sdw-Alumni-Look entsteht (Farben, Logo, Typografie, warme deutsche Ansprache).
- **`ngrok-share`** – macht die lokal laufende App mit einem Satz öffentlich
  erreichbar, z. B. fürs Testen auf dem Handy oder den Pitch.
- **`stock-image`** – findet freie Fotos über die Pexels-API, statt graue
  Platzhalter zu verwenden.

So konnten sich die Teams auf die eigentliche Idee konzentrieren – Gerüst,
Branding und Teilen übernahm der Agent.

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

- **Daten:** `backend/data.json` — über 80 echte Hamburger Angebote: 24 handkuratierte
  (`"quelle": "kuratiert"`) plus per Web-Recherche ergänzte (`"quelle": "recherchiert"`).
  Community-Einträge landen in derselben Datei mit `"quelle": "community"`.
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

Die vier projektlokalen Skills in `.claude/skills/` sind oben unter
[„Vorbereitete Skills"](#vorbereitete-skills) beschrieben. Nach Änderungen an
einer `SKILL.md` in Claude Code `/reload-skills` ausführen.

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
