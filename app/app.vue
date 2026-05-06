<script setup lang="ts">
const { locale } = useI18n()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#08152A' : '#FFFFFF')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: locale.value?.toString() || 'en'
  }
})

useSeoMeta({
  titleTemplate: '%s',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
