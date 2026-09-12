import { defineChain } from "viem";
import { publicEnv } from "@/lib/env";

/** Native gas token on Arc (and this Anvil fork) is USDC — 18 decimals on-chain. */
const nativeUsdc = {
  name: "USD Coin",
  symbol: "USDC",
  decimals: 18 as const,
};

/** Local Foundry / Anvil — default for `pnpm --filter web dev`. */
export const popperAnvil = defineChain({
  id: 31337,
  name: "Popper Anvil",
  nativeCurrency: nativeUsdc,
  rpcUrls: {
    default: {
      http: [publicEnv.chainId === 31337 ? publicEnv.rpcUrl : "http://127.0.0.1:8545"],
    },
  },
});

/**
 * Arc testnet definition sourced from config/arc.testnet.json + env.
 * The stub JSON ships chainId 0 — we only instantiate this when env has a real id.
 */
export const arcTestnet =
  publicEnv.chainId > 0 && publicEnv.chainId !== 31337
    ? defineChain({
        id: publicEnv.chainId,
        name: "Arc Testnet",
        nativeCurrency: nativeUsdc,
        rpcUrls: {
          default: { http: [publicEnv.rpcUrl] },
        },
      })
    : null;

export const targetChain = arcTestnet ?? popperAnvil;
