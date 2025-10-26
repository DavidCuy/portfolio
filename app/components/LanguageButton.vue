<script setup lang="ts">
const { locale, t, loadLocaleMessages } = useI18n() 
import { useRoute, navigateTo } from '#imports'

const switchLanguage = async () => {
  const nextLanguage = locale.value === 'en' ? 'es' : 'en'
  try {
    await loadLocaleMessages(nextLanguage)
  } catch (error) {
    console.error(`Error loading locale messages for ${nextLanguage}:`, error)
    return 
  }
  locale.value = nextLanguage 

  // 3. ACTUALIZAR LA RUTA
  const route = useRoute()
  const currentPath = route.path || '/'

  const selectedPathLanguage = nextLanguage !== 'en' ? `/${nextLanguage}` : ''
  let newPath = currentPath.replace(/^\/(es|en)(?=\/|$)/, selectedPathLanguage)

  if (newPath === currentPath) {
    if (currentPath === '/') {
        newPath = selectedPathLanguage || '/'
    } else {
        newPath = `${selectedPathLanguage}${currentPath}`
    }
  }

  if (newPath === selectedPathLanguage) {
     newPath = selectedPathLanguage || '/'
  }
  navigateTo(newPath, { replace: true })
}
</script>

<template>
  <ClientOnly>
    <UTooltip
      :text="t('topbar.buttons.language.tooltipTxt')"
      :delay-duration="0.5"
    >
      <UButton
        :icon="locale === 'en' ? 'flag:us-4x3' : 'flag:mx-4x3'"
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