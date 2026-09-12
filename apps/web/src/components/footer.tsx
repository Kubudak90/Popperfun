import Link from "next/link";
import { Logo } from "@/components/logo";

const WORDS = [
  { word: "POP", color: "#D94CFF" },
  { word: "CREATE", color: "#6F3BFF" },
  { word: "LAUNCH", color: "#1E8BFF" },
  { word: "BELONG", color: "#FF8A4C" },
] as const;

export function Footer() {
  return (
    <footer className="mt-16 bg-midnight text-cloud">
      <div className="page-wrap grid gap-16 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <div>
            {WORDS.map((item) => (
              <p
                key={item.word}
                className="font-display text-5xl font-extrabold leading-[0.88] tracking-tight sm:text-6xl"
                style={{ color: item.color }}
              >
                {item.word}
              </p>
            ))}
          </div>
          <p className="mt-10 max-w-sm text-base leading-relaxed text-cloud/68">
            A more playful on-chain future.
          </p>
        </div>

        <div className="lg:text-right">
          <Logo size={32} wordmarkClassName="text-cloud" />
          <p className="mt-4 text-sm text-cloud/50">
            Launch, collect, and be part of what&apos;s next.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-cloud/70 lg:justify-end">
            <Link href="/explore" className="transition hover:text-cloud">
              Explore
            </Link>
            <Link href="/launch" className="transition hover:text-cloud">
              Launch
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
