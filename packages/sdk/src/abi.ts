/**
 * Minimal ABIs for the Popper Foundry prototype.
 * Generated against ArcLaunchFactory / ArcBondingCurve / ArcLauncherToken.
 */

export const launchFactoryAbi = [
  {
    type: "function",
    name: "launch",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "graduationThresholdUsd6", type: "uint256" },
    ],
    outputs: [
      { name: "curve", type: "address" },
      { name: "token", type: "address" },
    ],
  },
  {
    type: "function",
    name: "popCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "pops",
    stateMutability: "view",
    inputs: [{ name: "", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "curveOfToken",
    stateMutability: "view",
    inputs: [{ name: "", type: "address" }],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "venue",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "event",
    name: "PopLaunched",
    inputs: [
      { name: "curve", type: "address", indexed: true },
      { name: "token", type: "address", indexed: true },
      { name: "name", type: "string", indexed: false },
      { name: "symbol", type: "string", indexed: false },
      { name: "graduationThresholdUsd6", type: "uint256", indexed: false },
      { name: "graduationThresholdNative18", type: "uint256", indexed: false },
    ],
  },
] as const;

export const bondingCurveAbi = [
  {
    type: "function",
    name: "token",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "realNative18",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "graduationThresholdNative18",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "phase",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
  },
  {
    type: "function",
    name: "canGraduate",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    type: "function",
    name: "quoteBuy",
    stateMutability: "view",
    inputs: [{ name: "native18In", type: "uint256" }],
    outputs: [{ name: "tokensOut", type: "uint256" }],
  },
  {
    type: "function",
    name: "quoteSell",
    stateMutability: "view",
    inputs: [{ name: "tokensIn", type: "uint256" }],
    outputs: [{ name: "native18Out", type: "uint256" }],
  },
  {
    type: "function",
    name: "spotPriceNative18",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

export const launcherTokenAbi = [
  {
    type: "function",
    name: "name",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
  {
    type: "function",
    name: "symbol",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "string" }],
  },
] as const;
