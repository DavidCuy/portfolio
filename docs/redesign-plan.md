# Redesign Plan — Cloud + Coffee

Diseño handoff: `design_handoff_dc_portfolio/`. Sistema "Cloud + Coffee".

---

## Decisiones tomadas

| # | Tema | Decisión |
|---|---|---|
| 1 | Fuente de datos | Todo a Sanity (Hero, About, Experience, Skills, Testimonials, Services, Projects, Blog) |
| 2 | Categorías de blog | Enum cerrado de 8: `architecture`, `serverless`, `legacy`, `decisions`, `productivity`, `leadership`, `observ`, `realsystems` |
| 3 | Campo `dek` | No se crea. Usa `excerpt` existente como subtítulo del post |
| 4 | Proyectos | Migrar de YAML a Sanity |
| 5 | Schema fields nuevos en `post` | `category` (enum 8), `cover` (enum 6: architecture/serverless/legacy/decisions/leadership/observ), `readingTime` (number, calc en build) |
| 6 | Stack UI | Custom Button/Badge/Card. Drop `@nuxt/ui` en componentes core. Conservar para UModal/UTooltip/UPopover si hace falta |
| 7 | Mood/density/texture | Solo `pragmatic`. Drop sistema de variantes |
| 8 | i18n | Conservar config actual (default `en` sin prefijo, `/es/` con prefijo) |
| 9 | Mermaid | Mantener soporte en blog posts |

---

## Schema Sanity — cambios

### Documentos nuevos (migración YAML → Sanity)

```
home (singleton)
  - hero { eyebrow, titleLines[3], italicWord, lede, ctaPrimary{label,to}, ctaSecondary{label,to}, location, responseTime, languages }
  - badges[2] { icon, title, subtitle }
  - techStrip[] (string[])
  - about { label, title, paragraph1, paragraph2, ctaLabel, ctaTo, stats[]{n,u} }

experience (collection, ordered)
  - year, role, company, city, description

skill (collection)
  - tabId (enum: cloud|code|data|ai), name, description, level (1-5), icon

testimonial (collection)
  - name, role, quote, avatar (initials or image)

service (collection, ordered, max 3)
  - num, title, description, bullets[], price, featured (bool), ctaLabel

processStep (collection, max 4)
  - num, title, description

aboutPage (singleton)
  - badge, title, intro, paragraphs[], blockquote{text,cite}, ctas[]

settings (singleton)
  - footer { brand, tagline, socials[]{platform,url}, contact{email,location} }
  - cta { headline, body, primary{label,to}, secondaryNote }
```

### Cambios en `post` existente
- Add `category` (string, list: 8 valores)
- Add `cover` (string, list: 6 valores)
- Add `readingTime` (number, optional)
- Mantener `excerpt` (úsalo como dek)
- Resto igual: `title, slug, author, mainImage, body, publishedAt`

### Document `category` actual
- Eliminar (reemplazado por enum string en `post.category`)

---

## Tokens y assets

### CSS tokens
- Copiar `design_handoff_dc_portfolio/assets/colors_and_type.css` → `app/assets/css/tokens.css`
- Importar en `app/assets/css/main.css`
- Eliminar mood/density/texture variants de `styles.css` (ship solo `pragmatic`)

### Fuentes
- Self-host `Syne-Variable.ttf`, `DMSans-Variable.ttf`, `DMSans-Italic-Variable.ttf` en `public/fonts/`
- JetBrains Mono via Google Fonts CSS link o `@nuxtjs/google-fonts`

### Mascotas
- Mover 5 PNGs a `public/mascots/`:
  - `mascot-coder.webp` (Hero)
  - `mascot-chaser.webp` (Projects)
  - `mascot-speaker.webp` (Services)
  - `mascot-barista.webp` (Blog)
  - `mascot-dreamer.webp` (reserva)

### Logos
- `logo-iso.jpg` → `public/logo-iso.jpg` (favicon + nav)
- `logo-full.jpeg` → `public/logo-full.jpeg` (footer)

---

## Componentes custom

