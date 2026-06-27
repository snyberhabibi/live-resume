// =============================================================================
//  Content: the resume itself. A Solutions Engineer's story in eight beats,
//  ordered "person first, then proof". One throughline end to end: I make
//  complex technology and concepts simple to understand, prove their value,
//  and win on trust. Strictly professional; the words a hiring manager reads.
// =============================================================================

export interface RoleEntry {
  company: string;
  role: string;
  period: string;
  note?: string; // small tag, e.g. "post-acquisition" or "current"
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
  hats?: string[]; // hero "I wear many hats" cycling roles
  sub?: string;
  body?: string; // a short supporting paragraph
  code?: string[]; // monospace code block (the motto)
  roles?: RoleEntry[]; // experience cards / terminals
  stats?: Stat[]; // the record
  skills?: SkillGroup[]; // the toolbelt
  strengths?: string[]; // "how I work": strengths
  growth?: string; // "how I work": growth-areas note
  tag?: string; // small badge, e.g. MBTI type
  persona?: string[]; // "who I am": the "I'm a ..." lines
  portrait?: string; // circular headshot src
  photo?: { src: string; alt: string; caption?: string }; // feature photo
  gallery?: { src: string; alt: string; caption?: string }[]; // auto-shuffling carousel
  note?: string; // small footer note
  links?: { text: string; href: string }[];
}

