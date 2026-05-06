<script setup lang="ts">
defineProps<{ label?: string, title: string, num?: string }>()

// Strip leading numbering ("01 · ", "02 · ", etc.) from label if present.
function clean(l?: string) {
  return (l || '').replace(/^\s*\d+\s*[·•\-—]\s*/, '').trim()
}
</script>

<template>
  <div class="section-head">
    <div>
      <div
        v-if="clean(label)"
        class="label"
      >
        {{ clean(label) }}
      </div>
      <h2>{{ title }}</h2>
    </div>
    <div
      v-if="num"
      class="num"
    >
      {{ num }}
    </div>
  </div>
</template>
