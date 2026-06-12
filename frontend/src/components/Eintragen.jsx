import { useState } from "react";
import { api } from "../api.js";
import { THEMEN, ZEITEN, TAETIGKEITEN, ZIELGRUPPEN } from "../labels.js";

const LEER = {
  titel: "",
  organisation: "",
  beschreibung: "",
  website: "",
  ort: "Hamburg",
  zeitumfang: "",
  format: "vor_ort",
  themen: [],
  zeit: [],
  taetigkeit: [],
  zielgruppen: [],
};

function CheckGruppe({ label, optionen, werte, onChange }) {
  const toggle = (w) =>
    onChange(werte.includes(w) ? werte.filter((x) => x !== w) : [...werte, w]);
  return (
    <>
      <label>{label}</label>
      <div className="checks">
        {Object.entries(optionen).map(([wert, text]) => (
          <span
            key={wert}
            className={`check ${werte.includes(wert) ? "selected" : ""}`}
            onClick={() => toggle(wert)}
          >
            {text}
          </span>
        ))}
      </div>
    </>
  );
}

export default function Eintragen({ onGespeichert }) {
  const [form, setForm] = useState(LEER);
  const [gespeichert, setGespeichert] = useState(false);
  const set = (feld) => (e) => setForm({ ...form, [feld]: e.target.value });

  const speichern = async (e) => {
    e.preventDefault();
    await api.neuesAngebot(form);
    setForm(LEER);
    setGespeichert(true);
    onGespeichert?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="form">
      <span className="kicker">Mitmachen</span>
      <h2>Eigenes Angebot eintragen</h2>
      <p className="fakten" style={{ marginTop: ".5rem" }}>
        Du kennst eine Organisation oder Veranstaltung, die Unterstützung sucht?
        Trag sie ein – sie erscheint sofort in der Angebotsliste und im Matching.
      </p>
      {gespeichert && (
        <div className="success">
          Danke! Dein Angebot ist jetzt in der Datenbank sichtbar.
        </div>
      )}
      <form onSubmit={speichern}>
        <div className="row">
          <div>
            <label>Titel des Engagements *</label>
            <input type="text" required value={form.titel} onChange={set("titel")}
              placeholder="z. B. Nachhilfe für Geflüchtete" />
          </div>
          <div>
            <label>Organisation / Verein *</label>
            <input type="text" required value={form.organisation} onChange={set("organisation")} />
          </div>
        </div>
        <label>Kurzbeschreibung *</label>
        <textarea rows={3} required value={form.beschreibung} onChange={set("beschreibung")}
          placeholder="Was wird gemacht, wer wird gesucht?" />
        <div className="row">
          <div>
            <label>Webseite</label>
            <input type="url" value={form.website} onChange={set("website")}
              placeholder="https://…" />
          </div>
          <div>
            <label>Ort / Stadtteil</label>
            <input type="text" value={form.ort} onChange={set("ort")} />
          </div>
        </div>
        <div className="row">
          <div>
            <label>Zeitumfang</label>
            <input type="text" value={form.zeitumfang} onChange={set("zeitumfang")}
              placeholder="z. B. 2 Std./Woche" />
          </div>
          <div>
            <label>Format</label>
            <select value={form.format} onChange={set("format")}>
              <option value="vor_ort">Vor Ort</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Vor Ort & remote</option>
            </select>
          </div>
        </div>
        <CheckGruppe label="Themen" optionen={THEMEN} werte={form.themen}
          onChange={(v) => setForm({ ...form, themen: v })} />
        <CheckGruppe label="Art der Tätigkeit" optionen={TAETIGKEITEN} werte={form.taetigkeit}
          onChange={(v) => setForm({ ...form, taetigkeit: v })} />
        <CheckGruppe label="Zeitmodell" optionen={ZEITEN} werte={form.zeit}
          onChange={(v) => setForm({ ...form, zeit: v })} />
        <CheckGruppe label="Zielgruppen" optionen={ZIELGRUPPEN} werte={form.zielgruppen}
          onChange={(v) => setForm({ ...form, zielgruppen: v })} />
        <div style={{ marginTop: "1.6rem" }}>
          <button className="btn" type="submit">Angebot eintragen</button>
        </div>
      </form>
    </div>
  );
}
