"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
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
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }
    };
    const over = () => setHovering(true);
    const out = () => setHovering(false);

    window.addEventListener("mousemove", move);
    const els = document.querySelectorAll("a, button");
    els.forEach((el) => {
      el.addEventListener("mouseenter", over);
      el.addEventListener("mouseleave", out);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      els.forEach((el) => {
        el.removeEventListener("mouseenter", over);
        el.removeEventListener("mouseleave", out);
      });
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[200] pointer-events-none mix-blend-difference hidden lg:block"
      style={{
        width: hovering ? 40 : 12,
        height: hovering ? 40 : 12,
        borderRadius: "50%",
        backgroundColor: "white",
        transition: "width 0.3s ease, height 0.3s ease",
        marginLeft: hovering ? -14 : 0,
        marginTop: hovering ? -14 : 0,
      }}
    />
  );
}

// ─── Nav ───────────────────────────────────────────────
function Nav({ currentChapter }: { currentChapter: string }) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-[90] flex items-center justify-between px-6 sm:px-10 py-5 mix-blend-difference"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
    >
      <span className="font-display text-sm text-white tracking-wide">YR</span>
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/50">
        {currentChapter}
      </span>
    </motion.nav>
  );
}

// ─── Typewriter ────────────────────────────────────────
function Typewriter({
  text,
  delay = 0,
  speed = 20,
  className,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (!isInView) return;
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [isInView, text, delay, speed]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {displayed.length < text.length && isInView && (
        <span className="animate-pulse">_</span>
      )}
    </span>
  );
}

// ─── Word reveal ───────────────────────────────────────
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
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <span ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : { y: "110%" }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + i * 0.04,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ─── Preloader ─────────────────────────────────────────
function Preloader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1.2, delay: 2, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <div className="text-center">
        <motion.div
          className="font-mono text-[9px] uppercase tracking-[0.6em] text-white/15 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Initializing
        </motion.div>
        <motion.div
          className="font-display text-xl text-white/50 tracking-wide"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Yusuf Rahman
        </motion.div>
        <motion.div
          className="w-20 h-[1px] bg-white/10 mx-auto mt-5 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

// ─── Scanlines ─────────────────────────────────────────
function Scanlines() {
  return (
    <div
      className="fixed inset-0 z-[50] pointer-events-none opacity-[0.02]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
      }}
    />
  );
}

// ─── Data ──────────────────────────────────────────────
type Chapter = {
  id: string;
  type: "visual" | "interstitial";
  image?: string;
  mobileImage?: string;
  transition?: string;
  label?: string;
  lines: string[];
  terminal?: string[];
  sub?: string;
  accent: string;
  layout: "center" | "left" | "right";
  links?: { text: string; href: string }[];
};

