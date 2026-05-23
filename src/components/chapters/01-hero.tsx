"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

export function HeroChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="hero" align="center">
      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/30 mb-4">
        Dubai, UAE
      </p>
      <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-medium text-white/90 tracking-tight leading-[0.9] mb-6">
        Yusuf
        <br />
        Rahman
      </h1>
      {mode === "yusuf" ? (
        <p className="font-display text-lg sm:text-xl text-white/50 max-w-md mx-auto leading-relaxed">
          Everything reduces to dust.
          <br />
          Everything can be rebuilt.
        </p>
      ) : (
        <p className="font-mono text-xs text-white/40 max-w-sm mx-auto leading-relaxed tracking-wide">
          Founder & AI Engineer — building AI-powered operations
          <br />
          that automate 645+ hours/month
        </p>
      )}
      <div className="mt-10 flex items-center justify-center gap-2 text-white/20">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="animate-bounce"
        >
          <path
            d="M6 2v8M3 7l3 3 3-3"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </ChapterLayout>
  );
}
