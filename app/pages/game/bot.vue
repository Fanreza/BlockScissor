<template>
  <div class="min-h-[80vh] flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <NuxtLink to="/" class="text-sm text-muted-foreground hover:text-foreground">
        &larr; Back
      </NuxtLink>
      <button @click="toggleMute" class="text-sm text-muted-foreground hover:text-foreground">
        {{ muted ? '🔇' : '🔊' }}
      </button>
    </div>

    <!-- Round Indicator -->
    <GameRoundIndicator
      :current-round="currentRound"
      :completed-rounds="completedRounds"
      :player-score="playerScore"
      :bot-score="botScore"
      :round-results="roundResults"
      class="mb-8"
    />

    <!-- Choosing Phase -->
    <div v-if="phase === 'choosing'" class="flex-1 flex items-center">
      <GameChoiceSelector
        ref="selectorRef"
        @confirm="onConfirm"
        class="w-full"
      />
    </div>

    <!-- Battle Phase (showing animation while waiting for next round) -->
    <div v-if="phase === 'battle'" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center gap-4">
        <div class="text-center">
          <p class="text-lg font-bold text-[#e6f1f8]">Round {{ currentRound }} choice locked!</p>
          <p class="text-sm text-[#576975]">{{ currentRound < 3 ? 'Choose your next weapon...' : 'Submitting to blockchain...' }}</p>
        </div>
        <GameChoiceCard :choice="lastChoice!" :revealed="true" result="draw" size="lg" />
      </div>
    </div>

    <!-- Submitting Phase -->
    <div v-if="phase === 'submitting'" class="flex-1 flex flex-col items-center justify-center gap-4">
      <div class="chain-spinner-lg" />
      <p class="submit-status">{{ submitStatus }}</p>
      <p class="submit-hint">Please confirm the transaction in your wallet</p>
    </div>

    <!-- Revealing Phase (after tx, showing results round by round) -->
    <div v-if="phase === 'revealing'" class="flex-1 flex items-center justify-center">
      <GameBattleArena
        :player-choice="revealPlayerChoice!"
        :bot-choice="revealBotChoice!"
        :revealed="revealRevealed"
        :result="revealResult"
      />
    </div>

    <!-- Error Phase -->
    <div v-if="phase === 'error'" class="flex-1 flex flex-col items-center justify-center gap-4">
      <div class="error-icon">!</div>
      <p class="error-title">Transaction Failed</p>
      <p class="error-msg">{{ errorMessage }}</p>
      <div class="error-actions">
        <button @click="retrySubmit" class="error-btn-retry">Retry</button>
        <button @click="playAgain" class="error-btn-skip">Start Over</button>
      </div>
    </div>

    <!-- Game Over Overlay -->
    <GameOverlay
      :show="phase === 'gameover'"
      :player-wins="playerScore"
      :bot-wins="botScore"
      :is-winner="playerScore > botScore"
      :is-draw="playerScore === botScore"
      :rounds="allRounds"
      :submitting="false"
      :tx-hash="txHash"
      @play-again="playAgain"
    />
  </div>
</template>

<script setup lang="ts">
import { GameChoice } from '~/composables/useRPS'

const { playBotBestOf3, getGameCount, getGame } = useRPS()
const privy = usePrivy()
const { playReveal, playRoundWin, playRoundLose, playDraw, playWin, playLose, muted, toggleMute } = useSoundEffects()
const { fireWinConfetti, fireDrawConfetti } = useConfetti()

type Phase = 'choosing' | 'battle' | 'submitting' | 'revealing' | 'gameover' | 'error'
type RoundResult = 'win' | 'lose' | 'draw'

const phase = ref<Phase>('choosing')
const currentRound = ref(1)
const completedRounds = ref(0)
const playerScore = ref(0)
const botScore = ref(0)
const roundResults = ref<Array<RoundResult | null>>([null, null, null])

