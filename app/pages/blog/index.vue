<script setup lang="ts">
import groq from 'groq'

type Category = 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'productivity' | 'leadership' | 'observ' | 'realsystems'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  category: Category
  tags: string[] | null
  cover?: 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'leadership' | 'observ' | null
  date: string | null
  readingTime?: number | null
}

const sanity = useSanity()
const { t } = useI18n()

const POSTS_QUERY = groq`*[_type=="post" && defined(slug.current)] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, "image": mainImage.asset->url, category, tags, cover, "date": publishedAt, readingTime
}`

const posts = ref<Post[]>([])
const error = ref<unknown>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    posts.value = await sanity.fetch<Post[]>(POSTS_QUERY)
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
})

const cat = ref<Category | 'all'>('all')

const categories = computed(() => [
  { id: 'all', label: t('blog.all') },
  { id: 'architecture', label: t('categories.architecture') },
  { id: 'serverless', label: t('categories.serverless') },
  { id: 'decisions', label: t('categories.decisions') },
  { id: 'leadership', label: t('categories.leadership') },
  { id: 'observ', label: t('categories.observ') },
  { id: 'legacy', label: t('categories.legacy') }
])

// Loose filter: match category enum OR any tag (substring, case-insensitive).
// Each chip carries an enum id + a list of synonyms (tag fragments) to broaden match.
const synonyms: Record<Category, string[]> = {
  architecture: ['architect', 'arquitect', 'systemdesign', 'realsystem', 'cloud'],
  serverless: ['serverless', 'eventdriven', 'lambda', 'aws'],
  decisions: ['decision', 'decisi', 'tradeoff', 'adr'],
  leadership: ['leader', 'lider', 'mentor', 'team'],
  observ: ['observ', 'monitor', 'metric', 'log'],
  legacy: ['legacy', 'mainframe', 'sistemas'],
  productivity: ['productiv', 'productividad', 'tooling', 'devex', 'ia', 'ai', 'iacomoherramienta'],
  realsystems: ['realsystem', 'real', 'production', 'sistema']
}

function matches(p: Post, c: Category): boolean {
  if (p.category === c) return true
  const needles = [c, ...(synonyms[c] || [])].map(s => s.toLowerCase())
  const haystack = (p.tags || []).map(t => t.toLowerCase())
  return needles.some(n => haystack.some(h => h.includes(n)))
}

const filtered = computed(() => cat.value === 'all' ? posts.value : posts.value.filter(p => matches(p, cat.value as Category)))
const featured = computed(() => filtered.value[0])
const rest = computed(() => filtered.value.slice(1))

useSeoMeta({
  title: `${t('blog.title')} · David Cuy`,
  description: t('blog.subtitle')
})
</script>

<template>
  <main class="page-enter">
    <section class="container">
      <div class="blog-hero">
        <div>
          <div class="hero-eyebrow">
            {{ t('blog.eyebrow') }}
          </div>
          <h1>{{ t('blog.h1') }}</h1>
          <p>{{ t('blog.subtitle') }}</p>
        </div>
        <div class="mascot">
          <img
            src="/mascots/mascot-barista.webp"
            alt=""
          >
        </div>
      </div>

      <div class="cat-rail">
        <DcCatChip
          v-for="c in categories"
          :key="c.id"
          :active="cat === c.id"
          @click="cat = c.id as Category | 'all'"
        >
          {{ c.label }}
        </DcCatChip>
      </div>

      <div
        v-if="error"
        style="padding: 40px 0; text-align: center; color: var(--danger)"
      >
        {{ t('blog.error') }}
      </div>
      <div
        v-else-if="!loading && !filtered.length"
        style="padding: 40px 0; text-align: center; color: var(--fg-muted)"
      >
        {{ t('blog.empty') }}
      </div>

      <template v-else>
        <div
          v-if="featured"
          class="posts-featured"
        >
          <div style="grid-row: span 2">
            <DcPostCard
              :post="featured"
              large
            />
          </div>
          <DcPostCard
            v-for="p in rest.slice(0, 2)"
            :key="p._id"
            :post="p"
          />
        </div>
        <div
          v-if="rest.length > 2"
          class="posts-rest"
          style="margin-bottom: 80px"
        >
          <DcPostCard
            v-for="p in rest.slice(2)"
            :key="p._id"
            :post="p"
          />
        </div>
      </template>
    </section>
  </main>
</template>
