import * as React from "react";

import { FlagshipMedia } from "@/components/qwa/media/flagship-media";

import { StoryFanOut, StoryFrame, StoryJourney, type StoryStage } from "./story-primitives";

/**
 * The six QWA product stories.
 *
 * Each one is a code-driven composition bound to its existing flagship media
 * slot, so a cleared still or clip can replace it later with zero layout
 * change. Every frame has an explicit beginning, progression and outcome, and
 * teal appears only on the active state, the outcome and the return path.
 */

const FOOTNOTE = "Illustrative composition — no customer data shown.";

/* 1 ── Revenue Engine ---------------------------------------------------- */

const revenueStages: StoryStage[] = [
  { label: "Lead arrives", caption: "Web, call or message", kind: "source" },
  { label: "Immediate reply", caption: "Answered in seconds", kind: "active" },
  { label: "Qualified", caption: "Fit and intent scored" },
  { label: "Follow-up", caption: "Voice, SMS, email" },
  { label: "Appointment", caption: "Booked on a real calendar" },
  { label: "Assisted sale", caption: "Rep briefed first" },
  { label: "Revenue", caption: "Closed and attributed", kind: "outcome", chip: "Won" },
];

export function RevenueEngineStory() {
  return (
    <FlagshipMedia id="revenue-engine-loop" unframed>
      <StoryFrame
        eyebrow="Revenue Engine"
        outcome="Closed loop"
        footnote={FOOTNOTE}
        description="A lead arrives, receives an immediate reply, is qualified, followed up across voice, SMS and email, booked into an appointment and closed with rep assistance. The closed revenue then returns along a teal path to the source that produced it, and back into reactivation."
      >
        <StoryJourney
          stages={revenueStages}
          returnPath={{ from: 6, to: 0, label: "Revenue attributed back · quiet leads reactivated" }}
        />
      </StoryFrame>
    </FlagshipMedia>
  );
}

/* 2 ── Voice Agent ------------------------------------------------------- */

const voiceStages: StoryStage[] = [
  { label: "Call or message", caption: "Inbound or outbound", kind: "source" },
  { label: "Context retained", caption: "Same customer, same thread", kind: "active" },
  { label: "Qualified", caption: "Needs and timing captured" },
  { label: "Action taken", caption: "Appointment or handoff", kind: "outcome", chip: "Booked" },
];

export function VoiceAgentStory() {
  return (
    <FlagshipMedia id="voice-continuity" unframed>
      <StoryFrame
        eyebrow="One customer · one thread"
        outcome="No restarts"
        footnote={FOOTNOTE}
        description="An inbound or outbound conversation continues with full context on the same customer record, qualifies the need, and ends in a booked appointment or a handoff to a person — without the customer repeating themselves."
      >
        <StoryJourney stages={voiceStages} />
        <div className="mt-9 grid gap-2 border-t border-hairline pt-6 sm:grid-cols-4">
          {["Voice", "SMS", "Email", "Web chat"].map((c) => (
            <div
              key={c}
              className="rounded-md border border-hairline bg-paper px-3 py-2 text-center text-[0.75rem] text-muted-foreground"
            >
              {c}
            </div>
          ))}
        </div>
      </StoryFrame>
    </FlagshipMedia>
  );
}

/* 3 ── Revenue Attribution ---------------------------------------------- */

const attributionStages: StoryStage[] = [
  { label: "Source", caption: "Campaign or channel", kind: "source" },
  { label: "Lead" },
  { label: "Conversation" },
  { label: "Appointment" },
  { label: "Sale", caption: "Closed won", kind: "outcome", chip: "Revenue" },
];

