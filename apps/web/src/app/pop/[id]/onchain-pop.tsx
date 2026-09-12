"use client";

import { asNative18, bondingCurveAbi, formatUsd6, launcherTokenAbi, native18ToUsd6 } from "@popper/sdk";
import Link from "next/link";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { CurveBar } from "@/components/curve-bar";
import { ArrowIcon } from "@/components/icons";
import { PopperMark } from "@/components/logo";
import { shortenAddress } from "@/lib/env";
import { ACCENT_GRADIENT } from "@/lib/pops";
import { cn } from "@/lib/cn";
import type { Address } from "viem";
import { useReadContract } from "wagmi";
import { TradePanel } from "./trade-panel";

const PHASE = ["trading", "prepared", "graduated"] as const;

export function OnchainPop({ curve }: { curve: Address }) {
  const token = useReadContract({
    address: curve,
    abi: bondingCurveAbi,
    functionName: "token",
  });
  const raised = useReadContract({
    address: curve,
    abi: bondingCurveAbi,
    functionName: "realNative18",
  });
  const threshold = useReadContract({
    address: curve,
    abi: bondingCurveAbi,
    functionName: "graduationThresholdNative18",
  });
  const phaseIndex = useReadContract({
    address: curve,
    abi: bondingCurveAbi,
    functionName: "phase",
  });
  const canGraduate = useReadContract({
    address: curve,
    abi: bondingCurveAbi,
    functionName: "canGraduate",
  });
  const name = useReadContract({
    address: token.data,
    abi: launcherTokenAbi,
    functionName: "name",
    query: { enabled: Boolean(token.data) },
  });
  const symbol = useReadContract({
    address: token.data,
    abi: launcherTokenAbi,
    functionName: "symbol",
    query: { enabled: Boolean(token.data) },
  });

  const loading = token.isLoading || raised.isLoading || threshold.isLoading || phaseIndex.isLoading;
  const failed = token.isError || (token.data && name.isError);

  if (loading) {
    return (
      <div className="page-wrap py-16">
        <p className="font-display text-lg font-extrabold">Reading the curve…</p>
        <p className="mt-2 text-muted">Pulling live native18 reserves from {shortenAddress(curve)}.</p>
      </div>
    );
  }

  if (failed || !token.data || threshold.data === undefined || raised.data === undefined || phaseIndex.data === undefined) {
    return (
      <div className="page-wrap py-16">
        <p className="font-display text-2xl font-extrabold">This is not a Popper curve.</p>
        <p className="mt-2 max-w-lg text-muted">
          {shortenAddress(curve)} did not return curve state. Check the factory deploy and that you
          are on the configured chain.
        </p>
        <div className="mt-6">
          <Button href="/explore" variant="secondary">
            Explore Pops
            <ArrowIcon />
          </Button>
        </div>
      </div>
    );
  }

  const phase = PHASE[Number(phaseIndex.data)] ?? "trading";
  const raisedUsd6 = native18ToUsd6(asNative18(raised.data));
  const thresholdUsd6 = native18ToUsd6(asNative18(threshold.data));
  const progress =
    phase === "graduated" || threshold.data === 0n
      ? 100
      : Number((raised.data * 100n) / threshold.data);
  const ticker = symbol.data ?? "POP";
  const title = name.data ?? "On-chain pop";

  return (
    <div className="page-wrap py-12 sm:py-14">
      <Link href="/explore" className="text-sm font-bold text-muted transition hover:text-purple">
        ← All pops
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div>
          <div className="flex flex-wrap items-start gap-4">
            <div
              className={cn(
                "grid h-16 w-16 place-items-center rounded-[22px] bg-gradient-to-br font-display text-2xl font-extrabold text-white",
                ACCENT_GRADIENT.purple,
              )}
            >
              {ticker.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
                <Badge kind={phase === "graduated" ? "LIVE" : "NEW"} />
              </div>
              <p className="mt-1 text-muted">
                ${ticker} · curve {shortenAddress(curve)}
                {token.data ? ` · token ${shortenAddress(token.data)}` : null}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Live from ArcLaunchFactory. Threshold and raised amounts are native18, shown as usd6.
          </p>

          <div className="mt-8 rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-purple">
                  Bonding curve
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  {phase === "graduated" ? "Graduated" : `${Math.min(100, progress)}% to graduation`}
                </h2>
              </div>
              <p className="text-right text-sm text-muted">
                {phase === "graduated" ? "Mock V4 venue" : `$${formatUsd6(raisedUsd6)} raised`}
              </p>
            </div>
            <CurveBar value={Math.min(100, progress)} className="mt-4 h-3" />

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Raised" value={`$${formatUsd6(raisedUsd6)}`} />
              <Stat label="Threshold" value={`$${formatUsd6(thresholdUsd6)}`} />
              <Stat label="Can graduate" value={canGraduate.data ? "Yes" : "Not yet"} />
            </dl>
          </div>

          <div className="mt-4 rounded-[22px] border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  phase === "graduated" ? "bg-live" : phase === "prepared" ? "bg-orange" : "bg-purple",
                )}
              />
              <p className="font-display font-extrabold">Graduation status</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {phase === "graduated"
                ? "Phase 2 complete. Liquidity was sent to MockGraduationVenue — not a real Uniswap V4 pool."
                : phase === "prepared"
                  ? "Phase 1 locked. Waiting to finalize into the mock venue."
                  : "Still trading. Anyone can graduate the pop once raised native USDC clears the immutable threshold."}
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24">
          <TradePanel
            pop={{
              symbol: ticker,
              phase,
              curveAddress: curve,
            }}
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/launch" size="sm">
              <PopperMark size={16} className="text-white dark:text-white" />
              Launch Token
              <ArrowIcon />
            </Button>
            <Button href="/explore" variant="secondary" size="sm">
              Explore Pops
              <ArrowIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-display text-lg font-extrabold">{value}</dd>
    </div>
  );
}
