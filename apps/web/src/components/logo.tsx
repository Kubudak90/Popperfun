import { cn } from "@/lib/cn";

type LogoProps = {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClassName?: string;
};

const DROPLETS = (
  <>
    {/* Burst order: Electric Blue → Pop Purple → Bubble Pink → Burst Orange */}
    <path
      fill="#1E8BFF"
      d="M48.8 15.6c-1.2 3.8 1.6 7.6 5.4 7.4 3.6-.2 6.2-3.8 5-7.2-1.4-3.8-7.8-5.2-10.4-.2Z"
    />
    <path
      fill="#6F3BFF"
      d="M60.2 6.4c-.2 3.8 3.2 6.8 6.8 6.2 3.4-.6 5.4-4.4 3.8-7.4C69 2 63.2 1.8 60.2 6.4Z"
    />
    <path
      fill="#D94CFF"
      d="M71.4 5.8c.8 3.6 4.6 5.8 7.8 4.4 3-1.2 4.2-5 2.2-7.6C79.2-.2 73.6 1.2 71.4 5.8Z"
    />
    <path
      fill="#FF8A4C"
      d="M73.2 17.6c2.4 3.2 6.8 3.6 9 1 2.2-2.4 1.6-6.6-1.2-8.4-3-2-8.4.8-7.8 7.4Z"
    />
  </>
);

const LETTER_P = (
  <path
    fill="currentColor"
    fillRule="evenodd"
    d="M23.6 9.2c4.8-3.4 16.2-3.8 23.4 3.2 7.4 7.2 9 18.6 4.8 27.4-3.6 7.6-12.8 12.6-22 12.6h-3.4v19.4c0 3.2-3.2 5.6-6.2 5-2.6-.4-4.6-3-4.6-5.8V16.4c0-3.4 2.8-5 8-7.2Zm8 15v12.2h7.6c5.6 0 9-3.4 9-6.4 0-3.2-3.6-5.8-8.8-5.8H31.6Z"
  />
);

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
      {DROPLETS}
      {LETTER_P}
      <ellipse cx="32.2" cy="23.4" rx="5.2" ry="2.7" fill="white" fillOpacity="0.28" />
    </svg>
  );
}

export function Logo({ size = 34, withWordmark = true, className, wordmarkClassName }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PopperMark size={size} className="logo-mark" />
      {withWordmark ? (
        <span
          className={cn(
            "font-display text-[1.2rem] font-extrabold leading-none tracking-tight text-midnight dark:text-cloud",
            wordmarkClassName,
          )}
        >
          Popper.fun
        </span>
      ) : null}
    </span>
  );
}
