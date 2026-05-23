"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

export function ConvergenceChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="convergence">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-green-400/60 mb-4">
        The Convergence
      </p>

      {mode === "yusuf" ? (
        <>
          <h2 className="font-display text-3xl sm:text-5xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Then my brother
            <br />
            called.
          </h2>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            April 2025. Husam called with the idea for Yalla Bites. And all
            of a sudden — every skill, every failure, every late night, every
            $1 bookmark and every shawarma sandwich — it all lined up.
          </p>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            I built Fufu — an AI cofounder that runs 7 agent teams across 5
            repos. It automates 645 hours of work every month. The equivalent
            of 4-5 employees I can't afford to hire.
          </p>
          <p className="font-display text-lg text-green-300/70 leading-relaxed">
            Every grain of sand in the sandbox found its place.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Current
            <br />
            Projects
          </h2>
          <div className="space-y-4">
            <div className="border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="text-sm font-medium text-white/80">
                  Yalla Bites
                </h3>
              </div>
              <p className="font-mono text-[11px] text-white/30 mb-2">
                Co-Founder & CTO
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                Food-tech marketplace connecting home chefs to customers.
                Full-stack platform with chef portal PWA, AI-powered
                operations, and automated pipeline.
              </p>
            </div>
            <div className="border border-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <h3 className="text-sm font-medium text-white/80">
                  Fufu — AI Cofounder
                </h3>
              </div>
              <p className="font-mono text-[11px] text-white/30 mb-2">
                Creator & Architect
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                Multi-agent orchestration system. 7 specialized AI teams
                automating 645+ hrs/month across chef acquisition,
                marketing, support, and operations. Saving $225-315K/year.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2">
              <div className="font-mono text-xl text-white/80">645+</div>
              <div className="font-mono text-[9px] text-white/20 uppercase">
                hrs/mo saved
              </div>
            </div>
            <div className="text-center p-2">
              <div className="font-mono text-xl text-white/80">7</div>
              <div className="font-mono text-[9px] text-white/20 uppercase">
                AI agents
              </div>
            </div>
            <div className="text-center p-2">
              <div className="font-mono text-xl text-white/80">5</div>
              <div className="font-mono text-[9px] text-white/20 uppercase">
                Repositories
              </div>
            </div>
          </div>
        </>
      )}
    </ChapterLayout>
  );
}
