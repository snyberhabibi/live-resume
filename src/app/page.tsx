"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import Lenis from "lenis";

// ─── Spring config (taste-skill: no linear easing) ──────
const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
const SPRING_SNAPPY = { type: "spring" as const, stiffness: 200, damping: 28 };

// ─── Lenis ──────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
}

// ─── Custom cursor (desktop only) ───────────────────────
function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current)
        ref.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };
    const over = () => setHov(true);
    const out = () => setHov(false);
    window.addEventListener("mousemove", move);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", over);
        el.removeEventListener("mouseleave", out);
      });
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference hidden lg:block"
      style={{
        width: hov ? 40 : 12,
        height: hov ? 40 : 12,
        borderRadius: "50%",
        backgroundColor: "white",
        transition: "width 0.3s cubic-bezier(0.32,0.72,0,1), height 0.3s cubic-bezier(0.32,0.72,0,1)",
        marginLeft: hov ? -14 : 0,
        marginTop: hov ? -14 : 0,
      }}
    />
  );
}

// ─── Typewriter ─────────────────────────────────────────
function Typewriter({ text, delay = 0, speed = 15, className }: { text: string; delay?: number; speed?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [shown, setShown] = useState("");
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => { i++; setShown(text.slice(0, i)); if (i >= text.length) clearInterval(iv); }, speed);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, text, delay, speed]);
  return <span ref={ref} className={className}>{shown}{shown.length < text.length && inView && <span className="animate-pulse">_</span>}</span>;
}

// ─── Word reveal ────────────────────────────────────────
function RevealWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span className="inline-block" initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ ...SPRING, delay: delay + i * 0.04 }}>
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Preloader ──────────────────────────────────────────
function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => { const t = setTimeout(onComplete, 3200); return () => clearTimeout(t); }, [onComplete]);
  return (
    <motion.div className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center"
      initial={{ opacity: 1 }} animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 2, ease: [0.32, 0.72, 0, 1] }}>
      <div className="text-center">
        <motion.div className="font-display text-xl text-white/50 tracking-wide"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...SPRING, delay: 0.6 }}>
          Yusuf Abdel-Rahman
        </motion.div>
        <motion.div className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/20 mt-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.2 }}>
          Builder
        </motion.div>
        <motion.div className="w-20 h-[1px] bg-white/10 mx-auto mt-5 origin-left"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.32, 0.72, 0, 1] }} />
      </div>
    </motion.div>
  );
}

// ─── Frame data ─────────────────────────────────────────
const FRAME_COUNT = 50;
const transitions: Record<string, string> = {
  "hero-origin": "/frames/hero-origin",
  "origin-builder": "/frames/origin-builder",
  "builder-corporate": "/frames/builder-corporate",
  "corporate-convergence": "/frames/corporate-convergence",
  "convergence-culture": "/frames/convergence-culture",
};

const LOOP_FRAME_COUNT = 121; // 24fps extraction from Kling 3.0
const ambientLoops: Record<number, string> = {
  0: "/frames/hero-loop-hq",
};

function getFramePath(transition: string, frameIndex: number): string {
  const idx = String(Math.max(1, Math.min(FRAME_COUNT, frameIndex))).padStart(3, "0");
  return `${transitions[transition]}/frame_${idx}.jpg`;
}

// ─── Frame preloader ────────────────────────────────────
function useFramePreloader() {
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadedRef = useRef<Set<string>>(new Set());
  const preloadTransition = useCallback((name: string) => {
    if (loadedRef.current.has(name)) return;
    loadedRef.current.add(name);
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const src = getFramePath(name, i);
      if (!cacheRef.current.has(src)) { const img = new Image(); img.src = src; cacheRef.current.set(src, img); }
    }
  }, []);
  useEffect(() => { preloadTransition("hero-origin"); preloadTransition("origin-builder"); }, [preloadTransition]);
  return { preloadTransition };
}

// ─── Scene data ─────────────────────────────────────────
const scenes = [
  { id: "hero", image: "/visuals/hero.jpg", transition: null },
  { id: "origin", image: "/visuals/origin.jpg", transition: "hero-origin" },
  { id: "builder", image: "/visuals/builder.jpg", transition: "origin-builder" },
  { id: "corporate", image: "/visuals/corporate.jpg", transition: "builder-corporate" },
  { id: "convergence", image: "/visuals/convergence.jpg", transition: "corporate-convergence" },
  { id: "contact", image: "/visuals/hero.jpg", transition: "convergence-culture" },
];

