import { useEffect, useState } from "react";
import { api } from "../api.js";

const MAX_THEMEN = 3;

// Stellt die Matching-Fragen (aus dem Backend) und liefert die rohen
// Antworten per onFertig zurück — genutzt vom Einzel- und Gruppen-Matching.
export default function Fragebogen({ onFertig, submitLabel, laedt = false }) {
  const [fragen, setFragen] = useState(null);
  const [schritt, setSchritt] = useState(0);
  const [antworten, setAntworten] = useState({});

  useEffect(() => {
    api.fragen().then(setFragen).catch(() => setFragen([]));
  }, []);

  if (!fragen) return <p className="empty">Fragen werden geladen …</p>;
  if (fragen.length === 0)
    return <p className="empty">Backend nicht erreichbar – läuft uvicorn auf Port 8000?</p>;

  const frage = fragen[schritt];
  const wert = antworten[frage.id] ?? (frage.multi ? [] : null);

  const waehle = (option) => {
    if (frage.multi) {
      const neu = wert.includes(option)
        ? wert.filter((w) => w !== option)
        : wert.length < MAX_THEMEN
          ? [...wert, option]
          : wert;
      setAntworten({ ...antworten, [frage.id]: neu });
    } else {
      setAntworten({ ...antworten, [frage.id]: option });
    }
  };

  const weiter = () => {
    if (schritt < fragen.length - 1) {
      setSchritt(schritt + 1);
      return;
    }
    onFertig({
      themen: antworten.themen || [],
      taetigkeit: antworten.taetigkeit || "egal",
      zeit: antworten.zeit || "flexibel",
      format: antworten.format || "egal",
      zielgruppe: antworten.zielgruppe || "egal",
    });
  };

  const beantwortet = frage.multi ? wert.length > 0 : wert !== null;

  return (
    <div className="quiz">
      <span className="kicker">
        Frage {schritt + 1} von {fragen.length}
      </span>
      <h2>{frage.frage}</h2>
      {frage.hinweis && <p className="fakten">{frage.hinweis}</p>}
      <div className="progress">
        <div style={{ width: `${((schritt + 1) / fragen.length) * 100}%` }} />
      </div>
      <div className="optionen">
        {frage.optionen.map((o) => {
          const selected = frage.multi ? wert.includes(o.wert) : wert === o.wert;
          return (
            <button
              key={o.wert}
              className={`option ${selected ? "selected" : ""}`}
              onClick={() => waehle(o.wert)}
            >
              <b>{o.label}</b>
              {o.hinweis && <span>{o.hinweis}</span>}
            </button>
          );
        })}
      </div>
      <div className="quiz-nav">
        {schritt > 0 && (
          <button className="btn secondary" onClick={() => setSchritt(schritt - 1)}>
            Zurück
          </button>
        )}
        <button className="btn" onClick={weiter} disabled={!beantwortet || laedt}>
          {schritt < fragen.length - 1
            ? "Weiter"
            : laedt
              ? "Suche läuft …"
              : submitLabel}
        </button>
      </div>
    </div>
  );
}
