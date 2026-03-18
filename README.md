# BlockScissor

On-chain Rock-Paper-Scissors game built on **Somnia Testnet** with real-time reactive updates powered by the **Somnia Reactivity SDK**.

**Live Demo**: [blockscissor.vercel.app](https://blockscissor.vercel.app)

**Demo Video**: [Watch on YouTube](#) <!-- TODO: Add video link -->

## How Somnia Reactivity Is Used

BlockScissor uses the [`@somnia-chain/reactivity`](https://docs.somnia.network/developer/reactivity) SDK to deliver real-time game state updates without polling.

### What Reactivity Enables

- **Live Leaderboard**: When any player completes a game, the leaderboard page updates instantly for all viewers. No refresh needed.
- **PvP Room State Sync**: When Player 2 joins a room, Player 1 sees the update in real-time. When either player commits their choices, the opponent is notified immediately.
- **Auto-Reveal Trigger**: Once both players have committed (detected via reactive event), the reveal transaction is automatically triggered without manual intervention.
- **Event-Driven Architecture**: All game events (`GameCreated`, `PlayerJoined`, `PlayerCommitted`, `PlayerRevealed`, `GameEnded`, `GameDraw`, `BotGame3Ended`) are subscribed to via the SDK's `somnia_watch` WebSocket method.

### Implementation

```typescript
// Initialize SDK with WebSocket transport (required for subscriptions)
import { SDK } from '@somnia-chain/reactivity'

const wsClient = createPublicClient({
  chain: somniaTestnet,
  transport: webSocket('wss://dream-rpc.somnia.network/ws'),
})

const sdk = new SDK({ public: wsClient })

// Subscribe to all contract events — no polling
const subscription = await sdk.subscribe({
  eventContractSources: [contractAddress],
  ethCalls: [],
  onData: (data) => {
    // Decode event, update UI reactively
    const eventSignature = data.params.result.topics[0]
    // ... handle event
  },
})
```

Key files:
- [`app/composables/useReactivity.ts`](app/composables/useReactivity.ts) — SDK initialization, event subscription, event decoding
- [`app/pages/leaderboard.vue`](app/pages/leaderboard.vue) — Live leaderboard with reactive updates
- [`app/pages/game/[id].vue`](app/pages/game/%5Bid%5D.vue) — PvP room with real-time state sync

## Game Modes

### Bot Mode (Best of 3)
1. Pick Rock/Paper/Scissors for each of 3 rounds
2. All choices submitted in a **single transaction**
3. Bot choices generated on-chain via `keccak256(blockhash, timestamp, gameId, sender, round)`
4. Results resolved immediately on-chain

### PvP Mode (Best of 3, Commit-Reveal)
1. Player 1 creates a room with an STT stake
2. Player 2 joins via shared link (matches stake)
3. Both players pick 3 choices → commit hashes in 1 transaction
4. Auto-reveal after both commit → contract resolves all 3 rounds
5. Winner takes 2x stake. Draw returns stakes. 5-minute timeout per phase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Nuxt 4, Vue 3, TypeScript |
| Styling | Tailwind CSS v4 |
| Wallet | Privy JS SDK, MetaMask |
| Blockchain | Viem, Somnia Reactivity SDK |
| Smart Contract | Solidity 0.8.20, Hardhat |
| Network | Somnia Testnet (Chain ID 50312) |
| Deployment | Vercel |

## Setup

### Prerequisites
- Node.js 18+
- MetaMask with [Somnia Testnet](https://docs.somnia.network/developer/network-info) added
- STT tokens from the [faucet](https://testnet.somnia.network/)

### Install

```bash
npm install --legacy-peer-deps
cp .env.example .env
```

Configure `.env`:
```
NUXT_PUBLIC_RPC_URL=https://dream-rpc.somnia.network/
NUXT_PUBLIC_CHAIN_ID=50312
NUXT_PUBLIC_PRIVY_APP_ID=<your privy app id>
NUXT_PUBLIC_CONTRACT_ADDRESS=<deployed contract address>
PRIVATE_KEY=<deployer wallet private key>
```

### Deploy Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.cjs --network somniaTestnet
```

Copy the output address to `NUXT_PUBLIC_CONTRACT_ADDRESS` in `.env`.

### Run

```bash
npm run dev
```

## Smart Contract

**File**: [`contracts/RPSGame.sol`](contracts/RPSGame.sol)

Single contract handling both PvP and bot games. All games stored in one mapping.

| Function | Description |
|----------|-------------|
| `createRoom()` | Create PvP room (payable, sets stake) |
| `joinRoom(gameId)` | Join open PvP room (must match stake) |
| `commitChoices(gameId, hash)` | Submit hashed choices for 3 rounds |
| `revealChoices(gameId, choices, salts)` | Reveal choices, auto-resolve if both revealed |
| `claimTimeout(gameId)` | Claim win if opponent times out (5 min) |
| `playBotBestOf3(choices[3])` | Single-tx bot game, 3 rounds |

## Project Structure

```
app/
  composables/
    useReactivity.ts   # Somnia Reactivity SDK integration
    useRPS.ts          # Contract read/write functions
    useViemClients.ts  # Viem public + wallet client
    usePrivy.ts        # Wallet authentication
    useConfetti.ts     # Win/draw celebrations
  pages/
    index.vue          # Homepage, game modes, PvP lobby
    game/bot.vue       # Bot best-of-3 game
    game/[id].vue      # PvP game room
    leaderboard.vue    # Live stats + recent games
  components/game/
    ChoiceSelector.vue # Card-style weapon picker
    ChoiceCard.vue     # SVG weapon card (Rock/Paper/Scissors)
    RoundIndicator.vue # Best-of-3 round tracker
    Overlay.vue        # Game result overlay with confetti
contracts/
  RPSGame.sol          # Main smart contract
scripts/
  deploy.cjs           # Deployment script
```

## License

MIT
