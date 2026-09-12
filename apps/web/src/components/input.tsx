import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const fieldClass =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] text-foreground outline-none transition focus:border-purple focus:ring-4 focus:ring-purple/15 placeholder:text-muted/70";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldClass, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldClass, "min-h-28 resize-y", className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-display text-sm font-extrabold">{label}</span>
      {children}
      {error ? (
        <span className="block text-sm text-[#e06a2c]">{error}</span>
      ) : hint ? (
        <span className="block text-sm text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
