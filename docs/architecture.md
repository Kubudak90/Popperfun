# Architecture

Popper.fun is an Arc-native token launchpad. Product name is **Popper**. On-chain prototypes keep **Arc** prefixes so unit comments and local-dev kit semantics stay obvious.

```
apps/web        Next.js 15 App Router — landing, explore, launch, token
apps/indexer    Stub worker (no RPC yet)
packages/sdk    Labeled usd6 / native18 helpers
packages/contracts  Foundry prototype (disposable)
config          Arc testnet stub (zero addresses only)
```

## Product flow

1. **Launch** — creator submits name, symbol, description, and a graduation threshold in human USDC (`usd6`). Factory converts to `native18` and deploys an immutable curve + fixed-supply token.
2. **Trade** — buyers and sellers trade against native USDC on a constant-product curve (`(virtualUsd + realUsd) * (virtualTokens - sold) = k`).
3. **Graduate** — two phases: `prepareGraduation` locks the curve, `finalizeGraduation` sends raised native USDC plus the reserved token inventory to `MockGraduationVenue`.

v1 does not invent Uniswap V4 pool, hook, or manager addresses. The venue is a mock until real ones exist.

## Web

The UI is the Phase 1 deliverable. Pages talk to mock pop data. The launch form is the only place that already calls `@popper/sdk` so unit conversion is visible before a wallet is wired.

Wallet connect is a local stub (`0xPop9eR…`). Submit / buy / sell show explicit stub copy instead of sending transactions.

## Contracts (prototype)

| Contract | Role |
| --- | --- |
| `ArcUsd` | `usd6 ↔ native18` |
| `ArcLauncherToken` | Fixed-supply ERC-20, minted to the curve |
| `ArcBondingCurve` | Constant-product, native USDC `msg.value` |
| `ArcLaunchFactory` | Creates pops with shared v1 economics |
| `MockGraduationVenue` | Receives migrated liquidity |

Shared immutable economics (factory constants):

- Supply `1_000_000_000e18`
- Virtual native USDC `30_000e18`
- Virtual tokens `800_000_000e18`
- Graduation token reserve `200_000_000e18`

## Indexer

Placeholder loop. Intended to follow `PopLaunched`, `Buy`, `Sell`, and graduation events once `config/arc.testnet.json` has a real RPC and factory.
