# Gestión de Contenido

El proyecto usa **dos sistemas de contenido** según el tipo de página.

---

## 1. @nuxt/content — Páginas estáticas

Para páginas que cambian poco: landing, about, projects, services.

### Archivos
```
content/
├── index.yml        → colección "index"
├── about.yml        → colección "about"
├── projects.yml     → colección "projects"
├── services.yml     → colección "services"
└── blog/            → posts en markdown (legacy, no se usa en producción)
```

### Cómo acceder
```ts
// En el script setup de una página:
const { data: page } = await useAsyncData('key', () =>
  queryCollection('about').first()
)
```

### Estructura de campos localizados
Los campos que necesitan traducción usan un objeto `{ es: '...', en: '...' }`:
```yaml
title:
  es: "Hola, soy David Cuy"
  en: "Hey, I'm David Cuy"
```

Para resolver el valor en el locale activo:
```ts
import { getLocalized } from '~/utils/getLocalized'
const { locale } = useI18n()

const title = computed(() => getLocalized(page.value?.title, locale.value))
```

`getLocalized` acepta: string (lo devuelve tal cual), objeto `{es, en}` (devuelve el locale pedido o el primero disponible), o null/undefined (devuelve `''`).

---

## 2. Sanity CMS — Blog

Para artículos del blog. Se crean desde el Studio en `david-cuy-blog.sanity.studio`.

### Schema disponible (`post`)
| Campo | Tipo | Descripción |
|---|---|---|
| `title` | string | Título del post |
| `slug` | slug | URL (generado desde title) |
| `author` | reference → author | Autor |
| `mainImage` | image | Imagen principal |
| `categories` | reference[] → category | Categorías |
| `publishedAt` | datetime | Fecha de publicación |
| `body` | blockContent | Contenido (Portable Text) |

> **No existe `excerpt`**. Si se necesita descripción corta, añadir campo `text` al schema en `C:\repositories\davidCuy\david-cuys-blog\schemaTypes\post.ts`.

### GROQ queries más comunes

```groq
// Listado de posts
*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "image": mainImage.asset->url,
  "date": publishedAt
}

// Post individual por slug
*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "image": mainImage.asset->url,
  "date": publishedAt,
  body
}

// Con autor
*[_type == "post"] {
  title,
  "author": author->{ name }
}
```

### Cómo acceder desde Nuxt
```ts
import type { SanityClient } from '@sanity/client'

const { $sanity } = useNuxtApp()
const sanity = $sanity as unknown as SanityClient

const { data } = await useAsyncData('key', () =>
  sanity.fetch<MiTipo[]>(QUERY)
)
```

### Imágenes de Sanity
La proyección `mainImage.asset->url` devuelve la URL directa del CDN de Sanity. No requiere `@sanity/image-url`.

---

## Cuándo usar cada sistema

| Tipo de contenido | Sistema |
|---|---|
| Textos de la landing (hero, about, skills, etc.) | @nuxt/content (`.yml`) |
| Proyectos del portafolio | @nuxt/content (`.yml`) |
| Servicios | @nuxt/content (`.yml`) |
| Posts del blog | Sanity CMS |
