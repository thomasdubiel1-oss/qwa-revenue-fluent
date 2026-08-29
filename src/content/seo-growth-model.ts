/**
 * Programmatic SEO content model — Industry x Problem x Solution.
 *
 * IMPORTANT: this module is a typed planning model only. It intentionally does
 * NOT generate routes, sitemap entries or indexable pages. Combinations become
 * real pages one at a time, only after a human has written differentiated
 * content and the combination has passed the quality gates documented in
 * docs/seo-growth-plan.md.
 *
 * Mass-generating the cartesian product would produce thin, near-duplicate
 * doorway pages. Nothing here is wired into src/config/seo.ts.
 */

import type { IndustrySlug } from "./industries";
import type { SolutionSlug } from "./solutions";

export type ProblemSlug =
  | "slow-lead-response"
  | "missed-calls"
  | "no-show-appointments"
  | "unqualified-leads"
  | "dormant-customers"
  | "untracked-revenue"
  | "manual-follow-up";

export interface ProblemDefinition {
  slug: ProblemSlug;
  /** Buyer-language name for the problem, not internal jargon. */
  label: string;
  /** The observable symptom a buyer would describe themselves. */
  symptom: string;
  /** Which solution page owns the general answer. */
  primarySolution: SolutionSlug;
}

export const problems: Record<ProblemSlug, ProblemDefinition> = {
  "slow-lead-response": {
    slug: "slow-lead-response",
    label: "Slow lead response",
    symptom: "Enquiries wait minutes or hours for a first reply.",
    primarySolution: "ai-lead-response",
  },
  "missed-calls": {
    slug: "missed-calls",
    label: "Missed calls",
    symptom: "Inbound calls go unanswered outside desk hours or during peaks.",
    primarySolution: "ai-voice-agent",
  },
  "no-show-appointments": {
    slug: "no-show-appointments",
    label: "No-show appointments",
    symptom: "Booked slots are lost to no-shows and late cancellations.",
    primarySolution: "ai-appointment-setting",
  },
  "unqualified-leads": {
    slug: "unqualified-leads",
    label: "Unqualified leads",
    symptom: "Staff time is spent on enquiries that were never going to buy.",
    primarySolution: "ai-appointment-setting",
  },
  "dormant-customers": {
    slug: "dormant-customers",
    label: "Dormant customers",
    symptom: "Past customers lapse and are never contacted again.",
    primarySolution: "customer-reactivation",
  },
  "untracked-revenue": {
    slug: "untracked-revenue",
    label: "Untracked revenue",
    symptom: "Closed revenue cannot be traced back to the spend that produced it.",
    primarySolution: "revenue-attribution",
  },
  "manual-follow-up": {
    slug: "manual-follow-up",
    label: "Manual follow-up",
    symptom: "Follow-up depends on someone remembering to do it.",
    primarySolution: "ai-lead-response",
  },
};

/** A candidate page. Candidacy is not permission to publish. */
export interface ProgrammaticCandidate {
  industry: IndustrySlug;
  problem: ProblemSlug;
  solution: SolutionSlug;
  /** Proposed path, only used once the page is written by a human. */
  path: string;
}

/** Quality gates every candidate must pass before it is written or indexed. */
export const qualityGates = [
  "differentiated-intent",
  "unique-industry-context",
  "substantive-usefulness",
  "internal-linking",
  "canonical-correctness",
  "human-review",
] as const;

export type QualityGate = (typeof qualityGates)[number];

export interface CandidateReview {
  candidate: ProgrammaticCandidate;
  passed: QualityGate[];
  notes: string;
}

export function candidatePath(industry: IndustrySlug, problem: ProblemSlug): string {
  return `/industries/${industry}/${problem}`;
}

export function buildCandidate(
  industry: IndustrySlug,
  problem: ProblemSlug,
): ProgrammaticCandidate {
  const definition = problems[problem];
  return {
    industry,
    problem,
    solution: definition.primarySolution,
    path: candidatePath(industry, problem),
  };
}

/** True only when every gate has been recorded as passed by a human reviewer. */
export function isPublishable(review: CandidateReview): boolean {
  return qualityGates.every((gate) => review.passed.includes(gate));
}
