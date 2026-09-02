import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { Container, SignalRule } from "@/components/qwa/primitives";
import {
  FLAGSHIP_MEDIA,
  MEDIA_STATUS_LABEL,
  MOBILE_BEHAVIOR_LABEL,
  REDUCED_MOTION_LABEL,
  PRIORITY_ORDER,
  externalGenerationQueue,
  productionQueue,
} from "@/lib/media/manifest";
import { USAGE_RIGHTS_LABEL } from "@/lib/video/usage-rights";
import { getStoryboard } from "@/lib/media/storyboards";
import { StoryboardPanel } from "@/components/qwa/media/storyboard-panel";
import { PROVIDER_CAPABILITIES } from "@/lib/video/capabilities";
import type { FlagshipMediaAsset, MediaPriority, MediaStatus } from "@/lib/media/types";
import { cn } from "@/lib/utils";

const title = "Media Production Brief — QWA Internal";
const description = "Internal production checklist for every flagship media slot on the QWA site.";

export const Route = createFileRoute("/internal/media-production-brief")({
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
  component: MediaProductionBrief,
});

const KIND_LABEL: Record<FlagshipMediaAsset["kind"], string> = {
  code_motion: "Code-first · no generation",
  video_with_code_fallback: "External generation · code fallback ships today",
  reserved: "Reserved · nothing mounted",
};

const STATUS_TONE: Record<MediaStatus, string> = {
  code_ready: "border-hairline-strong text-foreground",
  needs_generation: "border-signal/40 text-signal",
  prototype_only: "border-hairline-strong text-muted-foreground",
  commercially_cleared: "border-hairline-strong text-foreground",
};

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-data w-fit rounded-full border border-hairline px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-[0.875rem] leading-snug">{value}</dd>
    </div>
  );
}

function providerLabel(id: string) {
  return PROVIDER_CAPABILITIES[id as keyof typeof PROVIDER_CAPABILITIES]?.displayName ?? id;
}

function AssetCard({ asset, index }: { asset: FlagshipMediaAsset; index: number }) {
  return (
    <article className="rounded-xl border border-hairline bg-surface p-6 sm:p-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-data text-[0.7rem] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="text-[1.0625rem] font-medium tracking-tight">{asset.id}</h3>
          </div>
          <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
            <span className="text-data">{asset.route}</span> · {asset.placement}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Pill className="border-hairline-strong text-foreground">{asset.priority}</Pill>
          <Pill className={STATUS_TONE[asset.status]}>{MEDIA_STATUS_LABEL[asset.status]}</Pill>
        </div>
      </header>

      <p className="mt-5 max-w-[52rem] text-[0.9375rem] leading-relaxed">{asset.purpose}</p>

      <dl className="mt-6 grid gap-5 border-t border-hairline pt-5 sm:grid-cols-2 lg:grid-cols-4">
        <Field
          label="Ratio · desktop / mobile"
          value={`${asset.aspectRatio} / ${asset.mobileAspectRatio}`}
        />
        <Field
          label="Target duration"
          value={
            asset.targetDurationSeconds === null
              ? "Scroll-driven · reader controlled"
              : `${asset.targetDurationSeconds}s${asset.silentLoop ? " · silent loop" : ""}`
          }
        />
        <Field label="Approach" value={KIND_LABEL[asset.kind]} />
        <Field
          label="Provider preference"
          value={
            asset.providerPreference.length
              ? asset.providerPreference.map(providerLabel).join(" → ")
              : "None · code only"
          }
        />
        <Field label="Usage rights" value={USAGE_RIGHTS_LABEL[asset.usageRightsStatus]} />
        <Field label="Mobile behaviour" value={MOBILE_BEHAVIOR_LABEL[asset.mobileBehavior]} />
        <Field label="Reduced motion" value={REDUCED_MOTION_LABEL[asset.reducedMotion]} />
        <Field label="Fallback composition" value={asset.fallbackComponent} />
      </dl>

      <div className="mt-6 grid gap-5 border-t border-hairline pt-5 lg:grid-cols-2">
        <div className="min-w-0">
          <p className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            Shot brief
          </p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">
            {asset.shotBrief}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-data text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            Implementation notes
          </p>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-muted-foreground">
            {asset.notes}
          </p>
          <p className="mt-3 text-[0.8125rem] text-muted-foreground">
            Bound source:{" "}
            <span className="text-data">
              {asset.source ? asset.source.desktopSrc : "none — no <video> is mounted"}
            </span>
          </p>
        </div>
      </div>
    </article>
  );
}

type Grouping = "priority" | "status";
type PriorityFilter = MediaPriority | "all";