const chapters: Chapter[] = [
  {
    id: "hero",
    type: "visual",
    image: "/visuals/hero.jpg",
    mobileImage: "/visuals/hero-mobile.jpg",
    label: "QATAR",
    lines: ["Yusuf", "Rahman"],
    sub: "Everything reduces to dust. Everything can be rebuilt.",
    accent: "#e8a838",
    layout: "center",
  },
  {
    id: "origin",
    type: "visual",
    image: "/visuals/origin.jpg",
    mobileImage: "/visuals/origin-mobile.jpg",
    transition: "/visuals/transition-hero-origin.mp4",
    label: "THE ORIGIN",
    lines: ["Gaza. Kuwait.", "New York. Dallas.", "Qatar."],
    terminal: [
      "grandparents fled post-Nakba Palestine",
      "parents earned a scholarship to New York",
      "mom sold shawarma outside the mosque",
    ],
    sub: "That was the first seed.",
    accent: "#e8a838",
    layout: "left",
  },
  {
    id: "interstitial-1",
    type: "interstitial",
    lines: ["The origin of homemade food —", "that bloomed into Yalla Bites."],
    accent: "#e8a838",
    layout: "center",
  },
  {
    id: "builder",
    type: "visual",
    image: "/visuals/builder.jpg",
    transition: "/visuals/transition-origin-builder.mp4",
    label: "THE BUILDER",
    lines: ["Some still stand.", "Some returned", "to dust."],
    terminal: [
      "age_8  :: Glue Bookmarks",
      "2017   :: Al-Kuffiyeh Group",
      "2018   :: KASTEA",
      "2024   :: Dabka Academy",
      "2025   :: Yalla Bites ■",
    ],
    accent: "#d4763c",
    layout: "right",
  },
  {
    id: "corporate",
    type: "visual",
    image: "/visuals/corporate.jpg",
    transition: "/visuals/transition-builder-corporate.mp4",
    label: "THE CORPORATE BRIDGE",
    lines: ["Monoliths I", "walked through."],
    terminal: [
      "JPMC  :: SRE          2020-2022",
      "Cisco :: Sr. Sales Eng 2022-2023",
      "Hashi :: Sales Eng     2023-now",
    ],
    accent: "#64748b",
    layout: "left",
  },
  {
    id: "interstitial-2",
    type: "interstitial",
    lines: ["The real work", "happens after hours."],
    accent: "#64748b",
    layout: "center",
  },
  {
    id: "convergence",
    type: "visual",
    image: "/visuals/convergence.jpg",
    transition: "/visuals/transition-corporate-convergence.mp4",
    label: "THE CONVERGENCE",
    lines: ["Then my", "brother called."],
    terminal: [
      "cultural work + tech + failures + food",
      "= Yalla Bites",
    ],
    sub: "This time, it wasn't a side project.",
    accent: "#4ade80",
    layout: "right",
  },
  {
    id: "culture",
    type: "visual",
    image: "/visuals/culture.jpg",
    mobileImage: "/visuals/culture-mobile.jpg",
    transition: "/visuals/transition-convergence-culture.mp4",
    label: "THE CULTURE",
    lines: ["The part nobody", "guesses from", "my LinkedIn."],
    terminal: [
      "500+ weddings :: Al-Kuffiyeh Group",
      "Dabka Academy :: 100+ students",
    ],
    accent: "#e63946",
    layout: "left",
  },
  {
    id: "interstitial-3",
    type: "interstitial",
    lines: ["I fell in love with community."],
    accent: "#e63946",
    layout: "center",
  },
  {
    id: "contact",
    type: "visual",
    image: "/visuals/contact.jpg",
    transition: "/visuals/transition-culture-contact.mp4",
    lines: ["Let's build."],
    terminal: ["agent systems, community, wild ideas"],
    accent: "#7ec8e3",
    layout: "center",
    links: [
      { text: "Email", href: "mailto:yusuf@aai.agency" },
      { text: "GitHub", href: "https://github.com/snyberhabibi" },
      { text: "LinkedIn", href: "https://linkedin.com/in/yusufrahman" },
    ],
  },
];

// ─── Video transition (crossfade overlay) ──────────────
function VideoTransition({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (videoRef.current && videoRef.current.duration) {
        const mapped = Math.max(0, Math.min(1, (v - 0.15) / 0.7));
        videoRef.current.currentTime = mapped * videoRef.current.duration;
      }
    });
  }, [scrollYProgress]);

  // Opacity: fade in as you scroll into it, fade out as you leave
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      ref={ref}
      className="relative h-[50vh] sm:h-[70vh] w-full overflow-hidden"
      style={{ opacity }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
    </motion.div>
  );
}

