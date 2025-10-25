import type { NavigationMenuItem } from '@nuxt/ui'
import { computed } from 'vue'
import { useI18n } from '#i18n'

/**
 * useNavLinks()
 * Returns a computed NavigationMenuItem[] which uses `t()` so labels update
 * whenever the active locale changes.
 */
export function useNavLinks() {
  const { locale, t } = useI18n()
  console.log('Current locale in useNavLinks():', locale.value)
  const prefix = computed(() => locale.value === 'en' ? '' : `/${locale.value}`)

  return computed<NavigationMenuItem[]>(() => [{
    label: t('topbar.home'),
    icon: 'i-lucide-home',
    to: `${prefix.value}/`
  }, {
    label: t('topbar.projects'),
    icon: 'i-lucide-folder',
    to: `${prefix.value}/projects`
  }, {
    label: t('topbar.blog'),
    icon: 'i-lucide-file-text',
    to: `${prefix.value}/blog`
  }, {
    label: t('topbar.speaking'),
    icon: 'i-lucide-mic',
    to: `${prefix.value}/speaking`
  }, {
    label: t('topbar.about'),
    icon: 'i-lucide-user',
    to: `${prefix.value}/about`
  }])
}
