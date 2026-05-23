"use client";

import dynamic from "next/dynamic";
import { Nav } from "@/components/ui/nav";
import { Hero } from "@/components/sections/hero";
import { Skills } from "@/components/sections/skills";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Contact } from "@/components/sections/contact";
import { GradientMesh } from "@/components/ui/gradient-mesh";

const Scene = dynamic(
  () => import("@/components/three/scene").then((mod) => mod.Scene),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <GradientMesh />
      <Scene />
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
    </>
  );
}
