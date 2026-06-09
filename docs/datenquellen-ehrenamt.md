# Programmierbare Datenquellen für ein Ehrenamts‑Suchportal in Deutschland

## Executive Summary

Dieses Dokument identifiziert die zentralen Datenquellen und Schnittstellen für ein Portal, das Möglichkeiten für soziales Engagement in Deutschland auffindbar macht – lokal **und** digital/remote. Es bündelt bestehende Engagement‑Plattformen, technische APIs von Infrastrukturanbietern (v. a. Freinet/Lachnit), Aggregatoren, Einbettungsoptionen großer Portale, Freiwilligendienste, Wohlfahrtsverbände, Bildungs-/Mentoring‑Initiativen sowie Strategien für Scraping, wo keine offiziellen Schnittstellen existieren.

**Kernaussagen:**

- **Freinet/Lachnit** ist der technische Backbone vieler Freiwilligenagenturen und liefert über die **Portal‑API** agenturübergreifende Daten – erste Säule jeder Integration.
- **Voltastics** aggregiert bereits **> 18.000 Angebote** aus vier großen Plattformen (vostel, GoVolunteer, youvo, betterplace) – ein Vertrag kann mehrere Quellen auf einmal erschließen.
- **betterplace.org** bietet eine **sofort nutzbare öffentliche REST‑API** (v. a. Organisations-/Projektdaten).
- Für die **sdw‑Alumni‑Zielgruppe** zählt *Passung* mehr als Breite: ein kuratierter **Bildungs-/Mentoring‑Kern** (Anker: das sdw‑eigene **Studienkompass**‑Programm) ist wertvoller als möglichst viele generische Angebote.

---

## 1. Zielbild für das Portal

Ein Ehrenamts‑Portal sollte idealerweise:

- Angebote aus möglichst vielen regionalen Freiwilligenagenturen aggregieren.
- Überregionale und digitale/remote‑Engagements mit abdecken.
- Filter nach Thema, Zielgruppe, Ort, Zeitaufwand und Form (vor Ort vs. digital) anbieten.
- Möglichst auf offiziellen APIs oder Export‑Schnittstellen basieren, um Scraping zu minimieren.

Die Quellenlandschaft lässt sich in **sieben** Gruppen einteilen, die die Gliederung dieses Dokuments bilden:

1. **Infrastrukturanbieter/Fachsoftware mit API** – Freinet/Lachnit (Abschnitt 2).
2. **Aggregatoren / Meta‑Quellen** – Voltastics, Mitwirk‑O‑Mat (Abschnitt 3).
3. **Große bundesweite Engagement‑Plattformen** – Aktion Mensch, GoVolunteer, betterplace, vostel, letsact u. a. (Abschnitt 4).
4. **Skills‑based / Pro‑Bono** – youvo, The Good Ones, Pro Bono Allianz (Abschnitt 5).
5. **Freiwilligendienste** – ein‑jahr‑freiwillig, weltwärts (Abschnitt 6).
6. **Wohlfahrtsverbände** – Caritas, Diakonie, DRK, AWO u. a. (Abschnitt 7).
7. **Bildung & Mentoring** sowie **regionale Datenbanken** (Abschnitte 8–9).

---

## 2. Freinet / Lachnit‑Software als Kerninfrastruktur

### 2.1 Rolle von Freinet

Viele Freiwilligenagenturen nutzen die Fachsoftware „Freinet" bzw. Lösungen der Firma Lachnit‑Software zur Verwaltung und Veröffentlichung ihrer Engagementangebote. Freinet stellt mehrere APIs bereit, über die Angebote, Kriterien und Metadaten programmgesteuert abgefragt werden können. Da auch die **Engagement‑Plattform von Aktion Mensch**, der **Mitwirk‑O‑Mat** und viele regionale Datenbanken auf Freinet basieren, ist es die wichtigste einzelne Quelle.

### 2.2 API‑Typen

- **Import‑API**: zum Import von Daten (xml/json/cURL).
- **Angebot‑API**: zur Anzeige veröffentlichter Angebote einzelner Agenturen (xml‑RPC).
- **Portal‑API**: zur agenturübergreifenden Aggregation in gemeinsamen Portalen (xml‑RPC) – **besonders relevant**, weil sie die Datensätze eines gesamten Engagement‑Portals auslesen kann.

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

1. Kontakt zu Freinet/Lachnit aufnehmen und Kooperationspartner‑Zugang klären.
2. Gewünschte Portale auswählen (z. B. Engagement‑Plattform, regionale Portale).
3. Importer implementieren: XML‑Daten zyklisch abrufen, normalisieren, in die eigene Datenstruktur überführen.