// ─── Interstitial (text-only dark screen) ──────────────
function Interstitial({ chapter }: { chapter: Chapter }) {
  return (
    <section className="relative h-[60vh] sm:h-[70vh] w-full bg-[#0a0a0a] flex items-center justify-center px-10 sm:px-24">
      <div className="text-center max-w-2xl">
        {chapter.lines.map((line, i) => (
          <div key={i} className="overflow-hidden">
            <RevealWords
              text={line}
              delay={0.1 + i * 0.1}
              className="block font-display italic text-[clamp(1.2rem,3vw,2.2rem)] leading-[1.3] tracking-tight"
            />
          </div>
        ))}
      </div>
      {/* Accent line */}
      <motion.div
        className="absolute bottom-16 left-1/2 w-8 h-[1px] -translate-x-1/2"
        style={{ backgroundColor: chapter.accent, opacity: 0.3 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </section>
  );
}

// ─── Visual section ────────────────────────────────────
function VisualSection({
  chapter,
  index,
}: {
  chapter: Chapter;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.02]);

  const isHero = chapter.id === "hero";
  const isContact = chapter.id === "contact";

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex">
      {/* Background — mobile image swap via <picture> */}
      <motion.div
        className="absolute inset-0 w-full h-[115%] -top-[8%]"
        style={{ y, scale }}
      >
        <picture className="block w-full h-full">
          {chapter.mobileImage && (
            <source media="(max-width: 768px)" srcSet={chapter.mobileImage} />
          )}
          <img
            src={chapter.image}
            alt=""
            className="w-full h-full object-cover will-change-transform"
          />
        </picture>
        <div className="absolute inset-0 bg-black/45" />
      </motion.div>

      {/* Content */}
      <div
        className={`relative z-10 w-full flex flex-col ${
          chapter.layout === "center"
            ? "items-center justify-center text-center px-8 sm:px-20"
            : chapter.layout === "right"
              ? "items-end justify-end text-right px-8 sm:px-16 lg:px-[14%] pb-24 sm:pb-32"
              : "items-start justify-end text-left px-8 sm:px-16 lg:px-[14%] pb-24 sm:pb-32"
        }`}
      >
        {/* Label */}
        {chapter.label && (
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.6em] mb-5"
            style={{ color: isHero ? "rgba(255,255,255,0.25)" : chapter.accent }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {chapter.label}
          </motion.p>
        )}

        {/* Title */}
        <div className={`mb-6 ${isHero ? "" : "max-w-3xl"}`}>
          {chapter.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords
                text={line}
                delay={0.15 + i * 0.1}
                className={`block font-display font-medium leading-[1.05] tracking-tight text-white ${
                  isHero
                    ? "text-[clamp(2.5rem,8vw,7rem)]"
                    : "text-[clamp(1.4rem,3.5vw,3rem)]"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Subtitle */}
        {chapter.sub && (
          <motion.p
            className={`font-display italic max-w-md mb-6 ${
              isHero ? "text-sm sm:text-base text-white/35" : "text-sm"
            }`}
            style={!isHero ? { color: chapter.accent, opacity: 0.5 } : undefined}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {chapter.sub}
          </motion.p>
        )}

        {/* Terminal */}
        {chapter.terminal && (
          <div className={`max-w-md mt-1 ${chapter.layout === "right" ? "text-left" : ""}`}>
            {chapter.terminal.map((line, i) => (
              <motion.div
                key={i}
                className="font-mono text-[11px] sm:text-[13px] leading-relaxed mb-1"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.12 }}
              >
                <span style={{ color: chapter.accent, opacity: 0.4 }}>
                  {i === 0 ? "$ " : "> "}
                </span>
                <Typewriter
                  text={line}
                  delay={0.7 + i * 0.15}
                  speed={15}
                  className="text-white/40"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Links */}
        {isContact && chapter.links && (
          <motion.div
            className="flex gap-8 sm:gap-12 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {chapter.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-white/25 hover:text-white transition-colors duration-500"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.text}
              </a>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator */}
        {isHero && (
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <motion.div
              className="w-[1px] h-10 bg-white/12 mx-auto mb-2"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
            <p className="font-mono text-[7px] uppercase tracking-[0.5em] text-white/10">
              Scroll
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Chapter tracker ───────────────────────────────────
function useChapterTracker() {
  const [current, setCurrent] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const id = entry.target.getAttribute("data-chapter");
            if (id) setCurrent(id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("[data-chapter]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return current;
}

// ─── Main ──────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const currentChapter = useChapterTracker();
  useLenis();

  const visualChapters = chapters.filter((c) => c.type === "visual");
  const chapterLabel = visualChapters.find((c) => c.id === currentChapter)?.label || "";

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <CustomCursor />
      <Scanlines />
      {loaded && <Nav currentChapter={chapterLabel} />}

      <main className="bg-[#0a0a0a] cursor-none lg:cursor-none">
        {chapters.map((chapter, i) => (
          <div key={chapter.id} data-chapter={chapter.id}>
            {/* Video transition before visual sections */}
            {chapter.type === "visual" && chapter.transition && (
              <VideoTransition src={chapter.transition} />
            )}

            {/* Section */}
            {chapter.type === "visual" ? (
              <VisualSection chapter={chapter} index={i} />
            ) : (
              <Interstitial chapter={chapter} />
            )}
          </div>
        ))}
      </main>
    </>
  );
}
