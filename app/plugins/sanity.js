import { createClient } from '@sanity/client'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const client = createClient({
    projectId: 'my6ptkxm',
    dataset: 'production',
    useCdn: true,
    // useCdn: false,
    // perspective: 'previewDrafts',
    // token: 'skw38XPcFJE46w85AF63eKHAkUt96EQ9iefpWff1au3BRNozErGtDxBznrKDlPjM5JJa5c1cVkbr8eGK72XrFDlCYR9WoFzQtAamKVpEHfBLVdhNp8ESSqMuScWmav6Gd4SUraiU9Sveu5rs502SSmxYAoH5xRPjId80CoQ8OMhUSJYzpiIp',
    apiVersion: '2024-01-01'
  })

  return {
    provide: {
      sanity: client
    }
  }
})
