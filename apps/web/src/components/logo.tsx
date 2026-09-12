import { cn } from "@/lib/cn";

type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
};

export function PopperMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="popperBubble" x1="12" y1="8" x2="54" y2="52">
          <stop offset="0%" stopColor="#6F3BFF" />
          <stop offset="100%" stopColor="#1E8BFF" />
        </linearGradient>
      </defs>

      {/* Four colorful droplets */}
      <path
        d="M16.2 10.4c2.6-3.4 7.2-3.2 9.2.4 1.4 2.6.3 5.8-2.4 7.1-2.8 1.3-6.1.1-7.4-2.6-1.2-2.4-.7-5.1.6-4.9z"
        fill="#6F3BFF"
      />
      <path
        d="M42.6 6.8c3.2-2.4 7.6-.8 8.8 2.8 1 2.8-.8 5.8-3.8 6.6-3 .8-6.1-1.1-6.8-4-0.7-2.6.2-4.4 1.8-5.4z"
        fill="#D94CFF"
      />
      <path
        d="M53.4 28.2c3.6.2 5.8 4 4.6 7.4-1.1 3.1-4.7 4.6-7.6 3.2-2.8-1.4-3.6-5-1.8-7.4 1.2-1.6 3-3.3 4.8-3.2z"
        fill="#FF8A4C"
      />
      <path
        d="M8.8 32.6c2.8-2.2 6.8-1.2 8.2 2.1 1.3 3.1-.6 6.5-4 7.2-3.2.7-6.3-1.8-6.6-5.1-.2-2.6.8-3.2 2.4-4.2z"
        fill="#1E8BFF"
      />

      {/* Bubble lowercase p */}
      <path
        fill="url(#popperBubble)"
        fillRule="evenodd"
        d="M26.2 12.2c8.8 0 16 7 16 16.2 0 9.1-7.2 16.2-16 16.2h-3.4v11.2c0 2.1-1.8 3.6-3.9 3.6-2.2 0-3.9-1.5-3.9-3.6V16.1c0-2.2 1.9-3.9 4.2-3.9h3.1zm-3.4 8.6v15.2h3.2c4.7 0 8.3-3.6 8.3-7.6 0-4.1-3.6-7.6-8.3-7.6h-3.2z"
      />
      <ellipse cx="24.8" cy="20.4" rx="4.2" ry="3.1" fill="white" fillOpacity="0.28" />
    </svg>
  );
}

export function Logo({ size = 36, withWordmark = true, className, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PopperMark size={size} />
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