export function AttributionStory() {
  return (
    <FlagshipMedia id="attribution-return-path" unframed>
      <StoryFrame
        eyebrow="Revenue Attribution"
        outcome="Revenue returns to source"
        footnote={FOOTNOTE}
        description="An acquisition source produces a lead, a conversation, an appointment and a sale. When the sale closes, its revenue travels back along a single teal return path to the source that created it."
      >
        <StoryJourney
          stages={attributionStages}
          returnPath={{ from: 4, to: 0, label: "Closed revenue returned to its source" }}
        />
      </StoryFrame>
    </FlagshipMedia>
  );
}

/* 4 ── Creative / Acquisition ------------------------------------------- */

export function CreativeAcquisitionStory() {
  return (
    <FlagshipMedia id="creative-studio-pipeline" unframed>
      <StoryFrame
        eyebrow="Creative · Acquisition"
        outcome="Qualified demand"
        footnote={FOOTNOTE}
        description="A business offer becomes a controlled set of creative variants, distributed across paid, organic, email and messaging channels, and the demand it produces enters the Revenue Engine as qualified leads."
      >
        <StoryFanOut
          origin="Offer and constraints"
          branches={["Paid social", "Search", "Email", "Messaging"]}
          converge="Qualified demand"
        />
        <div className="mt-9 border-t border-hairline pt-7">
          <StoryJourney
            stages={[
              { label: "Approved variants", caption: "Bounded by brand rules", kind: "source" },
              { label: "In market", caption: "By channel" },
              { label: "Demand graded", caption: "On real outcomes", kind: "active" },
              {
                label: "Into Revenue Engine",
                caption: "Handed to the loop",
                kind: "outcome",
                chip: "Qualified",
              },
            ]}
          />
        </div>
      </StoryFrame>
    </FlagshipMedia>
  );
}

/* 5 ── Live Commerce ----------------------------------------------------- */

const liveStages: StoryStage[] = [
  { label: "Live moment", caption: "Product shown on stream", kind: "source" },
  { label: "Viewer intent", caption: "Question or hesitation", kind: "active" },
  { label: "DM and cart", caption: "Answer, then checkout" },
  { label: "Order", caption: "Inside the moment" },
  { label: "Attributed revenue", caption: "Written to the record", kind: "outcome", chip: "Sold" },
];

export function LiveCommerceStory() {
  return (
    <FlagshipMedia id="live-commerce-room" unframed>
      <StoryFrame
        eyebrow="Live Commerce"
        outcome="Sale inside the moment"
        footnote={FOOTNOTE}
        description="A live product moment produces viewer intent, which becomes a direct message and a cart, then an order placed while the room is still running, and finally revenue attributed back to the stream."
      >
        <StoryJourney
          stages={liveStages}
          returnPath={{ from: 4, to: 0, label: "Revenue attributed to the room" }}
        />
      </StoryFrame>
    </FlagshipMedia>
  );
}

/* 6 ── Intelligence / Decision ------------------------------------------ */

export function DecisionIntelligenceStory() {
  return (
    <FlagshipMedia id="decision-intelligence-guardrail" unframed>
      <StoryFrame
        eyebrow="Decision Intelligence"
        outcome="Measured outcome returns"
        footnote={FOOTNOTE}
        description="Customer and revenue signals owned by QWA converge into a decision layer, which identifies the next best action within set bounds. The action is executed and its measured outcome returns into the system to inform the next decision."
      >
        <StoryFanOut
          origin="QWA-owned signals"
          branches={["Conversations", "Appointments", "Spend", "Closed revenue"]}
          converge="Decision layer"
        />
        <div className="mt-9 border-t border-hairline pt-7">
          <StoryJourney
            stages={[
              { label: "Next best action", caption: "Proposed with its reason", kind: "active" },
              { label: "Approved bounds", caption: "Autonomy you granted" },
              { label: "Executed", caption: "On the live record" },
              {
                label: "Measured outcome",
                caption: "Kept or rolled back",
                kind: "outcome",
                chip: "Learned",
              },
            ]}
            returnPath={{ from: 3, to: 0, label: "Outcome returns into the next decision" }}
          />
        </div>
      </StoryFrame>
    </FlagshipMedia>
  );
}
