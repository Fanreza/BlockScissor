<template>
  <div class="max-w-[900px] mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="font-[family-name:var(--font-display)] text-3xl font-black tracking-wide bg-gradient-to-r from-[#00fff2] to-[#7a27ff] bg-clip-text text-transparent">
        Leaderboard
      </h1>
      <p class="text-[#576975] text-sm flex items-center gap-2">
        Live stats from Somnia Testnet
        <span
          class="w-2 h-2 rounded-full inline-block"
          :class="reactivityConnected ? 'bg-[#26ffae] shadow-[0_0_6px_#26ffae] animate-pulse' : 'bg-[#576975]'"
        />
      </p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center gap-4 py-16 text-[#576975]">
      <div class="w-8 h-8 border-3 border-[#2b2b3a] border-t-[#7a27ff] rounded-full animate-spin" />
      <p>Loading on-chain data...</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <!-- Top Players -->
        <div class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <h2 class="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[#a0aab0] mb-4 uppercase">
            Top Players
          </h2>

          <div v-if="topPlayers.length === 0" class="text-center py-8 text-[#576975] text-sm">
            No games completed yet
          </div>

          <div v-else class="flex flex-col gap-2">
            <div
              v-for="(player, idx) in topPlayers"
              :key="player.address"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#0a0a0f80] border border-[#2b2b3a20] hover:bg-[#1c1c2880] hover:border-[#2b2b3a] transition-all"
            >
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold font-[family-name:var(--font-mono)]"
                :class="{
                  'bg-[#e9cc5a30] text-[#e9cc5a] shadow-[0_0_8px_#e9cc5a40]': idx === 0,
                  'bg-[#a0aab020] text-[#a0aab0]': idx === 1,
                  'bg-[#cc774430] text-[#cc7744]': idx === 2,
                  'bg-[#2b2b3a] text-[#576975]': idx > 2,
                }"
              >
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <span class="block font-[family-name:var(--font-mono)] text-xs font-semibold text-[#e6f1f8]">
                  {{ formatAddress(player.address) }}
                </span>
                <span class="text-[0.65rem] text-[#576975]">
                  {{ player.wins }}W - {{ player.losses }}L - {{ player.draws }}D
                </span>
              </div>
              <div class="text-right min-w-[60px]">
                <span class="font-[family-name:var(--font-mono)] text-sm font-extrabold text-[#26ffae]">
                  {{ player.winRate }}%
                </span>
                <div class="w-[60px] h-[3px] bg-[#2b2b3a] rounded-sm mt-1">
                  <div
                    class="h-full rounded-sm bg-[#26ffae] transition-all duration-500"
                    :style="{ width: player.winRate + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Choice Distribution -->
        <div class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
          <h2 class="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[#a0aab0] mb-4 uppercase">
            Choice Distribution
          </h2>

          <div class="flex flex-col gap-4">
            <div v-for="c in choiceDistribution" :key="c.name" class="flex items-center gap-3">
              <div :style="`color: ${c.color}`">
                <svg v-if="c.name === 'Rock'" viewBox="0 0 40 40" class="w-8 h-8">
                  <polygon points="20,4 32,14 28,30 12,30 8,14" fill="currentColor" opacity="0.8" stroke="currentColor" stroke-width="1"/>
                </svg>
                <svg v-if="c.name === 'Paper'" viewBox="0 0 40 40" class="w-8 h-8">
                  <rect x="10" y="6" width="20" height="28" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                  <line x1="14" y1="14" x2="26" y2="14" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                  <line x1="14" y1="20" x2="26" y2="20" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                  <line x1="14" y1="26" x2="22" y2="26" stroke="currentColor" stroke-width="1" opacity="0.5"/>
                </svg>
                <svg v-if="c.name === 'Scissors'" viewBox="0 0 40 40" class="w-8 h-8">
                  <line x1="10" y1="8" x2="24" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  <line x1="30" y1="8" x2="16" y2="22" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                  <circle cx="14" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                  <circle cx="26" cy="30" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <div class="flex-1">
                <div class="flex justify-between mb-1">
                  <span class="text-sm font-bold">{{ c.name }}</span>
                  <span class="text-[0.7rem] text-[#576975] font-[family-name:var(--font-mono)]">{{ c.count }} times ({{ c.percentage }}%)</span>
                </div>
                <div class="w-full h-1.5 bg-[#2b2b3a] rounded-full">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: c.percentage + '%', background: c.color, boxShadow: `0 0 8px ${c.color}` }"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Global Stats -->
          <div class="grid grid-cols-4 gap-2 mt-5 pt-4 border-t border-[#2b2b3a]">
            <div class="text-center">
              <span class="block font-[family-name:var(--font-mono)] text-lg font-extrabold text-[#e6f1f8]">{{ totalGames }}</span>
              <span class="text-[0.6rem] text-[#576975] uppercase tracking-wide">Total Games</span>
            </div>
            <div class="text-center">
              <span class="block font-[family-name:var(--font-mono)] text-lg font-extrabold text-[#e6f1f8]">{{ totalPlayers }}</span>
              <span class="text-[0.6rem] text-[#576975] uppercase tracking-wide">Players</span>
            </div>
            <div class="text-center">
              <span class="block font-[family-name:var(--font-mono)] text-lg font-extrabold text-[#e6f1f8]">{{ botGames }}</span>
              <span class="text-[0.6rem] text-[#576975] uppercase tracking-wide">Bot Games</span>
            </div>
            <div class="text-center">
              <span class="block font-[family-name:var(--font-mono)] text-lg font-extrabold text-[#e6f1f8]">{{ pvpGames }}</span>
              <span class="text-[0.6rem] text-[#576975] uppercase tracking-wide">PvP Games</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Games -->
      <div class="rounded-2xl p-5 bg-gradient-to-b from-[#1c1c28] to-[#141418] border border-[#2b2b3a]">
        <h2 class="font-[family-name:var(--font-display)] text-xs font-bold tracking-widest text-[#a0aab0] mb-4 uppercase">
          Recent Games
        </h2>

        <div v-if="recentGames.length === 0" class="text-center py-8 text-[#576975] text-sm">
          No completed games yet
        </div>

        <div v-else class="flex flex-col gap-1.5">
          <div
            v-for="game in recentGames"
            :key="game.id.toString()"
            class="flex items-center px-3 py-2.5 rounded-lg bg-[#0a0a0f80] hover:bg-[#1c1c2880] transition-all"
          >
            <span class="font-[family-name:var(--font-mono)] text-[0.7rem] text-[#434343] w-9 shrink-0">
              #{{ game.id }}
            </span>

            <span class="flex-1 flex items-center justify-center gap-2">
              <span
                class="font-[family-name:var(--font-mono)] text-[0.7rem]"
                :class="!game.isDraw && game.winner.toLowerCase() === game.player1.toLowerCase() ? 'text-[#26ffae] font-bold' : 'text-[#576975]'"
              >
                {{ formatAddress(game.player1) }}
              </span>
              <span class="font-[family-name:var(--font-mono)] text-sm font-extrabold text-[#e6f1f8] min-w-[50px] text-center">
                {{ game.playerWins }} - {{ game.botWins }}
              </span>
              <span class="font-[family-name:var(--font-mono)] text-[0.7rem] text-[#576975]">
                {{ game.isBot ? 'Bot' : formatAddress(game.player2) }}
              </span>
            </span>

            <span class="w-12 text-right text-[0.7rem] font-bold shrink-0">
              <span v-if="game.isDraw" class="text-[#e9cc5a]">DRAW</span>
              <span v-else-if="game.winner.toLowerCase() === game.player1.toLowerCase()" class="text-[#26ffae]">WIN</span>
              <span v-else class="text-[#ff008d]">LOSE</span>
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { GamePhase } from '~/composables/useRPS'

