import Link from "next/link";
import { Logo } from "@/components/logo";

const WORDS = ["POP", "CREATE", "LAUNCH", "BELONG"] as const;

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-midnight text-cloud">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WORDS.map((word, index) => (
            <p
              key={word}
              className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
              style={{
                color: ["#D94CFF", "#6F3BFF", "#1E8BFF", "#FF8A4C"][index],
              }}
            >
              {word}
            </p>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo
              size={32}
              wordmarkClassName="text-cloud"
            />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cloud/70">
              Launch, collect, and be part of what&apos;s next. A more playful
              on-chain future — Arc-native, quoted in USDC.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-cloud/70">
            <Link href="/explore" className="hover:text-cloud">
              Explore
            </Link>
            <Link href="/launch" className="hover:text-cloud">
              Launch
            </Link>
            <span className="text-cloud/40">Arc testnet stub</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
