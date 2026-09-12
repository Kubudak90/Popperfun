import { Button } from "@/components/button";
import { Logo, PopperMark } from "@/components/logo";
import { TokenCard } from "@/components/token-card";
import { POPS } from "@/lib/pops";

const TRAITS = [
  { label: "Playful", color: "#D94CFF" },
  { label: "Fast", color: "#1E8BFF" },
  { label: "Confident", color: "#6F3BFF" },
  { label: "On-chain", color: "#FF8A4C" },
] as const;

const STEPS = [
  {
    n: "01",
    title: "Launch",
    body: "Name it, set a USDC graduation line, lock the economics. One curve family. No take-backs.",
  },
  {
    n: "02",
    title: "Collect",
    body: "Trade a constant-product curve quoted in native USDC. Buy the splash. Sell if you must.",
  },
  {
    n: "03",
    title: "Belong",
    body: "Hit the threshold and the pop graduates to Uniswap V4. You were there when it popped.",
  },
] as const;

export default function HomePage() {
  const featured = POPS.filter((pop) => pop.phase !== "graduated").slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="orb -left-16 -top-10 h-64 w-64 bg-[#6F3BFF]/25 dark:bg-[#6F3BFF]/20" />
        <div className="orb -right-10 top-24 h-72 w-72 bg-[#D94CFF]/20 dark:bg-[#D94CFF]/15" />
        <div className="orb bottom-0 left-1/3 h-56 w-56 bg-[#1E8BFF]/20 dark:bg-[#1E8BFF]/15" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <div className="animate-pop">
            <Logo size={56} wordmarkClassName="text-3xl sm:text-4xl" />
          </div>

          <div
            className="animate-pop mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-bold text-muted"
            style={{ animationDelay: "80ms" }}
          >
            <PopperMark size={16} />
            Arc-native · quoted in USDC
          </div>

          <h1
            className="animate-pop mt-6 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl"
            style={{ animationDelay: "120ms" }}
          >
            Ideas <span className="bg-gradient-to-r from-purple to-blue bg-clip-text text-transparent">pop</span> here.
          </h1>

          <p
            className="animate-pop mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
            style={{ animationDelay: "180ms" }}
          >
            Launch a fixed-supply token against native USDC, trade the bonding
            curve, then graduate to Uniswap V4. Launch, collect, and be part of
            what&apos;s next.
          </p>

          <div
            className="animate-pop mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
            style={{ animationDelay: "240ms" }}
          >
            <Button href="/launch" size="lg" className="w-full sm:w-auto">
              Launch Token
            </Button>
            <Button href="/explore" variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Pops
            </Button>
          </div>

          <div className="mt-12 grid w-full grid-cols-2 gap-2 sm:grid-cols-4">
            {TRAITS.map((trait) => (
              <div
                key={trait.label}
                className="rounded-2xl border border-border bg-card/80 px-3 py-3 font-display text-sm font-extrabold sm:text-base"
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ background: trait.color }}
                />
                {trait.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-purple">
              Live on the curve
            </p>
            <h2 className="mt-1 font-display text-3xl font-extrabold tracking-tight">
              Pops mid-flight
            </h2>
          </div>
          <Button href="/explore" variant="ghost" size="sm">
            See all
          </Button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pop) => (
            <TokenCard key={pop.id} pop={pop} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-orange">
          How a pop works
        </p>
        <h2 className="mt-1 max-w-lg font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          A more playful on-chain future.
        </h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="rounded-[28px] border border-border bg-card p-6 shadow-[var(--shadow)]"
            >
              <p className="font-display text-sm font-extrabold text-purple">{step.n}</p>
              <h3 className="mt-2 font-display text-2xl font-extrabold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
