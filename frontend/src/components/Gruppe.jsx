import { useState } from "react";
import { api } from "../api.js";
import Fragebogen from "./Fragebogen.jsx";
import AngebotCard from "./AngebotCard.jsx";

export default function Gruppe({ nutzer }) {
  const [phase, setPhase] = useState("start"); // start | lobby | fragebogen | ergebnis
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");
  const [mitglieder, setMitglieder] = useState([]);
  const [name, setName] = useState(nutzer?.name || "");
  const [ergebnis, setErgebnis] = useState(null);
  const [fehler, setFehler] = useState("");

  const starten = async () => {
    const g = await api.gruppeErstellen();
    setCode(g.code);
    setMitglieder([]);
    setFehler("");
    setPhase("lobby");
  };

  const beitreten = async () => {
    try {
      const g = await api.gruppeStatus(codeInput.trim().toUpperCase());
      setCode(g.code);
      setMitglieder(g.mitglieder);
      setFehler("");
      setPhase("lobby");
    } catch {
      setFehler("Gruppe nicht gefunden – Code prüfen?");
    }
  };

  const aktualisieren = async () => {
    const g = await api.gruppeStatus(code);
    setMitglieder(g.mitglieder);
  };

  const antwortenAbgeben = async (antworten) => {
    const g = await api.gruppeAntworten(code, { name, ...antworten });
    setMitglieder(g.mitglieder);
    setName("");
    setPhase("lobby");
  };

  const ergebnisZeigen = async () => {
    try {
      const e = await api.gruppeErgebnis(code);
      setErgebnis(e);
      setFehler("");
      setPhase("ergebnis");
    } catch {
      setFehler("Mindestens zwei Personen müssen die Fragen beantworten.");
    }
  };

  if (phase === "start") {
    return (
      <div>
        <span className="kicker">Gemeinsam engagieren</span>
        <h2>Gruppen-Matching</h2>
        <p className="lead" style={{ maxWidth: 620, color: "var(--sdw-muted)", margin: "0.8rem 0 1.6rem" }}>
          Ihr seid eine Gruppe von Freund:innen oder Engagierten? Jede:r
          beantwortet die fünf Fragen – und EhrenMoin findet die{" "}
          <b>zwei Veranstaltungen, die für euch alle passen</b>.
        </p>
        <div className="grid" style={{ maxWidth: 760 }}>
          <div className="card gold">
            <h3>Neue Gruppe starten</h3>
            <p className="fakten" style={{ margin: ".4rem 0 1rem" }}>
              Du bekommst einen Gruppen-Code zum Teilen – oder ihr reicht
              einfach das Handy herum.
            </p>
            <button className="btn" onClick={starten}>Gruppe starten</button>
          </div>
          <div className="card teal">
            <h3>Gruppe beitreten</h3>
            <p className="fakten" style={{ margin: ".4rem 0 .8rem" }}>
              Code von deinen Freund:innen eingeben:
            </p>
            <input type="text" placeholder="z. B. KWZX" value={codeInput}
              maxLength={4} style={{ textTransform: "uppercase", letterSpacing: ".3em", fontWeight: 800 }}
              onChange={(e) => setCodeInput(e.target.value)} />
            <div style={{ marginTop: ".8rem" }}>
              <button className="btn secondary" onClick={beitreten} disabled={codeInput.trim().length !== 4}>
                Beitreten
              </button>
            </div>
          </div>
        </div>
        {fehler && <p className="empty" style={{ color: "var(--sdw-bad)" }}>{fehler}</p>}
      </div>
    );
  }

  if (phase === "fragebogen") {
    return (
      <div>
        <div className="quiz" style={{ marginBottom: "-2rem" }}>
          <span className="kicker">Gruppe {code}</span>
          <h2>Wer antwortet gerade?</h2>
          <input type="text" placeholder="Dein Name" value={name}
            style={{ margin: "1rem 0 .4rem", maxWidth: 320 }}
            onChange={(e) => setName(e.target.value)} />
        </div>
        {name.trim() ? (
          <Fragebogen onFertig={antwortenAbgeben} submitLabel="Antworten abgeben" />
        ) : (
          <p className="empty quiz">Gib zuerst deinen Namen ein.</p>
        )}
      </div>
    );
  }

  if (phase === "ergebnis" && ergebnis) {
    return (
      <div>
        <span className="kicker">Gruppe {ergebnis.code} · {ergebnis.mitglieder.join(", ")}</span>
        <h2>Eure 2 gemeinsamen Engagements</h2>
        <p className="fakten" style={{ marginTop: ".4rem" }}>
          Ausgewählt, damit niemand zu kurz kommt: erst zählt die Person mit der
          geringsten Übereinstimmung, dann die Gruppe insgesamt.
        </p>
        <div className="grid" style={{ marginTop: "1.4rem" }}>
          {ergebnis.vorschlaege.map((a, i) => (
            <div key={a.id}>
              <AngebotCard angebot={a} highlight={i === 0} />
              <div className="punkte">
                {Object.entries(a.punkte).map(([n, p]) => (
                  <span key={n} className="tag">{n}: {p} P.</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "2rem", display: "flex", gap: ".8rem", flexWrap: "wrap" }}>
          <button className="btn secondary" onClick={() => setPhase("lobby")}>Zurück zur Gruppe</button>
          <button className="btn secondary" onClick={() => { setErgebnis(null); setPhase("start"); }}>
            Neue Gruppe
          </button>
        </div>
      </div>
    );
  }

  // Lobby
  return (
    <div>
      <span className="kicker">Gruppen-Matching</span>
      <h2>Gruppe <span className="code-badge">{code}</span></h2>
      <p className="fakten" style={{ marginTop: ".4rem" }}>
        Teile den Code mit deinen Freund:innen (sie wählen „Gruppe beitreten") –
        oder reicht das Gerät herum und jede:r beantwortet die Fragen.
      </p>
      <div className="card teal" style={{ maxWidth: 520, marginTop: "1.4rem" }}>
        <h3>Schon geantwortet ({mitglieder.length})</h3>
        {mitglieder.length === 0
          ? <p className="fakten" style={{ marginTop: ".4rem" }}>Noch niemand – leg los!</p>
          : <div className="meta" style={{ marginTop: ".6rem" }}>
              {mitglieder.map((m) => <span key={m} className="tag">✓ {m}</span>)}
            </div>}
        <div style={{ marginTop: "1.2rem", display: "flex", gap: ".7rem", flexWrap: "wrap" }}>
          <button className="btn" onClick={() => setPhase("fragebogen")}>
            Fragen beantworten
          </button>
          <button className="btn secondary" onClick={ergebnisZeigen} disabled={mitglieder.length < 2}>
            Unsere 2 Vorschläge
          </button>
          <button className="btn secondary small" onClick={aktualisieren} title="Mitgliederliste aktualisieren">
            ↻
          </button>
        </div>
        {fehler && <p className="fakten" style={{ color: "var(--sdw-bad)", marginTop: ".8rem" }}>{fehler}</p>}
      </div>
    </div>
  );
}
