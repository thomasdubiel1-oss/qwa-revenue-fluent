import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Container, Hairline, SignalRule } from "@/components/qwa/primitives";
import { PROVIDER_CAPABILITIES, PROVIDER_IDS } from "@/lib/video/capabilities";
import { getProviderStatuses, planVideoRoute } from "@/lib/video/video.functions";
import {
  WORKFLOW_PRESETS,
  WORKFLOW_PRESET_IDS,
  stageOwnerLabel,
  type WorkflowPresetId,
} from "@/lib/video/presets";
import { USAGE_RIGHTS_LABEL, USAGE_RIGHTS_NOTE } from "@/lib/video/usage-rights";
import { cn } from "@/lib/utils";
import type {
  AspectRatio,
  DurationTarget,
  ProviderHealth,
  ProviderId,
  QualityTier,
} from "@/lib/video/types";

const title = "Video Router Lab — QWA Internal";
const description = "Internal simulation tool for QWA Creative Engine provider routing.";

export const Route = createFileRoute("/internal/video-router-lab")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VideoRouterLab,
});

const HEALTH_LABEL: Record<ProviderHealth, string> = {
  not_configured: "Not configured",
  manual_handoff: "Manual handoff",
  ready: "Ready",
  degraded: "Degraded",
  unavailable: "Unavailable",
  unknown: "Credentials present · unverified",
};