// ─── Content sections ───────────────────────────────────
// Layout: all story sections left-aligned, hero + contact + interstitials centered
const sections = [
  {
    sceneIndex: 0,
    label: "BUILDER",
    lines: ["Yusuf", "Abdel-Rahman"],
    sub: "Everything reduces to dust. Everything can be rebuilt.",
    accent: "#e8a838",
    layout: "center" as const,
    height: "100dvh",
  },
  {
    sceneIndex: 1,
    label: "THE ORIGIN",
    lines: ["Gaza. Kuwait.", "New York. Dallas.", "Qatar."],
    terminal: [
      "a product of diaspora",
      "grandparents fled post-Nakba Palestine",
      "parents earned a scholarship to New York days before the Gulf War",
      "mom sold shawarma outside the mosque to make ends meet",
    ],
    sub: "That was the first seed.",
    accent: "#e8a838",
    layout: "left" as const,
    height: "100dvh",
  },
  {
    sceneIndex: -1,
    lines: ["The origin of homemade food", "that bloomed into Yalla Bites."],
    accent: "#e8a838",
    layout: "center" as const,
    height: "60dvh",
    interstitial: true,
  },
  {
    sceneIndex: 2,
    label: "THE BUILDER",
    lines: ["Some still stand.", "Some returned to dust."],
    terminal: [
      "age 8  :: Glue Bookmarks",
      "2017   :: Al-Kuffiyeh Group                              \u{1F7E2}",
      "2017   :: Arab Student Association                       \u{1F7E2}",
      "2017   :: YusufStudios (25K followers, 50M views)        \u{1F534}",
      "2018   :: KASTEA                                         \u{1F534}",
      "2020   :: Frui2ee (Animated Fruit E-Commerce)            \u{1F534}",
      "2021   :: TRIPPY (Group Travel Payment Splitting)        \u{1F534}",
      "2022   :: Custom Made Easy (Custom Clothing Mfg)         \u{1F534}",
      "2023   :: FLUX Pickleball (E-Commerce)                   \u{1F534}",
      "2024   :: Dabka Academy (In-Person Classes)              \u{1F7E2}",
      "2025   :: Yalla Bites                                    \u{1F7E2}",
    ],
    accent: "#e8a838",
    layout: "left" as const,
    height: "100dvh",
  },
  {
    sceneIndex: 3,
    label: "THE CORPORATE BRIDGE",
    lines: ["Monoliths I walked through."],
    terminal: [
      "JPMorgan Chase :: SRE                  2020-2022",
      "Cisco          :: Sr. Sales Engineer   2022-2023",
      "IBM            :: Sales Engineer       2023-2024",
      "HashiCorp      :: Sales Engineer       2024-now",
    ],
    accent: "#94a3b8",
    layout: "left" as const,
    height: "100dvh",
  },
  {
    sceneIndex: 4,
    label: "THE CONVERGENCE",
    lines: ["Then my brother called."],
    terminal: ["cultural work + tech + failures + food", "= Yalla Bites"],
    sub: "This time, it wasn't a side project.",
    accent: "#4ade80",
    layout: "left" as const,
    height: "100dvh",
  },
  {
    sceneIndex: 5,
    lines: ["Let's build."],
    sub: "yusuf@yallabites.com",
    accent: "#e8a838",
    layout: "center" as const,
    height: "100dvh",
    links: [
      { text: "Email", href: "mailto:yusuf@yallabites.com" },
      { text: "LinkedIn", href: "https://www.linkedin.com/in/yusufarahman/" },
    ],
  },
];

