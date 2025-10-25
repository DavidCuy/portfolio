<script setup lang="ts">
const languageSelected = useState('language', () => 'en')
const { locale, t } = useI18n()

const switchLanguage = () => {
  const nextLanguage = languageSelected.value === 'en' ? 'es' : 'en'
  
  languageSelected.value = nextLanguage
  locale.value = nextLanguage

  // compute new path: replace first path segment (locale) with nextLanguage
  const route = useRoute()
  const currentPath = route.path || '/'

  // If path begins with a 2-letter segment like /en or /es, replace it.
  // Otherwise, prefix the path with the new locale.
  const selectedPathLanguage = nextLanguage !== 'en' ? `/${nextLanguage}` : ''
  let newPath = currentPath.replace(/^\/([a-z]{2})(?=\/|$)/, selectedPathLanguage)
  if (newPath === currentPath) {
    // No leading locale segment found — prefix it
    if (currentPath === '/') newPath = selectedPathLanguage
    else newPath = `${selectedPathLanguage}${currentPath}`
  }

  // navigate client-side; replace history so toggles don't bloat history
  navigateTo(newPath, { replace: true })
}
 
</script>

<template>
  <ClientOnly>
    <UTooltip
        :text="`${t('topbar.buttons.language.tooltipTxt')}`"
        :delay-duration="0.5">
        <UButton
            :aria-label="`${t('topbar.buttons.language.aria-label')} ${languageSelected}`"
            :icon="`${languageSelected === 'en' ? 'flag:us-4x3' : 'flag:mx-4x3'}`"
            color="neutral"
            variant="ghost"
            size="sm"
            class="rounded-full cursor-pointer"
            @click="switchLanguage"
        />
    </UTooltip>
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>
