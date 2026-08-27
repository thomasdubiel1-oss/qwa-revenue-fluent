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
        heading: "By objective",
        items: [
          { label: "Grow pipeline", href: "/solutions/pipeline" },
          { label: "Increase conversion", href: "/solutions/conversion" },
          { label: "Reduce CAC", href: "/solutions/cac" },
          { label: "Recover lost revenue", href: "/solutions/recovery" },
        ],
      },
      {
        heading: "By team",
        items: [
          { label: "Revenue leadership", href: "/solutions/revenue" },
          { label: "Marketing", href: "/solutions/marketing" },
          { label: "Sales", href: "/solutions/sales" },
          { label: "Operations", href: "/solutions/operations" },
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
        heading: "Sectors",
        items: [
          { label: "Home services", href: "/industries/home-services" },
          { label: "Healthcare", href: "/industries/healthcare" },
          { label: "Automotive", href: "/industries/automotive" },
          { label: "Financial services", href: "/industries/financial" },
        ],
      },
      {
        heading: "Motion",
        items: [
          { label: "High-velocity inbound", href: "/industries/inbound" },
          { label: "Multi-location", href: "/industries/multi-location" },
          { label: "Franchise networks", href: "/industries/franchise" },
          { label: "E-commerce", href: "/industries/ecommerce" },
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
          { label: "Revenue OS primer", href: "/resources/primer" },
          { label: "Attribution guide", href: "/resources/attribution" },
          { label: "Benchmarks", href: "/resources/benchmarks" },
          { label: "Documentation", href: "/resources/docs" },
        ],
      },
      {
        heading: "Library",
        items: [
          { label: "Field notes", href: "/resources/notes" },
          { label: "Product updates", href: "/resources/changelog" },
          { label: "Webinars", href: "/resources/webinars" },
          { label: "Glossary", href: "/resources/glossary" },
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
          { label: "Privacy", href: "/legal/privacy" },
          { label: "Terms", href: "/legal/terms" },
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
    heading: "Industries",
    items: [
      { label: "Home services", href: "/industries/home-services" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "Automotive", href: "/industries/automotive" },
      { label: "Financial services", href: "/industries/financial" },
      { label: "E-commerce", href: "/industries/ecommerce" },
    ],
  },
  {
    heading: "Resources",
    items: [
      { label: "Revenue OS primer", href: "/resources/primer" },
      { label: "Attribution guide", href: "/resources/attribution" },
      { label: "Benchmarks", href: "/resources/benchmarks" },
      { label: "Documentation", href: "/resources/docs" },
      { label: "Product updates", href: "/resources/changelog" },
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
] as const;

export type LiveRoute = (typeof liveRoutes)[number];

export function isLiveRoute(href: string): href is LiveRoute {
  return (liveRoutes as readonly string[]).includes(href);
}

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