// ─── Ambient loop playback ──────────────────────────────
function useAmbientLoop(activeScene: number) {
  const frameRef = useRef(1);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loopPath = ambientLoops[activeScene];

  useEffect(() => {
    if (!loopPath) return;
    for (let i = 1; i <= LOOP_FRAME_COUNT; i++) {
      const src = `${loopPath}/frame_${String(i).padStart(3, "0")}.jpg`;
      if (!cacheRef.current.has(src)) { const img = new Image(); img.src = src; cacheRef.current.set(src, img); }
    }
    const interval = 1000 / 24;
    function tick(time: number) {
      if (time - lastTimeRef.current >= interval) {
        lastTimeRef.current = time;
        frameRef.current = (frameRef.current % LOOP_FRAME_COUNT) + 1;
        const src = `${loopPath}/frame_${String(frameRef.current).padStart(3, "0")}.jpg`;
        const img = cacheRef.current.get(src);
        if (img?.complete) drawToCanvas(canvasRef.current, img);
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [loopPath]);

  return canvasRef;
}

function drawToCanvas(canvas: HTMLCanvasElement | null, img: HTMLImageElement) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
}

// ─── Fixed background ───────────────────────────────────
function FixedBackground({ activeScene, progress }: { activeScene: number; progress: number }) {
  const transitionCanvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<Map<string, HTMLImageElement>>(new Map());
  const ambientCanvasRef = useAmbientLoop(activeScene);

  useEffect(() => {
    const scene = scenes[activeScene];
    if (!scene?.transition) return;
    const frameIndex = Math.max(1, Math.min(FRAME_COUNT, Math.ceil((Math.min(progress / 0.4, 1)) * FRAME_COUNT)));
    const src = getFramePath(scene.transition, frameIndex);
    const cached = frameCache.current.get(src);
    if (cached?.complete) { drawToCanvas(transitionCanvasRef.current, cached); }
    else { const img = new Image(); img.onload = () => { frameCache.current.set(src, img); drawToCanvas(transitionCanvasRef.current, img); }; img.src = src; }
  }, [activeScene, progress]);

  const hasLoop = activeScene in ambientLoops;
  const showTransition = scenes[activeScene]?.transition && progress < 0.5;

  return (
    <div className="fixed inset-0 z-0">
      {scenes.map((scene, i) => {
        const isActive = i === activeScene;
        const isPrev = i === activeScene - 1;
        const showImage = isActive && (progress >= 0.3 || !scene.transition);
        const showPrevImage = isPrev && progress < 0.3;
        return (
          <div key={scene.id} className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${scene.image})`, opacity: showImage || showPrevImage ? 1 : 0,
              zIndex: showPrevImage ? 1 : showImage ? 3 : 0,
              transition: "opacity 0.7s cubic-bezier(0.32,0.72,0,1)" }} />
        );
      })}
      <canvas ref={ambientCanvasRef} className="absolute inset-0 w-full h-full"
        style={{ opacity: hasLoop && !showTransition ? 1 : 0, zIndex: 3, transition: "opacity 1s cubic-bezier(0.32,0.72,0,1)" }} />
      <canvas ref={transitionCanvasRef} className="absolute inset-0 w-full h-full"
        style={{ opacity: showTransition ? 1 : 0, zIndex: 4, transition: "opacity 0.5s cubic-bezier(0.32,0.72,0,1)" }} />
      <div className="absolute inset-0 z-[5]"
        style={{ background: "linear-gradient(to bottom, rgba(9,9,11,0.5) 0%, rgba(9,9,11,0.4) 35%, rgba(9,9,11,0.5) 60%, rgba(9,9,11,0.75) 100%)" }} />
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────
function Nav({ label }: { label: string }) {
  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 mix-blend-difference"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...SPRING, delay: 3.4 }}>
      <span className="font-display text-sm text-white tracking-wide">YR</span>
      <motion.span key={label} className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.4em] text-white/50"
        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={SPRING_SNAPPY}>
        {label}
      </motion.span>
    </motion.nav>
  );
}

// ─── Content section ────────────────────────────────────
function ContentSection({ section, index }: { section: (typeof sections)[number]; index: number }) {
  const isHero = index === 0;
  const isContact = section.links !== undefined;

  // Interstitial — centered italic bridge text
  if (section.interstitial) {
    return (
      <section className="relative z-10 flex items-center justify-center px-6 sm:px-16" style={{ minHeight: section.height }}>
        <div className="text-center max-w-xl text-readable-subtle">
          {section.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords text={line} delay={0.1 + i * 0.1}
                className="block font-display italic text-[clamp(1.1rem,2.5vw,1.8rem)] leading-[1.4] tracking-tight text-white/80" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Hero + Contact — large centered text
  if (section.layout === "center") {
    return (
      <section className="relative z-10 flex items-center justify-center px-6 sm:px-12" style={{ minHeight: section.height }}>
        <div className="text-center max-w-5xl">
          {section.label && (
            <motion.p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.5em] mb-4 sm:mb-6 text-readable-subtle"
              style={{ color: isHero ? "rgba(255,255,255,0.4)" : section.accent }}
              initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={SPRING}>
              {section.label}
            </motion.p>
          )}
          <div className="mb-4 sm:mb-6 text-readable">
            {section.lines.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <RevealWords text={line} delay={0.15 + i * 0.1}
                  className="block font-display font-semibold leading-[1.05] tracking-tighter text-white text-[clamp(2.2rem,7vw,6rem)]" />
              </div>
            ))}
          </div>
          {section.sub && (
            <motion.p className={`font-display italic text-readable-subtle mx-auto ${isHero ? "text-sm sm:text-base text-white/60 max-w-sm" : "text-sm sm:text-lg max-w-md"}`}
              style={!isHero ? { color: section.accent } : undefined}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.5 }}>
              {section.sub}
            </motion.p>
          )}
          {isContact && section.links && (
            <motion.div className="flex gap-8 sm:gap-12 mt-8 sm:mt-12 justify-center text-readable-subtle"
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.8 }}>
              {section.links.map((link) => (
                <a key={link.href} href={link.href}
                  className="font-mono text-[10px] sm:text-[12px] uppercase tracking-[0.15em] text-white/50 hover:text-white transition-colors duration-700"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                  {link.text}
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    );
  }

  // Story sections — always left-aligned, bottom-anchored
  return (
    <section className="relative z-10 flex items-end" style={{ minHeight: section.height }}>
      <div className="w-full px-6 sm:px-10 lg:px-[10%] pb-16 sm:pb-24 lg:pb-32 max-w-4xl">
        {section.label && (
          <motion.p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.5em] mb-4 sm:mb-5 text-readable-subtle"
            style={{ color: section.accent }}
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={SPRING}>
            {section.label}
          </motion.p>
        )}
        <div className="mb-4 sm:mb-6 text-readable">
          {section.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords text={line} delay={0.15 + i * 0.1}
                className="block font-display font-semibold leading-[1.08] tracking-tighter text-white text-[clamp(1.4rem,3.5vw,2.8rem)]" />
            </div>
          ))}
        </div>
        {section.sub && (
          <motion.p className="font-display italic text-sm sm:text-base text-readable-subtle max-w-md mb-4"
            style={{ color: section.accent }}
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...SPRING, delay: 0.5 }}>
            {section.sub}
          </motion.p>
        )}
        {section.terminal && (
          <div className="max-w-lg mt-3 text-readable-subtle">
            {section.terminal.map((line, i) => (
              <motion.div key={i} className="font-mono text-[11px] sm:text-[13px] leading-relaxed mb-1"
                initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ ...SPRING_SNAPPY, delay: 0.6 + i * 0.1 }}>
                <span style={{ color: section.accent, opacity: 0.6 }}>{i === 0 ? "$ " : "> "}</span>
                <Typewriter text={line} delay={0.7 + i * 0.15} className="text-white/60" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Main ───────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [navLabel, setNavLabel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useLenis();
  const { preloadTransition } = useFramePreloader();
  const { scrollYProgress } = useScroll({ target: containerRef });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const heights = sections.map((s) => s.height === "60dvh" ? 0.6 : 1);
    const totalHeight = heights.reduce((a, b) => a + b, 0);
    const scrollPos = v * totalHeight;

    let cum = 0;
    let currentIdx = 0;
    for (let i = 0; i < heights.length; i++) {
      if (scrollPos < cum + heights[i]) { currentIdx = i; break; }
      cum += heights[i];
      if (i === heights.length - 1) currentIdx = i;
    }

    const section = sections[currentIdx];
    const progressInSection = Math.max(0, Math.min(1, (scrollPos - cum) / heights[currentIdx]));

    if (section.sceneIndex >= 0) {
      setActiveScene(section.sceneIndex);
      setSceneProgress(progressInSection);
      const nextScene = scenes[section.sceneIndex + 1];
      if (nextScene?.transition) preloadTransition(nextScene.transition);
    }

    setNavLabel(section.label || "");
  });

  const handleLoaded = useCallback(() => setLoaded(true), []);

  return (
    <>
      {!loaded && <Preloader onComplete={handleLoaded} />}
      <CustomCursor />
      {loaded && <Nav label={navLabel} />}
      <FixedBackground activeScene={activeScene} progress={sceneProgress} />
      <div ref={containerRef} className="relative z-10">
        {sections.map((section, i) => (
          <ContentSection key={i} section={section} index={i} />
        ))}
      </div>
    </>
  );
}
