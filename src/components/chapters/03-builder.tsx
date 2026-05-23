"use client";

import { ChapterLayout } from "./chapter-layout";
import { useModeStore } from "@/store/mode";

const ventures = [
  { name: "Glue Bookmarks", year: "Age 8", status: "dust", note: "$1 each at school" },
  { name: "@yusufstudios", year: "2018", status: "dust", note: "40M+ views, 25K followers" },
  { name: "Arab Student Association", year: "2017", status: "standing", note: "Largest cultural org in Dallas" },
  { name: "Al-Kuffiyeh Group", year: "2017", status: "standing", note: "500+ weddings, still performing" },
  { name: "KASTEA", year: "2018", status: "dust", note: "First karak tea cart in Texas" },
  { name: "Trippy", year: "2021", status: "dust", note: "Travel payment splitting app" },
  { name: "FLUX Pickleball", year: "2023", status: "dust", note: "Sold out 500 custom paddles" },
  { name: "Dabka Academy", year: "2024", status: "standing", note: "5+ courses, 100+ students" },
  { name: "Yalla Bites", year: "2025", status: "building", note: "Everything converged" },
];

export function BuilderChapter() {
  const mode = useModeStore((s) => s.mode);

  return (
    <ChapterLayout chapter="builder">
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-400/60 mb-4">
        The Builder
      </p>

      {mode === "yusuf" ? (
        <>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Some still stand.
            <br />
            Some returned to dust.
          </h2>
          <div className="space-y-2">
            {ventures.map((v) => (
              <div
                key={v.name}
                className={`flex items-center gap-3 py-1.5 ${
                  v.status === "dust"
                    ? "opacity-40"
                    : v.status === "building"
                      ? "opacity-100"
                      : "opacity-70"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    v.status === "building"
                      ? "bg-green-400 animate-pulse"
                      : v.status === "standing"
                        ? "bg-amber-400"
                        : "bg-white/20"
                  }`}
                />
                <span className="font-mono text-[10px] text-white/30 w-12">
                  {v.year}
                </span>
                <span className="text-sm text-white/80 flex-1">{v.name}</span>
                <span className="font-mono text-[10px] text-white/20 hidden sm:block">
                  {v.note}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <h2 className="font-display text-3xl sm:text-4xl font-medium text-white/90 tracking-tight leading-[1.1] mb-6">
            Entrepreneurial
            <br />
            Track Record
          </h2>
          <div className="space-y-3 text-sm text-white/50">
            <p>
              Serial entrepreneur since age 8. Founded 9+ ventures across
              food-tech, events, e-commerce, content, and community.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="border border-white/5 rounded-lg p-3">
                <div className="font-mono text-2xl text-white/80">500+</div>
                <div className="font-mono text-[10px] text-white/30 uppercase">
                  Events produced
                </div>
              </div>
              <div className="border border-white/5 rounded-lg p-3">
                <div className="font-mono text-2xl text-white/80">40M+</div>
                <div className="font-mono text-[10px] text-white/30 uppercase">
                  Content views
                </div>
              </div>
              <div className="border border-white/5 rounded-lg p-3">
                <div className="font-mono text-2xl text-white/80">9+</div>
                <div className="font-mono text-[10px] text-white/30 uppercase">
                  Ventures founded
                </div>
              </div>
              <div className="border border-white/5 rounded-lg p-3">
                <div className="font-mono text-2xl text-white/80">100+</div>
                <div className="font-mono text-[10px] text-white/30 uppercase">
                  Students taught
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </ChapterLayout>
  );
}
