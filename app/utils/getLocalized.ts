export function getLocalized(field: any, loc?: string) {
  const locale = loc || 'en'
  if (field == null) return ''
  if (typeof field === 'string') return field
  if (typeof field === 'object') {
    if (field[locale]) return field[locale]
    const first = Object.values(field)[0]
    if (first) return first
  }
  return ''
}
