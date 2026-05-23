"use client";

import { chapterOrder } from "@/lib/colors";
import { useScrollStore } from "@/store/scroll";
import { jumpToProgress } from "@/hooks/use-virtual-scroll";

const chapterLabels: Record<string, string> = {
  hero: "Start",
  origin: "Origin",
  builder: "Builder",
  corporate: "Corporate",
  convergence: "Convergence",
  culture: "Culture",
  contact: "Contact",
};

export function ChapterDots() {
  const chapterIndex = useScrollStore((s) => s.chapterIndex);

  return (
    <div className="fixed right-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 sm:right-5">
      {chapterOrder.map((key, i) => (
        <button
          key={key}
          onClick={() => {
            // Jump to middle of chapter for best content visibility
            jumpToProgress((i + 0.3) / chapterOrder.length);
          }}
          className="group relative flex items-center justify-end"
          aria-label={`Go to ${chapterLabels[key]} section`}
        >
          {/* Label on hover */}
          <span className="absolute right-5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.15em] text-white/0 group-hover:text-white/50 transition-all duration-300 pointer-events-none">
            {chapterLabels[key]}
          </span>
          <span
            className={`block rounded-full transition-all duration-500 ${
              i === chapterIndex
                ? "h-3 w-3 bg-white"
                : i < chapterIndex
                  ? "h-2 w-2 bg-white/30"
                  : "h-1.5 w-1.5 bg-white/10"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