---

## 3. Aggregatoren / Meta‑Quellen — die effizienteste Abkürzung

- **Voltastics** (`voltastics.com`, Such‑App `app.voltastics.com`) — durchsucht **portalübergreifend > 18.000 Engagementangebote** aus **vostel, GoVolunteer, youvo und betterplace** in einer Oberfläche. Damit potenziell ein **einzelner Integrationspunkt** für vier große Plattformen. Keine öffentlich dokumentierte API → Kooperations-/Datenfeed‑Anfrage. **Hohe Priorität für Erstkontakt.**
- **Mitwirk‑O‑Mat** (`mitwirk-o-mat.de`) — „Wahl‑O‑Mat fürs Ehrenamt": spielerisches Matching, bietet **iframe‑Einbettung** und eine **Schnittstelle zur Freinet‑Datenbank** (bestätigt Freinet als Backbone, vgl. Abschnitt 2). Guter niedrigschwelliger und regionaler Baustein.

---

## 4. Große bundesweite Engagement‑Plattformen

### 4.1 Engagement‑Plattform von Aktion Mensch / BAGFA

- Erste komplett barrierefreie Plattform für soziales Engagement in Deutschland, in Kooperation mit **BAGFA**.
- **> 30.000 Angebote** (über 160 Freiwilligenagenturen als Netzwerkpartner) — größte Plattform Deutschlands; deckt lokale und digitale Engagements ab.
- **Technische Einbindung:** primär als Widget/iframe über **Integratoren‑Registrierung**; technische Basis ist Freinet/Lachnit, daher die Freinet‑Portal‑API im Hintergrund relevant.
- **Rohdaten:** erfordern vertragliche Klärung mit Aktion Mensch oder direkte Kooperationspartnerschaft über Freinet.

### 4.2 GoVolunteer

- Eine der größten Communities für soziales Engagement, **lokal und digital**, Filter nach Thema/Zeitaufwand/Format.
- Keine öffentliche API → Partnerschafts-/Feed‑Anfrage (auch via Voltastics aggregiert).

### 4.3 betterplace.org

- Deutschlands größte Spendenplattform. **Öffentliche REST‑API V4** (JSON, unauthentifiziert; Doku: `github.com/betterplace/betterplace_apidocs`, `api-docs.betterplace.org`).
- Liefert v. a. **Spendenprojekte und Organisationen**, nicht primär Ehrenamts-„Schichten" – trotzdem wertvoll für **Organisations-/Projektdaten** und als Initiativen‑Verzeichnis. Bei aggressivem Polling Throttling möglich; Client‑API (mehr Features) nur mit Vertrag.

### 4.4 vostel.de

- Digitale Volunteering‑Plattform, Projekte aus ganz Deutschland, auch remote. Themen: Klima, Demokratie, Kinder/Jugend, Geflüchtete, Armutsbekämpfung, Zero Waste. Zielgruppe: jüngere, digital affine Freiwillige. Betreibt zusätzlich einen **Corporate‑Volunteering**‑Bereich (vgl. Abschnitt 5).
- Keine öffentliche API → Partnerschaftsanfrage (JSON/CSV‑Feed) oder Scraping als Fallback (robots.txt/Nutzungsbedingungen beachten).

### 4.5 letsact

- Gemeinnützige Volunteering‑App, lokal und ortsunabhängig, CSR‑Komponente für Unternehmen. Keine öffentliche API → Kooperationsanfrage für JSON‑Export oder Verlinkung auf gefilterte Projektseiten.

### 4.6 Weitere überregionale Plattformen

- **FlexHero** (`flexhero.de`) — Fokus **flexibles & ortsunabhängiges** Engagement; bereits **160+ Kommunen und 400+ Organisationen** (stark in Hessen/Sachsen‑Anhalt), app‑basiert.
- **Stiftung Gute‑Tat** (`gute-tat.de`) — Vermittlung v. a. Berlin/Hamburg/München, ausgeprägter Corporate‑Volunteering‑Zweig.
- **SOPS** (`sops.de`) — Community‑Plattform mit „Socialpoints", lokaler Fokus.
- **VoluMap** (`volumap.de`) — kommunal, datenschutzbetont (u. a. Bielefeld, Gütersloh, Bad Honnef).
- **The Impact Department** (`theimpactdept.com`) — internationales „doing‑good"‑Netzwerk, > 900.000 Matches.

