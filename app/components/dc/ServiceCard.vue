<script setup lang="ts">
interface Service {
  num: string
  title: string
  description: string
  bullets: string[]
  featured?: boolean
  ctaLabel?: string
}
defineProps<{ service: Service, mostBookedLabel?: string, contactEmail?: string }>()

const subject = (title: string) => encodeURIComponent(`Consulta: ${title}`)
</script>

<template>
  <div :class="['svc-card', { featured: service.featured }]">
    <span class="svc-num">
      {{ service.num }}{{ service.featured && mostBookedLabel ? ` · ${mostBookedLabel}` : '' }}
    </span>
    <h3>{{ service.title }}</h3>
    <p>{{ service.description }}</p>
    <ul>
      <li
        v-for="b in service.bullets"
        :key="b"
      >
        {{ b }}
      </li>
    </ul>
    <DcButton
      :variant="service.featured ? 'primary' : 'ghost'"
      icon-after="i-lucide-arrow-right"
      :href="contactEmail ? `mailto:${contactEmail}?subject=${subject(service.title)}` : undefined"
    >
      {{ service.ctaLabel || 'Get in touch' }}
    </DcButton>
  </div>
</template>
