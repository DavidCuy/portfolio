<script setup lang="ts">
interface Props {
  image: {
    src: string
    alt: string
  }
  title: string
  items: string[]
  viewMoreText?: string
}

const props = defineProps<Props>()
</script>

<template>
  <UCard class="p-4 h-full">
    <div class="items-start  gap-4 text-center">
      <!-- Icono -->
      <div class="text-2xl flex-shrink-0 p-2 w-20 h-20 mx-auto items-center justify-center">
        <img
          :src="props.image.src"
          :alt="props.image.alt"
        >
      </div>

      <!-- Contenido -->
      <div class="text-center center">
        <h3 class="text-lg font-semibold leading-tight">
          {{ title }}
        </h3>
        <UPopover>
          <UButton
            :label="viewMoreText"
            color="neutral"
            variant="subtle"
            class="mt-4"
          />

          <template #content>
            <div class="flex items-center gap-4 m-4 p-4 w-60">
              <p
                v-for="(item, index) in items"
                :key="index"
                class="text-sm text-gray-600 dark:text-gray-300 mt-1 space-y-0.5"
              >
                {{ item }}
              </p>
            </div>
          </template>
        </UPopover>
      </div>
    </div>
  </UCard>
</template>
