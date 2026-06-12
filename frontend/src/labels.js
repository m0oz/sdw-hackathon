export const THEMEN = {
  bildung: "Bildung & Mentoring",
  soziales: "Soziales",
  integration: "Integration",
  umwelt: "Umwelt & Klima",
  kultur: "Kultur & Sport",
  digitales: "Digitales & Pro bono",
  gesundheit: "Gesundheit",
};

export const FORMATE = {
  vor_ort: "Vor Ort",
  remote: "Remote",
  hybrid: "Vor Ort & remote",
};

export const ZEITEN = {
  einmalig: "Einmalig",
  flexibel: "Flexibel",
  regelmaessig: "Regelmäßig",
};

export const TAETIGKEITEN = {
  menschen: "Mit Menschen",
  fachlich: "Fachwissen",
  praktisch: "Praktisch",
};

// Artwork je Thema (frontend/public/themes/*.svg)
export function angebotBild(angebot) {
  if (angebot.bild) return angebot.bild;
  const thema = (angebot.themen || [])[0];
  const bekannt = ["bildung", "soziales", "integration", "umwelt", "kultur", "digitales", "gesundheit"];
  return `/themes/${bekannt.includes(thema) ? thema : "default"}.svg`;
}

export const ZIELGRUPPEN = {
  kinder: "Kinder",
  jugendliche: "Jugendliche",
  erwachsene: "Erwachsene",
  senioren: "Senior:innen",
};
