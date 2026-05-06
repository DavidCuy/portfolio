import { copyFileSync, existsSync, writeFileSync } from 'fs'
import { join } from 'path'

const outputDir = '.output/public'
const SITE_URL = process.env.SITE_URL || 'https://davidcuy.github.io'
const SANITY_PROJECT = 'my6ptkxm'
const SANITY_DATASET = 'production'

// 1. SPA fallback for GitHub Pages
const indexPath = join(outputDir, 'index.html')
const notFoundPath = join(outputDir, '404.html')

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath)
  console.log('Created 404.html for GitHub Pages SPA fallback')
} else {
  console.warn('index.html not found in output directory')
}

// 2. RSS feed generation (writes static .output/public/rss.xml for prod)
async function generateRss() {
  const groqQuery = `*[_type=="post" && defined(slug.current)] | order(publishedAt desc) [0...20] {
    title, "slug": slug.current, excerpt, "date": publishedAt, "author": author->name, category
  }`
  const url = `https://${SANITY_PROJECT}.apicdn.sanity.io/v2024-01-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(groqQuery)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status}`)
  const { result } = await res.json()
  if (!result?.length) throw new Error('No posts returned')

  const escape = s => String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

  const items = result.map(p => `    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      ${p.author ? `<author>noreply@davidcuy.dev (${escape(p.author)})</author>` : ''}
      ${p.category ? `<category>${escape(p.category)}</category>` : ''}
      <description><![CDATA[${p.excerpt || ''}]]></description>
    </item>`).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
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
  writeFileSync(join(outputDir, 'rss.xml'), xml, 'utf8')
  console.log(`Created rss.xml with ${result.length} posts`)
}

try {
  await generateRss()
} catch (err) {
  console.warn('rss.xml generation skipped:', err.message)
}
