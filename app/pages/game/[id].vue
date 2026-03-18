<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <div class="flex items-center justify-between">
      <NuxtLink to="/" class="text-sm text-[#576975] hover:text-[#e6f1f8] transition-colors">
        &larr; Back to Games
      </NuxtLink>

      <!-- Share Button (PvP Open games) -->
      <button
        v-if="gameState && !gameState.isBot && gameState.phase === GamePhase.Open"
        @click="shareRoom"
        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all"
        :class="copied ? 'border-[#26ffae] text-[#26ffae] bg-[#26ffae10]' : 'border-[#2b2b3a] text-[#a0aab0] hover:border-[#576975] hover:text-[#e6f1f8]'"
      >
        <svg v-if="!copied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        {{ copied ? 'Link Copied!' : 'Share Room' }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="!gameState" class="rounded-2xl p-8 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
      <div class="h-32 bg-[#2b2b3a] animate-pulse rounded-lg" />
    </div>

    <template v-if="gameState">
      <!-- Share Banner for Open PvP -->
      <div
        v-if="!gameState.isBot && gameState.phase === GamePhase.Open && isPlayer1"
        class="rounded-xl p-4 bg-gradient-to-r from-[#7a27ff10] to-[#00fff210] border border-[#7a27ff30] flex items-center justify-between gap-4"
      >
        <div>
          <p class="text-sm font-bold text-[#e6f1f8]">Waiting for opponent...</p>
          <p class="text-xs text-[#576975]">Share this room link to invite someone to play</p>
        </div>
        <button
          @click="shareRoom"
          class="px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] text-white hover:shadow-[0_0_20px_#7a27ff60] transition-all whitespace-nowrap"
        >
          {{ copied ? 'Copied!' : 'Copy Link' }}
        </button>
      </div>

      <!-- Game Header -->
      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-bold">Game #{{ gameId }}</h2>
            <span v-if="gameState.isBot" class="text-xs font-bold text-[#00fff2] bg-[#00fff215] px-2 py-0.5 rounded">BOT</span>
            <span v-else class="text-xs font-bold text-[#e9cc5a] bg-[#e9cc5a15] px-2 py-0.5 rounded">PVP</span>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-[#576975]">Status</span>
              <span :class="['font-bold', statusClass]">{{ statusText }}</span>
            </div>
            <div v-if="!gameState.isBot" class="flex justify-between">
              <span class="text-[#576975]">Stake</span>
              <span class="font-[family-name:var(--font-mono)] font-bold">{{ formatEther(gameState.stake) }} STT</span>
            </div>
            <div v-if="gameState.winner !== zeroAddress" class="pt-2 border-t border-[#2b2b3a]">
              <p class="text-[#26ffae] font-bold text-sm">
                Winner: {{ gameState.winner === contractAddress ? 'Bot' : formatAddress(gameState.winner) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Players -->
        <div class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <h3 class="text-lg font-bold mb-4">Players</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f80]">
              <div>
                <p class="text-xs text-[#576975]">Player 1</p>
                <p class="font-[family-name:var(--font-mono)] text-sm font-bold">{{ formatAddress(gameState.player1) }}</p>
              </div>
              <GameChoiceCard
                v-if="gameState.phase === GamePhase.Finished"
                :choice="gameState.reveal1"
                :revealed="true"
                result="draw"
                size="sm"
              />
            </div>
            <div class="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f80]">
              <div>
                <p class="text-xs text-[#576975]">{{ gameState.isBot ? 'Bot' : 'Player 2' }}</p>
                <p class="font-[family-name:var(--font-mono)] text-sm font-bold">
                  {{ gameState.isBot ? 'On-Chain Bot' : gameState.player2 !== zeroAddress ? formatAddress(gameState.player2) : 'Waiting...' }}
                </p>
              </div>
              <GameChoiceCard
                v-if="gameState.phase === GamePhase.Finished"
                :choice="gameState.reveal2"
                :revealed="true"
                result="draw"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Bot Game: Best of 3 Round Details -->
      <div v-if="gameState.isBot && gameState.phase === GamePhase.Finished && bot3Data" class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
        <h3 class="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[#a0aab0] mb-4 uppercase">
          Best of 3 — {{ bot3Data.playerWins }} - {{ bot3Data.botWins }}
        </h3>

        <div class="flex flex-col gap-3">
          <div
            v-for="(round, i) in bot3Rounds"
            :key="i"
            class="flex items-center gap-4 p-3 rounded-lg bg-[#0a0a0f80]"
          >
            <span class="text-xs font-bold text-[#434343] w-8">R{{ i + 1 }}</span>

            <div class="flex items-center gap-3 flex-1 justify-center">
              <GameChoiceCard :choice="round.playerChoice" :revealed="true" result="draw" size="sm" />
              <span class="text-xs text-[#434343] font-bold">vs</span>
              <GameChoiceCard :choice="round.botChoice" :revealed="true" result="draw" size="sm" />
            </div>

            <span
              class="text-xs font-extrabold w-12 text-right"
              :class="{
                'text-[#26ffae]': round.result === 'win',
                'text-[#ff008d]': round.result === 'lose',
                'text-[#e9cc5a]': round.result === 'draw',
              }"
            >
              {{ round.result === 'win' ? 'WIN' : round.result === 'lose' ? 'LOSE' : 'DRAW' }}
            </span>
          </div>
        </div>
      </div>

      <!-- PvP Actions -->
      <template v-if="!gameState.isBot && currentUserAddress">
        <!-- Join -->
        <div v-if="gameState.phase === GamePhase.Open && !isPlayer" class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <h3 class="text-lg font-bold mb-4">Join This Game</h3>
          <button @click="joinGame" :disabled="joiningGame" class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] hover:shadow-[0_0_20px_#7a27ff60] transition-all disabled:opacity-50">
            {{ joiningGame ? 'Joining...' : `Join with ${formatEther(gameState.stake)} STT` }}
          </button>
        </div>

        <!-- Commit -->
        <div v-if="gameState.phase === GamePhase.Commit && isPlayer" class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <h3 class="text-lg font-bold mb-4">Make Your Choice</h3>
          <div v-if="!hasCommitted">
            <div class="flex gap-4 justify-center mb-4">
              <button
                v-for="c in pvpChoices"
                :key="c.value"
                @click="selectedChoice = c.value"
                class="flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all"
                :class="selectedChoice === c.value ? 'border-[#7a27ff] bg-[#7a27ff15]' : 'border-[#2b2b3a] hover:border-[#576975]'"
              >
                <GameChoiceCard :choice="c.value" :revealed="true" result="draw" size="sm" />
                <span class="text-xs font-bold">{{ c.label }}</span>
              </button>
            </div>
            <button @click="commitChoice" :disabled="selectedChoice === null || committingChoice" class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] hover:shadow-[0_0_20px_#7a27ff60] transition-all disabled:opacity-50">
              {{ committingChoice ? 'Committing...' : 'Commit' }}
            </button>
          </div>
          <div v-else class="text-center py-8 text-[#576975]">Choice committed! Waiting for opponent...</div>
        </div>

        <!-- Reveal -->
        <div v-if="gameState.phase === GamePhase.Reveal && isPlayer" class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <h3 class="text-lg font-bold mb-4">Reveal Your Choice</h3>
          <div v-if="!hasRevealed">
            <p class="text-sm text-[#576975] mb-4">Both players committed. Click reveal to show your choice.</p>
            <button @click="revealChoice" :disabled="revealingChoice" class="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] hover:shadow-[0_0_20px_#7a27ff60] transition-all disabled:opacity-50">
              {{ revealingChoice ? 'Revealing...' : 'Reveal Choice' }}
            </button>
          </div>
          <div v-else class="flex flex-col items-center gap-2 py-8">
            <GameChoiceCard :choice="myChoice" :revealed="true" result="draw" size="lg" />
            <p class="text-[#576975] text-sm">Waiting for opponent to reveal...</p>
          </div>
        </div>
      </template>

      <!-- Finished -->
      <div v-if="gameState.phase === GamePhase.Finished" class="rounded-2xl p-6 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
        <div class="text-center space-y-4">
          <div class="flex justify-center items-center gap-6">
            <div class="flex flex-col items-center gap-1">
              <GameChoiceCard :choice="gameState.reveal1" :revealed="true" :result="isWinner ? 'win' : 'draw'" size="lg" />
              <span class="text-xs font-bold text-[#00fff2]">You</span>
            </div>
            <span class="text-xl font-bold text-[#434343]">vs</span>
            <div class="flex flex-col items-center gap-1">
              <GameChoiceCard :choice="gameState.reveal2" :revealed="true" :result="!isWinner && gameState.winner !== zeroAddress ? 'win' : 'draw'" size="lg" />
              <span class="text-xs font-bold text-[#ff008d]">{{ gameState.isBot ? 'Bot' : 'Opponent' }}</span>
            </div>
          </div>

          <div v-if="gameState.winner !== zeroAddress">
            <p v-if="isWinner" class="text-2xl font-black text-[#26ffae]">You Won!</p>
            <p v-else class="text-2xl font-black text-[#ff008d]">You Lost</p>
          </div>
          <div v-else>
            <p class="text-2xl font-black text-[#e9cc5a]">Draw!</p>
          </div>

          <div class="flex gap-3 justify-center pt-2">
            <NuxtLink to="/" class="px-6 py-2.5 rounded-xl font-bold border border-[#2b2b3a] text-[#a0aab0] hover:border-[#576975] hover:text-[#e6f1f8] transition-all text-sm">
              Back to Games
            </NuxtLink>
            <NuxtLink v-if="gameState.isBot" to="/game/bot" class="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#7a27ff] to-[#5c1ed6] text-white hover:shadow-[0_0_20px_#7a27ff60] transition-all text-sm">
              Play Again
            </NuxtLink>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatEther } from 'viem'
