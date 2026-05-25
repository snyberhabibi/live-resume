"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Lenis from "lenis";

// ─── Lenis smooth scroll ───────────────────────────────
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

// ─── Staggered word reveal ─────────────────────────────
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

// ─── Clip reveal for paragraphs ────────────────────────
function ClipReveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <div ref={ref} className={`overflow-hidden ${className || ""}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Preloader ─────────────────────────────────────────
function Preloader({ onComplete }: { onComplete: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
    >
      <motion.div
        className="font-mono text-[11px] uppercase tracking-[0.5em] text-white/30"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Yusuf Rahman
      </motion.div>
    </motion.div>
  );
}

// ─── Chapter data ──────────────────────────────────────
const chapters = [
  {
    id: "hero",
    image: "/visuals/hero.jpg",
    label: "Qatar",
    lines: ["Yusuf", "Rahman"],
    body: null,
    sub: "Everything reduces to dust. Everything can be rebuilt.",
    accent: "#e8a838",
    layout: "center" as const,
  },
  {
    id: "origin",
    image: "/visuals/origin.jpg",
    label: "The Origin",
    lines: ["Gaza. Kuwait.", "New York. Dallas.", "Qatar."],
    body: [
      "My grandparents fled post-Nakba Palestine for Kuwait. My parents earned a scholarship to New York — their flight was three days before the Gulf War.",
      "Dad worked three jobs while studying for his PhD. Mom raised five of us in a two-bedroom townhome and sold shawarma sandwiches outside the mosque after Friday prayers.",
    ],
    sub: "That was the first seed. The origin of homemade food — that bloomed into Yalla Bites.",
    accent: "#e8a838",
    layout: "left" as const,
  },
  {
    id: "builder",
    image: "/visuals/builder.jpg",
    label: "The Builder",
    lines: ["Some still stand.", "Some returned to dust."],
    body: [
      "Age 8 — Glue Bookmarks · 2018 — @yusufstudios · 2017 — Arab Student Association · 2017 — Al-Kuffiyeh Group · 2018 — KASTEA · 2021 — Trippy · 2023 — FLUX Pickleball · 2024 — Dabka Academy · 2025 — Yalla Bites",
    ],
    sub: null,
    accent: "#d4763c",
    layout: "right" as const,
  },
  {
    id: "corporate",
    image: "/visuals/corporate.jpg",
    label: "The Corporate Bridge",
    lines: ["Monoliths I", "walked through."],
    body: [
      "JP Morgan Chase — Site Reliability Engineer, 2020–2022",
      "Cisco AppDynamics — Senior Sales Engineer, 2022–2023",
      "HashiCorp — Sales Engineer, 2023–Present",
    ],
    sub: "The real work happens after hours.",
    accent: "#64748b",
    layout: "left" as const,
  },
  {
    id: "convergence",
    image: "/visuals/convergence.jpg",
    label: "The Convergence",
    lines: ["Then my", "brother called."],
    body: [
      "Everything I'd built — the cultural work, the tech career, the entrepreneurial failures, the community, the food — it all converged into one thing.",
      "Yalla Bites. A platform connecting homemade food from immigrant kitchens to the people who miss it most.",
    ],
    sub: "This time, it wasn't a side project. It was the project.",
    accent: "#4ade80",
    layout: "right" as const,
  },
  {
    id: "culture",
    image: "/visuals/culture.jpg",
    label: "The Culture",
    lines: ["The part nobody", "guesses from", "my LinkedIn."],
    body: [
      "500+ weddings performed with Al-Kuffiyeh Group. The largest Middle Eastern zaffa and dabka group in the south of the United States.",
      "I created Dabka Academy to pass the tradition forward. 5+ courses. 100+ students. For the love of Palestinian culture.",
    ],
    sub: "I fell in love with community. And the ability to bring people together.",
    accent: "#e63946",
    layout: "left" as const,
  },
  {
    id: "contact",
    image: "/visuals/contact.jpg",
    label: "",
    lines: ["Let's build."],
    body: ["Always down to jam on agent systems, community projects, or wild ideas."],
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

// ─── Section component ─────────────────────────────────
function Section({
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

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  const isHero = index === 0;
  const isContact = chapter.id === "contact";

  const alignClass =
    chapter.layout === "center"
      ? "items-center justify-center text-center"
      : chapter.layout === "right"
        ? "items-end justify-end text-right pr-6 sm:pr-16 lg:pr-24 pb-20 sm:pb-28"
        : "items-start justify-end text-left pl-6 sm:pl-16 lg:pl-24 pb-20 sm:pb-28";

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 w-full h-[130%] -top-[15%]"
        style={{ y, scale }}
      >
        <div
          className="w-full h-full bg-cover bg-center will-change-transform"
          style={{ backgroundImage: `url(${chapter.image})` }}
        />
        <div className="absolute inset-0 bg-black/35" />
      </motion.div>

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col ${alignClass}`}>
        {/* Label */}
        {chapter.label && (
          <ClipReveal delay={0.1}>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.5em] mb-5"
              style={{ color: isHero ? "rgba(255,255,255,0.35)" : chapter.accent }}
            >
              {chapter.label}
            </p>
          </ClipReveal>
        )}

        {/* Title — word by word reveal */}
        <div className={`mb-6 ${isHero ? "" : "max-w-2xl"}`}>
          {chapter.lines.map((line, i) => (
            <div key={i} className="overflow-hidden">
              <RevealWords
                text={line}
                delay={0.2 + i * 0.12}
                className={`block font-display font-medium leading-[1.0] tracking-tight text-white ${
                  isHero
                    ? "text-[clamp(3rem,10vw,9rem)]"
                    : "text-[clamp(1.8rem,5vw,4rem)]"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Subtitle */}
        {chapter.sub && (
          <ClipReveal delay={0.5}>
            <p
              className={`font-display italic leading-relaxed max-w-lg ${
                isHero
                  ? "text-base sm:text-lg text-white/40"
                  : "text-sm sm:text-base mt-4"
              }`}
              style={!isHero ? { color: chapter.accent, opacity: 0.7 } : undefined}
            >
              {chapter.sub}
            </p>
          </ClipReveal>
        )}

        {/* Body paragraphs */}
        {chapter.body && (
          <div className={`max-w-lg mt-4 ${isHero ? "" : ""}`}>
            {chapter.body.map((para, i) => (
              <ClipReveal key={i} delay={0.6 + i * 0.1}>
                <p className="text-[13px] sm:text-sm text-white/40 leading-relaxed mb-2">
                  {para}
                </p>
              </ClipReveal>
            ))}
          </div>
        )}

        {/* Links */}
        {isContact && chapter.links && (
          <ClipReveal delay={0.8} className="mt-8">
            <div className="flex gap-8">
              {chapter.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors duration-500"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.text}
                </a>
              ))}
            </div>
          </ClipReveal>
        )}

        {/* Scroll indicator (hero only) */}
        {isHero && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            <motion.div
              className="w-[1px] h-10 bg-white/20 mx-auto mb-3"
              animate={{ scaleY: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformOrigin: "top" }}
            />
            <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-white/15">
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
      <main className="bg-[#0a0a0a]">
        {chapters.map((chapter, i) => (
          <Section key={chapter.id} chapter={chapter} index={i} />
        ))}
      </main>
    </>
  );
}
