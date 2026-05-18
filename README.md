# ostensible-paradox

A bilingual Hugo blog with a Cloudflare Access-gated private room (`/us/`) and a password-protected content area (`/private/`). Static public content, dynamic private content — separate places, separate rules.

## Architecture

```
                   Cloudflare Pages
                        │
         ┌──────────────┼──────────────┐
         ▼              ▼              ▼
    Hugo static     Pages Functions   D1 (SQLite)
    public site     /us/api/*          room_entries
    (/zh/, /en/)    │                 room_rate_limits
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
    Access JWT verification   R2 (images)
```

| Layer | Public | Private (`/us/`) |
|---|---|---|
| **Edge** | Cloudflare Pages serves static HTML | Cloudflare Access gates all `/us/*` routes |
| **Static shell** | Hugo builds blog from `content/` | Hugo builds room UI shell from `layouts/us/` |
| **API** | None | Pages Functions validate Access JWT, read/write D1 & R2 |
| **Persistence** | Git-tracked Markdown | D1 + R2 — never committed |

**Key design choices:**
- D1 at the edge avoids cross-datacenter latency and separate connection pools.
- JWT verification is belt-and-suspenders: Cloudflare Access validates at the network edge; Pages Functions re-validate independently before any data operation.
- Private user-generated content (room posts, images) never enters git. The static shell stays static; content is fetched client-side from `/us/api/*`.
- A separate cookie-based password middleware (`functions/_middleware.js`) guards `/private/` paths for lower-friction access without requiring a full identity provider.

## Project Structure

```text
.
├── content/
│   ├── Chinese/          # Chinese public content
│   ├── English/          # English public content
│   └── us/               # Static entry point for the protected area
├── layouts/              # Hugo template overrides
│   └── _default/         # ⬇️ see Agent Notes below
├── assets/
│   ├── css/extended/     # custom.css (theme), us.css (Win98 room UI)
│   └── js/us-room.js     # Zero-dependency SPA client for the private room
├── static/               # Static files: _headers, _redirects, images/
├── scripts/              # paper-to-blog.sh — academic paper → Hugo branch bundles
├── functions/            # Pages Functions route handlers
├── src/                  # Shared API implementation (JWT, CRUD, markdown, rate limiting)
├── migrations/           # Cloudflare D1 SQL migrations
├── hugo.toml             # Hugo configuration (bilingual, search, PaperMod params)
├── wrangler.jsonc        # Cloudflare Pages Functions, D1, and R2 bindings
└── themes/PaperMod/      # PaperMod theme (git submodule)
```

## Quick Start

```bash
hugo server -D                # local preview at http://localhost:1313
hugo --minify                 # production build
npx wrangler pages dev public # full-stack local dev with Pages Functions + D1
```

Site: <https://ostensibleparadox-github-io.pages.dev/>

## Usage

**Adding public posts:** Create Markdown under `content/Chinese/posts/` or `content/English/posts/` with TOML front matter (`date`, `draft`, `title`).

`categories` must match one of the four menu categories:
- **Chinese:** 学术论文 / 思路与探索 / 个人日志 / 艺术创想
- **English:** Academic Papers / Explorative Thoughts / My Daily Logs / Arts & Creative

**Academic papers:** Use `scripts/paper-to-blog.sh` to convert `.tex` or `.md` papers into Hugo branch bundles with numbered chapters and bilingual navigation. See [scripts/paper-to-blog-README.md](scripts/paper-to-blog-README.md).

**Search:** Client-side Fuse.js search at `/zh/search/` and `/en/search/`.

## Stack

- **Static site:** Hugo + PaperMod theme
- **Hosting:** Cloudflare Pages
- **Dynamic API:** Cloudflare Pages Functions (zero npm dependencies)
- **Database:** Cloudflare D1 (SQLite at edge)
- **Image storage:** Cloudflare R2
- **Auth:** Cloudflare Access JWT + cookie-based password middleware
- **Search:** Fuse.js client-side

## Boundaries

What stays out of this repository:
- D1-stored room entries and rate-limit state
- R2-stored user-uploaded images
- Build artifacts (`public/`, `.wrangler/`)

## Agent Notes

> Things future agents should know to avoid repeating mistakes.

### Hugo Taxonomy: PaperMod + Hugo 0.73+ Compatibility

**Problem:** PaperMod's `layouts/taxonomy.html` only handles the *taxonomy list* page (e.g., `/categories/`). It lacks `layouts/_default/term.html`, which Hugo 0.73+ uses for *individual term* pages (e.g., `/categories/explorative-thoughts/`). When Hugo falls back to `layouts/list.html`, the template uses `union .RegularPages .Sections` — but on term pages this evaluates to empty, producing category pages that show only the title and breadcrumbs with **no posts listed**.

**Fix:** The repo already contains `layouts/_default/term.html` (copied from `list.html` with `{{- $pages := .Pages }}` instead of `{{- $pages := union .RegularPages .Sections }}`). **Do not delete this file.** If you ever update the PaperMod submodule, verify that term pages still render correctly.

### Content Organization

- `content/Chinese/posts/` and `content/English/posts/` are mounted as separate language content roots via `hugo.toml` `module.mounts`.
- `content/us/` is a special section gated by Cloudflare Access. Its `_index.md` uses `cascade` to hide all child pages from search, RSS, and sitemap.
- `us` archetype (`archetypes/us.md`) disables share buttons, reading time, word count, and TOC for private pages.

### Git Workflow

- `main` branch auto-deploys to Cloudflare Pages.
- Do not commit build artifacts (`public/`, `.wrangler/`).
- Do not commit `node_modules/` or other dependency directories.
