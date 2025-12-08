<script setup lang="ts">
const { locale } = useI18n()

const { data: page } = await useAsyncData('services', () => {
  return queryCollection('services').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const title = computed(() => {
  return getLocalized(page.value?.seo?.title, locale.value?.toString()) || getLocalized(page.value?.title, locale.value?.toString()) || ''
})

const description = computed(() => {
  return getLocalized(page.value?.seo?.description, locale.value?.toString()) || getLocalized(page.value?.description, locale.value?.toString()) || ''
})

useSeoMeta({
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description
})

const { global } = useAppConfig()

const services = computed(() => {
  const pageData = page.value as any
  return pageData?.services?.map((service: any) => ({
    title: getLocalized(service.title, locale.value?.toString()) || '',
    description: getLocalized(service.description, locale.value?.toString()) || '',
    icon: service.icon
  })) || []
})

const contactTitle = computed(() => {
  const pageData = page.value as any
  return getLocalized(pageData?.contact?.title, locale.value?.toString()) || ''
})

const contactDescription = computed(() => {
  const pageData = page.value as any
  return getLocalized(pageData?.contact?.description, locale.value?.toString()) || ''
})

const contactButtonLabel = computed(() => {
  const pageData = page.value as any
  return getLocalized(pageData?.contact?.buttonLabel, locale.value?.toString()) || ''
})
</script>

<template cla>
  <UPage v-if="page">
    <UPageHero
      :title="title"
      :description="description"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    />

    <!-- Services Section -->
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <UCarousel
        v-slot="{ item }: { item: any }"
        :items="services"
        :ui="{
          viewport: '-mx-4 sm:-mx-12 lg:-mx-16 bg-elevated/50 max-w-(--ui-container)'
        }"
        arrows
        :autoplay="{ delay: 3000 }"
        loop
      >
        <UCard
          class="p-8 h-full w-full max-w-full border-0 ring-0 shadow-none bg-transparent"
        >
          <div class="flex flex-col md:flex-row items-start gap-6 w-full">
            <!-- Icon -->
            <div class="p-4 rounded-lg bg-primary/10 flex-shrink-0">
              <UIcon
                :name="item?.icon"
                class="size-12 text-primary"
              />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h3 class="text-2xl font-semibold text-highlighted mb-3 break-words">
                {{ item?.title }}
              </h3>
              <p class="text-base text-muted leading-relaxed break-words">
                {{ item?.description }}
              </p>
            </div>
          </div>
        </UCard>
      </UCarousel>
    </UPageSection>

    <!-- Contact Section -->
    <UPageSection
      :title="contactTitle"
      :description="contactDescription"
      :ui="{
        container: 'py-16',
        title: 'text-center text-2xl sm:text-3xl font-semibold',
        description: 'text-center mt-3 text-md text-muted max-w-2xl mx-auto'
      }"
    >
      <div class="flex justify-center mt-8">
        <UButton
          :to="`mailto:${global.email}`"
          :label="contactButtonLabel"
          size="xl"
          icon="i-lucide-mail"
        />
      </div>
    </UPageSection>
  </UPage>
</template>
