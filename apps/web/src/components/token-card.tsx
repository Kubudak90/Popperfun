import Link from "next/link";
import { Badge } from "@/components/badge";
import { CurveBar } from "@/components/curve-bar";
import { ACCENT_GRADIENT, curveProgress, type Pop } from "@/lib/pops";
import { cn } from "@/lib/cn";

function formatCompactUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function TokenCard({ pop, className }: { pop: Pop; className?: string }) {
  const progress = curveProgress(pop);

  return (
    <Link
      href={`/pop/${pop.id}`}
      className={cn(
        "group relative flex flex-col rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:border-purple/25 hover:shadow-[0_16px_40px_color-mix(in_srgb,#101426_8%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple",
        className,
      )}
    >
      <Badge kind={pop.badge} className="absolute right-4 top-4" />

      <div className="flex min-w-0 items-center gap-3 pr-[4.5rem]">
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br font-display text-sm font-extrabold text-white",
            ACCENT_GRADIENT[pop.accent],
          )}
        >
          {pop.symbol.slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-extrabold leading-tight">{pop.name}</p>
          <p className="text-sm text-muted">${pop.symbol}</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted">{pop.description}</p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted">
            {pop.phase === "graduated" ? "Graduated" : "Curve progress"}
          </span>
          <span className="font-display font-bold">{progress}%</span>
        </div>
        <CurveBar value={progress} />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">Market cap</p>
          <p className="font-display font-extrabold">{formatCompactUsd(pop.marketCapUsd)}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-muted">Holders</p>
          <p className="font-display font-extrabold">{pop.holders.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}

export function TokenCardSkeleton() {
  return (
    <div className="h-[248px] animate-pulse rounded-[22px] border border-border bg-card" />
  );
}
