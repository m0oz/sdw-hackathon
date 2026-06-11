---
name: stock-image
description: Find free stock photos via the Pexels API for use in prototypes, presentations, or any sdw UI, using the PEXELS_API_KEY from the repo's .env. Use when the user needs a hero image, placeholder photo, background, or any real-looking imagery for a web UI or slide — instead of grey placeholder boxes or made-up URLs.
---

# Stock images via Pexels

Search [Pexels](https://www.pexels.com) for free, production-ready stock photos and use the
returned URLs directly in HTML/React (hotlinking is allowed) — or download them locally for
offline use (e.g. in `praesentation.html`).

## Credentials

The API key is stored in the repo's **`.env`** as `PEXELS_API_KEY` and is
**gitignored — never commit it or print it in full**. Always read it from the environment;
never hard-code it into commands you save or into files.

Load it for the current shell:

```bash
set -a && source .env && set +a   # exports PEXELS_API_KEY
```

If the key is missing from `.env`, ask the user to add it (`PEXELS_API_KEY=...`) — don't
guess or invent one.

## Searching

```bash
set -a && source .env && set +a
curl -s -H "Authorization: $PEXELS_API_KEY" \
  "https://api.pexels.com/v1/search?query=QUERY&per_page=9&orientation=landscape" \
  | python3 -c '
import json,sys
for i, p in enumerate(json.load(sys.stdin).get("photos", []), 1):
    print(f"{i}. {p.get(\"alt\") or \"(no description)\"}")
    print(f"   URL: {p[\"src\"][\"large\"]}")
    print(f"   Photo: {p[\"photographer\"]} on Pexels")
'
```

Notes:

- `query` must be URL-encoded (spaces → `%20` or `+`).
- `orientation` can be `landscape`, `portrait`, or `square` — pick what fits the layout
  (landscape for heroes/banners, portrait for cards, square for avatars/tiles).
- Useful `src` sizes: `large` (≈940px, good default), `large2x` (retina), `medium`,
  `original` (full resolution, large file).
- Free tier: 200 requests/hour — plenty for a hackathon; don't loop requests.

## Best practices

- **Always search in English**, regardless of the conversation language — translate keywords
  first (e.g. „Stipendiat:innen beim Netzwerken" → `students networking event`).
- Be specific and descriptive: `mentoring conversation office` beats `people`.
- Fetch several results and pick the one that best matches theme, mood, and the sdw CI
  (light, warm imagery works best on the light gold/teal palette — see `sdw-frontend`).
- Use the returned URL directly as `src` / `background-image`. For offline-ready artifacts
  (like the presentation), download instead:

  ```bash
  curl -sL -o assets/hero.jpg "IMAGE_URL"
  ```

- **Attribution:** not legally required by the Pexels license, but appreciated — when easy,
  credit as „Foto: NAME / Pexels" in a caption or footer.

## Guardrails

- **Never echo the full API key** in command output, logs, or committed files. Source it
  from `.env` and reference `$PEXELS_API_KEY`.
- Pexels photos may show identifiable people — fine for demos, but don't imply they are
  real sdw members/Stipendiat:innen in copy.
- If a search returns nothing, retry with broader or different English terms before giving
  up; as a last resort fall back to a CSS gradient placeholder in the sdw palette.
