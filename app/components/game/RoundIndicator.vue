<template>
  <div class="flex flex-col items-center gap-3">
    <!-- Score -->
    <div class="flex items-center gap-6 text-lg font-bold">
      <span class="text-neon-cyan">YOU</span>
      <div class="flex items-center gap-2 font-mono text-2xl">
        <span :class="playerScore > botScore ? 'text-neon-lime' : 'text-foreground'">{{ playerScore }}</span>
        <span class="text-muted-foreground">-</span>
        <span :class="botScore > playerScore ? 'text-neon-magenta' : 'text-foreground'">{{ botScore }}</span>
      </div>
      <span class="text-neon-magenta">{{ opponentLabel }}</span>
    </div>

    <!-- Round dots -->
    <div class="flex items-center gap-3">
      <div
        v-for="round in 3"
        :key="round"
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
          getRoundClass(round)
        ]"
      >
        <span v-if="round <= completedRounds">{{ getRoundIcon(round) }}</span>
        <span v-else>{{ round }}</span>
      </div>
    </div>

    <!-- Current round label -->
    <p v-if="currentRound <= 3" class="text-sm text-muted-foreground">
      Round {{ currentRound }} of 3
    </p>
    <p v-else class="text-sm font-bold neon-text-sm text-neon-cyan">
      Game Over
    </p>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  currentRound: number
  completedRounds: number
  playerScore: number
  botScore: number
  roundResults: Array<'win' | 'lose' | 'draw' | null>
  opponentLabel?: string
}>(), {
  opponentLabel: 'BOT',
})

const getRoundClass = (round: number) => {
  const result = props.roundResults[round - 1]
  if (result === 'win') return 'bg-green-500/30 border-2 border-green-400 text-green-400 shadow-[0_0_10px_oklch(0.7_0.2_145/0.4)]'
  if (result === 'lose') return 'bg-red-500/30 border-2 border-red-400 text-red-400'
  if (result === 'draw') return 'bg-yellow-500/30 border-2 border-yellow-400 text-yellow-400'
  if (round === props.currentRound) return 'bg-primary/20 border-2 border-primary animate-pulse text-primary'
  return 'bg-muted/50 border-2 border-muted text-muted-foreground'
}

const getRoundIcon = (round: number) => {
  const result = props.roundResults[round - 1]
  if (result === 'win') return '✓'
  if (result === 'lose') return '✗'
  if (result === 'draw') return '='
  return round
}
</script>

<style scoped>
.neon-text-sm {
  text-shadow: 0 0 8px currentColor;
}
</style>
