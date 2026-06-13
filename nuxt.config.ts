// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxtjs/i18n'
  ],

  devtools: {
    enabled: true
  },

  app: {
    baseURL: '/',
    head: {
      link: [],
      script: [
        {
          'src': 'https://cloud.umami.is/script.js',
          'data-website-id': 'c7c52c95-4a75-4329-a207-212c600b910e',
          'defer': true
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  compatibilityDate: '2024-11-01',

  hooks: {
    async 'nitro:build:public-assets'(nitro) {
      const { resolve } = await import('path')
      const { copyFileSync } = await import('fs')
      const publicDir = nitro.options.output.publicDir
      copyFileSync(resolve(publicDir, 'index.html'), resolve(publicDir, '404.html'))
    }
  },

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
            'https://my6ptkxm.apicdn.sanity.io/v2024-01-01/data/query/production?query='
            + encodeURIComponent('*[_type=="post" && defined(slug.current)] | order(publishedAt desc) {"slug":slug.current}')
          )
          const { result } = await res.json() as { result: { slug: string }[] }
          for (const p of result) {
            routes.add(`/blog/${p.slug}`)
            routes.add(`/es/blog/${p.slug}`)
          }
          console.log(`[prerender] Added ${result.length * 2} blog post routes`)
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

  fonts: {
    families: [
      { name: 'DM Sans', provider: 'google', weights: [400, 500, 600, 700], styles: ['normal', 'italic'] },
      { name: 'Public Sans', provider: 'google', weights: [600, 700, 800], preload: true, display: 'swap' },
      { name: 'JetBrains Mono', provider: 'google', weights: [400, 600] }
    ]
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
      collections: ['lucide', 'simple-icons', 'flag']
    },
    fallbackToApi: false,
    clientBundle: {
      scan: true,
      icons: ['lucide:sun', 'lucide:moon', 'flag:us-4x3', 'flag:mx-4x3']
    }
  }

})
