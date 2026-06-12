import { THEMEN, FORMATE, ZEITEN, angebotBild } from "../labels.js";

export default function AngebotCard({ angebot, highlight, gemerkt, onMerken }) {
  return (
    <article className={`card angebot-card ${highlight ? "gold" : "teal"}`}>
      <div
        className="card-img"
        style={{ backgroundImage: `url(${angebotBild(angebot)})` }}
        role="img"
        aria-label={angebot.titel}
      >
        {highlight && <span className="pill">Top-Empfehlung</span>}
      </div>
      <div className="card-body">
        <div className="org">{angebot.organisation}</div>
        <h3>{angebot.titel}</h3>
        <p className="desc">{angebot.beschreibung}</p>
        <div className="meta">
          {(angebot.themen || []).map((t) => (
            <span key={t} className="tag">{THEMEN[t] || t}</span>
          ))}
          <span className="tag">{FORMATE[angebot.format] || angebot.format}</span>
          {(angebot.zeit || []).map((z) => (
            <span key={z} className="tag">{ZEITEN[z] || z}</span>
          ))}
        </div>
        <div className="fakten">
          📍 {angebot.ort} · 🕑 {angebot.zeitumfang || "nach Absprache"}
          {angebot.quelle === "community" && " · von der Community eingetragen"}
        </div>
        {angebot.gruende?.length > 0 && (
          <div className="gruende">✓ {angebot.gruende.join(" · ")}</div>
        )}
        <div className="card-actions">
          {angebot.website && (
            <a href={angebot.website} target="_blank" rel="noreferrer">
              Zur Organisation →
            </a>
          )}
          {onMerken && (
            <button
              className="btn secondary small"
              onClick={() => onMerken(angebot)}
              disabled={gemerkt}
            >
              {gemerkt ? "✓ Gemerkt" : "Merken"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
