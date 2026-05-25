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

// ─── Lenis smooth scroll ───────────────────────────────
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

// ─── Typewriter text — character by character reveal ───
function Typewriter({
  text,
  delay = 0,
  speed = 25,
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
        <span className="animate-pulse text-current">_</span>
      )}
    </span>
  );
}

// ─── Staggered word reveal for titles ──────────────────
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
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
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

// ─── Terminal line — single line with typewriter ───────
function TerminalLine({
  text,
  delay = 0,
  prefix = ">",
  accent,
}: {
  text: string;
  delay?: number;
  prefix?: string;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      className="font-mono text-[12px] sm:text-[13px] leading-relaxed mb-1.5"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <span style={{ color: accent, opacity: 0.5 }}>{prefix} </span>
      <Typewriter
        text={text}
        delay={delay + 0.2}
        speed={18}
        className="text-white/50"
      />
    </motion.div>
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
          className="font-mono text-[10px] uppercase tracking-[0.6em] text-white/20 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Initializing
        </motion.div>
        <motion.div
          className="font-display text-2xl text-white/60 tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Yusuf Rahman
        </motion.div>
        <motion.div
          className="w-24 h-[1px] bg-white/10 mx-auto mt-6 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
}

// ─── CRT scanline overlay ──────────────────────────────
function Scanlines() {
  return (
    <div
      className="fixed inset-0 z-[50] pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
      }}
    />
  );
}

// ─── Chapter data ──────────────────────────────────────
const chapters = [
  {
    id: "hero",
    image: "/visuals/hero.jpg",
    transition: null,
    label: "QATAR",
    lines: ["Yusuf", "Rahman"],
    terminal: null,
    sub: "Everything reduces to dust. Everything can be rebuilt.",
    accent: "#e8a838",
    layout: "center" as const,
  },
  {
    id: "origin",
    image: "/visuals/origin.jpg",
    transition: "/visuals/transition-hero-origin.mp4",
    label: "THE ORIGIN",
    lines: ["Gaza. Kuwait.", "New York. Dallas.", "Qatar."],
    terminal: [
      "grandparents fled post-Nakba Palestine for Kuwait",
      "parents earned a scholarship to New York",
      "flight was three days before the Gulf War",
      "dad worked three jobs while studying for his PhD",
      "mom sold shawarma outside the mosque after Friday prayers",
      "that was the first seed",
    ],
    sub: "The origin of homemade food — that bloomed into Yalla Bites.",
    accent: "#e8a838",
    layout: "left" as const,
  },
  {
    id: "builder",
    image: "/visuals/builder.jpg",
    transition: "/visuals/transition-origin-builder.mp4",
    label: "THE BUILDER",
    lines: ["Some still stand.", "Some returned", "to dust."],
    terminal: [
      "age_8     :: Glue Bookmarks",
      "2017      :: Arab Student Association",
      "2017      :: Al-Kuffiyeh Group",
      "2018      :: KASTEA",
      "2021      :: Trippy",
      "2023      :: FLUX Pickleball",
      "2024      :: Dabka Academy",
      "2025      :: Yalla Bites ■",
    ],
    sub: null,
    accent: "#d4763c",
    layout: "right" as const,
  },
  {
    id: "corporate",
    image: "/visuals/corporate.jpg",
    transition: "/visuals/transition-builder-corporate.mp4",
    label: "THE CORPORATE BRIDGE",
    lines: ["Monoliths I", "walked through."],
    terminal: [
      "JPMC    :: Site Reliability Engineer    2020-2022",
      "Cisco   :: Senior Sales Engineer        2022-2023",
      "Hashi   :: Sales Engineer               2023-now",
    ],
    sub: "The real work happens after hours.",
    accent: "#64748b",
    layout: "left" as const,
  },
  {
    id: "convergence",
    image: "/visuals/convergence.jpg",
    transition: "/visuals/transition-corporate-convergence.mp4",
    label: "THE CONVERGENCE",
    lines: ["Then my", "brother called."],
    terminal: [
      "cultural work + tech career + failures + community + food",
      "= Yalla Bites",
      "connecting homemade food from immigrant kitchens",
      "to the people who miss it most",
    ],
    sub: "This time, it wasn't a side project. It was the project.",
    accent: "#4ade80",
    layout: "right" as const,
  },
  {
    id: "culture",
    image: "/visuals/culture.jpg",
    transition: "/visuals/transition-convergence-culture.mp4",
    label: "THE CULTURE",
    lines: ["The part nobody", "guesses from", "my LinkedIn."],
    terminal: [
      "500+ weddings performed with Al-Kuffiyeh Group",
      "largest Middle Eastern zaffa and dabka group in the south",
      "still performing. still preserving.",
      "Dabka Academy :: 5+ courses :: 100+ students",
      "for the love of Palestinian culture",
    ],
    sub: "I fell in love with community.",
    accent: "#e63946",
    layout: "left" as const,
  },
  {
    id: "contact",
    image: "/visuals/contact.jpg",
    transition: "/visuals/transition-culture-contact.mp4",
    label: "",
    lines: ["Let's build."],
    terminal: [
      "agent systems, community projects, wild ideas",
    ],
    sub: null,
    accent: "#7ec8e3",
    layout: "center" as const,
    links: [
      { text: "yusuf@aai.agency", href: "mailto:yusuf@aai.agency" },
      { text: "GitHub", href: "https://github.com/snyberhabibi" },
      { text: "LinkedIn", href: "https://linkedin.com/in/yusufrahman" },
    ],
  },
];

