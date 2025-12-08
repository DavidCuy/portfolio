import { copyFileSync, existsSync } from 'fs'
import { join } from 'path'

// Copy index.html to 404.html for SPA fallback on GitHub Pages
const outputDir = '.output/public'
const indexPath = join(outputDir, 'index.html')
const notFoundPath = join(outputDir, '404.html')

if (existsSync(indexPath)) {
  copyFileSync(indexPath, notFoundPath)
  console.log('✅ Created 404.html for GitHub Pages SPA fallback')
} else {
  console.warn('⚠️ index.html not found in output directory')
}
