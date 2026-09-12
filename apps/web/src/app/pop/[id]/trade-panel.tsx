"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useWallet } from "@/components/wallet-provider";
import type { Pop } from "@/lib/pops";

export function TradePanel({ pop }: { pop: Pop }) {
  const { address, connect, connecting } = useWallet();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");
  const [slippage, setSlippage] = useState("1.0");
  const [message, setMessage] = useState<string | null>(null);

  const graduated = pop.phase === "graduated";

  function submit() {
    if (graduated) {
      setMessage("This pop already graduated. Trading lives on the venue now.");
      return;
    }
    if (!address) {
      setMessage("Connect the stub wallet first — no live transactions yet.");
      return;
    }
    const parsed = Number(amount);
    const slip = Number(slippage);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setMessage("Enter an amount greater than zero.");
      return;
    }
    if (!Number.isFinite(slip) || slip < 0 || slip > 50) {
      setMessage("Slippage should be between 0 and 50%.");
      return;
    }
    setMessage(
      `Stub ${side}: ${parsed} ${side === "buy" ? "USDC" : pop.symbol} with ${slip}% slippage. ArcBondingCurve is not wired.`,
    );
  }

  return (
    <div className="rounded-[32px] border border-border bg-card p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="grid grid-cols-2 rounded-full bg-background p-1">
        {(["buy", "sell"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setSide(item);
              setMessage(null);
            }}
            className={`rounded-full py-2.5 font-display text-sm font-extrabold capitalize ${
              side === item
                ? item === "buy"
                  ? "bg-purple text-white"
                  : "bg-orange text-white"
                : "text-muted"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <label className="mt-5 block space-y-2">
        <span className="font-display text-sm font-extrabold">
          {side === "buy" ? "USDC to spend" : `${pop.symbol} to sell`}
        </span>
        <Input
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          inputMode="decimal"
          disabled={graduated}
        />
      </label>

      <label className="mt-4 block space-y-2">
        <span className="font-display text-sm font-extrabold">Slippage %</span>
        <Input
          value={slippage}
          onChange={(event) => setSlippage(event.target.value)}
          inputMode="decimal"
          disabled={graduated}
        />
      </label>

      <p className="mt-3 text-xs text-muted">
        Quotes would come from the constant-product curve (virtual + real native18
        reserves). This panel is UI-only.
      </p>

      <div className="mt-5">
        {address || graduated ? (
          <Button
            type="button"
            onClick={submit}
            variant={side === "sell" ? "danger" : "primary"}
            className="w-full"
            disabled={graduated}
          >
            {graduated ? "Graduated" : side === "buy" ? `Buy ${pop.symbol}` : `Sell ${pop.symbol}`}
          </Button>
        ) : (
          <Button type="button" onClick={connect} className="w-full" disabled={connecting}>
            {connecting ? "Connecting…" : "Connect Wallet"}
          </Button>
        )}
      </div>

      {message ? (
        <p className="mt-4 rounded-2xl bg-background px-3 py-2 text-sm text-muted">{message}</p>
      ) : null}
    </div>
  );
}
