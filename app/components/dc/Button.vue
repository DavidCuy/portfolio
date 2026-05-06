<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconAfter?: string
  to?: string
  href?: string
  type?: 'button' | 'submit'
}
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button'
})

const classes = computed(() => [
  'btn',
  `btn-${props.variant}`,
  props.size === 'sm' && 'btn-sm',
  props.size === 'lg' && 'btn-lg'
].filter(Boolean))
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="classes"
  >
    <UIcon
      v-if="icon"
      :name="icon"
    />
    <slot />
    <UIcon
      v-if="iconAfter"
      :name="iconAfter"
    />
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :class="classes"
    target="_blank"
    rel="noopener"
  >
    <UIcon
      v-if="icon"
      :name="icon"
    />
    <slot />
    <UIcon
      v-if="iconAfter"
      :name="iconAfter"
    />
  </a>
  <button
    v-else
    :type="type"
    :class="classes"
  >
    <UIcon
      v-if="icon"
      :name="icon"
    />
    <slot />
    <UIcon
      v-if="iconAfter"
      :name="iconAfter"
    />
  </button>
</template>
