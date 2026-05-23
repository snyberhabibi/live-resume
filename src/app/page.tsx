"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Nav } from "@/components/ui/nav";
import { ChapterDots } from "@/components/ui/chapter-dots";
import { Loader } from "@/components/ui/loader";
import { HeroChapter } from "@/components/chapters/01-hero";
import { OriginChapter } from "@/components/chapters/02-origin";
import { BuilderChapter } from "@/components/chapters/03-builder";
import { CorporateChapter } from "@/components/chapters/04-corporate";
import { ConvergenceChapter } from "@/components/chapters/05-convergence";
import { CultureChapter } from "@/components/chapters/06-culture";
import { ContactChapter } from "@/components/chapters/07-contact";
import { useVirtualScroll } from "@/hooks/use-virtual-scroll";

const CanvasWrapper = dynamic(
  () =>
    import("@/components/three/canvas-wrapper").then(
      (mod) => mod.CanvasWrapper
    ),
  { ssr: false }
);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const handleLoaded = useCallback(() => setLoaded(true), []);

  useVirtualScroll();

  return (
    <>
      <Loader onComplete={handleLoaded} />
      <CanvasWrapper />
      {loaded && (
        <>
          <Nav />
          <ChapterDots />
        </>
      )}
      <HeroChapter />
      <OriginChapter />
      <BuilderChapter />
      <CorporateChapter />
      <ConvergenceChapter />
      <CultureChapter />
      <ContactChapter />
    </>
  );
}
