<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <NuxtLink to="/" class="text-sm text-[#576975] hover:text-[#e6f1f8] transition-colors">&larr; Back</NuxtLink>
      <button
        v-if="gameState && gameState.phase === GamePhase.Open"
        @click="shareRoom"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
        :class="copied ? 'border-[#26ffae] text-[#26ffae]' : 'border-[#2b2b3a] text-[#a0aab0] hover:border-[#576975]'"
      >
        {{ copied ? 'Copied!' : 'Share Room' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="!gameState" class="rounded-2xl p-8 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
      <div class="h-32 bg-[#2b2b3a] animate-pulse rounded-lg" />
    </div>

    <template v-if="gameState">
      <!-- Game Info Bar -->
      <div class="rounded-2xl p-4 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-lg font-bold">Game #{{ gameId }}</span>
          <span class="text-xs font-bold text-[#e9cc5a] bg-[#e9cc5a15] px-2 py-0.5 rounded">PVP</span>
          <span class="text-sm font-bold text-[#e9cc5a] ml-auto">{{ formatEther(gameState.stake) }} STT</span>
          <span class="text-sm font-bold ml-2" :class="statusClass">{{ statusText }}</span>
        </div>
        <div class="flex gap-4 text-xs text-[#576975] mt-2">
          <span>P1: <span class="font-mono text-[#e6f1f8]">{{ fmtAddr(gameState.player1) }}</span></span>
          <span v-if="gameState.player2 !== ZERO">P2: <span class="font-mono text-[#e6f1f8]">{{ fmtAddr(gameState.player2) }}</span></span>
        </div>
      </div>

      <!-- Phase: Open — Waiting for opponent -->
      <template v-if="gameState.phase === GamePhase.Open">
        <!-- Creator view -->
        <div v-if="isPlayer1" class="rounded-2xl p-8 bg-gradient-to-r from-[#7a27ff10] to-[#00fff210] border border-[#7a27ff30] text-center space-y-3">
          <p class="text-xl font-bold text-[#e6f1f8]">Waiting for opponent...</p>
          <p class="text-sm text-[#576975]">Share this room link to invite someone</p>
          <button @click="shareRoom" class="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] text-white hover:shadow-[0_0_20px_#7a27ff60] transition-all">
            {{ copied ? 'Copied!' : 'Copy Link' }}
          </button>
        </div>

        <!-- Joiner view -->
        <div v-else-if="currentUserAddress" class="rounded-2xl p-6 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a] text-center space-y-3">
          <h3 class="text-lg font-bold">Join this match?</h3>
          <p class="text-sm text-[#576975]">Stake {{ formatEther(gameState.stake) }} STT to join. You'll pick your moves after.</p>
          <button @click="doJoin" :disabled="joining" class="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] text-white hover:shadow-[0_0_20px_#7a27ff60] transition-all disabled:opacity-50">
            {{ joining ? 'Joining...' : `Join (${formatEther(gameState.stake)} STT)` }}
          </button>
        </div>
      </template>

      <!-- Phase: Commit — Both pick 3 choices -->
      <template v-if="gameState.phase === GamePhase.Commit && isPlayer">
        <!-- Opponent status banner -->
        <div v-if="opponentCommitted && !hasCommitted" class="rounded-xl p-3 bg-[#26ffae10] border border-[#26ffae30] text-center">
          <p class="text-sm font-bold text-[#26ffae]">Opponent has locked their choices! Your turn.</p>
        </div>

        <!-- Already committed — waiting for opponent -->
        <div v-if="hasCommitted" class="rounded-2xl p-8 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a] text-center space-y-3">
          <p class="text-xl font-bold text-[#26ffae]">Choices Locked!</p>
          <p class="text-sm text-[#576975]">
            {{ opponentCommitted ? 'Both committed! Preparing reveal...' : 'Waiting for opponent to submit their choices...' }}
          </p>
        </div>

        <!-- Picking choices -->
        <template v-else>
          <div v-if="pickPhase === 'choosing'">
            <GameRoundIndicator :current-round="pickRound" :completed-rounds="pickChoices.length" :player-score="0" :bot-score="0" :round-results="[null,null,null]" :opponent-label="opponentLabel" class="mb-4" />
            <GameChoiceSelector ref="pickSelectorRef" @confirm="onPickChoice" />
          </div>
          <div v-if="pickPhase === 'locked'" class="flex flex-col items-center gap-4 py-8">
            <p class="text-lg font-bold">Round {{ pickRound }} locked!</p>
            <GameChoiceCard :choice="lastPick!" :revealed="true" result="draw" size="lg" />
          </div>
          <div v-if="pickPhase === 'submitting'" class="flex flex-col items-center gap-4 py-8">
            <div class="w-10 h-10 border-3 border-[#2b2b3a] border-t-[#7a27ff] rounded-full animate-spin" />
            <p class="text-[#a0aab0] font-semibold">Confirm in your wallet...</p>
          </div>
          <div v-if="pickPhase === 'error'" class="rounded-2xl p-6 bg-[#141418] border border-[#ff008d30] text-center space-y-3">
            <p class="text-lg font-bold text-[#ff008d]">Failed</p>
            <p class="text-sm text-[#576975]">{{ pickError }}</p>
            <button @click="retryCommit" class="px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] text-white">Retry</button>
          </div>
        </template>
      </template>

      <!-- Phase: Reveal — Auto-reveal -->
      <template v-if="gameState.phase === GamePhase.Reveal && isPlayer">
        <div v-if="!hasRevealed" class="rounded-2xl p-8 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a] text-center space-y-3">
          <div v-if="!revealing" class="space-y-3">
            <p class="text-lg font-bold">Both committed! Revealing...</p>
            <p class="text-sm text-[#576975]">Confirm the reveal transaction</p>
          </div>
          <div v-else class="space-y-3">
            <div class="w-10 h-10 mx-auto border-3 border-[#2b2b3a] border-t-[#7a27ff] rounded-full animate-spin" />
            <p class="text-[#a0aab0] font-semibold">Revealing...</p>
          </div>
        </div>
        <div v-else class="rounded-2xl p-8 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a] text-center">
          <p class="text-lg font-bold text-[#26ffae]">Revealed!</p>
          <p class="text-sm text-[#576975]">Waiting for opponent...</p>
        </div>
      </template>

      <!-- Phase: Finished -->
      <div v-if="gameState.phase === GamePhase.Finished" class="rounded-2xl p-6 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a] space-y-4">
        <div class="text-center space-y-2">
          <p v-if="isWinner" class="text-3xl font-black text-[#26ffae]" style="text-shadow: 0 0 20px #26ffae80">YOU WIN!</p>
          <p v-else-if="isDraw" class="text-3xl font-black text-[#e9cc5a]" style="text-shadow: 0 0 20px #e9cc5a80">DRAW!</p>
          <p v-else class="text-3xl font-black text-[#ff008d]" style="text-shadow: 0 0 20px #ff008d80">YOU LOSE</p>

          <p class="text-lg font-bold">
            <span class="text-[#00fff2]">{{ gameState.p1Wins }}</span>
            <span class="text-[#434343] mx-2">-</span>
            <span class="text-[#ff008d]">{{ gameState.p2Wins }}</span>
          </p>

          <p v-if="isWinner" class="text-sm font-bold text-[#26ffae]">
            Prize: {{ formatEther(gameState.stake * 2n) }} STT
          </p>
          <p v-else-if="isDraw" class="text-sm text-[#576975]">
            Stake returned: {{ formatEther(gameState.stake) }} STT
          </p>
          <p v-else class="text-sm text-[#ff008d80]">
            Lost {{ formatEther(gameState.stake) }} STT
          </p>
        </div>
        <div class="flex flex-col gap-2">
          <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0f80]">
            <span class="text-xs font-bold text-[#434343] w-6">R{{ i }}</span>
            <div class="flex items-center gap-2 flex-1 justify-center">
              <GameChoiceCard :choice="gameState.choices1[i-1]" :revealed="true" result="draw" size="sm" />
              <span class="text-xs text-[#434343]">vs</span>
              <GameChoiceCard :choice="gameState.choices2[i-1]" :revealed="true" result="draw" size="sm" />
            </div>
            <span class="text-xs font-extrabold w-12 text-right" :class="{
              'text-[#26ffae]': gameState.roundResults[i-1] === 1,
              'text-[#ff008d]': gameState.roundResults[i-1] === 2,
              'text-[#e9cc5a]': gameState.roundResults[i-1] === 3,
            }">
              {{ gameState.roundResults[i-1] === 1 ? 'P1' : gameState.roundResults[i-1] === 2 ? 'P2' : 'DRAW' }}
            </span>
          </div>
        </div>
        <div class="flex gap-3 justify-center pt-2">
          <NuxtLink to="/" class="px-5 py-2.5 rounded-xl font-bold text-sm border border-[#2b2b3a] text-[#a0aab0] hover:border-[#576975] transition-all">Home</NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatEther } from 'viem'