const DURATIONS: DurationTarget[] = [15, 30, 60];
const RATIOS: AspectRatio[] = ["9:16", "16:9", "1:1"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[0.68rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function Choice<T extends string | number>({
  options,
  value,
  onChange,
  format,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-hairline p-1">
      {options.map((option) => (
        <button
          key={String(option)}
          type="button"
          onClick={() => onChange(option)}
          aria-pressed={option === value}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            option === value
              ? "bg-ink text-ink-foreground"
              : "text-muted-foreground hover:bg-accent",
          )}
        >
          {format ? format(option) : String(option)}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-hairline px-4 py-3 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[color:var(--signal,currentColor)]"
      />
    </label>
  );
}

function VideoRouterLab() {
  const statusFn = useServerFn(getProviderStatuses);
  const planFn = useServerFn(planVideoRoute);

  const [objective, setObjective] = React.useState("Performance ad for inbound lead capture");
  const [prompt, setPrompt] = React.useState(
    "Founder-led direct-to-camera spot in a bright studio, cutting to product UI moments.",
  );
  const [duration, setDuration] = React.useState<DurationTarget>(30);
  const [aspectRatio, setAspectRatio] = React.useState<AspectRatio>("9:16");
  const [quality, setQuality] = React.useState<QualityTier>("premium");
  const [audioRequired, setAudioRequired] = React.useState(true);
  const [referenceAssets, setReferenceAssets] = React.useState(false);
  const [characterConsistency, setCharacterConsistency] = React.useState(false);
  const [costCeiling, setCostCeiling] = React.useState(60);
  const [outputCount, setOutputCount] = React.useState(2);
  const [presetId, setPresetId] = React.useState<WorkflowPresetId>("low_cost_prototype");

  const statuses = useQuery({
    queryKey: ["video-provider-statuses"],
    queryFn: () => statusFn(),
  });

  const jobInput = React.useMemo(
    () => ({
      objective,
      prompt,
      durationTargetSeconds: duration,
      aspectRatio,
      qualityTarget: quality,
      costCeilingUsd: costCeiling,
      latencyPreference: quality === "premium" ? ("quality-first" as const) : ("fastest" as const),
      audioRequired,
      characterConsistencyRequired: characterConsistency,
      referenceAssets: referenceAssets
        ? [{ id: "ref-1", kind: "image" as const, label: "Brand still (simulated)" }]
        : [],
      outputCount,
      presetId,
    }),
    [
      presetId,
      objective,
      prompt,
      duration,
      aspectRatio,
      quality,
      costCeiling,
      audioRequired,
      characterConsistency,
      referenceAssets,
      outputCount,
    ],
  );

  const plan = useQuery({
    queryKey: ["video-route-plan", jobInput],
    queryFn: () => planFn({ data: jobInput }),
  });

  const statusById = new Map((statuses.data ?? []).map((s) => [s.id as ProviderId, s]));

  return (
    <main className="min-h-screen bg-paper py-16">
      <Container className="max-w-[76rem]">
        <header className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-hairline px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Internal · not linked from the public site
          </span>
          <h1 className="text-display text-[clamp(1.9rem,3.4vw,2.75rem)]">Video Router Lab</h1>
          <p className="text-lede max-w-[42rem]">
            Configure a creative job and inspect how the QWA Creative Engine would rank
            providers. All numbers on this page are simulated: scoring uses mock heuristics
            and no provider call is made.
          </p>
        </header>

        <SignalRule className="my-12" />

        <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          {/* Job configuration */}
          <section aria-labelledby="job-config" className="flex flex-col gap-6">
            <h2 id="job-config" className="text-sm font-semibold tracking-tight">
              Demo job
            </h2>

            <Field label="Workflow preset">
              <Choice
                options={WORKFLOW_PRESET_IDS}
                value={presetId}
                onChange={setPresetId}
                format={(v) => WORKFLOW_PRESETS[v].label}
              />
            </Field>

            <Field label="Objective">
              <input
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </Field>

            <Field label="Prompt / script">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-lg border border-hairline bg-card px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </Field>

            <Field label="Duration">
              <Choice
                options={DURATIONS}
                value={duration}
                onChange={setDuration}
                format={(v) => `${v}s`}
              />
            </Field>

            <Field label="Aspect ratio">
              <Choice options={RATIOS} value={aspectRatio} onChange={setAspectRatio} />
            </Field>

            <Field label="Mode">
              <Choice
                options={["efficient", "premium"] as const}
                value={quality === "premium" ? "premium" : "efficient"}
                onChange={(v) => setQuality(v as QualityTier)}
                format={(v) => (v === "premium" ? "Premium" : "Efficient")}
              />
            </Field>

            <Field label="Cost ceiling (USD)">
              <input
                type="number"
                min={0}
                step={5}
                value={costCeiling}
                onChange={(e) => setCostCeiling(Number(e.target.value))}
                className="w-32 rounded-lg border border-hairline bg-card px-3 py-2 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </Field>

            <Field label="Outputs per job">
              <Choice
                options={[1, 2, 3, 4] as const}
                value={outputCount as 1 | 2 | 3 | 4}
                onChange={(v) => setOutputCount(v)}
              />
            </Field>

            <div className="flex flex-col gap-2">
              <Toggle label="Audio required" checked={audioRequired} onChange={setAudioRequired} />
              <Toggle
                label="Reference assets"
                checked={referenceAssets}
                onChange={setReferenceAssets}
              />
              <Toggle
                label="Character consistency"
                checked={characterConsistency}
                onChange={setCharacterConsistency}
              />
            </div>

            <Button variant="quiet" size="pill" onClick={() => void plan.refetch()}>
              Re-run routing
            </Button>
          </section>

          {/* Results */}
          <section aria-labelledby="routing-result" className="flex flex-col gap-8">
            <h2 id="routing-result" className="text-sm font-semibold tracking-tight">
              Ranked recommendation
              <span className="ml-2 font-normal text-muted-foreground">simulated</span>
            </h2>

            {plan.isPending ? (
              <p className="text-sm text-muted-foreground">Scoring providers…</p>
            ) : plan.error ? (
              <p className="text-sm text-destructive">Routing failed: {String(plan.error)}</p>
            ) : (
              <>
                <div className="rounded-xl border border-hairline bg-card p-6">
                  <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                    Primary recommendation
                  </p>
                  <p className="mt-2 text-2xl tracking-tight">
                    {plan.data?.primary?.displayName ?? "No eligible provider"}
                  </p>
                  <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
                    {plan.data?.decision.map((line) => (
                      <li key={line}>— {line}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col">
                  {plan.data?.ranked.map((r, i) => (
                    <div key={r.providerId} className="py-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-3">
                        <p className="text-sm font-medium">
                          <span className="mr-3 font-mono text-xs text-muted-foreground">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {r.displayName}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {r.eligible ? `${(r.score * 100).toFixed(0)}/100` : "ineligible"} ·
                          ${r.estimatedCostUsd.toFixed(2)} · ~
                          {Math.max(1, Math.round(r.estimatedLatencySeconds / 60))} min ·{" "}
                          {r.clipsRequired} clip{r.clipsRequired === 1 ? "" : "s"}
                        </p>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {r.eligible ? r.rationale.join(" · ") : r.blockers.join("; ")}
                      </p>
                      <Hairline className="mt-5" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Workflow preset */}
            {plan.data ? (
              <div className="rounded-xl border border-hairline bg-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{plan.data.preset.label}</p>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {plan.data.strategy.replace("_", " ")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{plan.data.preset.summary}</p>
                <ol className="mt-4 space-y-2">
                  {plan.data.preset.stages.map((stage, i) => (
                    <li key={stage.id} className="flex gap-3 text-xs">
                      <span className="font-mono text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="font-medium">{stage.label}</span>
                        <span className="text-muted-foreground">
                          {" "}
                          · {stageOwnerLabel(stage.owner)}
                          {stage.optional ? " · optional" : ""} —{" "}
                          {stage.detail}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
                <Hairline className="my-5" />
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Planning / pre-production hub
                </p>
                {plan.data.planning.map((hub) => (
                  <div key={hub.providerId} className="mt-3">
                    <p className="text-sm font-medium">
                      {hub.displayName}
                      <span className="ml-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {HEALTH_LABEL[hub.health]} · {USAGE_RIGHTS_LABEL[hub.usageRightsStatus]}
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{hub.note}</p>
                    <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">
                      est. ${hub.estimatedCostUsd.toFixed(2)} · storyboard ·
                      {" "}shot sequencing · aspect + duration plan ·
                      {hub.capabilities.prototypeAssembly ? " prototype assembly" : ""}
                    </p>
                  </div>
                ))}
                <Hairline className="my-5" />
                <p className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
                  Escalation policy
                </p>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {plan.data.escalationPolicy.map((line) => (
                    <li key={line}>— {line}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {/* Usage rights gate */}
            {plan.data ? (
              <div className="rounded-xl border border-hairline bg-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">Commercial-use gate</p>
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                    resolves to {plan.data.publishGate.resolvedState.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {plan.data.publishGate.allowed
                    ? "Publish-ready."
                    : "Blocked from publish-ready state."}{" "}
                  {USAGE_RIGHTS_NOTE.prototype_only}
                </p>
                <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {plan.data.publishGate.reasons.map((r) => (
                    <li key={r}>— {r}</li>
                  ))}
                </ul>
                <p className="mt-3 text-[0.68rem] text-muted-foreground">
                  Workflow status only — not a legal determination. A named human must
                  confirm clearance before any public use.
                </p>
              </div>
            ) : null}

            {/* Cost comparison */}
            {plan.data ? (
              <div>
                <h2 className="text-sm font-semibold tracking-tight">
                  Prototype-first vs premium-everywhere
                  <span className="ml-2 font-normal text-muted-foreground">illustrative</span>
                </h2>
                <table className="mt-4 w-full text-left text-xs">
                  <thead className="text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                    <tr>
                      <th scope="col" className="py-2 font-medium">Length</th>
                      <th scope="col" className="py-2 font-medium">Prototype-first</th>
                      <th scope="col" className="py-2 font-medium">Premium everywhere</th>
                      <th scope="col" className="py-2 font-medium">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono">
                    {plan.data.costComparison.map((row) => (
                      <tr key={row.durationSeconds} className="border-t border-hairline">
                        <td className="py-2">{row.durationSeconds}s</td>
                        <td className="py-2">${row.prototypeFirstUsd.toFixed(2)}</td>
                        <td className="py-2">${row.premiumEverywhereUsd.toFixed(2)}</td>
                        <td className="py-2">
                          −${row.savingsUsd.toFixed(2)} ({row.savingsPct}%)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-3 text-[0.68rem] text-muted-foreground">
                  {plan.data.costModelNote}
                </p>
              </div>
            ) : null}

            {/* Provider status */}
            <div>
              <h2 className="text-sm font-semibold tracking-tight">Provider status</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {PROVIDER_IDS.map((id) => {
                  const caps = PROVIDER_CAPABILITIES[id];
                  const status = statusById.get(id);
                  const health: ProviderHealth | null = status?.health ?? null;
                  return (
                    <div key={id} className="rounded-xl border border-hairline bg-card p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium">{caps.displayName}</p>
                        <span
                          className={cn(
                            "inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.14em]",
                            health === "ready" ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              health === "ready"
                                ? "bg-signal"
                                : health === "manual_handoff"
                                  ? "bg-signal/50"
                                  : health === "degraded"
                                  ? "bg-amber-500"
                                  : "bg-muted-foreground/40",
                            )}
                          />
                          {health ? HEALTH_LABEL[health] : "Checking\u2026"}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{caps.summary}</p>
                      <p className="mt-2 font-mono text-[0.68rem] text-muted-foreground">
                        {caps.role === "planning" ? "planning hub" : "shot generation"} ·{" "}
                        {caps.integrationMode === "manual_handoff" ? "manual handoff" : "API"} ·{" "}
                        {caps.costTier} cost · {caps.productionTier}
                      </p>
                      <p className="mt-1 font-mono text-[0.68rem] text-muted-foreground">
                        {caps.maxClipDurationSeconds}s max clip · {caps.aspectRatios.join(" / ")} ·{" "}
                        {caps.supportsAudio ? "audio" : "no audio"} ·{" "}
                        {USAGE_RIGHTS_LABEL[caps.defaultUsageRights]}
                      </p>
                      {status && !status.configured ? (
                        <p className="mt-2 font-mono text-[0.68rem] text-muted-foreground">
                          Missing: {status.missingEnv.join(", ")}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}
