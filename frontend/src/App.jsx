import { useEffect, useState } from "react";
import { api } from "./api.js";
import { THEMEN, FORMATE, ZEITEN } from "./labels.js";
import Quiz from "./components/Quiz.jsx";
import Eintragen from "./components/Eintragen.jsx";
import AngebotCard from "./components/AngebotCard.jsx";
import Gruppe from "./components/Gruppe.jsx";

function Brand() {
  return (
    <div className="brand">
      <img className="logo" src="/sdw-alumni-logo.png" alt="sdw Alumni" />
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

// Einfaches „Mensch?"-Tor: schützt die Demo vor Bots, fragt sdw-Insiderwissen ab.
function HumanGate({ onPass }) {
  const [antwort, setAntwort] = useState("");
  const [fehler, setFehler] = useState(false);

  const pruefen = (e) => {
    e.preventDefault();
    const norm = antwort.trim().toLowerCase()
      .replace(/ä/g, "ae").replace(/ü/g, "ue").replace(/ö/g, "oe").replace(/ß/g, "ss")
      .replace(/[^a-z]/g, "");
    if (norm === "fruehjahrsaktion") {
      onPass();
    } else {
      setFehler(true);
    }
  };

  return (
    <div className="gate-overlay">
      <form className="card teal gate-card" onSubmit={pruefen}>
        <span className="kicker">Kurze Frage</span>
        <h3>Bist du ein Mensch?</h3>
        <p>Wie heißt die jährliche sdw-Aktion für soziales Engagement?</p>
        <input autoFocus type="text" value={antwort}
          onChange={(e) => { setAntwort(e.target.value); setFehler(false); }}
          placeholder="Deine Antwort" />
        {fehler && <p className="gate-error">Leider nicht richtig – versuch es noch einmal.</p>}
        <div style={{ marginTop: "1.2rem" }}>
          <button className="btn" type="submit">Weiter</button>
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
      alert("Backend nicht erreichbar – läuft uvicorn auf Port 8000?");
    } finally {
      setLaedt(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Brand />
      <div className="shell hero">
        <div className="bracket">
          <img className="logo-hero" src="/ehrenmoin-logo.svg" alt="EhrenMoin – Ehrenamt in Hamburg" />
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
  const [mensch, setMensch] = useState(() => localStorage.getItem("sdw-mensch") === "ja");
  const [nutzer, setNutzer] = useState(() => {
    const n = localStorage.getItem("sdw-nutzer");
    return n ? JSON.parse(n) : null;
  });
  const [view, setView] = useState("quiz");
  const [ergebnisse, setErgebnisse] = useState(null);
  const [gemerkt, setGemerkt] = useState(new Set());
  const [merkliste, setMerkliste] = useState([]);

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
        <HumanGate onPass={() => {
          localStorage.setItem("sdw-mensch", "ja");
          setMensch(true);
        }} />
      </>
    );
  }

  if (!nutzer) {
    return (
      <>
        <PocBanner />
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
      <Brand />
      <div className="shell">
        <nav className="nav">
          <img className="nav-logo" src="/ehrenmoin-logo.svg" alt="EhrenMoin" />
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
