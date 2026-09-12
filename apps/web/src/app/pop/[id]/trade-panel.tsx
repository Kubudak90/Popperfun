"use client";

import { bondingCurveAbi } from "@popper/sdk";
import { useMemo, useState } from "react";
import { formatUnits, parseUnits, type Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { Button } from "@/components/button";
import { ConnectWallet } from "@/components/connect-wallet";
import { Input } from "@/components/input";
import { cn } from "@/lib/cn";
import type { Pop, PopPhase } from "@/lib/pops";

const SLIPPAGE = ["0.5", "1.0", "2.0"] as const;

type TradeTarget = {
  symbol: string;
  phase: PopPhase;
  curveAddress?: Address;
};

export function TradePanel({ pop }: { pop: Pop | TradeTarget }) {
  const { address, isConnected } = useAccount();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");
  const [slippage, setSlippage] = useState("1.0");
  const curveAddress = "curveAddress" in pop ? pop.curveAddress : undefined;
  const graduated = pop.phase === "graduated";

  const parsedNative18 = useMemo(() => {
    try {
      if (!amount || Number(amount) <= 0) return null;
      return parseUnits(amount, 18);
    } catch {
      return null;
    }
  }, [amount]);

  const quoteFn = side === "buy" ? "quoteBuy" : "quoteSell";
  const { data: quote, error: quoteError } = useReadContract({
    address: curveAddress,
    abi: bondingCurveAbi,
    functionName: quoteFn,
    args: parsedNative18 !== null ? [parsedNative18] : undefined,
    query: { enabled: Boolean(curveAddress) && parsedNative18 !== null && !graduated },
  });

  const quoteLabel = useMemo(() => {
    if (!curveAddress || quote === undefined) return null;
    if (side === "buy") return `${formatUnits(quote, 18)} ${pop.symbol}`;
    return `${formatUnits(quote, 18)} USDC`;
  }, [curveAddress, pop.symbol, quote, side]);

  return (
    <div className="rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="grid grid-cols-2 rounded-full border border-border bg-background p-1">
        {(["buy", "sell"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSide(item)}
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

      {curveAddress && quoteLabel ? (
        <p className="mt-3 text-sm text-muted">
          Quote {quoteLabel}
          <span className="block text-xs">Read from the curve. Writes come next.</span>
        </p>
      ) : (
        <p className="mt-3 text-xs leading-relaxed text-muted">
          {curveAddress
            ? "Quotes read from the constant-product curve (native18). Buy/sell writes ship next."
            : "Catalog pop — no on-chain curve. Buy/sell writes ship after launch wiring."}
        </p>
      )}

      {quoteError ? (
        <p className="mt-2 text-sm text-orange">Could not quote this curve.</p>
      ) : null}

      <div className="mt-5">
        {graduated ? (
          <Button type="button" className="w-full" disabled>
            Graduated
          </Button>
        ) : !isConnected || !address ? (
          <ConnectWallet size="md" />
        ) : (
          <Button type="button" variant={side === "sell" ? "danger" : "primary"} className="w-full" disabled>
            {side === "buy" ? `Buy ${pop.symbol}` : `Sell ${pop.symbol}`} · next
          </Button>
        )}
      </div>
    </div>
  );
}
