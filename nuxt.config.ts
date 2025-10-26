// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  ogImage: {
    enabled: false,
  },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/content',
    '@vueuse/nuxt',
    'nuxt-og-image',
    'motion-v/nuxt',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  i18n: {
    defaultLocale: 'en',
  strategy: 'prefix_except_default',

  locales: [
    { code: 'en', file: 'en.json' },
    { code: 'es', file: 'es.json' }
  ],

  langDir: 'locales/',
  vueI18n: './i18n.config.ts',

  routing: { redirectOn: 'no_redirect' },
  experimental: { localeDetector: false }
  },

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
