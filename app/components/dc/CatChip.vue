<script setup lang="ts">
defineProps<{ active?: boolean }>()
defineEmits<{ click: [] }>()
</script>

<template>
  <button
    :class="['cat-chip', { active }]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
