import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  ssr: false,
  devtools: {
    enabled: true,
  },
  app: {
    head: {
      title: 'BlockScissor — On-Chain Rock Paper Scissors',
      meta: [
        { name: 'description', content: 'Play Rock Paper Scissors on Somnia Network with real-time blockchain reactivity' },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/logo.png',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@700;800;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800&family=Space+Mono:wght@400;700&display=swap',
        },
      ],
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
      nodePolyfills({
        include: ['buffer', 'process', 'util'],
        globals: { Buffer: true, global: true, process: true },
      }),
    ],
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      privyAppId: '',
      contractAddress: '',
      rpcUrl: 'https://dream-rpc.somnia.network/',
      chainId: 50312,
    },
  },
})
