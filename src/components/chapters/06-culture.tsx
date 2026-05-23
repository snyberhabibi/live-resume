"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

export function CultureChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="culture" align="center">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-red-400/60 mb-4">
        The Culture
      </p>

      {mode === "yusuf" ? (
        <>
          <h2 className="font-display text-3xl sm:text-5xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            The part nobody
            <br />
            guesses from
            <br />
            my LinkedIn.
          </h2>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            500+ weddings performed with Al-Kuffiyeh Group. The largest
            Middle Eastern zaffa and dabka group in the south of the United
            States. Still performing. Still preserving.
          </p>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            I created Dabka Academy to pass the tradition forward. 5+ courses.
            100+ students. For the love of Palestinian culture.
          </p>
          <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-4">
            I founded the Arab Student Association — the largest cultural
            organization in Dallas. It spawned chapters across Texas.
          </p>
          <p className="font-display text-lg text-red-300/70 leading-relaxed">
            I fell in love with community. And the ability to bring people
            together.
          </p>
        </>
      ) : (
        <>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Community
            <br />
            Leadership
          </h2>
          <div className="space-y-3 text-sm text-white/50">
            <div className="border border-white/5 rounded-lg p-3">
              <h3 className="text-white/70 mb-1">Al-Kuffiyeh Group</h3>
              <p className="text-xs text-white/30">
                Founded & performing since 2017. 500+ wedding performances.
                Largest ME cultural performance group in the southern US.
              </p>
            </div>
            <div className="border border-white/5 rounded-lg p-3">
              <h3 className="text-white/70 mb-1">Arab Student Association</h3>
              <p className="text-xs text-white/30">
                Founded at UTD. Grew to largest cultural organization in
                Dallas. Spawned chapters statewide.
              </p>
            </div>
            <div className="border border-white/5 rounded-lg p-3">
              <h3 className="text-white/70 mb-1">Dabka Academy</h3>
              <p className="text-xs text-white/30">
                5+ courses, 100+ students. Cultural preservation through
                education.
              </p>
            </div>
          </div>
        </>
      )}
    </ChapterLayout>
  );
}
