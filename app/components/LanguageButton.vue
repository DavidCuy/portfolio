<script setup lang="ts">
const languageSelected = useState('language', () => 'en')

const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()

const switchLanguage = () => {
  const nextLanguage = languageSelected.value === 'en' ? 'es' : 'en'
  languageSelected.value = nextLanguage
  
  const path = switchLocalePath(nextLanguage)
  console.log('Switching language to:', nextLanguage, path)
  navigateTo(path)
}
</script>

<template>
  <ClientOnly>
    <UButton
      :aria-label="`Switch to ${languageSelected}`"
      :icon="`${languageSelected === 'en' ? 'flag:us-4x3' : 'flag:mx-4x3'}`"
      color="neutral"
      variant="ghost"
      size="sm"
      class="rounded-full"
      @click="switchLanguage"
    />
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>
