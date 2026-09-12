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

The UI runs without a wallet. Connect and `/launch` become on-chain when a factory address and RPC are set. Zero addresses mean not wired — the app will not fake a successful launch. Buy/sell writes are not shipped yet.

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

Copy [apps/web/.env.example](apps/web/.env.example) to `apps/web/.env.local` for local Anvil. The UI runs with a zero factory.

## Local wallet + launch

Needs [Foundry](https://book.getfoundry.sh/getting-started/installation) (`anvil`, `forge`, `cast`) and a browser wallet (Rabby / MetaMask). Connect uses the injected connector so `next build` stays free of unused Coinbase/WalletConnect optional deps.

1. Start Anvil (native USDC semantics: 18-decimal value):

```bash
anvil
```

2. Deploy the prototype. The first Anvil account is unlocked — this command does not put a private key in the repo:

```bash
cd packages/contracts
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --unlocked \
  --sender 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Or: `pnpm --filter @popper/contracts deploy:anvil`

3. Copy the printed `factory` address into `apps/web/.env.local`:

```bash
cp apps/web/.env.example apps/web/.env.local
```

```
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_FACTORY_ADDRESS=0x<factory from the deploy log>
```

4. Point the wallet at Anvil: chain id `31337`, RPC `http://127.0.0.1:8545`, currency USDC / 18 decimals. Import an Anvil account from the Anvil banner (local only).

5. Restart the web app so Next picks up env:

```bash
pnpm --filter web dev
```

6. Open [http://127.0.0.1:43127/launch](http://127.0.0.1:43127/launch), connect, submit. The factory function is `launch(name, symbol, graduationThresholdUsd6)` — the form sends **usd6 atoms** (`69000` → `69000000000`). Success shows curve + token + tx hash and links to `/pop/0x<curve>`.

Smoke the same path without a browser:

```bash
cast send $FACTORY "launch(string,string,uint256)" "Cloudkitty" "CKTY" 69000000000 \
  --rpc-url http://127.0.0.1:8545 \
  --unlocked \
  --from 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

If `NEXT_PUBLIC_FACTORY_ADDRESS` is missing or zero, `/launch` stays fillable and the submit path explains this deploy flow. It never reports a fake on-chain success.

## Deploy on Vercel

`vercel.json` at the repo root builds the web app (`pnpm --filter web build`).

Anonymous CLI deploy (claimable, then yours):

```bash
# from a standalone web+sdk slice, or after `vercel login`
pnpm dlx vercel deploy --prod --yes
```

If you import this monorepo into the Vercel dashboard, set **Root Directory** to `apps/web` so Next.js is detected. `@popper/sdk` stays a workspace package.

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
