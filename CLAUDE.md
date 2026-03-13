# CLAUDE.md — Portfolio Personal / Blog de David Cuy

Archivo de contexto para herramientas de IA. Describe la arquitectura, convenciones y decisiones técnicas del proyecto.

## Documentación detallada

Para profundizar en temas específicos, consultar los archivos en `docs/`:

| Archivo | Contenido |
|---|---|
| [docs/content.md](docs/content.md) | Los dos sistemas de contenido (@nuxt/content y Sanity), estructura de YAMLs, queries GROQ |
| [docs/sanity.md](docs/sanity.md) | Integración Sanity completa: plugin, schema, queries de referencia, cómo añadir campos |
| [docs/i18n.md](docs/i18n.md) | Internacionalización: estrategia, traducciones de UI, campos localizados en YAML, `getLocalized` |
| [docs/components.md](docs/components.md) | Catálogo de componentes custom y de @nuxt/ui, patrones de animación con motion-v |

---

## Propósito del proyecto

Portafolio personal y blog de David Cuy. Diseñado para mostrar:
- Experiencia laboral y habilidades
- Proyectos realizados
- Servicios ofrecidos
- Artículos del blog (escritos desde Sanity CMS)

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Nuxt | 4.x | Framework principal (SPA, `ssr: false`) |
| Vue | 3.x | Framework UI |
| @nuxt/ui | 4.x | Sistema de componentes (basado en Tailwind + Reka UI) |
| @nuxt/content | 3.x | CMS local para páginas estáticas (index, about, projects, services) |
| @sanity/client | 7.x | Cliente para consumir el blog desde Sanity CMS |
| @nuxtjs/i18n | 10.x | Internacionalización (es por defecto, en) |
| motion-v | 1.x | Animaciones declarativas en templates Vue |
| @nuxt/image | 1.x | Optimización de imágenes |
| pnpm | 10.x | Gestor de paquetes |

---

## Estructura de directorios

```
portfolio/
├── app/                        ← srcDir de Nuxt 4
│   ├── pages/
│   │   ├── index.vue           ← Landing page (Hero, About, WorkExperience, Skills, Testimonials)
│   │   ├── about.vue           ← Página About
│   │   ├── projects.vue        ← Portafolio de proyectos
│   │   ├── services.vue        ← Servicios ofrecidos
│   │   └── blog/
│   │       ├── index.vue       ← Listado de posts (fetch desde Sanity)
│   │       └── [...slug].vue   ← Detalle de post (usa @nuxt/content)
│   ├── components/
│   │   ├── AppHeader.vue       ← Navbar con navegación i18n
│   │   ├── AppFooter.vue
│   │   ├── landing/            ← Secciones de la landing page
│   │   │   ├── Hero.vue
│   │   │   ├── About.vue
│   │   │   ├── WorkExperience.vue
│   │   │   ├── Skills.vue
│   │   │   ├── Testimonials.vue
│   │   │   └── FAQ.vue
│   │   └── ...                 ← Componentes reutilizables (SkillCard, PolaroidItem, TextWriter, etc.)
│   ├── layouts/
│   │   └── default.vue         ← Layout con UContainer + AppHeader + AppFooter
│   ├── plugins/
│   │   └── sanity.js           ← Plugin Nuxt que provee $sanity (SanityClient)
│   ├── utils/
│   │   ├── links.ts            ← useNavLinks() — navegación con i18n
│   │   ├── getLocalized.ts     ← Helper para obtener valor según locale
│   │   └── clipboard.ts        ← copyToClipboard helper
│   ├── locales/
│   │   ├── es.json             ← Traducciones español (default)
│   │   └── en.json             ← Traducciones inglés
│   └── app.vue                 ← Root app
├── content/                    ← Contenido local (@nuxt/content)
│   ├── index.yml               ← Datos de la landing page
│   ├── about.yml
│   ├── projects.yml
│   ├── services.yml
│   └── blog/                   ← Posts en markdown (legacy, el blog nuevo usa Sanity)
├── nuxt.config.ts
└── CLAUDE.md
```

---

## Fuentes de contenido (dos sistemas)

El proyecto usa **dos sistemas de contenido distintos**:

### 1. @nuxt/content — Páginas estáticas
Usado para todas las páginas excepto el blog:
- `content/index.yml` → landing page
- `content/about.yml` → página about
- `content/projects.yml` + `content/projects/*.yml` → proyectos
- `content/services.yml` → servicios

Se accede con `queryCollection('collectionName')` en el script setup.

### 2. Sanity CMS — Blog
Los posts del blog se crean y gestionan desde el Studio de Sanity:
- **Studio**: proyecto separado en `david-cuy-blog.sanity.studio`
- **Project ID**: `my6ptkxm`
- **Dataset**: `production`
- **API version**: `2024-01-01`

Se accede con `$sanity.fetch(GROQ_QUERY)` vía el plugin `app/plugins/sanity.js`.

---

## Patrón para consumir Sanity

```ts
// En cualquier página o composable:
const { $sanity } = useNuxtApp()
const sanity = $sanity as unknown as SanityClient

const { data } = await useAsyncData('key', () =>
  sanity.fetch<MyType[]>(`*[_type == "post"] { ... }`)
)
```

### Schema de Sanity (tipos disponibles)
- `post`: `title`, `slug`, `author` (ref), `mainImage` (image), `categories` (ref[]), `publishedAt`, `body` (blockContent)
- `author`: nombre y datos del autor
- `category`: categorías de posts
- `blockContent`: Portable Text (bloques de texto enriquecido)

**No existe campo `excerpt`** en el schema actual. Si se necesita descripción corta, debe agregarse al schema del Studio.

---

## Internacionalización (i18n)

- Idioma por defecto: **español** (`es`) — sin prefijo en URL
- Inglés: prefijo `/en/`
- Estrategia: `prefix_except_default`
- Las traducciones de UI están en `app/locales/es.json` y `app/locales/en.json`
- El contenido en `.yml` puede tener campos localizados; se resuelven con `getLocalized(value, locale)`

---

## Configuración de Nuxt

```ts
// nuxt.config.ts — puntos clave
ssr: false               // SPA puro
nitro.prerender: {
  routes: ['/'],
  crawlLinks: true       // prerenderiza rutas estáticas
}
image.provider: 'none'  // sin transformación de imágenes
ogImage.enabled: false
```

---

## CORS de Sanity

Orígenes habilitados en el proyecto Sanity (`my6ptkxm`):
- `http://localhost:3000` (desarrollo)

Para producción, agregar el dominio en [sanity.io/manage](https://sanity.io/manage) → proyecto → API → CORS Origins.

---

## Comandos frecuentes

```bash
pnpm dev          # servidor de desarrollo
pnpm build        # build de producción
pnpm lint         # ESLint
pnpm typecheck    # TypeScript check

# Desde C:\repositories\davidCuy\david-cuys-blog:
pnpm dev          # Sanity Studio local (http://localhost:3333)
npx sanity deploy # despliega Studio a david-cuy-blog.sanity.studio
```

---

## Convenciones del proyecto

- Componentes de UI: siempre usar componentes de `@nuxt/ui` (`UPage`, `UContainer`, `UButton`, etc.)
- Animaciones: usar `<Motion>` de `motion-v` para entradas con `while-in-view`
- Los plugins van en `app/plugins/` (no en `plugins/` raíz — Nuxt 4 usa `app/` como srcDir)
- Los composables y utils van en `app/utils/`
- Consultas a @nuxt/content: `queryCollection('name')`
- Consultas a Sanity: `$sanity.fetch('GROQ')`
