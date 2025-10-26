<script setup lang="ts">
const { locale, t } = useI18n()

// Do not perform navigation here. The root page handles redirecting based on
// `useState('language')` (or the i18n module). This avoids double navigations
// or relative-path concatenation (e.g. `/es/en`). Just update state and i18n.
const downloadResume = async () => {
  try {
    const lang = locale?.value?.toString() || 'en'
    const fileName = `CV_David_Cuy_Sanchez_${lang.toUpperCase()}.pdf`
    const href = `/files/resume/${fileName}`

    // Create a temporary anchor to trigger download
    const a = document.createElement('a')
    a.href = href
    a.download = String(fileName)
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    console.log('Triggered download for', href)
  } catch (err) {
    console.error('downloadResume failed', err)
    // Fallback: navigate to file so browser can handle it
    navigateTo(`/files/resume/${locale?.value?.toString() || 'en'}`)
  }
}
 
</script>

<template>
  <ClientOnly>
    <UTooltip
        :text="`${t('topbar.buttons.resume.tooltipTxt')}`"
        :delay-duration="0.5">
        <UButton
            :icon="`i-lucide-file-text`"
            color="neutral"
            variant="ghost"
            size="sm"
            class="rounded-full cursor-pointer"
            @click="downloadResume"
        />
    </UTooltip>
    <template #fallback>
      <div class="size-4" />
    </template>
  </ClientOnly>
</template>
