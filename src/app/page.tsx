"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Lenis from "lenis";

// ─── Lenis ─────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.6,
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

// ─── Custom cursor ─────────────────────────────────────
function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [hov, setHov] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
    };
    const over = () => setHov(true);
    const out = () => setHov(false);
    window.addEventListener("mousemove", move);
    const els = document.querySelectorAll("a, button");
    els.forEach((el) => { el.addEventListener("mouseenter", over); el.addEventListener("mouseleave", out); });
    return () => {
      window.removeEventListener("mousemove", move);
      els.forEach((el) => { el.removeEventListener("mouseenter", over); el.removeEventListener("mouseleave", out); });
    };
  }, []);

  return (
    <div ref={ref} className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference hidden lg:block"
      style={{ width: hov ? 40 : 12, height: hov ? 40 : 12, borderRadius: "50%", backgroundColor: "white",
        transition: "width 0.3s ease, height 0.3s ease", marginLeft: hov ? -14 : 0, marginTop: hov ? -14 : 0 }} />
  );
}

// ─── Typewriter ────────────────────────────────────────
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

// ─── Word reveal ───────────────────────────────────────
function RevealWords({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span className="inline-block" initial={{ y: "110%" }}
            animate={inView ? { y: 0 } : { y: "110%" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.04 }}>
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Preloader ─────────────────────────────────────────
function Preloader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
      initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 1.2, delay: 2, ease: "easeInOut" }}
      onAnimationComplete={onComplete}>
      <div className="text-center">
        <motion.div className="font-mono text-[9px] uppercase tracking-[0.6em] text-white/15 mb-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>Initializing</motion.div>
        <motion.div className="font-display text-xl text-white/50 tracking-wide"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>Yusuf Rahman</motion.div>
        <motion.div className="w-20 h-[1px] bg-white/10 mx-auto mt-5 origin-left"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }} />
      </div>
    </motion.div>
  );
}

// ─── Scanlines ─────────────────────────────────────────
function Scanlines() {
  return <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.015]"
    style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)" }} />;
}

// ─── Scene data ────────────────────────────────────────
// Each scene: a background image + optional video transition from previous scene
// The fixed background crossfades between these based on scroll
const scenes = [
  { id: "hero", image: "/visuals/hero.jpg", mobileImage: "/visuals/hero-mobile.jpg" },
  { id: "origin", image: "/visuals/origin.jpg", mobileImage: "/visuals/origin-mobile.jpg", video: "/visuals/transition-hero-origin.mp4" },
  { id: "builder", image: "/visuals/builder.jpg", video: "/visuals/transition-origin-builder.mp4" },
  { id: "corporate", image: "/visuals/corporate.jpg", video: "/visuals/transition-builder-corporate.mp4" },
  { id: "convergence", image: "/visuals/convergence.jpg", video: "/visuals/transition-corporate-convergence.mp4" },
  { id: "culture", image: "/visuals/culture.jpg", mobileImage: "/visuals/culture-mobile.jpg", video: "/visuals/transition-convergence-culture.mp4" },
  { id: "contact", image: "/visuals/contact.jpg", video: "/visuals/transition-culture-contact.mp4" },
];