export const CHAPTERS: Chapter[] = [
  // 0  INTRO
  {
    id: "hero",
    nav: "Intro",
    kind: "center",
    eyebrow: "HI, I'M",
    lines: ["Yusuf", "Rahman"],
    role: "Solutions Engineer · Dallas, TX",
    hats: ["Solutions Engineer", "Father", "Performer", "Community builder", "Tinkerer", "Problem solver"],
    portrait: "/portrait.jpg",
    sub: "I make complex technology and concepts simple to understand, and demonstrate the value they deliver. Scroll down and I'll introduce myself.",
  },

  // 1  WHO I AM (person first)
  {
    id: "about",
    nav: "Me",
    kind: "left",
    eyebrow: "WHO I AM",
    lines: ["Start with", "the person."],
    sub: "Before the resume, here's who you'd actually be working with.",
    portrait: "/portrait.jpg",
    gallery: [
      {
        src: "/hashiconf.jpg",
        alt: "Yusuf MC'ing on the HashiConf 2024 main stage",
        caption: "MC at HashiConf '24.",
      },
      {
        src: "/dabka.jpg",
        alt: "Yusuf teaching Middle Eastern folklore dance to a room of students",
        caption: "Teaching Middle Eastern folklore dance to a room of students.",
      },
      {
        src: "/band.jpg",
        alt: "Yusuf performing at a Middle Eastern wedding with his band",
        caption:
          "Performing at a Middle Eastern wedding with our band of friends. Doctors, Engineers, Pharmacists, Accountants. We formed it while in college together.",
      },
    ],
    persona: [
      "I'm a proud husband, and a proud father to Talia, my one-year-old daughter, who makes every day brighter.",
      "I'm a performer of Middle Eastern folklore dance at weddings, going on 10+ years.",
      "I'm a community guy who loves supporting local and meeting new people.",
      "I'm a builder, always tinkering with new tech and AI tools.",
    ],
  },

  // 2  HOW I WORK
  {
    id: "howiwork",
    nav: "How I Work",
    kind: "left",
    eyebrow: "HOW I WORK",
    lines: ["I lead with trust,", "not ego."],
    tag: "ENFJ · The Protagonist",
    strengths: [
      "I love to connect with people, and I genuinely care about the account, not just the number.",
      "A real team player. I thrive where collaboration is part of the culture, and I do my best to keep that teamwork alive.",
      "Fast learner, and not too proud to ask. I treat asking for help as a strength, not a weakness.",
      "Very coachable: when a problem is outside my depth, I lean on people with deeper expertise to guide me through it, rather than guess.",
      "Comfortable presenting and running live demos, and always working to get sharper.",
    ],
    growth:
      "Focus, when the problem isn't clearly defined. I'll take on anything, so the discipline I keep building is choosing the right thing first. With no SE playbook to follow, I'll ask for guidance and weigh building the process against staying customer-facing by one test: which one actually drives revenue. Then I commit and protect my time.",
  },

  // 3  THE APPROACH
  {
    id: "approach",
    nav: "Approach",
    kind: "center",
    eyebrow: "THE APPROACH",
    lines: ["I make complex things", "simple."],
    sub: "That's really the whole job.",
    body: "Customers come to me with messy, half-defined problems: a stalled deal, a system nobody fully understands, too many priorities at once. My job is to cut through the noise, figure out what actually matters, and give them one clear, workable answer they can trust.",
    code: [
      "// life motto",
      "if (sad() === true) {",
      "  sad().stop();",
      "  beAwesome();",
      "}",
    ],
  },

  // 4  THE WORK (experience, rendered as terminals)
  {
    id: "experience",
    nav: "Work",
    kind: "left",
    eyebrow: "THE WORK",
    lines: ["From keeping banks up", "to closing the room."],
    roles: [
      {
        company: "IBM · HashiCorp",
        role: "Solutions Engineer",
        period: "2025 to Present",
        note: "post-acquisition",
        current: true,
        bullets: [
          "Technical anchor through HashiCorp's acquisition by IBM: same customers, a larger platform, more on the line.",
          "Saved at-risk renewals and opened net-new relationships by genuinely investing in each account, not just the deal.",
          "Still never below 100% on renewals and net-new ACV alike.",
        ],
      },
      {
        company: "HashiCorp",
        role: "Solutions Engineer",
        period: "2023 to 2025",
        bullets: [
          "Owned the technical win on enterprise infra deals across Terraform, Vault, Consul, and Nomad, from discovery to signed renewal.",
          "Over 100% on renewals and net-new ACV every cycle; MC'd HashiConf 2024 on the main stage.",
        ],
      },
      {
        company: "Cisco · AppDynamics",
        role: "Senior Enterprise Sales Engineer",
        period: "2021 to 2023",
        bullets: [
          "Sole technical lead across 30+ enterprise accounts; 100% of personal quota and a $25M+ team number in year one.",
          "Delivered 100+ technical demos and built the custom dashboards that made the buying decision obvious.",
        ],
      },
      {
        company: "JPMorgan Chase",
        role: "Site Reliability Engineer",
        period: "2020 to 2021",
        bullets: [
          "Held the line on Liquidity-Risk Infrastructure for the largest U.S. bank: incident command, root cause, release engineering.",
          "Automated manual toil with Ansible; turned AppDynamics, Splunk, and Geneos telemetry into fast, defensible calls.",
        ],
      },
    ],
  },

  // 5  THE RECORD
  {
    id: "impact",
    nav: "Record",
    kind: "center",
    eyebrow: "THE RECORD",
    lines: ["Never below 100%."],
    sub: "Quota, hit every single year I've carried one. Renewals and net-new alike.",
    stats: [
      { value: "100%+", label: "quota attainment, every year in sales" },
      { value: "$25M+", label: "team quota carried (year one, Cisco)" },
      { value: "30+", label: "enterprise accounts owned" },
      { value: "100+", label: "technical demos delivered" },
    ],
  },

  // 6  THE TOOLBELT
  {
    id: "toolbelt",
    nav: "Toolbelt",
    kind: "left",
    eyebrow: "THE TOOLBELT",
    lines: ["Deep enough to build it.", "Fluent enough to sell it."],
    skills: [
      {
        group: "Cloud & IaC",
        items: ["AWS", "Azure", "Terraform", "Vault", "Consul", "Nomad", "Supabase"],
      },
      {
        group: "Containers & Delivery",
        items: ["Kubernetes", "Docker", "Ansible", "GitHub Actions", "Git"],
      },
      {
        group: "Observability",
        items: ["OpenTelemetry", "Grafana", "Datadog", "PostHog", "Splunk", "AppDynamics"],
      },
      { group: "Languages & AI", items: ["Python", "TypeScript", "SQL", "Bash", "LLMs & RAG", "MCP"] },
    ],
  },

  // 7  CONTACT
  {
    id: "contact",
    nav: "Contact",
    kind: "center",
    eyebrow: "LET'S TALK",
    lines: ["Let's solve", "something."],
    sub: "yusuf.arahman@outlook.com",
    note: "Open to Solutions Engineering roles · U.S. Citizen · Dallas / Remote",
    links: [
      { text: "Email", href: "mailto:yusuf.arahman@outlook.com" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/yusufarahman/" },
    ],
  },
];

export const NAV_LABELS = CHAPTERS.map((c) => c.nav);