const allRounds = ref<Array<{ playerChoice: GameChoice; botChoice: GameChoice; result: RoundResult }>>([])
const playerChoices = ref<GameChoice[]>([])
const lastChoice = ref<GameChoice | null>(null)

const submitting = ref(false)
const txHash = ref<string | null>(null)
const submitStatus = ref('')
const errorMessage = ref('')

// Reveal animation state
const revealPlayerChoice = ref<GameChoice | null>(null)
const revealBotChoice = ref<GameChoice | null>(null)
const revealRevealed = ref(false)
const revealResult = ref<RoundResult | null>(null)

const selectorRef = ref<any>(null)

// Player picks a choice for current round
const onConfirm = async (choice: GameChoice) => {
  playerChoices.value.push(choice)
  lastChoice.value = choice

  if (playerChoices.value.length < 3) {
    // Show brief confirmation, then next round
    phase.value = 'battle'
    currentRound.value = playerChoices.value.length
    completedRounds.value = playerChoices.value.length

    await new Promise(r => setTimeout(r, 800))

    // Go to next round
    currentRound.value = playerChoices.value.length + 1
    phase.value = 'choosing'
    selectorRef.value?.reset()
  } else {
    // All 3 choices made — submit to blockchain
    phase.value = 'battle'
    completedRounds.value = 3
    currentRound.value = 3

    await new Promise(r => setTimeout(r, 500))
    await submitToChain()
  }
}

const submitToChain = async () => {
  phase.value = 'submitting'
  submitting.value = true
  submitStatus.value = 'Confirm in your wallet...'
  errorMessage.value = ''

  try {
    const address = privy.user.value?.wallet?.address
    if (!address) throw new Error('No wallet connected')

    const choices: [GameChoice, GameChoice, GameChoice] = [
      playerChoices.value[0],
      playerChoices.value[1],
      playerChoices.value[2],
    ]

    const hash = await playBotBestOf3(choices, address)
    submitStatus.value = 'Waiting for blockchain confirmation...'
    txHash.value = hash || 'confirmed'

    // Wait a moment for state to settle
    await new Promise(r => setTimeout(r, 2000))

    // Read actual results from contract (new unified Game struct)
    const count = await getGameCount()
    const gameId = count - 1n
    const game = await getGame(gameId)

    // Map to bot3 format for revealRounds
    const bot3 = {
      playerChoices: game.choices1,
      botChoices: game.choices2,
      roundResults: game.roundResults,
      playerWins: game.p1Wins,
      botWins: game.p2Wins,
    }

    // Now reveal results round by round with animation
    await revealRounds(bot3)
  } catch (error: any) {
    console.error('Failed to submit:', error)
    const msg = error?.message || error?.shortMessage || String(error)
    if (msg.includes('User rejected') || msg.includes('user rejected') || msg.includes('denied')) {
      errorMessage.value = 'Transaction was cancelled.'
    } else if (msg.includes('OUT_OF_GAS') || msg.includes('gas')) {
      errorMessage.value = 'Transaction ran out of gas. Try again.'
    } else if (msg.includes('insufficient')) {
      errorMessage.value = 'Insufficient STT balance for gas fees.'
    } else {
      errorMessage.value = msg.length > 120 ? msg.slice(0, 120) + '...' : msg
    }
    phase.value = 'error'
    submitting.value = false
  }
}

const roundResultToStr = (r: number): RoundResult => {
  // Contract: 1 = player win, 2 = bot win, 3 = draw
  if (r === 1) return 'win'
  if (r === 2) return 'lose'
  return 'draw'
}

