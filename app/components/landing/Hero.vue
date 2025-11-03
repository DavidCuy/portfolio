<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'
import { computed } from 'vue'
import { getLocalized } from '~/utils/getLocalized'

const { locale } = useI18n()
const { footer, global } = useAppConfig()

// --- localized computed helpers (uses shared util) ---

const props = defineProps<{ page: IndexCollectionItem }>()

const title = computed(() => {
  const heroTitle = props.page?.hero.title
  return getLocalized(heroTitle, locale.value?.toString()) || ''
})

const description = computed(() => {
  const p = props.page
  const seoDesc = p?.seo?.description
  return getLocalized(seoDesc, locale.value?.toString()) || getLocalized(p?.description, locale.value?.toString()) || ''
})

const heroLinks = computed(() => {
  const p = props.page
  const links = Array.isArray(p?.hero?.links) ? p.hero.links : []
  const loc = locale.value?.toString() || 'en'
  return links.map((l: any) => ({ ...l, label: getLocalized(l.label, loc) }))
})

const texts = props.page?.hero?.highlightedText?.length
  ? props.page.hero.highlightedText.map((t: any) => getLocalized(t, locale.value?.toString() || 'en'))
  : [];

const availableText = computed(() => {
  const availableSection = global.available
  const availableStatus = availableSection?.status || false
  if (availableStatus) return getLocalized(availableSection?.availableText, locale.value?.toString()) || ''

  return getLocalized(availableSection?.unavailableText, locale.value?.toString()) || ''
})

</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-lg mx-auto',
      links: 'mt-4 flex-col justify-center items-center'
    }"
  >
    <template #headline>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
        <UColorModeAvatar
          class="size-18 ring ring-default ring-offset-3 ring-offset-(--ui-bg)"
          :light="global.picture?.light!"
          :dark="global.picture?.dark!"
          :alt="global.picture?.alt!"
          width="256"
          height="256"
        />
      </Motion>
    </template>

    <template #title>
      <div>
      </div>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
      {{ title }}
      </Motion>

      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.1
        }"
      >
      <TextWriter
        :texts="texts"
        :interval="5000"
      />
      </Motion>
    </template>

    <template #description>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.3
        }"
      >
  {{ description }}
      </Motion>
    </template>

    <template #links>
      <Motion
        :initial="{
          scale: 1.1,
          opacity: 0,
          filter: 'blur(20px)'
        }"
        :animate="{
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)'
        }"
        :transition="{
          duration: 0.6,
          delay: 0.5
        }"
      >
        <div
          v-if="heroLinks && heroLinks.length"
          class="flex items-center gap-2"
        >
          <UButton v-bind="heroLinks[0]" />
          <UButton
            :color="global.available.status ? 'success' : 'error'"
            variant="ghost"
            class="gap-2"
            :to="global.available.status ? global.meeting.link : ''"
            :label="availableText"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available.status ? 'bg-success animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available.status ? 'bg-success' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of footer?.links"
          :key="index"

          :initial="{
            scale: 1.1,
            opacity: 0,
            filter: 'blur(20px)'
          }"
          :animate="{
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)'
          }"
          :transition="{
            duration: 0.6,
            delay: 0.5 + index * 0.1
          }"
        >
          <UButton
            v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }"
          />
        </Motion>
      </div>
    </template>

  </UPageHero>
</template>
