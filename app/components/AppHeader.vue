<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useI18n } from '#i18n'
import { computed, onBeforeMount } from 'vue'

const { locale, t, getLocaleMessage, availableLocales, loadLocaleMessages } = useI18n()

onBeforeMount(async () => {
  if (!availableLocales.includes(locale.value)) {
    await loadLocaleMessages(locale.value)
  }
})

const props = defineProps<{
  links: NavigationMenuItem[] | any // ref or array
}>()

// ✅ Desenrollamos ref o array dinámicamente
const links = computed(() => props.links?.value ?? props.links)

console.log('[HEADER] locale:', locale.value)
console.log('[HEADER] messages:', getLocaleMessage(locale.value))
console.log('[HEADER] t(home):', t('topbar.home'))
</script>

<template>
  <div class="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 z-10 w-max max-w-[calc(100vw-1rem)]">
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="bg-muted/80 backdrop-blur-sm rounded-full px-1 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
      :ui="{
        link: 'px-1.5 sm:px-2 py-1',
        linkLeadingIcon: 'sm:hidden',
        linkLabel: 'hidden sm:inline'
      }"
    >
      <template #list-trailing>
        <ColorModeButton />
        <LanguageButton />
        <ResumeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>
