The repository is a Nuxt 4 portfolio site forked from the Nuxt UI "portfolio" template. These instructions highlight project structure, conventions, developer workflows and integration points to help AI coding agents be immediately productive.

High-level architecture
- Framework: Nuxt 4 (server-side rendering / static prerendering via Nitro). Main entry: `nuxt.config.ts`.
- UI: Nuxt UI components (`@nuxt/ui`) with a small component tree under `app/components` and page-level views in `app/pages`.
- Content: `@nuxt/content` is used for site content. Content schemas are defined in `content.config.ts` and content lives under `content/` (yaml and markdown files).
- i18n: `@nuxtjs/i18n` configured in `nuxt.config.ts` with `locales` stored in `i18n/locales/*.json` and default locale `en`.

Key developer workflows
- Install: `pnpm install` (project uses pnpm; see `package.json.packageManager`).
- Dev server: `pnpm dev` — runs Nuxt dev on http://localhost:3000.
- Build: `pnpm build` and preview with `pnpm preview`.
- Typecheck: `pnpm typecheck` (uses `nuxt typecheck` / `vue-tsc`).
- Linting: `pnpm lint` and fix with `pnpm lint:fix` (ESLint via `@nuxt/eslint`).
- Postinstall: `nuxt prepare` runs automatically after install (see `postinstall` script).

Project-specific conventions & patterns
- Content-first: site pages are data-driven from `content/` and validated by schemas in `content.config.ts`. When adding content, follow the YAML/MD shapes defined there (e.g., `projects/*.yml`, `blog/*.md`).
- Content schema examples:
  - Blog posts require frontmatter fields: `minRead`, `date`, `image`, `author` (see `content.config.ts` -> `blog` schema).
  - Projects are data items in `content/projects/*.yml` with `title`, `description`, `image`, `url`, `tags`, `date`.
- UI config: global strings, theme values and footer settings live in `app/app.config.ts` (used by layout/components). Update here for site-wide defaults like `footer.languageSelected`.
- Components: small, focused Vue components in `app/components/*`. Follow existing patterns: `<script setup lang="ts">`, `ClientOnly` wrappers for client-only UI, and use of composables (e.g., `useLanguageSelected`).
- Icons/media: `@iconify-json/*` packages are used; images live under `public/` and content media is referenced in content files.

Integration points & external dependencies
- Nuxt modules: `@nuxt/content`, `@nuxt/image`, `@nuxt/ui`, `@vueuse/nuxt`, `@nuxtjs/i18n`, `nuxt-og-image` — changes to site rendering or content must consider these modules.
- Database / native dependency: `better-sqlite3` present in `package.json` — usually not used in this static portfolio template, be cautious with native builds on CI.

Debugging and testing notes
- No automated unit tests in the template. Prefer local dev with `pnpm dev` and inspect pages that map to content files (e.g., `/blog`, `/projects`).
- When changing content schema (`content.config.ts`), run `pnpm dev` and check console for schema validation errors from `@nuxt/content` or type errors from `pnpm typecheck`.

Useful file references (examples and patterns)
- `nuxt.config.ts` — modules, i18n, Nitro prerender config.
- `content.config.ts` — canonical content schemas; source of truth for content structure.
- `app/app.config.ts` — global UI and footer defaults.
- `app/components/LanguageButton.vue` — example composable usage (`useLanguageSelected`) and `ClientOnly` pattern.
- `content/blog/*.md` and `content/projects/*.yml` — real examples to mirror when adding content.

Agent guidance and Do/Don'ts
- Do follow `content.config.ts` when creating or editing content. If content doesn't match schema, `@nuxt/content` will surface errors.
- Do run `pnpm typecheck` after TypeScript or composable changes.
- Do not add heavy native-only dependencies without updating CI and explaining why (see `better-sqlite3`).
- When editing UI behavior, prefer to update composables or `app/app.config.ts` rather than scattering global values across components.

If you update this file, preserve the concise format and keep examples minimal (point to actual files). Ask the repo owner which CI or deployment target they use if you need to add CI-specific instructions.

---
Feedback request: After reading this draft, please tell me if you want more detail on CI, deployment (Vercel/Netlify), or local debug steps for native modules.
