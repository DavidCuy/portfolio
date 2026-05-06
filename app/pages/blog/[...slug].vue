<script setup lang="ts">
import type { SanityClient } from '@sanity/client'
import { PortableText } from '@portabletext/vue'
import { h, defineComponent, ref, onMounted } from 'vue'

const localePath = useLocalePath()
const { t } = useI18n()

interface SanityPost {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  date: string | null
  category: 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'productivity' | 'leadership' | 'observ' | 'realsystems'
  tags?: string[] | null
  cover?: 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'leadership' | 'observ' | null
  readingTime?: number | null
  author: {
    name: string
    avatar: string | null
  } | null
  body: any[]
}

interface SurroundPost {
  title: string
  slug: string
}

const route = useRoute()
const slug = Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug

const { $sanity } = useNuxtApp()
const sanity = $sanity as unknown as SanityClient

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  tags,
  cover,
  readingTime,
  "image": mainImage.asset->url,
  "date": publishedAt,
  "author": author->{ name, "avatar": image.asset->url },
  "body": body[]{
    ...,
    _type == "image" => { "url": asset->url, "alt": alt }
  }
}`

const SURROUND_QUERY = `{
  "prev": *[_type == "post" && publishedAt < $date] | order(publishedAt desc) [0] {
    title, "slug": slug.current
  },
  "next": *[_type == "post" && publishedAt > $date] | order(publishedAt asc) [0] {
    title, "slug": slug.current
  }
}`

const { data: post } = await useAsyncData(`post-${slug}`, () =>
  sanity.fetch<SanityPost>(POST_QUERY, { slug })
)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`surround-${slug}`, () =>
  sanity.fetch<{ prev: SurroundPost | null, next: SurroundPost | null }>(
    SURROUND_QUERY,
    { date: post.value?.date || new Date().toISOString() }
  )
)

// Portable Text: custom components for blocks, marks, and types
// Singleton Shiki highlighter — carga solo los lenguajes necesarios en lugar del bundle completo (~300 langs)
const SUPPORTED_LANGS = [
  'javascript', 'typescript', 'jsx', 'tsx',
  'python', 'bash', 'shell', 'sh', 'zsh',
  'html', 'css', 'json', 'yaml', 'toml',
  'go', 'rust', 'java', 'sql',
  'markdown', 'vue', 'xml', 'dockerfile'
]

let highlighterPromise: Promise<any> | null = null

function getShikiHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = Promise.all([
      import('shiki/core'),
      import('shiki/engine/oniguruma')
    ]).then(([{ createHighlighterCore }, { createOnigurumaEngine }]) =>
      createHighlighterCore({
        themes: [
          import('@shikijs/themes/github-light'),
          import('@shikijs/themes/github-dark')
        ],
        langs: [
          import('@shikijs/langs/javascript'),
          import('@shikijs/langs/typescript'),
          import('@shikijs/langs/jsx'),
          import('@shikijs/langs/tsx'),
          import('@shikijs/langs/python'),
          import('@shikijs/langs/bash'),
          import('@shikijs/langs/shell'),
          import('@shikijs/langs/sh'),
          import('@shikijs/langs/zsh'),
          import('@shikijs/langs/html'),
          import('@shikijs/langs/css'),
          import('@shikijs/langs/json'),
          import('@shikijs/langs/yaml'),
          import('@shikijs/langs/toml'),
          import('@shikijs/langs/go'),
          import('@shikijs/langs/rust'),
          import('@shikijs/langs/java'),
          import('@shikijs/langs/sql'),
          import('@shikijs/langs/markdown'),
          import('@shikijs/langs/vue'),
          import('@shikijs/langs/xml'),
          import('@shikijs/langs/dockerfile')
        ],
        engine: createOnigurumaEngine(import('shiki/wasm'))
      })
    )
  }
  return highlighterPromise
}

const ptComponents: any = {
  block: {
    h1: defineComponent({
      setup(_, { slots }) {
        return () => h('h1', { class: 'text-4xl font-bold mt-10 mb-4 leading-tight' }, slots.default?.())
      }
    }),
    h2: defineComponent({
      setup(_, { slots }) {
        return () => h('h2', { class: 'text-3xl font-bold mt-10 mb-3 leading-snug' }, slots.default?.())
      }
    }),
    h3: defineComponent({
      setup(_, { slots }) {
        return () => h('h3', { class: 'text-2xl font-bold mt-8 mb-2' }, slots.default?.())
      }
    }),
    h4: defineComponent({
      setup(_, { slots }) {
        return () => h('h4', { class: 'text-xl font-semibold mt-6 mb-2' }, slots.default?.())
      }
    }),
    blockquote: defineComponent({
      setup(_, { slots }) {
        return () => h('blockquote', { class: 'border-l-4 border-primary/50 pl-4 italic text-muted my-6' }, slots.default?.())
      }
    }),
    normal: defineComponent({
      setup(_, { slots }) {
        return () => h('p', { class: 'mb-5 leading-relaxed' }, slots.default?.())
      }
    })
  },
  list: {
    bullet: defineComponent({
      setup(_, { slots }) {
        return () => h('ul', { class: 'list-disc list-outside pl-6 mb-5 space-y-1' }, slots.default?.())
      }
    }),
    number: defineComponent({
      setup(_, { slots }) {
        return () => h('ol', { class: 'list-decimal list-outside pl-6 mb-5 space-y-1' }, slots.default?.())
      }
    })
  },
  listItem: {
    bullet: defineComponent({
      setup(_, { slots }) {
        return () => h('li', { class: 'leading-relaxed' }, slots.default?.())
      }
    }),
    number: defineComponent({
      setup(_, { slots }) {
        return () => h('li', { class: 'leading-relaxed' }, slots.default?.())
      }
    })
  },
  marks: {
    strong: defineComponent({
      setup(_, { slots }) {
        return () => h('strong', { class: 'font-bold' }, slots.default?.())
      }
    }),
    em: defineComponent({
      setup(_, { slots }) {
        return () => h('em', { class: 'italic' }, slots.default?.())
      }
    }),
    code: defineComponent({
      setup(_, { slots }) {
        return () => h('code', { class: 'bg-muted px-1.5 py-0.5 rounded text-sm font-mono' }, slots.default?.())
      }
    }),
    link: defineComponent({
      props: { value: { type: Object } },
      setup(props, { slots }) {
        return () => h('a', {
          href: props.value?.href,
          target: '_blank',
          rel: 'noopener noreferrer',
          class: 'text-primary underline underline-offset-2 hover:opacity-80'
        }, slots.default?.())
      }
    })
  },
  types: {
    image: defineComponent({
      props: { value: { type: Object } },
      setup(props) {
        return () => props.value?.url
          ? h('img', {
              src: props.value.url,
              alt: props.value.alt || '',
              class: 'rounded-lg w-full my-6 object-cover'
            })
          : null
      }
    }),
    customHtml: defineComponent({
      props: { value: { type: Object } },
      setup(props) {
        return () => props.value?.html
          ? h('figure', { class: 'my-6 not-prose' }, [
              h('div', { innerHTML: props.value.html }),
              props.value.caption && h('figcaption', {
                class: 'mt-2 text-center text-xs text-muted'
              }, props.value.caption)
            ])
          : null
      }
    }),
    code: defineComponent({
      props: { value: { type: Object } },
      setup(props) {
        const highlightedHtml = ref('')
        const colorMode = useColorMode()

        onMounted(async () => {
          const lang = props.value?.language || 'text'
          const code = props.value?.code || ''

          if (lang === 'mermaid') {
            const mermaid = (await import('mermaid')).default
            mermaid.initialize({
              startOnLoad: false,
              theme: colorMode.value === 'dark' ? 'dark' : 'default'
            })
            const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`
            const { svg } = await mermaid.render(id, code)
            highlightedHtml.value = svg
            return
          }

          const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : null
          if (safeLang) {
            const highlighter = await getShikiHighlighter()
            highlightedHtml.value = highlighter.codeToHtml(code, {
              lang: safeLang,
              themes: { light: 'github-light', dark: 'github-dark' },
              defaultColor: false
            })
          }
        })

        return () => {
          const lang = props.value?.language || 'text'

          if (lang === 'mermaid') {
            return highlightedHtml.value
              ? h('figure', {
                  class: 'my-6 not-prose flex justify-center overflow-x-auto',
                  innerHTML: highlightedHtml.value
                })
              : h('div', { class: 'my-6 flex justify-center py-4 text-sm text-muted' }, 'Cargando diagrama...')
          }

          return h('div', { class: 'relative my-6 not-prose' }, [
            props.value?.filename && h('div', {
              class: 'px-4 py-2 text-xs font-mono border-b border-default text-muted bg-muted/40 rounded-t-lg'
            }, props.value.filename),
            highlightedHtml.value
              ? h('div', {
                  innerHTML: highlightedHtml.value,
                  class: props.value?.filename ? 'shiki-wrapper rounded-t-none' : 'shiki-wrapper'
                })
              : h('pre', {
                  class: [
                    'overflow-x-auto p-4 text-sm font-mono leading-relaxed bg-muted/40 border border-default',
                    props.value?.filename ? 'rounded-b-lg' : 'rounded-lg'
                  ]
                }, [h('code', {}, props.value?.code || '')])
          ])
        }
      }
    })
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const articleLink = computed(() => typeof window !== 'undefined' ? window.location.href : '')

