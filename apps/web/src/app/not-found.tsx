import { Button } from "@/components/button";
import { ArrowIcon } from "@/components/icons";
import { PopperMark } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="font-display text-xs font-extrabold uppercase tracking-[0.18em] text-orange">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight">
        This pop never happened.
      </h1>
      <p className="mt-3 text-muted">
        That route is empty. Explore live pops, or launch the one you meant.
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href="/explore" variant="secondary">
          Explore Pops
          <ArrowIcon />
        </Button>
        <Button href="/launch">
          <PopperMark size={18} className="text-white dark:text-white" />
          Launch Token
          <ArrowIcon />
        </Button>
      </div>
    </div>
  );
}