interface PlayerStats {
  address: string
  wins: number
  losses: number
  draws: number
  winRate: number
}

interface RecentGameItem {
  id: bigint
  player1: string
  player2: string
  winner: string
  isBot: boolean
  isDraw: boolean
  playerWins: number
  botWins: number
}

const { getGame, getGameCount, getBotGame3 } = useRPS()
const { subscribeToAllGames, isConnected: reactivityConnected } = useReactivity()

const loading = ref(true)
const topPlayers = ref<PlayerStats[]>([])
const recentGames = ref<RecentGameItem[]>([])
const totalGames = ref(0)
const totalPlayers = ref(0)
const botGames = ref(0)
const pvpGames = ref(0)
const choiceDistribution = ref([
  { name: 'Rock', count: 0, percentage: 0, color: '#ff9500' },
  { name: 'Paper', count: 0, percentage: 0, color: '#00e5cc' },
  { name: 'Scissors', count: 0, percentage: 0, color: '#ff3399' },
])

const ZERO_ADDR = '0x0000000000000000000000000000000000000000'

const formatAddress = (addr: string) => addr.slice(0, 6) + '...' + addr.slice(-4)

const loadLeaderboard = async () => {
  try {
    loading.value = true
    const count = await getGameCount()
    totalGames.value = Number(count)

    if (count === 0n) return

    const playerMap = new Map<string, { wins: number; losses: number; draws: number }>()
    const choiceCounts = [0, 0, 0, 0]
    const recent: RecentGameItem[] = []
    let botCount = 0
    let pvpCount = 0
    const playerSet = new Set<string>()

    const start = count > 50n ? count - 50n : 0n
    for (let i = count - 1n; i >= start; i--) {
      try {
        const game = await getGame(i)
        if (game.phase !== GamePhase.Finished) continue

        const p1 = game.player1.toLowerCase()
        const p2 = game.player2.toLowerCase()
        const winner = game.winner.toLowerCase()
        const isDraw = winner === ZERO_ADDR

        playerSet.add(p1)
        if (!game.isBot) playerSet.add(p2)

        if (game.isBot) {
          botCount++
          try {
            const bot3 = await getBotGame3(i)
            for (const c of bot3.playerChoices) {
              if (c >= 1 && c <= 3) choiceCounts[c]++
            }
          } catch {
            if (game.reveal1 >= 1 && game.reveal1 <= 3) choiceCounts[game.reveal1]++
          }
        } else {
          pvpCount++
          if (game.reveal1 >= 1 && game.reveal1 <= 3) choiceCounts[game.reveal1]++
          if (game.reveal2 >= 1 && game.reveal2 <= 3) choiceCounts[game.reveal2]++
        }

        const ensurePlayer = (addr: string) => {
          if (!playerMap.has(addr)) playerMap.set(addr, { wins: 0, losses: 0, draws: 0 })
          return playerMap.get(addr)!
        }

        if (isDraw) {
          ensurePlayer(p1).draws++
          if (!game.isBot) ensurePlayer(p2).draws++
        } else if (winner === p1) {
          ensurePlayer(p1).wins++
          if (!game.isBot) ensurePlayer(p2).losses++
        } else {
          ensurePlayer(p1).losses++
          if (!game.isBot) ensurePlayer(p2).wins++
        }

        if (recent.length < 15) {
          let pWins = 0
          let bWins = 0
          if (game.isBot) {
            try {
              const bot3 = await getBotGame3(i)
              pWins = bot3.playerWins
              bWins = bot3.botWins
            } catch {}
          }
          recent.push({
            id: i,
            player1: game.player1,
            player2: game.player2,
            winner: game.winner,
            isBot: game.isBot,
            isDraw,
            playerWins: pWins,
            botWins: bWins,
          })
        }
      } catch {}
    }

    const players: PlayerStats[] = []
    for (const [address, stats] of playerMap) {
      const total = stats.wins + stats.losses + stats.draws
      const winRate = total > 0 ? Math.round((stats.wins / total) * 100) : 0
      players.push({ address, ...stats, winRate })
    }
    players.sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
    topPlayers.value = players.slice(0, 10)

    const totalChoices = choiceCounts[1] + choiceCounts[2] + choiceCounts[3]
    choiceDistribution.value = [
      { name: 'Rock', count: choiceCounts[1], percentage: totalChoices ? Math.round((choiceCounts[1] / totalChoices) * 100) : 0, color: '#ff9500' },
      { name: 'Paper', count: choiceCounts[2], percentage: totalChoices ? Math.round((choiceCounts[2] / totalChoices) * 100) : 0, color: '#00e5cc' },
      { name: 'Scissors', count: choiceCounts[3], percentage: totalChoices ? Math.round((choiceCounts[3] / totalChoices) * 100) : 0, color: '#ff3399' },
    ]

    recentGames.value = recent
    totalPlayers.value = playerSet.size
    botGames.value = botCount
    pvpGames.value = pvpCount
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
  } finally {
    loading.value = false
  }
}

let reactiveSub: any = null

onMounted(async () => {
  await loadLeaderboard()

  reactiveSub = await subscribeToAllGames((eventName: string) => {
    console.log('[Reactivity] Leaderboard: event received:', eventName)
    setTimeout(() => loadLeaderboard(), 2000)
  })
})

onUnmounted(() => {
  reactiveSub?.unsubscribe?.()
})
</script>
