// Dev: Vite (5173) spricht das lokale Backend an. Production-Build: wird vom
// FastAPI-Server selbst ausgeliefert → relative URLs, gleicher Origin.
const BASE =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");

const json = (r) => {
  if (!r.ok) throw new Error(`API-Fehler ${r.status}`);
  return r.json();
};

const post = (path, body) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(json);

export const api = {
  fragen: () => fetch(`${BASE}/api/fragen`).then(json),
  matching: (antworten) => post("/api/matching", antworten),
  angebote: (filter = {}) => {
    const params = new URLSearchParams(
      Object.entries(filter).filter(([, v]) => v)
    );
    return fetch(`${BASE}/api/angebote?${params}`).then(json);
  },
  neuesAngebot: (angebot) => post("/api/angebote", angebot),
  login: (name, email) => post("/api/login", { name, email }),
  interesse: (angebotId, email) =>
    post("/api/interesse", { angebot_id: angebotId, email }),
  meineInteressen: (email) =>
    fetch(`${BASE}/api/interesse/${encodeURIComponent(email)}`).then(json),
  gruppeErstellen: () => post("/api/gruppen", {}),
  gruppeStatus: (code) =>
    fetch(`${BASE}/api/gruppen/${encodeURIComponent(code)}`).then(json),
  gruppeAntworten: (code, mitglied) =>
    post(`/api/gruppen/${encodeURIComponent(code)}/antworten`, mitglied),
  gruppeErgebnis: (code) =>
    fetch(`${BASE}/api/gruppen/${encodeURIComponent(code)}/ergebnis`).then(json),
};
