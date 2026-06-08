---
name: sdw-frontend
description: Build frontend UI in the sdw Alumni corporate identity (Studienförderwerk Klaus Murmann / sdw Alumni e.V.). Use whenever creating web pages, React components, or HTML for sdw / sdw Alumni — applies the brand colors, typography, tone ("Netzwerk fürs Leben"), and German UI conventions.
---

# sdw Alumni Frontend / CI

Apply this whenever you build any user-facing web surface for **sdw Alumni e.V.**
(Studienförderwerk Klaus Murmann Alumni) or the **Stiftung der Deutschen Wirtschaft (sdw)**.
The goal: clean, trustworthy, warm — a professional network with a human, community feel.

## Brand tokens

Drop these CSS variables at `:root` and build everything from them. Do **not** hard-code
random hex values elsewhere.

```css
:root{
  /* Primary */
  --sdw-navy:   #003c64;  /* Petrolblau — headings, header, primary surfaces */
  --sdw-blue:   #0a6ebd;  /* secondary blue — links, secondary buttons */
  --sdw-teal:   #1aa0a6;  /* petrol/türkis accent — kickers, highlights, bullets */
  --sdw-accent: #f08a24;  /* warm orange — CTAs, "engagement" energy, sparingly */

  /* Neutrals */
  --sdw-ink:    #0e2233;  /* body text */
  --sdw-muted:  #5b7488;  /* secondary text */
  --sdw-line:   #d7e3ec;  /* borders / dividers */
  --sdw-paper:  #f4f8fb;  /* page background */
  --sdw-white:  #ffffff;

  --sdw-radius: 16px;
  --sdw-shadow: 0 8px 28px rgba(0,40,70,.08);
  --sdw-font: "Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif;
}
```

> Note: exact official hex values were not machine-readable from the live (JS-rendered,
> scrape-blocked) site. These are the working sdw palette. If the user provides the
> brand sheet, update the tokens above first — everything inherits from them.

## Visual rules

- **Backgrounds:** light `--sdw-paper` or white for content; deep `--sdw-navy` gradient
  (`linear-gradient(135deg,#003c64,#01314f)`) for hero / accent sections (white text on it).
- **Headings:** `--sdw-navy`, weight 800, slightly tightened letter-spacing (`-.4px`).
- **Kicker/eyebrow labels:** small uppercase, `letter-spacing:.18em`, `--sdw-teal`, bold.
- **Cards:** white, `--sdw-radius`, `1px solid --sdw-line`, `--sdw-shadow`. Optional 5px
  top or left border in teal/accent/navy to categorize.
- **Buttons:** primary = solid `--sdw-navy` (or `--sdw-accent` for the main CTA), white text,
  pill or `12px` radius; secondary = outline in `--sdw-blue`.
- **Accent discipline:** orange `--sdw-accent` only for the single most important action or
  "engagement" highlight per view. Teal is the everyday accent.
- **Imagery/icons:** simple, friendly; emoji are acceptable for quick prototypes.
- **Spacing:** generous whitespace, max content width ~1100px, line-height ~1.55.

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
.kicker{font-size:.85rem;letter-spacing:.18em;text-transform:uppercase;color:var(--sdw-teal);font-weight:700;}
h2{color:var(--sdw-navy);font-weight:800;letter-spacing:-.4px;}
```

Primary CTA:
```css
.btn{background:var(--sdw-accent);color:#fff;border:none;border-radius:999px;
  padding:.8rem 1.6rem;font-weight:700;cursor:pointer;}
.btn.secondary{background:transparent;color:var(--sdw-blue);border:2px solid var(--sdw-blue);}
```

## Checklist before finishing

- [ ] All colors come from `:root` tokens, no stray hex.
- [ ] Headings navy/800, kickers teal/uppercase.
- [ ] Orange used only for the primary CTA / key highlight.
- [ ] All copy in German, inclusive, "Netzwerk fürs Leben" tone.
- [ ] Responsive (mobile-first, content max-width ~1100px).
- [ ] `lang="de"` on `<html>`.
