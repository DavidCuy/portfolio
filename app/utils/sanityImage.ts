/**
 * Append Sanity image-pipeline params to optimize delivery.
 * Docs: https://www.sanity.io/docs/image-urls
 */
export interface SanityImageOpts {
  w?: number
  h?: number
  q?: number
  fit?: 'crop' | 'max' | 'fill' | 'fillmax' | 'min' | 'scale' | 'clip'
  fm?: 'webp' | 'avif' | 'jpg' | 'png'
}

export function sanityImg(url?: string | null, opts: SanityImageOpts = {}): string {
  if (!url) return ''
  if (!url.includes('cdn.sanity.io')) return url
  const params = new URLSearchParams()
  params.set('w', String(opts.w ?? 800))
  params.set('q', String(opts.q ?? 75))
  params.set('fit', opts.fit ?? 'max')
  params.set('auto', 'format')
  if (opts.h) params.set('h', String(opts.h))
  if (opts.fm) params.set('fm', opts.fm)
  return `${url}?${params.toString()}`
}
