// Somnia Reactivity - Real-time event subscriptions via @somnia-chain/reactivity SDK
// Uses Somnia's native "somnia_watch" RPC for instant reactive push notifications

import { SDK, type SubscriptionCallback } from '@somnia-chain/reactivity'
import { createPublicClient, webSocket, defineChain, decodeEventLog, keccak256, toBytes, type Hex } from 'viem'

const isConnected = ref(false)
const lastEvent = ref<string | null>(null)
const error = ref<string | null>(null)

const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: { decimals: 18, name: 'Somnia', symbol: 'STT' },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network/'],
      webSocket: ['wss://dream-rpc.somnia.network/ws'],
    },
  },
})

// Events ABI for decoding raw reactive callbacks
const EVENTS_ABI = [
  { type: 'event', name: 'GameCreated', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'player1', type: 'address', indexed: true }, { name: 'stake', type: 'uint256', indexed: false }] },
  { type: 'event', name: 'BotGame3Ended', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'player', type: 'address', indexed: true }, { name: 'playerWins', type: 'uint8', indexed: false }, { name: 'botWins', type: 'uint8', indexed: false }] },
  { type: 'event', name: 'GameEnded', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'winner', type: 'address', indexed: true }, { name: 'choice1', type: 'uint8', indexed: false }, { name: 'choice2', type: 'uint8', indexed: false }] },
  { type: 'event', name: 'GameDraw', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'choice', type: 'uint8', indexed: false }] },
  { type: 'event', name: 'PlayerJoined', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'player2', type: 'address', indexed: true }] },
  { type: 'event', name: 'PlayerCommitted', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'player', type: 'address', indexed: true }, { name: 'playerNum', type: 'uint8', indexed: false }] },
  { type: 'event', name: 'PlayerRevealed', inputs: [{ name: 'gameId', type: 'uint256', indexed: true }, { name: 'player', type: 'address', indexed: true }, { name: 'choice', type: 'uint8', indexed: false }] },
] as const

// Reverse lookup: topic0 hash → event name
const TOPIC_TO_EVENT: Record<string, string> = {}
for (const evt of EVENTS_ABI) {
  const sig = `${evt.name}(${evt.inputs.map(i => i.type).join(',')})`
  TOPIC_TO_EVENT[keccak256(toBytes(sig))] = evt.name
}

let sdk: SDK | null = null

const getSDK = () => {
  if (!sdk) {
    const wsClient = createPublicClient({
      chain: somniaTestnet,
      transport: webSocket('wss://dream-rpc.somnia.network/ws'),
    })
    sdk = new SDK({ public: wsClient })
    console.log('[Reactivity] Somnia SDK initialized (somnia_watch)')
  }
  return sdk
}

// Decode raw SubscriptionCallback into { eventName, args }
const decodeReactiveEvent = (data: SubscriptionCallback) => {
  try {
    const { topics, data: eventData } = data.result
    if (!topics || topics.length === 0) return null

    const eventName = TOPIC_TO_EVENT[topics[0]]
    if (!eventName) return null

    const decoded = decodeEventLog({
      abi: EVENTS_ABI,
      topics: topics as [Hex, ...Hex[]],
      data: eventData,
    })

    return { eventName, args: decoded.args }
  } catch {
    return null
  }
}

export const useReactivity = () => {
  const config = useRuntimeConfig()
  const contractAddress = config.public.contractAddress as `0x${string}`

  // Subscribe to a specific game's events (PvP real-time)
  const subscribeToGame = async (
    gameId: bigint,
    onUpdate: (eventName: string, args?: any) => void
  ) => {
    if (!contractAddress) return null

    try {
      const reactiveSdk = getSDK()

      // Subscribe to ALL events from our contract (wildcard topics)
      // Filter by gameId in callback
      const subscription = await reactiveSdk.subscribe({
        ethCalls: [],
        eventContractSources: [contractAddress],
        // No topicOverrides = wildcard = ALL events from this contract
        onData: (data: SubscriptionCallback) => {
          const decoded = decodeReactiveEvent(data)
          if (!decoded) return

          // Only forward events for this specific game
          if (decoded.args && (decoded.args as any).gameId === gameId) {
            console.log(`[Reactivity] Game #${gameId}: ${decoded.eventName}`, decoded.args)
            isConnected.value = true
            lastEvent.value = new Date().toISOString()
            onUpdate(decoded.eventName, decoded.args)
          }
        },
        onError: (err: Error) => {
          console.error('[Reactivity] Game subscription error:', err)
          error.value = err.message
        },
      })

      if (subscription instanceof Error) {
        console.error('[Reactivity] Game subscribe failed:', subscription.message)
        return null
      }

      isConnected.value = true
      console.log(`[Reactivity] Game #${gameId} reactive subscription active`)

      return {
        unsubscribe: () => subscription.unsubscribe(),
      }
    } catch (err) {
      console.error('[Reactivity] Game subscribe error:', err)
      return null
    }
  }

  // Subscribe to all game events (homepage + leaderboard)
  const subscribeToAllGames = async (
    onUpdate: (eventName: string, args?: any) => void
  ) => {
    if (!contractAddress) return null

    try {
      const reactiveSdk = getSDK()

      // Wildcard: ALL events from our contract
      const subscription = await reactiveSdk.subscribe({
        ethCalls: [],
        eventContractSources: [contractAddress],
        // No topicOverrides = watch ALL events
        onData: (data: SubscriptionCallback) => {
          const decoded = decodeReactiveEvent(data)
          if (decoded) {
            console.log(`[Reactivity] ${decoded.eventName}`, decoded.args)
            isConnected.value = true
            lastEvent.value = new Date().toISOString()
            onUpdate(decoded.eventName, decoded.args)
          } else {
            // Raw event we can't decode — still trigger refresh
            console.log('[Reactivity] Raw event received')
            onUpdate('unknown')
          }
        },
        onError: (err: Error) => {
          console.error('[Reactivity] Subscription error:', err)
          error.value = err.message
        },
      })

      if (subscription instanceof Error) {
        console.error('[Reactivity] Subscribe failed:', subscription.message)
        return null
      }

      isConnected.value = true
      console.log('[Reactivity] All games reactive subscription active via Somnia SDK')

      return {
        unsubscribe: () => subscription.unsubscribe(),
      }
    } catch (err) {
      console.error('[Reactivity] Subscribe error:', err)
      return null
    }
  }

  return {
    isConnected: readonly(isConnected),
    lastEvent: readonly(lastEvent),
    error: readonly(error),
    subscribeToGame,
    subscribeToAllGames,
  }
}
