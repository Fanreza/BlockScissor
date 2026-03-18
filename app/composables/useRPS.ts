import {
  encodeFunctionData,
  encodeAbiParameters,
  keccak256,
  parseEther,
  type Hash,
} from 'viem'
import { useViemClients } from './useViemClients'

export enum GameChoice {
  None = 0,
  Rock = 1,
  Paper = 2,
  Scissors = 3,
}

export enum GamePhase {
  Open = 0,
  Commit = 1,
  Reveal = 2,
  Finished = 3,
}

export const RPS_ABI = [
  {
    name: 'createGame',
    type: 'function',
    inputs: [],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'joinGame',
    type: 'function',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    name: 'commit',
    type: 'function',
    inputs: [
      { name: 'gameId', type: 'uint256' },
      { name: 'hash', type: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'reveal',
    type: 'function',
    inputs: [
      { name: 'gameId', type: 'uint256' },
      { name: 'choice', type: 'uint8' },
      { name: 'salt', type: 'bytes32' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'claimTimeout',
    type: 'function',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'playBot',
    type: 'function',
    inputs: [{ name: 'choice', type: 'uint8' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'playBotBestOf3',
    type: 'function',
    inputs: [{ name: 'choices', type: 'uint8[3]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    name: 'getBotGame3',
    type: 'function',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'player', type: 'address' },
          { name: 'playerChoices', type: 'uint8[3]' },
          { name: 'botChoices', type: 'uint8[3]' },
          { name: 'roundResults', type: 'uint8[3]' },
          { name: 'playerWins', type: 'uint8' },
          { name: 'botWins', type: 'uint8' },
          { name: 'winner', type: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'getGame',
    type: 'function',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'player1', type: 'address' },
          { name: 'player2', type: 'address' },
          { name: 'commit1', type: 'bytes32' },
          { name: 'commit2', type: 'bytes32' },
          { name: 'reveal1', type: 'uint8' },
          { name: 'reveal2', type: 'uint8' },
          { name: 'winner', type: 'address' },
          { name: 'phase', type: 'uint8' },
          { name: 'stake', type: 'uint256' },
          { name: 'deadline', type: 'uint256' },
          { name: 'isBot', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    name: 'gameCount',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

export interface Game {
  player1: string
  player2: string
  commit1: string
  commit2: string
  reveal1: GameChoice
  reveal2: GameChoice
  winner: string
  phase: GamePhase
  stake: bigint
  deadline: bigint
  isBot: boolean
}

export const useRPS = () => {
  const config = useRuntimeConfig()
  const { publicClient, chain, getWalletClient } = useViemClients()
  const contractAddress = config.public.contractAddress as `0x${string}`

  if (typeof window !== 'undefined' && !contractAddress) {
    console.warn('Contract address not configured')
  }

  const generateSalt = (): string => {
    if (typeof window === 'undefined') {
      throw new Error('generateSalt can only be called on client')
    }
    return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  const computeCommitHash = (choice: GameChoice, salt: string): string => {
    return keccak256(
      encodeAbiParameters(
        [{ type: 'uint8' }, { type: 'bytes32' }],
        [choice, salt as any]
      )
    )
  }

  // PvP: Create game with stake
  const createGame = async (stake: bigint, address: string): Promise<Hash> => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'createGame',
      value: stake,
      account: address as `0x${string}`,
      gas: 500000n,
    })
  }

  // PvP: Join game
  const joinGame = async (gameId: bigint, stake: bigint, address: string): Promise<Hash> => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'joinGame',
      args: [gameId],
      value: stake,
      account: address as `0x${string}`,
      gas: 500000n,
    })
  }

  // PvP: Commit choice
  const commit = async (
    gameId: bigint,
    choice: GameChoice,
    salt: string,
    address: string
  ): Promise<Hash> => {
    const hash = computeCommitHash(choice, salt)
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'commit',
      args: [gameId, hash as `0x${string}`],
      account: address as `0x${string}`,
      gas: 500000n,
    })
  }

  // PvP: Reveal choice
  const reveal = async (
    gameId: bigint,
    choice: GameChoice,
    salt: string,
    address: string
  ): Promise<Hash> => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'reveal',
      args: [gameId, choice, salt as `0x${string}`],
      account: address as `0x${string}`,
      gas: 1000000n,
    })
  }

  // Bot: Play against bot in single tx
  const playBot = async (choice: GameChoice, address: string): Promise<Hash> => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'playBot',
      args: [choice],
      account: address as `0x${string}`,
      gas: 3000000n,
    })
  }

  // Bot: Play best of 3 in single tx
  const playBotBestOf3 = async (
    choices: [GameChoice, GameChoice, GameChoice],
    address: string
  ): Promise<Hash> => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'playBotBestOf3',
      args: [choices],
      account: address as `0x${string}`,
      gas: 5000000n,
    })
  }

  // Get bot game 3 result
  const getBotGame3 = async (gameId: bigint) => {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'getBotGame3',
      args: [gameId],
    }) as any

    return {
      player: result.player,
      playerChoices: result.playerChoices as [number, number, number],
      botChoices: result.botChoices as [number, number, number],
      roundResults: result.roundResults as [number, number, number],
      playerWins: result.playerWins as number,
      botWins: result.botWins as number,
      winner: result.winner as string,
    }
  }

  // Claim timeout
  const claimTimeout = async (gameId: bigint, address: string): Promise<Hash> => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain,
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'claimTimeout',
      args: [gameId],
      account: address as `0x${string}`,
      gas: 500000n,
    })
  }

  // Get game state
  const getGame = async (gameId: bigint): Promise<Game> => {
    const result = await publicClient.readContract({
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'getGame',
      args: [gameId],
    }) as any

    return {
      player1: result.player1,
      player2: result.player2,
      commit1: result.commit1,
      commit2: result.commit2,
      reveal1: result.reveal1,
      reveal2: result.reveal2,
      winner: result.winner,
      phase: result.phase,
      stake: result.stake,
      deadline: result.deadline,
      isBot: result.isBot,
    }
  }

  // Get total game count
  const getGameCount = async (): Promise<bigint> => {
    return publicClient.readContract({
      address: contractAddress,
      abi: RPS_ABI,
      functionName: 'gameCount',
    }) as Promise<bigint>
  }

  return {
    contractAddress,
    createGame,
    joinGame,
    commit,
    reveal,
    claimTimeout,
    playBot,
    playBotBestOf3,
    getBotGame3,
    getGame,
    getGameCount,
    generateSalt,
    computeCommitHash,
  }
}
