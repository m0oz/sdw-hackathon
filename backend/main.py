import random
import string
import uuid
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

import db

app = FastAPI(title="sdw Alumni – Ehrenamt in Hamburg")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # fine for a hackathon; tighten for real use
    allow_methods=["*"],
    allow_headers=["*"],
)

DEFAULT = {"angebote": [], "nutzer": [], "interessen": [], "gruppen": []}

# ---------------------------------------------------------------------------
# Quiz-Fragen — Wording hier zentral anpassen, das Frontend rendert dynamisch.
# Jede Frage mappt auf eine Matching-Dimension der Angebote.
# ---------------------------------------------------------------------------

FRAGEN = [
    {
        "id": "themen",
        "frage": "Welche Themen liegen dir am Herzen?",
        "hinweis": "Wähle bis zu drei Themen.",
        "multi": True,
        "optionen": [
            {"wert": "bildung", "label": "Bildung & Mentoring"},
            {"wert": "soziales", "label": "Soziales & Unterstützung"},
            {"wert": "integration", "label": "Integration & Geflüchtete"},
            {"wert": "umwelt", "label": "Umwelt & Klima"},
            {"wert": "kultur", "label": "Kultur & Sport"},
            {"wert": "digitales", "label": "Digitales & Pro bono"},
        ],
    },
    {
        "id": "taetigkeit",
        "frage": "Wie möchtest du dich einbringen?",
        "multi": False,
        "optionen": [
            {"wert": "menschen", "label": "Direkt mit Menschen", "hinweis": "begleiten, zuhören, anleiten"},
            {"wert": "fachlich", "label": "Mit meinem Fachwissen", "hinweis": "z. B. IT, Design, Recht, Kommunikation"},
            {"wert": "praktisch", "label": "Praktisch anpacken", "hinweis": "organisieren, sortieren, draußen aktiv"},
            {"wert": "egal", "label": "Ich bin offen für alles"},
        ],
    },
    {
        "id": "zeit",
        "frage": "Wie viel Zeit kannst du geben?",
        "multi": False,
        "optionen": [
            {"wert": "einmalig", "label": "Lieber einmalig oder spontan", "hinweis": "einzelne Aktionen, kein fester Termin"},
            {"wert": "flexibel", "label": "Flexibel, wenn es passt", "hinweis": "mal mehr, mal weniger"},
            {"wert": "regelmaessig", "label": "Regelmäßig mit festem Termin", "hinweis": "z. B. jede Woche"},
        ],
    },
    {
        "id": "format",
        "frage": "Wo möchtest du aktiv sein?",
        "multi": False,
        "optionen": [
            {"wert": "vor_ort", "label": "Vor Ort in Hamburg"},
            {"wert": "remote", "label": "Digital, von überall"},
            {"wert": "egal", "label": "Beides ist okay"},
        ],
    },
    {
        "id": "zielgruppe",
        "frage": "Mit wem möchtest du am liebsten arbeiten?",
        "multi": False,
        "optionen": [
            {"wert": "kinder", "label": "Kinder"},
            {"wert": "jugendliche", "label": "Jugendliche & junge Erwachsene"},
            {"wert": "erwachsene", "label": "Erwachsene"},
            {"wert": "senioren", "label": "Senior:innen"},
            {"wert": "egal", "label": "Keine Präferenz"},
        ],
    },
]

THEMA_LABELS = {o["wert"]: o["label"] for o in FRAGEN[0]["optionen"]}
THEMA_LABELS["gesundheit"] = "Gesundheit"


class LoginRequest(BaseModel):
    name: str
    email: str


class MatchingRequest(BaseModel):
    themen: List[str] = []
    taetigkeit: str = "egal"
    zeit: str = "flexibel"
    format: str = "egal"
    zielgruppe: str = "egal"


class NeuesAngebot(BaseModel):
    titel: str
    organisation: str
    beschreibung: str = ""
    themen: List[str] = []
    taetigkeit: List[str] = []
    zielgruppen: List[str] = []
    format: str = "vor_ort"
    zeit: List[str] = []
    zeitumfang: str = ""
    ort: str = "Hamburg"
    bezirk: str = "Stadtweit"
    website: str = ""
    kontakt: Optional[str] = None