// ─── Video transition between chapters ─────────────────
function VideoTransition({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Play video based on scroll position through this section
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      if (videoRef.current && videoRef.current.duration) {
        // Map scroll 0.2-0.8 to video 0-duration
        const mapped = Math.max(0, Math.min(1, (v - 0.2) / 0.6));
        videoRef.current.currentTime = mapped * videoRef.current.duration;
      }
    });
  }, [scrollYProgress]);

  return (
    <div ref={ref} className="relative h-[60vh] w-full overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient blends */}
      <div
        className="absolute inset-x-0 top-0 h-32 z-[1]"
        style={{ background: "linear-gradient(to bottom, #0a0a0a, transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-32 z-[1]"
        style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }}
      />
    </div>
  );
}

// ─── Image section component ───────────────────────────
function ImageSection({
  chapter,
  index,
}: {
  chapter: (typeof chapters)[number];
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.03]);

  const isHero = index === 0;
  const isContact = chapter.id === "contact";

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden flex">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{ y, scale }}
      >
        <div
          className="w-full h-full bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${chapter.image})` }}
        />
        <div className="absolute inset-0 bg-black/45" />
      </motion.div>

      {/* Content */}
      <div
        className={`relative z-10 w-full flex flex-col ${
          chapter.layout === "center"
            ? "items-center justify-center text-center px-10 sm:px-24"
            : chapter.layout === "right"
              ? "items-end justify-end text-right px-10 sm:px-20 lg:px-[14%] pb-28 sm:pb-36"
              : "items-start justify-end text-left px-10 sm:px-20 lg:px-[14%] pb-28 sm:pb-36"
        }`}
      >
        {/* Label */}
        {chapter.label && (
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.6em] mb-6"
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
        <div className={`mb-8 ${isHero ? "" : "max-w-3xl"}`}>
          {chapter.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords
                text={line}
                delay={0.15 + i * 0.1}
                className={`block font-display font-medium leading-[1.05] tracking-tight text-white ${
                  isHero
                    ? "text-[clamp(3rem,9vw,8rem)]"
                    : "text-[clamp(1.5rem,4vw,3.2rem)]"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Subtitle */}
        {chapter.sub && (
          <motion.p
            className={`font-display italic leading-relaxed max-w-md mb-8 ${
              isHero ? "text-base sm:text-lg text-white/35" : "text-sm sm:text-base"
            }`}
            style={!isHero ? { color: chapter.accent, opacity: 0.55 } : undefined}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {chapter.sub}
          </motion.p>
        )}

        {/* Terminal body */}
        {chapter.terminal && (
          <div className={`max-w-lg mt-2 ${chapter.layout === "right" ? "text-left" : ""}`}>
            {chapter.terminal.map((line, i) => (
              <TerminalLine
                key={i}
                text={line}
                delay={0.6 + i * 0.15}
                prefix={i === 0 ? "$" : ">"}
                accent={chapter.accent}
              />
            ))}
          </div>
        )}

        {/* Links */}
        {isContact && chapter.links && (
          <motion.div
            className="flex gap-10 mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            {chapter.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] uppercase tracking-[0.15em] text-white/25 hover:text-white transition-colors duration-500"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.text}
              </a>
            ))}
          </motion.div>
        )}

        {/* Scroll indicator (hero only) */}
        {isHero && (
          <motion.div
            className="absolute bottom-14 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <motion.div
              className="w-[1px] h-12 bg-white/15 mx-auto mb-3"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
            <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/12">
              Scroll
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// ─── Main ──────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  useLenis();

  return (
    <>
      <AnimatePresence>
        {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <Scanlines />
      <main className="bg-[#0a0a0a]">
        {chapters.map((chapter, i) => (
          <div key={chapter.id}>
            {/* Video transition between chapters */}
            {chapter.transition && (
              <VideoTransition src={chapter.transition} />
            )}
            {/* Chapter section */}
            <ImageSection chapter={chapter} index={i} />
          </div>
        ))}
      </main>
    </>
  );
}
