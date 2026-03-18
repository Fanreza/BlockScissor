// Privy JS SDK Core composable for Nuxt
// Uses @privy-io/js-sdk-core with SIWE (Sign-In With Ethereum) flow

import Privy, { LocalStorage } from '@privy-io/js-sdk-core'

interface WalletUser {
  id: string
  wallet: {
    address: string
    chainId: number
  }
}

let privyInstance: InstanceType<typeof Privy> | null = null

const getPrivyClient = (appId: string) => {
  if (!privyInstance) {
    privyInstance = new Privy({
      appId,
      storage: new LocalStorage(),
    })
  }
  return privyInstance
}

export const usePrivy = () => {
  const config = useRuntimeConfig()
  const user = useState<WalletUser | null>('privy:user', () => null)
  const isAuthenticated = computed(() => !!user.value)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const connectWallet = async () => {
    if (typeof window === 'undefined') return null

    if (!window.ethereum) {
      error.value = 'MetaMask not found. Please install MetaMask.'
      return null
    }

    loading.value = true
    error.value = null

    try {
      // 1. Connect MetaMask and get address
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[]

      if (!accounts.length) {
        throw new Error('No accounts found')
      }

      const address = accounts[0]

      // 2. Switch to Somnia Testnet
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xC488' }],
        })
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xC488',
              chainName: 'Somnia Testnet',
              nativeCurrency: { name: 'Somnia', symbol: 'STT', decimals: 18 },
              rpcUrls: ['https://dream-rpc.somnia.network/'],
              blockExplorerUrls: ['https://shannon-explorer.somnia.network/'],
            }],
          })
        }
      }

      // 3. Initialize Privy and SIWE login
      const appId = config.public.privyAppId as string
      if (appId && appId !== 'your-privy-app-id-here') {
        try {
          const privy = getPrivyClient(appId)
          await privy.initialize()

          // Generate SIWE message
          const wallet = {
            address,
            chainId: 'eip155:50312',
            walletClientType: 'metamask' as const,
          }

          const { message } = await privy.auth.siwe.init(
            wallet,
            window.location.host,
            window.location.origin,
          )

          // Sign message with MetaMask
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [message, address],
          }) as string

          // Login with Privy
          const result = await privy.auth.siwe.loginWithSiwe(signature)

          user.value = {
            id: result.user.id,
            wallet: { address, chainId: 50312 },
          }
        } catch (privyError) {
          console.warn('Privy auth failed, using direct wallet connection:', privyError)
          // Fallback to direct wallet connection
          user.value = {
            id: `wallet_${address.slice(2, 10)}`,
            wallet: { address, chainId: 50312 },
          }
        }
      } else {
        // No Privy App ID configured, use direct wallet connection
        user.value = {
          id: `wallet_${address.slice(2, 10)}`,
          wallet: { address, chainId: 50312 },
        }
      }

      return address
    } catch (err: any) {
      error.value = err.message || 'Connection failed'
      console.error('Wallet connection error:', err)
    } finally {
      loading.value = false
    }

    return null
  }

  const logout = async () => {
    user.value = null
    privyInstance = null
  }

  const getProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum
    }
    throw new Error('No wallet provider available')
  }

  // Auto-reconnect if already connected
  onMounted(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      }) as string[]

      if (accounts.length > 0) {
        user.value = {
          id: `wallet_${accounts[0].slice(2, 10)}`,
          wallet: { address: accounts[0], chainId: 50312 },
        }
      }
    } catch {}
  })

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: connectWallet,
    logout,
    getProvider,
    connectWallet,
  }
}
