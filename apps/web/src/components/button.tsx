import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "cta-gradient text-white shadow-[0_12px_28px_rgba(111,59,255,0.28)] hover:brightness-110",
  secondary:
    "border border-midnight/12 bg-white text-midnight hover:border-midnight/22 dark:border-cloud/15 dark:bg-cloud/6 dark:text-cloud dark:hover:bg-cloud/10",
  ghost:
    "border border-midnight/8 bg-white/70 text-midnight hover:border-purple/30 hover:text-purple dark:border-cloud/10 dark:bg-cloud/5 dark:text-cloud",
  danger: "bg-orange text-white hover:brightness-110",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-[17px]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonProps = Common &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = Common & {
  href: string;
  onClick?: () => void;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps | LinkButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-display font-extrabold tracking-tight transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, onClick } = props;
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
