<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true
  }
})

const localePath = useLocalePath()

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.'
})
</script>

<template>
  <div class="page">
    <AppHeader />
    <main
      class="container"
      style="padding: 80px 32px; min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center"
    >
      <h1>{{ error.statusCode }}</h1>
      <p style="color: var(--fg-muted); margin: 12px 0 24px">
        {{ error.message }}
      </p>
      <DcButton
        variant="primary"
        :to="localePath('/')"
        icon-after="i-lucide-arrow-right"
      >
        Home
      </DcButton>
    </main>
    <AppFooter />
  </div>
</template>
