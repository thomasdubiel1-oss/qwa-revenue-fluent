export type EntityId<T extends string> = string & { readonly __entity: T };

export type Tenant = { id: EntityId<"tenant">; name: string };
export type Account = {
  id: EntityId<"account">;
  tenantId: Tenant["id"];
  name: string;
  currency: string;
  timezone: string;
};
export type Contact = { id: EntityId<"contact">; accountId: Account["id"] };
export type Lead = {
  id: EntityId<"lead">;
  contactId: Contact["id"];
  status: "new" | "engaged" | "qualified" | "abandoned" | "converted";
};
export type Appointment = {
  id: EntityId<"appointment">;
  leadId: Lead["id"];
  status: "scheduled" | "attended" | "missed" | "cancelled";
};
export type Order = {
  id: EntityId<"order">;
  contactId: Contact["id"];
  value: number;
  currency: string;
  status: "pending" | "completed" | "refunded";
};
export type AgentRun = {
  id: EntityId<"agent_run">;
  agentId: EntityId<"agent">;
  status: "running" | "completed" | "failed" | "intervened";
};
export type Recommendation = {
  id: EntityId<"recommendation">;
  state: "Suggested" | "Awaiting Approval" | "Approved" | "Rejected";
  confidence: number;
};
