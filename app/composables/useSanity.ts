import type { SanityClient } from '@sanity/client'

export function useSanity() {
  const { $sanity } = useNuxtApp()
  return $sanity as unknown as SanityClient
}

export type LocalizedString = { en?: string, es?: string } | string | null | undefined
export type LocalizedText = { en?: string, es?: string } | string | null | undefined

export function pickLocalized(value: LocalizedString, locale: string): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[locale as 'en' | 'es'] || value.en || value.es || ''
}

export function useLocalizedFn() {
  const { locale } = useI18n()
  return (v: LocalizedString) => pickLocalized(v, locale.value)
}
