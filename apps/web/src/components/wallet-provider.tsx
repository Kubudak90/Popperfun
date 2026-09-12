"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STUB_ADDRESS = "0xPop9eR42a1b2c3d4e5f67890AbcDef1234567890";

const WalletContext = createContext<{
  address: string | null;
  shortAddress: string | null;
  connecting: boolean;
  connect: () => void;
  disconnect: () => void;
} | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const value = useMemo(
    () => ({
      address,
      shortAddress: address
        ? `${address.slice(0, 6)}…${address.slice(-4)}`
        : null,
      connecting,
      connect: () => {
        setConnecting(true);
        window.setTimeout(() => {
          setAddress(STUB_ADDRESS);
          setConnecting(false);
        }, 380);
      },
      disconnect: () => setAddress(null),
    }),
    [address, connecting],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
