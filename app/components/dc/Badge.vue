<script setup lang="ts">
type Category = 'architecture' | 'serverless' | 'legacy' | 'decisions' | 'productivity' | 'leadership' | 'observ' | 'realsystems'
defineProps<{ category: Category }>()
</script>

<template>
  <span :class="['cbadge', category]">
    <span class="d" />
    <slot />
  </span>
</template>