// Content sections that scroll over the fixed background
const sections = [
  {
    sceneIndex: 0, // hero
    label: "QATAR", lines: ["Yusuf", "Rahman"],
    sub: "Everything reduces to dust. Everything can be rebuilt.",
    accent: "#e8a838", layout: "center" as const, height: "100vh",
  },
  {
    sceneIndex: 1, // origin
    label: "THE ORIGIN", lines: ["Gaza. Kuwait.", "New York. Dallas.", "Qatar."],
    terminal: ["grandparents fled post-Nakba Palestine", "parents earned a scholarship to New York", "mom sold shawarma outside the mosque"],
    sub: "That was the first seed.",
    accent: "#e8a838", layout: "left" as const, height: "100vh",
  },
  {
    sceneIndex: -1, // interstitial (no scene change)
    lines: ["The origin of homemade food —", "that bloomed into Yalla Bites."],
    accent: "#e8a838", layout: "center" as const, height: "60vh", interstitial: true,
  },
  {
    sceneIndex: 2, // builder
    label: "THE BUILDER", lines: ["Some still stand.", "Some returned", "to dust."],
    terminal: ["age_8  :: Glue Bookmarks", "2017   :: Al-Kuffiyeh Group", "2018   :: KASTEA", "2024   :: Dabka Academy", "2025   :: Yalla Bites ■"],
    accent: "#d4763c", layout: "right" as const, height: "100vh",
  },
  {
    sceneIndex: 3, // corporate
    label: "THE CORPORATE BRIDGE", lines: ["Monoliths I", "walked through."],
    terminal: ["JPMC  :: SRE          2020-2022", "Cisco :: Sr. Sales Eng 2022-2023", "Hashi :: Sales Eng     2023-now"],
    accent: "#64748b", layout: "left" as const, height: "100vh",
  },
  {
    sceneIndex: -1, // interstitial
    lines: ["The real work", "happens after hours."],
    accent: "#64748b", layout: "center" as const, height: "60vh", interstitial: true,
  },
  {
    sceneIndex: 4, // convergence
    label: "THE CONVERGENCE", lines: ["Then my", "brother called."],
    terminal: ["cultural work + tech + failures + food", "= Yalla Bites"],
    sub: "This time, it wasn't a side project.",
    accent: "#4ade80", layout: "right" as const, height: "100vh",
  },
  {
    sceneIndex: 5, // culture
    label: "THE CULTURE", lines: ["The part nobody", "guesses from", "my LinkedIn."],
    terminal: ["500+ weddings :: Al-Kuffiyeh Group", "Dabka Academy :: 100+ students"],
    accent: "#e63946", layout: "left" as const, height: "100vh",
  },
  {
    sceneIndex: -1, // interstitial
    lines: ["I fell in love with community."],
    accent: "#e63946", layout: "center" as const, height: "60vh", interstitial: true,
  },
  {
    sceneIndex: 6, // contact
    lines: ["Let's build."],
    terminal: ["agent systems, community, wild ideas"],
    accent: "#7ec8e3", layout: "center" as const, height: "100vh",
    links: [
      { text: "Email", href: "mailto:yusuf@aai.agency" },
      { text: "GitHub", href: "https://github.com/snyberhabibi" },
      { text: "LinkedIn", href: "https://linkedin.com/in/yusufrahman" },
    ],
  },
];

// ─── Fixed fullscreen background ───────────────────────
// One continuous visual canvas. Images and videos crossfade based on
// which section is currently in view. You TRAVEL into the scene.
function FixedBackground({ activeScene, progress }: { activeScene: number; progress: number }) {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Scrub active video based on transition progress
  useEffect(() => {
    const vid = videoRefs.current[activeScene];
    if (vid && vid.duration) {
      // progress 0-0.4 = scrub video, 0.4-1 = hold on final frame
      const scrub = Math.min(1, progress / 0.4);
      vid.currentTime = scrub * vid.duration;
    }
  }, [activeScene, progress]);

  return (
    <div className="fixed inset-0 z-0">
      {scenes.map((scene, i) => {
        const isActive = i === activeScene;
        const isPrev = i === activeScene - 1;
        // Active scene: show. Previous scene: show during video transition (progress < 0.3)
        const showVideo = isActive && scene.video && progress < 0.5;
        const showImage = isActive && progress >= 0.3;
        const showPrevImage = isPrev && progress < 0.3;

        return (
          <div key={scene.id}>
            {/* Video transition layer */}
            {scene.video && (
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={scene.video}
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: showVideo ? 1 : 0, zIndex: 2 }}
              />
            )}
            {/* Image layer */}
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700"
              style={{
                backgroundImage: `url(${scene.image})`,
                opacity: showImage || showPrevImage ? 1 : 0,
                zIndex: showPrevImage ? 1 : showImage ? 3 : 0,
              }}
            />
          </div>
        );
      })}
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/40 z-[4]" />
    </div>
  );
}

// ─── Nav ───────────────────────────────────────────────
function Nav({ label }: { label: string }) {
  return (
    <motion.nav className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between px-6 sm:px-10 py-5 mix-blend-difference"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5, duration: 1 }}>
      <span className="font-display text-sm text-white tracking-wide">YR</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50">{label}</span>
    </motion.nav>
  );
}

