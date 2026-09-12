import type { Metadata } from "next";
import { LaunchForm } from "./launch-form";

export const metadata: Metadata = {
  title: "Launch Token",
  description: "Launch a fixed-supply Popper token against native USDC.",
};

export default function LaunchPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-pink">
          Create
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Launch a pop
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Fixed supply. Native USDC quote. Immutable graduation line. v1 speaks
          one curve family — constant product — and nothing else.
        </p>
        <div className="mt-8 rounded-[32px] border border-border bg-card p-5 shadow-[var(--shadow)] sm:p-8">
          <LaunchForm />
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-[28px] border border-border bg-card p-6">
          <p className="font-display text-sm font-extrabold text-purple">Economics lock at create</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li>1,000,000,000 token supply</li>
            <li>800M on the curve · 200M reserved for graduation</li>
            <li>Virtual reserve 30,000 native USDC</li>
            <li>Quote asset: native USDC only</li>
          </ul>
        </div>
        <div className="rounded-[28px] bg-midnight p-6 text-cloud">
          <p className="font-display text-2xl font-extrabold">Ideas pop here.</p>
          <p className="mt-2 text-sm leading-relaxed text-cloud/70">
            You&apos;re not deploying a Uniswap V4 pool yet. Graduation hits a
            mock venue until real V4 addresses exist. No invented hooks.
          </p>
        </div>
      </aside>
    </div>
  );
}