import { GamePhase, GameChoice } from '~/composables/useRPS'

const route = useRoute()
const gameId = BigInt(route.params.id as string)
const zeroAddress = '0x0000000000000000000000000000000000000000'

const privy = usePrivy()
const {
  getGame,
  getBotGame3,
  commit,
  reveal,
  joinGame: joinGameContract,
  generateSalt,
  contractAddress,
} = useRPS()
const { subscribeToGame } = useReactivity()

const gameState = ref<any>(null)
const bot3Data = ref<any>(null)
const copied = ref(false)

const shareRoom = async () => {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    // Fallback
    const ta = document.createElement('textarea')
    ta.value = url
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
const currentUserAddress = computed(() => privy.user.value?.wallet?.address)

const selectedChoice = ref<GameChoice | null>(null)
const myChoice = ref<GameChoice>(GameChoice.None)
const mySalt = ref('')
const hasCommitted = ref(false)
const hasRevealed = ref(false)
const joiningGame = ref(false)
const committingChoice = ref(false)
const revealingChoice = ref(false)

const pvpChoices = [
  { value: GameChoice.Rock, label: 'Rock' },
  { value: GameChoice.Paper, label: 'Paper' },
  { value: GameChoice.Scissors, label: 'Scissors' },
]

const formatAddress = (addr: string) => addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : ''

const isPlayer1 = computed(() => currentUserAddress.value?.toLowerCase() === gameState.value?.player1?.toLowerCase())
const isPlayer2 = computed(() => currentUserAddress.value?.toLowerCase() === gameState.value?.player2?.toLowerCase())
const isPlayer = computed(() => isPlayer1.value || isPlayer2.value)
const isWinner = computed(() => currentUserAddress.value?.toLowerCase() === gameState.value?.winner?.toLowerCase())

const statusText = computed(() => {
  if (!gameState.value) return ''
  const labels: Record<number, string> = {
    [GamePhase.Open]: 'Waiting for Player 2',
    [GamePhase.Commit]: 'Committing Moves',
    [GamePhase.Reveal]: 'Revealing Choices',
    [GamePhase.Finished]: 'Game Over',
  }
  return labels[gameState.value.phase] || 'Unknown'
})

const statusClass = computed(() => {
  if (!gameState.value) return ''
  if (gameState.value.phase === GamePhase.Open) return 'text-[#e9cc5a]'
  if (gameState.value.phase === GamePhase.Finished) return 'text-[#26ffae]'
  return 'text-[#7a27ff]'
})

const getWinner = (p: number, b: number) => {
  if (p === b) return 'draw'
  if ((p === 1 && b === 3) || (p === 3 && b === 2) || (p === 2 && b === 1)) return 'win'
  return 'lose'
}

const bot3Rounds = computed(() => {
  if (!bot3Data.value) return []
  const rounds = []
  for (let i = 0; i < 3; i++) {
    const pc = bot3Data.value.playerChoices[i]
    const bc = bot3Data.value.botChoices[i]
    if (pc === 0) break
    rounds.push({ playerChoice: pc, botChoice: bc, result: getWinner(pc, bc) })
  }
  return rounds
})

const joinGame = async () => {
  try {
    joiningGame.value = true
    if (!currentUserAddress.value) throw new Error('Not connected')
    await joinGameContract(gameId, gameState.value.stake, currentUserAddress.value)
    gameState.value = await getGame(gameId)
  } catch (error) { console.error('Join error:', error) }
  finally { joiningGame.value = false }
}

const commitChoice = async () => {
  if (selectedChoice.value === null) return
  try {
    committingChoice.value = true
    if (!currentUserAddress.value) throw new Error('Not connected')
    const salt = generateSalt()
    mySalt.value = salt
    myChoice.value = selectedChoice.value
    localStorage.setItem(`game_${gameId}_choice`, String(selectedChoice.value))
    localStorage.setItem(`game_${gameId}_salt`, salt)
    await commit(gameId, selectedChoice.value, salt, currentUserAddress.value)
    hasCommitted.value = true
    gameState.value = await getGame(gameId)
  } catch (error) { console.error('Commit error:', error) }
  finally { committingChoice.value = false }
}

const revealChoice = async () => {
  try {
    revealingChoice.value = true
    if (!currentUserAddress.value) throw new Error('Not connected')
    if (!mySalt.value) mySalt.value = localStorage.getItem(`game_${gameId}_salt`) || ''
    if (myChoice.value === GameChoice.None) myChoice.value = parseInt(localStorage.getItem(`game_${gameId}_choice`) || '0')
    await reveal(gameId, myChoice.value, mySalt.value, currentUserAddress.value)
    hasRevealed.value = true
    gameState.value = await getGame(gameId)
  } catch (error) { console.error('Reveal error:', error) }
  finally { revealingChoice.value = false }
}

let reactiveSub: any = null

onMounted(async () => {
  gameState.value = await getGame(gameId)

  // Load bot game details
  if (gameState.value.isBot && gameState.value.phase === GamePhase.Finished) {
    try { bot3Data.value = await getBotGame3(gameId) } catch {}
  }

  // Restore PvP state
  if (isPlayer.value && gameState.value.phase >= GamePhase.Commit) {
    const sc = localStorage.getItem(`game_${gameId}_choice`)
    const ss = localStorage.getItem(`game_${gameId}_salt`)
    if (sc && ss) { myChoice.value = parseInt(sc); mySalt.value = ss; hasCommitted.value = true }
  }
  if (isPlayer.value && gameState.value.phase >= GamePhase.Reveal) {
    if (isPlayer1.value && gameState.value.reveal1 !== GameChoice.None) hasRevealed.value = true
    if (isPlayer2.value && gameState.value.reveal2 !== GameChoice.None) hasRevealed.value = true
  }

  // Reactivity for PvP
  if (!gameState.value.isBot) {
    reactiveSub = await subscribeToGame(gameId, async () => {
      gameState.value = await getGame(gameId)
    })
  }
})

onUnmounted(() => { reactiveSub?.unsubscribe?.() })
</script>
