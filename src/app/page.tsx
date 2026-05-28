"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useInView,
} from "framer-motion";
import Lenis from "lenis";

// ─── Spring config (taste-skill: no linear easing ever) ──
const SPRING = { type: "spring" as const, stiffness: 100, damping: 20 };
const SPRING_SNAPPY = { type: "spring" as const, stiffness: 200, damping: 28 };

// ─── Lenis ───────────────────────────────────────────────
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

// ─── Custom cursor ───────────────────────────────────────
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

// ─── Typewriter ──────────────────────────────────────────
function Typewriter({
  text,
  delay = 0,
  speed = 15,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay * 1000);
    return () => clearTimeout(t);
  }, [inView, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {shown}
      {shown.length < text.length && inView && (
        <span className="animate-pulse">_</span>
      )}
    </span>
  );
}

// ─── Word reveal ─────────────────────────────────────────
function RevealWords({
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
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ ...SPRING, delay: delay + i * 0.04 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Preloader (fixed: timer-based, not onAnimationComplete) ─
function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-zinc-950 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 2, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="text-center">
        <motion.div
          className="font-mono text-[9px] uppercase tracking-[0.6em] text-white/15 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
        <motion.div
          className="font-display text-xl text-white/50 tracking-wide"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.6 }}
        >
          Yusuf Rahman
        </motion.div>
        <motion.div
          className="w-20 h-[1px] bg-white/10 mx-auto mt-5 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
    </motion.div>
  );
}

// ─── Frame sequence data ─────────────────────────────────
// Each transition has 40 JPEG frames extracted at 10fps
const FRAME_COUNT = 40;
const transitions: Record<string, string> = {
  "hero-origin": "/frames/hero-origin",
  "origin-builder": "/frames/origin-builder",
  "builder-corporate": "/frames/builder-corporate",
  "corporate-convergence": "/frames/corporate-convergence",
  "convergence-culture": "/frames/convergence-culture",
  "culture-contact": "/frames/culture-contact",
};

function getFramePath(transition: string, frameIndex: number): string {
  const idx = String(Math.max(1, Math.min(FRAME_COUNT, frameIndex))).padStart(3, "0");
  return `${transitions[transition]}/frame_${idx}.jpg`;
}

// ─── Frame preloader hook ────────────────────────────────
function useFramePreloader() {
  const cacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadedRef = useRef<Set<string>>(new Set());

  const preloadTransition = useCallback((name: string) => {
    if (loadedRef.current.has(name)) return;
    loadedRef.current.add(name);
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const src = getFramePath(name, i);
      if (!cacheRef.current.has(src)) {
        const img = new Image();
        img.src = src;
        cacheRef.current.set(src, img);
      }
    }
  }, []);

  // Preload first two transitions eagerly
  useEffect(() => {
    preloadTransition("hero-origin");
    preloadTransition("origin-builder");
  }, [preloadTransition]);

  return { preloadTransition };
}

// ─── Scene data ──────────────────────────────────────────
const scenes = [
  { id: "hero", image: "/visuals/hero.jpg", transition: null },
  { id: "origin", image: "/visuals/origin.jpg", transition: "hero-origin" },
  { id: "builder", image: "/visuals/builder.jpg", transition: "origin-builder" },
  { id: "corporate", image: "/visuals/corporate.jpg", transition: "builder-corporate" },
  { id: "convergence", image: "/visuals/convergence.jpg", transition: "corporate-convergence" },
  { id: "culture", image: "/visuals/culture.jpg", transition: "convergence-culture" },
  { id: "contact", image: "/visuals/contact.jpg", transition: "culture-contact" },
];

