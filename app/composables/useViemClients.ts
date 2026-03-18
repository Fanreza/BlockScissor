import {
  createWalletClient,
  custom,
  type PublicClient,
  type WalletClient,
} from 'viem'

export const useViemClients = () => {
  const { $publicClient, $somniaTestnet } = useNuxtApp()
  const privy = usePrivy()
  const walletClient = ref<WalletClient | null>(null)
  const currentAddress = ref<string | null>(null)

  // Initialize wallet client from provider
  const initWalletClient = async (address: string) => {
    try {
      const provider = await privy.getProvider()

      walletClient.value = createWalletClient({
        account: address as `0x${string}`,
        chain: $somniaTestnet,
        transport: custom(provider),
      })
      currentAddress.value = address
    } catch (error) {
      console.error('Failed to init wallet client:', error)
      throw error
    }
  }

  // Ensure wallet is on Somnia Testnet
  const ensureCorrectChain = async () => {
    try {
      const provider = await privy.getProvider()
      const chainId = await provider.request({ method: 'eth_chainId' })
      const currentChainId = parseInt(chainId as string, 16)

      if (currentChainId !== $somniaTestnet.id) {
        const addChainParams = [{
          chainId: `0x${$somniaTestnet.id.toString(16)}`,
          chainName: $somniaTestnet.name,
          nativeCurrency: $somniaTestnet.nativeCurrency,
          rpcUrls: [$somniaTestnet.rpcUrls.default.http[0]],
          blockExplorerUrls: [],
        }]

        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: addChainParams[0].chainId }],
          })
        } catch (switchError: any) {
          // Chain not recognized — add it first, then switch
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: addChainParams,
          })
        }
      }
    } catch (error) {
      console.error('Failed to switch chain:', error)
      throw error
    }
  }

  // Get or create wallet client
  const getWalletClient = async (address?: string): Promise<WalletClient> => {
    const addr = address || privy.user.value?.wallet?.address
    if (!addr) {
      throw new Error('No wallet address available')
    }

    // Auto-switch to Somnia Testnet if needed
    await ensureCorrectChain()

    if (!walletClient.value || currentAddress.value !== addr) {
      await initWalletClient(addr)
    }

    if (!walletClient.value) {
      throw new Error('Failed to initialize wallet client')
    }

    return walletClient.value
  }

  // Reset wallet client on logout (only on client)
  if (typeof window !== 'undefined') {
    watch(
      () => privy.isAuthenticated.value,
      (isAuth) => {
        if (!isAuth) {
          walletClient.value = null
          currentAddress.value = null
        }
      }
    )
  }

  return {
    publicClient: $publicClient as PublicClient,
    chain: $somniaTestnet,
    walletClient: readonly(walletClient),
    currentAddress: readonly(currentAddress),
    getWalletClient,
    initWalletClient,
  }
}
