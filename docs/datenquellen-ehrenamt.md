# Programmierbare Datenquellen für ein Ehrenamts‑Suchportal in Deutschland

## Executive Summary

Dieses Dokument identifiziert zentrale Datenquellen und Schnittstellen, die sich für ein Portal zum Auffinden von Möglichkeiten für soziales Engagement in Deutschland eignen, inklusive Optionen für remote/digitales Engagement.
Im Fokus stehen bestehende Engagement‑Plattformen, technische APIs von Infrastrukturanbietern (v. a. Freinet/Lachnit), Einbettungsoptionen großer Portale sowie Strategien für Scraping, wo keine offiziellen Schnittstellen existieren.

---

## 1. Zielbild für dein Portal

Ein zentrales Ehrenamts‑Portal für Deutschland sollte idealerweise:

- Angebote aus möglichst vielen regionalen Freiwilligenagenturen aggregieren.
- Überregionale und digitale/remote‑Engagements mit abdecken.
- Filter nach Thema, Zielgruppe, Ort, Zeitaufwand und Form (vor Ort vs. digital) anbieten.
- Möglichst auf offiziellen APIs oder Export‑Schnittstellen basieren, um Scraping zu minimieren.

Die folgenden Quellen und Schnittstellen lassen sich grob in drei Gruppen einteilen:

1. **Infrastrukturanbieter/Fachsoftware mit API** (Freinet/Lachnit‑Software).
2. **Große bundesweite Engagement‑Plattformen** (Aktion Mensch Engagement‑Plattform, Vostel, letsact u. a.).
3. **Regionale Engagementdatenbanken/Freiwilligenagenturen**, die per iframe/Portal oder notfalls Scraping integriert werden können.

---

## 2. Freinet / Lachnit‑Software als Kerninfrastruktur

### 2.1 Rolle von Freinet

Viele Freiwilligenagenturen in Deutschland nutzen die Fachsoftware „Freinet" bzw. Lösungen der Firma Lachnit‑Software zur Verwaltung und Veröffentlichung ihrer Engagementangebote. Freinet stellt dafür mehrere APIs bereit, über die Engagement‑Angebote, Kriterien und Metadaten programmgesteuert abgefragt werden können.

### 2.2 Angebot‑API und Portal‑API

Freinet beschreibt drei zentrale API‑Typen:

- **Import‑API**: zum Import von Daten (xml/json/cURL).
- **Angebot‑API**: zur Anzeige veröffentlichter Engagement‑Angebote einzelner Agenturen (xml‑RPC).
- **Portal‑API**: zur agenturübergreifenden Aggregation in gemeinsamen Portalen (xml‑RPC).

Die **Portal‑API** ist besonders relevant, weil sie die Datensätze eines gesamten Engagement‑Portals auslesen kann.

### 2.3 Technische Details zur Portal‑API

Endpunkte:

- `CriteriaServiceEndpoint` – Matching‑Kategorien und Kriterien (Zielgruppen, Handlungsfelder, Arbeitsweisen) → für Filter nutzbar.
- `MatchingServiceEndpoint` – Listenansichten der Angebote mit Filterparametern (PLZ, Umkreis, Kategorien, Suchbegriffe, Paging).
- `OfferServiceEndpoint` – Detailansichten einzelner Angebote.

Wichtige Parameter:

- `portalId` (int, required)
- `accessKey` (string, required)
- Optional `accessKeyInternal` für erweiterten Zugriff (nur für Partner).

Für Kooperationspartner gibt es tagesaktuelle **XML‑Exporte** mit Agenturen, Einrichtungen, Angeboten, Matching‑Kategorien und n:m‑Verknüpfungen.

### 2.4 Praktische Nutzung

1. Kontakt zu Freinet/Lachnit aufnehmen und Klärung des Kooperationspartner‑Zugangs.
2. Auswahl der gewünschten Portale (z. B. Engagement‑Plattform, regionale Portale).
3. Importer implementieren: XML‑Daten zyklisch abrufen, normalisieren, in eigene Datenstruktur überführen.

---

## 3. Engagement‑Plattform von Aktion Mensch / BAGFA

- Erste komplett barrierefreie Plattform für soziales Engagement in Deutschland.
- In Kooperation mit BAGFA; über 30.000 Engagementangebote — größte Plattform für Engagement und Ehrenamt in Deutschland.
- Deckt lokale und digitale/remote‑Engagements ab.

**Technische Einbindung:** Primär als Widget/iframe über **Integratoren‑Registrierung**. Technische Basis ist Freinet/Lachnit, daher ist die Freinet‑Portal‑API im Hintergrund relevant.

**Zugang zu Rohdaten:** Erfordert rechtliche/vertragliche Klärung mit Aktion Mensch oder direkte Kooperationspartnerschaft über Freinet.

---

## 4. Vostel.de

- Digitale Volunteering‑Plattform, Projekte aus ganz Deutschland, auch remote.
- Themen: Klima, Demokratie, Kinder/Jugend, Geflüchtete, Armutsbekämpfung, Zero Waste u. a.
- Zielgruppe: jüngere, digital affine Freiwillige.

