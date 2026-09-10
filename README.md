# Synwyr Website

Public product site for **Synwyr MCP by Kodaxa**.

Synwyr is the public brand for a local-first, operation-first 3D agent control and verification architecture. The active engineering implementation currently lives in [`Kodaxadev/RoboVision`](https://github.com/Kodaxadev/RoboVision); this repository intentionally contains only the public website.

## Design direction

The visual system is derived from the Synwyr perception mark: near-black spatial depth, ice/cyan spectral highlights, precise geometric lines, luminous state indicators, and restrained metallic typography. The product story is built around three ideas:

**PERCEPTION → ACTION → PROOF**

The site avoids unsupported autonomy claims. Current engineering status is expressed in terms of the acceptance-gate architecture used by the RoboVision codebase.

## Local preview

No build step or dependency install is required.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Structure

- `index.html` — complete responsive product page
- `styles.css` — brand system, responsive layout, motion, component styling
- `app.js` — ambient spatial field, closed-loop interaction, reveal motion, mobile navigation
- `assets/synwyr-mark.svg` — scalable Synwyr perception mark
- `assets/synwyr-social.svg` — social/OG artwork
- `assets/favicon.svg` — SVG favicon
- `vercel.json` — static hosting headers

## Engineering source

The website links directly to the implementation and living architecture documents in [`Kodaxadev/RoboVision`](https://github.com/Kodaxadev/RoboVision).
