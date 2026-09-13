# Architecture

Popper.fun is an Arc-native token launchpad. Product name is **Popper**. On-chain prototypes keep **Arc** prefixes so unit comments and local-dev kit semantics stay obvious.

```
apps/web        Next.js 15 App Router — landing, explore, launch, token
apps/indexer    Stub worker (no RPC yet)
packages/sdk    Labeled usd6 / native18 helpers
packages/contracts  Foundry prototype (disposable)
config          Official Arc Testnet (5042002). Live prototype factory; V4 left null.
```

## Product flow

1. **Launch** — creator submits name, symbol, description, and a graduation threshold in human USDC (`usd6`). Factory converts to `native18` and deploys an immutable curve + fixed-supply token.
2. **Trade** — buyers and sellers trade against native USDC on a constant-product curve (`(virtualUsd + realUsd) * (virtualTokens - sold) = k`).
3. **Graduate** — two phases: `prepareGraduation` locks the curve, `finalizeGraduation` sends raised native USDC plus the reserved token inventory to `MockGraduationVenue`.

v1 does not invent Uniswap V4 pool, hook, or manager addresses. The venue is a mock until real ones exist.

## Web

The UI talks to mock catalog pops and, when configured, to a live factory.

Wallet connect uses wagmi v2 (injected). The default chain is official Arc Testnet (`5042002`). `/launch` sends `ArcLaunchFactory.launch(name, symbol, usd6)` when `NEXT_PUBLIC_FACTORY_ADDRESS` is a non-zero address. Zero / missing factory keeps the form fillable and never fakes a successful launch. Anvil is opt-in via env.

Buy/sell writes are not wired yet. On-chain `/pop/0x…` pages read curve reserves and quotes.

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

Placeholder loop. Intended to follow `PopLaunched`, `Buy`, `Sell`, and graduation events once a factory is deployed to Arc Testnet and set in env.
