"use client";

import { useEffect, useRef, useState } from "react";

export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current)
        ref.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };
    const over = () => setHover(true);
    const out = () => setHover(false);
    window.addEventListener("mousemove", move);
    const targets = () => document.querySelectorAll("a, button");
    targets().forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      targets().forEach((el) => {
        el.removeEventListener("mouseenter", over);
        el.removeEventListener("mouseleave", out);
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[200] hidden mix-blend-difference lg:block"
      style={{
        width: hover ? 40 : 12,
        height: hover ? 40 : 12,
        marginLeft: hover ? -14 : 0,
        marginTop: hover ? -14 : 0,
        borderRadius: "50%",
        backgroundColor: "white",
        transition:
          "width 0.3s cubic-bezier(0.32,0.72,0,1), height 0.3s cubic-bezier(0.32,0.72,0,1), margin 0.3s cubic-bezier(0.32,0.72,0,1)",
      }}
    />
  );
}
