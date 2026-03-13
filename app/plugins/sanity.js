import { createClient } from '@sanity/client'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const client = createClient({
    projectId: 'my6ptkxm',
    dataset: 'production',
    useCdn: true,
    apiVersion: '2024-01-01'
  })

  return {
    provide: {
      sanity: client
    }
  }
})
