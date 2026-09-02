import { motion } from "motion/react";
import { MotionReveal } from "../motion-primitives";
import { Container, Section } from "../primitives";
import {
  Chip,
  DecisionCallout,
  FieldGrid,
  IllustrativeNote,
  PanelBlock,
  PanelStats,
  ProductPanel,
  ProductSection,
  StatCell,
} from "./primitives";
import { duration, ease } from "@/lib/motion";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
 * Signature visual — the discovery graph.
 * Query clusters resolve to pages, pages produce conversations, conversations
 * produce attributable revenue.
 * ---------------------------------------------------------------------- */

const graph: { tier: string; nodes: { label: string; meta: string }[] }[] = [
  {
    tier: "Query cluster",
    nodes: [
      { label: "“compare coverage options”", meta: "312 variants" },
      { label: "“is roadside worth it”", meta: "148 variants" },
    ],
  },
  {
    tier: "Page / asset",
    nodes: [
      { label: "Coverage comparison guide", meta: "entity-clear, sourced" },
      { label: "Roadside explainer + FAQ", meta: "structured answers" },
    ],
  },
  {
    tier: "Conversation",
    nodes: [{ label: "Chat → DM → inbound call", meta: "same record" }],
  },
  {
    tier: "Revenue",
    nodes: [{ label: "Attributed pipeline and closed won", meta: "contribution model" }],
  },
];