// ─── Content sections ────────────────────────────────────
const sections = [
  {
    sceneIndex: 0,
    label: "QATAR",
    lines: ["Yusuf", "Rahman"],
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
      "grandparents fled post-Nakba Palestine",
      "parents earned a scholarship to New York",
      "mom sold shawarma outside the mosque",
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
    height: "70dvh",
    interstitial: true,
  },
  {
    sceneIndex: 2,
    label: "THE BUILDER",
    lines: ["Some still stand.", "Some returned", "to dust."],
    terminal: [
      "age_8  :: Glue Bookmarks",
      "2017   :: Al-Kuffiyeh Group",
      "2018   :: KASTEA",
      "2024   :: Dabka Academy",
      "2025   :: Yalla Bites",
    ],
    accent: "#d4763c",
    layout: "right" as const,
    height: "100dvh",
  },
  {
    sceneIndex: 3,
    label: "THE CORPORATE BRIDGE",
    lines: ["Monoliths I", "walked through."],
    terminal: [
      "JPMC  :: SRE          2020-2022",
      "Cisco :: Sr. Sales Eng 2022-2023",
      "Hashi :: Sales Eng     2023-now",
    ],
    accent: "#64748b",
    layout: "left" as const,
    height: "100dvh",
  },
  {
    sceneIndex: -1,
    lines: ["The real work", "happens after hours."],
    accent: "#64748b",
    layout: "center" as const,
    height: "70dvh",
    interstitial: true,
  },
  {
    sceneIndex: 4,
    label: "THE CONVERGENCE",
    lines: ["Then my", "brother called."],
    terminal: ["cultural work + tech + failures + food", "= Yalla Bites"],
    sub: "This time, it wasn't a side project.",
    accent: "#4ade80",
    layout: "right" as const,
    height: "100dvh",
  },
  {
    sceneIndex: 5,
    label: "THE CULTURE",
    lines: ["The part nobody", "guesses from", "my LinkedIn."],
    terminal: [
      "500+ weddings :: Al-Kuffiyeh Group",
      "Dabka Academy :: 100+ students",
    ],
    accent: "#e63946",
    layout: "left" as const,
    height: "100dvh",
  },
  {
    sceneIndex: -1,
    lines: ["I fell in love with community."],
    accent: "#e63946",
    layout: "center" as const,
    height: "70dvh",
    interstitial: true,
  },
  {
    sceneIndex: 6,
    lines: ["Let's build."],
    terminal: ["agent systems, community, wild ideas"],
    accent: "#7ec8e3",
    layout: "center" as const,
    height: "100dvh",
    links: [
      { text: "Email", href: "mailto:yusuf@aai.agency" },
      { text: "GitHub", href: "https://github.com/snyberhabibi" },
      { text: "LinkedIn", href: "https://linkedin.com/in/yusufrahman" },
    ],
  },
];

