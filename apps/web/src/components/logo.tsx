import { cn } from "@/lib/cn";

type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
};

/** Bubble lowercase p with four droplets popping from the top-right. */
export function PopperMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-midnight dark:text-cloud", className)}
      aria-hidden
    >
      {/* Four colorful droplets bursting from the top-right of the bowl */}
      <ellipse cx="49" cy="18" rx="4.4" ry="6" transform="rotate(-34 49 18)" fill="#1E8BFF" />
      <ellipse cx="58.5" cy="10" rx="4.8" ry="6.4" transform="rotate(-16 58.5 10)" fill="#6F3BFF" />
      <ellipse cx="69" cy="7" rx="4.6" ry="6.2" transform="rotate(-4 69 7)" fill="#D94CFF" />
      <ellipse cx="73.5" cy="19" rx="5" ry="6.6" transform="rotate(24 73.5 19)" fill="#FF8A4C" />

      {/* Liquid lowercase p with an open bowl */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M23 10.4c2.6-1.3 9.4-1.8 15 .6 7.8 3.2 13 10.8 13 19.4 0 10-7.2 17.8-17.4 17.8H28.2V72c0 2.7-2.3 4.6-5.1 4.6S18 74.7 18 72V15.2C18 12.8 20.4 11.2 23 10.4ZM29.2 23.2v16.2h6c5.6 0 9.4-3.8 9.4-8.1 0-4.2-3.8-8.1-9.4-8.1h-6Z"
      />
      <ellipse cx="31" cy="24" rx="5" ry="3" fill="white" fillOpacity="0.28" />
    </svg>
  );
}

export function Logo({ size = 36, withWordmark = true, className, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PopperMark size={size} className="logo-mark" />
      {withWordmark ? (
        <span
          className={cn(
            "font-display text-[1.35rem] font-extrabold leading-none tracking-tight text-midnight dark:text-cloud",
            wordmarkClassName,
          )}
        >
          Popper.fun
        </span>
      ) : null}
    </span>
  );
}
