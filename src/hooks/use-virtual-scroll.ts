"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScrollStore } from "@/store/scroll";

const SCROLL_SPEED = 0.001;
const TOUCH_MULTIPLIER = 0.004;
const LERP = 0.08;
const KEY_STEP = 0.04;

/** Exposed so chapter dots can jump to a position */
let _targetRef = { current: 0 };

export function jumpToProgress(p: number) {
  _targetRef.current = Math.max(0, Math.min(1, p));
}

export function useVirtualScroll() {
  const setProgress = useScrollStore((s) => s.setProgress);
  const currentRef = useRef(0);
  const rafRef = useRef<number>(0);
  const touchStartRef = useRef(0);

  // Expose targetRef globally
  _targetRef.current = 0;
  const targetRef = useRef(0);
  _targetRef = targetRef;

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
        targetRef.current = Math.min(1, targetRef.current + KEY_STEP);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        targetRef.current = Math.max(0, targetRef.current - KEY_STEP);
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
