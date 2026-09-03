export type MetricId =
  "attributed_revenue" | "qualified_pipeline" | "speed_to_lead" | "booking_rate";

export type MetricDefinition = {
  id: MetricId;
  label: string;
  businessDefinition: string;
  formula: string;
  timeBasis: string;
  currencyBehavior: "account_currency" | "not_applicable";
  attributionModel: string | null;
  freshness: string;
  owner: string;
  limitations: string;
};

export const metricRegistry: Record<MetricId, MetricDefinition> = {
  attributed_revenue: {
    id: "attributed_revenue",
    label: "Attributed revenue",
    businessDefinition: "Closed revenue joined to a known acquisition or conversation touch.",
    formula: "sum(completed order net value assigned by the selected attribution model)",
    timeBasis: "order completed in selected window",
    currencyBehavior: "account_currency",
    attributionModel: "selected account model",
    freshness: "near real-time after order ingestion",
    owner: "Revenue Intelligence",
    limitations: "Excludes orders without a resolved account currency or attribution decision.",
  },
  qualified_pipeline: {
    id: "qualified_pipeline",
    label: "Qualified pipeline",
    businessDefinition: "Open opportunity value after QWA qualification.",
    formula: "sum(open qualified opportunity value)",
    timeBasis: "current snapshot",
    currencyBehavior: "account_currency",
    attributionModel: null,
    freshness: "within five minutes",
    owner: "Revenue Operations",
    limitations: "Unweighted value; it is not a revenue forecast.",
  },
  speed_to_lead: {
    id: "speed_to_lead",
    label: "Median speed to lead",
    businessDefinition: "Median time from lead receipt to first outbound response.",
    formula: "median(first response occurredAt - lead receivedAt)",
    timeBasis: "leads received in selected window",
    currencyBehavior: "not_applicable",
    attributionModel: null,
    freshness: "near real-time",
    owner: "Quantum Concierge",
    limitations: "Requires correlated lead and response events.",
  },
  booking_rate: {
    id: "booking_rate",
    label: "Booking rate",
    businessDefinition: "Qualified leads that booked an appointment in the selected window.",
    formula: "qualified leads with booked appointment / qualified leads",
    timeBasis: "qualification occurred in selected window",
    currencyBehavior: "not_applicable",
    attributionModel: null,
    freshness: "within five minutes",
    owner: "Revenue Operations",
    limitations: "Late bookings can restate prior periods.",
  },
};

export function getMetricDefinition(id: MetricId) {
  return metricRegistry[id];
}
