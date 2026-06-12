// Fotografiert die EhrenMoin-User-Journey für die Pitch-Präsentation.
// Aufruf: node screenshots.mjs   (Backend muss auf :8000 laufen, dist gebaut)
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = "http://localhost:8000";
const OUT = "../pitch-assets";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const shot = (name) => page.screenshot({ path: `${OUT}/${name}.png` });

// --- 1. Login ---------------------------------------------------------------
await page.goto(BASE);
await page.waitForLoadState("networkidle");
await page.fill("#name", "Mia Beispiel");
await page.fill("#email", "mia@sdw-alumni.de");
await shot("01-login");
await page.click('button:has-text("Mit sdw-Login starten")');

// --- 2. Quiz ----------------------------------------------------------------
await page.waitForSelector(".option");
await page.click('.option:has-text("Bildung & Mentoring")');
await page.click('.option:has-text("Digitales & Pro bono")');
await shot("02-quiz");
await page.click('button:has-text("Weiter")');
await page.click('.option:has-text("Direkt mit Menschen")');
await page.click('button:has-text("Weiter")');
await page.click('.option:has-text("Regelmäßig mit festem Termin")');
await page.click('button:has-text("Weiter")');
await page.click('.option:has-text("Vor Ort in Hamburg")');
await page.click('button:has-text("Weiter")');
await page.click('.option:has-text("Jugendliche & junge Erwachsene")');
await page.click('button:has-text("Meine 4 Vorschläge zeigen")');

// --- 3. Ergebnis (4 Vorschläge) ----------------------------------------------
await page.waitForSelector(".angebot-card");
await shot("03-ergebnis");
await page.click('.angebot-card >> nth=0 >> button:has-text("Merken")');

// --- 4. Alle Angebote mit Filter ---------------------------------------------
await page.click('nav button:has-text("Alle Angebote")');
await page.waitForSelector(".angebot-card");
await shot("04-angebote");

// --- 5. Eintragen-Formular ----------------------------------------------------
await page.click('nav button:has-text("Eintragen")');
await page.fill('input[placeholder="z. B. Nachhilfe für Geflüchtete"]', "Ruderclub sucht Trainings-Buddys");
await shot("05-eintragen");

// --- 6./7. Gruppen-Matching ----------------------------------------------------
// Gruppe per API vorbefüllen, dann via UI beitreten (wie echte Nutzer:innen)
const g = await (await fetch(`${BASE}/api/gruppen`, { method: "POST" })).json();
const antworten = [
  { name: "Anna", themen: ["bildung"], taetigkeit: "menschen", zeit: "regelmaessig", format: "vor_ort", zielgruppe: "kinder" },
  { name: "Ben", themen: ["umwelt", "soziales"], taetigkeit: "praktisch", zeit: "einmalig", format: "vor_ort", zielgruppe: "egal" },
  { name: "Cem", themen: ["soziales", "bildung"], taetigkeit: "egal", zeit: "flexibel", format: "egal", zielgruppe: "egal" },
];
for (const a of antworten) {
  await fetch(`${BASE}/api/gruppen/${g.code}/antworten`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(a),
  });
}
await page.click('nav button:has-text("Gruppen-Matching")');
await page.fill('input[placeholder="z. B. KWZX"]', g.code);
await page.click('button:has-text("Beitreten")');
await page.waitForSelector(".code-badge");
await shot("06-gruppe-lobby");
await page.click('button:has-text("Unsere 2 Vorschläge")');
await page.waitForSelector(".angebot-card");
await shot("07-gruppe-ergebnis");

// --- 8. Merkliste ---------------------------------------------------------------
await page.click('nav button:has-text("Merkliste")');
await page.waitForSelector(".angebot-card");
await shot("08-merkliste");

await browser.close();
console.log("Screenshots fertig in", OUT, "| Gruppe:", g.code);
