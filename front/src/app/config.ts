import { http } from 'wagmi';
import { baseSepolia } from 'viem/chains';
import { createConfig } from '@privy-io/wagmi';

export const config = createConfig({
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

//useBlockNumber({ chainId: 11155111 });

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}