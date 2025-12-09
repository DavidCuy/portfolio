<template>
  <div class="typewriter">
    <p
      :style="{
        fontFamily: props.fontFamily,
        fontSize: props.fontSize
      }"
      class="typewriter-text"
    >
      {{ displayedText }}<span class="cursor">|</span>
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'

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
  },
  typingSpeed: {
    type: Number,
    default: 50 // milisegundos por carácter
  }
})

const currentIndex = ref(0)
const displayedText = ref('')
const charIndex = ref(0)
let typingInterval = null

// Función para escribir el texto carácter por carácter
const typeText = () => {
  const fullText = props.texts[currentIndex.value]

  if (charIndex.value < fullText.length) {
    displayedText.value = fullText.substring(0, charIndex.value + 1)
    charIndex.value++
  } else {
    // Termina de escribir, espera el intervalo completo
    clearInterval(typingInterval)
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % props.texts.length
      charIndex.value = 0
      displayedText.value = ''
      startTyping()
    }, props.interval - (fullText.length * props.typingSpeed))
  }
}

const startTyping = () => {
  typingInterval = setInterval(typeText, props.typingSpeed)
}

onMounted(() => {
  startTyping()
})

watch(currentIndex, () => {
  charIndex.value = 0
  displayedText.value = ''
})
</script>

<style scoped>
.typewriter {
  display: inline-block;
  max-width: 100%;
  box-sizing: border-box;
}

.typewriter-text {
  display: inline-block;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin: 0;
}

.cursor {
  display: inline-block;
  animation: blink 0.7s step-end infinite;
  margin-left: 2px;
}

/* Parpadeo del cursor */
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
