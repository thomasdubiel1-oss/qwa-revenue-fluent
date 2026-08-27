/**
 * QWA storyboard package — types.
 *
 * A storyboard is the copy-ready production document for one manifest slot.
 * LTX Studio is a MANUAL HANDOFF provider in this project: nothing here calls
 * an LTX API, and no key is required. The prompts below are written to be
 * pasted into LTX by a human, and the resulting assets return through the
 * usage-rights gate in `src/lib/video/usage-rights.ts`.
 */

/** Production gates. A slot may only move one step at a time, in order. */
export type StoryboardGate =
  /** The written package exists and is copy-ready for LTX. */
  | "storyboard_ready"
  /** A human reviewed the LTX storyboard frames and signed off. */
  | "storyboard_approved"
  /** A rough LTX motion prototype exists. Internal use only. */
  | "prototype_ready"
  /** The prototype passed the acceptance checklist. */
  | "prototype_approved"
  /** Optional: a premium provider re-rendered approved shots. */
  | "premium_escalation"
  /** Rights recorded by a human; only now may a source be bound. */
  | "commercially_cleared";

export const STORYBOARD_GATE_ORDER: StoryboardGate[] = [
  "storyboard_ready",
  "storyboard_approved",
  "prototype_ready",
  "prototype_approved",
  "premium_escalation",
  "commercially_cleared",
];

export const STORYBOARD_GATE_LABEL: Record<StoryboardGate, string> = {
  storyboard_ready: "Storyboard ready",
  storyboard_approved: "Storyboard approved",
  prototype_ready: "Prototype ready",
  prototype_approved: "Prototype approved",
  premium_escalation: "Premium escalation (only if required)",
  commercially_cleared: "Commercially cleared",
};

export const STORYBOARD_GATE_CRITERIA: Record<StoryboardGate, string> = {
  storyboard_ready:
    "Shot list, master prompt, negative list and framing rules written and internally consistent. No generation spend yet.",
  storyboard_approved:
    "LTX storyboard frames reviewed against brand fit and continuity. Any shot that reads as stock-business or AI spectacle is rewritten before motion.",
  prototype_ready:
    "Low-cost LTX motion pass exists at draft quality. Marked prototype_only; it can never reach a public route.",
  prototype_approved:
    "Prototype passes the full acceptance checklist, including the loop seam and the 4:5 mobile crop.",
  premium_escalation:
    "Only if LTX output cannot hold the light quality or seam. Escalate approved shots only, never the whole sequence.",
  commercially_cleared:
    "Asset regenerated or cleared under a commercial plan, clearance recorded by a human, then a source may be bound in the manifest.",
};

export interface StoryboardShot {
  /** 1-based shot number. */
  n: number;
  /** Working title for the beat. */
  title: string;
  /** Duration in seconds. Sum must equal the package runtime. */
  seconds: number;
  composition: string;
  action: string;
  camera: string;
  transitionIn: string;
  transitionOut: string;
  /** Framing at the desktop ratio. */
  desktopFraming: string;
  /** What must survive the portrait crop. */
  mobileFraming: string;
  /** Paste-ready LTX prompt for this shot. */
  prompt: string;
  /** Paste-ready avoid list for this shot. */
  negative: string;
  continuity: string;
}

export interface StoryboardPackage {
  /** Manifest id this package produces footage for. */
  mediaId: string;
  title: string;
  /** One-line story arc. */
  arc: string;
  runtimeSeconds: number;
  loopStrategy: string;
  /** Global look, applied to every shot. */
  visualDirection: string[];
  /** Global avoid list, applied to every shot. */
  globalNegative: string[];
  shots: StoryboardShot[];
  /** Full-sequence prompt for LTX storyboard generation. */
  masterPrompt: string;
  /** Rough-motion prompt, used only after storyboard approval. */
  prototypePrompt: string;
  acceptanceChecklist: { label: string; test: string }[];
  gate: StoryboardGate;
  /** True only when an LTX API integration exists. It does not. */
  apiConnected: boolean;
  handoffNotes: string;
}
