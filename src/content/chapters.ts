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
  sub?: string;
  body?: string; // a short supporting paragraph
  code?: string[]; // monospace code block (the motto)
  roles?: RoleEntry[]; // experience cards
  stats?: Stat[]; // the record
  skills?: SkillGroup[]; // the toolbelt
  note?: string; // small footer note
  links?: { text: string; href: string }[];
}

export const CHAPTERS: Chapter[] = [
  // 0 ── HERO ────────────────────────────────────────────────────────────────
  {
    id: "hero",
    nav: "Intro",
    kind: "center",
    eyebrow: "SOLUTIONS ENGINEER",
    lines: ["Yusuf", "Rahman"],
    sub: "I turn complexity into clarity.",
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
      { group: "Cloud & Infra", items: ["AWS", "Azure", "Terraform", "Vault", "Consul", "Nomad"] },
      {
        group: "Reliability & Observability",
        items: ["AppDynamics", "Splunk", "Grafana", "ThousandEyes", "Geneos", "Intersight"],
      },
      {
        group: "Containers & CI/CD",
        items: ["Docker", "Kubernetes", "Ansible", "Jenkins", "Git"],
      },
      { group: "Languages", items: ["Python", "Bash", "SQL", "JavaScript", "Java", "C++"] },
    ],
  },

  // 5 ── CONTACT ───────────────────────────────────────────────────────────────
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