class Interesse(BaseModel):
    angebot_id: str
    email: str


class GruppenMitglied(MatchingRequest):
    name: str


# ---------------------------------------------------------------------------
# Matching
# ---------------------------------------------------------------------------

def score_angebot(angebot: dict, antworten: MatchingRequest):
    score = 0.0
    gruende = []

    gemeinsame_themen = set(antworten.themen) & set(angebot.get("themen", []))
    score += 3.0 * len(gemeinsame_themen)
    for t in gemeinsame_themen:
        gruende.append(f"Thema {THEMA_LABELS.get(t, t)}")

    if antworten.taetigkeit == "egal":
        score += 1.0
    elif antworten.taetigkeit in angebot.get("taetigkeit", []):
        score += 2.0
        gruende.append("passende Art der Tätigkeit")

    if antworten.zeit in angebot.get("zeit", []):
        score += 2.0
        gruende.append("passt zu deinem Zeitbudget")

    if antworten.format == "egal":
        score += 1.0
    elif angebot.get("format") == antworten.format:
        score += 2.0
        gruende.append("Vor Ort in Hamburg" if antworten.format == "vor_ort" else "digital möglich")
    elif angebot.get("format") == "hybrid":
        score += 1.5
        gruende.append("flexibel: vor Ort oder digital")

    if antworten.zielgruppe == "egal":
        score += 0.5
    elif antworten.zielgruppe in angebot.get("zielgruppen", []):
        score += 1.5
        gruende.append("deine Wunsch-Zielgruppe")

    return score, gruende


@app.get("/api/fragen")
def get_fragen():
    return FRAGEN


@app.post("/api/matching")
def matching(antworten: MatchingRequest):
    angebote = db.load(DEFAULT)["angebote"]
    bewertet = []
    for a in angebote:
        score, gruende = score_angebot(a, antworten)
        bewertet.append({**a, "score": round(score, 1), "gruende": gruende})
    # kuratierte Angebote bei Gleichstand zuerst
    bewertet.sort(key=lambda a: (-a["score"], a["quelle"] != "kuratiert", a["titel"]))
    return bewertet[:4]


# ---------------------------------------------------------------------------
# Angebote
# ---------------------------------------------------------------------------

@app.get("/api/angebote")
def list_angebote(thema: Optional[str] = None, format: Optional[str] = None,
                  zeit: Optional[str] = None, q: Optional[str] = None):
    angebote = db.load(DEFAULT)["angebote"]
    if thema:
        angebote = [a for a in angebote if thema in a.get("themen", [])]
    if format:
        angebote = [a for a in angebote if a.get("format") == format or a.get("format") == "hybrid"]
    if zeit:
        angebote = [a for a in angebote if zeit in a.get("zeit", [])]
    if q:
        ql = q.lower()
        angebote = [a for a in angebote
                    if ql in a["titel"].lower()
                    or ql in a["organisation"].lower()
                    or ql in a.get("beschreibung", "").lower()]
    return angebote


@app.get("/api/angebote/{angebot_id}")
def get_angebot(angebot_id: str):
    for a in db.load(DEFAULT)["angebote"]:
        if a["id"] == angebot_id:
            return a
    raise HTTPException(404, "Angebot nicht gefunden")


@app.post("/api/angebote")
def create_angebot(angebot: NeuesAngebot):
    data = db.load(DEFAULT)
    record = {"id": str(uuid.uuid4())[:8], **angebot.model_dump(), "quelle": "community"}
    data["angebote"].append(record)
    db.save(data)
    return record


# ---------------------------------------------------------------------------
# Login (Demo: simuliert das sdw-Alumniportal, kein echtes Passwort)
# ---------------------------------------------------------------------------

@app.post("/api/login")
def login(req: LoginRequest):
    data = db.load(DEFAULT)
    for n in data["nutzer"]:
        if n["email"].lower() == req.email.lower():
            n["name"] = req.name
            db.save(data)
            return n
    nutzer = {"id": str(uuid.uuid4())[:8], "name": req.name, "email": req.email}
    data["nutzer"].append(nutzer)
    db.save(data)
    return nutzer


