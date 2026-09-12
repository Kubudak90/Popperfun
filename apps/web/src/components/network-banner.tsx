"use client";

import { useState } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { Button } from "@/components/button";
import { ARC_TESTNET_CHAIN_ID, walletAddArcTestnet } from "@/lib/arc";
import { targetChain } from "@/lib/chains";
import { formatTxError } from "@/lib/wagmi";

export function NetworkBanner() {
  const { isConnected, chainId } = useAccount();
  const { switchChain, isPending, error } = useSwitchChain();
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  if (!isConnected || chainId === targetChain.id) return null;

  const targetingArc = targetChain.id === ARC_TESTNET_CHAIN_ID;

  async function addAndSwitch() {
    setAddError(null);
    setAdding(true);
    try {
      if (targetingArc) {
        await walletAddArcTestnet();
      }
      switchChain({ chainId: targetChain.id });
    } catch (caught) {
      setAddError(formatTxError(caught));
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="border-b border-orange/30 bg-orange/10">
      <div className="page-wrap flex flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center">
        <p className="text-sm text-midnight dark:text-cloud">
          Wrong network. Popper is on{" "}
          <span className="font-display font-extrabold">{targetChain.name}</span> (chain{" "}
          {targetChain.id}
          {targetingArc ? " / 0x4CEF52" : ""}).
        </p>
        <div className="flex flex-wrap gap-2">
          {targetingArc ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              disabled={adding || isPending}
              onClick={addAndSwitch}
            >
              {adding || isPending ? "Adding…" : "Add Arc Testnet"}
            </Button>
          ) : null}
          <Button
            type="button"
            size="sm"
            variant={targetingArc ? "ghost" : "secondary"}
            disabled={isPending}
            onClick={() => switchChain({ chainId: targetChain.id })}
          >
            {isPending ? "Switching…" : `Switch to ${targetChain.name}`}
          </Button>
        </div>
        {error || addError ? (
          <p className="text-sm text-orange">{addError ?? (error ? formatTxError(error) : null)}</p>
        ) : null}
      </div>
    </div>
  );
}
