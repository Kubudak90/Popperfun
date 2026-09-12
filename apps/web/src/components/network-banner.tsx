"use client";

import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/button";
import { targetChain } from "@/lib/chains";
import { formatTxError } from "@/lib/wagmi";

export function NetworkBanner() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();

  if (!isConnected || chainId === targetChain.id) return null;

  return (
    <div className="border-b border-orange/30 bg-orange/10">
      <div className="page-wrap flex flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
        <p className="text-sm text-midnight dark:text-cloud">
          Wrong network. Popper is on <span className="font-display font-extrabold">{targetChain.name}</span>{" "}
          (chain {targetChain.id}).
        </p>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          disabled={isPending}
          onClick={() => switchChain({ chainId: targetChain.id })}
        >
          {isPending ? "Switching…" : `Switch to ${targetChain.name}`}
        </Button>
        {error ? <p className="text-sm text-orange">{formatTxError(error)}</p> : null}
      </div>
    </div>
  );
}
