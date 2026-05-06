<script setup lang="ts">
interface Testimonial {
  name: string
  role: string
  quote: string
  avatar?: string
}
const props = defineProps<{ testimonial: Testimonial }>()

const initials = computed(() => {
  if (props.testimonial.avatar) return props.testimonial.avatar
  return props.testimonial.name
    .split(' ')
    .map(s => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
})
</script>

<template>
  <div class="tmnl">
    <div class="quote-mark">
      "
    </div>
    <blockquote>{{ testimonial.quote }}</blockquote>
    <div class="tmnl-author">
      <div class="ava">
        {{ initials }}
      </div>
      <div>
        <div class="tmnl-n">
          {{ testimonial.name }}
        </div>
        <div class="tmnl-r">
          {{ testimonial.role }}
        </div>
      </div>
    </div>
  </div>
</template>
