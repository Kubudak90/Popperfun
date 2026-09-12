import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { CurveBar } from "@/components/curve-bar";
import { ACCENT_GRADIENT, curveProgress, getPop, POPS } from "@/lib/pops";
import { cn } from "@/lib/cn";
import { TradePanel } from "./trade-panel";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return POPS.map((pop) => ({ id: pop.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pop = getPop(id);
  if (!pop) return { title: "Pop not found" };
  return { title: `${pop.name} ($${pop.symbol})` };
}

export default async function PopPage({ params }: Props) {
  const { id } = await params;
  const pop = getPop(id);
  if (!pop) notFound();

  const progress = curveProgress(pop);
  const remaining = Math.max(0, pop.graduationUsd - pop.raisedUsd);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link href="/explore" className="text-sm font-bold text-muted hover:text-purple">
        ← All pops
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex flex-wrap items-start gap-4">
            <div
              className={cn(
                "grid h-16 w-16 place-items-center rounded-[22px] bg-gradient-to-br font-display text-2xl font-extrabold text-white",
                ACCENT_GRADIENT[pop.accent],
              )}
            >
              {pop.symbol.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-4xl font-extrabold tracking-tight">
                  {pop.name}
                </h1>
                <Badge kind={pop.badge} />
              </div>
              <p className="mt-1 text-muted">
                ${pop.symbol} · {pop.createdAt} · {pop.holders.toLocaleString()} holders
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{pop.description}</p>

          <div className="mt-8 rounded-[32px] border border-border bg-card p-6 shadow-[var(--shadow)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-purple">
                  Bonding curve
                </p>
                <h2 className="mt-1 font-display text-2xl font-extrabold">
                  {pop.phase === "graduated" ? "Graduated" : `${progress}% to graduation`}
                </h2>
              </div>
              <p className="text-right text-sm text-muted">
                {pop.phase === "graduated"
                  ? "Mock V4 venue"
                  : `$${remaining.toLocaleString()} USDC to go`}
              </p>
            </div>
            <CurveBar value={progress} className="mt-4 h-3" />

            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Market cap" value={`$${pop.marketCapUsd.toLocaleString()}`} />
              <Stat label="Raised" value={`$${pop.raisedUsd.toLocaleString()}`} />
              <Stat label="Threshold" value={`$${pop.graduationUsd.toLocaleString()}`} />
            </dl>
          </div>

          <div className="mt-4 rounded-[28px] border border-border bg-card p-5">
            <p className="font-display font-extrabold">Graduation status</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {pop.phase === "graduated"
                ? "Phase 2 complete. Liquidity was sent to MockGraduationVenue — not a real Uniswap V4 pool."
                : pop.phase === "prepared"
                  ? "Phase 1 locked. Waiting to finalize into the mock venue."
                  : "Still trading. Anyone can graduate the pop once raised native USDC clears the immutable threshold."}
            </p>
          </div>
        </div>

        <div>
          <TradePanel pop={pop} />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href="/launch" variant="ghost" size="sm">
              Launch your own
            </Button>
            <Button href="/explore" variant="ghost" size="sm">
              Explore Pops
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
