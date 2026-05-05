// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
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
  ssr: true,

  devtools: {
    enabled: true
  },

  app: {
    baseURL: '/',
    head: {
      link: [],
      script: [
        {
          src: 'https://cloud.umami.is/script.js',
          'data-website-id': 'c7c52c95-4a75-4329-a207-212c600b910e',
          defer: true,
        },
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-11-01',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      failOnError: false
    },
    hooks: {
      'prerender:routes': async (routes) => {
        try {
          const res = await fetch(
            'https://my6ptkxm.apicdn.sanity.io/v2024-01-01/data/query/production?query=' +
            encodeURIComponent('*[_type=="post" && defined(slug.current)]{"slug":slug.current}')
          )
          const { result } = await res.json() as { result: { slug: string }[] }
          for (const p of result) {
            routes.add(`/blog/${p.slug}`)
            routes.add(`/es/blog/${p.slug}`)
          }
          console.log(`[prerender] Added ${result.length * 2} blog post routes from Sanity`)
        } catch (err) {
          console.warn('[prerender] Failed to fetch Sanity slugs:', err)
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',

    locales: [
      { code: 'en', file: 'en.json' },
      { code: 'es', file: 'es.json' }
    ],

    langDir: 'locales/',
    vueI18n: './i18n.config.ts'
  },

  icon: {
    serverBundle: {
      collections: ['lucide', 'simple-icons', 'flag'],
    },
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      icons: ['lucide:sun', 'lucide:moon', 'flag:us-4x3', 'flag:mx-4x3'],
    },
  },

  image: {
    provider: 'none'
  },
  ogImage: {
    enabled: false
  }
})
