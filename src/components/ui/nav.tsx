"use client";

import { ModeToggle } from "./mode-toggle";
import { bio } from "@/data/resume";

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500" />
        <span className="text-sm font-semibold text-white tracking-tight">
          {bio.name}
        </span>
      </div>

      <div className="flex items-center gap-6">
        <a
          href="#skills"
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          Skills
        </a>
        <a
          href="#experience"
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          Experience
        </a>
        <a
          href="#projects"
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          Projects
        </a>
        <a
          href="#contact"
          className="text-xs text-white/60 hover:text-white transition-colors"
        >
          Contact
        </a>
        <ModeToggle />
      </div>
    </nav>
  );
}
