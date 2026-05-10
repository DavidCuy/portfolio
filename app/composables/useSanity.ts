// Minimal Sanity fetch wrapper — drops @sanity/client SDK to shrink bundle.
// Read-only: query via public CDN, no mutations needed.

const PROJECT_ID = 'my6ptkxm'
const DATASET = 'production'
const API_VERSION = '2024-01-01'
const BASE = `https://${PROJECT_ID}.apicdn.sanity.io/v${API_VERSION}/data/query/${DATASET}`

interface FetchOpts {
  params?: Record<string, string | number | boolean | null | undefined>
}

export interface SanityLike {
  fetch: <T = unknown>(query: string, params?: FetchOpts['params']) => Promise<T>
}

async function sanityFetch<T = unknown>(query: string, params?: FetchOpts['params']): Promise<T> {
  const url = new URL(BASE)
  url.searchParams.set('query', query)
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(`$${k}`, JSON.stringify(v))
    }
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Sanity ${res.status}: ${await res.text().catch(() => res.statusText)}`)
  const { result } = await res.json() as { result: T }
  return result
}

export function useSanity(): SanityLike {
  return { fetch: sanityFetch }
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
