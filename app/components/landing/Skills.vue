<script setup lang="ts">
import groq from 'groq'
import type { LocalizedText } from '~/composables/useSanity'

interface Skill {
  _id: string
  tabId: 'cloud' | 'code' | 'data' | 'ai'
  name: string
  description: LocalizedText
  level: number
  icon?: string
}

const sanity = useSanity()
const localized = useLocalizedFn()
const { t } = useI18n()

const { data } = await useAsyncData('home-skills', () =>
  sanity.fetch<Skill[]>(groq`*[_type=="skill"] | order(tabId asc, order asc)`)
)

const tabs = computed(() => [
  { id: 'cloud', label: t('skills.tabs.cloud') },
  { id: 'code', label: t('skills.tabs.code') },
  { id: 'data', label: t('skills.tabs.data') },
  { id: 'ai', label: t('skills.tabs.ai') }
])

const tab = ref<'cloud' | 'code' | 'data' | 'ai'>('cloud')

const filtered = computed(() => (data.value || []).filter(s => s.tabId === tab.value))
const countByTab = computed(() => {
  const map: Record<string, number> = {}
  for (const s of data.value || []) map[s.tabId] = (map[s.tabId] || 0) + 1
  return map
})
</script>

<template>
  <section
    v-if="data?.length"
    class="container section"
  >
    <DcSectionHead
      :label="t('skills.label', '03 · Tools')"
      :title="t('skills.title', 'The tools I reach for almost every day.')"
      num="— /skills"
    />
    <div class="skills-tabs">
      <button
        v-for="tb in tabs"
        :key="tb.id"
        :class="{ active: tab === tb.id }"
        @click="tab = tb.id as 'cloud' | 'code' | 'data' | 'ai'"
      >
        {{ tb.label }} <span class="count">· {{ countByTab[tb.id] || 0 }}</span>
      </button>
    </div>
    <div class="skills-grid">
      <DcSkillCard
        v-for="s in filtered"
        :key="s._id"
        :skill="{ name: s.name, description: localized(s.description), level: s.level, icon: s.icon }"
      />
    </div>
  </section>
</template>
