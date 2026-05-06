<script setup lang="ts">
import groq from 'groq'
import type { LocalizedString, LocalizedText } from '~/composables/useSanity'

interface Service {
  _id: string
  num: string
  title: LocalizedString
  description: LocalizedText
  bullets: { en?: string[], es?: string[] }
  featured: boolean
  ctaLabel?: LocalizedString
}

interface ProcessStep {
  _id: string
  num: string
  title: LocalizedString
  description: LocalizedText
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data } = await useAsyncData('services-page', () =>
  Promise.all([
    sanity.fetch<Service[]>(groq`*[_type=="service"] | order(order asc)`),
    sanity.fetch<ProcessStep[]>(groq`*[_type=="processStep"] | order(order asc)`),
    sanity.fetch<{
      headline?: LocalizedString
      body?: LocalizedText
      primary?: { label?: LocalizedString, to?: string }
      secondaryNote?: LocalizedString
    } | null>(groq`*[_type=="settings"][0].cta`),
    sanity.fetch<string | null>(groq`*[_type=="settings"][0].footer.contact.email`)
  ]).then(([services, steps, cta, contactEmail]) => ({ services, steps, cta, contactEmail }))
)

const bulletsFor = (s: Service) => {
  const list = s.bullets || {}
  return (locale.value === 'es' ? list.es : list.en) || []
}

useSeoMeta({
  title: t('services.seoTitle', 'Services · David Cuy'),
  description: t('services.seoDescription', 'Three ways to work together. Architecture review, fractional tech leadership, new system design.')
})
</script>

<template>
  <main class="page-enter">
    <section class="container">
      <div class="blog-hero">
        <div>
          <div class="hero-eyebrow">
            {{ t('services.eyebrow', 'Booking Q3 2026') }}
          </div>
          <h1>{{ t('services.h1', 'How I can help.') }}</h1>
          <p>{{ t('services.intro', 'Three ways to work together. All include honesty, ADRs, and a coffee.') }}</p>
        </div>
        <div class="mascot">
          <img
            src="/mascots/mascot-speaker.webp"
            alt=""
          >
        </div>
      </div>

      <div
        v-if="data?.services?.length"
        class="services-grid"
      >
        <DcServiceCard
          v-for="s in data.services"
          :key="s._id"
          :service="{
            num: s.num,
            title: localized(s.title),
            description: localized(s.description),
            bullets: bulletsFor(s),
            featured: s.featured,
            ctaLabel: localized(s.ctaLabel) || t('services.getInTouch', 'Get in touch')
          }"
          :most-booked-label="t('services.mostBooked')"
          :contact-email="data.contactEmail || undefined"
        />
      </div>
    </section>

    <section
      v-if="data?.steps?.length"
      class="container section"
    >
      <DcSectionHead
        :label="t('process.label', 'How we work')"
        :title="t('process.title', 'A short process, no mystery.')"
        num="— /process"
      />
      <div class="process-steps">
        <div
          v-for="s in data.steps"
          :key="s._id"
          class="process-step"
        >
          <div class="n">
            {{ s.num }}
          </div>
          <h4>{{ localized(s.title) }}</h4>
          <p>{{ localized(s.description) }}</p>
        </div>
      </div>
    </section>

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
  </main>
</template>
