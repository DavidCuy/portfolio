# Integración con Sanity CMS

---

## Configuración del proyecto

| Parámetro | Valor |
|---|---|
| Project ID | `my6ptkxm` |
| Dataset | `production` |
| API Version | `2024-01-01` |
| Studio URL | `https://david-cuy-blog.sanity.studio` |
| Studio local | `C:\repositories\davidCuy\david-cuys-blog` |

---

## Plugin de Nuxt

Archivo: `app/plugins/sanity.js`

Registra el cliente de Sanity como `$sanity` en toda la app:

```js
import { createClient } from '@sanity/client'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const client = createClient({
    projectId: 'my6ptkxm',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-01-01'
  })
  return { provide: { sanity: client } }
})
```

> **Importante**: en Nuxt 4, los plugins deben estar en `app/plugins/`, no en `plugins/` en la raíz del proyecto.

---

## Uso en páginas y composables

```ts
import type { SanityClient } from '@sanity/client'

// Tipado necesario (el plugin no tiene tipos auto-generados aún)
const { $sanity } = useNuxtApp()
const sanity = $sanity as unknown as SanityClient

// Fetch con tipo
const { data, error } = await useAsyncData<MiTipo[]>('cache-key', () =>
  sanity.fetch<MiTipo[]>(GROQ_QUERY)
)
```

---

## Schema del Studio

### `post`
```ts
{
  name: 'post',
  fields: [
    { name: 'title',       type: 'string' },
    { name: 'slug',        type: 'slug',      options: { source: 'title' } },
    { name: 'author',      type: 'reference', to: { type: 'author' } },
    { name: 'mainImage',   type: 'image',     options: { hotspot: true } },
    { name: 'categories',  type: 'array',     of: [{ type: 'reference', to: { type: 'category' } }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'body',        type: 'blockContent' },  // Portable Text
  ]
}
```

> **No hay campo `excerpt`**. Para agregar descripción corta, añadir `{ name: 'excerpt', type: 'text', rows: 3 }` al schema y redesplegar el Studio.

### Tipos relacionados
- `author`: nombre, bio, imagen
- `category`: título
- `blockContent`: Portable Text (bloques + imágenes)

---

## Queries GROQ de referencia

### Blog index
```groq
*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "image": mainImage.asset->url,
  "date": publishedAt
}
```

### Post individual
```groq
*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  "image": mainImage.asset->url,
  "date": publishedAt,
  "author": author->{ name, "image": image.asset->url },
  "categories": categories[]->{ title },
  body
}
```

### Pasar parámetros
```ts
sanity.fetch(QUERY, { slug: route.params.slug })
```

---

## Añadir campo `excerpt` al schema

Si se necesita descripción corta en los posts:

1. Editar `C:\repositories\davidCuy\david-cuys-blog\schemaTypes\post.ts`:
```ts
defineField({
  name: 'excerpt',
  title: 'Descripción corta',
  type: 'text',
  rows: 3
})
```

2. Redesplegar el Studio:
```bash
cd C:\repositories\davidCuy\david-cuys-blog
npx sanity deploy
```

3. Actualizar la interface en `app/pages/blog/index.vue`:
```ts
interface SanityPost {
  _id: string
  title: string
  slug: string
  description: string  // añadir
  image: string
  date: string
}
```

4. Actualizar el GROQ query para incluir `"description": excerpt`.

---

## CORS

Orígenes habilitados en el proyecto Sanity:
- `http://localhost:3000` (desarrollo)

Para producción o puertos distintos, agregar en [sanity.io/manage](https://sanity.io/manage) → proyecto `my6ptkxm` → API → CORS Origins.

---

## Comandos del Studio

```bash
# Desde C:\repositories\davidCuy\david-cuys-blog
pnpm dev              # Studio local → http://localhost:3333
npx sanity deploy     # Publica cambios al Studio en producción
npx sanity schema deploy  # Despliega el schema a la nube
```