import { GamePhase, GameChoice } from '~/composables/useRPS'

const route = useRoute()
const gameId = decodeGameId(route.params.id as string)
const ZERO = '0x0000000000000000000000000000000000000000'
const { fireWinConfetti, fireDrawConfetti } = useConfetti()

const privy = usePrivy()
const { getGame, joinRoom, commitChoices, revealChoices } = useRPS()
const { subscribeToGame } = useReactivity()

const gameState = ref<any>(null)
const copied = ref(false)
const currentUserAddress = computed(() => privy.user.value?.wallet?.address)
const fmtAddr = (a: string) => a ? a.slice(0, 6) + '...' + a.slice(-4) : ''

const isPlayer1 = computed(() => currentUserAddress.value?.toLowerCase() === gameState.value?.player1?.toLowerCase())
const isPlayer2 = computed(() => currentUserAddress.value?.toLowerCase() === gameState.value?.player2?.toLowerCase())
const isPlayer = computed(() => isPlayer1.value || isPlayer2.value)
const isWinner = computed(() => currentUserAddress.value?.toLowerCase() === gameState.value?.winner?.toLowerCase())
const isDraw = computed(() => gameState.value?.winner === ZERO && gameState.value?.phase === GamePhase.Finished)

const opponentLabel = computed(() => {
  if (!gameState.value) return 'Opponent'
  if (gameState.value.isBot) return 'BOT'
  const addr = isPlayer1.value ? gameState.value.player2 : gameState.value.player1
  if (!addr || addr === ZERO) return 'Opponent'
  return addr.slice(0, 6) + '...' + addr.slice(-4)
})