// ─── Fixed background with frame-sequence transitions ────
function FixedBackground({
  activeScene,
  progress,
}: {
  activeScene: number;
  progress: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Draw current frame to canvas
  useEffect(() => {
    const scene = scenes[activeScene];
    if (!scene?.transition) return;

    const frameIndex = Math.max(
      1,
      Math.min(FRAME_COUNT, Math.ceil((Math.min(progress / 0.4, 1)) * FRAME_COUNT))
    );
    const src = getFramePath(scene.transition, frameIndex);

    const cached = frameCache.current.get(src);
    if (cached?.complete) {
      drawToCanvas(cached);
    } else {
      const img = new Image();
      img.onload = () => {
        frameCache.current.set(src, img);
        drawToCanvas(img);
      };
      img.src = src;
    }
  }, [activeScene, progress]);

  function drawToCanvas(img: HTMLImageElement) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    // Cover-fit the image
    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  }

  return (
    <div className="fixed inset-0 z-0">
      {/* Scene images */}
      {scenes.map((scene, i) => {
        const isActive = i === activeScene;
        const isPrev = i === activeScene - 1;
        const showTransition = isActive && scene.transition && progress < 0.5;
        const showImage = isActive && (progress >= 0.3 || !scene.transition);
        const showPrevImage = isPrev && progress < 0.3;

        return (
          <div
            key={scene.id}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${scene.image})`,
              opacity: showImage || showPrevImage ? 1 : 0,
              zIndex: showPrevImage ? 1 : showImage ? 3 : 0,
              transition: "opacity 0.7s cubic-bezier(0.32,0.72,0,1)",
            }}
          />
        );
      })}

      {/* Frame-sequence canvas for transitions */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity:
            scenes[activeScene]?.transition && progress < 0.5 ? 1 : 0,
          zIndex: 2,
          transition: "opacity 0.5s cubic-bezier(0.32,0.72,0,1)",
        }}
      />

      {/* Gradient overlay for text contrast */}
      <div
        className="absolute inset-0 z-[4]"
        style={{
          background:
            "linear-gradient(to bottom, rgba(9,9,11,0.45) 0%, rgba(9,9,11,0.35) 40%, rgba(9,9,11,0.45) 65%, rgba(9,9,11,0.7) 100%)",
        }}
      />
    </div>
  );
}

// ─── Nav ─────────────────────────────────────────────────
function Nav({ label }: { label: string }) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between px-6 sm:px-10 py-5 mix-blend-difference"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...SPRING, delay: 3.4 }}
    >
      <span className="font-display text-sm text-white tracking-wide">
        YR
      </span>
      <motion.span
        key={label}
        className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50"
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_SNAPPY}
      >
        {label}
      </motion.span>
    </motion.nav>
  );
}

// ─── Content section ─────────────────────────────────────
function ContentSection({
  section,
  index,
}: {
  section: (typeof sections)[number];
  index: number;
}) {
  const isHero = index === 0;
  const isContact = section.links !== undefined;

  if (section.interstitial) {
    return (
      <section
        className="relative z-10 flex items-center justify-center px-10 sm:px-24"
        style={{ minHeight: section.height }}
      >
        <div className="text-center max-w-2xl">
          {section.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords
                text={line}
                delay={0.1 + i * 0.1}
                className="block font-display italic text-[clamp(1.2rem,3vw,2.2rem)] leading-[1.3] tracking-tight text-white/60"
              />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative z-10 flex"
      style={{ minHeight: section.height }}
    >
      <div
        className={`w-full flex flex-col ${
          section.layout === "center"
            ? "items-center justify-center text-center px-8 sm:px-20"
            : section.layout === "right"
              ? "items-end justify-end text-right px-8 sm:px-16 lg:px-[14%] pb-28 sm:pb-36"
              : "items-start justify-end text-left px-8 sm:px-16 lg:px-[14%] pb-28 sm:pb-36"
        }`}
      >
        {section.label && (
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.5em] mb-5"
            style={{
              color: isHero ? "rgba(255,255,255,0.2)" : section.accent,
              opacity: isHero ? 1 : 0.7,
            }}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={SPRING}
          >
            {section.label}
          </motion.p>
        )}

        <div className={`mb-6 ${isHero ? "" : "max-w-3xl"}`}>
          {section.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords
                text={line}
                delay={0.15 + i * 0.1}
                className={`block font-display font-medium leading-[1.05] tracking-tighter text-white ${
                  isHero
                    ? "text-[clamp(2.8rem,9vw,7.5rem)]"
                    : "text-[clamp(1.5rem,4vw,3.2rem)]"
                }`}
              />
            </div>
          ))}
        </div>

        {section.sub && (
          <motion.p
            className={`font-display italic max-w-md mb-6 ${
              isHero
                ? "text-sm sm:text-base text-white/30"
                : "text-sm"
            }`}
            style={
              !isHero ? { color: section.accent, opacity: 0.45 } : undefined
            }
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.5 }}
          >
            {section.sub}
          </motion.p>
        )}

        {section.terminal && (
          <div
            className={`max-w-md mt-2 ${
              section.layout === "right" ? "text-left" : ""
            }`}
          >
            {section.terminal.map((line, i) => (
              <motion.div
                key={i}
                className="font-mono text-[11px] sm:text-[13px] leading-relaxed mb-1"
                initial={{ opacity: 0, x: section.layout === "right" ? 8 : -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING_SNAPPY, delay: 0.6 + i * 0.1 }}
              >
                <span style={{ color: section.accent, opacity: 0.35 }}>
                  {i === 0 ? "$ " : "> "}
                </span>
                <Typewriter
                  text={line}
                  delay={0.7 + i * 0.15}
                  className="text-white/35"
                />
              </motion.div>
            ))}
          </div>
        )}

        {isContact && section.links && (
          <motion.div
            className="flex gap-10 sm:gap-14 mt-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 1 }}
          >
            {section.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/20 hover:text-white/80 transition-colors duration-700"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {link.text}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Main ────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [navLabel, setNavLabel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useLenis();
  const { preloadTransition } = useFramePreloader();
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Map scroll position to active scene + progress
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const heights = sections.map((s) =>
      s.height === "70dvh" ? 0.7 : 1
    );
    const totalHeight = heights.reduce((a, b) => a + b, 0);
    const scrollPos = v * totalHeight;

    let cum = 0;
    let currentIdx = 0;
    for (let i = 0; i < heights.length; i++) {
      if (scrollPos < cum + heights[i]) {
        currentIdx = i;
        break;
      }
      cum += heights[i];
      if (i === heights.length - 1) currentIdx = i;
    }

    const section = sections[currentIdx];
    const progressInSection = Math.max(
      0,
      Math.min(1, (scrollPos - cum) / heights[currentIdx])
    );

    if (section.sceneIndex >= 0) {
      setActiveScene(section.sceneIndex);
      setSceneProgress(progressInSection);

      // Preload next transition when approaching a scene boundary
      const nextScene = scenes[section.sceneIndex + 1];
      if (nextScene?.transition) {
        preloadTransition(nextScene.transition);
      }
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
