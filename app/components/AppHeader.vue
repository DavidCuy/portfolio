<script setup lang="ts">
const { locale, t, setLocale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const colorMode = useColorMode()

const scrolled = ref(false)
const menuOpen = ref(false)

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})

watch(() => route.path, () => {
  menuOpen.value = false
})

const links = computed(() => [
  { id: 'home', label: t('nav.home'), to: localePath('/') },
  { id: 'projects', label: t('nav.projects'), to: localePath('/projects') },
  { id: 'services', label: t('nav.services'), to: localePath('/services') },
  { id: 'about', label: t('nav.about'), to: localePath('/about') },
  { id: 'blog', label: 'Blog', to: localePath('/blog') }
])

const isActive = (to: string) => {
  if (to === localePath('/')) return route.path === to
  return route.path.startsWith(to)
}

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

const toggleLang = async () => {
  const target = locale.value === 'en' ? 'es' : 'en'
  await setLocale(target)
}
</script>

<template>
  <div :class="['nav-wrap', { scrolled, 'menu-open': menuOpen }]">
    <div class="nav">
      <NuxtLink
        :to="localePath('/')"
        class="brand"
      >
        <img
          src="/logo-iso.jpg"
          alt=""
        >
        <span class="brand-text">
          <span>David Cuy</span>
          <span class="sub">Cloud + Coffee</span>
        </span>
      </NuxtLink>
      <div class="nav-links">
        <NuxtLink
          v-for="l in links"
          :key="l.id"
          :to="l.to"
          :class="{ active: isActive(l.to) }"
        >
          {{ l.label }}
        </NuxtLink>
      </div>
      <div class="nav-actions">
        <button
          class="theme-toggle"
          :title="t('nav.toggleTheme')"
          @click="toggleTheme"
        >
          <UIcon :name="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" />
        </button>
        <button
          class="lang-switch"
          :title="t('topbar.buttons.language.tooltipTxt')"
          :aria-label="t('topbar.buttons.language.tooltipTxt')"
          @click="toggleLang"
        >
          <span :class="{ active: locale === 'en' }">EN</span>
          <span :class="{ active: locale === 'es' }">ES</span>
        </button>
        <DcButton
          variant="secondary"
          size="sm"
          icon="i-lucide-calendar"
          :to="localePath('/services')"
          class="nav-cta"
        >
          <span class="nav-cta-label">{{ t('nav.hire') }}</span>
        </DcButton>
        <button
          class="nav-burger"
          :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <UIcon :name="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'" />
        </button>
      </div>
    </div>

    <div
      v-if="menuOpen"
      class="nav-drawer"
    >
      <NuxtLink
        v-for="l in links"
        :key="l.id"
        :to="l.to"
        :class="{ active: isActive(l.to) }"
        @click="menuOpen = false"
      >
        {{ l.label }}
      </NuxtLink>
    </div>
  </div>
</template>
