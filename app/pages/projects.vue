<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface Project {
  _id: string
  title: LocalizedString
  description: LocalizedText
  tags: string[]
  kind: 'architecture' | 'serverless' | 'legacy' | 'ai' | 'observ' | 'decisions'
  badge: string
  image?: string | null
  url?: string | null
  cover?: 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'leadership' | 'observ' | null
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { t } = useI18n()

const { data } = await useAsyncData('projects', () =>
  sanity.fetch<Project[]>(groq`*[_type=="project"] | order(order desc)`)
)

const filters = computed(() => [
  { id: 'all', label: t('blog.all') },
  { id: 'architecture', label: t('categories.architecture') },
  { id: 'serverless', label: 'Serverless' },
  { id: 'legacy', label: 'Legacy' },
  { id: 'ai', label: 'AI / LLM' },
  { id: 'observ', label: t('categories.observ') }
])

const f = ref('all')
const shown = computed(() => f.value === 'all' ? (data.value || []) : (data.value || []).filter(p => p.kind === f.value))

const coverFor = (kind: string, cover?: string | null) => {
  if (cover) return cover as 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'leadership' | 'observ'
  if (kind === 'ai') return 'leadership'
  return kind as 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'observ'
}

useSeoMeta({
  title: t('projects.seoTitle', 'Projects · David Cuy'),
  description: t('projects.seoDescription', 'Selected cloud systems shipped to production over the last decade.')
})
</script>

<template>
  <main class="page-enter">
    <section class="container">
      <div class="blog-hero">
        <div>
          <div class="hero-eyebrow">
            {{ t('projects.eyebrow', 'Selected work') }}
          </div>
          <h1>{{ t('projects.h1', 'Projects that actually made it to production.') }}</h1>
          <p>{{ t('projects.intro', 'Cloud systems shipped over the last decade. Each one has an ADR, a postmortem, and at least one decision I regret.') }}</p>
        </div>
        <div class="mascot">
          <img
            src="/mascots/mascot-chaser.webp"
            alt=""
          >
        </div>
      </div>
      <div class="projects-filter">
        <DcCatChip
          v-for="x in filters"
          :key="x.id"
          :active="f === x.id"
          @click="f = x.id"
        >
          {{ x.label }}
        </DcCatChip>
      </div>
      <div class="projects-grid">
        <component
          :is="p.url ? 'a' : 'article'"
          v-for="p in shown"
          :key="p._id"
          :href="p.url || undefined"
          :target="p.url ? '_blank' : undefined"
          :rel="p.url ? 'noopener noreferrer' : undefined"
          class="proj-card"
        >
          <div class="proj-cover-wrap">
            <span class="proj-badge">{{ p.badge }}</span>
            <img
              v-if="p.image"
              :src="p.image"
              :alt="localized(p.title)"
              class="proj-cover-img"
            >
            <DcPostCover
              v-else
              :kind="coverFor(p.kind, p.cover)"
            />
          </div>
          <div class="proj-body">
            <h3>{{ localized(p.title) }}</h3>
            <p>{{ localized(p.description) }}</p>
            <div
              v-if="p.tags?.length"
              class="proj-tags"
            >
              <span
                v-for="tag in p.tags"
                :key="tag"
                class="proj-tag"
              >{{ tag }}</span>
            </div>
          </div>
        </component>
      </div>
    </section>
  </main>
</template>
