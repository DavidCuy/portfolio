<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface CtaData {
  cta?: {
    headline?: LocalizedString
    body?: LocalizedText
    primary?: { label?: LocalizedString, to?: string }
    secondaryNote?: LocalizedString
  } | null
}

const sanity = useSanity()
const localized = useLocalizedFn()
const localePath = useLocalePath()

const { data } = await useAsyncData('site-cta', () =>
  sanity.fetch<CtaData | null>(groq`*[_type=="settings"][0]{ cta }`)
)
</script>

<template>
  <section
    v-if="data?.cta"
    class="container"
    style="padding-bottom: 96px"
  >
    <DcCtaBand
      :headline="localized(data.cta.headline)"
      :body="localized(data.cta.body)"
      :primary-label="localized(data.cta.primary?.label) || 'Book a call'"
      :primary-to="data.cta.primary?.to ? localePath(data.cta.primary.to) : undefined"
      :secondary-note="localized(data.cta.secondaryNote)"
    />
  </section>
</template>
