<script setup lang="ts">
import groq from 'groq'

interface FooterData {
  brand?: string
  tagline?: { en?: string, es?: string } | null
  socials?: Array<{ platform: string, url: string }>
  contact?: { email?: string, location?: string }
}

const sanity = useSanity()
const localized = useLocalizedFn()
const localePath = useLocalePath()
const { t } = useI18n()

const { data } = await useAsyncData('site-footer', () =>
  sanity.fetch<FooterData | null>(
    groq`*[_type=="settings"][0].footer`
  )
)

const socialIcons: Record<string, string> = {
  github: 'i-simple-icons-github',
  linkedin: 'i-simple-icons-linkedin',
  rss: 'i-lucide-rss',
  mail: 'i-lucide-mail',
  twitter: 'i-simple-icons-x'
}

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <div class="footer-brand">
          <div class="row">
            <img
              src="/logo-iso.jpg"
              alt=""
            >
            <span>{{ data?.brand || 'David Cuy' }}</span>
          </div>
          <p>{{ localized(data?.tagline) }}</p>
          <div class="socials">
            <a
              v-for="s in data?.socials || []"
              :key="s.platform"
              :href="s.url"
              :title="s.platform"
              target="_blank"
              rel="noopener"
              :aria-label="s.platform"
            >
              <UIcon :name="socialIcons[s.platform] || 'i-lucide-link'" />
            </a>
          </div>
        </div>
        <div>
          <h4>{{ t('footer.site') }}</h4>
          <ul>
            <li>
              <NuxtLink :to="localePath('/')">
                {{ t('nav.home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/projects')">
                {{ t('nav.projects') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/services')">
                {{ t('nav.services') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath('/about')">
                {{ t('nav.about') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4>Blog</h4>
          <ul>
            <li>
              <NuxtLink :to="localePath('/blog')">
                {{ t('footer.allPosts') }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h4>{{ t('footer.contact') }}</h4>
          <ul>
            <li v-if="data?.contact?.email">
              <a :href="`mailto:${data.contact.email}`">{{ data.contact.email }}</a>
            </li>
            <li v-if="data?.contact?.location">
              <span>{{ data.contact.location }}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ year }} David Cuy · {{ t('footer.madeWith') }}</span>
        <span>{{ t('footer.deployed') }}</span>
      </div>
    </div>
  </footer>
</template>
