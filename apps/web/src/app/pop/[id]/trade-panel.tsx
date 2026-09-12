"use client";

import { useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useWallet } from "@/components/wallet-provider";
import { cn } from "@/lib/cn";
import type { Pop } from "@/lib/pops";

const SLIPPAGE = ["0.5", "1.0", "2.0"] as const;

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
    <div className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="grid grid-cols-2 rounded-full border border-border bg-background p-1">
        {(["buy", "sell"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setSide(item);
              setMessage(null);
            }}
            className={cn(
              "rounded-full py-2.5 font-display text-sm font-extrabold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple",
              side === item
                ? item === "buy"
                  ? "bg-purple text-white"
                  : "bg-orange text-white"
                : "text-muted hover:text-foreground",
            )}
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

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-sm font-extrabold">Slippage</span>
          <span className="text-xs text-muted">{slippage}%</span>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {SLIPPAGE.map((value) => (
              <button
                key={value}
                type="button"
                disabled={graduated}
                onClick={() => setSlippage(value)}
                className={cn(
                  "h-9 rounded-full px-3.5 font-display text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple disabled:opacity-50",
                  slippage === value
                    ? "bg-purple/12 text-purple"
                    : "border border-border bg-background text-muted hover:text-foreground",
                )}
              >
                {value}%
              </button>
            ))}
          </div>
          <label className="relative w-full sm:w-24">
            <Input
              value={slippage}
              onChange={(event) => setSlippage(event.target.value)}
              inputMode="decimal"
              disabled={graduated}
              aria-label="Custom slippage percent"
              className="h-9 py-0 pr-7 text-sm"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 grid place-items-center text-xs text-muted">
              %
            </span>
          </label>
        </div>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">
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
        <p className="mt-4 rounded-[18px] bg-background px-3 py-2.5 text-sm text-muted">{message}</p>
      ) : null}
    </div>
  );
}
