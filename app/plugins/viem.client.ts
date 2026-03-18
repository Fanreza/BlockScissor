import { createPublicClient, http, defineChain } from 'viem'

const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Somnia',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network/'],
    },
    public: {
      http: ['https://dream-rpc.somnia.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://shannon-explorer.somnia.network/',
    },
  },
})

export default defineNuxtPlugin(() => {
  const publicClient = createPublicClient({
    chain: somniaTestnet,
    transport: http('https://dream-rpc.somnia.network/'),
  })

  return {
    provide: {
      publicClient,
      somniaTestnet,
    },
  }
})
