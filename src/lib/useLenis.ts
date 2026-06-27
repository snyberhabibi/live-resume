"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useScene } from "@/three/store";

// Paged / snap navigation: each swipe (or wheel flick, arrow key, or nav-dot
// click) glides to the NEXT section and locks there, so the particle shape fully
// assembles and holds - until you swipe again. Lenis powers the smooth glide;
// we own all the input. Momentum is debounced so one flick = exactly one section.
export function useLenis() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({ smoothWheel: false });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      const p = lenis.progress;
      useScene.getState().setProgress(Number.isFinite(p) ? p : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const getSections = () => Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    let index = 0;
    let animating = false;
    let cooldown = false;
    let cdTimer = 0;

    const syncIndex = () => {
      const els = getSections();
      if (!els.length) return;
      const y = lenis.scroll;
      let best = 0;
      let bestD = Infinity;
      els.forEach((el, i) => {
        const d = Math.abs(el.offsetTop - y);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      index = best;
    };
    syncIndex();

    const goTo = (target: number) => {
      const els = getSections();
      if (animating || !els.length) return;
      const next = Math.max(0, Math.min(els.length - 1, target));
      if (next === index) return;
      index = next;
      animating = true;
      lenis.scrollTo(els[next], {
        duration: reduce ? 0.001 : 0.85,
        easing: (t: number) => 1 - Math.pow(1 - t, 4), // quart - quick, smooth settle
        lock: true,
        force: true,
        onComplete: () => {
          animating = false;
          // move focus to the landed section so SR/keyboard users are told where
          // they are (sections are tabindex=-1, so no visible ring on mouse nav)
          els[next]?.focus?.({ preventScroll: true });
        },
      });
    };
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const scrollWithin = (px: number) => {
      animating = true;
      lenis.scrollTo(px, {
        duration: reduce ? 0.001 : 0.62,
        easing: easeOutQuart,
        lock: true,
        force: true,
        onComplete: () => {
          animating = false;
        },
      });
    };

    const step = (dir: number) => {
      syncIndex(); // re-anchor in case focus/anchor scrolling drifted us
      const els = getSections();
      const cur = els[index];
      // tall sections (content exceeds the viewport - e.g. Experience on a small
      // phone): reveal the overflow WITHIN the section before advancing, so no
      // résumé content is ever unreachable. The scroll stays inside the section's
      // offset range, so the chapter/morph holds steady.
      if (cur && !animating) {
        const vh = window.innerHeight;
        const top = cur.offsetTop;
        const bottom = top + cur.offsetHeight;
        const y = lenis.scroll;
        const EDGE = 6;
        if (cur.offsetHeight > vh + EDGE) {
          if (dir > 0 && y + vh < bottom - EDGE) return scrollWithin(bottom - vh);
          if (dir < 0 && y > top + EDGE) return scrollWithin(top);
        }
      }
      goTo(index + dir);
    };

    const bumpCooldown = () => {
      cooldown = true;
      clearTimeout(cdTimer);
      cdTimer = window.setTimeout(() => {
        cooldown = false;
      }, 170);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // let pinch-zoom through
      e.preventDefault();
      if (animating || cooldown) {
        bumpCooldown(); // trailing trackpad momentum keeps it locked
        return;
      }
      if (Math.abs(e.deltaY) < 6) return;
      step(e.deltaY > 0 ? 1 : -1);
      bumpCooldown();
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (animating || cooldown) return;
      const dy = touchY - (e.changedTouches[0]?.clientY ?? touchY);
      if (Math.abs(dy) > 38) {
        step(dy > 0 ? 1 : -1);
        bumpCooldown();
      }
    };

    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        step(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(getSections().length - 1);
      }
    };

    const onJump = (e: Event) => goTo((e as CustomEvent<number>).detail);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("lr:goto", onJump as EventListener);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(cdTimer);
      lenis.destroy();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("lr:goto", onJump as EventListener);
    };
  }, []);
}
