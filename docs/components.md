# Componentes

## Sistema de componentes: @nuxt/ui v4

Todos los componentes de UI vienen de `@nuxt/ui`. Siempre preferir estos sobre crear componentes custom.

Los más usados en el proyecto:

| Componente | Uso |
|---|---|
| `UPage` | Wrapper de página con espaciado estándar |
| `UPageHero` | Hero section con title, description, links, slots |
| `UPageSection` | Sección de contenido con padding vertical |
| `UContainer` | Contenedor centrado con max-width |
| `UButton` | Botones, soporta `v-bind` con objeto de config |
| `UBlogPosts` | Grid/lista de posts del blog |
| `UBlogPost` | Card de post individual |
| `UColorModeAvatar` | Avatar que cambia según light/dark mode |
| `UIcon` | Iconos (lucide, simple-icons) |

---

## Componentes custom del proyecto

### Layout
- **`AppHeader`** — Navbar con logo, links de navegación, `LanguageButton` y `ColorModeButton`
- **`AppFooter`** — Footer con links sociales

### Landing page (secciones)
Todos reciben `page` (la colección `index`) como prop:

| Componente | Sección |
|---|---|
| `LandingHero` | Hero con avatar, título animado, TextWriter, disponibilidad |
| `LandingAbout` | Sección "Acerca de mí" |
| `LandingWorkExperience` | Timeline de experiencia laboral |
| `LandingSkills` | Tarjetas de habilidades por categoría |
| `LandingTestimonials` | Carousel/grid de testimoniales |
| `LandingFAQ` | Preguntas frecuentes en acordeón |

### Utilidades
- **`TextWriter`** — Efecto de escritura que cicla entre un array de textos (`texts`, `interval`)
- **`PolaroidItem`** — Imagen en estilo polaroid con rotación aleatoria (usado en About)
- **`SkillCard`** — Tarjeta de habilidad individual con imagen y descripción
- **`ColorModeButton`** — Toggle dark/light mode
- **`LanguageButton`** — Switch de idioma es/en
- **`ResumeButton`** — Botón de descarga de CV

---

## Animaciones con motion-v

Patrón estándar para **entrada al hacer scroll**:
```vue
<Motion
  :initial="{ opacity: 0, transform: 'translateY(10px)' }"
  :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
  :transition="{ delay: 0.15 * index }"
  :in-view-options="{ once: true }"
>
  <!-- contenido -->
</Motion>
```

Patrón para **animación inicial** (al cargar la página, sin scroll):
```vue
<Motion
  :initial="{ scale: 1.1, opacity: 0, filter: 'blur(20px)' }"
  :animate="{ scale: 1, opacity: 1, filter: 'blur(0px)' }"
  :transition="{ duration: 0.6, delay: 0.3 }"
>
  <!-- contenido -->
</Motion>
```

> `once: true` en `in-view-options` asegura que la animación solo ocurra la primera vez que el elemento es visible.

---

## Configuración global (app.config)

Datos globales del sitio disponibles en `useAppConfig()`:

- `global.picture` — Avatar del autor (`light`, `dark`, `alt`)
- `global.available` — Estado de disponibilidad (`status: boolean`, `availableText`, `unavailableText`)
- `global.meeting.link` — Link de Calendly/reunión
- `footer.links` — Links del footer (redes sociales)