export function DiscoveryGraphVisual() {
  return (
    <ProductPanel
      title="Discovery graph · coverage cluster"
      meta="query → page → conversation → revenue"
      footer={
        <IllustrativeNote>
          Illustrative graph. QWA does not guarantee rankings or inclusion in AI answers.
        </IllustrativeNote>
      }
    >
      <PanelBlock className="py-6">
        <ol className="grid gap-0">
          {graph.map((tier, i) => (
            <li key={tier.tier} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-4">
              <div className="relative flex flex-col items-center">
                <motion.span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-signal"
                  initial={{ scale: 0.3, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: duration.fast, ease: ease.out, delay: i * 0.12 }}
                />
                {i < graph.length - 1 ? (
                  <motion.span
                    className="w-px flex-1 bg-hairline-strong"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: 0.06 + i * 0.12 }}
                    style={{ transformOrigin: "top" }}
                  />
                ) : null}
              </div>
              <div className="min-w-0 pb-5 last:pb-0">
                <p className="text-data text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground/80">
                  {tier.tier}
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {tier.nodes.map((n) => (
                    <li key={n.label} className="min-w-0">
                      <p className="text-[0.9375rem] font-medium leading-snug">{n.label}</p>
                      <p className="text-data mt-0.5 text-[0.7rem] text-muted-foreground">
                        {n.meta}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </PanelBlock>
      <PanelStats
        cells={[
          { label: "Clusters", value: "24" },
          { label: "Pages mapped", value: "61" },
          { label: "Joined to revenue", value: "Yes", accent: true },
        ]}
      />
    </ProductPanel>
  );
}

/* ---------------------------------------------------------------------- */

const diagnostics = [
  {
    issue: "Comparison pages render key claims client-side",
    sev: "High",
    effect: "Not reliably parseable by crawlers or answer engines",
  },
  {
    issue: "Duplicate location pages competing on one intent",
    sev: "High",
    effect: "Splits authority across near-identical URLs",
  },
  {
    issue: "Missing product and FAQ structured data",
    sev: "Medium",
    effect: "Reduces eligibility for structured surfaces",
  },
  {
    issue: "Slow largest contentful paint on mobile templates",
    sev: "Medium",
    effect: "Degrades crawl efficiency and user outcomes",
  },
];

export function DiagnosticsSection() {
  return (
    <ProductSection
      id="diagnostics"
      eyebrow="Technical diagnostics"
      title="Fix what is blocking discovery, in the order that matters."
      lede="QWA crawls the property, records what is actually rendered, and prioritises issues by the revenue exposed behind them rather than by a generic severity score."
      points={[
        "Rendered-HTML analysis, so client-side content is judged as machines see it",
        "Issues ranked by the pipeline sitting behind the affected pages",
        "Each finding carries the specific pages and the change required",
      ]}
      media="right"
      tone="paper"
      level="sub"
    >
      <ProductPanel
        title="Diagnostics · property scan"
        meta="prioritised"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ul>
            {diagnostics.map((d) => (
              <li
                key={d.issue}
                className="grid gap-1.5 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="min-w-0 text-[0.9375rem] font-medium leading-snug">{d.issue}</p>
                  <span className="text-data shrink-0 text-[0.65rem] uppercase tracking-[0.14em] text-signal">
                    {d.sev}
                  </span>
                </div>
                <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">{d.effect}</p>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function ArchitectureSection() {
  return (
    <ProductSection
      id="architecture"
      eyebrow="Content architecture"
      title="Topical authority as a map, not a backlog."
      lede="QWA models the subject you want to be known for as a hierarchy of pillars, supporting pages and answerable questions — then shows which parts of that map exist, which are thin, and which are missing entirely."
      points={[
        "Pillar, cluster and question layers held as one structure",
        "Existing pages assigned to the map; overlaps and gaps made explicit",
        "Internal linking and schema recommendations derived from the same map",
      ]}
      media="left"
      level="sub"
    >
      <ProductPanel title="Authority map · coverage" meta="3 layers" footer={<IllustrativeNote />}>
        <PanelBlock label="Pillar">
          <p className="text-[0.9375rem] font-medium">Choosing and comparing coverage</p>
        </PanelBlock>
        <PanelBlock label="Supporting pages" muted>
          <ul className="grid gap-2 text-[0.875rem] text-muted-foreground">
            <li>Comparison guide — exists, strong</li>
            <li>Roadside explainer — exists, thin</li>
            <li>Multi-vehicle household guide — missing</li>
            <li>Switching timeline — missing</li>
          </ul>
        </PanelBlock>
        <PanelBlock label="Recommendations" muted={false}>
          <FieldGrid
            fields={[
              { label: "New pages", value: "2 proposed" },
              { label: "Consolidations", value: "3 URLs → 1" },
              { label: "Internal links", value: "17 suggested" },
              { label: "Schema", value: "FAQ + Product", accent: true },
            ]}
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const intents = [
  {
    cluster: "Compare coverage options",
    intent: "Evaluation",
    outcome: "Highest qualified pipeline",
  },
  { cluster: "Is roadside worth it", intent: "Research", outcome: "Assists later conversations" },
  { cluster: "Cancel and switch", intent: "Transactional", outcome: "Fastest to appointment" },
  {
    cluster: "Cheapest coverage",
    intent: "Price shopping",
    outcome: "Low close rate, deprioritised",
  },
];

export function IntentSection() {
  return (
    <ProductSection
      id="intent"
      eyebrow="Intent and revenue"
      title="Not all demand is worth ranking for."
      lede="Query clusters are grouped by intent and joined to what happened next: conversations started, appointments held, revenue attributed. Effort follows the clusters that produce customers."
      media="below"
      tone="paper"
      level="sub"
    >
      <ProductPanel title="Intent clusters" meta="joined to outcomes" footer={<IllustrativeNote />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["Cluster", "Intent", "Downstream outcome"].map((h) => (
                  <th
                    key={h}
                    className="text-data px-5 py-3 text-[0.65rem] font-normal uppercase tracking-[0.14em] text-muted-foreground/80"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {intents.map((r) => (
                <tr key={r.cluster} className="border-b border-hairline last:border-b-0">
                  <td className="px-5 py-4 text-[0.9375rem]">{r.cluster}</td>
                  <td className="text-data px-5 py-4 text-[0.8125rem] text-muted-foreground">
                    {r.intent}
                  </td>
                  <td className="px-5 py-4 text-[0.875rem] text-muted-foreground">{r.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * GEO — ink moment
 * ---------------------------------------------------------------------- */

const geo = [
  {
    label: "Entity clarity",
    body: "Who you are, what you sell and where you operate stated unambiguously and consistently across the property.",
  },
  {
    label: "Structured answers",
    body: "Questions answered in self-contained passages that stand on their own when quoted out of context.",
  },
  {
    label: "Sourceability",
    body: "Claims tied to a date, a method or a named source so an answer engine has something to cite.",
  },
  {
    label: "Freshness",
    body: "Material facts carry visible last-reviewed dates and a review cadence.",
  },
  {
    label: "Authority signals",
    body: "Author, expertise and organisational identity expressed in markup, not just in prose.",
  },
  {
    label: "Citation-worthiness",
    body: "Original data, definitions and comparisons that are worth referencing rather than restating.",
  },
];

export function GeoSection() {
  return (
    <Section tone="ink" id="geo" className="scroll-mt-24 py-16 sm:py-20 lg:py-24">
      <Container>
        <MotionReveal className="max-w-3xl">
          <p className="text-eyebrow">Generative and AI answer surfaces</p>
          <h3 className="text-display mt-4 max-w-[22ch] text-balance text-[clamp(1.5rem,2.5vw,2rem)]">
            Written to be understood by the systems doing the answering.
          </h3>
          <p className="mt-5 max-w-[36rem] text-pretty text-[1.0625rem] leading-relaxed text-ink-foreground/70">
            Answer engines summarise and cite. QWA optimises for the properties that make a page
            usable in that setting. No system can guarantee inclusion in an AI answer, and QWA does
            not claim to — it makes your material as citable as the medium allows.
          </p>
        </MotionReveal>

        <MotionReveal delay={0.08} className="mt-12">
          <ProductPanel
            tone="ink"
            title="GEO readiness · coverage cluster"
            meta="6 dimensions"
            footer={
              <IllustrativeNote tone="ink">
                Readiness dimensions, not a ranking or inclusion guarantee.
              </IllustrativeNote>
            }
          >
            <PanelBlock className="py-0">
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
                {geo.map((g, i) => (
                  <motion.li
                    key={g.label}
                    className="min-w-0 border-b border-ink-foreground/12 px-5 py-5 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: duration.base, ease: ease.out, delay: i * 0.06 }}
                  >
                    <p className="text-[0.9375rem] font-medium">{g.label}</p>
                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-foreground/60">
                      {g.body}
                    </p>
                  </motion.li>
                ))}
              </ul>
            </PanelBlock>
          </ProductPanel>
        </MotionReveal>
      </Container>
    </Section>
  );
}

/* ---------------------------------------------------------------------- */

export function ProductionSection() {
  return (
    <ProductSection
      id="production"
      eyebrow="Content production"
      title="Brief, draft, review, publish-ready — and it stops there."
      lede="QWA moves a page from opportunity to publish-ready through named stages. The final step is a person. Nothing auto-publishes unless your team explicitly turns that on."
      points={[
        "Brief carries the intent, the claim boundaries and the target entity",
        "Draft is generated against the brief and the existing authority map",
        "Factual and brand review are separate, recorded approvals",
      ]}
      media="right"
      level="sub"
    >
      <ProductPanel
        title="Page · multi-vehicle guide"
        meta="stage 3 of 4"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ol>
            {[
              ["Brief", "Intent, entity, claim boundaries", "Complete"],
              ["Draft", "Generated against authority map", "Complete"],
              ["Review", "Factual and brand review", "In progress"],
              ["Publish-ready", "Held for human publish", "Blocked"],
            ].map(([stage, detail, state]) => (
              <li
                key={stage}
                className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-hairline px-5 py-4 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{stage}</p>
                  <p className="mt-1 text-[0.8125rem] text-muted-foreground">{detail}</p>
                </div>
                <span className="text-data shrink-0 text-[0.7rem] text-muted-foreground">
                  {state}
                </span>
              </li>
            ))}
          </ol>
        </PanelBlock>
        <PanelBlock muted>
          <DecisionCallout
            label="Publish policy"
            value="Human required"
            rule="Auto-publish is off by default and enabled only per collection."
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

export function MonitoringSection() {
  return (
    <ProductSection
      id="monitoring"
      eyebrow="Visibility monitoring"
      title="Movement tracked where it can be measured."
      lede="Where a data source is connected, QWA tracks visibility over time and links it to the pages and clusters it belongs to. Where nothing is connected, the panel says so instead of inventing a chart."
      media="below"
      level="sub"
    >
      <div className="grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Cluster visibility",
            value: "Tracked",
            caption: "Per cluster, once a search data source is connected.",
          },
          {
            label: "Page opportunities",
            value: "Ranked",
            caption: "Pages closest to a meaningful position change.",
          },
          {
            label: "Answer presence",
            value: "Observed",
            caption: "Sampled, best-effort, never presented as guaranteed.",
          },
          {
            label: "Revenue join",
            value: "Native",
            caption: "Sessions joined to conversations and closed-won.",
          },
        ].map((s) => (
          <StatCell key={s.label} {...s} />
        ))}
      </div>
      <IllustrativeNote className="mt-8">
        Placeholder states shown. Monitoring reflects only sources configured for your deployment.
      </IllustrativeNote>
    </ProductSection>
  );
}

/* ---------------------------------------------------------------------- */

const searchGovernance = [
  {
    control: "Editorial approval",
    held: "Content lead",
    detail: "No page reaches publish-ready without a named editorial sign-off.",
  },
  {
    control: "Factual review",
    held: "Subject owner",
    detail: "Claims are checked against sources before review can be closed.",
  },
  {
    control: "Brand rules",
    held: "Brand",
    detail: "Tone, prohibited language and claim boundaries enforced at draft time.",
  },
  {
    control: "Auto-publish",
    held: "Off by default",
    detail: "Enabled per collection, never globally, and always reversible.",
  },
  {
    control: "Change history",
    held: "System",
    detail: "Every draft, edit and approval retained against the page record.",
  },
];

export function SearchGovernanceSection() {
  return (
    <ProductSection
      id="governance"
      eyebrow="Governance"
      title="Scale that does not put your brand at risk."
      lede="Search work fails when volume outruns oversight. QWA keeps the approval gates in front of publication and records who cleared what."
      media="below"
      tone="paper"
      level="sub"
    >
      <ProductPanel title="Controls" meta="ownership" footer={<IllustrativeNote />}>
        <PanelBlock className="py-0">
          <ul>
            {searchGovernance.map((g) => (
              <li
                key={g.control}
                className="grid gap-1.5 border-b border-hairline py-4 first:pt-5 last:border-b-0 last:pb-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{g.control}</p>
                  <p className="text-data mt-1 text-[0.7rem] text-muted-foreground/70">
                    Held by {g.held}
                  </p>
                </div>
                <p className="text-[0.875rem] leading-relaxed text-muted-foreground">{g.detail}</p>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
      <div className="mt-8 flex flex-wrap gap-2.5">
        {["CMS", "Search console data", "Analytics", "Log files", "Warehouse"].map((c) => (
          <Chip key={c}>{c}</Chip>
        ))}
      </div>
      <IllustrativeNote className="mt-6">
        Adapter categories only. Nothing is connected until configured for your deployment.
      </IllustrativeNote>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Surface map — how buyers actually discover the business
 * ---------------------------------------------------------------------- */

const surfaces = [
  { surface: "Classic search", role: "Evaluation and comparison queries", state: "Mapped" },
  { surface: "Maps and local", role: "Near-me and service-area intent", state: "Mapped" },
  { surface: "AI answer engines", role: "Summarised answers with citations", state: "Sampled" },
  { surface: "Assistants and chat", role: "Conversational product questions", state: "Sampled" },
  { surface: "Owned content", role: "Guides, comparisons and FAQ passages", state: "Mapped" },
  {
    surface: "Third-party sources",
    role: "Directories and references answers quote",
    state: "Observed",
  },
];

export function SurfaceMapSection() {
  return (
    <ProductSection
      id="surfaces"
      eyebrow="Discovery surfaces"
      title="Discovery is no longer one surface."
      lede="A buyer may never see a results page. QWA maps every surface where your category is discovered — search, maps, answer engines, assistants and the sources they quote — and records what is understood about you on each."
      points={[
        "One map across classic search, local, answer engines and assistants",
        "Sampled surfaces labelled as sampled, never presented as guaranteed",
        "Gaps and competing sources named per surface, not averaged into a score",
      ]}
      media="right"
      level="sub"
    >
      <ProductPanel
        title="Surface map · coverage category"
        meta="6 surfaces"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ul>
            {surfaces.map((s) => (
              <li
                key={s.surface}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3.5 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{s.surface}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{s.role}</p>
                </div>
                <span
                  className={cn(
                    "text-data shrink-0 text-[0.7rem] uppercase tracking-[0.12em]",
                    s.state === "Mapped" ? "text-signal" : "text-muted-foreground/70",
                  )}
                >
                  {s.state}
                </span>
              </li>
            ))}
          </ul>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Visibility → qualified demand
 * ---------------------------------------------------------------------- */

export function DiscoveryDemandSection() {
  return (
    <ProductSection
      id="demand"
      eyebrow="Qualified demand"
      title="A citation only counts once someone talks to you."
      lede="Presence on a surface is the beginning. QWA follows the session into the conversation it produced — chat, call, form or message — and hands it to the Revenue Engine with the cluster and page that earned it attached."
      points={[
        "Discovery session joined to the conversation it started, on one record",
        "Cluster, page and surface carried into the conversation layer",
        "Answered while intent is alive, not queued as an anonymous lead",
      ]}
      media="left"
      tone="paper"
      level="sub"
    >
      <ProductPanel
        title="Handoff · inbound from coverage cluster"
        meta="answer surface"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-5">
          <DecisionCallout
            label="Handed to"
            value="Revenue Engine · immediate response"
            rule="Cluster, page and surface attached before the first reply"
          />
        </PanelBlock>
        <PanelBlock label="Carried with the record" muted>
          <FieldGrid
            fields={[
              { label: "Cluster", value: "Compare coverage options" },
              { label: "Page", value: "Coverage comparison guide", accent: true },
              { label: "Surface", value: "Answer engine citation" },
              { label: "First response", value: "Under a minute" },
            ]}
          />
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}

/* -------------------------------------------------------------------------
 * Discovery → revenue attribution and learning
 * ---------------------------------------------------------------------- */

const investment = [
  { topic: "Compare coverage options", stage: "Evaluation", call: "Invest" },
  { topic: "Cancel and switch", stage: "Transactional", call: "Invest" },
  { topic: "Is roadside worth it", stage: "Research", call: "Maintain" },
  { topic: "Cheapest coverage", stage: "Price shopping", call: "Reduce" },
];

export function DiscoveryRevenueSection() {
  return (
    <ProductSection
      id="attribution"
      eyebrow="Attribution and learning"
      title="Discovery judged at the far end of the chain."
      lede="Each cluster, page, entity and surface is traced through conversation, appointment and closed revenue. The next investment decision follows the evidence, and a person can overrule it."
      points={[
        "Contribution traced to closed revenue, not to impressions or position",
        "Invest, maintain and reduce decisions stated with the rule behind them",
        "Surfaces that only assist are credited as assists, not as last click",
      ]}
      media="right"
      level="sub"
    >
      <ProductPanel
        title="Investment view · coverage category"
        meta="joined to closed revenue"
        footer={<IllustrativeNote />}
      >
        <PanelBlock className="py-0">
          <ul>
            {investment.map((r) => (
              <li
                key={r.topic}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3.5 first:pt-5 last:border-b-0 last:pb-5"
              >
                <div className="min-w-0">
                  <p className="text-[0.9375rem] font-medium">{r.topic}</p>
                  <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{r.stage}</p>
                </div>
                <span
                  className={cn(
                    "text-data shrink-0 text-[0.7rem] uppercase tracking-[0.12em]",
                    r.call === "Invest" ? "text-signal" : "text-muted-foreground/70",
                  )}
                >
                  {r.call}
                </span>
              </li>
            ))}
          </ul>
        </PanelBlock>
        <PanelBlock label="What the system learns" muted>
          <p className="text-[0.875rem] leading-relaxed text-muted-foreground">
            Topics and entities that produced qualified conversations are promoted in the authority
            map and seed the next content brief. Nothing is published on that basis without review.
          </p>
        </PanelBlock>
      </ProductPanel>
    </ProductSection>
  );
}