// ─── Content section ───────────────────────────────────
function ContentSection({ section, index }: { section: typeof sections[number]; index: number }) {
  const isHero = index === 0;
  const isContact = section.links !== undefined;

  if (section.interstitial) {
    return (
      <section className="relative z-10 flex items-center justify-center px-10 sm:px-24" style={{ height: section.height }}>
        <div className="text-center max-w-2xl">
          {section.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords text={line} delay={0.1 + i * 0.1}
                className="block font-display italic text-[clamp(1.2rem,3vw,2.2rem)] leading-[1.3] tracking-tight text-white/70" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="relative z-10 flex" style={{ minHeight: section.height }}>
      <div className={`w-full flex flex-col ${
        section.layout === "center" ? "items-center justify-center text-center px-8 sm:px-20"
        : section.layout === "right" ? "items-end justify-end text-right px-8 sm:px-16 lg:px-[14%] pb-24 sm:pb-32"
        : "items-start justify-end text-left px-8 sm:px-16 lg:px-[14%] pb-24 sm:pb-32"
      }`}>

        {section.label && (
          <motion.p className="font-mono text-[9px] uppercase tracking-[0.6em] mb-5"
            style={{ color: isHero ? "rgba(255,255,255,0.25)" : section.accent }}
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            {section.label}
          </motion.p>
        )}

        <div className={`mb-6 ${isHero ? "" : "max-w-3xl"}`}>
          {section.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords text={line} delay={0.15 + i * 0.1}
                className={`block font-display font-medium leading-[1.05] tracking-tight text-white ${
                  isHero ? "text-[clamp(2.5rem,8vw,7rem)]" : "text-[clamp(1.4rem,3.5vw,3rem)]"
                }`} />
            </div>
          ))}
        </div>

        {section.sub && (
          <motion.p className={`font-display italic max-w-md mb-6 ${isHero ? "text-sm sm:text-base text-white/35" : "text-sm"}`}
            style={!isHero ? { color: section.accent, opacity: 0.5 } : undefined}
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}>
            {section.sub}
          </motion.p>
        )}

        {section.terminal && (
          <div className={`max-w-md mt-1 ${section.layout === "right" ? "text-left" : ""}`}>
            {section.terminal.map((line, i) => (
              <motion.div key={i} className="font-mono text-[11px] sm:text-[13px] leading-relaxed mb-1"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.12 }}>
                <span style={{ color: section.accent, opacity: 0.4 }}>{i === 0 ? "$ " : "> "}</span>
                <Typewriter text={line} delay={0.7 + i * 0.15} className="text-white/40" />
              </motion.div>
            ))}
          </div>
        )}

        {isContact && section.links && (
          <motion.div className="flex gap-8 sm:gap-12 mt-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}>
            {section.links.map((link) => (
              <a key={link.href} href={link.href}
                className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/25 hover:text-white transition-colors duration-500"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                {link.text}
              </a>
            ))}
          </motion.div>
        )}

        {isHero && (
          <motion.div className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 1 }}>
            <motion.div className="w-[1px] h-10 bg-white/12 mx-auto mb-2"
              animate={{ scaleY: [0, 1, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }} />
            <p className="font-mono text-[7px] uppercase tracking-[0.5em] text-white/10">Scroll</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Main ──────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);
  const [navLabel, setNavLabel] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  useLenis();

  const { scrollYProgress } = useScroll({ target: containerRef });

  // Map scroll to active scene + progress within that scene
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Count visual sections (non-interstitial) to map to scenes
    const visualSections = sections.filter((s) => !s.interstitial);
    const totalSections = sections.length;

    // Find which section we're in based on cumulative height ratios
    // Each 100vh = 1 unit, 60vh = 0.6 unit
    const heights = sections.map((s) => s.height === "60vh" ? 0.6 : 1);
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
    const progressInSection = Math.max(0, Math.min(1, (scrollPos - cum) / heights[currentIdx]));

    if (section.sceneIndex >= 0) {
      setActiveScene(section.sceneIndex);
      setSceneProgress(progressInSection);
    }

    // Update nav label
    const label = section.label || "";
    setNavLabel(label);
  });

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <CustomCursor />
      <Scanlines />
      {loaded && <Nav label={navLabel} />}

      {/* Fixed background — one continuous visual canvas */}
      <FixedBackground activeScene={activeScene} progress={sceneProgress} />

      {/* Scrollable content floating over the fixed background */}
      <div ref={containerRef} className="relative z-10 cursor-none lg:cursor-none">
        {sections.map((section, i) => (
          <ContentSection key={i} section={section} index={i} />
        ))}
      </div>
    </>
  );
}