**Schnittstellenlage:** Keine öffentlich dokumentierte API. Mögliche Wege: Partnerschaftsanfrage (JSON/CSV‑Feed), oder Scraping als Fallback (robots.txt und Nutzungsbedingungen beachten).

---

## 5. letsact

- Gemeinnützige Volunteering‑App, lokal und ortsunabhängig, CSR‑Komponente für Unternehmen.
- Keine öffentlich dokumentierte API.

**Mögliche Integration:** Kooperationsanfrage für JSON‑Export, oder Verlinkung auf gefilterte Projektseiten.

---

## 6. Regionale Engagementdatenbanken und Freiwilligenagenturen

Beispiele (viele Freinet‑basiert):

- Engagement‑Datenbank Hamburg
- Engagementdatenbank Trier
- Engagementdatenbank Bürgerinstitut Frankfurt
- Esslinger Engagement‑Datenbank (engagier‑dich.de)

**Anbindung:** Bei Freinet‑basierten Lösungen über Portal‑API; sonst iframe‑Einbettung oder Scraping mit Betreiberzustimmung.

BAGFA (Bundesarbeitsgemeinschaft der Freiwilligenagenturen) vertritt ca. 400 Mitglieds‑Agenturen — zentraler Ansprechpartner für koordinierte Datenpartnerschaft.

---

## 7. Überblickstabelle

| Quelle | Abdeckung | Programmatische Anbindung | Bemerkungen |
|--------|-----------|--------------------------|-------------|
| Freinet / Lachnit (Portal‑API, Kooperationspartner‑Export) | Deutschlandweit, viele Agenturen | XML‑RPC‑APIs, XML‑Exports mit Access‑Keys | Zentraler technischer Backbone |
| Engagement‑Plattform Aktion Mensch / BAGFA | Deutschlandweit, >30.000 Angebote, inkl. remote | Integrator‑Einbettung; indirekt via Freinet | Größte Plattform; Rohdaten brauchen Vereinbarung |
| Vostel.de | Deutschlandweit, auch remote | Keine öffentliche API; Partner‑Feed oder Scraping | Fokus digitale/junge Zielgruppen |
| letsact | Deutschlandweit, lokal & remote | Keine öffentliche API; Kooperation oder Verlinkung | Mobile‑App‑orientiert, CSR |
| Regionale Datenbanken | Kommunal/regional | Freinet‑API, iframe oder HTML‑Listen je nach System | Gute regionale Ergänzung |
| BAGFA‑Netzwerk | Meta für ~400 Agenturen | Indirekt über eingesetzte Systeme | Wichtiger Partner für koordinierte Datenzugänge |
| Freiwilligenarbeit.de | Internationale Projekte | Keine öffentliche API | Eher Auslands‑Ergänzung |

---

## 8. Technische Integrationsstrategien

### Priorisierung

1. **Freinet‑Portal‑API / Kooperationspartner‑Export** als erste Säule.
2. **Aktion Mensch** über Integratoren‑Einbindung oder direkten Freinet‑Zugriff.
3. **Weitere Partner** (Vostel, letsact) über individuelle Kooperationsvereinbarungen.

### Einheitliches Datenmodell

- `EngagementOffer` — Titel, Beschreibung, Organisation, Ort, Remote‑Flag, Einsatzzeiten, Voraussetzungen, Sprachen.
- `Organisation` — Name, Typ, Webseite, Kontakt.
- `Category`/`Tag` — Themenfelder, Zielgruppen, Tätigkeitsarten.

Matching‑Kategorien aus Freinet eignen sich als Ausgangspunkt für ein standardisiertes Kategoriensystem.

### Dubletten‑Strategie

Selbe Projekte können über mehrere Quellen erscheinen. Benötigt:
- Heuristiken aus Titel, Organisation, Ort, URL.
- Optional: Admin‑Interface für manuelle Zusammenführung.
- Priorisierungslogik für „führende" Quelle.

### Scraping

Nur als Notlösung für Nischenangebote ohne offizielle Schnittstelle:
- `robots.txt` und Nutzungsbedingungen prüfen.
- Schriftliche Erlaubnis einholen.
- Rate‑Limiting und regelmäßige Wartung einplanen.

---

## 9. Nächste Schritte (MVP)

1. **Anforderungsprofil**: Welche Engagement‑Arten (lokal, remote, Zielgruppen, Themen) müssen im MVP vertreten sein?
2. **Freinet/Lachnit kontaktieren**: Portal‑IDs und Konditionen für Kooperationspartner‑Export klären.
3. **Integratoren‑Registrierung bei Aktion Mensch**: Leitfaden zur Einbindung anfordern, tiefere Datenintegration prüfen.
4. **BAGFA kontaktieren**: Koordinierte Datenpartnerschaft mit dem Netzwerk der Freiwilligenagenturen ausloten.
5. **Partnerschaftsanfragen**: Vostel und letsact nach APIs/Exports fragen (Argument: zusätzliche Reichweite für ihre Projekte).
6. **Technisches MVP**: Freinet‑Portal‑API‑Import implementieren, normalisieren, Filtersuche + Basiskartenansicht aufbauen.
7. **Rechtliche Prüfung**: Datenschutz, Nutzungsrechte an Texten/Bildern, Markenrechte, Vergütungsmodelle klären.
