import { useEffect, useRef, useState } from "react";
import { api, getToken } from "./api.js";
import { THEMEN, FORMATE, ZEITEN } from "./labels.js";
import Quiz from "./components/Quiz.jsx";
import Eintragen from "./components/Eintragen.jsx";
import AngebotCard from "./components/AngebotCard.jsx";
import Gruppe from "./components/Gruppe.jsx";

function Brand() {
  return (
    <div className="brand">
      <img className="logo" src={`${import.meta.env.BASE_URL}sdw-alumni-logo.png`} alt="sdw Alumni" />
    </div>
  );
}

function PocBanner() {
  return (
    <div className="poc-banner">
      ⚠️ Proof of Concept – Demo-Prototyp, keine echten Daten
    </div>
  );
}

// Fehlertext, wenn das Backend nicht antwortet: lokal ist meist uvicorn nicht
// gestartet, in der Demo schläft eher noch der kostenlose Render-Dienst.
const OFFLINE_MSG = import.meta.env.DEV
  ? "Backend nicht erreichbar – läuft uvicorn auf Port 8000?"
  : "Der Demo-Server fährt wohl noch hoch – bitte einen Moment warten und dann noch einmal versuchen.";

// Pingt /api/health, bis das Backend antwortet. Der erste Ping weckt den
// schlafenden Render-Dienst (kostenloses Tier) – so startet er schon beim
// Laden der Seite statt erst beim ersten Klick. Liefert den Wach-Status und
// die bisher verstrichene Wartezeit in Sekunden.
function useBackendWach() {
  const [wach, setWach] = useState(false);
  const [sekunden, setSekunden] = useState(0);

  useEffect(() => {
    let aktiv = true;
    const start = Date.now();
    const zaehler = setInterval(
      () => setSekunden(Math.round((Date.now() - start) / 1000)),
      1000
    );
    (async () => {
      while (aktiv && !(await api.health())) {
        await new Promise((r) => setTimeout(r, 3000));
      }
      clearInterval(zaehler);
      if (aktiv) setWach(true);
    })();
    return () => {
      aktiv = false;
      clearInterval(zaehler);
    };
  }, []);

  return { wach, sekunden };
}

// Schmale Statusleiste unter dem PoC-Banner, solange der Server hochfährt.
// Ein warmer Server antwortet sofort – dann erscheint sie gar nicht erst.
function WeckBanner({ wach, sekunden }) {
  const warLangsam = useRef(false);
  if (!wach && sekunden >= 2) warLangsam.current = true;
  const [ausgeblendet, setAusgeblendet] = useState(false);

  useEffect(() => {
    if (!wach) return;
    const t = setTimeout(() => setAusgeblendet(true), 3000);
    return () => clearTimeout(t);
  }, [wach]);

  if (!warLangsam.current || ausgeblendet) return null;

  if (wach) {
    return (
      <div className="weck-banner wach" role="status">
        ✓ Der Server ist bereit – los geht's!
      </div>
    );
  }
  return (
    <div className="weck-banner" role="status">
      <span className="weck-spinner" aria-hidden="true" />
      <span>
        <strong>Der Demo-Server wird gerade geweckt</strong> – kostenloses
        Hosting, der erste Start kann bis zu einer Minute dauern
        {sekunden >= 5 ? ` (${sekunden} s)` : ""} …
      </span>
    </div>
  );
}

