<script setup lang="ts">
import { useI18n } from '#i18n'
import { getLocalized } from '~/utils/getLocalized'

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

const title = computed(() => {
  const seoTitle = page.value?.seo?.title
  return getLocalized(seoTitle, locale.value?.toString()) || getLocalized(page.value?.seo?.title, locale.value?.toString()) || ''
})

const description = computed(() => {
  const seoDesc = page.value?.seo?.description
  return getLocalized(seoDesc, locale.value?.toString()) || getLocalized(page.value?.seo?.description, locale.value?.toString()) || ''
})

useSeoMeta({
  title: title || 'Home',
  ogTitle: title || 'Home',
  description: description || '',
  ogDescription: description || ''
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
