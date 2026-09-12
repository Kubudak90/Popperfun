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
        "group flex flex-col rounded-[28px] border border-border bg-card p-4 shadow-[var(--shadow)] transition-all duration-300 hover:-translate-y-1 hover:border-purple/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br font-display text-lg font-extrabold text-white shadow-md",
              ACCENT_GRADIENT[pop.accent],
            )}
          >
            {pop.symbol.slice(0, 2)}
          </div>
          <div>
            <p className="font-display text-lg font-extrabold leading-tight">{pop.name}</p>
            <p className="text-sm text-muted">${pop.symbol}</p>
          </div>
        </div>
        <Badge kind={pop.badge} />
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{pop.description}</p>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted">
            {pop.phase === "graduated" ? "Graduated" : "Curve progress"}
          </span>
          <span className="font-display font-bold text-foreground">{progress}%</span>
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
    <div className="h-[248px] animate-pulse rounded-[28px] border border-border bg-card" />
  );
}