@app.post("/api/interesse")
def interesse(req: Interesse):
    data = db.load(DEFAULT)
    eintrag = {"angebot_id": req.angebot_id, "email": req.email}
    if eintrag not in data["interessen"]:
        data["interessen"].append(eintrag)
        db.save(data)
    return {"ok": True}


# ---------------------------------------------------------------------------
# Gruppen-Matching: jede:r beantwortet die Fragen, das Portal findet die zwei
# Veranstaltungen, die für ALLE passen (fairster gemeinsamer Nenner).
# ---------------------------------------------------------------------------

def _gruppe_finden(data, code: str):
    for g in data.setdefault("gruppen", []):
        if g["code"] == code.upper():
            return g
    raise HTTPException(404, "Gruppe nicht gefunden")


@app.post("/api/gruppen")
def gruppe_erstellen():
    data = db.load(DEFAULT)
    data.setdefault("gruppen", [])
    code = "".join(random.choices(string.ascii_uppercase.replace("O", "").replace("I", ""), k=4))
    while any(g["code"] == code for g in data["gruppen"]):
        code = "".join(random.choices(string.ascii_uppercase.replace("O", "").replace("I", ""), k=4))
    gruppe = {"code": code, "mitglieder": []}
    data["gruppen"].append(gruppe)
    db.save(data)
    return gruppe


@app.get("/api/gruppen/{code}")
def gruppe_status(code: str):
    g = _gruppe_finden(db.load(DEFAULT), code)
    return {"code": g["code"], "mitglieder": [m["name"] for m in g["mitglieder"]]}


@app.post("/api/gruppen/{code}/antworten")
def gruppe_antworten(code: str, mitglied: GruppenMitglied):
    data = db.load(DEFAULT)
    g = _gruppe_finden(data, code)
    eintrag = mitglied.model_dump()
    g["mitglieder"] = [m for m in g["mitglieder"] if m["name"].lower() != mitglied.name.lower()]
    g["mitglieder"].append(eintrag)
    db.save(data)
    return {"code": g["code"], "mitglieder": [m["name"] for m in g["mitglieder"]]}


@app.get("/api/gruppen/{code}/ergebnis")
def gruppe_ergebnis(code: str):
    data = db.load(DEFAULT)
    g = _gruppe_finden(data, code)
    if len(g["mitglieder"]) < 2:
        raise HTTPException(400, "Mindestens zwei Personen müssen die Fragen beantworten")

    mitglieder = [GruppenMitglied(**m) for m in g["mitglieder"]]
    bewertet = []
    for a in data["angebote"]:
        scores, alle_gruende = {}, []
        for m in mitglieder:
            score, gruende = score_angebot(a, m)
            scores[m.name] = round(score, 1)
            alle_gruende.extend(gruende)
        # erst der/die Unzufriedenste (min), dann die Summe — fair für alle
        min_score = min(scores.values())
        gesamt = sum(scores.values())
        gruende_unique = list(dict.fromkeys(alle_gruende))
        bewertet.append({
            **a,
            "score": round(gesamt, 1),
            "min_score": min_score,
            "punkte": scores,
            "gruende": gruende_unique[:4],
        })
    bewertet.sort(key=lambda x: (-x["min_score"], -x["score"], x["titel"]))
    return {
        "code": g["code"],
        "mitglieder": [m.name for m in mitglieder],
        "vorschlaege": bewertet[:2],
    }


@app.get("/api/interesse/{email}")
def meine_interessen(email: str):
    data = db.load(DEFAULT)
    ids = [i["angebot_id"] for i in data["interessen"] if i["email"].lower() == email.lower()]
    return [a for a in data["angebote"] if a["id"] in ids]


# ---------------------------------------------------------------------------
# Gebautes Frontend mit ausliefern (ein Origin → ein ngrok-Tunnel reicht).
# Muss NACH allen /api-Routen gemountet werden.
# ---------------------------------------------------------------------------

DIST = Path(__file__).parent.parent / "frontend" / "dist"
if DIST.exists():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="frontend")
