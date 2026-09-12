/**
 * Official Arc Testnet params from docs.arc.io (2026).
 * Keep in sync with config/arc.testnet.json. Do not invent V4 / mainnet addresses.
 *
 * @see https://docs.arc.io/arc/references/rpc-endpoints
 * @see https://docs.arc.io/integrate/wallets/add-arc-to-a-wallet
 */

export const ARC_TESTNET_CHAIN_ID = 5042002;
export const ARC_TESTNET_CHAIN_ID_HEX = "0x4CEF52";
export const ARC_TESTNET_RPC_HTTP = "https://rpc.testnet.arc.io";
export const ARC_TESTNET_RPC_WS = "wss://rpc.testnet.arc.io";
export const ARC_TESTNET_EXPLORER = "https://testnet.arcscan.app";
export const ARC_TESTNET_FAUCET = "https://faucet.circle.com";

/** Official EIP-3085 payload — exact docs.arc.io values. */
export const ARC_EIP3085 = {
  chainId: ARC_TESTNET_CHAIN_ID_HEX,
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: [ARC_TESTNET_RPC_HTTP],
  blockExplorerUrls: [ARC_TESTNET_EXPLORER],
} as const;

export function txExplorerUrlFor(hash: string) {
  return `${ARC_TESTNET_EXPLORER}/tx/${hash}`;
}

export function addressExplorerUrlFor(address: string) {
  return `${ARC_TESTNET_EXPLORER}/address/${address}`;
}

export async function walletAddArcTestnet() {
  const provider = window.ethereum;
  if (!provider?.request) {
    throw new Error("No injected wallet. Install Rabby or MetaMask.");
  }
  await provider.request({
    method: "wallet_addEthereumChain",
    params: [ARC_EIP3085],
  });
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
