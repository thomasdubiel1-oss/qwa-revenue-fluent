export type TwinRelease = "V1" | "V2" | "V3" | "V4";
export type TwinState = "production" | "simulated" | "proposed";
export type JourneyStatus = "completed" | "active" | "failed" | "waiting" | "conflict";

export type ExecutiveMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  direction: "up" | "down" | "flat";
  definition: string;
};

export type JourneyStep = {
  id: string;
  label: string;
  system: string;
  occurredAt: string;
  status: JourneyStatus;
  detail: string;
  evidence: string;
};

export type RevenueJourney = {
  id: string;
  scenario:
    | "success"
    | "abandonment"
    | "agent_failure"
    | "human_intervention"
    | "attribution_conflict"
    | "approval_pending";
  contact: string;
  source: string;
  campaign: string;
  value: number;
  outcome: string;
  steps: JourneyStep[];
};

export type ExecutiveSnapshot = {
  account: string;
  generatedAt: string;
  state: TwinState;
  release: TwinRelease;
  metrics: ExecutiveMetric[];
  channels: { name: string; spend: number; revenue: number; roas: number }[];
  funnel: { label: string; count: number; rate: number }[];
  alerts: { id: string; severity: "high" | "medium"; title: string; evidence: string }[];
  recommendation: {
    id: string;
    title: string;
    expectedImpact: string;
    confidence: number;
    evidence: string[];
    state: "Awaiting Approval";
  };
  journeys: RevenueJourney[];
};

export interface ExecutiveSnapshotRepository {
  getSnapshot(): Promise<ExecutiveSnapshot>;
  getJourney(id: string): Promise<RevenueJourney | null>;
}
