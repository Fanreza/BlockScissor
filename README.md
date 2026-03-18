# Reactive Rock-Paper-Scissors (⚡RPS)

A multiplayer Rock-Paper-Scissors game built on Somnia Network with real-time on-chain reactivity.

## Features

- 🎮 **Multiplayer Gameplay**: Play Rock-Paper-Scissors with real stakes
- ⚡ **Real-Time Reactivity**: Instant game state updates via Somnia Reactivity SDK
- 💰 **Staking System**: Players wager STT tokens with winner-takes-all payouts
- 🔐 **Commit-Reveal Scheme**: Fair gameplay using cryptographic commitment hashing
- 🪙 **On-Chain**: Fully decentralized, contracts deployed on Somnia Testnet
- 📊 **Leaderboard**: Track player stats and game history

## Tech Stack

- **Frontend**: Nuxt 4 (Vue 3) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn-vue
- **Web3**: Viem + Privy (Wallet Integration) + @somnia-chain/reactivity
- **Smart Contracts**: Solidity 0.8.20
- **Deployment**: Hardhat

## Prerequisites

- Node.js 18+ and pnpm
- MetaMask or compatible web3 wallet
- Somnia Testnet configured in your wallet
- STT testnet tokens (get from [faucet](https://testnet.somnia.network/))

## Setup

### 1. Clone and Install

```bash
cd reactive-rps
pnpm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in:
- `NUXT_PUBLIC_PRIVY_APP_ID` (get from [privy.io](https://privy.io))
- `NUXT_PUBLIC_CONTRACT_ADDRESS` (after deployment)
- `PRIVATE_KEY` (for contract deployment)

### 3. Deploy Smart Contract

```bash
pnpm run hardhat deploy --network somniaTestnet
```

Copy the deployed contract address to `.env.local`.

### 4. Start Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Play

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Create Game** - Choose your stake amount and create a new game
3. **Join Game** - Find an open game and join with the same stake
4. **Commit** - Secretly commit your choice (Rock/Paper/Scissors) with a random salt
5. **Reveal** - Reveal your choice after opponent has committed
6. **Win** - Winner receives 2x the total stake

## Game Mechanics

### Commit-Reveal Scheme

- Players first commit a hash: `keccak256(choice || salt)`
- After both commitments, players reveal their choice and salt
- Contract verifies the hash matches the commitment
- Prevents players from changing their choice based on opponent's move

### Payouts

- **Win**: Receive 2x your stake (your stake + opponent's stake)
- **Draw**: Both players get their stake back
- **Timeout**: Non-acting player wins the full pot

### Timeout Management

- Commit phase: 5 minutes
- Reveal phase: 5 minutes
- Either player can claim timeout and win if opponent doesn't act

## Contract Events (Reactive)

The frontend subscribes to real-time contract events via Somnia Reactivity:

- `GameCreated` - New game started
- `PlayerJoined` - Opponent joined your game
- `PlayerCommitted` - Player committed their choice
- `PlayerRevealed` - Player revealed their choice
- `GameEnded` - Game finished with winner
- `GameDraw` - Game ended in a draw

## Deployment

### On Somnia Testnet

```bash
# Set your private key
export PRIVATE_KEY="your_private_key_here"

# Deploy contract
pnpm run hardhat deploy --network somniaTestnet

# Verify on explorer
pnpm run hardhat verify --network somniaTestnet CONTRACT_ADDRESS
```

### Contract Address

After deployment, save the contract address and update `.env.local`:
```
NUXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

## Project Structure

```
reactive-rps/
├── app/                    # Nuxt app source
│   ├── components/         # Vue components
│   │   ├── ui/            # shadcn-vue components
│   │   ├── game/          # Game-specific components
│   │   └── layout/        # Layout components
│   ├── composables/       # Vue composables
│   ├── pages/             # Nuxt pages
│   ├── plugins/           # Nuxt plugins
│   └── assets/            # Static assets
├── contracts/             # Solidity contracts
├── scripts/               # Hardhat scripts
├── hardhat.config.ts      # Hardhat config
└── nuxt.config.ts         # Nuxt config
```

## Composables

- **usePrivy**: Wallet connection via Privy (with MetaMask fallback)
- **useViemClients**: Viem public/wallet clients management
- **useRPS**: Contract interaction functions
- **useReactivity**: Somnia Reactivity SDK integration

## Development

### Building

```bash
pnpm run build
```

### Type Checking

```bash
pnpm run typecheck
```

### Testing Locally

```bash
# Terminal 1: Start local Hardhat node
pnpm hardhat node

# Terminal 2: Deploy to local network
pnpm hardhat deploy --network localhost

# Terminal 3: Start dev server
pnpm run dev
```

## Known Limitations

- Privy support uses vanilla JS SDK (no official Vue adapter)
- MetaMask fallback for wallet connection
- Single game contract (no factory pattern yet)
- Leaderboard stats are mock data (TODO: implement from events)

## Future Enhancements

- [ ] Real leaderboard from on-chain events
- [ ] Game history and analytics
- [ ] Replay system
- [ ] Seasonal rankings
- [ ] Custom token support
- [ ] Multiplayer lobbies
- [ ] ELO rating system
- [ ] NFT rewards

## Security

⚠️ **Audit Notice**: This contract has NOT been audited. Do not use with real funds.

### Commit-Reveal Safeguards

- Hash verification prevents choice tampering
- Timeout mechanism prevents indefinite hanging
- Secure random salt generation
- Proper fund handling with low-level calls

## Support

- **Docs**: [Somnia Docs](https://docs.somnia.network/)
- **Reactivity**: [Somnia Reactivity Guide](https://docs.somnia.network/developer/reactivity)
- **Discord**: [Somnia Discord](https://discord.gg/somnia)
- **Telegram**: [Somnia Telegram](https://t.me/+XHq0F0JXMyhmMzM0)

## License

MIT
