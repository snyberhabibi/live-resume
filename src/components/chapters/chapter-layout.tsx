"use client";

import { useScrollStore } from "@/store/scroll";
import { type ChapterKey } from "@/lib/colors";

interface ChapterLayoutProps {
  chapter: ChapterKey;
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}

export function ChapterLayout({
  chapter,
  children,
  align = "left",
}: ChapterLayoutProps) {
  const currentChapter = useScrollStore((s) => s.chapter);
  const chapterProgress = useScrollStore((s) => s.chapterProgress);
  const isActive = currentChapter === chapter;

  const isFirst = chapter === "hero";
  const isLast = chapter === "contact";
  const fadeIn = isFirst ? 1 : Math.min(1, chapterProgress * 5);
  const fadeOut = isLast ? 1 : Math.min(1, (1 - chapterProgress) * 5);
  const opacity = isActive ? fadeIn * fadeOut : 0;
  const y = isActive ? (1 - opacity) * 20 : 30;

  if (opacity < 0.01) return null;

  const alignClass =
    align === "center"
      ? "items-center text-center"
      : align === "right"
        ? "items-end text-right"
        : "items-start text-left";

  return (
    <div
      className={`fixed inset-0 z-10 flex flex-col justify-center px-5 sm:px-12 lg:px-20 pointer-events-none ${alignClass}`}
      style={{ opacity, transform: `translateY(${y}px)` }}
    >
      <div className="max-w-xl pointer-events-auto rounded-2xl bg-black/30 backdrop-blur-md border border-white/5 p-6 sm:p-8">
        {children}
      </div>
    </div>
  );
}
