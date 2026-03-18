import { encodePacked, keccak256, type Hash } from 'viem'
import { useViemClients } from './useViemClients'

export enum GameChoice { None = 0, Rock = 1, Paper = 2, Scissors = 3 }
export enum GamePhase { Open = 0, Commit = 1, Reveal = 2, Finished = 3 }

export const RPS_ABI = [
  { name: 'createRoom', type: 'function', inputs: [], outputs: [], stateMutability: 'payable' },
  { name: 'joinRoom', type: 'function', inputs: [{ name: 'gameId', type: 'uint256' }], outputs: [], stateMutability: 'payable' },
  { name: 'commitChoices', type: 'function', inputs: [{ name: 'gameId', type: 'uint256' }, { name: 'commitHash', type: 'bytes32' }], outputs: [], stateMutability: 'nonpayable' },
  { name: 'revealChoices', type: 'function', inputs: [{ name: 'gameId', type: 'uint256' }, { name: 'choices', type: 'uint8[3]' }, { name: 'salts', type: 'bytes32[3]' }], outputs: [], stateMutability: 'nonpayable' },
  { name: 'claimTimeout', type: 'function', inputs: [{ name: 'gameId', type: 'uint256' }], outputs: [], stateMutability: 'nonpayable' },
  { name: 'playBotBestOf3', type: 'function', inputs: [{ name: 'choices', type: 'uint8[3]' }], outputs: [], stateMutability: 'nonpayable' },
  {
    name: 'getGame', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'gameId', type: 'uint256' }],
    outputs: [{
      name: '', type: 'tuple', components: [
        { name: 'player1', type: 'address' }, { name: 'player2', type: 'address' },
        { name: 'commit1', type: 'bytes32' }, { name: 'commit2', type: 'bytes32' },
        { name: 'choices1', type: 'uint8[3]' }, { name: 'choices2', type: 'uint8[3]' },
        { name: 'roundResults', type: 'uint8[3]' },
        { name: 'p1Wins', type: 'uint8' }, { name: 'p2Wins', type: 'uint8' },
        { name: 'winner', type: 'address' }, { name: 'phase', type: 'uint8' },
        { name: 'stake', type: 'uint256' }, { name: 'deadline', type: 'uint256' },
        { name: 'isBot', type: 'bool' },
      ],
    }],
  },
  { name: 'gameCount', type: 'function', inputs: [], outputs: [{ name: '', type: 'uint256' }], stateMutability: 'view' },
] as const

export interface Game {
  player1: string; player2: string
  commit1: string; commit2: string
  choices1: [number, number, number]; choices2: [number, number, number]
  roundResults: [number, number, number]
  p1Wins: number; p2Wins: number
  winner: string; phase: GamePhase
  stake: bigint; deadline: bigint; isBot: boolean
}

export const useRPS = () => {
  const config = useRuntimeConfig()
  const { publicClient, chain, getWalletClient } = useViemClients()
  const contractAddress = config.public.contractAddress as `0x${string}`

  const generateSalt = (): string => {
    return '0x' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0')).join('')
  }
  const generate3Salts = (): [string, string, string] => [generateSalt(), generateSalt(), generateSalt()]

  const computeCommitHash3 = (choices: [number, number, number], salts: [string, string, string]): string => {
    return keccak256(encodePacked(
      ['uint8', 'uint8', 'uint8', 'bytes32', 'bytes32', 'bytes32'],
      [choices[0], choices[1], choices[2], salts[0] as `0x${string}`, salts[1] as `0x${string}`, salts[2] as `0x${string}`]
    ))
  }

  const write = async (fn: string, args: any[], address: string, value?: bigint, gas = 500000n) => {
    const wc = await getWalletClient(address)
    return wc.writeContract({
      chain, address: contractAddress, abi: RPS_ABI,
      functionName: fn, args, value,
      account: address as `0x${string}`, gas,
    })
  }

  // PvP
  const createRoom = (stake: bigint, address: string) => write('createRoom', [], address, stake)
  const joinRoom = (gameId: bigint, stake: bigint, address: string) => write('joinRoom', [gameId], address, stake)

  const commitChoices = async (gameId: bigint, choices: [number, number, number], address: string) => {
    const salts = generate3Salts()
    const hash = computeCommitHash3(choices, salts)
    const txHash = await write('commitChoices', [gameId, hash as `0x${string}`], address)
    return { txHash, salts }
  }

  const revealChoices = (gameId: bigint, choices: [number, number, number], salts: [string, string, string], address: string) =>
    write('revealChoices', [gameId, choices, salts.map(s => s as `0x${string}`)], address, undefined, 2000000n)

  const claimTimeout = (gameId: bigint, address: string) => write('claimTimeout', [gameId], address)

  // Bot
  const playBotBestOf3 = (choices: [GameChoice, GameChoice, GameChoice], address: string) =>
    write('playBotBestOf3', [choices], address, undefined, 5000000n)

  // Read
  const getGame = async (gameId: bigint): Promise<Game> => {
    const r = await publicClient.readContract({
      address: contractAddress, abi: RPS_ABI, functionName: 'getGame', args: [gameId],
    }) as any
    return {
      player1: r.player1, player2: r.player2,
      commit1: r.commit1, commit2: r.commit2,
      choices1: r.choices1 as [number, number, number],
      choices2: r.choices2 as [number, number, number],
      roundResults: r.roundResults as [number, number, number],
      p1Wins: Number(r.p1Wins), p2Wins: Number(r.p2Wins),
      winner: r.winner, phase: r.phase,
      stake: r.stake, deadline: r.deadline, isBot: r.isBot,
    }
  }

  const getGameCount = () => publicClient.readContract({
    address: contractAddress, abi: RPS_ABI, functionName: 'gameCount',
  }) as Promise<bigint>

  return {
    contractAddress, createRoom, joinRoom, commitChoices, revealChoices,
    claimTimeout, playBotBestOf3, getGame, getGameCount,
    generateSalt, generate3Salts, computeCommitHash3,
  }
}
