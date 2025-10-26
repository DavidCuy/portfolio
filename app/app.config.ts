export default defineAppConfig({
  global: {
    picture: {
      dark: '/avatar/coding-dark.png',
      light: '/avatar/coding-light.png',
      alt: 'My profile picture'
    },
    meeting: {
      link: 'https://calendar.app.google/r6XjXkTZbHbuWuAj9'
    },
    email: 'david.cuy.sanchez@gmail.com',
    available: {
      status: true,
      availableText: {
        en: 'Available for new projects',
        es: 'Disponible para nuevos proyectos'
      },
      unavailableText: {
        en: 'Not available at the moment',
        es: 'No disponible en este momento'
      }
    }
  },
  ui: {
    colors: {
      primary: 'blue',
      neutral: 'neutral'
    },
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Built with ♥️ by me • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/david-cuy/',
      'target': '_blank',
      'aria-label': 'David Cuy on LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/DavidCuy',
      'target': '_blank',
      'aria-label': 'David Cuy on GitHub'
    }]
  }
})
