<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface AboutData {
  badge?: LocalizedString
  title?: LocalizedString
  intro?: LocalizedText
  paragraphs?: { en?: string[], es?: string[] }
  blockquote?: { text?: LocalizedText, cite?: LocalizedString }
  contactEmail?: string
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data } = await useAsyncData('about-page', () =>
  sanity.fetch<AboutData | null>(groq`*[_type=="aboutPage"][0]`)
)

const paragraphs = computed(() => {
  const p = data.value?.paragraphs
  if (!p) return []
  return (locale.value === 'es' ? p.es : p.en) || []
})

useSeoMeta({
  title: t('about.seoTitle', 'About · David Cuy'),
  description: t('about.seoDescription', 'Cloud Architect & Software Engineer based in Mérida, MX.')
})
</script>

<template>
  <main
    v-if="data"
    class="page-enter"
  >
    <section
      class="container-narrow"
      style="padding: 80px 32px 40px"
    >
      <DcBadge category="leadership">
        {{ localized(data.badge) }}
      </DcBadge>
      <h1 style="font-family: var(--font-display); font-size: clamp(40px, 5vw, 56px); line-height: 1.05; letter-spacing: -0.02em; color: var(--fg-strong); font-weight: 700; margin: 18px 0 20px">
        {{ localized(data.title) }}
      </h1>
      <p style="font-family: var(--font-display); font-size: 22px; line-height: 34px; color: var(--fg-strong); font-weight: 600; letter-spacing: -0.01em; margin-bottom: 28px">
        {{ localized(data.intro) }}
      </p>
      <p
        v-for="(p, i) in paragraphs"
        :key="i"
        style="font-size: 17px; line-height: 29px; color: var(--fg); margin-bottom: 20px"
      >
        {{ p }}
      </p>
      <blockquote
        v-if="data.blockquote"
        style="font-family: var(--font-display); font-size: 28px; line-height: 38px; font-weight: 500; color: var(--fg-strong); margin: 48px 0; padding: 0; border: 0; background: transparent; letter-spacing: -0.01em; max-width: 640px"
      >
        {{ localized(data.blockquote.text) }}
      </blockquote>
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px">
        <DcButton
          v-if="data.contactEmail"
          variant="primary"
          icon="i-lucide-mail"
          :href="`mailto:${data.contactEmail}`"
        >
          {{ data.contactEmail }}
        </DcButton>
        <DcButton
          variant="ghost"
          icon-after="i-lucide-arrow-up-right"
          :to="localePath('/services')"
        >
          {{ t('about.seeServices', 'See services') }}
        </DcButton>
      </div>
    </section>
  </main>
</template>
