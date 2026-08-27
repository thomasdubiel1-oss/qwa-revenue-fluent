import { motion } from "motion/react";
import { Container, Section, SectionHeading } from "./primitives";
import { MotionItem, MotionStagger } from "./motion-primitives";
import { duration, ease } from "@/lib/motion";
import { useHydratedReducedMotion as useReducedMotion } from "@/hooks/use-hydrated-reduced-motion";

export type Capability = {
  id: string;
  name: string;
  outcome: string;
  body: string;
  /** Route target for Phase 2 — kept here so pages can reuse this data. */
  href: string;
};

/** Reusable across the homepage and future platform routes. */
export const capabilities: Capability[] = [
  {
    id: "capture",
    name: "Signal capture",
    outcome: "No inbound goes unread",
    body: "Ads, search, forms, calls, chat and social land in one record with the campaign, creative and page that produced them.",
    href: "/platform/signal-capture",
  },
  {
    id: "conversation",
    name: "AI conversation",
    outcome: "Reply in seconds, not hours",
    body: "Voice, SMS, email and DM handled in your language and your offer rules, with escalation limits your team defines.",
    href: "/platform/conversation",
  },
  {
    id: "qualification",
    name: "Qualification",
    outcome: "Reps only see real buyers",
    body: "Budget, timing, location and fit resolved in the conversation and written to the record — no gated forms.",
    href: "/platform/qualification",
  },
  {
    id: "scheduling",
    name: "Scheduling",
    outcome: "More appointments kept",
    body: "Live calendar availability, confirmations, reminders and reschedules handled without a coordinator.",
    href: "/platform/scheduling",
  },
  {
    id: "assist",
    name: "Sales assistance",
    outcome: "Every rep walks in prepared",
    body: "Full history, the likely objection and the next best offer delivered before the conversation starts.",
    href: "/platform/sales-assistance",
  },
  {
    id: "attribution",
    name: "Revenue attribution",
    outcome: "Know what actually paid",
    body: "Closed revenue joined back to campaign, creative, conversation and rep — not to a last click.",
    href: "/platform/attribution",
  },
  {
    id: "reactivation",
    name: "Reactivation",
    outcome: "Recover pipeline you already paid for",
    body: "Dormant leads and past customers re-engaged on intent signals rather than calendar dates.",
    href: "/platform/reactivation",
  },
  {
    id: "governance",
    name: "Governance",
    outcome: "Autonomy inside your limits",
    body: "Policy, budget ceilings, approval steps and full audit history on every automated action.",
    href: "/platform/governance",
  },
];

export function PlatformPreview() {
  const reduced = useReducedMotion();

  return (
    <Section id="platform">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24">
          <SectionHeading
            eyebrow="Platform"
            title="Eight capabilities, one operating system."
            lede="Each one is useful alone. Together they close the loop between demand and revenue."
            className="lg:sticky lg:top-28 lg:self-start"
          />

          <MotionStagger stagger={0.045} className="min-w-0 border-t border-hairline">
            {capabilities.map((c) => (
              <MotionItem key={c.id}>
                <motion.div
                  className="group border-b border-hairline py-8"
                  whileHover={reduced ? {} : { x: 4 }}
                  transition={{ duration: duration.fast, ease: ease.out }}
                >
                  <div className="min-w-0">
                    <h3 className="text-[1.25rem] font-medium tracking-tight sm:text-[1.375rem]">
                      {c.outcome}
                    </h3>
                    <p className="mt-3 max-w-[40rem] text-[0.9375rem] leading-relaxed text-muted-foreground">
                      {c.body}
                    </p>
                    <p className="mt-4 text-[0.8125rem] text-signal">{c.name}</p>
                  </div>
                </motion.div>
              </MotionItem>
            ))}
          </MotionStagger>
        </div>
      </Container>
    </Section>
  );
}
