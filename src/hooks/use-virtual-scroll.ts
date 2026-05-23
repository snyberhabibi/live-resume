"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/store/scroll";

const SCROLL_SPEED = 0.0006;
const TOUCH_MULTIPLIER = 0.003;
const LERP = 0.08;

export function useVirtualScroll() {
  const setProgress = useScrollStore((s) => s.setProgress);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);
  const touchStartRef = useRef(0);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetRef.current += e.deltaY * SCROLL_SPEED;
      targetRef.current = Math.max(0, Math.min(1, targetRef.current));
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartRef.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const delta = touchStartRef.current - e.touches[0].clientY;
      touchStartRef.current = e.touches[0].clientY;
      targetRef.current += delta * TOUCH_MULTIPLIER;
      targetRef.current = Math.max(0, Math.min(1, targetRef.current));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        targetRef.current = Math.min(1, targetRef.current + 0.02);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        targetRef.current = Math.max(0, targetRef.current - 0.02);
      }
    };

    const animate = () => {
      currentRef.current += (targetRef.current - currentRef.current) * LERP;
      setProgress(currentRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(rafRef.current);
    };
  }, [setProgress]);
}
