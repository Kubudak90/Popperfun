# Decisions

## Product name vs contract prefix

UI, README, and docs say **Popper.fun**. Solidity keeps `Arc*` names from the local-dev kit so comments about Arc native USDC and unit conversion stay searchable.

## Units are labeled or they don't ship

Human config (graduation threshold) is **usd6**. Curve reserves, `msg.value`, and venue transfers are **native18**. Helpers in `@popper/sdk` and `ArcUsd` are the only conversion path. Unlabeled `uint256` / `bigint` values are treated as a bug.

## One quote, one curve, immutable economics

v1 allows a single quote asset (native USDC) and a single curve family (constant product). Virtual reserves and supply splits are factory constants. A launch cannot change its threshold or curve after create.

## No invented Uniswap V4 addresses

Graduation targets `MockGraduationVenue`. `config/arc.testnet.json` uses zero placeholders. Do not add unofficial pool or hook addresses.

## UI-first slice

The web app is usable without a wallet, RPC, or deployed factory. Stubs are labeled in the launch form and trade panel so the next wiring step is obvious.

## Brand tokens are closed

Colors come from the brand kit only: Midnight Ink, Pop Purple, Bubble Pink, Burst Orange, Electric Blue, Soft Cloud, plus the specified LIVE green. No extra palette.
