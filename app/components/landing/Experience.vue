<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface Experience {
  _id: string
  year?: string
  role?: LocalizedString
  company?: string
  city?: string
  description?: LocalizedText
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { t } = useI18n()

const { data } = await useAsyncData('home-experience', () =>
  sanity.fetch<Experience[]>(groq`*[_type=="experience"] | order(order desc)`)
)
</script>

<template>
  <section
    v-if="data?.length"
    class="container section"
  >
    <DcSectionHead
      :label="t('exp.label', '02 · Experience')"
      :title="t('exp.title', 'A decade, a few war stories.')"
      num="— /experience"
    />
    <div class="timeline">
      <div
        v-for="r in data"
        :key="r._id"
        class="exp-row"
      >
        <div class="exp-year">
          {{ r.year }}
        </div>
        <div class="exp-role">
          <h3>{{ localized(r.role) }}</h3>
          <div class="co">
            {{ r.company }}<span class="bullet">·</span>{{ r.city }}
          </div>
          <p>{{ localized(r.description) }}</p>
        </div>
        <div class="exp-arrow">
          <UIcon name="i-lucide-arrow-up-right" />
        </div>
      </div>
    </div>
  </section>
</template>
