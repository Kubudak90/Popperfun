import { isAddress, zeroAddress, type Address } from "viem";
import {
  ARC_TESTNET_CHAIN_ID,
  ARC_TESTNET_EXPLORER,
  ARC_TESTNET_FACTORY,
  ARC_TESTNET_RPC_HTTP,
  addressExplorerUrlFor,
  txExplorerUrlFor,
} from "@/lib/arc";

const ZERO = zeroAddress;
const ANVIL_ID = 31337;

function readChainId() {
  const raw = process.env.NEXT_PUBLIC_CHAIN_ID;
  if (raw && Number.isFinite(Number(raw)) && Number(raw) > 0) return Number(raw);
  return ARC_TESTNET_CHAIN_ID;
}

function readFactory(): Address {
  const fromEnv = process.env.NEXT_PUBLIC_FACTORY_ADDRESS?.trim();
  if (fromEnv && isAddress(fromEnv) && fromEnv !== ZERO) return fromEnv;
  if (readChainId() === ARC_TESTNET_CHAIN_ID) return ARC_TESTNET_FACTORY;
  return ZERO;
}

function readRpcUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_RPC_URL?.trim();
  if (fromEnv) return fromEnv;
  return readChainId() === ANVIL_ID ? "http://127.0.0.1:8545" : ARC_TESTNET_RPC_HTTP;
}

/**
 * Public runtime config. Defaults are official Arc Testnet (docs.arc.io).
 * Set NEXT_PUBLIC_CHAIN_ID=31337 for local Anvil.
 * Zero factory = not wired. Never invent Uniswap V4 or Arc mainnet addresses.
 */
export const publicEnv = {
  chainId: readChainId(),
  rpcUrl: readRpcUrl(),
  factoryAddress: readFactory(),
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() || "",
  explorerTxUrl: process.env.NEXT_PUBLIC_EXPLORER_TX_URL?.trim() || "",
} as const;

export const factoryReady =
  publicEnv.factoryAddress !== ZERO && isAddress(publicEnv.factoryAddress);

export const targetingArcTestnet = publicEnv.chainId === ARC_TESTNET_CHAIN_ID;

export function txExplorerUrl(hash: string) {
  if (publicEnv.explorerTxUrl) {
    if (publicEnv.explorerTxUrl.includes("{hash}")) {
      return publicEnv.explorerTxUrl.replace("{hash}", hash);
    }
    return `${publicEnv.explorerTxUrl.replace(/\/$/, "")}/${hash}`;
  }
  if (targetingArcTestnet) return txExplorerUrlFor(hash);
  return null;
}

export function addressExplorerUrl(address: string) {
  if (targetingArcTestnet) return addressExplorerUrlFor(address);
  return null;
}

export function explorerHome() {
  return targetingArcTestnet ? ARC_TESTNET_EXPLORER : null;
}

export function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