const ZERO_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'
const opponentCommitted = computed(() => {
  if (!gameState.value) return false
  if (isPlayer1.value) return gameState.value.commit2 !== ZERO_HASH
  if (isPlayer2.value) return gameState.value.commit1 !== ZERO_HASH
  return false
})

const statusText = computed(() => {
  if (!gameState.value) return ''
  return { [GamePhase.Open]: 'Waiting', [GamePhase.Commit]: 'Pick Moves', [GamePhase.Reveal]: 'Revealing', [GamePhase.Finished]: 'Finished' }[gameState.value.phase] || ''
})
const statusClass = computed(() => {
  if (!gameState.value) return ''
  if (gameState.value.phase === GamePhase.Open) return 'text-[#e9cc5a]'
  if (gameState.value.phase === GamePhase.Finished) return 'text-[#26ffae]'
  return 'text-[#7a27ff]'
})

// === Join ===
const joining = ref(false)
const doJoin = async () => {
  joining.value = true
  try {
    await joinRoom(gameId, gameState.value.stake, currentUserAddress.value!)
    await new Promise(r => setTimeout(r, 2000))
    gameState.value = await getGame(gameId)
  } catch (e: any) { console.error('Join error:', e) }
  finally { joining.value = false }
}

// === Pick 3 choices + commit ===
const hasCommitted = ref(false)
const pickPhase = ref<'choosing' | 'locked' | 'submitting' | 'error'>('choosing')
const pickRound = ref(1)
const pickChoices = ref<number[]>([])
const lastPick = ref<number | null>(null)
const pickSelectorRef = ref<any>(null)
const pickError = ref('')

