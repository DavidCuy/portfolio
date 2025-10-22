<script setup lang="ts">
import { useNavLinks } from '~/utils/links'

const navLinks = useNavLinks()
</script>

<template>
  <div>
    <UContainer class="sm:border-x border-default pt-10">
  <AppHeader :links="navLinks" />
      <slot />
      <AppFooter />
    </UContainer>
  </div>
 </template>