// „Mensch?"-Tor: schützt die Demo vor Bots. Die Antwort wird serverseitig
// geprüft (api.gate) – ein reiner Frontend-Check liesse sich umgehen. Bei
// Erfolg legt das Backend ein Token ab, das alle weiteren Aufrufe absichert.
function HumanGate({ onPass }) {
  const [antwort, setAntwort] = useState("");
  const [fehler, setFehler] = useState(false);
  const [laedt, setLaedt] = useState(false);

  const pruefen = async (e) => {
    e.preventDefault();
    setLaedt(true);
    setFehler(false);
    try {
      await api.gate(antwort);
      onPass();
    } catch (err) {
      setFehler(
        err.message === "GATE_WRONG"
          ? "Leider nicht richtig – versuch es noch einmal."
          : OFFLINE_MSG
      );
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div className="gate-overlay">
      <form className="card teal gate-card" onSubmit={pruefen}>
        <span className="kicker">Botcheck</span>
        <h3>Kurz bestätigen, dass du kein Bot bist</h3>
        <p>Beantworte eine Frage, die in der sdw-Community jede:r kennt:
          Wie heißt die jährliche sdw-Aktion für soziales Engagement?</p>
        <input autoFocus type="text" value={antwort}
          onChange={(e) => { setAntwort(e.target.value); setFehler(false); }}
          placeholder="Deine Antwort" />
        {fehler && <p className="gate-error">{fehler}</p>}
        <div style={{ marginTop: "1.2rem" }}>
          <button className="btn" type="submit" disabled={laedt || !antwort.trim()}>
            {laedt ? "Prüfe …" : "Weiter"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Aus dem Namen wird eine Wegwerf-Adresse erzeugt – wir speichern bewusst
// keine echten E-Mails (Proof of Concept).
function bogusEmail(name) {
  const slug = name.trim().toLowerCase()
    .replace(/ä/g, "ae").replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, ".").replace(/^\.+|\.+$/g, "") || "gast";
  return `${slug}@poc.invalid`;
}

function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [laedt, setLaedt] = useState(false);

  const onName = (e) => setName(e.target.value);

  const anmelden = async (e) => {
    e.preventDefault();
    setLaedt(true);
    try {
      const nutzer = await api.login(name, bogusEmail(name));
      onLogin(nutzer);
    } catch {
      alert(OFFLINE_MSG);
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Brand />
      <div className="shell hero">
        <div className="bracket">
          <img className="logo-hero" src={`${import.meta.env.BASE_URL}ehrenmoin-logo.svg`} alt="EhrenMoin – Ehrenamt in Hamburg" />
          <span className="kicker">Netzwerk fürs Leben</span>
          <h1>Moin! Finde dein Ehrenamt.</h1>
        </div>
        <p className="lead">
          Finde in zwei Minuten das Ehrenamt, das zu dir passt: Beantworte fünf
          kurze Fragen und erhalte vier persönliche Vorschläge – kuratiert für
          Stipendiat:innen und Alumni der sdw.
        </p>
        <form className="card teal login-card" onSubmit={anmelden}>
          <h3>Anmelden</h3>
          <label htmlFor="name">Dein Name</label>
          <input id="name" type="text" required value={name}
            onChange={onName} placeholder="Vorname Nachname" />
          <label htmlFor="email">E-Mail (automatisch erzeugt)</label>
          <input id="email" type="text" readOnly tabIndex={-1}
            value={name ? bogusEmail(name) : ""} placeholder="wird automatisch erzeugt" />
          <div style={{ marginTop: "1.4rem" }}>
            <button className="btn" type="submit" disabled={laedt || !name.trim()}>
              {laedt ? "Anmelden …" : "Mit sdw-Login starten"}
            </button>
          </div>
          <p className="login-hint">
            Demo: Die Anmeldung simuliert das sdw-Alumniportal – es wird kein
            Passwort geprüft. Wir speichern <strong>keine echten E-Mails</strong>,
            sondern eine Wegwerf-Adresse.
          </p>
        </form>
      </div>
    </div>
  );
}

function Angebotsliste({ nutzer, gemerkt, onMerken }) {
  const [angebote, setAngebote] = useState([]);
  const [filter, setFilter] = useState({ thema: "", format: "", zeit: "", q: "" });

  useEffect(() => {
    api.angebote(filter).then(setAngebote).catch(() => setAngebote([]));
  }, [filter]);

  const set = (feld) => (e) => setFilter({ ...filter, [feld]: e.target.value });

  return (
    <div>
      <span className="kicker">Alle Verfügbarkeiten</span>
      <h2>Angebote in Hamburg & remote</h2>
      <div className="filterbar">
        <input type="text" placeholder="Suchen …" value={filter.q} onChange={set("q")} />
        <select value={filter.thema} onChange={set("thema")}>
          <option value="">Alle Themen</option>
          {Object.entries(THEMEN).map(([w, l]) => <option key={w} value={w}>{l}</option>)}
        </select>
        <select value={filter.format} onChange={set("format")}>
          <option value="">Vor Ort & remote</option>
          {Object.entries(FORMATE).filter(([w]) => w !== "hybrid")
            .map(([w, l]) => <option key={w} value={w}>{l}</option>)}
        </select>
        <select value={filter.zeit} onChange={set("zeit")}>
          <option value="">Jedes Zeitmodell</option>
          {Object.entries(ZEITEN).map(([w, l]) => <option key={w} value={w}>{l}</option>)}
        </select>
      </div>
      {angebote.length === 0 ? (
        <p className="empty">Keine Angebote gefunden – Filter etwas lockern?</p>
      ) : (
        <div className="grid">
          {angebote.map((a) => (
            <AngebotCard key={a.id} angebot={a}
              gemerkt={gemerkt.has(a.id)}
              onMerken={(ang) => onMerken(ang, nutzer)} />
          ))}
        </div>
      )}
    </div>
  );
}

function Ergebnis({ ergebnisse, nutzer, gemerkt, onMerken, onNeustart }) {
  return (
    <div>
      <span className="kicker">Dein Matching</span>
      <h2>Diese 4 Engagements passen zu dir, {nutzer.name.split(" ")[0]}</h2>
      <div className="grid">
        {ergebnisse.map((a, i) => (
          <AngebotCard key={a.id} angebot={a} highlight={i === 0}
            gemerkt={gemerkt.has(a.id)}
            onMerken={(ang) => onMerken(ang, nutzer)} />
        ))}
      </div>
      <div style={{ marginTop: "2rem" }}>
        <button className="btn secondary" onClick={onNeustart}>
          Fragen noch einmal beantworten
        </button>
      </div>
    </div>
  );
}

function Merkliste({ angebote }) {
  if (angebote.length === 0)
    return <p className="empty">Noch nichts gemerkt – starte das Matching oder stöbere in den Angeboten.</p>;
  return (
    <div className="grid">
      {angebote.map((a) => <AngebotCard key={a.id} angebot={a} />)}
    </div>
  );
}

export default function App() {
  const [mensch, setMensch] = useState(() => Boolean(getToken()));
  const [nutzer, setNutzer] = useState(() => {
    const n = localStorage.getItem("sdw-nutzer");
    return n ? JSON.parse(n) : null;
  });
  const [view, setView] = useState("quiz");
  const [ergebnisse, setErgebnisse] = useState(null);
  const [gemerkt, setGemerkt] = useState(new Set());
  const [merkliste, setMerkliste] = useState([]);
  const backend = useBackendWach();

  useEffect(() => {
    if (!nutzer) return;
    api.meineInteressen(nutzer.email)
      .then((liste) => {
        setMerkliste(liste);
        setGemerkt(new Set(liste.map((a) => a.id)));
      })
      .catch(() => {});
  }, [nutzer, view]);

  if (!mensch) {
    return (
      <>
        <PocBanner />
        <WeckBanner {...backend} />
        <HumanGate onPass={() => setMensch(true)} />
      </>
    );
  }

  if (!nutzer) {
    return (
      <>
        <PocBanner />
        <WeckBanner {...backend} />
        <Login onLogin={(n) => {
          localStorage.setItem("sdw-nutzer", JSON.stringify(n));
          setNutzer(n);
        }} />
      </>
    );
  }

  const merken = async (angebot, n) => {
    await api.interesse(angebot.id, n.email);
    setGemerkt(new Set([...gemerkt, angebot.id]));
  };

  const abmelden = () => {
    localStorage.removeItem("sdw-nutzer");
    setNutzer(null);
    setErgebnisse(null);
    setView("quiz");
  };

  return (
    <>
      <PocBanner />
      <WeckBanner {...backend} />
      <Brand />
      <div className="shell">
        <nav className="nav">
          <img className="nav-logo" src={`${import.meta.env.BASE_URL}ehrenmoin-logo.svg`} alt="EhrenMoin" />
          <button className={view === "quiz" || view === "ergebnis" ? "active" : ""}
            onClick={() => setView(ergebnisse ? "ergebnis" : "quiz")}>
            Matching
          </button>
          <button className={view === "gruppe" ? "active" : ""}
            onClick={() => setView("gruppe")}>
            Gruppen-Matching
          </button>
          <button className={view === "angebote" ? "active" : ""}
            onClick={() => setView("angebote")}>
            Alle Angebote
          </button>
          <button className={view === "eintragen" ? "active" : ""}
            onClick={() => setView("eintragen")}>
            Eintragen
          </button>
          <button className={view === "merkliste" ? "active" : ""}
            onClick={() => setView("merkliste")}>
            Merkliste{gemerkt.size > 0 ? ` (${gemerkt.size})` : ""}
          </button>
          <span className="spacer" />
          <span className="user">
            {nutzer.name} · <a href="#" onClick={(e) => { e.preventDefault(); abmelden(); }}>Abmelden</a>
          </span>
        </nav>

        <main className="section-head">
          {view === "quiz" && (
            <Quiz onFertig={(erg) => { setErgebnisse(erg); setView("ergebnis"); }} />
          )}
          {view === "ergebnis" && ergebnisse && (
            <Ergebnis ergebnisse={ergebnisse} nutzer={nutzer} gemerkt={gemerkt}
              onMerken={merken}
              onNeustart={() => { setErgebnisse(null); setView("quiz"); }} />
          )}
          {view === "angebote" && (
            <Angebotsliste nutzer={nutzer} gemerkt={gemerkt} onMerken={merken} />
          )}
          {view === "gruppe" && <Gruppe nutzer={nutzer} />}
          {view === "eintragen" && <Eintragen />}
          {view === "merkliste" && <Merkliste angebote={merkliste} />}
        </main>

        <footer>
          sdw Alumni e.V. · Netzwerk fürs Leben · Hackathon-Prototyp – Daten
          kuratiert aus öffentlichen Quellen, alle Angebote verlinken auf die
          jeweilige Organisation.
        </footer>
      </div>
    </>
  );
}
