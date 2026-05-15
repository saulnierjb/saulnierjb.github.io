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

## CV auto-sync

`cv.pdf` is **not** edited here directly — it is auto-pushed from the `saulnierjb/cv_git` repo whenever its source LaTeX is recompiled. The sync uses a GitHub Actions workflow in `cv_git` authenticated via an SSH deploy key registered on this repo (Settings → Deploy keys, "cv_git auto-update"). See `cv_git/CLAUDE.md` for the full setup and troubleshooting steps.

## Conferences section

The `#conferences` section combines two layouts:

- **Featured cards** (`.conf-card`) for conferences with attached materials. Each card has a `#qmicrobio-<year>`-style anchor for QR-code deep-linking, optional role badges (`Talk` / `Poster`), and a `.conf-materials` row of buttons linking to files under `assets/conferences/<slug>/`.
- **Compact list** (`.conf-list` / `.conf-list-item`) below, for past conferences without materials.

When adding posters or videos:
- Drop files under `assets/conferences/<slug>/` (e.g. `poster.pdf`, `data-video.mp4`).
- For QR codes printed on physical posters, encode `https://saulnierjb.github.io/#<slug>`.
- Compress posters with ghostscript. `-dPDFSETTINGS=/ebook` is aggressive and **has dropped vector plots in the past** — prefer `/printer` (typically 10–15 MB, all figures intact). Verify visually before committing.
- Re-encode large videos with `ffmpeg -i in -vf scale=720:720 -c:v libx264 -b:v 2400k -movflags +faststart -pass 1/2 out.mp4` to target <5 MB.

**Do not write `<p>` descriptions on `.conf-card` blocks.** Each card is just header + `<h3>` + `.conf-materials`. The same conference often hosts different content for talk vs poster (e.g. Q-Microbio 2026: talk on Myxo, poster on *B. subtilis*), so any single description ends up wrong. Ask before inventing one.

## ⚠️ GitHub Pages: strip executable bit on binary assets

**Critical gotcha.** When binary assets (PDFs, videos, images) are copied from external filesystems like `/Volumes/jb_ssd256gb/`, they often inherit mode `0755` (executable). Git tracks them as `100755` and **GitHub Pages then silently fails to deploy the commit** — the workflow either hangs in `queued` indefinitely or returns `startup_failure` with no useful log message. This wasted ~24 h on 2026-05-15 with `reference-video.mp4`.

After copying any binary asset:

```bash
chmod 644 <file>
git update-index --chmod=-x <file>
```

To audit existing tracked files for stray executable modes:

```bash
git ls-files -s | grep -v '^100644' | grep -v '^120000'
```

If a Pages deploy is stuck `queued` or fails with `startup_failure` and no useful log, the first thing to check is `git ls-files -s` on the suspicious commit for unexpected `100755` modes on non-script files.
