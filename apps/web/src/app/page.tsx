import { Button } from "@/components/button";
import { ArrowIcon } from "@/components/icons";
import { Logo, PopperMark } from "@/components/logo";
import { TokenCard } from "@/components/token-card";
import { POPS } from "@/lib/pops";

const TRAITS = [
  { label: "Playful", kit: "FUN BRINGS PEOPLE TOGETHER", color: "#D94CFF" },
  { label: "Fast", kit: "IDEAS TO MARKET, FASTER", color: "#1E8BFF" },
  { label: "Confident", kit: "BUILT FOR A BIGGER TOMORROW", color: "#6F3BFF" },
  { label: "On-chain", kit: "REAL OWNERSHIP. REAL OPPORTUNITY.", color: "#FF8A4C" },
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
        <div className="hero-wash" />
        <div className="orb -left-28 -top-32 h-[34rem] w-[34rem] bg-purple/22 dark:bg-purple/28" />
        <div className="orb -right-24 top-4 h-[30rem] w-[30rem] bg-pink/16 dark:bg-pink/20" />
        <div className="orb bottom-0 left-[22%] h-[22rem] w-[22rem] bg-blue/14 dark:bg-blue/18" />

        <div className="page-wrap relative flex flex-col items-center pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
          <Logo size={46} wordmarkClassName="text-[1.7rem] sm:text-[1.95rem]" />

          <h1 className="mt-5 max-w-3xl font-display text-5xl font-extrabold leading-[0.94] tracking-tight text-midnight dark:text-cloud sm:mt-6 sm:text-7xl">
            Ideas pop here.
          </h1>

          <p className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg">
            Launch, collect, and be part of what&apos;s next.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <Button href="/launch" size="lg" className="w-full sm:min-w-52 sm:w-auto">
              <PopperMark size={20} className="text-white dark:text-white" />
              Launch Token
              <ArrowIcon />
            </Button>
            <Button href="/explore" variant="secondary" size="lg" className="w-full sm:min-w-52 sm:w-auto">
              Explore Pops
              <ArrowIcon />
            </Button>
          </div>

          <div className="mt-20 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TRAITS.map((trait) => (
              <article
                key={trait.label}
                className="rounded-[22px] border border-border bg-card px-5 py-5 text-left shadow-[var(--shadow)]"
              >
                <p className="font-display text-lg font-extrabold tracking-tight">
                  <span
                    className="mr-2 inline-block h-2 w-2 rounded-full"
                    style={{ background: trait.color }}
                  />
                  {trait.label}
                </p>
                <p className="mt-2.5 font-display text-[11px] font-extrabold uppercase leading-snug tracking-[0.14em] text-muted">
                  {trait.kit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-wrap section pt-6 sm:pt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-purple">
              Live on the curve
            </p>
            <h2 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight">
              Pops mid-flight
            </h2>
          </div>
          <Button href="/explore" variant="secondary" size="sm">
            See all
            <ArrowIcon />
          </Button>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((pop) => (
            <TokenCard key={pop.id} pop={pop} />
          ))}
        </div>
      </section>

      <section className="page-wrap section pt-4">
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-orange">
          How a pop works
        </p>
        <h2 className="mt-1.5 max-w-lg font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          A more playful on-chain future.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <article
              key={step.n}
              className="rounded-[22px] border border-border bg-card p-6 shadow-[var(--shadow)]"
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
