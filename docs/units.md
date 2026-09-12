# Unit rule

| Label | Decimals | Where it lives |
| --- | --- | --- |
| `usd6` | 6 | Launch form, factory argument, display |
| `native18` | 18 | Curve reserves, `msg.value`, venue |

```
native18 = usd6 * 1e12
```

Examples (`$69,000` graduation line):

```
usd6     = 69000000000
native18 = 69000000000000000000000
```

SDK:

```ts
import { parseUsdToUsd6, usd6ToNative18, formatUsd6 } from "@popper/sdk";

const usd6 = parseUsdToUsd6("69000");
const native18 = usd6ToNative18(usd6);
formatUsd6(usd6); // "69,000.00"
```

Solidity:

```solidity
uint256 thresholdNative18 = ArcUsd.usd6ToNative18(graduationThresholdUsd6);
```

Never add a `usd6` value to a `native18` value. The type brands on the TypeScript side exist to make that a compile error when you keep the wrappers.
