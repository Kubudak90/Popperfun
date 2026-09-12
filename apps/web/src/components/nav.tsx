"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/button";
import { ConnectWallet } from "@/components/connect-wallet";
import { ArrowIcon } from "@/components/icons";
import { Logo, PopperMark } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/launch", label: "Launch" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[var(--nav)] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="shrink-0" onClick={() => setOpen(false)}>
          <Logo size={36} />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 font-display text-sm font-bold transition",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "bg-purple/10 text-purple"
                  : "text-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden sm:block">
            <ConnectWallet />
          </div>
          <Button href="/launch" size="sm" className="hidden sm:inline-flex">
            <PopperMark size={16} className="text-white dark:text-white" />
            Launch Token
            <ArrowIcon />
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="flex w-4 flex-col gap-1">
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-full bg-foreground" />
              <span className="h-0.5 w-3 bg-foreground" />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2.5 font-display font-bold hover:bg-card"
              >
                {link.label}
              </Link>
            ))}
            <ConnectWallet />
            <Button href="/launch" onClick={() => setOpen(false)}>
              <PopperMark size={16} className="text-white dark:text-white" />
              Launch Token
              <ArrowIcon />
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
