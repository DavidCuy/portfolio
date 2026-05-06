<script setup lang="ts">
import groq from 'groq'

const sanity = useSanity()

const { data } = await useAsyncData('home-tech-strip', () =>
  sanity.fetch<string[] | null>(groq`*[_type=="home"][0].techStrip`)
)
</script>

<template>
  <div
    v-if="data?.length"
    class="tech-strip"
  >
    <div class="tech-strip-inner">
      <span
        v-for="(t, i) in [...(data || []), ...(data || [])]"
        :key="i"
      >{{ t }}</span>
    </div>
  </div>
</template>