---

## 5. Skills‑based / Pro‑Bono — passt zu Alumni mit Fachexpertise

- **youvo.org** — kreatives **Kompetenz‑Engagement** (Design, PR, Text, Medien), online; von Voltastics aggregiert.
- **The Good Ones** (`thegoodones.io`) — Skills‑based Volunteering (Marketing, IT, Design, Recht) für NGOs.
- **Pro Bono Allianz Deutschland** (`pro-bono-allianz.de`) — Netzwerk für Pro‑bono‑Leistungen.
- **vostel.de / Corporate Volunteering** — eigener CV-/Pro‑bono‑Bereich.

> Für sdw‑Alumni besonders anschlussfähig: Mentoring, Bewerbungstrainings, Rechtsberatung, IT/Design für gemeinnützige Projekte.

---

## 6. Freiwilligendienste — strukturierte Langzeit‑Engagements

- **ein‑jahr‑freiwillig.de** — evangelische Freiwilligenbörse, **> 20.000 Stellen** für FSJ, BFD, FÖJ, weltwärts, IJFD, ESK u. a.; betrieben i. A. der EKD. Große, strukturierte Quelle (Inland + Ausland).
- **weltwärts** (`weltwaerts.de`) — entwicklungspolitischer Freiwilligendienst des BMZ.
- **freiwilligenarbeit.de**, **freiwillig‑freiwillig.de** — v. a. Auslands-/Langzeitdienste.

> Keine offenen APIs gefunden → Verlinkung auf gefilterte Listen oder Kooperationsanfrage.

---

## 7. Wohlfahrtsverbände — die größten Ehrenamts‑Pools

Die **sechs Spitzenverbände der Freien Wohlfahrtspflege** (Dachverband **BAGFW**, `bagfw.de`) binden zusammen **mehrere Hunderttausend bis Millionen** Ehrenamtliche und betreiben jeweils eigene Engagement‑Portale:

- **Caritas** (DCV), **Diakonie** (~700.000 Freiwillige), **DRK** (~450.000 Ehrenamtliche), **AWO**, **Der Paritätische**, **ZWST**.
- Zusätzlich **Johanniter** und **Malteser** (auch **digitales Ehrenamt**).

**Anbindung:** verbandseigene Datenbanken, teils Freinet‑basiert, teils eigene Systeme → pro Verband prüfen (API/Export/iframe). BAGFW als koordinierender Erstkontakt (analog zu BAGFA).

---

## 8. Bildung & Mentoring — höchste Relevanz für die sdw‑Zielgruppe

