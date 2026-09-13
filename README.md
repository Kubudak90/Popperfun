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
config             official Arc Testnet params (V4 left null)
docs               architecture + unit rule
```

Connect on Arc Testnet and `/launch` sends `ArcLaunchFactory.launch` to the live prototype factory. Buy/sell writes are not shipped yet.

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

Display type is Plus Jakarta Sans. Body is Inter. Logo is a bubble `p` with four droplets in the accent colors.

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

Copy [apps/web/.env.example](apps/web/.env.example) to `apps/web/.env.local` if you need overrides. Defaults are **Arc Testnet** and the live prototype factory.

## Arc Testnet

Official params from [docs.arc.io](https://docs.arc.io/arc/references/rpc-endpoints) / [add Arc to a wallet](https://docs.arc.io/integrate/wallets/add-arc-to-a-wallet). This is a **prototype** — not production. Graduation uses `MockGraduationVenue` until official Uniswap V4 addresses exist on Arc. Do not invent V4 pool, hook, or manager addresses.

| Field | Value |
| --- | --- |
| Name | Arc Testnet |
| Chain ID | `5042002` (`0x4CEF52`) |
| RPC HTTP | `https://rpc.testnet.arc.io` |
| RPC WS | `wss://rpc.testnet.arc.io` |
| Explorer | `https://testnet.arcscan.app` |
| Native gas | USDC, **18 decimals** (`msg.value` / native18) |
| ERC-20 USDC interface | `0x3600000000000000000000000000000000000000` (6 decimals) — **not** a second launch quote route |
| Faucet | https://faucet.circle.com |
| Factory (live prototype) | [`0x3C63B1dD4224956F6D40dF57c9ceeCF7efC1d95e`](https://testnet.arcscan.app/address/0x3C63B1dD4224956F6D40dF57c9ceeCF7efC1d95e) |
| Venue | [`0xbd74765B48a525C41f62f9E26eBc5Fb628D5F18a`](https://testnet.arcscan.app/address/0xbd74765B48a525C41f62f9E26eBc5Fb628D5F18a) (`MockGraduationVenue`) |
| Uniswap V4 | UNVERIFIED / null |

### 1. Add the network to your wallet

In the app: **Connect Wallet → Add Arc Testnet**, or use the wrong-network banner. That sends official EIP-3085 `wallet_addEthereumChain` params (`0x4CEF52`, USDC/18, `rpc.testnet.arc.io`, ArcScan).

Manual add: chain `5042002`, RPC `https://rpc.testnet.arc.io`, symbol `USDC`, explorer `https://testnet.arcscan.app`.

### 2. Get gas

Request testnet USDC from [Circle's faucet](https://faucet.circle.com). On Arc, **gas is native USDC**.

### 3. Deploy the prototype (needs your key)

```bash
export PRIVATE_KEY=0x…          # never commit this
export RPC_URL=https://rpc.testnet.arc.io   # optional; this is the default
cd packages/contracts
pnpm deploy:arc-testnet
# or: make deploy-arc-testnet
```

The UI already points at the live factory. Redeploy only if you want your own instance, then override `NEXT_PUBLIC_FACTORY_ADDRESS`.

Without `PRIVATE_KEY` the script only checks RPC (`cast chain-id` / `cast block-number`) and dry-runs. It will not broadcast.

### 4. Launch from the UI

```bash
pnpm --filter web dev
```

Open [http://127.0.0.1:43127/launch](http://127.0.0.1:43127/launch), connect on Arc Testnet (add the chain if needed), submit. `ArcLaunchFactory.launch` takes **usd6 atoms** (`69000` → `69000000000`) against [`0x3C63B1dD4224956F6D40dF57c9ceeCF7efC1d95e`](https://testnet.arcscan.app/address/0x3C63B1dD4224956F6D40dF57c9ceeCF7efC1d95e). Success shows curve + token + an [ArcScan](https://testnet.arcscan.app) tx link and `/pop/0x<curve>`.

If you point env at a zero factory, the form stays fillable and explains the deploy path. It never fakes an on-chain success.

## Local Anvil (optional)

For fork-free contract work, set `NEXT_PUBLIC_CHAIN_ID=31337` and `NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545`.

```bash
anvil
cd packages/contracts
pnpm deploy:anvil
```

Import an Anvil account from the Anvil banner (local only). Same `launch(name, symbol, usd6)` path.

## Deploy on Vercel

Root Directory is `apps/web` (`vercel.json`). Next.js is detected there; `@popper/sdk` stays a workspace package. Public Arc Testnet env is baked into `vercel.json` (no private keys):

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_CHAIN_ID` | `5042002` |
| `NEXT_PUBLIC_RPC_URL` | `https://rpc.testnet.arc.io` |
| `NEXT_PUBLIC_FACTORY_ADDRESS` | `0x3C63B1dD4224956F6D40dF57c9ceeCF7efC1d95e` |
| `NEXT_PUBLIC_EXPLORER_TX_URL` | `https://testnet.arcscan.app/tx` |

After `vercel login`, or from a claimed temporary deploy:

```bash
pnpm dlx vercel env add NEXT_PUBLIC_CHAIN_ID production,preview,development --value 5042002 --yes
pnpm dlx vercel env add NEXT_PUBLIC_RPC_URL production,preview,development --value https://rpc.testnet.arc.io --yes
pnpm dlx vercel env add NEXT_PUBLIC_FACTORY_ADDRESS production,preview,development --value 0x3C63B1dD4224956F6D40dF57c9ceeCF7efC1d95e --yes
pnpm dlx vercel env add NEXT_PUBLIC_EXPLORER_TX_URL production,preview,development --value https://testnet.arcscan.app/tx --yes
pnpm dlx vercel deploy --prod --yes
```

If you import the monorepo in the dashboard, set **Root Directory** to `apps/web` and add the same four `NEXT_PUBLIC_*` values. Do not add contract private keys.

Anonymous CLI deploys expire unless you claim them. After claiming, keep those env vars on the Vercel project (Production + Preview + Development). They are public RPC/factory values only.

## Pages

| Route | What you get |
| --- | --- |
| `/` | Hero, brand traits, featured pops |
| `/explore` | Grid of mock pops + empty search state |
| `/launch` | Launch form + usd6 → factory `launch` when wired |
| `/pop/[id]` | Catalog pops, or live curve reads at `/pop/0x…` |

## v1 constraints

- One quote asset: native USDC
- One curve family: constant-product
- Immutable launch economics
- Mock graduation venue only — no invented Uniswap V4 addresses
