// utils/links.ts
import type { NavigationMenuItem } from '@nuxt/ui'
import { computed } from 'vue'
import { useI18n } from '#i18n'

export function useNavLinks() {
  const { locale, t } = useI18n()

  return computed<NavigationMenuItem[]>(() => {
    const prefix = locale.value === 'en' ? '' : `/${locale.value}`
    return [
      { label: t('topbar.home'), icon: 'i-lucide-home', to: `${prefix}/` },
      { label: t('topbar.projects'), icon: 'i-lucide-folder', to: `${prefix}/projects` },
      { label: t('topbar.speaking'), icon: 'i-lucide-mic', to: `${prefix}/speaking` },
      { label: t('topbar.about'), icon: 'i-lucide-user', to: `${prefix}/about` }
    ]
  })
}
