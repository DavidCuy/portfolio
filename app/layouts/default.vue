<script setup lang="ts">
const { locale } = useI18n()
</script>

<template>
  <div class="page">
    <div
      class="tx-layer"
      aria-hidden="true"
    />
    <AppHeader :key="locale" />
    <slot />
    <AppFooter />
  </div>
</template>
