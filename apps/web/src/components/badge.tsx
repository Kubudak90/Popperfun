import { cn } from "@/lib/cn";
import type { PopBadge } from "@/lib/pops";

const styles: Record<PopBadge, string> = {
  LIVE: "bg-[#22C55E]/12 text-[#22C55E] ring-[#22C55E]/25",
  NEW: "bg-[#6F3BFF]/12 text-[#6F3BFF] ring-[#6F3BFF]/25",
  HOT: "bg-[#FF8A4C]/12 text-[#FF8A4C] ring-[#FF8A4C]/30",
};

export function Badge({
  kind,
  className,
}: {
  kind: PopBadge;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-display text-[11px] font-extrabold tracking-wider ring-1",
        styles[kind],
        className,
      )}
    >
      {kind === "LIVE" ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
        </span>
      ) : null}
      {kind}
    </span>
  );
}
