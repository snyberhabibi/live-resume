"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

export function OriginChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="origin">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-amber-400/60 mb-4">
        The Origin
      </p>

      {mode === "yusuf" ? (
        <>
          <h2 className="font-display text-3xl sm:text-5xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Gaza. Kuwait.
            <br />
            New York. Dallas.
            <br />
            Qatar.
          </h2>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            My grandparents fled post-Nakba Palestine for Kuwait. My parents
            earned a scholarship to New York — their flight was three days
            before the Gulf War.
          </p>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            Dad worked three jobs while studying for his PhD. Mom raised five
            of us in a two-bedroom townhome and sold shawarma sandwiches
            outside the mosque after Friday prayers.
          </p>
          <p className="font-display text-lg text-amber-300/70 leading-relaxed">
            That was the first seed. The origin of homemade food — that
            bloomed into Yalla Bites.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Background
          </h2>
          <div className="space-y-3 text-sm text-white/50">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="font-mono text-[11px] text-white/30">
                EDUCATION
              </span>
              <span>B.S. Computer Engineering — UTD</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="font-mono text-[11px] text-white/30">
                LOCATION
              </span>
              <span>Dallas, TX → Qatar</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="font-mono text-[11px] text-white/30">
                LANGUAGES
              </span>
              <span>English, Arabic</span>
            </div>
          </div>
        </>
      )}
    </ChapterLayout>
  );
}
