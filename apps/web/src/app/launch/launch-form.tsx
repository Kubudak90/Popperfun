"use client";

import {
  formatNative18,
  formatUsd6,
  parseUsdToUsd6,
  usd6ToNative18,
  type Native18,
  type Usd6,
} from "@popper/sdk";
import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { ArrowIcon } from "@/components/icons";
import { Field, Input, Textarea } from "@/components/input";
import { PopperMark } from "@/components/logo";

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

export function LaunchForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

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
    setSubmitted(false);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
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
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
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

      <Field label="Description" error={errors.description}>
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
        hint="Human usd6 config. The curve stores this as native18."
      >
        <Input
          value={form.graduationUsd}
          onChange={(event) => update("graduationUsd", event.target.value)}
          inputMode="decimal"
        />
      </Field>

      <div className="rounded-[24px] border border-border bg-background p-4">
        <p className="font-display text-xs font-extrabold uppercase tracking-[0.16em] text-purple">
          Unit sanity · @popper/sdk
        </p>
        <p className="mt-2 text-sm text-muted">
          Never mix unlabeled integers. Config is <code className="font-bold">usd6</code>.
          Curve accounting is <code className="font-bold">native18</code>.
        </p>
        {units.usd6 !== null && units.native18 !== null ? (
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div className="rounded-2xl bg-card p-3">
              <dt className="text-xs uppercase tracking-wide text-muted">usd6</dt>
              <dd className="mt-1 font-display text-lg font-extrabold">
                ${formatUsd6(units.usd6)}
              </dd>
              <dd className="mt-1 break-all font-mono text-[11px] text-muted">
                {units.usd6.toString()} atoms
              </dd>
            </div>
            <div className="rounded-2xl bg-card p-3">
              <dt className="text-xs uppercase tracking-wide text-muted">native18</dt>
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

      <div className="rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted">
        Wallet not required yet. Submit is a UI stub — no factory transaction is sent.
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto">
        <PopperMark size={18} className="text-white dark:text-white" />
        Launch Token
        <ArrowIcon />
      </Button>

      {submitted ? (
        <div className="rounded-[24px] border border-purple/30 bg-purple/8 p-4">
          <p className="font-display text-lg font-extrabold">Ready to pop — almost.</p>
          <p className="mt-1 text-sm text-muted">
            {form.name} (${form.symbol}) is staged locally. Wiring{" "}
            <code>ArcLaunchFactory.launch</code> is the next slice. Threshold locked at{" "}
            {units.usd6 ? `$${formatUsd6(units.usd6)}` : "—"} usd6.
          </p>
        </div>
      ) : null}
    </form>
  );
}
