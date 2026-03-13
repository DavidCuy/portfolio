<script setup lang="ts">
import type { SanityClient } from '@sanity/client'

interface SanityPost {
  _id: string
  title: string
  slug: string
  image: string
  date: string
}

const { $sanity } = useNuxtApp()
const sanity = $sanity as unknown as SanityClient

const QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  "image": mainImage.asset->url,
  "date": publishedAt
}`

const { data: posts, error } = await useAsyncData<SanityPost[]>('sanity-posts', () =>
  sanity.fetch<SanityPost[]>(QUERY)
)

useSeoMeta({
  title: 'Blog',
  description: 'Artículos y publicaciones'
})
</script>

<template>
  <UMain class="mt-20 px-2">
    <UContainer>
      <UPageHero
        title="Blog"
        description="Artículos y publicaciones"
        :ui="{
          title: '!mx-0 text-left',
          description: '!mx-0 text-left'
        }"
      />

      <UPageSection :ui="{ container: '!pt-0' }">
        <div v-if="error" class="text-red-500 text-center py-10">
          <p>Error al cargar los posts.</p>
          <pre class="text-xs mt-2 text-left bg-red-950 p-4 rounded">{{ error }}</pre>
        </div>

        <div v-else-if="!posts?.length" class="text-muted text-center py-10">
          No hay posts publicados aún.
        </div>

        <UBlogPosts v-else orientation="vertical">
          <Motion
            v-for="(post, index) in posts"
            :key="post._id"
            :initial="{ opacity: 0, transform: 'translateY(10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
            :transition="{ delay: 0.15 * index }"
            :in-view-options="{ once: true }"
          >
            <UBlogPost
              variant="naked"
              orientation="horizontal"
              :to="`/blog/${post.slug}`"
              :title="post.title"

              :image="post.image"
              :date="post.date"
              :ui="{
                root: 'md:grid md:grid-cols-2 group overflow-visible transition-all duration-300',
                image: 'group-hover/blog-post:scale-105 rounded-lg shadow-lg border-4 border-muted ring-2 ring-default',
                header: index % 2 === 0 ? 'sm:-rotate-1 overflow-visible' : 'sm:rotate-1 overflow-visible'
              }"
            />
          </Motion>
        </UBlogPosts>
      </UPageSection>
    </UContainer>
  </UMain>
</template>
