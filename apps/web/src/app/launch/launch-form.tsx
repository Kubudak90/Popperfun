"use client";

import {
  formatNative18,
  formatUsd6,
  launchFactoryAbi,
  parseUsdToUsd6,
  usd6ToNative18,
  type Native18,
  type Usd6,
} from "@popper/sdk";
import { useMemo, useState, type FormEvent } from "react";
import { parseEventLogs } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { Button } from "@/components/button";
import { ConnectWallet } from "@/components/connect-wallet";
import { ArrowIcon } from "@/components/icons";
import { Field, Input, Textarea } from "@/components/input";
import { PopperMark } from "@/components/logo";
import { targetChain } from "@/lib/chains";
import { factoryReady, publicEnv, shortenAddress, txExplorerUrl } from "@/lib/env";
import { formatTxError } from "@/lib/wagmi";

type FormState = {
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  graduationUsd: string;
};

const INITIAL: FormState = {
  name: "",
  symbol: "",
  description: "",
  imageUrl: "",
  graduationUsd: "69000",
};

type LaunchResult = {
  hash: `0x${string}`;
  curve: `0x${string}`;
  token: `0x${string}`;
};

export function LaunchForm() {
  const { address, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending } = useWriteContract();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [txError, setTxError] = useState<string | null>(null);
  const [result, setResult] = useState<LaunchResult | null>(null);
  const [configNotice, setConfigNotice] = useState(false);

  const onTargetChain = chainId === targetChain.id;

  const units = useMemo(() => {
    try {
      const usd6 = parseUsdToUsd6(form.graduationUsd);
      const native18 = usd6ToNative18(usd6);
      return { usd6, native18, error: null as string | null };
    } catch (error) {
      return {
        usd6: null as Usd6 | null,
        native18: null as Native18 | null,
        error: error instanceof Error ? error.message : "Invalid amount",
      };
    }
  }, [form.graduationUsd]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setResult(null);
    setTxError(null);
    setConfigNotice(false);
  }

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Give it a name that pops.";
    if (!form.symbol.trim()) next.symbol = "Ticker required.";
    if (form.symbol && !/^[A-Za-z0-9]{2,10}$/.test(form.symbol)) {
      next.symbol = "2–10 letters or numbers.";
    }
    if (!form.description.trim()) next.description = "Tell the story in a line.";
    if (units.error) next.graduationUsd = units.error;
    if (units.usd6 !== null && units.usd6 <= 0n) {
      next.graduationUsd = "Threshold must be greater than zero.";
    }
    setErrors(next);
    return Object.keys(next).length === 0 && units.usd6 !== null;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setTxError(null);
    setResult(null);
    setConfigNotice(false);

    if (!validate() || units.usd6 === null) return;

    if (!factoryReady) {
      setConfigNotice(true);
      return;
    }
    if (!isConnected || !onTargetChain || !publicClient) {
      setTxError(`Connect a wallet on ${targetChain.name} before launching.`);
      return;
    }

    try {
      const hash = await writeContractAsync({
        address: publicEnv.factoryAddress,
        abi: launchFactoryAbi,
        functionName: "launch",
        args: [form.name.trim(), form.symbol.trim().toUpperCase(), units.usd6],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status !== "success") {
        setTxError("Launch transaction reverted.");
        return;
      }
      const launched = parseEventLogs({
        abi: launchFactoryAbi,
        eventName: "PopLaunched",
        logs: receipt.logs,
      });
      const first = launched[0];
      if (!first) {
        setTxError("Transaction landed but PopLaunched was not in the receipt.");
        return;
      }
      setResult({
        hash,
        curve: first.args.curve,
        token: first.args.token,
      });
    } catch (error) {
      setTxError(formatTxError(error));
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name} hint="The thing people will collect.">
          <Input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            placeholder="Cloudkitty"
            autoComplete="off"
          />
        </Field>
        <Field label="Symbol" error={errors.symbol} hint="Short ticker. Caps look faster.">
          <Input
            value={form.symbol}
            onChange={(event) => update("symbol", event.target.value.toUpperCase())}
            placeholder="CKTY"
            maxLength={10}
            autoComplete="off"
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description} hint="Off-chain for now — not stored by the factory.">
        <Textarea
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          placeholder="A soft-cloud cat that only pops when the curve sings."
        />
      </Field>

      <Field
        label="Image URL"
        hint="Optional. UI-only for now — we won't fetch it on-chain."
      >
        <Input
          value={form.imageUrl}
          onChange={(event) => update("imageUrl", event.target.value)}
          placeholder="https://…"
          inputMode="url"
        />
      </Field>

      <Field
        label="Graduation threshold (USD)"
        error={errors.graduationUsd}
        hint="Human usd6 config. The factory converts this to native18 on-chain."
      >
        <Input
          value={form.graduationUsd}
          onChange={(event) => update("graduationUsd", event.target.value)}
          inputMode="decimal"
        />
      </Field>

      <div className="rounded-[20px] border border-border bg-cloud/80 p-4 dark:bg-midnight/40">
        <p className="font-display text-[11px] font-extrabold uppercase tracking-[0.18em] text-muted">
          Unit sanity · @popper/sdk
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Never mix unlabeled integers. Config is{" "}
          <code className="font-semibold text-midnight dark:text-cloud">usd6</code>. Curve
          accounting is <code className="font-semibold text-midnight dark:text-cloud">native18</code>.
          Only usd6 is sent to <code className="font-semibold">ArcLaunchFactory.launch</code>.
        </p>
        {units.usd6 !== null && units.native18 !== null ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-[16px] bg-card p-3">
              <dt className="text-[11px] uppercase tracking-wide text-muted">usd6 (sent)</dt>
              <dd className="mt-1 font-display text-lg font-extrabold">
                ${formatUsd6(units.usd6)}
              </dd>
              <dd className="mt-1 break-all font-mono text-[11px] text-muted">
                {units.usd6.toString()} atoms
              </dd>
            </div>
            <div className="rounded-[16px] bg-card p-3">
              <dt className="text-[11px] uppercase tracking-wide text-muted">native18 (on-chain)</dt>
              <dd className="mt-1 font-display text-lg font-extrabold">
                {formatNative18(units.native18, { digits: 2 })}
              </dd>
              <dd className="mt-1 break-all font-mono text-[11px] text-muted">
                {units.native18.toString()} atoms
              </dd>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-orange">{units.error}</p>
        )}
      </div>

      {factoryReady ? (
        <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted">
          Factory {shortenAddress(publicEnv.factoryAddress)} on {targetChain.name}.{" "}
          {isConnected && address ? (
            <>Connected as {shortenAddress(address)}.</>
          ) : (
            <>Connect a wallet to send the launch transaction.</>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm leading-relaxed text-muted">
          Factory is not configured (zero / missing{" "}
          <code className="font-semibold text-midnight dark:text-cloud">NEXT_PUBLIC_FACTORY_ADDRESS</code>
          ). The form stays fillable. Deploy the prototype to Arc Testnet, then paste the printed
          factory:
          <span className="mt-2 block font-mono text-[12px] text-midnight dark:text-cloud">
            # faucet: https://faucet.circle.com (native USDC gas)
            <br />
            cd packages/contracts && pnpm deploy:arc-testnet
          </span>
        </div>
      )}

      {configNotice ? (
        <p className="text-sm text-orange">
          No factory is wired, so nothing was sent. Deploy to Arc Testnet (or Anvil) and set{" "}
          <code>NEXT_PUBLIC_FACTORY_ADDRESS</code> — we will not fake a successful launch.
        </p>
      ) : null}

      {txError ? (
        <p className="rounded-[18px] bg-orange/10 px-3 py-2.5 text-sm text-orange">{txError}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {!isConnected ? <ConnectWallet size="md" /> : null}
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={factoryReady && (!isConnected || !onTargetChain || isPending)}
        >
          <PopperMark size={18} className="text-white dark:text-white" />
          {isPending ? "Launching…" : "Launch Token"}
          <ArrowIcon />
        </Button>
      </div>

      {result ? (
        <div className="rounded-[24px] border border-purple/30 bg-purple/8 p-4">
          <p className="font-display text-lg font-extrabold">It popped on-chain.</p>
          <p className="mt-1 text-sm text-muted">
            {form.name} (${form.symbol.toUpperCase()}) is live. Threshold locked at{" "}
            {units.usd6 ? `$${formatUsd6(units.usd6)}` : "—"} usd6.
          </p>
          <dl className="mt-3 space-y-1 font-mono text-xs text-muted">
            <div>curve {result.curve}</div>
            <div>token {result.token}</div>
            <div>
              tx {result.hash}
              {txExplorerUrl(result.hash) ? (
                <>
                  {" · "}
                  <a
                    className="font-sans font-bold text-purple"
                    href={txExplorerUrl(result.hash)!}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Explorer
                  </a>
                </>
              ) : null}
            </div>
          </dl>
          <div className="mt-4">
            <Button href={`/pop/${result.curve}`} size="sm">
              View pop
              <ArrowIcon />
            </Button>
          </div>
        </div>
      ) : null}

      {factoryReady && isConnected && onTargetChain ? (
        <p className="text-xs text-muted">
          Submitting calls <code>launch(name, symbol, usd6)</code>. Description stays off-chain.
        </p>
      ) : null}
    </form>
  );
}
