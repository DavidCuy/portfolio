# Plan de optimización de performance — Mobile

> Basado en análisis PageSpeed Insights del 2 de abril de 2026.
> Score actual: **60/100** (móvil). Meta: **≥ 85/100**.

---

## Estado actual de métricas

| Métrica | Actual | Meta | Estado |
|---|---|---|---|
| Performance | 60 | ≥ 85 | Rojo |
| FCP | 3.2s | < 1.8s | Rojo |
| LCP | 7.6s | < 2.5s | Rojo |
| TBT | 310ms | < 200ms | Naranja |
| CLS | 0.046 | < 0.1 | Verde |
| Speed Index | 4.8s | < 3.4s | Naranja |

---

## Acción 1 — Redimensionar y convertir imágenes de skills

**Impacto estimado:** −202 KiB de transferencia, mejora directa en LCP y FCP.

**Problema:** Las imágenes de skills se sirven en resolución original (hasta 1024×1024) pero se muestran a 112×112px en pantalla.

| Imagen | Tamaño actual | Mostrada en | Desperdicio |
|---|---|---|---|
| `/skills/cloudwatch.png` | 1024×1024 | 112×112 | 83 KiB |
| `/skills/aws.png` | 1024×614 | 112×67 | 46.7 KiB |
| `/avatar/coding-light.png` | 256×256 | 126×126 | ~59 KiB |
| `/skills/cloudformation.png` | 600×600 | 112×112 | 12.8 KiB |
| `/skills/docker.png` | 512×512 | 112×112 | 8.2 KiB |
| `/skills/github-actions.png` | 200×200 | 112×112 | 6.8 KiB |
| `/skills/pulumi.png` | 320×320 | 112×112 | 6.7 KiB |

**Pasos:**
- [ ] Redimensionar todas las imágenes de skills a **224×224px** (2x para pantallas retina).
- [ ] Convertir a formato **WebP** (o AVIF como alternativa).
- [ ] Para el avatar (`coding-light.png`, `coding-dark.png`): redimensionar a **256×256px** y convertir a WebP.
- [ ] Actualizar las rutas en los componentes que las usan.

**Archivos a modificar:**
- `public/skills/*.png` → reemplazar con versiones optimizadas
- `public/avatar/*.png` → reemplazar con versiones optimizadas
- Componente `app/components/landing/Skills.vue` (verificar atributos de imagen)

---

## Acción 2 — Agregar `width` y `height` explícitos a imágenes de skills

**Impacto estimado:** Reduce CLS, elimina layout shifts durante la carga.

**Problema:** Las `<img>` de skills no tienen atributos `width` y `height`, por lo que el navegador no puede reservar el espacio antes de descargar la imagen.

**Pasos:**
- [ ] En el componente que renderiza los skills, agregar `width="112"` y `height="112"` (o el tamaño correcto) a cada `<img>`.
- [ ] Verificar que el avatar también tenga dimensiones explícitas.

**Archivos a modificar:**
- `app/components/landing/Skills.vue`
- `app/components/landing/Hero.vue` (avatar)

---

## Acción 3 — Agregar `preconnect` a `api.iconify.design`

**Impacto estimado:** −320ms en LCP. Quick win sin tocar lógica.

**Problema:** El navegador descubre `https://api.iconify.design` tarde en el proceso de carga. No hay ningún `preconnect` configurado hacia orígenes externos.

**Pasos:**
- [ ] Agregar en `nuxt.config.ts`, dentro de `app.head.link`:

```ts
// nuxt.config.ts
app: {
  head: {
    link: [
      { rel: 'preconnect', href: 'https://api.iconify.design' },
    ]
  }
}
```

**Archivos a modificar:**
- `nuxt.config.ts`

---

## Acción 4 — Evaluar bundle local de íconos (eliminar Iconify API)

**Impacto estimado:** Elimina dependencia externa de 6 KiB y latencia de red en cada carga.

**Problema:** Los íconos se cargan desde `https://api.iconify.design` en runtime. Esto añade una dependencia de red externa en el camino crítico.

