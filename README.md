# Popper.fun

A playful Arc-native USDC token launchpad. Launch a fixed-supply token against native USDC, trade it on a bonding curve, then graduate to Uniswap V4.

**Ideas pop here.**

## What's in this repo

pnpm workspace:

```
apps/web           Next.js 15 App Router (the product)
apps/indexer       Stub TypeScript worker
packages/sdk       usd6 / native18 helpers
packages/contracts Foundry prototype (disposable Arc launchpad)
config             arc.testnet.json stub
docs               architecture + unit rule
```

The UI is the first slice. Wallet connect, launch submit, and buy/sell are clearly stubbed — no secrets and no live RPC required.

## Brand

| Token | Hex |
| --- | --- |
| Midnight Ink | `#101426` |
| Pop Purple | `#6F3BFF` |
| Bubble Pink | `#D94CFF` |
| Burst Orange | `#FF8A4C` |
| Electric Blue | `#1E8BFF` |
| Soft Cloud | `#F6F7FB` |

Primary CTA is a pill, Pop Purple → Electric Blue, labeled **Launch Token**. Secondary is a white/outline pill: **Explore Pops**. Badges: **LIVE** (green), **NEW** (purple), **HOT** (orange).

Display type is Nunito. Body is Inter. Logo is a bubble `p` with four droplets in the accent colors.

Footer words: **POP / CREATE / LAUNCH / BELONG**.

## Unit rule

Human config is **usd6** (6 decimals). Curve accounting is **native18** (18 decimals). Never mix unlabeled integers.

```
native18 = usd6 × 1e12
```

`@popper/sdk` exports `formatUsd6`, `parseUsdToUsd6`, and `usd6ToNative18`. The launch page uses them for a live unit-sanity panel. See [docs/units.md](docs/units.md).

## Run locally

Needs Node 22+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm --filter web dev
```

App: [http://127.0.0.1:43127](http://127.0.0.1:43127)

```bash
pnpm --filter web typecheck
pnpm --filter web build
```

Indexer stub:

```bash
pnpm --filter indexer dev
```

Contracts (optional, needs [Foundry](https://book.getfoundry.sh/getting-started/installation)):

```bash
cd packages/contracts
forge install foundry-rs/forge-std --no-commit
forge test -vv
```

Copy [.env.example](.env.example) if you later add an Arc RPC. The UI runs without it.

## Pages

| Route | What you get |
| --- | --- |
| `/` | Hero, brand traits, featured pops |
| `/explore` | Grid of mock pops + empty search state |
| `/launch` | Launch form + usd6 ↔ native18 sanity |
| `/pop/[id]` | Curve progress, buy/sell stub, graduation status |

## v1 constraints

- One quote asset: native USDC
- One curve family: constant-product
- Immutable launch economics
- Mock graduation venue only — no invented Uniswap V4 addresses
