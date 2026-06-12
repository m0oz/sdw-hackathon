// Dev: Vite (5173) spricht das lokale Backend an. Production-Build: wird vom
// FastAPI-Server selbst ausgeliefert → relative URLs, gleicher Origin.
const BASE =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8000" : "");

// Gate-Token: wird nach korrekter Mensch-Frage vom Backend ausgegeben und bei
// jedem geschützten /api-Aufruf als Header mitgeschickt.
const TOKEN_KEY = "sdw-gate-token";
export const getToken = () => localStorage.getItem(TOKEN_KEY) || "";
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const headers = (extra = {}) => {
  const h = { ...extra };
  const t = getToken();
  if (t) h["X-Gate-Token"] = t;
  return h;
};

const json = (r) => {
  if (r.status === 401) {
    // Token fehlt/ungültig → Gate erneut erzwingen.
    clearToken();
    throw new Error("GATE");
  }
  if (!r.ok) throw new Error(`API-Fehler ${r.status}`);
  return r.json();
};

const get = (path) => fetch(`${BASE}${path}`, { headers: headers() }).then(json);

const post = (path, body) =>
  fetch(`${BASE}${path}`, {
    method: "POST",
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  }).then(json);

export const api = {
  // Mensch-Frage prüfen; bei Erfolg Token speichern. Wirft bei falscher Antwort.
  gate: async (antwort) => {
    const r = await fetch(`${BASE}/api/gate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ antwort }),
    });
    if (!r.ok) throw new Error("GATE_WRONG");
    const { token } = await r.json();
    setToken(token);
    return token;
  },
  fragen: () => get("/api/fragen"),
  matching: (antworten) => post("/api/matching", antworten),
  angebote: (filter = {}) => {
    const params = new URLSearchParams(
      Object.entries(filter).filter(([, v]) => v)
    );
    return get(`/api/angebote?${params}`);
  },
  neuesAngebot: (angebot) => post("/api/angebote", angebot),
  login: (name, email) => post("/api/login", { name, email }),
  interesse: (angebotId, email) =>
    post("/api/interesse", { angebot_id: angebotId, email }),
  meineInteressen: (email) => get(`/api/interesse/${encodeURIComponent(email)}`),
  gruppeErstellen: () => post("/api/gruppen", {}),
  gruppeStatus: (code) => get(`/api/gruppen/${encodeURIComponent(code)}`),
  gruppeAntworten: (code, mitglied) =>
    post(`/api/gruppen/${encodeURIComponent(code)}/antworten`, mitglied),
  gruppeErgebnis: (code) =>
    get(`/api/gruppen/${encodeURIComponent(code)}/ergebnis`),
};
