import { http, createConfig } from '@wagmi/core'
import { baseSepolia } from '@wagmi/core/chains'

const { provider, webSocketProvider } = configureChains([sepolia], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
})
