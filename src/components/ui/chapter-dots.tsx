"use client";

import { chapterOrder } from "@/lib/colors";
import { useScrollStore } from "@/store/scroll";

export function ChapterDots() {
  const chapterIndex = useScrollStore((s) => s.chapterIndex);
  const setProgress = useScrollStore((s) => s.setProgress);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 sm:right-6">
      {chapterOrder.map((key, i) => (
        <button
          key={key}
          onClick={() => setProgress(i / chapterOrder.length + 0.001)}
          className={`h-2 w-2 rounded-full transition-all duration-500 ${
            i === chapterIndex
              ? "bg-white scale-125"
              : i < chapterIndex
                ? "bg-white/30"
                : "bg-white/10"
          }`}
          aria-label={`Go to ${key} section`}
        />
      ))}
    </div>
  );
}
