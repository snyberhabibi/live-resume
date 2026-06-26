"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { MotionConfig } from "framer-motion";
import { useScene } from "@/three/store";
import { useLenis } from "@/lib/useLenis";
import { Overlay } from "@/components/Overlay";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/Cursor";
import { Preloader } from "@/components/Preloader";
import { SoundToggle } from "@/components/SoundToggle";

// The WebGL world is client-only - never server-rendered.
const Experience = dynamic(() => import("@/three/Experience").then((m) => m.Experience), {
  ssr: false,
});

export default function Home() {
  useLenis();

  // reflect the active theme onto <html data-theme> for the DOM/CSS layer
  useEffect(() => {
    const apply = (t: "dark" | "light") => {
      document.documentElement.dataset.theme = t;
      // keep the browser chrome (mobile address bar) in sync with the theme
      let meta = document.querySelector('meta[name="theme-color"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "theme-color");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", t === "light" ? "#eef0f3" : "#070809");
    };
    apply(useScene.getState().theme);
    return useScene.subscribe((s) => s.theme, apply);
  }, []);

  return (
    // reducedMotion="user" makes every framer-motion transform collapse to a
    // tasteful opacity fade when the OS requests reduced motion
    <MotionConfig reducedMotion="user">
      <Preloader />
      <Cursor />
      <Nav />
      <SoundToggle />
      {/* fixed full-bleed canvas - decorative, hidden from assistive tech */}
      <div aria-hidden="true">
        <Experience />
      </div>
      {/* scrolling narrative - drives Lenis progress → scene */}
      <Overlay />
    </MotionConfig>
  );
}
