<script setup lang="ts">
type Category = 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'productivity' | 'leadership' | 'observ' | 'realsystems'
type Cover = 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'leadership' | 'observ'

interface Post {
  _id?: string
  title: string
  slug: string
  excerpt?: string | null
  image?: string | null
  category: Category
  cover?: Cover | null
  date?: string | null
  readingTime?: number | null
}

const props = defineProps<{ post: Post, large?: boolean }>()

const labels: Record<Category, string> = {
  architecture: 'Cloud Architecture',
  serverless: 'Serverless',
  legacy: 'Legacy',
  decisions: 'Decisions',
  productivity: 'Productivity',
  leadership: 'Leadership',
  observ: 'Observability',
  realsystems: 'Real Systems'
}

const localePath = useLocalePath()

const formatDate = (d?: string | null) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const coverKind = computed<Cover>(() => {
  if (props.post.cover) return props.post.cover
  const fallback: Record<Category, Cover> = {
    architecture: 'architecture',
    serverless: 'serverless',
    legacy: 'legacy',
    decisions: 'decisions',
    productivity: 'leadership',
    leadership: 'leadership',
    observ: 'observ',
    realsystems: 'architecture'
  }
  return fallback[props.post.category]
})
</script>

<template>
  <NuxtLink
    :to="localePath(`/blog/${post.slug}`)"
    :class="['pc', { 'pc-lg': large }]"
  >
    <div class="pc-cover-wrap">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.title"
        class="pc-cover-img"
      >
      <DcPostCover
        v-else
        :kind="coverKind"
      />
    </div>
    <div class="pc-body">
      <DcBadge :category="post.category">
        {{ labels[post.category] }}
      </DcBadge>
      <h3>{{ post.title }}</h3>
      <p
        v-if="post.excerpt"
        class="dek"
      >
        {{ post.excerpt }}
      </p>
      <div class="meta">
        <span v-if="post.date">{{ formatDate(post.date) }}</span>
        <span v-if="post.date && post.readingTime">·</span>
        <span v-if="post.readingTime">{{ post.readingTime }} min</span>
      </div>
    </div>
  </NuxtLink>
</template>
