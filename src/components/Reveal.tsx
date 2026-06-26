"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

export const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
export const SPRING_SNAPPY = { type: "spring" as const, stiffness: 200, damping: 28 };

export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ ...SPRING, delay: delay + i * 0.045 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Typewriter({
  text,
  delay = 0,
  speed = 14,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (reduce) {
      setShown(text); // reduced motion → show full text immediately
      return;
    }
    if (!inView) return;
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, text, delay, speed, reduce]);
  // full text is always available to assistive tech via aria-label; the
  // animated, partially-typed text is aria-hidden decoration
  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">
        {shown}
        {shown.length < text.length && inView && !reduce && (
          <span className="animate-pulse">_</span>
        )}
      </span>
    </span>
  );
}
