<template>
  <Transition name="overlay">
    <div v-if="show" class="overlay">
      <div class="overlay-content">
        <!-- Result text -->
        <h2 :class="['result-title', titleClass]">
          {{ titleText }}
        </h2>

        <!-- Score -->
        <div class="score-display">
          <span class="text-neon-cyan font-bold">YOU</span>
          <span class="score-numbers">{{ playerWins }} - {{ botWins }}</span>
          <span class="text-neon-magenta font-bold">BOT</span>
        </div>

        <!-- Round recap -->
        <div class="round-recap">
          <div
            v-for="(round, i) in rounds"
            :key="i"
            :class="['round-row', `round-${round.result}`]"
          >
            <span class="round-num">R{{ i + 1 }}</span>
            <span :class="['round-choice', choiceColor(round.playerChoice)]">{{ choiceName(round.playerChoice) }}</span>
            <span class="round-vs">vs</span>
            <span :class="['round-choice', choiceColor(round.botChoice)]">{{ choiceName(round.botChoice) }}</span>
            <span :class="['round-badge', roundResultClass(round.result)]">
              {{ roundResultText(round.result) }}
            </span>
          </div>
        </div>

        <!-- On-chain status -->
        <div v-if="submitting" class="chain-status">
          <div class="chain-spinner" />
          <span>Recording on-chain...</span>
        </div>
        <div v-else-if="txHash" class="chain-status text-green-400">
          <span>Verified on-chain</span>
        </div>

        <!-- Actions -->
        <div class="overlay-actions">
          <button @click="$emit('playAgain')" class="action-btn primary">
            Play Again
          </button>
          <NuxtLink to="/" class="action-btn secondary">
            Back to Home
          </NuxtLink>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { GameChoice } from '~/composables/useRPS'

const props = defineProps<{
  show: boolean
  playerWins: number
  botWins: number
  isWinner: boolean
  isDraw: boolean
  rounds: Array<{
    playerChoice: GameChoice
    botChoice: GameChoice
    result: 'win' | 'lose' | 'draw'
  }>
  submitting: boolean
  txHash: string | null
}>()

defineEmits<{
  playAgain: []
}>()

const titleText = computed(() => {
  if (props.isWinner) return 'YOU WIN!'
  if (props.isDraw) return 'DRAW!'
  return 'YOU LOSE!'
})

const titleClass = computed(() => {
  if (props.isWinner) return 'text-green-400 neon-green'
  if (props.isDraw) return 'text-yellow-400 neon-yellow'
  return 'text-red-400 neon-red shake'
})

const choiceName = (choice: GameChoice) => {
  const m: Record<number, string> = { [GameChoice.Rock]: 'Rock', [GameChoice.Paper]: 'Paper', [GameChoice.Scissors]: 'Scissors' }
  return m[choice] || '?'
}

const choiceColor = (choice: GameChoice) => {
  const m: Record<number, string> = { [GameChoice.Rock]: 'c-rock', [GameChoice.Paper]: 'c-paper', [GameChoice.Scissors]: 'c-scissors' }
  return m[choice] || ''
}

const roundResultClass = (result: string) => {
  if (result === 'win') return 'text-green-400'
  if (result === 'lose') return 'text-red-400'
  return 'text-yellow-400'
}

const roundResultText = (result: string) => {
  if (result === 'win') return 'WIN'
  if (result === 'lose') return 'LOSE'
  return 'DRAW'
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: oklch(0.08 0.02 265 / 0.9);
  backdrop-filter: blur(8px);
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem;
  border-radius: 1.5rem;
  background: linear-gradient(180deg, oklch(0.18 0.04 265), oklch(0.12 0.02 280));
  border: 1px solid oklch(0.3 0.08 265);
  max-width: 400px;
  width: 90%;
}

.result-title {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}

.neon-green { text-shadow: 0 0 15px oklch(0.7 0.2 145), 0 0 40px oklch(0.7 0.2 145 / 0.5); }
.neon-red { text-shadow: 0 0 15px oklch(0.6 0.2 25), 0 0 40px oklch(0.6 0.2 25 / 0.5); }
.neon-yellow { text-shadow: 0 0 15px oklch(0.8 0.15 85), 0 0 40px oklch(0.8 0.15 85 / 0.5); }
.text-neon-cyan { color: oklch(0.8 0.15 195); }
.text-neon-magenta { color: oklch(0.7 0.2 330); }

.shake {
  animation: shake 0.6s ease-in-out;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
}

.score-numbers {
  font-size: 2rem;
  font-weight: 900;
  font-family: monospace;
  color: oklch(0.95 0 0);
}

.round-recap {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}

.round-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background: #0a0a0f;
  border: 1px solid #2b2b3a;
}

.round-win { border-color: #26ffae30; }
.round-lose { border-color: #ff008d30; }
.round-draw { border-color: #e9cc5a30; }

.round-num {
  font-size: 0.65rem;
  font-weight: 800;
  color: #434343;
  min-width: 22px;
}

.round-choice {
  font-size: 0.75rem;
  font-weight: 700;
}

.c-rock { color: #ff9500; }
.c-paper { color: #00e5cc; }
.c-scissors { color: #ff3399; }

.round-vs {
  font-size: 0.6rem;
  color: #434343;
}

.round-badge {
  font-size: 0.6rem;
  font-weight: 800;
  margin-left: auto;
  letter-spacing: 0.05em;
}

.text-green-400 { color: #26ffae; }
.text-red-400 { color: #ff008d; }
.text-yellow-400 { color: #e9cc5a; }

.chain-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: oklch(0.6 0.1 265);
}

.chain-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid oklch(0.4 0.1 265);
  border-top-color: oklch(0.7 0.2 265);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.overlay-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
  width: 100%;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  text-align: center;
  display: block;
}

.action-btn.primary {
  background: linear-gradient(135deg, #7a27ff, #5c1ed6);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  box-shadow: 0 0 25px #7a27ff80;
  transform: scale(1.03);
}

.action-btn.secondary {
  background: transparent;
  color: #a0aab0;
  border: 1px solid #2b2b3a;
}

.action-btn.secondary:hover {
  border-color: #576975;
  color: #e6f1f8;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.overlay-enter-active { animation: fade-in 0.4s ease; }
.overlay-leave-active { animation: fade-in 0.3s ease reverse; }

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
