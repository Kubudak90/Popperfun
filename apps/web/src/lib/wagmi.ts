import { injected } from "@wagmi/core";
import { createConfig, http } from "wagmi";
import { publicEnv } from "@/lib/env";
import { arcTestnet, popperAnvil, targetChain } from "@/lib/chains";

/**
 * Import injected from @wagmi/core — not `wagmi/connectors`.
 * The connectors barrel pulls Coinbase/Base optional deps that break `next build`.
 */
const connectors = [injected({ shimDisconnect: true })];

export const wagmiConfig = createConfig({
  chains: [arcTestnet, popperAnvil],
  connectors,
  transports: {
    [arcTestnet.id]: http(
      targetChain.id === arcTestnet.id ? publicEnv.rpcUrl : "https://rpc.testnet.arc.io",
    ),
    [popperAnvil.id]: http(
      targetChain.id === popperAnvil.id ? publicEnv.rpcUrl : "http://127.0.0.1:8545",
    ),
  },
  ssr: true,
});

export function formatTxError(error: unknown) {
  if (!error || typeof error !== "object") return "Transaction failed.";
  const record = error as {
    shortMessage?: string;
    details?: string;
    message?: string;
    cause?: { reason?: string; shortMessage?: string };
  };
  if (record.cause?.reason) return record.cause.reason;
  if (record.shortMessage) return record.shortMessage;
  if (record.cause?.shortMessage) return record.cause.shortMessage;
  if (record.details) return record.details;
  if (record.message) return record.message.split("\n")[0] ?? record.message;
  return "Transaction failed.";
}
