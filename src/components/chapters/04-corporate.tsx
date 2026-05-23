"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

const roles = [
  {
    company: "JP Morgan Chase",
    role: "Site Reliability Engineer",
    period: "2020 — 2022",
    yusufNote: "70-hour weeks. Corporate machine. It drained the life out of me.",
    recruiterNote: "Enterprise SRE maintaining high-availability financial systems. Incident management, automation, monitoring at scale.",
  },
  {
    company: "Cisco AppDynamics",
    role: "Senior Sales Engineer",
    period: "2022 — 2023",
    yusufNote: "Slipped through a crack somewhere. Excelled. The entrepreneur bug was itching.",
    recruiterNote: "Pre-sales engineering for APM solutions. Technical demos, POCs, and architecture reviews for enterprise accounts.",
  },
  {
    company: "HashiCorp",
    role: "Sales Engineer",
    period: "2023 — Present",
    yusufNote: "Continued to excel. But the real work happens after hours.",
    recruiterNote: "Infrastructure automation consulting. Terraform, Vault, and cloud-native architecture for enterprise clients.",
  },
];

export function CorporateChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="corporate" align="right">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400/60 mb-4">
        The Corporate Bridge
      </p>

      <h2 className="font-display text-3xl sm:text-4xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
        {mode === "yusuf" ? (
          <>
            Monoliths I walked
            <br />
            through.
          </>
        ) : (
          <>
            Professional
            <br />
            Experience
          </>
        )}
      </h2>

      <div className="space-y-5">
        {roles.map((r) => (
          <div
            key={r.company}
            className="border-l border-white/10 pl-4 py-1"
          >
            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-sm font-medium text-white/80">
                {r.company}
              </h3>
              <span className="font-mono text-[10px] text-white/20">
                {r.period}
              </span>
            </div>
            <p className="font-mono text-[11px] text-white/40 mb-1.5">
              {r.role}
            </p>
            <p className="text-xs text-white/30 leading-relaxed">
              {mode === "yusuf" ? r.yusufNote : r.recruiterNote}
            </p>
          </div>
        ))}
      </div>
    </ChapterLayout>
  );
}