| Componente | Reemplaza | Notas |
|---|---|---|
| `<DcButton>` | `<UButton>` | variant: primary/secondary/ghost, size: sm/md/lg, icon/iconAfter slots |
| `<DcBadge>` | n/a | category prop con dot color del enum |
| `<DcIcon>` | `<UIcon>` | wrapper Iconify lucide stroke 1.75 |
| `<DcPostCard>` | n/a | cover SVG por kind, large variant |
| `<DcSkillCard>` | `SkillCard.vue` actual | icon-box + title + desc + level dots |
| `<DcServiceCard>` | n/a | featured variant (navy bg) |
| `<DcTestimonialCard>` | n/a | quote mark + blockquote + ava + name/role |
| `<DcCtaBand>` | n/a | full-width navy/sky con headline + 2 CTAs |
| `<DcSectionHead>` | n/a | label + h2 + num |
| `<DcCatChip>` | n/a | filter button (active state) |
| `<PostCover>` | n/a | switch sobre kind, renderiza SVG hardcoded |

Layouts:
- `<AppHeader>` rediseño completo: brand pill + nav links + lang toggle + theme toggle + Hire CTA
- `<AppFooter>` rediseño: 4 columnas (brand+socials, Site, Blog, Contact) + bottom row

---

## Fases

### Fase 1 — Schema Sanity + migración data
**Repo:** `david-cuys-blog` (Studio)

1. Editar schemas: `home.ts`, `experience.ts`, `skill.ts`, `testimonial.ts`, `service.ts`, `processStep.ts`, `aboutPage.ts`, `settings.ts`, `project.ts`
2. Modificar `post.ts`: add `category` (list 8), `cover` (list 6), `readingTime`
3. Eliminar `category.ts`
4. Deploy schema: `npx sanity deploy`
5. Cargar contenido en Studio (manualmente desde YAMLs actuales, traducciones ES/EN incluidas)

### Fase 2 — Tokens + tipografía + reset
**Repo:** `portfolio`

1. Copiar `colors_and_type.css` → `app/assets/css/tokens.css`
2. Mascotas + fuentes a `public/`
3. Reset CSS, body styles
4. Configurar Tailwind v4 `@theme` con tokens (opcional, si seguimos usando Tailwind utilities)
5. Drop CSS legacy de `app/assets/css/main.css`

### Fase 3 — Nav + Footer
1. Reescribir `AppHeader.vue` con sticky pill, scroll shadow, lang+theme toggle
2. Reescribir `AppFooter.vue` con 4 columnas

### Fase 4 — Componentes custom
1. Crear `app/components/dc/Button.vue`, `Badge.vue`, `Icon.vue`, `PostCard.vue`, `PostCover.vue`, `SkillCard.vue`, `ServiceCard.vue`, `TestimonialCard.vue`, `CtaBand.vue`, `SectionHead.vue`, `CatChip.vue`

### Fase 5 — Home
1. Reescribir `pages/index.vue`
2. Componentes de sección: `Hero.vue`, `TechStrip.vue`, `About.vue`, `Experience.vue`, `Skills.vue`, `Testimonials.vue`, `LatestPosts.vue`
3. Queries Sanity para cada singleton/collection

### Fase 6 — Projects
1. Reescribir `pages/projects.vue`
2. Filter chips + grid + PostCover por kind
3. Query Sanity: `*[_type=="project"] | order(year desc)`

### Fase 7 — Services
1. Reescribir `pages/services.vue`
2. 3 tier cards + process steps + CTA band

### Fase 8 — About page
1. Reescribir `pages/about.vue` con long-form bio + blockquote pattern

### Fase 9 — Blog
1. Rediseñar `pages/blog/index.vue`: cat chips + featured + grid
2. Rediseñar `pages/blog/[...slug].vue`: detalle con PostCover + cat badge + reading time

### Fase 10 — Limpieza
1. Eliminar `content/` directory
2. Drop `@nuxt/content` del proyecto
3. Drop `motion-v` si no se usa post-redesign (verificar)
4. Drop `@nuxt/ui` si componentes custom cubren todo (revisar UModal/UTooltip)
5. Drop `mermaid` si... (NO, se mantiene)
6. Re-run `nuxi analyze` → comparar bundle antes/después

---

## Riesgos

- **Migración de contenido manual a Sanity**: tiempo. Bilingüe duplica trabajo. Mitigación: script one-shot que parsee YAML y crea docs via Sanity API.
- **Drop @nuxt/content**: rompe build hasta migrar. Hacer en Fase 10, no antes.
- **Drop @nuxt/ui**: muchos componentes lo usan (`UButton`, `UIcon`, `UTooltip`, `UMain`, `UContainer`, `UPage`, `UPageBody`). Migración incremental, no big-bang.
- **Webhook Sanity → rebuild**: setup en GH Actions con `repository_dispatch`. Fuera de scope inmediato pero necesario para reactividad.
