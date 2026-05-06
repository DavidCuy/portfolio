import { defineEventHandler, setHeader } from 'h3'

const SITE_URL = process.env.SITE_URL || 'https://davidcuy.github.io'
const SANITY_PROJECT = 'my6ptkxm'
const SANITY_DATASET = 'production'

const escape = (s: unknown) => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;')

interface Post {
  title: string
  slug: string
  excerpt: string | null
  date: string
  author: string | null
  category: string | null
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  const groqQuery = `*[_type=="post" && defined(slug.current)] | order(publishedAt desc) [0...20] {
    title, "slug": slug.current, excerpt, "date": publishedAt, "author": author->name, category
  }`

  let posts: Post[] = []
  try {
    const res = await fetch(
      `https://${SANITY_PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groqQuery)}`
    )
    const { result } = await res.json() as { result: Post[] }
    posts = result || []
  } catch (err) {
    console.warn('[rss.xml] Sanity fetch failed:', err)
  }

  const items = posts.map(p => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${p.author ? `<author>noreply@davidcuy.dev (${escape(p.author)})</author>` : ''}
      ${p.category ? `<category>${escape(p.category)}</category>` : ''}
      <description><![CDATA[${p.excerpt || ''}]]></description>
    </item>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>David Cuy — Blog</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Cloud Architect &amp; Software Engineer. Essays on real architecture.</description>
    <language>es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
})