- **Studienkompass** (`sdw.org` → Studienkompass) — **sdw‑eigenes** Programm: Mentoring für junge Menschen aus nicht‑akademischen Familien, 3‑jährige Begleitung; > 870 ehrenamtliche Mentor:innen. **Naheliegendster, glaubwürdigster Partner für ein sdw‑Alumni‑Portal.**
- **Balu und Du** (`balu-und-du.de`) — bundesweites Mentoring für Grundschulkinder; Studierende engagieren sich als „Balus" (Uni Osnabrück / Caritas Köln).
- **JOBLINGE** (`joblinge.de`) — Berufseinstieg für benachteiligte Jugendliche.
- **Teach First Deutschland** (`teachfirst.de`) — Fellows an Brennpunktschulen.
- **ArbeiterKind.de**, **ROCK YOUR LIFE!** — bundesweite Mentoring‑Netzwerke (bereits in den Seed‑Daten genutzt).
- **Eleven** (`eleven.ngo`, u. a. „mentoring‑in‑nrw"), **Chancenwerk** sowie weitere Stipendien-/Bildungsfonds‑Initiativen.
- **Meta‑Quelle:** „**Kompass Bildungsförderung**" erfasst **~130 bundesweite Bildungsinitiativen** (> 1 Mio. erreichte Schüler:innen) — ideales Verzeichnis als kuratierte Ausgangsliste für die Bildungsnische.

---

## 9. Regionale Engagementdatenbanken und Freiwilligenagenturen

Beispiele (viele Freinet‑basiert):

- Engagement‑Datenbank Hamburg, Engagementdatenbank Trier, Engagementdatenbank Bürgerinstitut Frankfurt, Esslinger Engagement‑Datenbank (engagier‑dich.de).
- **Ehrenamtssuche Hessen** (`ehrenamtssuche-hessen.de`), **Frankfurt.de Ehrenamtssuche**, **Ehrenamtsportal Bayern** (`ehrenamt.bayern.de`).

**Anbindung:** bei Freinet‑basierten Lösungen über die Portal‑API (Abschnitt 2); sonst iframe‑Einbettung oder Scraping mit Betreiberzustimmung.

**BAGFA** (Bundesarbeitsgemeinschaft der Freiwilligenagenturen) vertritt ca. **400 Mitglieds‑Agenturen** — zentraler Ansprechpartner für eine koordinierte Datenpartnerschaft.

---

## 10. Gesamt‑Überblickstabelle

| Quelle | Typ | Abdeckung | Programmatische Anbindung |
|---|---|---|---|
| Freinet / Lachnit (Portal‑API) | Infrastruktur | Deutschlandweit, viele Agenturen | XML‑RPC‑APIs + XML‑Exporte (Access‑Keys) — **Backbone** |
| Voltastics | Aggregator | > 18.000 Angebote (4 Plattformen) | Kooperation/Feed (keine offene API) |
| Mitwirk‑O‑Mat | Matching/regional | kommunal | iframe + **Freinet‑Schnittstelle** |
| Aktion Mensch / BAGFA | Plattform | Deutschlandweit, > 30.000, inkl. remote | Integrator‑Einbettung; indirekt via Freinet |
| GoVolunteer | Plattform | bundesweit, lokal + digital | Partner‑Feed |
| betterplace.org | Spenden/Projekte | bundesweit | **Öffentliche REST‑API V4 (JSON)** |
| vostel.de | Plattform | bundesweit, auch remote | Partner‑Feed oder Scraping |
| letsact | App | bundesweit, lokal & remote | Kooperation/Verlinkung |
| FlexHero | Plattform | regional stark (Hessen u. a.) | Kooperation/App |
| Gute‑Tat / SOPS / VoluMap | Plattform | lokal/kommunal | Kooperation/iframe |
| youvo / The Good Ones | Skills‑based | DACH, online | via Voltastics / Kooperation |
| ein‑jahr‑freiwillig.de | Freiwilligendienste | Inland + Ausland, > 20.000 Stellen | Verlinkung/Kooperation |
| Wohlfahrtsverbände (BAGFW) | Verbände | bundesweit, Mio. Engagierte | verbandseigene Systeme/Freinet |
| Studienkompass / Balu und Du / JOBLINGE / Teach First | Bildung/Mentoring | bundesweit | manuell kuratiert (Partner) |
| Kompass Bildungsförderung | Verzeichnis | ~130 Bildungsinitiativen | Startliste für Kuratierung |
| Regionale DBs / BAGFA‑Netzwerk | regional | kommunal/Land | Freinet‑API, iframe oder HTML je System |

---

## 11. Technische Integrationsstrategien

### 11.1 Einheitliches Datenmodell

- `EngagementOffer` — Titel, Beschreibung, Organisation, Ort, Remote‑Flag, Einsatzzeiten, Voraussetzungen, Sprachen.
- `Organisation` — Name, Typ, Webseite, Kontakt.
- `Category`/`Tag` — Themenfelder, Zielgruppen, Tätigkeitsarten.

Die Matching‑Kategorien aus Freinet eignen sich als Ausgangspunkt für ein standardisiertes Kategoriensystem.

### 11.2 Dubletten‑Strategie

Dasselbe Projekt kann über mehrere Quellen erscheinen (z. B. ein vostel‑Angebot direkt **und** via Voltastics). Benötigt:

- Heuristiken aus Titel, Organisation, Ort, URL.
- Optional: Admin‑Interface für manuelle Zusammenführung.
- Priorisierungslogik für die „führende" Quelle.

### 11.3 Scraping

Nur als Notlösung für Nischenangebote ohne offizielle Schnittstelle:

- `robots.txt` und Nutzungsbedingungen prüfen.
- Schriftliche Erlaubnis einholen.
- Rate‑Limiting und regelmäßige Wartung einplanen.

---

## 12. Priorisierung

1. **Freinet‑Portal‑API** (Backbone) — erschließt Aktion Mensch + viele regionale DBs **und** Mitwirk‑O‑Mat‑Daten.
2. **Voltastics** als Aggregator — *ein* Vertrag → vostel + GoVolunteer + youvo + betterplace.
3. **betterplace Public API** — sofort nutzbar für Organisations-/Projektdaten (ohne Vertrag, Throttling beachten).
4. **Bildungs-/Mentoring‑Initiativen** (Studienkompass, Balu und Du, JOBLINGE, Teach First, ArbeiterKind, ROCK YOUR LIFE!) — für die sdw‑Zielgruppe **manuell kuratiert**; klein, aber maximal anschlussfähig („Kompass Bildungsförderung" als Startliste).
5. **Freiwilligendienste** (ein‑jahr‑freiwillig) und **Wohlfahrtsverbände** (BAGFW) — große Pools, mittelfristig per Kooperation/Verlinkung.

---

## 13. Empfehlung fürs sdw‑Alumni‑Portal

Für die **Alumni‑Zielgruppe** zählt *Passung* mehr als *Breite*:

- **Kuratierter Bildungs-/Mentoring‑Kern** (Abschnitt 8), beginnend mit **Studienkompass** als sdw‑eigenem Anker — wenige, aber hochrelevante Partner, manuell gepflegt.
- **Automatische Breite** über **Voltastics** (ein Integrationspunkt) und die **Freinet‑Portal‑API** (regional + Aktion Mensch).
- **Skills‑based‑Angebote** (youvo, The Good Ones, Pro‑bono) gezielt herausstellen — passt zu Alumni mit Berufserfahrung.

---

## 14. Nächste Schritte (MVP)

1. **Anforderungsprofil**: Welche Engagement‑Arten (lokal, remote, Zielgruppen, Themen) müssen im MVP vertreten sein?
2. **Freinet/Lachnit kontaktieren**: Portal‑IDs und Konditionen für den Kooperationspartner‑Export klären.
3. **Voltastics anfragen**: Datenfeed-/Kooperationsbedingungen prüfen (erschließt vier Plattformen auf einmal).
4. **betterplace Public API testen**: ohne Vertrag sofort Organisations-/Projektdaten anbinden.
5. **Bildungs-/Mentoring‑Kern kuratieren**: mit Studienkompass starten, „Kompass Bildungsförderung" als Liste nutzen.
6. **Integratoren‑Registrierung bei Aktion Mensch** und **BAGFA/BAGFW** für koordinierte Datenpartnerschaften anstoßen.
7. **Technisches MVP**: Import normalisieren, Dubletten zusammenführen, Filtersuche + Kartenansicht aufbauen.
8. **Rechtliche Prüfung**: Datenschutz, Nutzungsrechte an Texten/Bildern, Markenrechte, Vergütungsmodelle klären.

---

## Quellen

- Deutsche Stiftung für Engagement und Ehrenamt — Übersicht digitale Engagement‑Plattformen: https://www.deutsche-stiftung-engagement-und-ehrenamt.de/aktuelles/digitale-engagement-plattformen/
- BAGFA Engagement‑Plattform: https://bagfa.de/projekte/engagement-plattform/
- Voltastics: https://voltastics.com/ · App: https://app.voltastics.com/search
- GoVolunteer: https://www.govolunteer.com/ · https://de.wikipedia.org/wiki/GoVolunteer
- betterplace API‑Doku: https://github.com/betterplace/betterplace_apidocs
- FlexHero: https://flexhero.de/
- Mitwirk‑O‑Mat (Freinet‑Schnittstelle, iframe): https://mitwirk-o-mat.de/freiwilligenagenturen-ehrenamt-digitalisierung/
- Stiftung Gute‑Tat: https://www.gute-tat.de/
- The Good Ones: https://thegoodones.io/ · youvo: https://www.youvo.org/
- Pro Bono Allianz Deutschland: https://www.pro-bono-allianz.de/
- ein‑jahr‑freiwillig.de: https://www.ein-jahr-freiwillig.de/ · weltwärts: https://www.weltwaerts.de/
- BAGFW (Spitzenverbände): https://www.bagfw.de/ueber-uns/mitgliedsverbaende
- Johanniter — digitales Ehrenamt: https://acht.johanniter.de/ehrenamt/digitales-ehrenamt-beispiele-vorteile-von-online-freiwilligenarbeit/
- Studienkompass (sdw): https://www.sdw.org/schuelerinnen-und-schueler/studienkompass/
- Balu und Du: https://www.uni-osnabrueck.de/en/studying/acquire-key-skills/balu-und-du-mentoring-for-primary-school-pupils
- Kompass Bildungsförderung: https://www.news4teachers.de/2025/10/kompass-bildungsfoerderung-wie-schulen-gemeinnuetzige-partner-finden-koennen/
- Ehrenamtssuche Hessen: https://www.ehrenamtssuche-hessen.de/ · Ehrenamtsportal Bayern: https://ehrenamt.bayern.de/
- helpteers Plattform‑Sammlung: https://helpteers.net/plattformen/