const onPickChoice = async (choice: GameChoice) => {
  pickChoices.value.push(choice)
  lastPick.value = choice

  if (pickChoices.value.length < 3) {
    pickPhase.value = 'locked'
    await new Promise(r => setTimeout(r, 600))
    pickRound.value = pickChoices.value.length + 1
    pickPhase.value = 'choosing'
    pickSelectorRef.value?.reset()
  } else {
    pickPhase.value = 'locked'
    await new Promise(r => setTimeout(r, 400))
    await submitCommit()
  }
}

const submitCommit = async () => {
  pickPhase.value = 'submitting'
  try {
    const addr = currentUserAddress.value!
    const choices: [number, number, number] = [pickChoices.value[0], pickChoices.value[1], pickChoices.value[2]]
    const { salts } = await commitChoices(gameId, choices, addr)

    // Save for reveal
    localStorage.setItem(`pvp_${gameId}_choices`, JSON.stringify(choices))
    localStorage.setItem(`pvp_${gameId}_salts`, JSON.stringify(salts))

    hasCommitted.value = true
    await new Promise(r => setTimeout(r, 2000))
    gameState.value = await getGame(gameId)

    // If both committed → auto-reveal
    if (gameState.value.phase === GamePhase.Reveal) {
      await autoReveal()
    }
  } catch (e: any) {
    console.error('Commit error:', e)
    pickError.value = e?.message?.slice(0, 120) || String(e)
    pickPhase.value = 'error'
  }
}

const retryCommit = () => {
  pickChoices.value = []
  pickRound.value = 1
  pickPhase.value = 'choosing'
}

// === Reveal (auto-triggered) ===
const revealing = ref(false)
const hasRevealed = ref(false)

const autoReveal = async () => {
  revealing.value = true
  try {
    const addr = currentUserAddress.value!
    const choices = JSON.parse(localStorage.getItem(`pvp_${gameId}_choices`) || '[]') as [number, number, number]
    const salts = JSON.parse(localStorage.getItem(`pvp_${gameId}_salts`) || '[]') as [string, string, string]
    if (!choices.length || !salts.length) throw new Error('No saved choices')

    await revealChoices(gameId, choices, salts, addr)
    hasRevealed.value = true

    await new Promise(r => setTimeout(r, 2000))
    gameState.value = await getGame(gameId)
  } catch (e: any) {
    console.error('Reveal error:', e)
  } finally {
    revealing.value = false
  }
}

// === Share ===
const shareRoom = async () => {
  try { await navigator.clipboard.writeText(window.location.href) } catch {}
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

// === Confetti on finish ===
const confettiFired = ref(false)
watch(() => gameState.value?.phase, (phase) => {
  if (phase === GamePhase.Finished && !confettiFired.value) {
    confettiFired.value = true
    if (isWinner.value) fireWinConfetti()
    else if (isDraw.value) fireDrawConfetti()
  }
})

// === Init + Reactivity ===
let reactiveSub: any = null

onMounted(async () => {
  gameState.value = await getGame(gameId)

  // Restore committed state
  if (isPlayer.value) {
    const myCommit = isPlayer1.value ? gameState.value.commit1 : gameState.value.commit2
    if (myCommit !== '0x0000000000000000000000000000000000000000000000000000000000000000') {
      hasCommitted.value = true
    }
    const myChoices = isPlayer1.value ? gameState.value.choices1 : gameState.value.choices2
    if (myChoices[0] !== 0) hasRevealed.value = true
  }

  // If we're in reveal phase and haven't revealed yet, auto-reveal
  if (gameState.value.phase === GamePhase.Reveal && isPlayer.value && hasCommitted.value && !hasRevealed.value) {
    autoReveal()
  }

  // Real-time updates
  if (!gameState.value.isBot) {
    reactiveSub = await subscribeToGame(gameId, async (eventName: string) => {
      console.log('[Room] Reactive event:', eventName)
      gameState.value = await getGame(gameId)

      // Auto-reveal when both committed
      if (gameState.value.phase === GamePhase.Reveal && hasCommitted.value && !hasRevealed.value && !revealing.value) {
        autoReveal()
      }
    })
  }
})

onUnmounted(() => { reactiveSub?.unsubscribe?.() })
</script>
