# Sobre el Proyecto

Este proyecto es una plantilla de **Portafolio y Blog Personal** moderna y altamente personalizable. Está diseñada para que desarrolladores y diseñadores puedan mostrar su trabajo, listar sus habilidades y escribir artículos de manera sencilla y elegante.

## Nivel de Negocio
El proyecto resuelve la necesidad de tener una presencia online profesional sin la complejidad de configurar un backend o base de datos tradicional.
- **Portafolio de Proyectos**: Permite listar y detallar trabajos previos, cargados desde archivos locales.
- **Blog**: Un sistema de publicación de artículos con soporte para Markdown.
- **Gestión de Contenido Sencilla**: Todo el contenido (textos, proyectos, posts) se gestiona editando archivos YAML y Markdown en la carpeta `content/`. No requiere panel de administración.
- **Multilingüe**: Viene configurado por defecto para soportar múltiples idiomas (Inglés y Español), facilitando el alcance a una audiencia global.

## Dominio Tecnológico
El proyecto utiliza un stack moderno basado en el ecosistema de Vue.js:
- **Framework**: [Nuxt 4](https://nuxt.com) - La última versión del framework web híbrido de Vue.
- **UI Framework**: [Nuxt UI](https://ui.nuxt.com) - Componentes estéticamente agradables y accesibles, construidos sobre **Tailwind CSS**.
- **Content Engine**: [Nuxt Content](https://content.nuxt.com) - Transforma archivos `.md`, `.yml` y `.json` en una API de contenido potente.
- **Internacionalización**: `@nuxtjs/i18n` para gestión de traducciones.
- **Tipado**: TypeScript para mayor robustez en el desarrollo.
- **Linting**: ESLint configurado para mantener la calidad del código.

---

# Pasos para Ejecución Manual

Sigue estas instrucciones para levantar el proyecto en tu entorno local.

## Prerrequisitos
- **Node.js**: Se requiere una versión reciente (Node 18 o superior).
- **pnpm**: El proyecto utiliza `pnpm` como gestor de paquetes (recomendado v9 o v10).

## Instrucciones

### 1. Instalar Dependencias
Abre tu terminal en la carpeta raíz del proyecto y ejecuta el siguiente comando para descargar todas las librerías necesarias:

```bash
pnpm install
```

### 2. Iniciar Servidor de Desarrollo
Para empezar a trabajar y ver los cambios en tiempo real, inicia el servidor de desarrollo:

```bash
pnpm dev
```
Una vez iniciado, abre tu navegador en [http://localhost:3000](http://localhost:3000).

### 3. Construcción para Producción (Build)
Cuando estés listo para desplegar o quieras probar la versión optimizada:

```bash
pnpm build
```
Esto generará una carpeta `.output` con la aplicación lista para ser desplegada en cualquier hosting que soporte Node.js o estático (dependiendo de la configuración).

### 4. Vista Previa (Preview)
Para ver localmente cómo se comportará la aplicación construida:

```bash
pnpm preview
```

## Tips Adicionales
- **Editar Contenido**: Ve a la carpeta `content/` para modificar la información del sitio.
    - `content/projects`: Añade o quita archivos `.yml` para tus proyectos.
    - `content/blog`: Añade archivos `.md` para nuevos artículos.
    - `content/*.yml`: Archivos de configuración general (services, about, etc.).
- **Traducciones**: Los textos fijos de la interfaz se encuentran en la carpeta `i18n/locales/`.
