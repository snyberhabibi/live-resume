// ───────────────────────────────────────────────────────────────────────────
//  Content — the resume itself. A Solutions Engineer's story told in six beats,
//  each one a "complexity → clarity" moment. Strictly professional; the visual
//  world is the theatre, these are the words a hiring manager reads.
// ───────────────────────────────────────────────────────────────────────────

export interface RoleEntry {
  company: string;
  role: string;
  period: string;
  note?: string; // small tag, e.g. "post-acquisition" / "current"
  current?: boolean;
  bullets: string[];
}

export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Chapter {
  id: string;
  nav: string; // short label for the side-nav
  kind: "center" | "left";
  eyebrow?: string;
  lines: string[];
  role?: string; // hero subtitle (e.g. "Solutions Engineer")
  sub?: string;
  body?: string; // a short supporting paragraph
  code?: string[]; // monospace code block (the motto)
  roles?: RoleEntry[]; // experience cards
  stats?: Stat[]; // the record
  skills?: SkillGroup[]; // the toolbelt
  persona?: string[]; // about — the "I'm a …" lines
  portrait?: string; // about — circular headshot src
  photo?: { src: string; alt: string; caption?: string }; // about — feature photo
  note?: string; // small footer note
  links?: { text: string; href: string }[];
}

export const CHAPTERS: Chapter[] = [
  // 0 ── HERO ────────────────────────────────────────────────────────────────
  {
    id: "hero",
    nav: "Welcome",
    kind: "center",
    eyebrow: "YOUR SEARCH FOR TALENT ENDS HERE",
    lines: ["Yusuf", "Rahman"],
    role: "Solutions Engineer",
    sub: "Give me 60 seconds — scroll, and I'll tell you the whole story.",
  },

  // 1 ── APPROACH ──────────────────────────────────────────────────────────────
  {
    id: "approach",
    nav: "Approach",
    kind: "center",
    eyebrow: "THE APPROACH",
    lines: ["Complex in.", "Simple out."],
    sub: "A tangle of wire, pulled into a single clean line.",
    body: "Every problem worth solving starts as noise — a stalled deal, a fractured architecture, a system nobody fully understands. My job is to find the one line through it and hand back something clean enough to trust.",
    code: [
      "// life motto",
      "if (sad() === true) {",
      "  sad().stop();",
      "  beAwesome();",
      "}",
    ],
  },

  // 2 ── EXPERIENCE ────────────────────────────────────────────────────────────
  {
    id: "experience",
    nav: "Work",
    kind: "left",
    eyebrow: "THE WORK",
    lines: ["From keeping banks up", "to closing the room."],
    roles: [
      {
        company: "IBM — HashiCorp",
        role: "Solutions Engineer",
        period: "2025 — Present",
        note: "post-acquisition",
        current: true,
        bullets: [
          "Technical anchor through HashiCorp's acquisition by IBM — same customers, a larger platform, more on the line.",
          "Still never below 100% — renewals and net-new ACV alike.",
        ],
      },
      {
        company: "HashiCorp",
        role: "Solutions Engineer",
        period: "2023 — 2025",
        bullets: [
          "Owned the technical win for enterprise infra deals — Terraform, Vault, Consul, Nomad — discovery to signed renewal.",
          "Over 100% on renewals and net-new ACV every cycle; MC'd HashiConf 2024 on the main stage.",
        ],
      },
      {
        company: "Cisco — AppDynamics",
        role: "Senior Enterprise Sales Engineer",
        period: "2021 — 2023",
        bullets: [
          "Sole technical lead across 30+ enterprise accounts; 100% of personal quota and a $25M+ team number in year one.",
          "Delivered 100+ technical demos and built the custom dashboards that made the buying decision obvious.",
        ],
      },
      {
        company: "JPMorgan Chase",
        role: "Site Reliability Engineer",
        period: "2020 — 2021",
        bullets: [
          "Held the line on Liquidity-Risk Infrastructure for the largest U.S. bank — incident command, root cause, release engineering.",
          "Automated manual toil with Ansible; turned AppDynamics/Splunk/Geneos telemetry into fast, defensible calls.",
        ],
      },
    ],
  },

  // 3 ── THE RECORD ────────────────────────────────────────────────────────────
  {
    id: "impact",
    nav: "Record",
    kind: "center",
    eyebrow: "THE RECORD",
    lines: ["Never below 100%."],
    sub: "Renewals and net-new ACV — every year I've carried a quota.",
    stats: [
      { value: "100%+", label: "quota attainment, every year in sales" },
      { value: "$25M+", label: "team quota carried (year one, Cisco)" },
      { value: "30+", label: "enterprise accounts owned" },
      { value: "100+", label: "technical demos delivered" },
    ],
  },

  // 4 ── TOOLBELT ──────────────────────────────────────────────────────────────
  {
    id: "toolbelt",
    nav: "Toolbelt",
    kind: "left",
    eyebrow: "THE TOOLBELT",
    lines: ["Deep enough to build it.", "Fluent enough to sell it."],
    skills: [
      { group: "Cloud & IaC", items: ["AWS", "Azure", "Terraform", "Vault", "Consul", "Nomad"] },
      {
        group: "Containers & Delivery",
        items: ["Kubernetes", "Docker", "Ansible", "GitHub Actions", "Git"],
      },
      {
        group: "Observability",
        items: ["OpenTelemetry", "Grafana", "Datadog", "Splunk", "AppDynamics"],
      },
      { group: "Languages & AI", items: ["Python", "TypeScript", "SQL", "Bash", "LLMs & RAG", "MCP"] },
    ],
  },

  // 5 ── OFF THE CLOCK (the human) ─────────────────────────────────────────────
  {
    id: "about",
    nav: "Life",
    kind: "left",
    eyebrow: "OFF THE CLOCK",
    lines: ["A family man,", "first."],
    sub: "Relationships are the whole job — so here's who you'd actually be working with.",
    portrait: "/portrait.jpg",
    photo: {
      src: "/dabka.jpg",
      alt: "Yusuf teaching Palestinian Dabka to a group of kids",
      caption: "Passing on Palestinian Dabka — off the clock",
    },
    persona: [
      "I'm a father to Talia — one year old, and the purpose behind all of it.",
      "I'm a performer — Palestinian Dabka & Zaffa at weddings for 10+ years.",
      "I'm a community guy — I support local and love meeting new people.",
      "I'm a builder — always playing with new tech and AI tools.",
      "I work to live, not the other way around.",
    ],
  },

  // 6 ── CONTACT ───────────────────────────────────────────────────────────────
  {
    id: "contact",
    nav: "Contact",
    kind: "center",
    eyebrow: "LET'S TALK",
    lines: ["Let's solve", "something."],
    sub: "yusuf.arahman@outlook.com",
    note: "Solutions Engineer · U.S. Citizen · Dallas, TX",
    links: [
      { text: "Email", href: "mailto:yusuf.arahman@outlook.com" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/yusufarahman/" },
    ],
  },
];

export const NAV_LABELS = CHAPTERS.map((c) => c.nav);
