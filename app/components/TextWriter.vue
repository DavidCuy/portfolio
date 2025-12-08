<template>
  <div class="typewriter">
    <p
      :key="currentIndex"
      :style="{
        animationDuration: (interval / 1000) - 1,
        fontFamily: props.fontFamily,
        fontSize: props.fontSize
      }"
    >
      {{ texts[currentIndex] }}
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

// Recibimos los textos como props
const props = defineProps({
  texts: {
    type: Array,
    required: true
  },
  interval: {
    type: Number,
    default: 3000 // tiempo entre cambios
  },
  fontFamily: {
    type: String,
    default: 'monospace'
  },
  fontSize: {
    type: String,
    default: '1.5rem'
  }
})

const currentIndex = ref(0)

onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.texts.length
  }, props.interval)
})
</script>

<style scoped>
.typewriter {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
}

/* Cursor y animación */
.typewriter p {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid;
  width: 0;
  /* typing: run once, use steps(start) so the first character appears immediately,
    and keep the final state with 'forwards' so the text stays visible until the next cycle. */
  animation: typing 2s steps(30, start) 0s 1 normal forwards, blink 0.5s step-end 0s infinite alternate;
}

/* Animación de escritura */
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}

/* Parpadeo del cursor */
@keyframes blink {
  50% { border-color: transparent }
}
</style>