useSeoMeta({
  title: post.value.title,
  description: post.value.excerpt || '',
  ogTitle: post.value.title,
  ogDescription: post.value.excerpt || '',
  ogImage: post.value.image || ''
})
</script>

<template>
  <main
    v-if="post"
    class="page-enter"
  >
    <article
      class="container-narrow"
      style="padding: 64px 32px 40px"
    >
      <NuxtLink
        :to="localePath('/blog')"
        style="font-size: 13px; display: inline-flex; align-items: center; gap: 4px; color: var(--fg-muted); margin-bottom: 24px"
      >
        <UIcon name="i-lucide-chevron-left" />
        {{ $t('blog.title') }}
      </NuxtLink>

      <DcBadge :category="post.category">
        {{ $t(`categories.${post.category}`) }}
      </DcBadge>

      <div
        v-if="post.tags?.length"
        class="post-tags"
      >
        <span
          v-for="tg in post.tags"
          :key="tg"
          class="post-tag"
        >#{{ tg }}</span>
      </div>

      <h1 style="font-family: var(--font-display); font-size: clamp(36px, 5vw, 56px); line-height: 1.1; letter-spacing: -0.02em; color: var(--fg-strong); font-weight: 700; margin: 18px 0 16px">
        {{ post.title }}
      </h1>

      <p
        v-if="post.excerpt"
        style="font-size: 19px; line-height: 30px; color: var(--fg-muted); margin: 0 0 24px"
      >
        {{ post.excerpt }}
      </p>

      <div style="display: flex; align-items: center; gap: 16px; padding: 16px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-bottom: 32px; font-family: var(--font-mono); font-size: 12px; color: var(--fg-muted)">
        <span v-if="post.date">{{ formatDate(post.date) }}</span>
        <span v-if="post.readingTime">· {{ post.readingTime }} min</span>
        <span
          v-if="post.author?.name"
          style="margin-left: auto"
        >{{ post.author.name }}</span>
      </div>

      <div
        v-if="!post.image"
        style="aspect-ratio: 16/9; border-radius: 14px; overflow: hidden; margin-bottom: 32px; background: var(--surface-code)"
      >
        <DcPostCover :kind="post.cover || (post.category === 'productivity' || post.category === 'leadership' ? 'leadership' : post.category === 'realsystems' ? 'architecture' : post.category)" />
      </div>
      <img
        v-else
        :src="post.image"
        :alt="post.title"
        style="border-radius: 14px; width: 100%; aspect-ratio: 16/9; object-fit: cover; margin-bottom: 32px"
      >

      <div class="prose-body">
        <PortableText
          v-if="post.body?.length"
          :value="post.body"
          :components="ptComponents"
        />
      </div>

      <div style="display: flex; align-items: center; justify-content: flex-end; margin-top: 40px">
        <button
          class="btn btn-ghost btn-sm"
          @click="copyToClipboard(articleLink, t('blog.linkCopied'))"
        >
          <UIcon name="i-lucide-link" />
          {{ $t('blog.copyLink') }}
        </button>
      </div>

      <div
        v-if="surround?.prev || surround?.next"
        style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--border)"
      >
        <NuxtLink
          v-if="surround?.prev"
          :to="localePath(`/blog/${surround.prev.slug}`)"
          style="display: flex; flex-direction: column; gap: 4px; text-decoration: none"
        >
          <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-muted); display: inline-flex; align-items: center; gap: 4px">
            <UIcon name="i-lucide-chevron-left" />
            {{ $t('blog.prev') }}
          </span>
          <span style="font-family: var(--font-display); font-weight: 600; color: var(--fg-strong); font-size: 15px">
            {{ surround.prev.title }}
          </span>
        </NuxtLink>
        <div v-else />

        <NuxtLink
          v-if="surround?.next"
          :to="localePath(`/blog/${surround.next.slug}`)"
          style="display: flex; flex-direction: column; gap: 4px; text-align: right; text-decoration: none"
        >
          <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--fg-muted); display: inline-flex; align-items: center; gap: 4px; justify-content: flex-end">
            {{ $t('blog.next') }}
            <UIcon name="i-lucide-chevron-right" />
          </span>
          <span style="font-family: var(--font-display); font-weight: 600; color: var(--fg-strong); font-size: 15px">
            {{ surround.next.title }}
          </span>
        </NuxtLink>
      </div>
    </article>
  </main>
