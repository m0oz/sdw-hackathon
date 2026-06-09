---
name: sdw-frontend
description: Build frontend UI in the sdw Alumni corporate identity (Studienförderwerk Klaus Murmann / sdw Alumni e.V.). Use whenever creating web pages, React components, or HTML for sdw / sdw Alumni — applies the brand colors (gold + teal on light), typography, logo, tone ("Netzwerk fürs Leben"), and German UI conventions.
---

# sdw Alumni Frontend / CI

Apply this whenever you build any user-facing web surface for **sdw Alumni e.V.**
(Studienförderwerk Klaus Murmann Alumni) or the **Stiftung der Deutschen Wirtschaft (sdw)**.
The goal: clean, trustworthy, warm — a professional network with a human, community feel.

The visual reference is the workshop deck `praesentation.html`. Everything below is
derived from it so any UI you build looks like it belongs to the same family: **light
backgrounds, gold as the single highlight, teal as the everyday accent.** Do **not**
use the old navy/orange scheme — it is wrong for this brand.

## Brand tokens

Drop these CSS variables at `:root` and build everything from them. Do **not** hard-code
random hex values elsewhere.

```css
:root{
  /* Primary accent — sdw gold (the logo triangle). The ONE highlight per view:
     primary CTA, hero bracket, list bullets, active states. Use sparingly. */
  --sdw-accent:   #f7c600;
  --sdw-accent-d: #c89a00;   /* darker gold — gold *text*/borders on light bg (gold #f7c600 is unreadable as text) */

  /* Secondary accents — teal is the everyday accent, used freely */
  --sdw-teal:     #5aa7bb;   /* petrol/türkis — section tints, table headers, card borders */
  --sdw-teal-d:   #357f97;   /* kickers, h3, links, teal text */
  --sdw-blue:     #1b7fa3;   /* logo blue — occasional cool accent / categorising */

  /* Neutrals */
  --sdw-ink:      #1d1d1b;   /* headings & body text (near-black, slightly warm) */
  --sdw-muted:    #5b6b73;   /* secondary text, captions */
  --sdw-line:     #e2e8ea;   /* borders / dividers */
  --sdw-paper:    #f6f9fa;   /* page background */
  --sdw-soft:     #eef5f7;   /* subtle fills, progress tracks */
  --sdw-white:    #ffffff;

  /* Status */
  --sdw-good:     #2e9e6b;
  --sdw-bad:      #c0392b;

  --sdw-radius:   16px;
  --sdw-shadow:   0 14px 40px rgba(20,40,50,.12);
  --sdw-shadow-sm:0 6px 22px rgba(20,40,50,.06);
  --sdw-font:     "Segoe UI","Helvetica Neue",Arial,system-ui,sans-serif;
}
```

> These match `praesentation.html` exactly. If the user supplies an official brand sheet,
> update the tokens here first — everything inherits from them.

## Logo

The logo is bundled with this skill and also lives at the repo root:

- **Bitmap (authoritative):** `assets/sdw-alumni-logo.png` (repo root) — also copied to
  this skill at `.claude/skills/sdw-frontend/assets/sdw-alumni-logo.png`.
- **Inline mark (favicon / fallback):** `.claude/skills/sdw-frontend/assets/sdw-mark.svg`
  — just the square+triangle icon, no wordmark.

It is the **teal square with a gold corner-triangle**, the lowercase **`sdw`** wordmark,
a thin **gold rule**, and **`Alumni`** beneath — in `--sdw-ink` dark grey.

**How to ship it in a prototype:** copy the PNG into the frontend's static dir so it is
served at a stable path:

```bash
mkdir -p frontend/public && cp assets/sdw-alumni-logo.png frontend/public/sdw-alumni-logo.png
```

Then reference `/sdw-alumni-logo.png`. Use the SVG mark for the favicon.

**Brand badge** — a fixed white rounded card, top-right, on every screen (like the deck):

```html
<div class="brand"><img class="logo" src="/sdw-alumni-logo.png" alt="sdw Alumni"></div>
```
```css
.brand{position:fixed;top:16px;right:24px;z-index:40;background:rgba(255,255,255,.96);
  padding:8px 14px;border-radius:12px;box-shadow:0 4px 16px rgba(20,40,50,.12);}
.logo{height:48px;width:auto;display:block;}
```

**Hero logo** — larger, inline above the headline (no white card):

```css
.logo-hero{height:110px;width:auto;display:block;margin-bottom:1.4rem;}
```

Logo rules: keep clear space around it, never recolour or stretch it, always place it on
a light surface (white or `--sdw-paper`), never on gold or teal.

## Visual rules

- **Backgrounds:** light. Content on `--sdw-white` or `--sdw-paper`. For hero / accent
  sections use a soft **teal tint**, *not* a dark fill:
  `linear-gradient(135deg,#eaf4f7,#f6f9fa)`. Text stays dark (`--sdw-ink`).
