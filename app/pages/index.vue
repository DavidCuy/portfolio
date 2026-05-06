<script setup lang="ts">
const { t } = useI18n()
useSeoMeta({
  title: t('seo.home.title', 'David Cuy — Cloud Architect'),
  description: t('seo.home.description', 'Cloud Architect & Software Engineer based in Mérida, MX.')
})

definePageMeta({ layout: 'default' })
</script>

<template>
  <main class="page-enter">
    <LandingHero />
    <LandingTechStrip />
    <LandingAbout />
    <LandingExperience />
    <LandingSkills />
    <LandingTestimonials />
    <LandingLatestPosts />
    <LandingHomeCta />
  </main>
</template>
