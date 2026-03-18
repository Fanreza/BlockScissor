<template>
  <div class="battle-arena">
    <div class="flex items-center justify-center gap-4 md:gap-8">
      <!-- Player card -->
      <div class="flex flex-col items-center gap-2">
        <GameChoiceCard
          :choice="playerChoice"
          :revealed="revealed"
          :result="playerResult"
          size="lg"
        />
        <span class="text-sm font-bold text-neon-cyan">YOU</span>
      </div>

      <!-- VS -->
      <div class="vs-container" :class="{ 'vs-active': revealed }">
        <span class="vs-text">VS</span>
        <div v-if="revealed" class="vs-flash" />
      </div>

      <!-- Bot card -->
      <div class="flex flex-col items-center gap-2">
        <GameChoiceCard
          :choice="botChoice"
          :revealed="revealed"
          :result="botResult"
          size="lg"
        />
        <span class="text-sm font-bold text-neon-magenta">BOT</span>
      </div>
    </div>

    <!-- Result text -->
    <Transition name="result">
      <div v-if="showResult" class="result-container mt-6">
        <p :class="['result-text', resultTextClass]">
          {{ resultText }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { GameChoice } from '~/composables/useRPS'

const props = defineProps<{
  playerChoice: GameChoice
  botChoice: GameChoice
  revealed: boolean
  result: 'win' | 'lose' | 'draw' | null
}>()

const showResult = ref(false)

const playerResult = computed(() => props.result)
const botResult = computed(() => {
  if (!props.result) return null
  if (props.result === 'win') return 'lose'
  if (props.result === 'lose') return 'win'
  return 'draw'
})

const resultText = computed(() => {
  if (props.result === 'win') return 'YOU WIN THIS ROUND!'
  if (props.result === 'lose') return 'BOT WINS THIS ROUND!'
  if (props.result === 'draw') return "IT'S A DRAW!"
  return ''
})

const resultTextClass = computed(() => {
  if (props.result === 'win') return 'text-green-400 neon-green'
  if (props.result === 'lose') return 'text-red-400 neon-red'
  return 'text-yellow-400 neon-yellow'
})

watch(() => props.revealed, (val) => {
  if (val) {
    setTimeout(() => { showResult.value = true }, 700)
  } else {
    showResult.value = false
  }
})
</script>

<style scoped>
.battle-arena {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.vs-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
}

.vs-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: oklch(0.5 0.1 265);
  transition: all 0.3s;
}

.vs-active .vs-text {
  color: oklch(0.8 0.2 60);
  text-shadow: 0 0 20px oklch(0.8 0.2 60 / 0.8);
  animation: vs-shake 0.5s ease-in-out;
}

.vs-flash {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, oklch(0.9 0.15 60 / 0.3), transparent);
  border-radius: 50%;
  animation: flash 0.5s ease-out;
}

.result-container {
  text-align: center;
}

.result-text {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.neon-green { text-shadow: 0 0 10px oklch(0.7 0.2 145), 0 0 30px oklch(0.7 0.2 145 / 0.5); }
.neon-red { text-shadow: 0 0 10px oklch(0.6 0.2 25), 0 0 30px oklch(0.6 0.2 25 / 0.5); }
.neon-yellow { text-shadow: 0 0 10px oklch(0.8 0.15 85), 0 0 30px oklch(0.8 0.15 85 / 0.5); }
.text-neon-cyan { color: oklch(0.8 0.15 195); }
.text-neon-magenta { color: oklch(0.7 0.2 330); }

@keyframes vs-shake {
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-5deg) scale(1.2); }
  50% { transform: rotate(5deg) scale(1.3); }
  75% { transform: rotate(-3deg) scale(1.1); }
}

@keyframes flash {
  from { opacity: 1; transform: scale(0.5); }
  to { opacity: 0; transform: scale(2); }
}

.result-enter-active {
  animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.result-leave-active {
  animation: scale-in 0.2s ease reverse;
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>
