# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic website for Jean-Baptiste Saulnier — a single-page static site (HTML + CSS + vanilla JS).

## Development

Open locally in a browser:
```
open index.html
```

No build step, no dependencies, no package manager. Just edit and reload.

## Architecture

- `index.html` — single-page structure with sections: hero, about, research, publications, contact
- `style.css` — all styles with CSS custom properties in `:root` for light theme and `[data-theme="dark"]` for dark theme
- `script.js` — scroll fade-in animations (IntersectionObserver), dark mode toggle (persisted in localStorage), animated background canvas (subtle cell network pattern)
- Fonts loaded from Google Fonts (Inter + Playfair Display)
- Responsive design with a 640px mobile breakpoint

## Theming

- Light/dark mode controlled by `data-theme` attribute on `<html>`
- All colors use CSS custom properties — update `:root` and `[data-theme="dark"]` blocks to change palette
- Background canvas colors also read from CSS variables (`--color-canvas-dot`, `--color-canvas-line`)

## Content conventions

- Scientific names (species) are always italicized with `<em>` tags
- Research cards have `.tag` labels for quick visual scanning (e.g. "Biophysics", "Modeling")
- Publications list uses semantic `<ol>` with CSS counter styling
- Photo placeholder exists; replace with `<img src="photo.jpg">` when available
- CV download button points to `cv.pdf` in the root directory
- ORCID: 0009-0009-3099-2307
- Google Scholar link needs real user ID (currently placeholder)
