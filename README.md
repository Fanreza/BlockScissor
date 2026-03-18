# BlockScissor

On-chain Rock-Paper-Scissors on Somnia Network with real-time reactive updates.

Play best-of-3 against an on-chain bot or stake STT in PvP matches using commit-reveal.

**Live**: [blockscissor.vercel.app](https://blockscissor.vercel.app) (Somnia Testnet)

## How It Works

### Bot Mode (Best of 3)
1. Pick your 3 choices (Rock/Paper/Scissors) round by round
2. All 3 choices are submitted in a single transaction
3. Bot choices are generated on-chain via pseudo-random (`keccak256(blockhash, timestamp, gameId, sender, round)`)
4. Results are resolved immediately — no waiting

### PvP Mode (Commit-Reveal)
1. Player 1 creates a match with a STT stake
2. Player 2 joins with the same stake
3. Both players commit `keccak256(choice, salt)` — hiding their move
4. Both players reveal their choice + salt — contract verifies the hash
5. Winner takes the full pot (2x stake). Draw returns stakes. 5-minute timeout per phase.

### Reactivity
The leaderboard and game pages update in real-time using the [Somnia Reactivity SDK](https://docs.somnia.network/developer/reactivity) (`@somnia-chain/reactivity`). The SDK subscribes to contract events via `somnia_watch` WebSocket — no polling.

Events tracked: `GameCreated`, `BotGame3Ended`, `GameEnded`, `GameDraw`, `PlayerJoined`, `PlayerCommitted`, `PlayerRevealed`

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Nuxt 4, Vue 3, TypeScript |
| Styling | Tailwind CSS v4 |
| Wallet | Privy SDK (MetaMask fallback) |
| Chain | Viem, `@somnia-chain/reactivity` |
| Contract | Solidity 0.8.20, Hardhat |
| Network | Somnia Testnet (Chain ID: 50312) |

## Setup

### Prerequisites
- Node.js 18+, pnpm
- MetaMask with [Somnia Testnet](https://docs.somnia.network/developer/network-info) configured
- STT tokens from the [faucet](https://testnet.somnia.network/)

### Install & Configure

```bash
pnpm install
cp .env.example .env.local
```

Fill `.env.local`:
```
NUXT_PUBLIC_PRIVY_APP_ID=       # from privy.io
NUXT_PUBLIC_CONTRACT_ADDRESS=   # after deploying
PRIVATE_KEY=                    # for deployment only
```

### Deploy Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.cjs --network somniaTestnet
```

Copy the printed contract address to `.env.local`.

### Run

```bash
pnpm dev
```

## Contract

**File**: `contracts/RPSGame.sol`

Single contract handling both PvP and bot games. No factory pattern — all games stored in one mapping.

Key functions:
- `createGame()` — Create PvP match (payable, sets stake)
- `joinGame(gameId)` — Join open PvP match (must match stake)
- `commit(gameId, hash)` / `reveal(gameId, choice, salt)` — Commit-reveal flow
- `claimTimeout(gameId)` — Claim win if opponent times out (5 min)
- `playBotBestOf3(uint8[3] choices)` — Single-tx bot game, 3 rounds
- `getGame(gameId)` / `getBotGame3(gameId)` — Read game state

## Project Structure

```
app/
  composables/
    useRPS.ts          # Contract read/write functions
    useReactivity.ts   # Somnia Reactivity SDK subscriptions
    useViemClients.ts  # Viem public + wallet client setup
    usePrivy.ts        # Wallet auth via Privy
  pages/
    index.vue          # Homepage + PvP lobby
    game/bot.vue       # Bot best-of-3 game flow
    game/[id].vue      # PvP game room
    leaderboard.vue    # Stats + recent games
  components/game/     # ChoiceSelector, BattleArena, Overlay, etc.
contracts/
  RPSGame.sol          # Main contract
```

## Security

This contract is **not audited**. Do not use with real funds.

- Commit-reveal prevents move snooping in PvP
- Timeout prevents indefinite game locks
- Bot randomness is pseudo-random (blockhash-based) — not suitable for high-stakes

## License

MIT
