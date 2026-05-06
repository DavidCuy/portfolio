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

const isExternal = (url?: string) => !!url && /^https?:\/\//.test(url)
const primaryTo = computed(() => {
  const u = data.value?.cta?.primary?.to
  return u && !isExternal(u) ? localePath(u) : undefined
})
const primaryHref = computed(() => {
  const u = data.value?.cta?.primary?.to
  return isExternal(u) ? u : undefined
})
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
      :primary-to="primaryTo"
      :primary-href="primaryHref"
      :secondary-note="localized(data.cta.secondaryNote)"
    />
  </section>
</template>
