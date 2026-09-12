#!/usr/bin/env bash
# Deploy the Popper prototype to official Arc Testnet.
# Never prints PRIVATE_KEY. Does not broadcast unless PRIVATE_KEY is set.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

RPC_URL="${RPC_URL:-https://rpc.testnet.arc.io}"
CAST="${CAST:-cast}"
FORGE="${FORGE:-forge}"

if ! command -v "$CAST" >/dev/null 2>&1; then
  if [[ -x "$HOME/.foundry/bin/cast" ]]; then
    CAST="$HOME/.foundry/bin/cast"
    FORGE="$HOME/.foundry/bin/forge"
  fi
fi

echo "Arc Testnet RPC: $RPC_URL"
echo "Read-only checks (docs.arc.io: chain id 5042002)…"
CHAIN_ID="$("$CAST" chain-id --rpc-url "$RPC_URL")"
BLOCK="$("$CAST" block-number --rpc-url "$RPC_URL")"
echo "  chain-id     $CHAIN_ID"
echo "  block-number $BLOCK"

if [[ "$CHAIN_ID" != "5042002" ]]; then
  echo "Unexpected chain id (want 5042002). Aborting."
  exit 1
fi

if [[ -z "${PRIVATE_KEY:-}" ]]; then
  echo
  echo "PRIVATE_KEY is not set — not broadcasting."
  echo "Get testnet USDC gas from https://faucet.circle.com"
  echo "Then:"
  echo "  export PRIVATE_KEY=0x…"
  echo "  export RPC_URL=$RPC_URL"
  echo "  pnpm --filter @popper/contracts deploy:arc-testnet"
  echo
  echo "Dry-run (simulate, no broadcast):"
  "$FORGE" script script/Deploy.s.sol:DeployScript --rpc-url "$RPC_URL"
  exit 1
fi

echo "PRIVATE_KEY is set (value not printed). Broadcasting Deploy.s.sol…"
"$FORGE" script script/Deploy.s.sol:DeployScript \
  --rpc-url "$RPC_URL" \
  --broadcast \
  --private-key "$PRIVATE_KEY"
echo
echo "Copy the printed factory address into apps/web/.env.local as NEXT_PUBLIC_FACTORY_ADDRESS."
echo "Graduation venue is MockGraduationVenue — Uniswap V4 on Arc is UNVERIFIED."
