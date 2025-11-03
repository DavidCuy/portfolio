<script setup lang="ts">
import { getLocalized } from '~/utils/getLocalized'

const { locale } = useI18n()

const { data: page } = await useAsyncData('projects-page', () => {
  return queryCollection('pages').path('/projects').first()
})
if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true
  })
}

const title = computed(() => {
  const seoTitle = page.value?.seo?.title
  return getLocalized(seoTitle, locale.value?.toString()) || getLocalized(page.value?.seo?.title, locale.value?.toString()) || ''
})

const description = computed(() => {
  const seoDesc = page.value?.seo?.description
  return getLocalized(seoDesc, locale.value?.toString()) || getLocalized(page.value?.seo?.description, locale.value?.toString()) || ''
})

const { data: projects } = await useAsyncData('projects', () => {
  return queryCollection('projects').all()
})

const { global } = useAppConfig()

const meetingText = computed(() => {
  const label = page.value?.links[0]?.label
  return getLocalized(label, locale.value?.toString()) || ''
})

const mailMeText = computed(() => {
  const mailText = page.value?.links[1]?.label
  return getLocalized(mailText, locale.value?.toString()) || ''
})

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value
})
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="title"
      :description="description"
      :links="page.links"
      :ui="{
        title: '!mx-0 text-left',
        description: '!mx-0 text-left',
        links: 'justify-start'
      }"
    >
      <template #links>
        <div
          v-if="page.links"
          class="flex items-center gap-2"
        >
          <UButton
            :label="meetingText"
            :to="global.meeting.link"
            target="_blank"
            :color="page.links[0]?.color"
          />
          <UButton
            :label="mailMeText"
            :to="`mailto:${global.email}`"
          />
        </div>
      </template>
    </UPageHero>
    <UPageSection
      :ui="{
        container: '!pt-0'
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :description="project.description"
          :to="project.url"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last'
          }"
        >
          <template #leading>
            <span class="text-sm text-muted">
              {{ new Date(project.date).getFullYear() }}
            </span>
          </template>
          <template #footer>
            <ULink
              :to="project.url"
              class="text-sm text-primary flex items-center"
            >
              View Project
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </ULink>
          </template>
          <img
            :src="project.image"
            :alt="project.title"
            class="object-cover w-full h-48 rounded-lg"
          >
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>
