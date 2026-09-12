"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@/components/button";
import { targetChain } from "@/lib/chains";
import { shortenAddress } from "@/lib/env";
import { formatTxError } from "@/lib/wagmi";

export function ConnectWallet({ size = "sm" }: { size?: "sm" | "md" }) {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, error, reset } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    return () => window.removeEventListener("mousedown", onPointer);
  }, []);

  useEffect(() => {
    if (isConnected) setOpen(false);
  }, [isConnected]);

  if (isConnected && address) {
    return (
      <Button
        variant="ghost"
        size={size}
        onClick={() => disconnect()}
        title="Disconnect wallet"
        className="border-midnight/10 font-bold shadow-none dark:border-cloud/12"
      >
        {shortenAddress(address)}
      </Button>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="secondary"
        size={size}
        onClick={() => {
          reset();
          setOpen((value) => !value);
        }}
        disabled={isPending}
        className="border-midnight/10 font-bold shadow-none dark:border-cloud/12"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </Button>
      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-64 rounded-[18px] border border-border bg-card p-2 shadow-[var(--shadow)]">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Connect to {targetChain.name}
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => connect({ connector, chainId: targetChain.id })}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left font-display text-sm font-bold hover:bg-background"
            >
              {connector.type === "injected" ? "Browser wallet" : connector.name}
            </button>
          ))}
          {error ? (
            <p className="px-3 py-2 text-sm text-orange">{formatTxError(error)}</p>
          ) : null}
          <p className="px-3 py-2 text-xs leading-relaxed text-muted">
            Browser wallets (Rabby, MetaMask). Point them at {targetChain.name} / chain{" "}
            {targetChain.id}.
          </p>
        </div>
      ) : null}
    </div>
  );
}
