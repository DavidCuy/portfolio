# Handoff: David Cuy Portfolio Redesign

A redesign of [davidcuy.github.io](https://davidcuy.github.io/) — a personal portfolio for a Cloud Architect & Software Engineer based in Mérida, MX. The redesign follows the **Cloud + Coffee** design system and adds a tweakable mood/density/texture system on top.

---

## ⚠️ About the Design Files

The HTML/JSX/CSS files in this bundle are **design references**, not production code to drop into your repo. They are React-via-Babel prototypes loaded from CDN, intended to communicate intended look, behavior, and structure.

Your task is to **recreate this design in your existing codebase** using its established patterns. The current `davidcuy.github.io` repo appears to be a static site — you choose the right structure (plain HTML/CSS, Astro, Nuxt, Next.js, etc.) for the production version. Use this prototype as the visual & behavioral spec.

---

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy, and interactions. Recreate pixel-perfect.

---

## Architecture Overview

Single-page app with **5 screens** + a **Tweaks panel** for live design exploration.

### File map

| File | Role |
|---|---|
| `David Cuy Portfolio.html` | Entry point — boots React, mounts `<App>`, hosts the Tweaks panel and edit-mode protocol |
| `assets/colors_and_type.css` | **Design tokens** — colors, type, spacing, radii, shadows, motion. Treat as the source of truth |
| `styles.css` | Layout + component styles + mood/density/texture variants |
| `components.jsx` | Shared primitives: `<Button>`, `<Badge>`, `I` (icon set, Lucide-style stroke 1.75) |
| `Nav.jsx` | Top nav (sticky pill) + footer |
| `Home.jsx` | `<HomePage>` + sub-sections: Hero, About, Experience, Skills, Testimonials, LatestPosts, CTA |
| `Pages.jsx` | `<ProjectsPage>`, `<ServicesPage>`, `<AboutPage>`, `<BlogPage>` + `<PostCard>` + `LATEST_POSTS` data |

### Screen routing (in-memory, persisted to localStorage)

`home` · `projects` · `services` · `about` · `blog` — handled by a `useState` in `<App>`. For production, use real routes (`/`, `/projects`, `/services`, `/about`, `/blog`).

---

## Screens

### 1. Home (`HomePage`)

**Sections, top to bottom:**
1. **Hero** — Eyebrow chip ("Available for new projects · Q3 2026"), 3-line H1 with one italic emphasis word in coffee accent, lede paragraph, two CTAs (primary "Let's work together" → services, ghost "See projects" → projects), meta row (location, response time, ES/EN). Right side: circular avatar (mascot cat coding), two floating badges (AWS Solutions Architect, 10+ years).
2. **Tech strip** — Marquee-style row of tech keywords (AWS, Lambda, EventBridge, Pulumi, Terraform, etc.). Static for now; in prod, animate horizontally if desired.
3. **About** — Two-column section: bio prose left, signature callout right ("In theory… / In practice… / What worked was…").
4. **Experience timeline** — Vertical list of 4 roles with year, role, company, city, summary. Hover effect: top-border progress fill.
5. **Skills** — Tabbed grid (Cloud & DevOps, Backend, Frontend, Data & AI). Cards with icon + title + bullet list.
6. **Testimonials** — 2-column grid of quote cards.
7. **Latest posts** — 3 most recent posts.
8. **CTA band** — Full-width navy/sky band with closing CTA.

### 2. Projects (`ProjectsPage`)
Filter chips (All / Architecture / Serverless / Data / Observability) + grid of project cards. Each card has an SVG cover, category badge, title, description, tech tags.

### 3. Services (`ServicesPage`)
Three service tiers (Architecture Review / Fractional Tech Lead / New System Design). Middle card is `featured` (dark navy background). Each: price, what's included (checklist), CTA. Followed by a 4-step "Process" section.

### 4. About (`AboutPage`)
Long-form bio. Includes the signature "In theory… In practice… What worked was…" pattern as a styled blockquote. Photo, sidebar with quick facts.

### 5. Blog (`BlogPage`)
Category filter chips + featured post (large) + grid of 5 more posts. Posts categorized by `architecture` / `serverless` / `decisions` / `legacy`.

---

## Bilingual (ES / EN)

Every user-facing string is rendered conditionally on `lang` prop (`'ES'` or `'EN'`). Pattern:
```jsx
{lang === 'ES' ? 'Trabajemos juntos' : "Let's work together"}
```
Toggle lives in the nav. Persisted to `localStorage` (`dc.lang`). For production, use a proper i18n library (e.g., `vue-i18n`, `next-intl`, `i18next`).

---

## Theming

### Light / Dark
Controlled via `data-theme="dark"` on `<html>`. Tokens in `assets/colors_and_type.css` flip automatically. Persisted as `dc.theme`.

### Mood (4 personalities)
Controlled via `data-mood` on `<html>`. Defined in `styles.css` under `/* MOOD VARIANTS */`. **Mood is the most expressive control — it swaps fonts, colors, radii, and surface treatment as a single move.**

| Mood | Personality |
|---|---|
| `pragmatic` (default) | Syne display, navy + sky, current site |
| `warm` | Coffee-forward, pill buttons, circular avatar, soft palette |
| `editorial` | Playfair Display italic, magazine voice, sharp corners |
| `terminal` | JetBrains Mono everywhere, scanlines, dashed borders, `$` and `>` glyph prefixes |

### Density
`data-density` on `<html>`: `roomy` / `standard` (default) / `tight`. Reshapes section padding, hero scale, line-heights, gap density.

### Texture
`data-texture` on `<html>`: `clean` (default) / `grid` / `noise` / `dots`. Adds an ambient `.tx-layer` (fixed full-viewport `<div>`) with masked falloff.

**For production:** the Tweaks panel itself is a prototype affordance — you may want to omit it entirely and just ship one chosen mood/density/texture combo. Or expose only theme (light/dark) to end users.

---

## Design Tokens

All values come from `assets/colors_and_type.css`. **Read that file as the source of truth.** Highlights:

### Colors (light theme, semantic)
```
--bg: #FAF8F5         /* page background, soft cream */
--surface: #FFFFFF
--surface-alt: #F4EEE5
--fg-strong: #0E1B2C  /* navy 900 */
--fg: #1B3A6B         /* navy 700 */
--fg-muted: #4F5E73
--border: #E5DED2
--sky-400: #4FB3D4    /* primary accent */
--sky-500: #2C95BB
--coffee-600: #AD7759 /* warm accent / italic emphasis */
--coffee-700: #935E42
--success: #5C8B5C
```

### Typography
- `--font-display: 'Syne', sans-serif` — H1, H2 (variable, 600–800)
- `--font-body: 'Inter', sans-serif` — body, UI
- `--font-mono: 'JetBrains Mono', ui-monospace` — eyebrows, badges, year labels

### Scale (excerpt)
- H1 hero: `clamp(40px, 6vw, 72px)` / line-height 1.05 / letter-spacing -0.03em
- H2: `clamp(28px, 3.5vw, 44px)`
- Body: 16px / 1.7

### Radii
`--radius-md: 10px` · `--radius-lg: 14px` · `--radius-xl: 20px` · `--radius-2xl: 28px` · `--radius-full: 999px`

### Shadows
`--shadow-xs / sm / md / lg / xl` — soft, low-spread (see CSS file)

### Motion
- `--dur-fast: 120ms` / `--dur-base: 200ms` / `--dur-slow: 360ms`
- `--ease-standard: cubic-bezier(0.2, 0, 0, 1)`
- `--ease-emphasized: cubic-bezier(0.2, 0, 0, 1.15)`

---

## Components to Recreate

### `<Button variant size icon iconAfter>`
Variants: `primary` (sky filled), `secondary` (navy filled), `ghost` (transparent + border). Sizes: default, `sm`, `lg`. Optional leading/trailing icon.

### `<Badge category>`
Pill with colored dot + label. `category` ∈ `architecture | serverless | decisions | legacy`. Each category has a distinct dot color.

### Icon set `I.*`
Custom Lucide-style strokes (24×24 viewBox, stroke 1.75, currentColor). Available: `arrow`, `arrowUpRight`, `mail`, `calendar`, `sun`, `moon`, `pin`, `dot`, `github`, `linkedin`, `rss`, `cloud`, `code`, `db`, `brain`, `zap`, `server`, `box`, `git`, `eye`, `menu`, `settings`. **In production, use [lucide-react](https://lucide.dev/) or equivalent — all icons here are Lucide-equivalent shapes.**

### Cards
- `.skill-card` — icon box + title + bullet list. Top-border accent fills on hover.
- `.proj-card` — SVG cover wrap + body. Cover has a category-tinted gradient.
- `.pc` (post card) — eyebrow row (category badge + reading time) + title + excerpt + meta row.
- `.svc-card` — service tier card. `.svc-card.featured` swaps to navy background.
- `.tmnl` — testimonial card. Quote + name/role.

### `.cta-band`
Full-width band with navy/sky gradient, decorative top-right radial glow, headline + 2 buttons.

---

## Interactions & Behavior

- **Nav**: sticky, gains shadow & background on scroll > 20px. Active link has a 24px sky underline pill.
- **Lang toggle**: segmented `EN / ES` in nav.
- **Theme toggle**: sun/moon icon in nav.
- **Hero cursor**: blinking caret after H1 (CSS animation).
- **Tech strip**: horizontal overflow, no scrollbar (mask-image for fade edges).
- **Skill tabs**: filters skill cards by category.
- **Project filter chips**: filter by `kind`.
- **Post category chips**: filter blog posts.
- **All cards hover**: subtle lift (`translateY(-2px)`) + border darkens.
- **Page transition**: simple fade-in on screen change (`page-enter` class).
- **Reduced motion**: all animations disabled via `@media (prefers-reduced-motion: reduce)`.

---

## State Management

```
screen: 'home' | 'projects' | 'services' | 'about' | 'blog'   → router in production
lang:   'ES' | 'EN'                                            → i18n locale
theme:  'light' | 'dark'                                       → next-themes / localStorage
mood:   'pragmatic' | 'warm' | 'editorial' | 'terminal'        → optional, can be omitted in prod
density: 'roomy' | 'standard' | 'tight'                        → optional
texture: 'clean' | 'grid' | 'noise' | 'dots'                   → optional
```

All persisted to `localStorage` with `dc.` prefix in the prototype.

---

## Assets to Bring Into Your Repo

From `assets/`:

| File | Used for |
|---|---|
| `colors_and_type.css` | Design tokens (primary source of truth) |
| `Syne-Variable.ttf` | Display font (or load from Google Fonts) |
| `mascot-coder.webp` | Hero avatar (cat-barista-coder illustration) |
| `logo-iso.jpg` | Favicon / nav logo |
| `logo-full.jpeg` | Footer / about page |

Plus from Google Fonts (already declared in CSS or HTML):
- **Syne** (Variable, weights 600–800) — display
- **Inter** — body
- **JetBrains Mono** — mono
- *Optional* **Playfair Display** — only if you keep the `editorial` mood

---

## Recommended Migration Path

If your current repo is plain static HTML on GitHub Pages:

1. **Adopt the design tokens first** — copy `colors_and_type.css` into your repo and start using the CSS custom properties everywhere. This alone modernizes the look.
2. **Migrate page-by-page**, starting with Home. Each `*.jsx` file in this bundle maps cleanly to one HTML page or component.
3. **Pick a framework if you want interactivity** — Astro is ideal here (static-first, islands for the few interactive bits like nav scroll, language toggle, filter chips). Next.js or Nuxt also work if you want SSR.
4. **Drop the mood/density/texture system** unless you specifically want a "playground" feature. Ship one chosen combination.
5. **Real i18n** — replace inline `lang === 'ES' ? … : …` ternaries with a proper i18n library.
6. **Real router** — replace the `useState`-based screen switcher with file-based routes.
7. **Real CMS for blog** — the blog posts in `LATEST_POSTS` (Pages.jsx) are hardcoded. Move to MDX, a headless CMS, or DEV.to API.

---

## Tweaks Panel (prototype-only feature)

The in-page Tweaks panel that lets you cycle Mood/Density/Texture/Theme is a **prototype affordance** for design exploration. It is not intended for production. It uses a postMessage protocol with the host preview environment. **Strip it out when implementing.**

---

## Files Included

```
design_handoff_dc_portfolio/
├── README.md                   ← this file
├── David Cuy Portfolio.html    ← entry point
├── Home.jsx                    ← home page sections
├── Nav.jsx                     ← nav + footer
├── Pages.jsx                   ← projects/services/about/blog
├── components.jsx              ← Button, Badge, icons
├── styles.css                  ← layout + mood variants
└── assets/
    ├── colors_and_type.css     ← DESIGN TOKENS — read first
    ├── Syne-Variable.ttf
    ├── mascot-coder.webp
    ├── logo-iso.jpg
    └── logo-full.jpeg
```

---

## Suggested Claude Code Prompt

> I have a static GitHub Pages site at `davidcuy.github.io` and a redesign in `design_handoff_dc_portfolio/`. Read the README first. Then:
>
> 1. Propose a target stack (I'm open to plain HTML/CSS, Astro, or Next.js).
> 2. Adopt `assets/colors_and_type.css` as my design token source of truth.
> 3. Migrate Home page first, matching the prototype pixel-for-pixel. Don't include the Tweaks panel or the mood/density/texture variants — ship the default `pragmatic` mood only.
> 4. Use real routes for the other 4 pages.
> 5. Use a proper i18n library for ES/EN.
>
> The prototype uses React-via-Babel — recreate semantics, not the loading mechanism.
