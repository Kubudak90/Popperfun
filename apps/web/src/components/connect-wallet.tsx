"use client";

import { Button } from "@/components/button";
import { useWallet } from "@/components/wallet-provider";

export function ConnectWallet({ size = "sm" }: { size?: "sm" | "md" }) {
  const { shortAddress, connecting, connect, disconnect } = useWallet();

  if (shortAddress) {
    return (
      <Button variant="ghost" size={size} onClick={disconnect} title="Stub wallet — click to disconnect">
        {shortAddress}
      </Button>
    );
  }

  return (
    <Button variant="secondary" size={size} onClick={connect} disabled={connecting}>
      {connecting ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}
