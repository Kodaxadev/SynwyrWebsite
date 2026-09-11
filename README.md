# Synwyr Website

Public product site for **Synwyr MCP by Kodaxa**.

Synwyr is the public brand for the spatial control plane currently being developed in [`Kodaxadev/RoboVision`](https://github.com/Kodaxadev/RoboVision). The engineering repository will eventually adopt the Synwyr name; this repository is the public-facing product site.

## Product direction

The website is intentionally written around the **end-state product**, not the present implementation checkpoint.

Synwyr is being designed as a local-first reasoning, authoring, verification, and recovery layer between capable AI models and professional 3D tools. The goal is to let an agent operate through a closed loop:

**PERCEIVE → REASON → AUTHOR → VERIFY → CORRECT → DELIVER**

The long-term system is broader than a Blender automation bridge or an MCP wrapper. MCP is one adapter into a model-agnostic control plane built around:

- authoritative scene and asset state;
- stable object identity, revisions, coordinate contracts, and provenance;
- semantic and visual perception in the same reasoning loop;
- typed, editor-native 3D operations instead of giant generated scripts;
- deterministic geometry, spatial, reference, pattern, coverage, and locality truth;
- transactional authoring with verified commit or rollback;
- cross-host support for Blender, Unity, and future DCC / engine integrations;
- reusable skills distilled from successful and failed correction trajectories;
- external generators treated as candidate sources while Synwyr remains the execution and verification layer.

The product promise is not "AI can call Blender." It is that a capable reasoning model can inspect a live 3D world, make bounded changes, measure what actually happened, recover safely from bad hypotheses, and keep iterating toward production-quality work.

## Design direction

The visual system is derived from the Synwyr perception mark: near-black spatial depth, ice/cyan spectral highlights, precise geometric lines, luminous state indicators, and restrained metallic typography.

The product story centers on three public ideas:

**PERCEPTION → AUTHORING → PROOF**

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

Until the implementation repository is renamed, the website links directly to [`Kodaxadev/RoboVision`](https://github.com/Kodaxadev/RoboVision).
