<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface AboutData {
  label?: LocalizedString
  title?: LocalizedString
  paragraph1?: LocalizedText
  paragraph2?: LocalizedText
  ctaLabel?: LocalizedString
  stats?: Array<{ n: string, u: LocalizedString }>
}

const sanity = useSanity()
const localized = useLocalizedFn()
const localePath = useLocalePath()

const { data } = await useAsyncData('home-about', () =>
  sanity.fetch<AboutData | null>(groq`*[_type=="home"][0].about`)
)
</script>

<template>
  <section
    v-if="data"
    class="container section"
  >
    <DcSectionHead
      :label="localized(data.label)"
      :title="localized(data.title)"
      num="— /about"
    />
    <div class="about-grid">
      <div>
        <p class="lead">
          {{ localized(data.paragraph1) }}
        </p>
        <p>{{ localized(data.paragraph2) }}</p>
        <DcButton
          v-if="data.ctaLabel"
          variant="ghost"
          icon-after="i-lucide-arrow-right"
          :to="localePath('/about')"
        >
          {{ localized(data.ctaLabel) }}
        </DcButton>
      </div>
      <div>
        <div
          v-for="(s, i) in data.stats || []"
          :key="i"
          class="about-stat"
        >
          <span class="n">{{ s.n }}</span>
          <span class="u">{{ localized(s.u) }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
