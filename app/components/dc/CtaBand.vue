<script setup lang="ts">
interface Props {
  headline: string
  body: string
  primaryLabel: string
  primaryTo?: string
  primaryHref?: string
  secondaryNote?: string
}
defineProps<Props>()
</script>

<template>
  <div class="cta-band">
    <div>
      <h2>{{ headline }}</h2>
      <p>{{ body }}</p>
    </div>
    <div class="cta-actions">
      <DcButton
        variant="primary"
        size="lg"
        icon="i-lucide-calendar"
        :to="primaryTo"
        :href="primaryHref"
      >
        {{ primaryLabel }}
      </DcButton>
      <span
        v-if="secondaryNote"
        class="cta-small"
      >{{ secondaryNote }}</span>
    </div>
  </div>
</template>
