import type { Metadata } from "next";
import { ExploreGrid } from "./explore-grid";

export const metadata: Metadata = {
  title: "Explore Pops",
  description: "Browse live, new, and hot pops trading on the Popper bonding curve.",
};

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-purple">
        Explore
      </p>
      <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
        What&apos;s popping
      </h1>
      <p className="mt-3 max-w-2xl text-muted">
        Fixed-supply tokens on a constant-product curve, quoted in native USDC.
        Catch them before they graduate.
      </p>
      <div className="mt-8">
        <ExploreGrid />
      </div>
    </div>
  );
}
