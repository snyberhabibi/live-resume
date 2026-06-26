"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*/<>[]{}=+-_\\|";

// igloo-style "decode": text resolves out of a churn of random glyphs,
// left → right. Full text is always exposed to assistive tech via aria-label.
export function Scramble({
  text,
  delay = 0,
  charMs = 26,
  className,
  start = true,
}: {
  text: string;
  delay?: number;
  charMs?: number;
  className?: string;
  start?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("");

  const active = inView && start;

  useEffect(() => {
    if (reduce) {
      setDisplay(text);
      return;
    }
    if (!active) return;
    let raf = 0;
    const timer = setTimeout(() => {
      const begin = performance.now();
      const tick = (now: number) => {
        const revealed = Math.floor((now - begin) / charMs);
        let out = "";
        let done = true;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          if (ch === " ") {
            out += " ";
          } else if (i < revealed) {
            out += ch;
          } else {
            out += GLYPHS[(Math.floor(now / 38) + i * 7) % GLYPHS.length];
            done = false;
          }
        }
        setDisplay(out);
        if (done) setDisplay(text);
        else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [active, text, delay, charMs, reduce]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
