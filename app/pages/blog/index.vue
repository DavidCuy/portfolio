<script setup lang="ts">
import type { SanityClient } from '@sanity/client'
import { useIntersectionObserver } from '@vueuse/core'

const localePath = useLocalePath()
const { t } = useI18n()

interface SanityCategory {
  _id: string
  title: string
}

interface SanityPost {
  _id: string
  title: string
  slug: string
  excerpt: string | null
  image: string | null
  date: string | null
  author: {
    name: string
    avatar: string | null
  } | null
}

const { $sanity } = useNuxtApp()
const sanity = $sanity as unknown as SanityClient

const PAGE_SIZE = 10

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc) [$start...$end] {
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "image": mainImage.asset->url,
  "date": publishedAt,
  "author": author->{ name, "avatar": image.asset->url }
}`

const CATEGORIES_QUERY = `*[_type == "category"] | order(title asc) { _id, title }`

const { data: initialData, error } = await useAsyncData('sanity-blog', async () => {
  const [posts, categories] = await Promise.all([
    sanity.fetch<SanityPost[]>(POSTS_QUERY, { start: 0, end: PAGE_SIZE }),
    sanity.fetch<SanityCategory[]>(CATEGORIES_QUERY)
  ])
  return { posts, categories }
})

const posts = ref<SanityPost[]>(initialData.value?.posts || [])
const categories = ref<SanityCategory[]>(initialData.value?.categories || [])
const offset = ref(PAGE_SIZE)
const hasMore = ref((initialData.value?.posts?.length || 0) >= PAGE_SIZE)
const loadingMore = ref(false)
const sentinel = ref<HTMLElement | null>(null)

const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const more = await sanity.fetch<SanityPost[]>(POSTS_QUERY, {
      start: offset.value,
      end: offset.value + PAGE_SIZE
    })
    posts.value.push(...more)
    offset.value += PAGE_SIZE
    if (more.length < PAGE_SIZE) hasMore.value = false
  }
  finally {
    loadingMore.value = false
  }
}

const { stop } = useIntersectionObserver(sentinel, ([entry]) => {
  if (entry?.isIntersecting) loadMore()
}, { threshold: 0.1 })

watch(hasMore, (val) => { if (!val) stop() })

const formatDate = (dateString: string | null) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

useSeoMeta({
  title: t('blog.title'),
  description: t('blog.subtitle')
})
</script>

<template>
  <UMain class="mt-20">
    <!-- Header -->
    <div class="py-8 border-b border-default px-4">
      <h1 class="text-3xl font-bold">{{ $t('blog.title') }}</h1>
      <p class="text-muted mt-1">{{ $t('blog.subtitle') }}</p>
    </div>

    <!-- Recommended topics -->
    <div v-if="categories.length" class="px-4 py-4 border-b border-default flex flex-wrap gap-2">
      <span
        v-for="cat in categories"
        :key="cat._id"
        class="px-4 py-1.5 rounded-full bg-muted/60 text-sm font-medium cursor-pointer hover:bg-muted transition-colors"
      >
        {{ cat.title }}
      </span>
    </div>

    <div v-if="error" class="py-10 text-center text-red-500 px-4">
      {{ $t('blog.error') }}
    </div>

    <!-- Posts list -->
    <div v-else class="divide-y divide-default px-4">
      <p v-if="!posts.length && !loadingMore" class="py-10 text-center text-muted">
        {{ $t('blog.empty') }}
      </p>

      <NuxtLink
        v-for="post in posts"
        :key="post._id"
        :to="localePath(`/blog/${post.slug}`)"
        class="flex items-start gap-6 py-8 group"
      >
        <!-- Left: content -->
        <div class="flex-1 min-w-0 flex flex-col gap-2">
          <!-- Author -->
          <div v-if="post.author" class="flex items-center gap-2">
            <img
              v-if="post.author.avatar"
              :src="post.author.avatar"
              :alt="post.author.name"
              class="w-6 h-6 rounded-full object-cover"
            />
            <div
              v-else
              class="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
            >
              <UIcon name="lucide:user" class="text-xs text-muted" />
            </div>
            <span class="text-sm text-muted">{{ post.author.name }}</span>
          </div>

          <!-- Title -->
          <h2 class="text-xl sm:text-2xl font-bold text-highlighted group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {{ post.title }}
          </h2>

          <!-- Excerpt -->
          <p v-if="post.excerpt" class="text-base text-muted line-clamp-2 hidden sm:block">
            {{ post.excerpt }}
          </p>

          <!-- Date -->
          <span class="text-sm text-muted mt-auto pt-2">{{ formatDate(post.date) }}</span>
        </div>

        <!-- Right: thumbnail -->
        <div class="w-28 h-20 sm:w-40 sm:h-28 flex-shrink-0 rounded overflow-hidden">
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
          >
            <UIcon name="lucide:file-text" class="text-primary/60 text-2xl" />
          </div>
        </div>
      </NuxtLink>

      <!-- Infinite scroll sentinel -->
      <div ref="sentinel" class="py-8 flex justify-center">
        <UIcon
          v-if="loadingMore"
          name="lucide:loader-circle"
          class="animate-spin text-muted text-xl"
        />
      </div>
    </div>
  </UMain>
</template>
