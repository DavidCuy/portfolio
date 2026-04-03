# Plan de optimización de performance — Mobile

> Basado en análisis PageSpeed Insights + Chrome DevTools trace del 2 de abril de 2026.  
> Score actual: **60/100** (móvil). Meta: **≥ 85/100**.

---

## Estado actual de métricas

| Métrica | Actual | Meta | Estado |
|---|---|---|---|
| Performance | 60 | ≥ 85 | Rojo |
| FCP | ~10s (DevTools trace) / 3.2s (PageSpeed) | < 1.8s | Rojo |
| LCP | 7.6s | < 2.5s | Rojo |
| TBT | ~201ms (trace) / 310ms (PageSpeed) | < 200ms | Naranja |
| CLS | 0.046 | < 0.1 | Verde |
| Speed Index | 4.8s | < 3.4s | Naranja |

---

## Orden de implementación recomendado

| # | Acción | Esfuerzo | Impacto |
|---|---|---|---|
| 1 | Habilitar SSG (pre-rendering estático) | Alto | Crítico (−8s FCP) |
| 2 | Lazy-load de Mermaid | Medio | Alto (−200 KB bundle) |
| 3 | Auditoría de bundle con nuxi analyze | Bajo | Alto (imports duplicados) |
| 4 | Corregir animaciones no compositadas | Medio | Medio (TBT, jank) |
| 5 | Evaluar bundle local de íconos | Medio | Medio (latencia) |
| 6 | Accesibilidad: aria-labels | Bajo | Bajo (score) |

---

## Acción 1 — Habilitar SSG (pre-rendering estático)

**Archivo:** `nuxt.config.ts`  
**Impacto en FCP:** ~-8s

**Aclaración importante:** SSG ≠ SSR. Con `ssr: true` + `nuxt generate`, Nuxt pre-renderiza cada página a HTML estático **durante el build**. El output sigue siendo archivos estáticos servidos por GitHub Pages — no requiere servidor en runtime.

Con `ssr: false` (configuración actual), `nuxt generate` produce un shell HTML vacío para todas las rutas. El browser no ve contenido hasta que descarga, parsea y ejecuta todo el JS. Con `ssr: true`, el HTML ya contiene el contenido renderizado y el FCP ocurre al recibir el HTML.

**Riesgo:** Componentes que usen APIs del browser (`window`, `document`) directamente fallarán durante el build. Revisar y envolver en `onMounted` o `<ClientOnly>` donde sea necesario.

- [ ] Cambiar `ssr: false` → `ssr: true` en `nuxt.config.ts`
- [ ] Auditar componentes con uso directo de `window`/`document`/`localStorage`
- [ ] Correr `pnpm build` y resolver errores de hidratación
- [ ] Medir FCP en DevTools tras el cambio

---

## Acción 2 — Lazy-load de Mermaid ✅

**Archivo:** `app/pages/blog/[...slug].vue`  

Ya implementado. Mermaid se carga con `await import('mermaid')` dentro de `onMounted`, por lo que queda excluido del entry chunk y Vite lo separa en un chunk propio que solo se descarga al renderizar un bloque de código `mermaid`. Shiki también sigue el mismo patrón.

---

## Acción 3 — Auditoría de bundle con nuxi analyze

**Comando:** `npx nuxi analyze`  
**Impacto:** Identifica librerías pesadas restantes e imports duplicados

El trace detectó 4 archivos JS solicitados dos veces. Ejecutar tras las acciones anteriores para confirmar mejoras y encontrar optimizaciones restantes.

- [ ] Ejecutar `npx nuxi analyze`
- [ ] Identificar las 4 dependencias con imports duplicados
- [ ] Verificar que el entry bundle bajó de 218 KB wire

---

## Acción 4 — Corregir animaciones no compositadas

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

## Acción 5 — Evaluar bundle local de íconos (eliminar Iconify API)

**Impacto estimado:** Elimina dependencia externa de 6 KiB y latencia de red en cada carga.

**Problema:** Los íconos se cargan desde `https://api.iconify.design` en runtime. Esto añade una dependencia de red externa en el camino crítico.

**Opciones:**
- [ ] **Opción A (recomendada):** Usar `@iconify/vue` con íconos bundleados localmente. Instalar el set de íconos necesario (`@iconify-json/lucide`, `@iconify-json/simple-icons`) y configurar Nuxt UI para que los importe estáticamente.
- [ ] **Opción B:** Si los íconos dinámicos son necesarios, al menos mover las llamadas a Iconify para que no bloqueen el render inicial (lazy load).

**Archivos a modificar:**
- `nuxt.config.ts` (configuración de íconos de Nuxt UI)
- `package.json` (nuevas dependencias de icon sets)

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

## Lo que NO hace falta tocar

- **Cache TTL**: GitHub Pages no permite configurarlo — limitación de la plataforma.
- **Unused JS**: El tree-shaking de Nuxt ya está activo. Las 196 KiB "no usadas" son código de rutas lazy que Nuxt carga bajo demanda — es el comportamiento esperado en una SPA.
- **Source maps**: Faltantes intencionalmente en producción — no afectan performance real.
