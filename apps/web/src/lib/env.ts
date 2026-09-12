import { isAddress, zeroAddress, type Address } from "viem";

const ZERO = zeroAddress;

function readChainId() {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (raw && Number.isFinite(Number(raw)) && Number(raw) > 0) return Number(raw);
  return 31337;
}

function readFactory(): Address {
  const fromEnv = process.env.NEXT_PUBLIC_FACTORY_ADDRESS?.trim();
  if (fromEnv && isAddress(fromEnv)) return fromEnv;
  return ZERO;
}

/**
 * Public runtime config.
 * Mirrors config/arc.testnet.json: zero factory / missing chain id means not wired.
 * Never invent Uniswap V4 or production Arc mainnet addresses.
 */
export const publicEnv = {
  chainId: readChainId(),
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL?.trim() || "http://127.0.0.1:8545",
  factoryAddress: readFactory(),
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || "",
  explorerTxUrl: process.env.NEXT_PUBLIC_EXPLORER_TX_URL?.trim() || "",
} as const;

export const factoryReady =
  publicEnv.factoryAddress !== ZERO && isAddress(publicEnv.factoryAddress);

export function txExplorerUrl(hash: string) {
  if (!publicEnv.explorerTxUrl) return null;
  if (publicEnv.explorerTxUrl.includes("{hash}")) {
    return publicEnv.explorerTxUrl.replace("{hash}", hash);
  }
  return `${publicEnv.explorerTxUrl.replace(/\/$/, "")}/${hash}`;
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
