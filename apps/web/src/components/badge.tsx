import { FlameIcon, StarIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import type { PopBadge } from "@/lib/pops";

const styles: Record<PopBadge, string> = {
  LIVE: "bg-[#22C55E]/14 text-[#22C55E]",
  NEW: "bg-purple/12 text-purple",
  HOT: "bg-orange/16 text-orange",
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-extrabold tracking-wider",
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
      {kind === "NEW" ? <StarIcon /> : null}
      {kind === "HOT" ? <FlameIcon /> : null}
      {kind}
    </span>
  );
}
