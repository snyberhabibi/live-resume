export interface Skill {
  name: string;
  level: number; // 0-1
  category: "engineering" | "ai" | "product" | "ops" | "leadership";
  /** Shown in builder mode — what you actually built with it */
  builderNote: string;
  /** Shown in recruiter mode — business impact framing */
  recruiterNote: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  /** Builder mode: technical narrative */
  builderSummary: string;
  /** Recruiter mode: impact & metrics */
  recruiterSummary: string;
  tags: string[];
}

export interface Project {
  name: string;
  description: string;
  tech: string[];
  url?: string;
  /** Builder mode: architecture & decisions */
  builderDetail: string;
  /** Recruiter mode: outcome & scale */
  recruiterDetail: string;
}

export const skills: Skill[] = [
  {
    name: "TypeScript / React",
    level: 0.95,
    category: "engineering",
    builderNote: "Full-stack Next.js — SSR, RSC, server actions, the works.",
    recruiterNote: "5+ years building production web applications at scale.",
  },
  {
    name: "AI / LLM Engineering",
    level: 0.92,
    category: "ai",
    builderNote:
      "Claude Code SDK, agent orchestration, MCP servers, prompt engineering.",
    recruiterNote:
      "Designed AI agent systems automating 645+ hours/month of operations.",
  },
  {
    name: "Python",
    level: 0.85,
    category: "engineering",
    builderNote: "FastAPI, data pipelines, automation scripts, ML tooling.",
    recruiterNote: "Backend services, data engineering, and automation.",
  },
  {
    name: "Product Strategy",
    level: 0.88,
    category: "product",
    builderNote:
      "From zero-to-one builds: chef portals, marketplaces, ops dashboards.",
    recruiterNote:
      "Led product from idea to launch across multiple verticals.",
  },
  {
    name: "Cloud & Infra",
    level: 0.82,
    category: "engineering",
    builderNote: "Vercel, Supabase, Novu, PostHog, GitHub Actions.",
    recruiterNote:
      "Modern cloud-native stack with CI/CD and observability.",
  },
  {
    name: "Operations & Automation",
    level: 0.9,
    category: "ops",
    builderNote:
      "Built Fufu — an AI cofounder that runs daily ops across 5 repos.",
    recruiterNote:
      "Automated equivalent of 4-5 FTEs, saving $225-315K/year.",
  },
  {
    name: "Three.js / WebGL",
    level: 0.75,
    category: "engineering",
    builderNote: "React Three Fiber, shaders, interactive 3D experiences.",
    recruiterNote: "Interactive 3D web experiences and data visualization.",
  },
  {
    name: "Design Systems",
    level: 0.83,
    category: "product",
    builderNote:
      "Tailwind + shadcn/ui, design tokens, component libraries, Figma → code.",
    recruiterNote:
      "End-to-end design system creation from tokens to production.",
  },
  {
    name: "Leadership",
    level: 0.87,
    category: "leadership",
    builderNote:
      "Solo founder wearing every hat — eng, product, ops, marketing.",
    recruiterNote:
      "Founded and scaled a food-tech startup as solo technical founder.",
  },
  {
    name: "Node.js",
    level: 0.9,
    category: "engineering",
    builderNote: "API servers, SDK integrations, orchestration layers, CLIs.",
    recruiterNote: "High-throughput backend services and developer tooling.",
  },
];

export const experience: Experience[] = [
  {
    role: "Founder & CEO",
    company: "Yalla Bites",
    period: "2023 — Present",
    builderSummary:
      "Building a food-tech platform connecting home chefs to customers. Architected the entire stack: Next.js marketplace, chef portal PWA, AI agent system (Fufu) managing 7 agent teams across 5 repos, notification infrastructure via Novu, analytics via PostHog, and automated outreach pipelines.",
    recruiterSummary:
      "Founded and scaled a food-tech marketplace from zero. Built an AI-powered operations system that automates 645+ hours/month of work (equivalent to 4-5 FTEs). Manage the full product lifecycle from chef acquisition through order fulfillment.",
    tags: ["Founder", "AI", "Full-Stack", "Food-Tech"],
  },
  {
    role: "AI Engineer",
    company: "AAI Agency",
    period: "2024 — Present",
    builderSummary:
      "Building AI agent systems and automation for clients. Claude Code SDK, MCP servers, custom skills, and multi-agent orchestration.",
    recruiterSummary:
      "Delivering enterprise AI solutions including agent systems, workflow automation, and LLM-powered tools for diverse clients.",
    tags: ["AI", "Consulting", "Agents"],
  },
];

export const projects: Project[] = [
  {
    name: "Fufu — AI Cofounder",
    description:
      "Multi-agent orchestration system that runs daily operations across an entire startup.",
    tech: [
      "Claude Code SDK",
      "Next.js",
      "TypeScript",
      "Supabase",
      "MCP",
    ],
    builderDetail:
      "7 specialized agent teams (Apply, Hunter, Marketing, Support, Novu, Content, Optimizer) each running as Claude Code SDK sessions in their target repos. Persistent memory via Supabase pgvector, scheduled routines, morning briefings, and a war-room dashboard.",
    recruiterDetail:
      "AI system automating 17 business routines across chef acquisition, marketing, support, and operations — saving 645+ hours/month and replacing the need for 4-5 full-time employees.",
  },
  {
    name: "Chef Portal PWA",
    description:
      "Progressive web app for home chefs to manage menus, orders, and analytics.",
    tech: ["Next.js", "React 19", "Tailwind", "PWA", "Payload CMS"],
    url: "https://demo-chef-portal.vercel.app",
    builderDetail:
      "26-route prototype with flash sales, i18n (EN/AR), cookbook-style recipe management, warm minimalism design system, and offline-first PWA architecture.",
    recruiterDetail:
      "Full-featured chef management portal with 26 routes, bilingual support, real-time analytics, and progressive web app capabilities for mobile-first users.",
  },
  {
    name: "Live Resume",
    description: "This site — an interactive 3D resume with dual viewing modes.",
    tech: ["Next.js", "Three.js", "R3F", "Framer Motion", "Zustand"],
    builderDetail:
      "React Three Fiber scene with interactive skill nodes, post-processing effects, and mode-aware content switching via Zustand.",
    recruiterDetail:
      "Interactive portfolio demonstrating advanced frontend engineering capabilities including 3D graphics and real-time data visualization.",
  },
];

export const bio = {
  name: "Yusuf Rahman",
  title: "Founder & AI Engineer",
  location: "Dubai, UAE",
  email: "yusuf@aai.agency",
  github: "snyberhabibi",
  builderTagline: "I build agents that build businesses.",
  recruiterTagline:
    "Technical founder building AI-powered operations at scale.",
};
