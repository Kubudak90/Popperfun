import { Button } from "@/components/button";
import { ArrowIcon } from "@/components/icons";
import { PopperMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-wash opacity-70" />
      <div className="page-wrap relative flex max-w-xl flex-col items-center py-24 text-center sm:py-28">
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-orange">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          This pop never happened.
        </h1>
        <p className="mt-3 max-w-md text-muted">
          That route is empty. Explore live pops, or launch the one you meant.
        </p>
        <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Button href="/launch">
            <PopperMark size={18} className="text-white dark:text-white" />
            Launch Token
            <ArrowIcon />
          </Button>
          <Button href="/explore" variant="secondary">
            Explore Pops
            <ArrowIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}
