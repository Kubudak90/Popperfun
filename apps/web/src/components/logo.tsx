import { cn } from "@/lib/cn";

type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
};

export function PopperMark({
  size = 40,
  className,
  gradientId = "popperBubble",
}: {
  size?: number;
  className?: string;
  gradientId?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={gradientId} x1="16" y1="10" x2="58" y2="60">
          <stop offset="0%" stopColor="#6F3BFF" />
          <stop offset="100%" stopColor="#1E8BFF" />
        </linearGradient>
      </defs>

      {/* Four colorful droplets bursting from the bubble */}
      <circle cx="17" cy="13" r="5.2" fill="#6F3BFF" />
      <circle cx="50" cy="9" r="5.6" fill="#D94CFF" />
      <circle cx="62" cy="30" r="5.2" fill="#FF8A4C" />
      <circle cx="11" cy="34" r="5" fill="#1E8BFF" />

      {/* Bubble lowercase p */}
      <path
        fill={`url(#${gradientId})`}
        fillRule="evenodd"
        d="M29 13c10.2 0 18.5 8 18.5 18.6 0 10.5-8.3 18.6-18.5 18.6h-3.6v12.2c0 2.4-2 4.1-4.5 4.1s-4.5-1.7-4.5-4.1V17.4C16.4 14.8 18.7 13 21.6 13H29Zm-3.6 9.6v17.6h3.4c5.4 0 9.6-4.1 9.6-8.8 0-4.6-4.2-8.8-9.6-8.8h-3.4Z"
      />
      <ellipse cx="28" cy="22.5" rx="5" ry="3.4" fill="white" fillOpacity="0.3" />
    </svg>
  );
}

export function Logo({ size = 36, withWordmark = true, className, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PopperMark size={size} gradientId="popperBubbleMark" />
      {withWordmark ? (
        <span
          className={cn(
            "font-display text-[1.35rem] font-extrabold leading-none tracking-tight text-foreground",
            wordmarkClassName,
          )}
        >
          popper
          <span className="text-purple">.fun</span>
        </span>
      ) : null}
    </span>
  );
}
