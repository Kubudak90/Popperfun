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
    <footer className="mt-20 bg-midnight text-cloud">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-end">
        <div>
          {WORDS.map((item) => (
            <p
              key={item.word}
              className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl"
              style={{ color: item.color }}
            >
              {item.word}
            </p>
          ))}
          <p className="mt-6 max-w-sm text-base text-cloud/70">
            A more playful on-chain future.
          </p>
        </div>

        <div className="lg:text-right">
          <Logo size={34} wordmarkClassName="text-cloud" />
          <p className="mt-4 text-sm text-cloud/55">
            Launch, collect, and be part of what&apos;s next.
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cloud/70 lg:justify-end">
            <Link href="/explore" className="hover:text-cloud">
              Explore
            </Link>
            <Link href="/launch" className="hover:text-cloud">
              Launch
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