const revealRounds = async (bot3: any) => {
  phase.value = 'revealing'
  submitting.value = false

  const pChoices = bot3.playerChoices as number[]
  const bChoices = bot3.botChoices as number[]
  const results = bot3.roundResults as number[]
  const finalPlayerWins = Number(bot3.playerWins)
  const finalBotWins = Number(bot3.botWins)

  let pScore = 0
  let bScore = 0

  for (let i = 0; i < 3; i++) {
    const pc = pChoices[i] as GameChoice
    const bc = bChoices[i] as GameChoice
    if (pc === 0) break // No more rounds played

    // Use on-chain result directly
    const result = roundResultToStr(results[i])

    // Set up battle arena
    revealPlayerChoice.value = pc
    revealBotChoice.value = bc
    revealRevealed.value = false
    revealResult.value = null

    // Brief pause then reveal
    await new Promise(r => setTimeout(r, 400))
    revealRevealed.value = true
    playReveal()

    await new Promise(r => setTimeout(r, 600))
    revealResult.value = result

    // Update scores from on-chain result
    if (result === 'win') { pScore++; playRoundWin() }
    else if (result === 'lose') { bScore++; playRoundLose() }
    else { playDraw() }

    playerScore.value = pScore
    botScore.value = bScore
    roundResults.value[i] = result
    completedRounds.value = i + 1

    allRounds.value.push({ playerChoice: pc, botChoice: bc, result })

    // Check if game decided early
    if (pScore >= 2 || bScore >= 2) break

    // Pause between rounds
    if (i < 2) await new Promise(r => setTimeout(r, 1500))
  }

  // Use on-chain final scores (authoritative)
  playerScore.value = finalPlayerWins
  botScore.value = finalBotWins

  // Show game over
  await new Promise(r => setTimeout(r, 1000))
  showGameOver()
}

const showGameOver = async () => {
  phase.value = 'gameover'
  await new Promise(r => setTimeout(r, 300))

  if (playerScore.value > botScore.value) {
    playWin()
    fireWinConfetti()
  } else if (playerScore.value === botScore.value) {
    playDraw()
    fireDrawConfetti()
  } else {
    playLose()
  }
}

const retrySubmit = () => {
  submitToChain()
}

const playAgain = () => {
  phase.value = 'choosing'
  currentRound.value = 1
  completedRounds.value = 0
  playerScore.value = 0
  botScore.value = 0
  roundResults.value = [null, null, null]
  lastChoice.value = null
  revealPlayerChoice.value = null
  revealBotChoice.value = null
  revealRevealed.value = false
  revealResult.value = null
  allRounds.value = []
  playerChoices.value = []
  txHash.value = null
  selectorRef.value?.reset()
}
</script>

<style scoped>
.chain-spinner-lg {
  width: 40px; height: 40px;
  border: 3px solid #2b2b3a; border-top-color: #7a27ff;
  border-radius: 50%; animation: spin 0.8s linear infinite;
}

.submit-status { color: #a0aab0; font-size: 0.95rem; font-weight: 600; }
.submit-hint { color: #434343; font-size: 0.8rem; }

.error-icon {
  width: 56px; height: 56px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 900; color: #ff008d;
  background: #ff008d15; border: 2px solid #ff008d40;
}
.error-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: #ff008d; }
.error-msg { color: #576975; font-size: 0.85rem; text-align: center; max-width: 400px; line-height: 1.5; }
.error-actions { display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.error-btn-retry {
  padding: 0.6rem 1.5rem; border-radius: 0.6rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;
  background: linear-gradient(135deg, #7a27ff, #5c1ed6); border: none; color: white; transition: all 0.2s;
}
.error-btn-retry:hover { box-shadow: 0 0 20px #7a27ff60; transform: scale(1.05); }
.error-btn-skip {
  padding: 0.6rem 1.5rem; border-radius: 0.6rem; font-weight: 700; font-size: 0.85rem; cursor: pointer;
  background: transparent; border: 1px solid #2b2b3a; color: #a0aab0; transition: all 0.2s;
}
.error-btn-skip:hover { border-color: #576975; color: #e6f1f8; }

@keyframes spin { to { transform: rotate(360deg); } }
</style>
