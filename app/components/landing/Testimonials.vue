<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface Testimonial {
  _id: string
  name: string
  role: LocalizedString
  quote: LocalizedText
  avatar?: string
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { t } = useI18n()

const { data } = await useAsyncData('home-testimonials', () =>
  sanity.fetch<Testimonial[]>(groq`*[_type=="testimonial"] | order(order asc)`)
)
</script>

<template>
  <section
    v-if="data?.length"
    class="container section"
  >
    <DcSectionHead
      :label="t('tmnl.label', '04 · References')"
      :title="t('tmnl.title', 'What people who worked with me say.')"
      num="— /testimonials"
    />
    <div class="tmnl-grid">
      <DcTestimonialCard
        v-for="item in data"
        :key="item._id"
        :testimonial="{ name: item.name, role: localized(item.role), quote: localized(item.quote), avatar: item.avatar }"
      />
    </div>
  </section>
</template>
