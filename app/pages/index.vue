<script setup lang="ts">
import { useI18n } from '#i18n'

const { locale } = useI18n()

const { data: page } = await useAsyncData('index', () => {
  return queryCollection('index').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const languageSelected = locale.value?.toString() || 'en'
const seoRef = (page.value?.seo?.[languageSelected] as { title?: string; description?: string }) || { title: '', description: '' }

useSeoMeta({
  title: seoRef.title || 'Home',
  ogTitle: seoRef.title || 'Home',
  description: seoRef.description || '',
  ogDescription: seoRef.description || ''
})
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: '!pt-0 lg:grid lg:grid-cols-2 lg:gap-8'
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>
    <LandingBlog :page />
    <LandingTestimonials :page />
    <LandingFAQ :page />
  </UPage>
</template>