**Opciones:**
- [ ] **Opción A (recomendada):** Usar `@iconify/vue` con íconos bundleados localmente. Instalar el set de íconos necesario (`@iconify-json/lucide`, `@iconify-json/simple-icons`) y configurar Nuxt UI para que los importe estáticamente.
- [ ] **Opción B:** Si los íconos dinámicos son necesarios, al menos mover las llamadas a Iconify para que no bloqueen el render inicial (lazy load).

**Archivos a modificar:**
- `nuxt.config.ts` (configuración de íconos de Nuxt UI)
- `package.json` (nuevas dependencias de icon sets)

---

## Acción 5 — Corregir animaciones no compositadas

**Impacto estimado:** Mejora TBT y elimina jank en animaciones. Puede mejorar CLS.

**Problema:** Se detectaron 12 elementos con animaciones que no se ejecutan en el compositor del GPU, causando recálculos de layout:
1. Las animaciones de entrada de `motion-v` usan `filter: blur(0px)` — esto fuerza repaint.
2. El indicador de tabs de `@nuxt/ui` anima la propiedad `width` — no es compositada.

**Pasos:**
- [ ] En los componentes que usan `<Motion>` con efectos de entrada, reemplazar animaciones que usen `filter` por animaciones solo con `opacity` y `transform` (translate/scale). Ejemplo:

```vue
<!-- Antes (genera repaint) -->
<Motion
  :initial="{ opacity: 0, filter: 'blur(8px)' }"
  :animate="{ opacity: 1, filter: 'blur(0px)' }"
/>

<!-- Después (solo compositor GPU) -->
<Motion
  :initial="{ opacity: 0, y: 16 }"
  :animate="{ opacity: 1, y: 0 }"
/>
```

- [ ] El tab indicator de `@nuxt/ui` es interno — verificar si hay una prop o configuración para desactivar la transición de `width`, o sobreescribir el CSS:

```css
/* Evitar animación de width no compositada */
.transition-\[translate\,width\] {
  transition-property: transform, opacity;
}
```

**Archivos a modificar:**
- `app/components/landing/Hero.vue`
- `app/components/landing/About.vue`
- `app/components/landing/WorkExperience.vue`
- `app/components/landing/Skills.vue`
- Otros componentes con `<Motion>`

---

## Acción 6 — Accesibilidad: nombres en botones y links de íconos

**Impacto estimado:** Accessibility 92 → ~100.

**Problema:** Botones sin texto accesible y links (probablemente los íconos de LinkedIn/GitHub en el Hero) sin nombre discernible para screen readers.

**Pasos:**
- [ ] Agregar `aria-label` a links de íconos sociales. Ejemplo:

```vue
<a href="..." aria-label="David Cuy en LinkedIn">
  <UIcon name="i-simple-icons-linkedin" />
</a>
```

- [ ] Revisar cualquier `<UButton>` que solo contenga un ícono y agregarle `aria-label`.

**Archivos a modificar:**
- `app/components/landing/Hero.vue`
- `app/components/AppHeader.vue` (si hay botones icon-only)

---

## Orden de implementación recomendado

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Preconnect a iconify (Acción 3) | Muy bajo | Alto (−320ms LCP) |
| 2 | Redimensionar y convertir imágenes (Acción 1) | Bajo | Alto (−202 KiB) |
| 3 | Agregar `width`/`height` a imágenes (Acción 2) | Muy bajo | Medio (CLS) |
| 4 | Corregir animaciones (Acción 5) | Medio | Medio (TBT, jank) |
| 5 | Bundle local de íconos (Acción 4) | Medio | Medio (latencia) |
| 6 | Accesibilidad aria-labels (Acción 6) | Bajo | Bajo (score) |

---

## Lo que NO hace falta tocar

- **Cache TTL**: GitHub Pages no permite configurarlo — limitación de la plataforma.
- **Unused JS**: El tree-shaking de Nuxt ya está activo. Las 196 KiB "no usadas" son código de rutas lazy que Nuxt carga bajo demanda — es el comportamiento esperado en una SPA.
- **Source maps**: Faltantes intencionalmente en producción — no afectan performance real.
