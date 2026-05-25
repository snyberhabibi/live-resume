"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const chapters = [
  {
    id: "hero",
    image: "/visuals/hero.png",
    label: "Qatar",
    title: ["Yusuf", "Rahman"],
    body: "Everything reduces to dust.\nEverything can be rebuilt.",
    accent: "#e8a838",
  },
  {
    id: "origin",
    image: "/visuals/origin.png",
    label: "The Origin",
    title: ["Gaza. Kuwait.", "New York. Dallas.", "Qatar."],
    body: "My grandparents fled post-Nakba Palestine for Kuwait. My parents earned a scholarship to New York — their flight was three days before the Gulf War.\n\nDad worked three jobs while studying for his PhD. Mom raised five of us in a two-bedroom townhome and sold shawarma sandwiches outside the mosque after Friday prayers.\n\nThat was the first seed. The origin of homemade food — that bloomed into Yalla Bites.",
    accent: "#e8a838",
  },
  {
    id: "builder",
    image: "/visuals/builder.png",
    label: "The Builder",
    title: ["Some still stand.", "Some returned", "to dust."],
    body: "Age 8 — Glue Bookmarks\n2018 — @yusufstudios\n2017 — Arab Student Association\n2017 — Al-Kuffiyeh Group\n2018 — KASTEA\n2021 — Trippy\n2023 — FLUX Pickleball\n2024 — Dabka Academy\n2025 — Yalla Bites",
    accent: "#d4763c",
  },
  {
    id: "corporate",
    image: "/visuals/corporate.png",
    label: "The Corporate Bridge",
    title: ["Monoliths I", "walked through."],
    body: "JP Morgan Chase — Site Reliability Engineer, 2020–2022\n70-hour weeks. Corporate machine. It drained the life out of me.\n\nCisco AppDynamics — Senior Sales Engineer, 2022–2023\nSlipped through a crack somewhere. Excelled. The entrepreneur bug was itching.\n\nHashiCorp — Sales Engineer, 2023–Present\nContinued to excel. But the real work happens after hours.",
    accent: "#64748b",
  },
  {
    id: "convergence",
    image: "/visuals/convergence.png",
    label: "The Convergence",
    title: ["Then my", "brother called."],
    body: "Everything I'd built — the cultural work, the tech career, the entrepreneurial failures, the community, the food — it all converged into one thing.\n\nYalla Bites. A platform connecting homemade food from immigrant kitchens to the people who miss it most.\n\nThis time, it wasn't a side project. It was the project.",
    accent: "#4ade80",
  },
  {
    id: "culture",
    image: "/visuals/culture.png",
    label: "The Culture",
    title: ["The part nobody", "guesses from", "my LinkedIn."],
    body: "500+ weddings performed with Al-Kuffiyeh Group. The largest Middle Eastern zaffa and dabka group in the south of the United States. Still performing. Still preserving.\n\nI created Dabka Academy to pass the tradition forward. 5+ courses. 100+ students. For the love of Palestinian culture.\n\nI fell in love with community. And the ability to bring people together.",
    accent: "#e63946",
  },
  {
    id: "contact",
    image: "/visuals/contact.png",
    label: "Let's build.",
    title: ["Let's build."],
    body: "Always down to jam on agent systems, community projects, or wild ideas.",
    accent: "#7ec8e3",
    links: [
      { text: "yusuf@aai.agency", href: "mailto:yusuf@aai.agency" },
      { text: "GitHub", href: "https://github.com/snyberhabibi" },
      { text: "LinkedIn", href: "https://linkedin.com/in/yusufrahman" },
    ],
  },
];

function Chapter({
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

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax — image moves slower than scroll
  const y = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);

  // Text fades in as section enters viewport
  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [60, 0, 0, -40]);

  const isHero = index === 0;
  const isContact = chapter.id === "contact";

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
        style={{ y }}
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${chapter.image})` }}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content */}
      <motion.div
        className={`relative z-10 h-full flex flex-col ${
          isHero ? "items-center justify-center text-center" : "justify-end pb-16 sm:pb-24"
        } px-6 sm:px-16 lg:px-24`}
        style={isHero ? {} : { opacity, y: textY }}
      >
        {/* Chapter label */}
        {!isHero && (
          <p
            className="font-mono text-[10px] uppercase tracking-[0.4em] mb-4"
            style={{ color: chapter.accent }}
          >
            {chapter.label}
          </p>
        )}

        {isHero && (
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 mb-6">
            {chapter.label}
          </p>
        )}

        {/* Title */}
        <div className={`mb-6 ${isHero ? "" : "max-w-2xl"}`}>
          {chapter.title.map((line, i) => (
            <h2
              key={i}
              className={`font-display font-medium leading-[1.0] tracking-tight text-white/90 ${
                isHero
                  ? "text-6xl sm:text-8xl lg:text-9xl"
                  : "text-3xl sm:text-5xl lg:text-6xl"
              }`}
            >
              {line}
            </h2>
          ))}
        </div>

        {/* Body */}
        <div className={`max-w-xl ${isHero ? "" : ""}`}>
          {chapter.body.split("\n\n").map((para, i) => (
            <p
              key={i}
              className={`leading-relaxed mb-3 ${
                isHero
                  ? "text-base text-white/50 font-display italic"
                  : "text-sm sm:text-base text-white/50"
              }`}
            >
              {para}
            </p>
          ))}
        </div>

        {/* Links (contact only) */}
        {isContact && chapter.links && (
          <div className="flex flex-col gap-2 mt-6">
            {chapter.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-sm text-white/40 hover:text-white/80 transition-colors underline underline-offset-4"
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              >
                {link.text}
              </a>
            ))}
          </div>
        )}

        {/* Scroll indicator (hero only) */}
        {isHero && (
          <motion.p
            className="font-mono text-[9px] uppercase tracking-[0.5em] text-white/20 mt-12"
            animate={{ opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Scroll to explore
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-black">
      {chapters.map((chapter, i) => (
        <Chapter key={chapter.id} chapter={chapter} index={i} />
      ))}
    </main>
  );
}
