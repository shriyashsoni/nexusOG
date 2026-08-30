"use client";

import { useState, useEffect } from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http } from "wagmi";
import { defineChain } from "viem";

// 0G Testnet (Galileo)
export const og_testnet = defineChain({
  id: 16602,
  name: "0G Galileo Testnet",
  nativeCurrency: { name: "A0GI", symbol: "A0GI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc-testnet.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: "https://chainscan-galileo.0g.ai" },
  },
  testnet: true,
});

// 0G Mainnet (Aristotle)
export const og_mainnet = defineChain({
  id: 16600,
  name: "0G Aristotle Mainnet",
  nativeCurrency: { name: "OG", symbol: "OG", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://evmrpc.0g.ai"] },
  },
  blockExplorers: {
    default: { name: "0G Explorer", url: "https://chainscan.0g.ai" },
  },
});

const config = createConfig({
  chains: [og_testnet, og_mainnet],
  transports: {
    [og_testnet.id]: http("https://evmrpc-testnet.0g.ai"),
    [og_mainnet.id]: http("https://evmrpc.0g.ai"),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <PrivyProvider
      appId="cmte0djp303lf0cjonik6pdnx"
      config={{
        defaultChain: og_testnet,
        supportedChains: [og_testnet, og_mainnet],
        appearance: {
          theme: 'light',
          accentColor: '#191919',
          logo: 'https://auth.privy.io/logos/privy-logo.png', // Optional default logo
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          {mounted && children}
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
