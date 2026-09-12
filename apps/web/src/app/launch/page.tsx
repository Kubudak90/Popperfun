import type { Metadata } from "next";
import { LaunchForm } from "./launch-form";

export const metadata: Metadata = {
  title: "Launch Token",
  description: "Launch a fixed-supply Popper token against native USDC.",
};

export default function LaunchPage() {
  return (
    <div className="page-wrap grid gap-10 py-12 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
      <div>
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-pink">
          Create
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          Launch a pop
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          Launch, collect, and be part of what&apos;s next. Fixed supply, native
          USDC, immutable graduation — one curve family.
        </p>
        <div className="mt-8 rounded-[22px] border border-border bg-card p-5 shadow-[var(--shadow)] sm:p-8">
          <LaunchForm />
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-[22px] border border-border bg-card p-6">
          <p className="font-display text-sm font-extrabold text-purple">Economics lock at create</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            <li>1,000,000,000 token supply</li>
            <li>800M on the curve · 200M reserved for graduation</li>
            <li>Virtual reserve 30,000 native USDC</li>
            <li>Quote asset: native USDC only</li>
          </ul>
        </div>
        <div className="rounded-[22px] bg-midnight p-6 text-cloud">
          <p className="font-display text-2xl font-extrabold">Ideas pop here.</p>
          <p className="mt-2 text-sm leading-relaxed text-cloud/70">
            A more playful on-chain future. Graduation hits a mock venue until
            real V4 addresses exist.
          </p>
        </div>
      </aside>
    </div>
  );
}
