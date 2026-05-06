<script setup lang="ts">
interface Skill {
  name: string
  description: string
  level: number
  icon?: string
}
defineProps<{ skill: Skill }>()

const iconMap: Record<string, string> = {
  cloud: 'i-lucide-cloud',
  box: 'i-lucide-box',
  server: 'i-lucide-server',
  code: 'i-lucide-code',
  db: 'i-lucide-database',
  brain: 'i-lucide-brain',
  zap: 'i-lucide-zap',
  git: 'i-lucide-git-branch',
  eye: 'i-lucide-eye'
}
</script>

<template>
  <div class="skill-card">
    <div class="icon-box">
      <UIcon :name="iconMap[skill.icon || 'cloud'] || 'i-lucide-cloud'" />
    </div>
    <h4>{{ skill.name }}</h4>
    <p>{{ skill.description }}</p>
    <div class="meta">
      <span>Level</span>
      <div class="lvl">
        <i
          v-for="n in 5"
          :key="n"
          :class="{ on: n <= skill.level }"
        />
      </div>
    </div>
  </div>
</template>
