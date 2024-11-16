import { http } from 'wagmi';
import { foundry } from 'wagmi/chains';
import { createConfig } from '@privy-io/wagmi';

export const config = createConfig({
  chains: [foundry],
  transports: {
    [foundry.id]: http(),
  },
});

//useBlockNumber({ chainId: 11155111 });

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}