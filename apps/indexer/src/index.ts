/**
 * Popper.fun indexer stub.
 *
 * Intended to watch ArcLaunchFactory / ArcBondingCurve events on Arc
 * and project pop state (curve reserves, graduation) for the web app.
 * No RPC is wired in this slice — this worker only proves the package
 * boots and can import labeled usd6 / native18 helpers.
 */

import { formatUsd6, parseUsdToUsd6, usd6ToNative18 } from "@popper/sdk";

const POLL_MS = 15_000;

function tick(iteration: number) {
  const demoThresholdUsd6 = parseUsdToUsd6("69000");
  const demoThresholdNative18 = usd6ToNative18(demoThresholdUsd6);

  console.log(
    JSON.stringify({
      service: "popper-indexer",
      status: "stub",
      iteration,
      note: "Awaiting Arc RPC + factory address. No invented Uniswap V4 pools.",
      demoGraduation: {
        usd6: demoThresholdUsd6.toString(),
        usd6Formatted: formatUsd6(demoThresholdUsd6),
        native18: demoThresholdNative18.toString(),
      },
    }),
  );
}

tick(0);
const timer = setInterval(() => tick(1), POLL_MS);
timer.unref?.();

console.log(`popper indexer stub idle — polling every ${POLL_MS}ms (no RPC)`);