function MediaProductionBrief() {
  const [grouping, setGrouping] = React.useState<Grouping>("priority");
  const [priority, setPriority] = React.useState<PriorityFilter>("all");

  const queue = productionQueue();
  const visible = queue.filter((a) => priority === "all" || a.priority === priority);

  const groups: { key: string; label: string; items: FlagshipMediaAsset[] }[] =
    grouping === "priority"
      ? PRIORITY_ORDER.map((p) => ({
          key: p,
          label: `${p} — ${p === "P0" ? "flagship" : p === "P1" ? "supporting" : "later"}`,
          items: visible.filter((a) => a.priority === p),
        }))
      : (Object.keys(MEDIA_STATUS_LABEL) as MediaStatus[]).map((s) => ({
          key: s,
          label: MEDIA_STATUS_LABEL[s],
          items: visible.filter((a) => a.status === s),
        }));

  const external = externalGenerationQueue();
  const homeHeroStoryboard = getStoryboard("home-hero");
  const codeFirst = FLAGSHIP_MEDIA.filter((a) => !a.externalGenerationRequired).length;

  return (
    <main className="min-h-screen bg-paper py-16">
      <Container className="max-w-[76rem]">
        <header className="flex flex-col gap-4">
          <span className="w-fit rounded-full border border-hairline px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Internal · not linked from the public site
          </span>
          <h1 className="text-display text-[clamp(1.9rem,3.4vw,2.75rem)]">
            Media production brief
          </h1>
          <p className="text-lede max-w-[46rem]">
            Every flagship media slot on the public site, with the story beat it carries, the
            geometry it must be produced at, and its rights state. Footage never mounts unless an
            entry is commercially cleared, so nothing here can ship an unlicensed asset.
          </p>
        </header>

        <dl className="mt-10 grid gap-6 border-y border-hairline py-6 sm:grid-cols-3">
          <Field label="Slots defined" value={`${FLAGSHIP_MEDIA.length}`} />
          <Field label="Code-first · no spend" value={`${codeFirst}`} />
          <Field label="Queued for generation" value={`${external.length}`} />
        </dl>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-hairline p-1">
            {(["priority", "status"] as Grouping[]).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrouping(g)}
                aria-pressed={grouping === g}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                  grouping === g
                    ? "bg-ink text-ink-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                Group by {g}
              </button>
            ))}
          </div>
          <div className="inline-flex flex-wrap gap-1 rounded-full border border-hairline p-1">
            {(["all", ...PRIORITY_ORDER] as PriorityFilter[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                aria-pressed={priority === p}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  priority === p
                    ? "bg-ink text-ink-foreground"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                {p === "all" ? "All priorities" : p}
              </button>
            ))}
          </div>
        </div>

        <SignalRule className="my-12" />

        <section aria-label="Production queue" className="flex flex-col gap-12">
          {groups
            .filter((g) => g.items.length > 0)
            .map((group) => (
              <div key={group.key}>
                <h2 className="text-data text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {group.label} · {group.items.length}
                </h2>
                <div className="mt-5 flex flex-col gap-5">
                  {group.items.map((asset, i) => (
                    <AssetCard key={asset.id} asset={asset} index={i} />
                  ))}
                </div>
              </div>
            ))}
          {visible.length === 0 ? (
            <p className="text-[0.9375rem] text-muted-foreground">No slots match this filter.</p>
          ) : null}
        </section>

        <SignalRule className="my-12" />

        {homeHeroStoryboard ? (
          <section aria-label="Homepage hero storyboard package">
            <h2 className="text-[1.25rem] font-medium tracking-tight">
              LTX storyboard package — next executable action
            </h2>
            <p className="mt-2 max-w-[46rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
              Copy-ready. LTX Studio is a manual-handoff planning provider, so nothing here is
              generated automatically — paste the master prompt into LTX for storyboard frames,
              review, then run the prototype prompt.
            </p>
            <div className="mt-8">
              <StoryboardPanel pkg={homeHeroStoryboard} />
            </div>
          </section>
        ) : null}

        <SignalRule className="my-12" />

        <section aria-label="External generation queue">
          <h2 className="text-[1.25rem] font-medium tracking-tight">External generation queue</h2>
          <p className="mt-2 max-w-[46rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
            In priority order. Each one runs LTX storyboard and prototype first, then a premium
            provider for approved shots only, then recorded human clearance before a source is bound
            in the manifest.
          </p>
          <ol className="mt-6 flex flex-col divide-y divide-hairline border-y border-hairline">
            {external.map((a, i) => (
              <li key={a.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                <span className="text-data text-[0.7rem] text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.9375rem] font-medium">{a.id}</span>
                <span className="text-[0.8125rem] text-muted-foreground">{a.route}</span>
                <span className="text-data ml-auto text-[0.7rem] uppercase tracking-[0.14em] text-signal">
                  {a.priority} · {a.providerPreference.map(providerLabel).join(" → ")}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </Container>
    </main>
  );
}
