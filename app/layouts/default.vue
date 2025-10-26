<script setup lang="ts">
import { useNavLinks } from '~/utils/links'

const { locale } = useI18n()
const navLinks = useNavLinks() 
</script>

<template>
  <div> 
    <UContainer class="sm:border-x border-default pt-10">
      <AppHeader :links="navLinks" :key="locale" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
</template>