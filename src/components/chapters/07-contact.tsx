"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

export function ContactChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="contact" align="center">
      <h2 className="font-display text-3xl sm:text-5xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
        {mode === "yusuf" ? "Let's build." : "Let's connect."}
      </h2>

      <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto leading-relaxed">
        {mode === "yusuf"
          ? "Always down to jam on agent systems, community projects, or wild ideas."
          : "Open to discussing roles where AI, product, and community intersect."}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href="mailto:yusuf@aai.agency"
          className="rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm text-white/70 transition-all hover:bg-white/10 hover:text-white font-mono text-xs tracking-wide"
        >
          yusuf@aai.agency
        </a>
        <a
          href="https://github.com/snyberhabibi"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-white/40 transition-all hover:border-white/20 hover:text-white/70 font-mono text-xs tracking-wide"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/yusufrahman"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/10 px-6 py-2.5 text-sm text-white/40 transition-all hover:border-white/20 hover:text-white/70 font-mono text-xs tracking-wide"
        >
          LinkedIn
        </a>
      </div>
    </ChapterLayout>
  );
}
