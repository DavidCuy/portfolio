<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    phrases: string[]
    typeSpeed?: number
    eraseSpeed?: number
    holdMs?: number
    caretColor?: string
  }>(),
  {
    typeSpeed: 40,
    eraseSpeed: 20,
    holdMs: 3000,
    caretColor: 'var(--sky-400)'
  }
)

const text = ref(props.phrases[0] || '')
let phraseIdx = 0
let charIdx = (props.phrases[0] || '').length
let mode: 'type' | 'hold' | 'erase' = 'hold'
let timer: ReturnType<typeof setTimeout> | null = null

function tick() {
  const phrase = props.phrases[phraseIdx] || ''

  if (mode === 'type') {
    charIdx++
    text.value = phrase.slice(0, charIdx)
    if (charIdx >= phrase.length) {
      mode = 'hold'
      timer = setTimeout(tick, props.holdMs)
    } else {
      timer = setTimeout(tick, props.typeSpeed)
    }
  } else if (mode === 'hold') {
    mode = 'erase'
    timer = setTimeout(tick, props.eraseSpeed)
  } else {
    charIdx--
    text.value = phrase.slice(0, charIdx)
    if (charIdx <= 0) {
      mode = 'type'
      phraseIdx = (phraseIdx + 1) % props.phrases.length
      timer = setTimeout(tick, props.typeSpeed)
    } else {
      timer = setTimeout(tick, props.eraseSpeed)
    }
  }
}

onMounted(() => {
  if (props.phrases.length) timer = setTimeout(tick, props.holdMs)
})
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

watch(() => props.phrases, () => {
  if (timer) clearTimeout(timer)
  text.value = props.phrases[0] || ''
  phraseIdx = 0
  charIdx = text.value.length
  mode = 'hold'
  if (props.phrases.length) timer = setTimeout(tick, props.holdMs)
})
</script>

<template>
  <span class="typewriter">
    <span class="text">{{ text }}</span><span
      class="caret"
      :style="{ background: caretColor }"
    />
  </span>
</template>

<style scoped>
.typewriter {
  display: inline;
  font: inherit;
  color: inherit;
  letter-spacing: inherit;
}
.text { white-space: pre-wrap; }
.caret {
  display: inline-block;
  width: 0.08em;
  height: 0.85em;
  margin-left: 0.06em;
  vertical-align: -0.06em;
  animation: blink 1s steps(2) infinite;
}
@keyframes blink {
  50% { opacity: 0; }
}
</style>
