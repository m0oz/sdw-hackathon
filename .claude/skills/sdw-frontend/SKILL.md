---
name: sdw-frontend
description: Build frontend UI in the sdw Alumni corporate identity (Studienförderwerk Klaus Murmann / sdw Alumni e.V.). Use whenever creating web pages, React components, or HTML for sdw / sdw Alumni — applies the brand colors (gold + teal on light), typography, logo, tone ("Netzwerk fürs Leben"), and German UI conventions.
---

# sdw Alumni Frontend / CI

Apply to any web UI for **sdw Alumni e.V.** / **Stiftung der Deutschen Wirtschaft (sdw)**.
Goal: clean, trustworthy, warm. Visual reference is `praesentation.html`: **light
backgrounds, gold as the single highlight, teal as the everyday accent.** Never the old
navy/orange scheme.

## Brand tokens

Put these at `:root`, build everything from them, never hard-code other hex values. These
match `praesentation.html` exactly; if the user supplies an official brand sheet, update
them here first.

```css
:root{
  --sdw-accent:   #f7c600;   /* sdw gold — the ONE highlight per view (CTA, hero bracket, bullets). Sparingly. */
  --sdw-accent-d: #c89a00;   /* darker gold for gold *text*/borders on light bg (#f7c600 unreadable as text) */
  --sdw-teal:     #5aa7bb;   /* everyday accent — section tints, table headers, card borders */
  --sdw-teal-d:   #357f97;   /* kickers, h3, links, teal text */
  --sdw-blue:     #1b7fa3;   /* logo blue — occasional cool accent */
  --sdw-ink:      #1d1d1b;   /* headings & body */
  --sdw-muted:    #5b6b73;   /* secondary text */
  --sdw-line:     #e2e8ea;   /* borders */
  --sdw-paper:    #f6f9fa;   /* page bg */
  --sdw-soft:     #eef5f7;   /* subtle fills */
  --sdw-white:    #ffffff;
  --sdw-good:     #2e9e6b;
  --sdw-bad:      #c0392b;
  --sdw-radius:   16px;
  --sdw-shadow:   0 14px 40px rgba(20,40,50,.12);
  --sdw-shadow-sm:0 6px 22px rgba(20,40,50,.06);
  --sdw-font:     "Segoe UI","Helvetica Neue",Arial,system-ui,sans-serif;
}
```

## Logo

Teal square + gold corner-triangle, lowercase `sdw` wordmark, gold rule, `Alumni` beneath.
Bundled at `assets/sdw-alumni-logo.png` (also at repo root); `assets/sdw-mark.svg` is the
icon-only favicon. Copy into the frontend so it serves at a stable path, then reference
`/sdw-alumni-logo.png`:

```bash
mkdir -p frontend/public && cp assets/sdw-alumni-logo.png frontend/public/sdw-alumni-logo.png
```

Never recolour/stretch it; keep clear space; only on a light surface (never on gold/teal).
Brand badge = fixed white rounded card, top-right, on every screen (like the deck).

```html
<div class="brand"><img class="logo" src="/sdw-alumni-logo.png" alt="sdw Alumni"></div>
```
```css
.brand{position:fixed;top:16px;right:24px;z-index:40;background:rgba(255,255,255,.96);
  padding:8px 14px;border-radius:12px;box-shadow:0 4px 16px rgba(20,40,50,.12);}
.logo{height:48px;width:auto;display:block;}
.logo-hero{height:110px;width:auto;display:block;margin-bottom:1.4rem;} /* inline above headline, no card */
```

## Rules

- **Backgrounds light.** Content on white/`--sdw-paper`; hero uses a soft teal tint
  `linear-gradient(135deg,#eaf4f7,#f6f9fa)`, never a dark fill. Text stays `--sdw-ink`.
- **Headings:** `--sdw-ink`, weight 800, `letter-spacing:-.4px`. **Kickers:** small
  uppercase, `letter-spacing:.2em`, `--sdw-teal-d`, 800.
- **Accent discipline:** gold only for the single most important action/highlight per view
  (CTA, hero bracket, bullets). Teal is everyday (nav, links, tints, headers, card borders).
- **Buttons:** primary = solid gold with **dark ink text** (never white on gold);
  secondary = teal outline. One primary CTA per view.
- **Cards:** white, `--sdw-radius`, `1px solid --sdw-line`, soft shadow; optional 5px teal
  (default) / gold (highlight) / blue top border.
- **Spacing:** generous, content max-width ~1100px, line-height ~1.5, mobile-first.

## Tone & language

All UI copy in **German**, warm, inclusive (*Stipendiat:innen, Alumni:innen*), short
sentences, never corporate-cold. Brand line **"Netzwerk fürs Leben"**; name written
**"sdw Alumni"** (lowercase sdw). Set `lang="de"` on `<html>`.

## Snippets

```css
.kicker{display:inline-block;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--sdw-teal-d);font-weight:800;margin-bottom:.7rem;}
h1,h2,h3{color:var(--sdw-ink);font-weight:800;letter-spacing:-.4px;}
h3{color:var(--sdw-teal-d);font-size:1.18rem;}

/* Signature gold bracket — use once, on the hero block */
.bracket{position:relative;display:inline-block;padding:1.4rem 0 0 1.6rem;}
.bracket::before{content:"";position:absolute;left:0;top:0;width:64px;height:64px;
  border-left:6px solid var(--sdw-accent);border-top:6px solid var(--sdw-accent);}

.btn{background:var(--sdw-accent);color:var(--sdw-ink);border:none;border-radius:999px;
  padding:.8rem 1.6rem;font-weight:800;cursor:pointer;box-shadow:var(--sdw-shadow);}
.btn:hover{background:var(--sdw-accent-d);color:#fff;}
.btn.secondary{background:transparent;color:var(--sdw-teal-d);
  border:2px solid var(--sdw-teal);box-shadow:none;}

ul.clean{list-style:none;display:flex;flex-direction:column;gap:.85rem;}
ul.clean li{display:flex;gap:.8rem;align-items:flex-start;}
ul.clean li::before{content:"";flex:0 0 auto;width:.7rem;height:.7rem;margin-top:.45rem;
  border-radius:2px;background:var(--sdw-accent);}

.card{background:#fff;border:1px solid var(--sdw-line);border-radius:var(--sdw-radius);
  padding:1.4rem 1.6rem;box-shadow:var(--sdw-shadow-sm);}
.card.teal{border-top:5px solid var(--sdw-teal);}
.card.gold{border-top:5px solid var(--sdw-accent);}
.pill{display:inline-block;background:var(--sdw-accent);color:var(--sdw-ink);
  font-weight:800;font-size:.82rem;padding:.34rem .85rem;border-radius:999px;}

.tint{background:linear-gradient(135deg,#eaf4f7,#f6f9fa);}
thead th{background:var(--sdw-teal);color:#fff;font-weight:800;}
```

```html
<div class="bracket">
  <img class="logo-hero" src="/sdw-alumni-logo.png" alt="sdw Alumni">
  <span class="kicker">Netzwerk fürs Leben</span>
  <h1>Gemeinsam etwas bewegen</h1>
</div>
```
