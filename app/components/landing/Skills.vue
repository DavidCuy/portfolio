<script setup lang="ts">
import type { IndexCollectionItem } from '@nuxt/content'

const { locale } = useI18n()

const props = defineProps<{
  page: IndexCollectionItem
}>()

const items = computed(() => {
  return props.page.skills?.categories.map((skill) => {
    return {
      label: getLocalized(skill.title, locale.value?.toString()) || '',
      key: skill.key,
      cards: skill.cards.map((card: any) => ({
        label: getLocalized(card.title, locale.value?.toString()) || '',
        description: getLocalized(card.description, locale.value?.toString()) || '',
        image: card.image
      }))
    }
  })
})

const skillCardViewMoreText = computed(() => {
  const skillsSection = props.page?.skills
  console.log(getLocalized(skillsSection?.viewMoreText, locale.value?.toString()))
  return getLocalized(skillsSection?.viewMoreText, locale.value?.toString()) || ''
})

const skillsTitle = computed(() => {
  const titleSection = props.page.skills
  return getLocalized(titleSection?.title, locale.value?.toString()) || ''
})

const skillsDescription = computed(() => {
  const descSection = props.page.skills
  return getLocalized(descSection?.description, locale.value?.toString()) || ''
})

const ui = {
  root: 'flex items-center gap-4 w-full',
  list: 'relative flex bg-transparent dark:bg-transparent gap-2 px-0',
  indicator: 'absolute top-[4px] duration-200 ease-out focus:outline-none rounded-lg bg-elevated/60',
  trigger: 'px-3 py-2 rounded-lg hover:bg-muted/50 data-[state=active]:text-highlighted data-[state=inactive]:text-muted',
  label: 'truncate'
}
</script>

<template>
  <UPageSection
    :title="skillsTitle"
    :description="skillsDescription"
    :ui="{
      container: 'px-0 !pt-0 gap-4 sm:gap-4',
      title: 'text-left text-xl sm:text-xl lg:text-2xl font-medium',
      description: 'text-left mt-2 text-sm sm:text-md lg:text-sm text-muted'
    }"
  >
    <UTabs
      :items
      orientation="horizontal"
      :ui
    >
      <template #content="{ item }">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SkillCard
            v-for="(card, index) in item.cards"
            :key="index"
            :title="card.label"
            :items="[card.description]"
            :viewMoreText="skillCardViewMoreText"
            :image="card.image"
          />
        </div>
      </template>
    </UTabs>
  </UPageSection>
</template>
