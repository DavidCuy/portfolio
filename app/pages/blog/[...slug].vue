<script setup lang="ts">
import type { SanityClient } from '@sanity/client'
import { PortableText } from '@portabletext/vue'
import { h, defineComponent } from 'vue'

const localePath = useLocalePath()
const { t } = useI18n()

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
  categories: { _id: string; title: string }[] | null
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
  "image": mainImage.asset->url,
  "date": publishedAt,
  "author": author->{ name, "avatar": image.asset->url },
  "categories": categories[]->{ _id, title },
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
  sanity.fetch<{ prev: SurroundPost | null; next: SurroundPost | null }>(
    SURROUND_QUERY,
    { date: post.value?.date || new Date().toISOString() }
  )
)

// Portable Text: custom components for images and links
const ptComponents = {
  types: {
    image: defineComponent({
      props: ['value'],
      setup(props) {
        return () => props.value?.url
          ? h('img', {
              src: props.value.url,
              alt: props.value.alt || '',
              class: 'rounded-lg w-full my-6 object-cover'
            })
          : null
      }
    })
  },
  marks: {
    link: defineComponent({
      props: ['value'],
      setup(props, { slots }) {
        return () => h('a', {
          href: props.value?.href,
          target: '_blank',
          rel: 'noopener noreferrer'
        }, slots.default?.())
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
  <UMain class="mt-20 px-2">
    <UContainer class="relative min-h-screen">
      <UPage v-if="post">
        <ULink
          :to="localePath('/blog')"
          class="text-sm flex items-center gap-1 text-muted hover:text-highlighted transition-colors"
        >
          <UIcon name="lucide:chevron-left" />
          {{ $t('blog.title') }}
        </ULink>

        <!-- Header -->
        <div class="flex flex-col gap-4 mt-8 mb-2">
          <p v-if="post.date" class="text-xs text-muted text-center">
            {{ formatDate(post.date) }}
          </p>

          <!-- Cover image -->
          <img
            v-if="post.image"
            :src="post.image"
            :alt="post.title"
            class="rounded-lg w-full h-[300px] sm:h-[400px] object-cover object-center"
          />
          <div
            v-else
            class="rounded-lg w-full h-[200px] bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center"
          >
            <UIcon name="lucide:file-text" class="text-primary/40 text-5xl" />
          </div>

          <!-- Title -->
          <h1 class="text-3xl sm:text-4xl text-center font-bold max-w-3xl mx-auto mt-2 leading-tight">
            {{ post.title }}
          </h1>

          <!-- Excerpt -->
          <p v-if="post.excerpt" class="text-muted text-center max-w-2xl mx-auto">
            {{ post.excerpt }}
          </p>

          <!-- Author -->
          <div v-if="post.author" class="flex items-center justify-center gap-3 mt-2">
            <img
              v-if="post.author.avatar"
              :src="post.author.avatar"
              :alt="post.author.name"
              class="w-10 h-10 rounded-full object-cover ring-2 ring-default"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-default"
            >
              <UIcon name="lucide:user" class="text-muted" />
            </div>
            <span class="text-sm font-medium">{{ post.author.name }}</span>
          </div>

          <!-- Categories -->
          <div v-if="post.categories?.length" class="flex flex-wrap gap-2 justify-center">
            <span
              v-for="cat in post.categories"
              :key="cat._id"
              class="px-3 py-1 rounded-full bg-muted/60 text-xs font-medium"
            >
              {{ cat.title }}
            </span>
          </div>
        </div>

        <!-- Body -->
        <UPageBody class="max-w-3xl mx-auto prose dark:prose-invert prose-headings:font-bold prose-a:text-primary prose-img:rounded-lg">
          <PortableText
            v-if="post.body?.length"
            :value="post.body"
            :components="ptComponents"
          />

          <!-- Actions -->
          <div class="flex items-center justify-end gap-2 text-sm text-muted mt-8 not-prose">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              icon="lucide:link"
              :label="$t('blog.copyLink')"
              @click="copyToClipboard(articleLink, t('blog.linkCopied'))"
            />
          </div>

          <!-- Prev / Next -->
          <div
            v-if="surround?.prev || surround?.next"
            class="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-default not-prose"
          >
            <NuxtLink
              v-if="surround?.prev"
              :to="localePath(`/blog/${surround.prev.slug}`)"
              class="flex flex-col gap-1 group"
            >
              <span class="text-xs text-muted flex items-center gap-1">
                <UIcon name="lucide:chevron-left" />
                {{ $t('blog.prev') }}
              </span>
              <span class="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                {{ surround.prev.title }}
              </span>
            </NuxtLink>
            <div v-else />

            <NuxtLink
              v-if="surround?.next"
              :to="localePath(`/blog/${surround.next.slug}`)"
              class="flex flex-col gap-1 text-right group"
            >
              <span class="text-xs text-muted flex items-center gap-1 justify-end">
                {{ $t('blog.next') }}
                <UIcon name="lucide:chevron-right" />
              </span>
              <span class="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                {{ surround.next.title }}
              </span>
            </NuxtLink>
          </div>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
