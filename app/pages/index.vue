<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb hero-orb-1" />
        <div class="hero-orb hero-orb-2" />
        <div class="hero-orb hero-orb-3" />
      </div>

      <div class="hero-content">
        <img src="/logo.png" alt="BlockScissor" class="hero-logo" />
        <h1 class="hero-title">
          <span class="hero-title-main">BlockScissor</span>
        </h1>
        <p class="hero-subtitle">
          On-Chain Rock Paper Scissors on <span class="text-accent">Somnia Network</span>
        </p>

        <!-- Weapon Icons -->
        <div class="hero-weapons">
          <div class="hero-weapon rock">
            <svg viewBox="0 0 150 120">
              <defs>
                <linearGradient id="hw-rock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff9500" /><stop offset="50%" stop-color="#ffb340" /><stop offset="100%" stop-color="#cc6a00" />
                </linearGradient>
                <linearGradient id="hw-rock-shine" x1="0%" y1="0%" x2="50%" y2="50%">
                  <stop offset="0%" stop-color="#ffe0a0" stop-opacity="0.8" /><stop offset="100%" stop-color="#ff9500" stop-opacity="0" />
                </linearGradient>
                <filter id="hw-rock-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#ff9500" flood-opacity="0.6" result="color"/><feComposite in="color" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <g filter="url(#hw-rock-glow)" transform="translate(75, 60)">
                <polygon points="0,-42 25,-28 30,-5 20,22 0,35 -20,22 -30,-5 -25,-28" fill="url(#hw-rock-grad)" stroke="#ffb340" stroke-width="1"/>
                <line x1="0" y1="-42" x2="0" y2="35" stroke="#ffe0a0" stroke-width="0.5" opacity="0.4"/>
                <line x1="-25" y1="-28" x2="20" y2="22" stroke="#ffe0a0" stroke-width="0.5" opacity="0.3"/>
                <line x1="25" y1="-28" x2="-20" y2="22" stroke="#ffe0a0" stroke-width="0.5" opacity="0.3"/>
                <polygon points="0,-42 25,-28 0,-12 -25,-28" fill="url(#hw-rock-shine)"/>
                <polygon points="0,-12 25,-28 30,-5 0,5" fill="#cc6a00" opacity="0.4"/>
                <polygon points="0,-12 -25,-28 -30,-5 0,5" fill="#ffb340" opacity="0.3"/>
                <circle cx="-10" cy="-20" r="4" fill="none" stroke="#ffe0a0" stroke-width="0.8" opacity="0.5"/>
                <circle cx="5" cy="-22" r="3.5" fill="none" stroke="#ffe0a0" stroke-width="0.8" opacity="0.5"/>
                <circle cx="15" cy="-16" r="3" fill="none" stroke="#ffe0a0" stroke-width="0.8" opacity="0.4"/>
                <g opacity="0.7">
                  <line x1="38" y1="-30" x2="44" y2="-30" stroke="#ffe0a0" stroke-width="1.5"/>
                  <line x1="41" y1="-33" x2="41" y2="-27" stroke="#ffe0a0" stroke-width="1.5"/>
                </g>
                <circle cx="35" cy="-15" r="1.5" fill="#ffe0a0" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>
              </g>
            </svg>
          </div>
          <div class="hero-weapon paper">
            <svg viewBox="0 0 150 120">
              <defs>
                <linearGradient id="hw-paper-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#00e5cc"/><stop offset="50%" stop-color="#00c9db"/><stop offset="100%" stop-color="#0090a8"/>
                </linearGradient>
                <filter id="hw-paper-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#00e5cc" flood-opacity="0.6" result="color"/><feComposite in="color" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <g filter="url(#hw-paper-glow)" transform="translate(75, 60)">
                <rect x="-28" y="-38" width="56" height="76" rx="3" fill="url(#hw-paper-grad)" stroke="#00ffee" stroke-width="1"/>
                <ellipse cx="0" cy="-38" rx="32" ry="6" fill="#00a89a" stroke="#00e5cc" stroke-width="0.8"/>
                <ellipse cx="0" cy="38" rx="32" ry="6" fill="#00a89a" stroke="#00e5cc" stroke-width="0.8"/>
                <g stroke="#00ffee" stroke-width="1.2" opacity="0.5" fill="none">
                  <path d="M-18,-22 L-14,-28 L-10,-22 L-14,-16 Z"><animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite"/></path>
                  <path d="M-2,-22 L4,-28 L4,-22 L-2,-16 Z"><animate attributeName="opacity" values="0.5;0.2;0.5" dur="2.5s" repeatCount="indefinite"/></path>
                  <line x1="-18" y1="-2" x2="18" y2="-2" opacity="0.4"/>
                  <line x1="-18" y1="8" x2="18" y2="8" opacity="0.3"/>
                  <line x1="-18" y1="18" x2="12" y2="18" opacity="0.2"/>
                </g>
              </g>
            </svg>
          </div>
          <div class="hero-weapon scissors">
            <svg viewBox="0 0 150 120">
              <defs>
                <linearGradient id="hw-scis-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#ff3399"/><stop offset="50%" stop-color="#ff66bb"/><stop offset="100%" stop-color="#cc0066"/>
                </linearGradient>
                <filter id="hw-scis-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feFlood flood-color="#ff3399" flood-opacity="0.6" result="color"/><feComposite in="color" in2="blur" operator="in" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <g filter="url(#hw-scis-glow)" transform="translate(75, 55)">
                <line x1="-20" y1="30" x2="10" y2="-25" stroke="url(#hw-scis-grad)" stroke-width="6" stroke-linecap="round"/>
                <line x1="20" y1="30" x2="-10" y2="-25" stroke="url(#hw-scis-grad)" stroke-width="6" stroke-linecap="round"/>
                <polygon points="10,-25 18,-45 6,-45 -2,-28" fill="#ff3399" stroke="#ff66bb" stroke-width="0.8"/>
                <polygon points="-10,-25 -18,-45 -6,-45 2,-28" fill="#ff3399" stroke="#ff66bb" stroke-width="0.8"/>
                <polygon points="10,-25 18,-45 6,-45 -2,-28" fill="#ff66bb" opacity="0.3"/>
                <circle cx="0" cy="8" r="8" fill="#1a1a2e" stroke="#ff3399" stroke-width="2"/>
                <circle cx="0" cy="8" r="4" fill="none" stroke="#ff66bb" stroke-width="1" opacity="0.5"/>
                <circle cx="-20" cy="30" r="10" fill="none" stroke="#ff3399" stroke-width="2"/>
                <circle cx="-20" cy="30" r="6" fill="#1a1a2e" stroke="#ff66bb" stroke-width="1"/>
                <circle cx="20" cy="30" r="10" fill="none" stroke="#ff3399" stroke-width="2"/>
                <circle cx="20" cy="30" r="6" fill="#1a1a2e" stroke="#ff66bb" stroke-width="1"/>
                <circle cx="25" cy="-20" r="1.5" fill="#ff66bb" opacity="0.6"><animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/></circle>
              </g>
            </svg>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="hero-actions">
          <NuxtLink
            v-if="isAuthenticated"
            to="/game/bot"
            class="cta-primary"
          >
            <span class="cta-icon">⚔️</span>
            <span class="cta-text">
              <span class="cta-label">PLAY VS BOT</span>
              <span class="cta-sub">Best of 3 Rounds</span>
            </span>
          </NuxtLink>

          <button
            v-if="isAuthenticated"
            @click="showCreateDialog = true"
            class="cta-secondary"
          >
            <span class="cta-icon">👥</span>
            <span class="cta-text">
              <span class="cta-label">PVP MATCH</span>
              <span class="cta-sub">Stake STT Tokens</span>
            </span>
          </button>

          <button
            v-if="!isAuthenticated"
            @click="connectWallet"
            class="cta-primary"
          >
            <span class="cta-icon">🔗</span>
            <span class="cta-text">
              <span class="cta-label">CONNECT WALLET</span>
            </span>
          </button>
        </div>

      </div>
    </section>

    <!-- How It Works -->
    <section class="how-it-works">
      <h2 class="section-title">How It Works</h2>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-icon">🔗</div>
          <h3>Connect</h3>
          <p>Link your wallet to Somnia Testnet</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-icon">🎮</div>
          <h3>Choose</h3>
          <p>Pick Rock, Paper, or Scissors each round</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-icon">⚡</div>
          <h3>Battle</h3>
          <p>Results verified on-chain instantly</p>
        </div>
      </div>
    </section>

    <!-- Recent Games -->
    <section v-if="games.length > 0" class="recent-games">
      <h2 class="section-title">Recent Games</h2>
      <div class="games-grid">
        <NuxtLink
          v-for="game in games"
          :key="game.id"
          :to="`/game/${encodeGameId(game.id)}`"
          class="game-card"
        >
          <div class="game-card-header">
            <span class="game-id">#{{ game.id }}</span>
            <span :class="['game-badge', phaseBadgeClass(game.phase)]">
              {{ phaseLabel(game.phase) }}
            </span>
          </div>
          <div class="game-card-body">
            <span v-if="game.isBot" class="game-type bot">🤖 vs Bot</span>
            <span v-else class="game-type pvp">👥 PvP</span>
            <span v-if="!game.isBot" class="game-stake">
              {{ formatEther(game.stake) }} STT
            </span>
          </div>
          <div class="game-card-footer">
            {{ game.player1.slice(0, 6) }}...{{ game.player1.slice(-4) }}
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Create PvP Game Dialog -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCreateDialog" class="modal-overlay" @click.self="showCreateDialog = false">
          <div class="modal-card">
            <div class="modal-header">
              <h2>⚔️ Create PvP Match</h2>
              <button @click="showCreateDialog = false" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
              <label class="input-label">Stake Amount (STT)</label>
              <input
                v-model="stakeAmount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.1"
                class="stake-input"
              />
              <p class="input-hint">Winner takes the full pot. You'll pick your 3 moves after opponent joins.</p>
            </div>
            <div class="modal-actions">
              <button @click="showCreateDialog = false" class="modal-btn-cancel">Cancel</button>
              <button
                @click="goToPvpSetup"
                :disabled="!stakeAmount || creatingGame"
                class="modal-btn-confirm"
              >
                {{ creatingGame ? 'Creating...' : 'Create Room' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { formatEther, parseEther } from 'viem'
import { GamePhase, GameChoice } from '~/composables/useRPS'

interface GameListItem {
  id: bigint
  player1: string
  phase: number
  stake: bigint
  isBot: boolean
}

const privy = usePrivy()
const {
  createRoom,
  getGame,
  getGameCount,
} = useRPS()
const { subscribeToAllGames } = useReactivity()

const isAuthenticated = computed(() => privy.isAuthenticated.value)
const games = ref<GameListItem[]>([])
const loading = ref(true)
const totalGames = ref('0')
const liveUpdates = ref(0)

const showCreateDialog = ref(false)
const stakeAmount = ref('')
const creatingGame = ref(false)

const connectWallet = () => privy.connectWallet()

const phaseLabel = (phase: number) => {
  const labels: Record<number, string> = {
    [GamePhase.Open]: 'Open',
    [GamePhase.Commit]: 'Playing',
    [GamePhase.Reveal]: 'Revealing',
    [GamePhase.Finished]: 'Finished',
  }
  return labels[phase] || 'Unknown'
}

const phaseBadgeClass = (phase: number) => {
  if (phase === GamePhase.Open) return 'badge-open'
  if (phase === GamePhase.Finished) return 'badge-finished'
  return 'badge-playing'
}

const goToPvpSetup = async () => {
  if (!stakeAmount.value || !isAuthenticated.value) return
  try {
    creatingGame.value = true
    const stake = parseEther(`${stakeAmount.value}`)
    await createRoom(stake, privy.user.value!.wallet!.address)

    const count = await getGameCount()
    const newGameId = count - 1n

    showCreateDialog.value = false
    stakeAmount.value = ''
    navigateTo(`/game/${encodeGameId(newGameId)}`)
  } catch (error) {
    console.error('Failed to create room:', error)
  } finally {
    creatingGame.value = false
  }
}

const loadGames = async () => {
  try {
    loading.value = true
    const count = await getGameCount()
    totalGames.value = count.toString()

    if (count === 0n) { games.value = []; return }

    const loaded: GameListItem[] = []
    const start = count > 12n ? count - 12n : 0n
    for (let i = count - 1n; i >= start; i--) {
      try {
        const game = await getGame(i)
        loaded.push({ id: i, player1: game.player1, phase: game.phase, stake: game.stake, isBot: game.isBot })
      } catch {}
    }
    games.value = loaded
  } catch (error) {
    console.error('Failed to load games:', error)
  } finally {
    loading.value = false
  }
}

let reactiveSub: any = null

onMounted(async () => {
  await loadGames()

  // Live updates via Somnia Reactivity SDK — no polling
  reactiveSub = await subscribeToAllGames((eventName: string) => {
    console.log('[Reactivity] Homepage: event received:', eventName)
    liveUpdates.value++
    loadGames()
  })
})

onUnmounted(() => {
  reactiveSub?.unsubscribe?.()
})
</script>

<style scoped>
/* ===== Hero ===== */
.homepage {
  margin: -1.5rem -1rem;
  padding: 0 1rem;
}

.hero {
  position: relative;
  padding: 5rem 0 4rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-bg { position: absolute; inset: 0; z-index: 0; }

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
  animation: float 8s ease-in-out infinite;
}

.hero-orb-1 { width: 600px; height: 600px; background: #7a27ff; top: -200px; left: -200px; }
.hero-orb-2 { width: 500px; height: 500px; background: #00fff2; bottom: -200px; right: -200px; animation-delay: -3s; }
.hero-orb-3 { width: 400px; height: 400px; background: #ff008d; top: 40%; left: 60%; transform: translate(-50%, -50%); animation-delay: -5s; }

.hero-content { position: relative; z-index: 1; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }

.hero-weapons {
  display: flex; gap: 2.5rem; margin-bottom: 0.5rem;
}

.hero-weapon {
  width: 80px; height: 80px; padding: 8px;
  border-radius: 16px; background: #0a0a0f80;
  border: 1px solid #2b2b3a;
  animation: bounce-float 3s ease-in-out infinite;
  transition: all 0.3s;
}

.hero-weapon:hover { transform: scale(1.15); }
.hero-weapon svg { width: 100%; height: 100%; }

.hero-weapon.rock { border-color: #ff950040; box-shadow: 0 0 20px #ff950015; animation-delay: 0s; }
.hero-weapon.rock:hover { box-shadow: 0 0 30px #ff950040; border-color: #ff9500; }

.hero-weapon.paper { border-color: #00e5cc40; box-shadow: 0 0 20px #00e5cc15; animation-delay: -1s; }
.hero-weapon.paper:hover { box-shadow: 0 0 30px #00e5cc40; border-color: #00e5cc; }

.hero-weapon.scissors { border-color: #ff339940; box-shadow: 0 0 20px #ff339915; animation-delay: -2s; }
.hero-weapon.scissors:hover { box-shadow: 0 0 30px #ff339940; border-color: #ff3399; }

.hero-logo {
  width: 80px; height: 80px; border-radius: 16px;
  box-shadow: 0 0 40px #7a27ff40, 0 0 80px #7a27ff20;
  animation: logo-glow 3s ease-in-out infinite;
}

@keyframes logo-glow {
  0%, 100% { box-shadow: 0 0 40px #7a27ff40, 0 0 80px #7a27ff20; }
  50% { box-shadow: 0 0 60px #7a27ff60, 0 0 100px #7a27ff30; }
}

.hero-title { display: flex; flex-direction: column; line-height: 1; }

.hero-title-main {
  font-family: var(--font-display); font-size: 5rem; font-weight: 900; letter-spacing: 0.05em;
  background: linear-gradient(135deg, #00fff2, #7a27ff, #ff008d);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  filter: drop-shadow(0 0 30px #7a27ff80);
}

.hero-subtitle { font-size: 1.1rem; color: #576975; max-width: 400px; }

/* CTA */
.hero-actions { display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap; justify-content: center; }

.cta-primary, .cta-secondary {
  display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.75rem;
  border-radius: 1rem; cursor: pointer; text-decoration: none; min-width: 220px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-primary {
  background: linear-gradient(135deg, #7a27ff, #5c1ed6);
  border: 1px solid #7a27ff80;
  box-shadow: 0 0 30px #7a27ff30, inset 0 1px 0 #ffffff15;
}

.cta-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 0 50px #7a27ff60, 0 10px 40px #00000050;
  border-color: #7a27ffcc;
}

.cta-secondary {
  background: #141418cc;
  border: 1px solid #2b2b3a;
  backdrop-filter: blur(10px);
}

.cta-secondary:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: #00fff280;
  box-shadow: 0 0 30px #00fff220;
}

.cta-icon { font-size: 1.75rem; }
.cta-text { display: flex; flex-direction: column; text-align: left; }
.cta-label { font-family: var(--font-display); font-size: 0.85rem; font-weight: 700; letter-spacing: 0.05em; color: #e6f1f8; }
.cta-sub { font-size: 0.75rem; color: #576975; }

/* Stats */
.stats-bar {
  display: flex; align-items: center; gap: 1.5rem; margin-top: 1.5rem;
  padding: 0.75rem 1.5rem; border-radius: 1rem;
  background: #0a0a0f99; border: 1px solid #2b2b3a; backdrop-filter: blur(10px);
}

.stat-item { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; }
.stat-value { font-size: 1.25rem; font-weight: 800; color: #e6f1f8; font-family: var(--font-mono); }
.stat-label { font-size: 0.65rem; color: #576975; text-transform: uppercase; letter-spacing: 0.05em; }
.stat-divider { width: 1px; height: 30px; background: #2b2b3a; }

.live-dot {
  display: inline-block; width: 10px; height: 10px; border-radius: 50%;
}

.live-dot--on {
  background: #26ffae;
  box-shadow: 0 0 8px #26ffae, 0 0 16px #26ffae66;
  animation: live-pulse 2s ease-in-out infinite;
}

.live-dot--off {
  background: #576975;
}

@keyframes live-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px #26ffae, 0 0 16px #26ffae66; }
  50% { opacity: 0.6; box-shadow: 0 0 4px #26ffae66; }
}

/* ===== How It Works ===== */
.how-it-works { padding: 3rem 0; }
.section-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 700; text-align: center; margin-bottom: 2rem; letter-spacing: 0.05em; }

.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }

.step-card {
  position: relative; padding: 1.5rem; border-radius: 1rem; text-align: center;
  background: linear-gradient(180deg, #1c1c28, #141418);
  border: 1px solid #2b2b3a; transition: all 0.3s;
}

.step-card:hover {
  transform: translateY(-4px);
  border-color: #7a27ff60;
  box-shadow: 0 8px 30px #7a27ff15;
}

.step-number {
  position: absolute; top: -10px; left: 50%; transform: translateX(-50%);
  width: 24px; height: 24px; border-radius: 50%;
  background: linear-gradient(135deg, #7a27ff, #5c1ed6);
  font-size: 0.75rem; font-weight: 800; color: white;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 10px #7a27ff60;
}

.step-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.step-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.25rem; }
.step-card p { font-size: 0.8rem; color: #576975; }

/* ===== Recent Games ===== */
.recent-games { padding: 2rem 0 3rem; }
.games-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }

.game-card {
  display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; border-radius: 0.75rem;
  background: linear-gradient(180deg, #1c1c28, #141418);
  border: 1px solid #2b2b3a; text-decoration: none; color: inherit; transition: all 0.2s;
}

.game-card:hover {
  border-color: #7a27ff80;
  box-shadow: 0 0 20px #7a27ff20;
  transform: translateY(-2px);
}

.game-card-header { display: flex; justify-content: space-between; align-items: center; }
.game-id { font-size: 0.8rem; font-family: var(--font-mono); color: #576975; }

.game-badge {
  font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.5rem;
  border-radius: 0.375rem; text-transform: uppercase; letter-spacing: 0.05em;
}

.badge-open { background: #26ffae20; color: #26ffae; }
.badge-playing { background: #7a27ff20; color: #b07aff; }
.badge-finished { background: #57697520; color: #576975; }

.game-card-body { display: flex; justify-content: space-between; align-items: center; }
.game-type { font-size: 0.85rem; font-weight: 600; }
.game-type.bot { color: #00fff2; }
.game-type.pvp { color: #e9cc5a; }
.game-stake { font-size: 0.85rem; font-weight: 700; font-family: var(--font-mono); color: #e9cc5a; }
.game-card-footer { font-size: 0.7rem; font-family: var(--font-mono); color: #434343; }

/* ===== Modal ===== */
.modal-overlay {
  position: fixed; inset: 0; z-index: 100;
  display: flex; align-items: center; justify-content: center;
  background: #0a0a0fd9; backdrop-filter: blur(8px);
}

.modal-card {
  width: 90%; max-width: 420px; border-radius: 1.25rem;
  background: linear-gradient(180deg, #1c1c28, #141418);
  border: 1px solid #2b2b3a; overflow: hidden;
}

.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.25rem 1.5rem; border-bottom: 1px solid #2b2b3a;
}

.modal-header h2 { font-size: 1.15rem; font-weight: 800; }
.modal-close { font-size: 1.5rem; color: #576975; cursor: pointer; background: none; border: none; }
.modal-body { padding: 1.5rem; }
.input-label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: #a0aab0; }

.stake-input {
  width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem;
  border: 1px solid #2b2b3a; background: #0a0a0f; color: #e6f1f8;
  font-size: 1.1rem; font-family: var(--font-mono); outline: none; transition: all 0.2s;
}

.stake-input:focus { border-color: #7a27ff; box-shadow: 0 0 15px #7a27ff30; }
.input-hint { font-size: 0.75rem; color: #576975; margin-top: 0.5rem; }
.modal-actions { display: flex; gap: 0.75rem; padding: 0 1.5rem 1.5rem; }

.modal-btn-cancel, .modal-btn-confirm {
  flex: 1; padding: 0.75rem; border-radius: 0.75rem;
  font-weight: 700; font-size: 0.9rem; cursor: pointer; transition: all 0.2s;
}

.modal-btn-cancel { background: transparent; border: 1px solid #2b2b3a; color: #a0aab0; }
.modal-btn-confirm { background: linear-gradient(135deg, #7a27ff, #5c1ed6); border: none; color: white; }
.modal-btn-confirm:hover { box-shadow: 0 0 20px #7a27ff60; }
.modal-btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }

/* ===== Animations ===== */
@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -20px); }
  66% { transform: translate(-20px, 15px); }
}

@keyframes bounce-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-12px) rotate(-5deg); }
  75% { transform: translateY(-6px) rotate(5deg); }
}

.modal-enter-active { animation: modal-in 0.3s ease; }
.modal-leave-active { animation: modal-in 0.2s ease reverse; }
@keyframes modal-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

/* ===== Responsive ===== */
@media (max-width: 640px) {
  .hero-title-main { font-size: 3.5rem; }
  .hero-actions { flex-direction: column; align-items: center; }
  .cta-primary, .cta-secondary { width: 100%; max-width: 300px; }
  .steps-grid { grid-template-columns: 1fr; }
  .stats-bar { flex-wrap: wrap; justify-content: center; }
}
</style>
