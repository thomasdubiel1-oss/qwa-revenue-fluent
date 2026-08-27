import * as React from "react";

import {
  STORYBOARD_GATE_CRITERIA,
  STORYBOARD_GATE_LABEL,
  STORYBOARD_GATE_ORDER,
  type StoryboardPackage,
  type StoryboardShot,
} from "@/lib/media/storyboard";
import { cn } from "@/lib/utils";

/**
 * Internal-only storyboard renderer. Displays a copy-ready LTX production
 * package for one manifest slot. No public route imports this.
 */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1600);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className="text-data shrink-0 rounded-full border border-hairline px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-accent"
    >
      {copied ? "Copied" : `Copy ${label}`}
    </button>
  );
}

function Block({
  title,
  body,
  copyLabel,
}: {
  title: string;
  body: string;
  copyLabel: string;
}) {
  return (
    <section className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[1.0625rem] font-medium tracking-tight">{title}</h3>
        <CopyButton value={body} label={copyLabel} />
      </div>
      <pre className="text-data mt-4 whitespace-pre-wrap break-words text-[0.78rem] leading-relaxed text-muted-foreground">
        {body}
      </pre>
    </section>
  );
}

function ShotRow({ shot }: { shot: StoryboardShot }) {
  const fields: [string, string][] = [
    ["Composition", shot.composition],
    ["Action", shot.action],
    ["Camera", shot.camera],
    ["Transition in", shot.transitionIn],
    ["Transition out", shot.transitionOut],
    ["Desktop framing", shot.desktopFraming],
    ["Mobile-safe framing", shot.mobileFraming],
    ["Continuity", shot.continuity],
  ];
  const paste = `SHOT ${shot.n} — ${shot.title} (${shot.seconds}s)\n\n${shot.prompt}\n\nAVOID: ${shot.negative}`;

  return (
    <article className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="text-data text-[0.7rem] text-muted-foreground">
            {String(shot.n).padStart(2, "0")}
          </span>
          <h3 className="text-[1.0625rem] font-medium tracking-tight">{shot.title}</h3>
          <span className="text-data text-[0.7rem] text-signal">{shot.seconds}s</span>
        </div>
        <CopyButton value={paste} label="shot prompt" />
      </header>

      <dl className="mt-5 grid gap-5 border-t border-hairline pt-5 sm:grid-cols-2">
        {fields.map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              {label}
            </dt>
            <dd className="mt-1 text-[0.875rem] leading-snug">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 border-t border-hairline pt-5 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            LTX prompt
          </p>
          <p className="text-data mt-2 text-[0.78rem] leading-relaxed">{shot.prompt}</p>
        </div>
        <div className="min-w-0">
          <p className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            Avoid
          </p>
          <p className="text-data mt-2 text-[0.78rem] leading-relaxed text-muted-foreground">
            {shot.negative}
          </p>
        </div>
      </div>
    </article>
  );
}

export function StoryboardPanel({ pkg }: { pkg: StoryboardPackage }) {
  const currentIndex = STORYBOARD_GATE_ORDER.indexOf(pkg.gate);
  const total = pkg.shots.reduce((s, shot) => s + shot.seconds, 0);
  const fullPaste = [
    `${pkg.title} — ${pkg.runtimeSeconds}s seamless silent loop`,
    "",
    pkg.masterPrompt,
    "",
    "SHOT LIST",
    ...pkg.shots.map(
      (s) => `\nSHOT ${s.n} — ${s.title} (${s.seconds}s)\n${s.prompt}\nAVOID: ${s.negative}`,
    ),
    "",
    `LOOP: ${pkg.loopStrategy}`,
  ].join("\n");

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-data text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Storyboard package · {pkg.mediaId}
            </p>
            <h2 className="mt-2 text-[1.375rem] font-medium tracking-tight">{pkg.title}</h2>
            <p className="mt-3 max-w-[52rem] text-[0.9375rem] leading-relaxed">{pkg.arc}</p>
          </div>
          <CopyButton value={fullPaste} label="full package" />
        </div>

        <dl className="mt-6 grid gap-5 border-t border-hairline pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              Total runtime
            </dt>
            <dd className="mt-1 text-[0.875rem]">
              {total.toFixed(1)}s · {pkg.shots.length} shots · silent
            </dd>
          </div>
          <div>
            <dt className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              LTX connection
            </dt>
            <dd className="mt-1 text-[0.875rem]">
              {pkg.apiConnected ? "API connected" : "Manual handoff · copy & paste"}
            </dd>
          </div>
          <div>
            <dt className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              Current gate
            </dt>
            <dd className="mt-1 text-[0.875rem] text-signal">
              {STORYBOARD_GATE_LABEL[pkg.gate]}
            </dd>
          </div>
          <div>
            <dt className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
              Spend so far
            </dt>
            <dd className="mt-1 text-[0.875rem]">None · written package only</dd>
          </div>
        </dl>

        <p className="mt-5 border-t border-hairline pt-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {pkg.handoffNotes}
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
          <h3 className="text-[1.0625rem] font-medium tracking-tight">Visual direction</h3>
          <ul className="mt-4 flex flex-col gap-2.5">
            {pkg.visualDirection.map((v) => (
              <li key={v} className="text-[0.875rem] leading-relaxed text-muted-foreground">
                {v}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[1.0625rem] font-medium tracking-tight">Global avoid list</h3>
            <CopyButton value={pkg.globalNegative.join("; ")} label="avoid list" />
          </div>
          <ul className="mt-4 flex flex-col gap-2">
            {pkg.globalNegative.map((v) => (
              <li key={v} className="text-data text-[0.78rem] leading-relaxed text-muted-foreground">
                {v}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Shot list" className="flex flex-col gap-5">
        <h3 className="text-data text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
          Shot list · {pkg.shots.length} shots
        </h3>
        {pkg.shots.map((shot) => (
          <ShotRow key={shot.n} shot={shot} />
        ))}
      </section>

      <section className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
        <h3 className="text-[1.0625rem] font-medium tracking-tight">Seamless loop strategy</h3>
        <p className="mt-3 max-w-[60rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
          {pkg.loopStrategy}
        </p>
      </section>

      <Block title="Master LTX storyboard prompt" body={pkg.masterPrompt} copyLabel="master prompt" />
      <Block
        title="LTX prototype prompt — after storyboard approval only"
        body={pkg.prototypePrompt}
        copyLabel="prototype prompt"
      />

      <section className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
        <h3 className="text-[1.0625rem] font-medium tracking-tight">Acceptance checklist</h3>
        <ul className="mt-5 flex flex-col divide-y divide-hairline border-y border-hairline">
          {pkg.acceptanceChecklist.map((c) => (
            <li key={c.label} className="grid gap-1 py-4 sm:grid-cols-[12rem_minmax(0,1fr)] sm:gap-6">
              <span className="text-data text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                {c.label}
              </span>
              <span className="text-[0.875rem] leading-relaxed">{c.test}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
        <h3 className="text-[1.0625rem] font-medium tracking-tight">Status gates</h3>
        <p className="mt-2 max-w-[52rem] text-[0.875rem] leading-relaxed text-muted-foreground">
          One step at a time, in order. Footage may only be bound in the manifest after the
          final gate is recorded by a human.
        </p>
        <ol className="mt-5 flex flex-col divide-y divide-hairline border-y border-hairline">
          {STORYBOARD_GATE_ORDER.map((gate, i) => {
            const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "pending";
            return (
              <li key={gate} className="grid gap-1.5 py-4 sm:grid-cols-[16rem_minmax(0,1fr)] sm:gap-6">
                <span className="flex items-baseline gap-2.5">
                  <span
                    className={cn(
                      "text-data text-[0.7rem]",
                      state === "current" ? "text-signal" : "text-muted-foreground",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={cn(
                      "text-[0.9375rem]",
                      state === "pending" ? "text-muted-foreground" : "font-medium",
                      state === "current" && "text-signal",
                    )}
                  >
                    {STORYBOARD_GATE_LABEL[gate]}
                  </span>
                  {state === "current" ? (
                    <span className="text-data text-[0.62rem] uppercase tracking-[0.14em] text-signal">
                      here
                    </span>
                  ) : null}
                </span>
                <span className="text-[0.875rem] leading-relaxed text-muted-foreground">
                  {STORYBOARD_GATE_CRITERIA[gate]}
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
