import { defineChain } from "viem";
import {
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_EXPLORER,
  ARC_TESTNET_RPC_HTTP,
  ARC_TESTNET_RPC_WS,
} from "@/lib/arc";
import { publicEnv } from "@/lib/env";

const nativeUsdc = {
  name: "USDC",
  symbol: "USDC",
  decimals: 18 as const,
};

/** Official Arc Testnet — docs.arc.io. Primary target. */
export const arcTestnet = defineChain({
  id: ARC_TESTNET_CHAIN_ID,
  name: "Arc Testnet",
  nativeCurrency: nativeUsdc,
  rpcUrls: {
    default: {
      http: [publicEnv.chainId === ARC_TESTNET_CHAIN_ID ? publicEnv.rpcUrl : ARC_TESTNET_RPC_HTTP],
      webSocket: [ARC_TESTNET_RPC_WS],
    },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: ARC_TESTNET_EXPLORER },
  },
  testnet: true,
});

/** Local Foundry / Anvil — opt in with NEXT_PUBLIC_CHAIN_ID=31337. */
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

export const targetChain = publicEnv.chainId === popperAnvil.id ? popperAnvil : arcTestnet;