- **Headings:** `--sdw-ink`, weight 800, tightened letter-spacing (`-.4px`).
- **Kicker/eyebrow labels:** small uppercase, `letter-spacing:.2em`, `--sdw-teal-d`, weight 800.
- **Cards:** white, `--sdw-radius`, `1px solid --sdw-line`, soft shadow. Optional 5px top
  or left border in **teal** (default category), **gold** (highlight), or **blue** to categorise.
- **Buttons:** primary = solid **gold** with **dark ink** text (gold is a yellow — never
  white text on it); secondary = teal outline. One primary CTA per view.
- **Accent discipline:** gold `--sdw-accent` only for the single most important action or
  highlight per view (CTA, hero bracket, bullets). **Teal is the everyday accent** — nav,
  links, section tints, table headers, most card borders.
- **The gold bracket** is the signature hero device — see snippet below. Use it once, on
  the title/hero block.
- **Imagery/icons:** simple, friendly; emoji are acceptable for quick prototypes.
- **Spacing:** generous whitespace, max content width ~1100px, line-height ~1.5.

## Tone & language

- **All UI copy in German**, warm and inclusive. Use gender-inclusive notation where the
  brand does: *Stipendiat:innen, Alumni:innen*.
- Brand line: **"Netzwerk fürs Leben"**. Brand name written **"sdw Alumni"** (lowercase sdw).
- Friendly, encouraging, never corporate-cold. Short sentences.

## Quick component snippets

Kicker + heading:
```html
<span class="kicker">Engagement</span>
<h2>Gemeinsam etwas bewegen</h2>
```
```css
.kicker{display:inline-block;font-size:.8rem;letter-spacing:.2em;text-transform:uppercase;
  color:var(--sdw-teal-d);font-weight:800;margin-bottom:.7rem;}
h1,h2,h3{color:var(--sdw-ink);font-weight:800;letter-spacing:-.4px;}
h3{color:var(--sdw-teal-d);font-size:1.18rem;}
```

Gold bracket hero motif (place the logo + kicker + h1 inside it):
```html
<div class="bracket">
  <img class="logo-hero" src="/sdw-alumni-logo.png" alt="sdw Alumni">
  <span class="kicker">Netzwerk fürs Leben</span>
  <h1>Gemeinsam etwas bewegen</h1>
</div>
```
```css
.bracket{position:relative;display:inline-block;padding:1.4rem 0 0 1.6rem;}
.bracket::before{content:"";position:absolute;left:0;top:0;width:64px;height:64px;
  border-left:6px solid var(--sdw-accent);border-top:6px solid var(--sdw-accent);}
```

Primary CTA + secondary:
```css
.btn{background:var(--sdw-accent);color:var(--sdw-ink);border:none;border-radius:999px;
  padding:.8rem 1.6rem;font-weight:800;cursor:pointer;box-shadow:var(--sdw-shadow);}
.btn:hover{background:var(--sdw-accent-d);color:#fff;}
.btn.secondary{background:transparent;color:var(--sdw-teal-d);
  border:2px solid var(--sdw-teal);box-shadow:none;}
```

Bullet list with gold squares:
```css
ul.clean{list-style:none;display:flex;flex-direction:column;gap:.85rem;}
ul.clean li{display:flex;gap:.8rem;align-items:flex-start;}
ul.clean li::before{content:"";flex:0 0 auto;width:.7rem;height:.7rem;margin-top:.45rem;
  border-radius:2px;background:var(--sdw-accent);}
```

Card (with optional category border) + pill:
```css
.card{background:#fff;border:1px solid var(--sdw-line);border-radius:var(--sdw-radius);
  padding:1.4rem 1.6rem;box-shadow:var(--sdw-shadow-sm);}
.card.teal{border-top:5px solid var(--sdw-teal);}
.card.gold{border-top:5px solid var(--sdw-accent);}
.pill{display:inline-block;background:var(--sdw-accent);color:var(--sdw-ink);
  font-weight:800;font-size:.82rem;padding:.34rem .85rem;border-radius:999px;}
```

Teal-tinted hero / section + table header:
```css
.tint{background:linear-gradient(135deg,#eaf4f7,#f6f9fa);}
thead th{background:var(--sdw-teal);color:#fff;font-weight:800;}
```

## Checklist before finishing

- [ ] All colors come from `:root` tokens, no stray hex.
- [ ] Light backgrounds; hero uses the teal tint (`--sdw-teal` family), never a dark fill.
- [ ] Headings ink/800, kickers teal-d/uppercase.
- [ ] **Gold used only** for the primary CTA / hero bracket / bullets — teal is the everyday accent.
- [ ] CTA is gold with **dark ink text** (not white on gold).
- [ ] sdw Alumni logo present (brand badge top-right and/or hero), on a light surface, copied to `frontend/public/`.
- [ ] All copy in German, inclusive, "Netzwerk fürs Leben" tone.
- [ ] Responsive (mobile-first, content max-width ~1100px), `lang="de"` on `<html>`.
