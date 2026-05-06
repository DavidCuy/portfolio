<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface HeroData {
  hero?: {
    eyebrow?: LocalizedString
    titleLines?: { en?: string[], es?: string[] }
    lede?: LocalizedText
    ctaPrimary?: { label?: LocalizedString, to?: string }
    ctaSecondary?: { label?: LocalizedString, to?: string }
    location?: string
    responseTime?: LocalizedString
    languages?: string
  } | null
  badges?: Array<{
    icon?: string
    title?: LocalizedString
    subtitle?: LocalizedString
  }> | null
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { locale } = useI18n()
const localePath = useLocalePath()

const { data } = await useAsyncData('home-hero', () =>
  sanity.fetch<HeroData | null>(groq`*[_type=="home"][0]{ hero, badges }`)
)

const titleLines = computed(() => {
  const lines = data.value?.hero?.titleLines
  if (!lines) return []
  return (locale.value === 'es' ? lines.es : lines.en) || []
})

function renderLine(line: string) {
  const m = line.match(/^(.*?)\*(.+?)\*(.*)$/)
  if (!m) return { plain: line, italic: null, after: null }
  return { plain: m[1], italic: m[2], after: m[3] }
}

const iconMap: Record<string, string> = {
  cloud: 'i-lucide-cloud',
  zap: 'i-lucide-zap',
  award: 'i-lucide-award',
  trophy: 'i-lucide-trophy'
}
</script>

<template>
  <section
    v-if="data?.hero"
    class="container"
  >
    <div class="hero">
      <div>
        <div class="hero-eyebrow">
          {{ localized(data.hero.eyebrow) }}
        </div>
        <h1>
          <template
            v-for="(line, i) in titleLines"
            :key="i"
          >
            <br v-if="i > 0">
            <template v-if="renderLine(line).italic">
              {{ renderLine(line).plain }}{{ renderLine(line).italic }}{{ renderLine(line).after }}
            </template>
            <template v-else>
              {{ line }}
            </template>
          </template>
        </h1>
        <p class="lede">
          {{ localized(data.hero.lede) }}
        </p>
        <div class="hero-cta">
          <DcButton
            v-if="data.hero.ctaPrimary?.label"
            variant="primary"
            size="lg"
            icon-after="i-lucide-arrow-right"
            :to="data.hero.ctaPrimary.to ? localePath(data.hero.ctaPrimary.to) : undefined"
          >
            {{ localized(data.hero.ctaPrimary.label) }}
          </DcButton>
          <DcButton
            v-if="data.hero.ctaSecondary?.label"
            variant="ghost"
            size="lg"
            icon-after="i-lucide-arrow-up-right"
            :to="data.hero.ctaSecondary.to ? localePath(data.hero.ctaSecondary.to) : undefined"
          >
            {{ localized(data.hero.ctaSecondary.label) }}
          </DcButton>
        </div>
        <div class="hero-meta">
          <span v-if="data.hero.location"><UIcon name="i-lucide-map-pin" /> {{ data.hero.location }}</span>
          <span v-if="data.hero.responseTime"><UIcon
            name="i-lucide-circle"
            style="color: var(--success)"
          /> {{ localized(data.hero.responseTime) }}</span>
          <span v-if="data.hero.languages">{{ data.hero.languages }}</span>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-avatar">
          <img
            src="/mascots/mascot-coder.webp"
            alt="David Cuy — illustrated as a cat barista coding"
          >
        </div>
        <div
          v-if="data.badges?.[0]"
          class="hero-badge hero-badge-loc"
        >
          <div class="ico">
            <UIcon :name="iconMap[data.badges[0].icon || 'cloud'] || 'i-lucide-cloud'" />
          </div>
          <div>
            <div class="t">
              {{ localized(data.badges[0].title) }}
            </div>
            <div class="s">
              {{ localized(data.badges[0].subtitle) }}
            </div>
          </div>
        </div>
        <div
          v-if="data.badges?.[1]"
          class="hero-badge hero-badge-aws"
        >
          <div class="ico">
            <UIcon :name="iconMap[data.badges[1].icon || 'zap'] || 'i-lucide-zap'" />
          </div>
          <div>
            <div class="t">
              {{ localized(data.badges[1].title) }}
            </div>
            <div class="s">
              {{ localized(data.badges[1].subtitle) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
