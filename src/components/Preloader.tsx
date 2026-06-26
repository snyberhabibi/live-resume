"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useScene } from "@/three/store";

// The wait, made worth watching: a tiny terminal "builds the candidate" while
// the WebGL world warms up. Each line types in, a progress bar fills, and it
// signs off "candidate ready" before handing over to the site.
const PROMPT = "$ ./hire-yusuf.sh";
const LINES = [
  "› exp: JPMorgan · Cisco · HashiCorp · IBM",
  "› compiling complexity → clarity ..... ok",
  "› quota: 100%+ every year ............ ✓",
  "› trust + curiosity .................. linked",
  "› running readiness tests ............ passed",
];
const SPD = 7; // ms per character typed
const GAP = 95; // pause between lines

// a blinking terminal block cursor
function Caret() {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block h-[0.95em] w-[0.5em] translate-y-[0.12em] bg-[var(--accent)] align-baseline"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
    />
  );
}

export function Preloader() {
  const ready = useScene((s) => s.ready);
  const reduced = useScene((s) => s.reducedMotion);
  const [elapsed, setElapsed] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 33), 33);
    return () => clearInterval(id);
  }, []);

  // build the type-on timeline
  const promptEnd = PROMPT.length * SPD + 150;
  const starts: number[] = [];
  let t = promptEnd;
  for (const l of LINES) {
    starts.push(t);
    t += l.length * SPD + GAP;
  }
  const animEnd = t;

  const minDone = elapsed >= (reduced ? 450 : animEnd);
  const done = ready && minDone;

  useEffect(() => {
    if (!done) return;
    const x = setTimeout(() => setGone(true), 720);
    return () => clearTimeout(x);
  }, [done]);

  if (gone) return null;

  const charsOf = (start: number, len: number) =>
    reduced ? len : Math.max(0, Math.min(len, Math.floor((elapsed - start) / SPD)));

  const promptN = reduced ? PROMPT.length : Math.min(PROMPT.length, Math.floor(elapsed / SPD));
  const promptTyping = promptN < PROMPT.length;

  // the one line currently typing (gets the caret)
  let activeLine = -1;
  for (let i = 0; i < LINES.length; i++) {
    if (elapsed >= starts[i] && charsOf(starts[i], LINES[i].length) < LINES[i].length) {
      activeLine = i;
      break;
    }
  }

  const completed = LINES.filter((l, i) => charsOf(starts[i], l.length) >= l.length).length;
  const progress = done ? 1 : minDone ? 0.93 : (completed / LINES.length) * 0.85;
  const waiting = minDone && !ready; // lines done, WebGL still warming up

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] px-6"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-xl border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/80 shadow-[0_24px_70px_-22px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* title bar */}
          <div className="flex items-center gap-1.5 border-b border-[var(--fg)]/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg)]/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg)]/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--fg)]/20" />
            <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--fg)]/55">
              hire-yusuf · zsh
            </span>
          </div>
          {/* streamed output */}
          <div className="px-5 py-4 font-mono text-[10px] leading-[1.7] text-[var(--fg)]/75 sm:text-[12px]">
            <div className="text-[var(--fg)]/90">
              {PROMPT.slice(0, promptN)}
              {promptTyping && <Caret />}
            </div>
            {LINES.map((l, i) => {
              const started = elapsed >= starts[i];
              return (
                <div key={i} className="min-h-[1.7em] truncate">
                  {started && (
                    <>
                      <span>{l.slice(0, charsOf(starts[i], l.length))}</span>
                      {activeLine === i && <Caret />}
                    </>
                  )}
                </div>
              );
            })}
            <div className="min-h-[1.7em]">
              {waiting && (
                <span className="text-[var(--fg)]/60">
                  › finalizing render <Caret />
                </span>
              )}
              {done && (
                <span className="font-semibold text-[var(--accent)]">✓ candidate ready</span>
              )}
            </div>
            {/* progress */}
            <div className="mt-2 h-px w-full overflow-hidden bg-[var(--fg)]/10">
              <motion.div
                className="h-full bg-[var(--accent)]/80"
                animate={{ width: `${progress * 100}%` }}
                transition={{ ease: "easeOut", duration: 0.4 }}
              />
            </div>
          </div>
        </div>
        {/* signature under the window */}
        <motion.div
          className="mt-5 flex items-baseline justify-between px-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="font-display text-base font-semibold tracking-tight text-[var(--fg)]/80">
            Yusuf Rahman
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--fg)]/45">
            Solutions Engineer
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
