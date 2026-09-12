"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { TokenCard } from "@/components/token-card";
import { POPS, type PopBadge } from "@/lib/pops";

const FILTERS: Array<"ALL" | PopBadge> = ["ALL", "LIVE", "NEW", "HOT"];

export function ExploreGrid() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");

  const pops = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POPS.filter((pop) => {
      const matchesFilter = filter === "ALL" || pop.badge === filter;
      const matchesQuery =
        !q ||
        pop.name.toLowerCase().includes(q) ||
        pop.symbol.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pops by name or ticker"
          aria-label="Search pops"
          className="sm:max-w-md"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-3.5 py-2 font-display text-sm font-extrabold ring-1 transition ${
                filter === item
                  ? "bg-purple text-white ring-purple"
                  : "bg-card text-muted ring-border hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {pops.length === 0 ? (
        <div className="mt-10 rounded-[32px] border border-dashed border-border bg-card px-6 py-16 text-center">
          <p className="font-display text-2xl font-extrabold">Nothing popped yet.</p>
          <p className="mx-auto mt-2 max-w-md text-muted">
            No pops match that search. Try another ticker — or be the one who
            launches it.
          </p>
          <div className="mt-6 flex justify-center">
            <Button href="/launch">Launch Token</Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pops.map((pop) => (
            <TokenCard key={pop.id} pop={pop} />
          ))}
        </div>
      )}
    </div>
  );
}
