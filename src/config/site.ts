export type NavItem = {
  label: string;
  description?: string;
  /** Phase 2: replace with real routes. */
  href: string;
};

export type NavGroup = {
  label: string;
  columns: { heading: string; items: NavItem[] }[];
};

export const navigation: NavGroup[] = [
  {
    label: "Products",
    columns: [
      {
        heading: "Revenue system",
        items: [
          { label: "Revenue Engine", href: "/products/revenue-engine", description: "The closed-loop core" },
          { label: "Customer Acquisition", href: "/products/acquisition", description: "Paid, organic, outbound" },
          { label: "Voice + Conversations", href: "/products/voice", description: "Speak, text, respond" },
          { label: "Live Commerce", href: "/products/live-commerce", description: "Sell in the moment" },
        ],
      },
      {
        heading: "Intelligence",
        items: [
          { label: "Creative Studio", href: "/products/creative-studio", description: "Brief to campaign-ready" },
          { label: "SEO / GEO", href: "/products/search", description: "Search and answer surfaces" },
          { label: "Business Intelligence", href: "/products/business-intelligence", description: "Revenue truth" },
          { label: "Revenue Attribution", href: "/products/attribution", description: "Where revenue came from" },
          { label: "Decision Intelligence", href: "/products/decision-intelligence", description: "Autonomous optimization" },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        heading: "Convert inbound demand",
        items: [
          { label: "AI lead response", href: "/solutions/ai-lead-response", description: "Answer every lead in seconds" },
          { label: "AI appointment setting", href: "/solutions/ai-appointment-setting", description: "Qualified leads, booked slots" },
          { label: "AI voice agent", href: "/solutions/ai-voice-agent", description: "Every call answered, in context" },
        ],
      },
      {
        heading: "Grow existing revenue",
        items: [
          { label: "Customer reactivation", href: "/solutions/customer-reactivation", description: "Recover dormant demand" },
          { label: "Revenue attribution", href: "/solutions/revenue-attribution", description: "Spend joined to closed revenue" },
        ],
      },
    ],
  },
  {
    label: "Platform",
    columns: [
      {
        heading: "Architecture",
        items: [
          { label: "Customer & revenue graph", href: "/platform/graph" },
          { label: "Attribution model", href: "/products/attribution" },
          { label: "Model-agnostic layer", href: "/platform/models" },
          { label: "Governance & controls", href: "/platform/governance" },
        ],
      },
      {
        heading: "Connect",
        items: [
          { label: "Integrations", href: "/platform/integrations" },
          { label: "APIs & webhooks", href: "/platform/api" },
          { label: "Security", href: "/platform/security" },
          { label: "Data residency", href: "/platform/data" },
        ],
      },
    ],
  },
  {
    label: "Industries",
    columns: [
      {
        heading: "Healthcare and aesthetics",
        items: [
          { label: "Dental", href: "/industries/dental", description: "New-patient enquiries and recall" },
          { label: "Med spa", href: "/industries/medspa", description: "Consultations and re-treatment" },
        ],
      },
      {
        heading: "Home services",
        items: [
          { label: "HVAC", href: "/industries/hvac", description: "Seasonal peaks and dispatch" },
          { label: "Plumbing", href: "/industries/plumbing", description: "Emergency call capture" },
          { label: "Solar", href: "/industries/solar", description: "Qualification and long cycles" },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        items: [
          {
            label: "What is an AI revenue engine?",
            href: "/resources/what-is-an-ai-revenue-engine",
            description: "Definition, the loop, and how it differs",
          },
        ],
      },
    ],
  },
  {
    label: "Company",
    columns: [
      {
        heading: "QWA",
        items: [
          { label: "About", href: "/company/about" },
          { label: "Careers", href: "/company/careers" },
          { label: "Newsroom", href: "/company/news" },
          { label: "Contact", href: "/company/contact" },
        ],
      },
      {
        heading: "Trust",
        items: [
          { label: "Responsible AI", href: "/company/responsible-ai" },
          { label: "Privacy", href: "/privacy" },
          { label: "Terms", href: "/terms" },
          { label: "Status", href: "/company/status" },
        ],
      },
    ],
  },
];

export const footerColumns = [
  {
    heading: "Products",
    items: [
      { label: "Revenue Engine", href: "/products/revenue-engine" },
      { label: "Customer Acquisition", href: "/products/acquisition" },
      { label: "Voice + Conversations", href: "/products/voice" },
      { label: "Creative Studio", href: "/products/creative-studio" },
      { label: "SEO / GEO", href: "/products/search" },
      { label: "Live Commerce", href: "/products/live-commerce" },
    ],
  },
  {
    heading: "Platform",
    items: [
      { label: "Customer & revenue graph", href: "/platform/graph" },
      { label: "Attribution model", href: "/products/attribution" },
      { label: "Integrations", href: "/platform/integrations" },
      { label: "Security", href: "/platform/security" },
      { label: "APIs & webhooks", href: "/platform/api" },
    ],
  },
  {
    heading: "Solutions",
    items: [
      { label: "AI lead response", href: "/solutions/ai-lead-response" },
      { label: "AI appointment setting", href: "/solutions/ai-appointment-setting" },
      { label: "AI voice agent", href: "/solutions/ai-voice-agent" },
      { label: "Customer reactivation", href: "/solutions/customer-reactivation" },
      { label: "Revenue attribution", href: "/solutions/revenue-attribution" },
    ],
  },
  {
    heading: "Industries",
    items: [
      { label: "Dental", href: "/industries/dental" },
      { label: "Med spa", href: "/industries/medspa" },
      { label: "HVAC", href: "/industries/hvac" },
      { label: "Plumbing", href: "/industries/plumbing" },
      { label: "Solar", href: "/industries/solar" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "What is an AI revenue engine?", href: "/resources/what-is-an-ai-revenue-engine" },
    ],
  },
  {
    heading: "Company",
    items: [
      { label: "About", href: "/company/about" },
      { label: "Careers", href: "/company/careers" },
      { label: "Newsroom", href: "/company/news" },
      { label: "Contact", href: "/company/contact" },
      { label: "Responsible AI", href: "/company/responsible-ai" },
    ],
  },
];

/**
 * Routes that actually exist. Navigation renders a real link only for these;
 * everything else stays inert so no menu entry can 404.
 */
export const liveRoutes = [
  "/",
  "/products/revenue-engine",
  "/products/voice",
  "/products/acquisition",
  "/products/creative-studio",
  "/products/attribution",
  "/products/search",
  "/products/live-commerce",
  "/products/business-intelligence",
  "/products/decision-intelligence",
  "/solutions/ai-lead-response",
  "/solutions/ai-appointment-setting",
  "/solutions/ai-voice-agent",
  "/solutions/customer-reactivation",
  "/solutions/revenue-attribution",
  "/industries/dental",
  "/industries/medspa",
  "/industries/hvac",
  "/industries/plumbing",
  "/industries/solar",
  "/resources/what-is-an-ai-revenue-engine",
  "/privacy",
  "/terms",
] as const;

export type LiveRoute = (typeof liveRoutes)[number];

export function isLiveRoute(href: string): href is LiveRoute {
  return (liveRoutes as readonly string[]).includes(href);
}

/**
 * Public navigation is built from live routes only. Configured future
 * destinations stay in the arrays above as the roadmap of record, but a
 * visitor never sees an inert menu entry: items without a shipped route are
 * dropped, columns left empty are dropped, and a group with no live
 * destination is not rendered at all.
 */
function withLiveItemsOnly<T extends { href: string }>(items: T[]): T[] {
  return items.filter((item) => isLiveRoute(item.href));
}

export const visibleNavigation: NavGroup[] = navigation
  .map((group) => ({
    ...group,
    columns: group.columns
      .map((column) => ({ ...column, items: withLiveItemsOnly(column.items) }))
      .filter((column) => column.items.length > 0),
  }))
  .filter((group) => group.columns.length > 0);

export const visibleFooterColumns = footerColumns
  .map((column) => ({ ...column, items: withLiveItemsOnly(column.items) }))
  .filter((column) => column.items.length > 0);

/* ------------------------------------------------------------------
 * Phase 2: product index + cross-navigation graph.
 * Every product page closes with two or three sibling products so the
 * suite reads as one system rather than a set of landing pages.
 * ---------------------------------------------------------------- */

export type ProductKey =
  | "revenue-engine"
  | "acquisition"
  | "voice"
  | "creative-studio"
  | "search"
  | "live-commerce"
  | "attribution"
  | "business-intelligence"
  | "decision-intelligence";

export type ProductEntry = {
  key: ProductKey;
  name: string;
  href: string;
  /** One line, outcome-first. Used in cross-navigation cards. */
  summary: string;
};

export const products: Record<ProductKey, ProductEntry> = {
  "revenue-engine": {
    key: "revenue-engine",
    name: "Revenue Engine",
    href: "/products/revenue-engine",
    summary: "One record from first signal to closed revenue, and back again.",
  },
  acquisition: {
    key: "acquisition",
    name: "Customer Acquisition",
    href: "/products/acquisition",
    summary: "Spend and closed revenue joined on the same record.",
  },
  voice: {
    key: "voice",
    name: "Voice + Conversations",
    href: "/products/voice",
    summary: "Continuity across call, text and message — one thread, one memory.",
  },
  "creative-studio": {
    key: "creative-studio",
    name: "Creative Studio",
    href: "/products/creative-studio",
    summary: "Brief to approved, versioned campaign assets on a pipeline.",
  },
  search: {
    key: "search",
    name: "SEO / GEO",
    href: "/products/search",
    summary: "Discovery measured in pipeline, on search and answer surfaces.",
  },
  "live-commerce": {
    key: "live-commerce",
    name: "Live Commerce",
    href: "/products/live-commerce",
    summary: "Read the room, answer instantly, keep the record after the stream.",
  },
  attribution: {
    key: "attribution",
    name: "Revenue Attribution",
    href: "/products/attribution",
    summary: "Every dollar traced to the touch, creative and conversation behind it.",
  },
  "business-intelligence": {
    key: "business-intelligence",
    name: "Business Intelligence",
    href: "/products/business-intelligence",
    summary: "One set of numbers, shared definitions, published coverage.",
  },
  "decision-intelligence": {
    key: "decision-intelligence",
    name: "Decision Intelligence",
    href: "/products/decision-intelligence",
    summary: "Bounded autonomy: proposals, guardrails and a reversible decision log.",
  },
};

export const relatedProducts: Record<ProductKey, ProductKey[]> = {
  "revenue-engine": ["attribution", "voice", "decision-intelligence"],
  acquisition: ["attribution", "creative-studio", "search"],
  voice: ["revenue-engine", "live-commerce", "attribution"],
  "creative-studio": ["acquisition", "live-commerce", "search"],
  search: ["acquisition", "creative-studio", "attribution"],
  "live-commerce": ["voice", "creative-studio", "revenue-engine"],
  attribution: ["revenue-engine", "acquisition", "business-intelligence"],
  "business-intelligence": ["attribution", "decision-intelligence", "revenue-engine"],
  "decision-intelligence": ["business-intelligence", "attribution", "acquisition"],
};
