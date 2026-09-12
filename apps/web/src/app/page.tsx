import { Button } from "@/components/button";
import { ArrowIcon } from "@/components/icons";
import { Logo, PopperMark } from "@/components/logo";
import { TokenCard } from "@/components/token-card";
import { POPS } from "@/lib/pops";

const TRAITS = [
  {
    label: "Playful",
    kit: "FUN BRINGS PEOPLE TOGETHER",
    color: "#D94CFF",
  },
  {
    label: "Fast",
    kit: "IDEAS TO MARKET, FASTER",
    color: "#1E8BFF",
  },
  {
    label: "Confident",
    kit: "BUILT FOR A BIGGER TOMORROW",
    color: "#6F3BFF",
  },
  {
    label: "On-chain",
    kit: "REAL OWNERSHIP. REAL OPPORTUNITY.",
    color: "#FF8A4C",
  },
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
    body: "Hit the threshold and the pop graduates. You were there when it popped.",
  },
] as const;

export default function HomePage() {
  const featured = POPS.filter((pop) => pop.phase !== "graduated").slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="orb -left-20 -top-16 h-72 w-72 bg-purple/20 dark:bg-purple/25" />
        <div className="orb -right-16 top-20 h-80 w-80 bg-pink/16 dark:bg-pink/18" />
        <div className="orb bottom-4 left-1/3 h-64 w-64 bg-blue/16 dark:bg-blue/18" />

        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-14 text-center sm:px-6 sm:pt-20">
          <div className="animate-pop">
            <Logo size={58} wordmarkClassName="text-3xl sm:text-4xl" />
          </div>

          <h1 className="animate-pop mt-8 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-midnight dark:text-cloud sm:text-7xl">
            Ideas pop here.
          </h1>

          <p className="animate-pop mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
            Launch, collect, and be part of what&apos;s next.
          </p>

          <div className="animate-pop mt-8 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
            <Button href="/launch" size="lg" className="w-full sm:w-auto">
              <PopperMark size={20} className="text-white dark:text-white" />
              Launch Token
              <ArrowIcon />
            </Button>
            <Button href="/explore" variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore Pops
              <ArrowIcon />
            </Button>
          </div>

          <div className="mt-14 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TRAITS.map((trait) => (
              <article
                key={trait.label}
                className="rounded-[24px] border border-border bg-card px-4 py-4 text-left shadow-[var(--shadow)]"
              >
                <p className="font-display text-lg font-extrabold tracking-tight">
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full"
                    style={{ background: trait.color }}
                  />
                  {trait.label}
                </p>
                <p className="mt-2 font-display text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
                  {trait.kit}
                </p>
              </article>
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
          <Button href="/explore" variant="secondary" size="sm">
            See all
            <ArrowIcon />
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
