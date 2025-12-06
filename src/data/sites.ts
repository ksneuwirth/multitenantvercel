export type SiteDocSection = {
  heading: string;
  copy: string[];
};

export type SiteDoc = {
  slug: string[];
  title: string;
  summary: string;
  updatedAt: string;
  content: SiteDocSection[];
};

export type SiteDefinition = {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  industries: string[];
  subdomain: string;
  customDomain?: string;
  domains?: string[];
  theme: {
    accent: string;
    surface: string;
    glow: string;
  };
  featuredLinks: { label: string; path: string }[];
  docs: SiteDoc[];
};

export const sites: SiteDefinition[] = [
  {
    slug: "acme",
    name: "Acme Analytics",
    description: "Product analytics for modern SaaS teams.",
    tagline: "Ship faster with trustworthy product telemetry.",
    industries: ["SaaS", "Analytics"],
    subdomain: "acme",
    customDomain: "docs.useacme.dev",
    theme: {
      accent: "#0ea5e9",
      surface: "#020617",
      glow: "#38bdf8",
    },
    featuredLinks: [
      { label: "Onboarding Checklist", path: "getting-started" },
      { label: "JavaScript SDK", path: "sdks/javascript" },
    ],
    docs: [
      {
        slug: [],
        title: "Welcome to Acme Docs",
        summary:
          "Understand how Acme captures, transforms, and routes telemetry events across your product suite.",
        updatedAt: "2024-12-01",
        content: [
          {
            heading: "What you can build",
            copy: [
              "Acme Analytics ingests events from every client and service, enriches them in-stream, and exposes the resulting profile graph inside the workspace API.",
              "Teams lean on Acme for golden dashboards, usage-based billing, and predictive retention scoring without having to stitch together brittle pipelines.",
            ],
          },
          {
            heading: "How multi-tenant routing works",
            copy: [
              "Each workspace receives a dedicated ingestion domain (e.g. `acme-ingest.customers.com`). The domain is registered through the Platform Domain API and pinned to your tenant's space.",
              "Edge middleware inspects the request host and rewrites traffic to the correct workspace tree, guaranteeing isolation while keeping everything under a single Vercel project.",
            ],
          },
        ],
      },
      {
        slug: ["getting-started"],
        title: "Getting Started",
        summary: "Provision an organization, issue tokens, and stream your first events.",
        updatedAt: "2024-10-18",
        content: [
          {
            heading: "Create an organization",
            copy: [
              "Use the control plane API to create an organization. We recommend mirroring your company billing entity to make plan management straightforward.",
              "Organizations can host up to five environments (prod, staging, etc.). Each environment receives its own API keys and isolated storage.",
            ],
          },
          {
            heading: "Issue workspace tokens",
            copy: [
              "Generate a publishable key for every client platform (web, mobile, backend). Rotations propagate instantly because keys are signed at request time via Edge Config.",
            ],
          },
        ],
      },
      {
        slug: ["sdks", "javascript"],
        title: "JavaScript SDK",
        summary: "Drop-in SDK for web apps, ships with automatic batching and offline replay.",
        updatedAt: "2024-11-05",
        content: [
          {
            heading: "Install",
            copy: [
              "Install via npm: `npm install @acme/analytics`. The package targets evergreen browsers and tree-shakes unused transports.",
            ],
          },
          {
            heading: "Initialize",
            copy: [
              "Instantiate the client with your workspace ID and publishable key. The SDK resolves the tenant domain automatically, but you can override the ingestion host when running multi-region tests.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "stellar",
    name: "Stellar Robotics",
    description: "Edge control planes for autonomous fleets.",
    tagline: "Deploy reliable autonomy with full observability.",
    industries: ["Robotics", "Manufacturing"],
    subdomain: "stellar",
    customDomain: "help.stellarops.ai",
    theme: {
      accent: "#f472b6",
      surface: "#0f172a",
      glow: "#ec4899",
    },
    featuredLinks: [
      { label: "Command Stream", path: "command-stream" },
      { label: "Edge Deployments", path: "deployments" },
    ],
    docs: [
      {
        slug: [],
        title: "Fleet Overview",
        summary: "Design principles behind Stellar's command stream and OTA channels.",
        updatedAt: "2024-11-11",
        content: [
          {
            heading: "Channels",
            copy: [
              "Control channels are isolated per tenant and delivered over QUIC. Each tenant receives a vanity domain such as `fleet.customer.com` that terminates in Stellar's Anycast edge.",
            ],
          },
          {
            heading: "Observability",
            copy: [
              "Streaming traces, metrics, and crash dumps stay within the tenant boundary. The docs experience mirrors that separation so customers always land in their own namespace.",
            ],
          },
        ],
      },
      {
        slug: ["command-stream"],
        title: "Command Stream",
        summary: "Low-latency duplex channel that powers overrides and health signals.",
        updatedAt: "2024-09-02",
        content: [
          {
            heading: "Server setup",
            copy: [
              "Provision a stream secret per robot cohort. Stellar rotates the backing key via Edge Config so you do not need to redeploy gateways.",
            ],
          },
          {
            heading: "Fallbacks",
            copy: [
              "If the duplex channel degrades, clients fall back to signed polling over HTTPS. Because the docs route is multi-tenant aware, R&D can preview this flow on `stellar.docs.localhost` without touching production.",
            ],
          },
        ],
      },
      {
        slug: ["deployments"],
        title: "Edge Deployments",
        summary: "Ship OTA payloads with staged rollouts and guardrails.",
        updatedAt: "2024-08-14",
        content: [
          {
            heading: "Artifacts",
            copy: [
              "Upload signed artifacts to Stellar Storage or bring your own bucket. Each tenant bucket is namespaced, and the docs portal surfaces rollout health in real time.",
            ],
          },
          {
            heading: "Approvals",
            copy: [
              "Use programmable policies so QA, Security, and Ops can approve independently across environments.",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "northwind",
    name: "Northwind Energy",
    description: "Connected infrastructure for renewable grids.",
    tagline: "Telemetry, control, and billing for distributed energy resources.",
    industries: ["Energy", "Climate"],
    subdomain: "northwind",
    theme: {
      accent: "#34d399",
      surface: "#052e16",
      glow: "#4ade80",
    },
    featuredLinks: [
      { label: "Metering API", path: "metering" },
      { label: "Operator Toolkit", path: "operator-toolkit" },
    ],
    docs: [
      {
        slug: [],
        title: "Welcome to the Grid",
        summary: "Build resilient DER programs with automated settlement and device management.",
        updatedAt: "2024-12-03",
        content: [
          {
            heading: "Regional control",
            copy: [
              "Northwind partitions fleets per ISO. The platform domain rewrites (`*.northwind.energy`) ensure that every grid operator lands on its dedicated documentation space.",
            ],
          },
          {
            heading: "Compliance",
            copy: [
              "SOC 2 and NERC CIP controls flow through to the docs stack. Customer success teams can safely embed internal runbooks via tenant aware Edge Middleware.",
            ],
          },
        ],
      },
      {
        slug: ["metering"],
        title: "Metering API",
        summary: "Ingest telemetry from millions of sensors with deterministic reconciliation.",
        updatedAt: "2024-10-07",
        content: [
          {
            heading: "Event model",
            copy: [
              "Each measurement includes a device fingerprint, ISO timestamp, and trace context. Deterministic IDs let you replay partitions without duplicates.",
            ],
          },
          {
            heading: "Pricing",
            copy: [
              "Usage-based billing kicks in after the free 1M measurements. Enterprise agreements can pin a committed rate while keeping burst scaling enabled.",
            ],
          },
        ],
      },
      {
        slug: ["operator-toolkit"],
        title: "Operator Toolkit",
        summary: "Browser-based console for dispatchers and regional partners.",
        updatedAt: "2024-07-22",
        content: [
          {
            heading: "Role-based access",
            copy: [
              "Northwind mirrors your SCIM directory, so the docs automatically respect the same RBAC policies.",
            ],
          },
          {
            heading: "Geo failover",
            copy: [
              "Platform routes custom domains through multiple regions. During a failover test you can watch the documentation experience fail over too, which helps SRE sign-off deployments.",
            ],
          },
        ],
      },
    ],
  },
];
