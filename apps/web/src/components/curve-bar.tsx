import { cn } from "@/lib/cn";

export function CurveBar({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2.5 w-full overflow-hidden rounded-full bg-midnight/8 dark:bg-cloud/10",
        className,
      )}
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full cta-gradient transition-[width] duration-500"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
