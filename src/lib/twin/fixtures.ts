import type { ExecutiveSnapshot } from "./types";

export const executiveSnapshotFixture: ExecutiveSnapshot = {
  account: "Northline Growth Group",
  generatedAt: "2026-09-02T18:30:00.000Z",
  state: "simulated",
  release: "V1",
  metrics: [
    { id: "attributed_revenue", label: "Attributed revenue", value: "$428,640", change: "+18.4%", direction: "up", definition: "Closed revenue joined to a known acquisition or conversation touch." },
    { id: "qualified_pipeline", label: "Qualified pipeline", value: "$1.24M", change: "+9.7%", direction: "up", definition: "Open opportunity value after QWA qualification." },
    { id: "speed_to_lead", label: "Median speed to lead", value: "23 sec", change: "−31 sec", direction: "up", definition: "Median time from lead receipt to first outbound response." },
    { id: "booking_rate", label: "Booking rate", value: "38.6%", change: "+4.2 pts", direction: "up", definition: "Qualified leads that booked an appointment in the selected window." },
  ],
  channels: [
    { name: "Meta", spend: 48200, revenue: 221720, roas: 4.6 },
    { name: "Google", spend: 39100, revenue: 144670, roas: 3.7 },
    { name: "TikTok", spend: 21750, revenue: 58725, roas: 2.7 },
    { name: "Organic", spend: 0, revenue: 35025, roas: 0 },
  ],
  funnel: [
    { label: "Signals", count: 18420, rate: 100 },
    { label: "Leads", count: 2384, rate: 12.9 },
    { label: "Qualified", count: 1198, rate: 50.3 },
    { label: "Appointments", count: 462, rate: 38.6 },
    { label: "Sales", count: 137, rate: 29.7 },
  ],
  alerts: [
    { id: "a1", severity: "high", title: "Voice agent handoff failures increased", evidence: "14 failed transfers in 24h; baseline is 3." },
    { id: "a2", severity: "medium", title: "TikTok CAC exceeds guardrail", evidence: "$286 CAC versus $240 approved ceiling." },
    { id: "a3", severity: "medium", title: "Attribution conflict needs review", evidence: "Meta and Google both claim journey QWA-10482." },
  ],
  recommendation: {
    id: "rec-104",
    title: "Move $4,000 from TikTok prospecting to Meta retargeting",
    expectedImpact: "+$11.2K attributed revenue over 14 days",
    confidence: 82,
    evidence: ["Meta retargeting marginal ROAS: 5.1×", "TikTok prospecting marginal ROAS: 1.8×", "Frequency remains below the 3.5 guardrail"],
    state: "Awaiting Approval",
  },
  journeys: [
    {
      id: "QWA-10482", contact: "Elena Torres", source: "Meta", campaign: "Executive Growth — Q3", value: 12400, outcome: "Closed won",
      steps: [
        { id: "j1", label: "Ad clicked", system: "Meta Ads", occurredAt: "09:14:02", status: "completed", detail: "Executive Growth creative 04", evidence: "fbclid captured" },
        { id: "j2", label: "Lead submitted", system: "QWA Forms", occurredAt: "09:15:18", status: "completed", detail: "High-intent assessment form", evidence: "Consent and UTM stored" },
        { id: "j3", label: "AI response", system: "Quantum Concierge", occurredAt: "09:15:37", status: "completed", detail: "SMS delivered in 19 seconds", evidence: "Delivery ID sms_8241" },
        { id: "j4", label: "Qualified", system: "Revenue Agent", occurredAt: "09:19:44", status: "completed", detail: "Budget, authority and timing confirmed", evidence: "Confidence 91%" },
        { id: "j5", label: "Appointment", system: "HighLevel", occurredAt: "09:22:06", status: "completed", detail: "Strategy call booked", evidence: "Calendar event ghl_721" },
        { id: "j6", label: "Sales assist", system: "QWA Copilot", occurredAt: "14:01:10", status: "completed", detail: "Objection brief shown to rep", evidence: "Rep opened brief" },
        { id: "j7", label: "Purchase", system: "Stripe", occurredAt: "14:38:27", status: "completed", detail: "$12,400 annual contract", evidence: "Payment pi_6382" },
        { id: "j8", label: "Attribution", system: "QWA Graph", occurredAt: "14:38:31", status: "conflict", detail: "Meta primary; Google assist disputed", evidence: "Review required" },
        { id: "j9", label: "Optimization", system: "Decision Agent", occurredAt: "14:42:12", status: "waiting", detail: "Budget shift proposed", evidence: "Awaiting human approval" },
      ],
    },
  ],
};
