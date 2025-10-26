<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { locale } = useI18n()
const props = defineProps<{
  page: IndexCollectionItem
}>()

const aboutTitle = computed(() => {
  const aboutSection = props.page.about
  return getLocalized(aboutSection?.title, locale.value?.toString()) || ''
})

const aboutDescription = computed(() => {
  const aboutSection = props.page.about
  return getLocalized(aboutSection?.description, locale.value?.toString()) || ''
})
</script>

<template>
  <UPageSection
    :title="aboutTitle"
    :description="aboutDescription"
    :ui="{
      container: '!p-0',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-3 text-sm sm:text-md lg:text-sm text-muted'
    }"
  />
</template>

<style scoped>

</style>
