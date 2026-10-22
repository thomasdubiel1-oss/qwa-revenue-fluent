export const dimensions = ['buyingIntent', 'painSeverity', 'budgetLikelihood', 'qwaFit', 'accessibility', 'urgency', 'evidenceQuality'] as const;
export type Dimension = typeof dimensions[number];
export type Weights = Record<Dimension, number>;
export const defaultWeights: Weights = { buyingIntent: 25, painSeverity: 20, budgetLikelihood: 10, qwaFit: 20, accessibility: 5, urgency: 10, evidenceQuality: 10 };
export const HIGH_OPPORTUNITY = 75;
export const dimensionLabels: Record<Dimension, string> = { buyingIntent: 'Buying intent', painSeverity: 'Pain severity', budgetLikelihood: 'Budget likelihood', qwaFit: 'QWA fit', accessibility: 'Accessibility', urgency: 'Urgency', evidenceQuality: 'Evidence quality' };
export type Outcome = 'reply' | 'booked' | 'won' | 'lost';
export type Opportunity = { id: string; business: string; industry: string; geography: string; source: string; text: string; date: string; url: string; pain: string; intent: 'Buying' | 'Exploring' | 'Problem aware'; components: Weights; solution: string; value: [number, number]; status: 'review' | 'approved' | 'dismissed'; };
export type Draft = { opportunityId: string; messages: string[]; channel: string; status: 'draft' | 'approved' | 'sent'; };
export type AuditEvent = { id: string; opportunityId?: string; kind: string; detail: string; at: string; };
export type ScoutState = { version: 1; opportunities: Opportunity[]; weights: Weights; drafts: Draft[]; events: AuditEvent[]; outcomes: { opportunityId: string; outcome: Outcome; at: string }[]; runs: number; };
export type SourceAdapter = { key: string; mode: 'demo' | 'live'; collect: () => Promise<Opportunity[]>; };
export const solutions = [
  { name: 'Quantum Concierge', pains: 'Missed calls · AI receptionist · voice AI', offer: 'Human-controlled voice and messaging qualification', route: '/products/voice' },
  { name: 'Revenue Engine', pains: 'Lead conversion · appointment setting · follow-up', offer: 'Response, qualification, and appointment workflow', route: '/products/revenue-engine' },
  { name: 'Acquisition', pains: 'Google Ads · demand generation · outbound', offer: 'Campaign and acquisition workflow review', route: '/products/acquisition' },
  { name: 'Search', pains: 'SEO · local search · organic lead quality', offer: 'Search visibility and conversion review', route: '/products/search' },
  { name: 'Attribution', pains: 'CRM automation · source visibility · reporting', offer: 'Customer signal and attribution workflow', route: '/products/attribution' },
];
export function score(components: Weights, weights: Weights): number {
  const total = dimensions.reduce((sum, key) => sum + weights[key], 0);
  if (!Number.isFinite(total) || total <= 0) throw new Error('At least one scoring weight must be positive.');
  if (dimensions.some(key => !Number.isFinite(weights[key]) || weights[key] < 0 || weights[key] > 100 || !Number.isFinite(components[key]) || components[key] < 0 || components[key] > 100)) throw new Error('Scores and weights must be between 0 and 100.');
  return Math.round(dimensions.reduce((sum, key) => sum + components[key] * weights[key], 0) / total);
}
export function normalize(signal: Opportunity): Opportunity {
  return { ...signal, business: signal.business.trim(), text: signal.text.trim(), geography: signal.geography.trim() };
}
export function matchSolution(pain: string): string {
  const input = pain.toLowerCase();
  if (/missed.call|receptionist|voice/.test(input)) return 'Quantum Concierge';
  if (/google ads|outbound/.test(input)) return 'Acquisition';
  if (/seo|search/.test(input)) return 'Search';
  if (/crm|attribution/.test(input)) return 'Attribution';
  return 'Revenue Engine';
}
export function event(kind: string, detail: string, opportunityId?: string): AuditEvent {
  return { id: crypto.randomUUID(), kind, detail, opportunityId, at: new Date().toISOString() };
}
export async function ingest(state: ScoutState, adapter: SourceAdapter): Promise<ScoutState> {
  if (adapter.mode !== 'demo') throw new Error('Live ingestion is not connected.');
  const incoming = (await adapter.collect()).map(normalize);
  const existing = new Set(state.opportunities.map(item => item.id));
  const added = incoming.filter(item => !existing.has(item.id)).map(item => ({ ...item, solution: matchSolution(item.pain) }));
  return { ...state, opportunities: [...state.opportunities, ...added], runs: state.runs + 1, events: [...state.events, event('scout_run', `Demo Scout normalized ${incoming.length} signals; ${added.length} new opportunities. No external requests.`)] };
}
export function approveOpportunity(state: ScoutState, id: string): ScoutState {
  const item = state.opportunities.find(opportunity => opportunity.id === id);
  if (!item) throw new Error('Opportunity not found.');
  if (item.status === 'approved') return state;
  const messages = [
    `Hi ${item.business} team — your demo signal mentioned ${item.pain.toLowerCase()}. QWA’s ${item.solution} could be worth evaluating for that workflow. Would a short conversation about your current process be useful?`,
    `Following up on your ${item.pain.toLowerCase()} workflow. Happy to share a focused ${item.solution} walkthrough if it is still a priority.`,
    `One last check-in: is ${item.pain.toLowerCase()} still something your team is evaluating? If not, I’ll close the loop here.`,
  ];
  return { ...state, opportunities: state.opportunities.map(opportunity => opportunity.id === id ? { ...opportunity, status: 'approved' } : opportunity), drafts: state.drafts.some(draft => draft.opportunityId === id) ? state.drafts : [...state.drafts, { opportunityId: id, messages, channel: 'Email', status: 'draft' }], events: [...state.events, event('opportunity_approved', 'Human approved opportunity; three demo outreach drafts prepared. Nothing sent.', id)] };
}
export function transitionDraft(state: ScoutState, id: string, next: 'approved' | 'sent'): ScoutState {
  const draft = state.drafts.find(item => item.opportunityId === id);
  if (!draft) throw new Error('Draft not found.');
  if (next === 'sent' && draft.status !== 'approved') throw new Error('Approve the draft before simulating send.');
  if (next === 'approved' && draft.messages.some(message => !message.trim())) throw new Error('All three messages are required.');
  return { ...state, drafts: state.drafts.map(item => item.opportunityId === id ? { ...item, status: next } : item), events: [...state.events, event(next === 'sent' ? 'simulated_send' : 'draft_approved', next === 'sent' ? 'Send simulated by operator. No message left QWA.' : 'Human approved outreach copy.', id)] };
}
export function editDraft(state: ScoutState, id: string, messages: string[], channel: string): ScoutState {
  if (messages.length !== 3 || messages.some(message => message.length > 5000)) throw new Error('Three messages, up to 5,000 characters each, are required.');
  const draft = state.drafts.find(item => item.opportunityId === id);
  if (!draft || draft.status === 'sent') throw new Error('Sent drafts cannot be edited.');
  return { ...state, drafts: state.drafts.map(item => item.opportunityId === id ? { ...item, messages, channel, status: 'draft' } : item), events: [...state.events, event('draft_edited', 'Draft edited; approval reset before simulated sending.', id)] };
}
export function recordOutcome(state: ScoutState, id: string, outcome: Outcome): ScoutState {
  if (!state.drafts.some(draft => draft.opportunityId === id && draft.status === 'sent')) throw new Error('Simulate an approved send before recording an outcome.');
  if (!['reply', 'booked', 'won', 'lost'].includes(outcome)) throw new Error('Invalid outcome.');
  if (state.outcomes.some(item => item.opportunityId === id && item.outcome === outcome)) return state;
  const terminal = outcome === 'won' || outcome === 'lost';
  return { ...state, outcomes: [...state.outcomes.filter(item => !(terminal && item.opportunityId === id && ['won', 'lost'].includes(item.outcome))), { opportunityId: id, outcome, at: new Date().toISOString() }], events: [...state.events, event('outcome', `Operator recorded simulated ${outcome}.`, id)] };
}
