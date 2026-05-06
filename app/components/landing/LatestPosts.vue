<script setup lang="ts">
import groq from 'groq'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  category: 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'productivity' | 'leadership' | 'observ' | 'realsystems'
  cover?: 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'leadership' | 'observ' | null
  date: string | null
  readingTime?: number | null
}

const sanity = useSanity()
const { t } = useI18n()
const localePath = useLocalePath()

const { data } = await useAsyncData('home-latest-posts', () =>
  sanity.fetch<Post[]>(groq`*[_type=="post" && defined(slug.current)] | order(publishedAt desc) [0...3] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "image": mainImage.asset->url,
    category,
    cover,
    "date": publishedAt,
    readingTime
  }`)
)
</script>

<template>
  <section
    v-if="data?.length"
    class="container section"
  >
    <div class="section-head">
      <div>
        <div class="label">
          {{ t('latest.label', '05 · Writing') }}
        </div>
        <h2>{{ t('latest.title', 'Recent essays from the blog.') }}</h2>
      </div>
      <NuxtLink
        :to="localePath('/blog')"
        class="btn btn-ghost btn-sm"
      >
        {{ t('blog.viewAll') }} <UIcon name="i-lucide-arrow-right" />
      </NuxtLink>
    </div>
    <div class="posts-rest">
      <DcPostCard
        v-for="p in data"
        :key="p._id"
        :post="p"
      />
    </div>
  </section>
</template>