</template>

<style scoped>
.prose-body :deep(h2) {
  font-family: var(--font-display);
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: -0.01em;
  margin: 40px 0 16px;
  color: var(--fg-strong);
}
.prose-body :deep(h3) {
  font-family: var(--font-display);
  font-size: 24px;
  line-height: 1.25;
  margin: 32px 0 12px;
  color: var(--fg-strong);
}
.prose-body :deep(p) {
  font-size: 17px;
  line-height: 29px;
  color: var(--fg);
  margin: 0 0 20px;
}
.prose-body :deep(a) {
  color: var(--fg-link);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.prose-body :deep(ul),
.prose-body :deep(ol) {
  padding-left: 24px;
  margin: 0 0 20px;
}
.prose-body :deep(li) {
  margin-bottom: 8px;
  font-size: 17px;
  line-height: 29px;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0 0;
}
.post-tag {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--fg-muted);
  text-transform: lowercase;
  padding: 2px 4px;
  transition: color var(--dur-fast) var(--ease-standard);
}
.post-tag:hover {
  color: var(--fg-accent);
}
.prose-body :deep(blockquote) {
  margin: 32px 0;
  padding: 0 0 0 20px;
  border-left: 2px solid var(--border-strong);
  background: transparent;
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 22px;
  line-height: 32px;
  letter-spacing: -0.005em;
  color: var(--fg-strong);
}
</style>
