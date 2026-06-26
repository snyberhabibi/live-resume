"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
