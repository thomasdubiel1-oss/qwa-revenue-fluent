import { z } from "zod";

export const canonicalEventSchema = z
  .object({
    eventId: z.string().min(1),
    eventType: z.string().min(1),
    occurredAt: z.string().datetime(),
    receivedAt: z.string().datetime(),
    tenantId: z.string().min(1),
    accountId: z.string().min(1),
    actorType: z.enum(["user", "agent", "system", "customer", "integration"]),
    actorId: z.string().optional(),
    contactId: z.string().optional(),
    customerId: z.string().optional(),
    sessionId: z.string().optional(),
    channel: z.string().optional(),
    sourceSystem: z.string().min(1),
    campaignId: z.string().optional(),
    agentId: z.string().optional(),
    agentRunId: z.string().optional(),
    action: z.string().optional(),
    status: z.string().optional(),
    monetaryValue: z.number().finite().optional(),
    currency: z.string().length(3).optional(),
    cost: z.number().nonnegative().optional(),
    confidence: z.number().min(0).max(1).optional(),
    correlationId: z.string().min(1),
    causationId: z.string().optional(),
    metadata: z.record(z.unknown()),
    schemaVersion: z.number().int().positive(),
  })
  .superRefine((event, context) => {
    if (event.monetaryValue !== undefined && !event.currency) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["currency"],
        message: "Currency is required for monetary events.",
      });
    }
    if (event.actorType === "agent" && (!event.agentId || !event.agentRunId)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agentRunId"],
        message: "Agent events require agentId and agentRunId.",
      });
    }
  });

export type CanonicalEvent = z.infer<typeof canonicalEventSchema>;

export const TWIN_EVENT_TYPES = [
  "ad_clicked",
  "page_viewed",
  "lead_created",
  "response_sent",
  "response_failed",
  "lead_qualified",
  "appointment_booked",
  "sales_interaction_recorded",
  "order_completed",
  "attribution_assigned",
  "attribution_conflicted",
  "recommendation_created",
  "approval_requested",
  "agent_action_failed",
  "human_intervened",
] as const;
