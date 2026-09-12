export type PopBadge = "LIVE" | "NEW" | "HOT";
export type PopPhase = "trading" | "prepared" | "graduated";

export type Pop = {
  id: string;
  name: string;
  symbol: string;
  description: string;
  badge: PopBadge;
  phase: PopPhase;
  /** Display market cap in whole USDC (human). */
  marketCapUsd: number;
  /** Graduation threshold in whole USDC (human). */
  graduationUsd: number;
  /** Raised native USDC in whole dollars (human). */
  raisedUsd: number;
  holders: number;
  createdAt: string;
  accent: "purple" | "pink" | "orange" | "blue";
};

export const POPS: Pop[] = [
  {
    id: "cloudkitty",
    name: "Cloudkitty",
    symbol: "CKTY",
    description: "A soft-cloud cat that only pops when the curve sings.",
    badge: "LIVE",
    phase: "trading",
    marketCapUsd: 48200,
    graduationUsd: 69000,
    raisedUsd: 49680,
    holders: 312,
    createdAt: "2h ago",
    accent: "purple",
  },
  {
    id: "inkdrip",
    name: "Inkdrip",
    symbol: "INK",
    description: "Midnight ink, dripping through a bonding curve.",
    badge: "HOT",
    phase: "trading",
    marketCapUsd: 64110,
    graduationUsd: 69000,
    raisedUsd: 62790,
    holders: 891,
    createdAt: "6h ago",
    accent: "blue",
  },
  {
    id: "burstberry",
    name: "Burstberry",
    symbol: "BBRY",
    description: "Orange burst. Berry sweet. First 24 hours on the curve.",
    badge: "NEW",
    phase: "trading",
    marketCapUsd: 8400,
    graduationUsd: 69000,
    raisedUsd: 8280,
    holders: 64,
    createdAt: "28m ago",
    accent: "orange",
  },
  {
    id: "midnight-mango",
    name: "Midnight Mango",
    symbol: "MMNG",
    description: "Tropical, nocturnal, and fully collateralized in native USDC.",
    badge: "LIVE",
    phase: "trading",
    marketCapUsd: 30150,
    graduationUsd: 69000,
    raisedUsd: 31050,
    holders: 188,
    createdAt: "5h ago",
    accent: "orange",
  },
  {
    id: "softorb",
    name: "Softorb",
    symbol: "ORB",
    description: "A floating orb of Soft Cloud. Collectors only.",
    badge: "NEW",
    phase: "trading",
    marketCapUsd: 5120,
    graduationUsd: 42000,
    raisedUsd: 3360,
    holders: 41,
    createdAt: "51m ago",
    accent: "pink",
  },
  {
    id: "droplet",
    name: "Droplet",
    symbol: "DROP",
    description: "Four colors. One curve. Don't miss the splash.",
    badge: "HOT",
    phase: "trading",
    marketCapUsd: 61200,
    graduationUsd: 69000,
    raisedUsd: 60720,
    holders: 704,
    createdAt: "9h ago",
    accent: "pink",
  },
  {
    id: "funhouse",
    name: "Funhouse",
    symbol: "FUNH",
    description: "Mirrors, pops, and a fixed billion supply.",
    badge: "LIVE",
    phase: "trading",
    marketCapUsd: 22440,
    graduationUsd: 69000,
    raisedUsd: 22770,
    holders: 156,
    createdAt: "12h ago",
    accent: "purple",
  },
  {
    id: "purplefin",
    name: "Purplefin",
    symbol: "PFIN",
    description: "Fast through the curve. Confident at graduation.",
    badge: "LIVE",
    phase: "trading",
    marketCapUsd: 41880,
    graduationUsd: 69000,
    raisedUsd: 42090,
    holders: 275,
    createdAt: "1d ago",
    accent: "purple",
  },
  {
    id: "arcane-pep",
    name: "Arcane Pep",
    symbol: "APEP",
    description: "Arc-native pep. USDC in, tokens out, no extra quote asset.",
    badge: "NEW",
    phase: "trading",
    marketCapUsd: 12900,
    graduationUsd: 69000,
    raisedUsd: 13110,
    holders: 97,
    createdAt: "3h ago",
    accent: "blue",
  },
  {
    id: "gradpop",
    name: "Gradpop",
    symbol: "GRAD",
    description: "Already popped. Liquidity lives on the mock V4 venue.",
    badge: "LIVE",
    phase: "graduated",
    marketCapUsd: 128400,
    graduationUsd: 69000,
    raisedUsd: 69000,
    holders: 1402,
    createdAt: "4d ago",
    accent: "blue",
  },
];

export function getPop(id: string): Pop | undefined {
  return POPS.find((pop) => pop.id === id);
}

export function curveProgress(pop: Pop): number {
  if (pop.phase === "graduated") return 100;
  return Math.min(100, Math.round((pop.raisedUsd / pop.graduationUsd) * 100));
}

export const ACCENT_GRADIENT: Record<Pop["accent"], string> = {
  purple: "from-[#6F3BFF] to-[#D94CFF]",
  pink: "from-[#D94CFF] to-[#FF8A4C]",
  orange: "from-[#FF8A4C] to-[#D94CFF]",
  blue: "from-[#1E8BFF] to-[#6F3BFF]",
};
