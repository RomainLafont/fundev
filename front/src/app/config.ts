import { createConfig, http } from 'wagmi';
import { baseSepolia, sepolia } from 'wagmi/chains';

export const config = createConfig({
  chains: [baseSepolia, sepolia],
  transports: {
    [baseSepolia.id]: http(),
    [sepolia.id]: http(),
  },
});

//useBlockNumber({ chainId: 11155111 });

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}