"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CHAPTERS, type Chapter, type RoleEntry } from "@/content/chapters";
import { CHAPTER_ACCENT, CHAPTER_ACCENT_LIGHT } from "@/three/config";
import { useScene } from "@/three/store";
import { RevealWords, SPRING, SPRING_SNAPPY } from "./Reveal";
import { Scramble } from "./Scramble";

// theme-aware scrim (rgb(var(--scrim)) = paper in light, ink in dark)
const SCRIM =
  "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgb(var(--scrim))]/97 via-[rgb(var(--scrim))]/60 to-transparent";

function Eyebrow({ label, accent, left = false }: { label: string; accent: string; left?: boolean }) {
  return (
    <motion.p
      className={`mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.45em] text-readable-subtle sm:text-[11px] ${
        left ? "justify-start" : "justify-center"
      }`}
      style={{ color: accent }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={SPRING}
    >
      <span className="h-px w-6 shrink-0" style={{ background: accent, opacity: 0.6 }} />
      <Scramble text={label} charMs={34} />
    </motion.p>
  );
}

// persistent scroll control: shows on every section until the last. Tapping it
// advances to the next section (handy on touch, where there's nothing to "wheel").
function ScrollHint() {
  const chapter = useScene((s) => s.chapter);
  const show = chapter < CHAPTERS.length - 1;
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 bottom-[7vh] z-[80] flex justify-center sm:bottom-4"
      animate={{ opacity: show ? 0.92 : 0, y: show ? 0 : 8 }}
      transition={{ duration: 0.5 }}
    >
      <button
        type="button"
        aria-label="Go to the next section"
        tabIndex={show ? 0 : -1}
        onClick={() =>
          window.dispatchEvent(
            new CustomEvent("lr:goto", { detail: useScene.getState().chapter + 1 }),
          )
        }
        className={`flex items-center gap-2.5 rounded-full border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/75 px-4 py-2.5 backdrop-blur-md transition-colors hover:border-[var(--fg)]/25 hover:bg-[rgb(var(--scrim))]/90 sm:gap-2 sm:px-3 sm:py-1.5 ${
          show ? "pointer-events-auto cursor-pointer" : "pointer-events-none"
        }`}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[var(--fg)]/65 sm:text-[8px]">
          scroll
        </span>
        <motion.svg
          viewBox="0 0 10 13"
          fill="none"
          className="h-[15px] w-[11px] text-[var(--fg)]/65 sm:h-[13px] sm:w-[10px]"
          animate={{ y: [0, 3, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M5 1v10M1.5 7.5 5 11l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>
    </motion.div>
  );
}

function Headline({ lines, isHero, center }: { lines: string[]; isHero: boolean; center: boolean }) {
  const Tag = isHero ? "h1" : "h2";
  const size = isHero
    ? "text-[clamp(1.9rem,5.8vw,4.4rem)]"
    : center
      ? "text-[clamp(1.9rem,6vw,4.2rem)]"
      : "text-[clamp(1.5rem,4.4vw,3.1rem)]";
  return (
    <Tag className="mb-6 text-balance text-readable">
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <RevealWords
            text={line}
            delay={0.12 + i * 0.1}
            className={`block font-display font-semibold leading-[1.05] tracking-[-0.015em] text-[var(--fg)] ${size}`}
          />
        </span>
      ))}
    </Tag>
  );
}

// a blinking terminal block cursor
function Cursor({ accent }: { accent: string }) {
  return (
    <motion.span
      aria-hidden
      className="ml-1 inline-block h-[0.95em] w-[0.5em] translate-y-[0.1em] align-baseline"
      style={{ background: accent }}
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 0.85, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }}
    />
  );
}

// types `text` out one character at a time, terminal-style, with a block cursor.
// An invisible sizer reserves the full width so the line doesn't jitter as it types.
function Typewriter({ text, accent }: { text: string; accent: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    if (!text) return;
    let k = 0;
    const id = setInterval(() => {
      k += 1;
      setN(k);
      if (k >= text.length) clearInterval(id);
    }, 55);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span className="relative inline-block text-left align-baseline">
      <span aria-hidden className="invisible whitespace-nowrap font-semibold">
        {text}
      </span>
      <span className="absolute left-0 top-0 flex items-center whitespace-nowrap font-semibold" style={{ color: accent }}>
        {text.slice(0, n)}
        <Cursor accent={accent} />
      </span>
    </span>
  );
}

// ─── "I wear many hats": the role types in like a terminal, in lock-step with
//     the 3D glyph above it (both read the shared hatIndex) ──────────────────
function ManyHats({ hats, accent }: { hats: string[]; accent: string }) {
  const i = useScene((s) => s.hatIndex) % hats.length;
  const setHatIndex = useScene((s) => s.setHatIndex);
  useEffect(() => {
    setHatIndex(0); // entering the intro restarts at the first hat
    const t = setInterval(
      () => setHatIndex((useScene.getState().hatIndex + 1) % hats.length),
      2600,
    );
    return () => clearInterval(t);
  }, [hats.length, setHatIndex]);
  return (
    <motion.div
      className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em] text-readable-subtle sm:text-[12px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ ...SPRING, delay: 0.7 }}
    >
      <span className="text-[var(--fg)]/55">I wear many hats:</span>
      <Typewriter text={hats[i]} accent={accent} />
    </motion.div>
  );
}

// ─── the life-motto, as a small editor card ──────────────────────────────────
const KEYWORDS = new Set(["if", "else", "return", "const", "let", "var", "function", "new"]);
const LITERALS = new Set(["true", "false", "null", "undefined"]);

function CodeLine({ line, accent }: { line: string; accent: string }) {
  if (line.trim().startsWith("//")) {
    return <div className="italic text-[var(--fg)]/65">{line}</div>;
  }
  const tokens = line.match(/[A-Za-z_]\w*|[^A-Za-z_]+/g) ?? [line];
  return (
    <div>
      {tokens.map((tok, i) => {
        const next = tokens[i + 1] ?? "";
        let color: string | undefined;
        let weight: number | undefined;
        if (KEYWORDS.has(tok)) {
          color = accent;
          weight = 600;
        } else if (LITERALS.has(tok)) {
          color = "#2f8f86";
        } else if (/^[A-Za-z_]\w*$/.test(tok) && next.startsWith("(")) {
          color = "var(--fg)";
          weight = 500;
        } else if (/^[A-Za-z_]\w*$/.test(tok)) {
          color = "var(--fg)";
        } else {
          color = "var(--fg)";
        }
        return (
          <span key={i} style={{ color, fontWeight: weight, opacity: weight ? 1 : 0.78 }}>
            {tok}
          </span>
        );
      })}
    </div>
  );
}

function CodeCard({ code, accent }: { code: string[]; accent: string }) {
  return (
    <motion.div
      className="mx-auto mt-9 w-full max-w-sm overflow-hidden rounded-xl border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/85 text-left shadow-[0_18px_50px_-14px_rgba(0,0,0,0.35)] backdrop-blur-xl"
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay: 0.55 }}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--fg)]/10 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.25em] text-[var(--fg)]/60">
          life.ts
        </span>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[12px] leading-[1.75] sm:text-[13px]">
        {code.map((line, i) => (
          <CodeLine key={i} line={line} accent={accent} />
        ))}
      </pre>
    </motion.div>
  );
}

// ─── experience: each role as a terminal window ──────────────────────────────
function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function TerminalRole({ role, accent, delay }: { role: RoleEntry; accent: string; delay: number }) {
  return (
    <motion.article
      className="overflow-hidden rounded-lg border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/85 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.3)] backdrop-blur-md"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay }}
    >
      <div className="flex items-center gap-1.5 border-b border-[var(--fg)]/10 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="h-2 w-2 rounded-full bg-[var(--fg)]/20" />
        <span className="ml-2 truncate font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--fg)]/50">
          {slug(role.company)} · zsh
        </span>
        {role.current && (
          <span className="ml-auto flex shrink-0 items-center gap-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[var(--fg)]/55">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: accent }} />
            live
          </span>
        )}
      </div>
      <div className="px-4 py-3 font-mono text-[11px] leading-relaxed sm:text-[12px]">
        <div className="text-[var(--fg)]/90">
          <span style={{ color: accent }}>$</span> <span className="font-semibold">{role.company}</span>
        </div>
        <div className="mb-2 text-[var(--fg)]/65">
          {role.role} · {role.period}
          {role.note ? ` (${role.note})` : ""}
        </div>
        {role.bullets.map((b, i) => (
          <div key={i} className="flex gap-2 text-[var(--fg)]/80">
            <span className="shrink-0" style={{ color: accent }}>
              ›
            </span>
            <span>{b}</span>
          </div>
        ))}
      </div>
    </motion.article>
  );
}

// ─── the record (stats) ───────────────────────────────────────────────────────
function Stats({ stats, accent }: { stats: { value: string; label: string }[]; accent: string }) {
  return (
    <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          className="rounded-2xl border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/80 px-4 py-5 text-center shadow-[0_16px_44px_-20px_rgba(0,0,0,0.45)] backdrop-blur-md"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.4 + i * 0.1 }}
        >
          <div className="font-display text-[clamp(1.9rem,4.8vw,2.9rem)] font-bold leading-none text-[var(--fg)]">
            {s.value}
          </div>
          <div className="mx-auto mt-2.5 h-0.5 w-7 rounded-full" style={{ background: accent }} />
          <div className="mx-auto mt-2.5 max-w-[11rem] text-[11px] leading-snug text-[var(--fg)]/70 sm:text-[12px]">
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── the toolbelt (skill groups) ──────────────────────────────────────────────
function Skills({
  skills,
  accent,
}: {
  skills: { group: string; items: string[] }[];
  accent: string;
}) {
  return (
    <div className="mt-6 grid max-w-2xl gap-5 sm:grid-cols-2">
      {skills.map((g, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...SPRING_SNAPPY, delay: 0.4 + i * 0.08 }}
        >
          <p
            className="mb-2 font-mono text-[10px] uppercase tracking-[0.3em]"
            style={{ color: accent }}
          >
            {g.group}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {g.items.map((it) => (
              <span
                key={it}
                className="rounded-md border border-[var(--fg)]/12 bg-[rgb(var(--scrim))]/40 px-2.5 py-1 font-mono text-[11px] text-[var(--fg)]/80 backdrop-blur-sm"
              >
                {it}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── "who I am": an auto-shuffling photo carousel ─────────────────────────────
function Gallery({ items }: { items: { src: string; alt: string; caption?: string }[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % items.length), 4200);
    return () => clearInterval(t);
  }, [items.length]);
  return (
    <motion.div
      // square sized off the viewport HEIGHT so the whole section fits any phone
      className="mx-auto w-[min(15rem,30svh)] lg:mx-0 lg:w-full lg:max-w-sm"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay: 0.5 }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-[var(--fg)]/12">
        {items.map((it, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <motion.img
            key={it.src}
            src={it.src}
            alt={it.alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            initial={false}
            animate={{ opacity: k === i ? 1 : 0, scale: k === i ? 1 : 1.05 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          />
        ))}
        {/* caption over a soft gradient */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-3.5 pt-14">
          <motion.p
            key={i}
            className="text-[11px] font-medium leading-snug text-white/95 sm:text-[12px]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {items[i].caption}
          </motion.p>
        </div>
        {/* progress dots (tap to jump) */}
        <div className="absolute right-3 top-3 flex gap-1.5">
          {items.map((it, k) => (
            <button
              key={it.src}
              type="button"
              aria-label={`Show photo ${k + 1} of ${items.length}`}
              onClick={() => setI(k)}
              className={`h-1.5 rounded-full bg-white shadow transition-all duration-300 ${
                k === i ? "w-5 opacity-95" : "w-1.5 opacity-50 hover:opacity-80"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function Section({ chapter, index }: { chapter: Chapter; index: number }) {
  const light = useScene((s) => s.theme === "light");
  const accent = light ? CHAPTER_ACCENT_LIGHT[index] : CHAPTER_ACCENT[index];
  const isHero = index === 0;

  // ── HERO: face → name → role → cycling hats line, then the morphing glyph
  //    shows through below it, then the welcoming line at the very bottom ──
  if (isHero) {
    return (
      <section
        id={`chapter-${chapter.id}`}
        aria-label={chapter.nav}
        tabIndex={-1}
        className="relative flex min-h-[100svh] flex-col items-center justify-between overflow-hidden px-6 pt-[5vh] pb-[19vh] text-center outline-none sm:px-12 sm:py-[8vh]"
      >
        {/* legibility washes: top behind the title, bottom behind the closing line.
            Mobile drops the glyph low + lifts the line, so the bottom wash runs taller. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-[rgb(var(--scrim))]/90 via-[rgb(var(--scrim))]/40 to-transparent sm:h-[46%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[rgb(var(--scrim))]/90 to-transparent sm:h-[26%]"
        />

        {/* TOP: photo → name → role → the cycling "many hats" line */}
        <div className="relative z-[1] flex w-full max-w-4xl flex-col items-center">
          {chapter.portrait && (
            <motion.img
              src={chapter.portrait}
              alt="Yusuf Rahman"
              width={104}
              height={104}
              className="mb-4 h-16 w-16 rounded-full object-cover shadow-xl ring-1 ring-[var(--fg)]/25 sm:mb-4 sm:h-20 sm:w-20"
              style={{ objectPosition: "center 22%" }}
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.15 }}
            />
          )}
          {chapter.eyebrow && <Eyebrow label={chapter.eyebrow} accent={accent} />}
          <Headline lines={chapter.lines} isHero center />
          {chapter.role && (
            <motion.p
              className="mt-2 font-mono text-[12px] uppercase tracking-[0.4em] text-[var(--fg)]/70 text-readable-subtle sm:text-[13px]"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING, delay: 0.5 }}
            >
              {chapter.role}
            </motion.p>
          )}
          {chapter.hats && <ManyHats hats={chapter.hats} accent={accent} />}
        </div>

        {/* MIDDLE: the morphing "many hats" glyph renders here (3D canvas behind) */}

        {/* BOTTOM: the welcoming line */}
        {chapter.sub && (
          <motion.p
            className="relative z-[1] mx-auto max-w-sm text-balance font-display text-[15px] text-[var(--fg)]/85 text-readable sm:max-w-xl sm:text-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 1.0 }}
          >
            {chapter.sub}
          </motion.p>
        )}
      </section>
    );
  }

  // ── CENTER sections: approach, record, contact ──
  if (chapter.kind === "center") {
    const isContact = chapter.id === "contact";
    return (
      <section
        id={`chapter-${chapter.id}`}
        aria-label={chapter.nav}
        tabIndex={-1}
        className={`relative flex min-h-[100svh] justify-center overflow-hidden px-6 outline-none sm:px-12 ${
          isContact ? "items-end pb-[8vh]" : "items-center"
        }`}
      >
        {/* contact: the title sits low; a bottom scrim lifts it off the form */}
        {isContact && <div aria-hidden className={`${SCRIM} h-[58%]`} />}
        {!isContact && (
          // soft paper halo lifts the centered text/code off the dark ink form
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 52% at 50% 50%, rgba(var(--scrim),0.68) 0%, rgba(var(--scrim),0.36) 42%, transparent 72%)",
            }}
          />
        )}
        <div className="relative z-[1] max-w-4xl text-center">
          {chapter.eyebrow && <Eyebrow label={chapter.eyebrow} accent={accent} />}
          <Headline lines={chapter.lines} isHero={false} center />

          {/* sub line - for non-hero centers shows directly under the headline */}
          {chapter.sub && (
            <motion.p
              className={`mx-auto max-w-lg font-display text-readable ${
                isContact ? "text-base sm:text-xl" : "text-base italic sm:text-lg"
              }`}
              style={{ color: isContact ? "var(--fg)" : accent }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.45 }}
            >
              {chapter.sub}
            </motion.p>
          )}

          {chapter.body && (
            <motion.p
              className="mx-auto mt-5 max-w-xl text-[14px] leading-relaxed text-readable-subtle text-[var(--fg)]/75 sm:text-[15px]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.5 }}
            >
              {chapter.body}
            </motion.p>
          )}

          {chapter.code && <CodeCard code={chapter.code} accent={accent} />}
          {chapter.stats && <Stats stats={chapter.stats} accent={accent} />}

          {isContact && chapter.links && (
            <motion.div
              className="mt-9 flex justify-center gap-10 text-readable-subtle sm:gap-14"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.7 }}
            >
              {chapter.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="group relative font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--fg)]/75 transition-colors duration-500 hover:text-[var(--fg)] sm:text-[13px]"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {link.text}
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
                    style={{ background: accent }}
                  />
                </a>
              ))}
            </motion.div>
          )}
          {isContact && chapter.note && (
            <motion.p
              className="mt-7 font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg)]/60"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.9 }}
            >
              {chapter.note}
            </motion.p>
          )}
        </div>

      </section>
    );
  }

  // ── LEFT sections: about, how I work, experience, toolbelt ──
  return (
    <section
      id={`chapter-${chapter.id}`}
      aria-label={chapter.nav}
      tabIndex={-1}
      className="relative flex min-h-[100svh] items-end overflow-hidden outline-none"
    >
      <div aria-hidden className={`${SCRIM} h-[92%]`} />
      <div className="relative z-[1] w-full max-w-4xl px-6 pb-20 sm:px-10 sm:pb-20 lg:px-[9%] lg:pb-24">
        {chapter.eyebrow && <Eyebrow label={chapter.eyebrow} accent={accent} left />}
        <Headline lines={chapter.lines} isHero={false} center={false} />

        {chapter.tag && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.3 }}
          >
            <span
              className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em]"
              style={{ borderColor: accent, color: accent }}
            >
              {chapter.tag}
            </span>
          </motion.div>
        )}

        {chapter.sub && (
          <motion.p
            className="mb-1 max-w-xl font-display text-[15px] italic text-readable-subtle sm:text-base"
            style={{ color: accent }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING, delay: 0.35 }}
          >
            {chapter.sub}
          </motion.p>
        )}

        {chapter.roles && (
          <div className="mt-6 grid max-w-4xl gap-4 sm:grid-cols-2">
            {chapter.roles.map((role, i) => (
              <TerminalRole key={role.company} role={role} accent={accent} delay={0.35 + i * 0.07} />
            ))}
          </div>
        )}

        {chapter.skills && <Skills skills={chapter.skills} accent={accent} />}

        {chapter.strengths && (
          <div className="mt-6 max-w-4xl">
            <ul className="grid gap-x-9 gap-y-2.5 sm:grid-cols-2">
              {chapter.strengths.map((s, i) => (
                <motion.li
                  key={i}
                  className="flex gap-2.5 text-[13.5px] leading-relaxed text-readable-subtle text-[var(--fg)]/85 sm:text-[14px]"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING_SNAPPY, delay: 0.4 + i * 0.08 }}
                >
                  <span className="shrink-0" style={{ color: accent }}>
                    ▸
                  </span>
                  <span>{s}</span>
                </motion.li>
              ))}
            </ul>
            {chapter.growth && (
              <motion.div
                className="mt-6 max-w-xl border-l-2 pl-4"
                style={{ borderColor: accent }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING, delay: 0.6 }}
              >
                <p
                  className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: accent }}
                >
                  Growth areas
                </p>
                <p className="text-[13px] leading-relaxed text-readable-subtle text-[var(--fg)]/80 sm:text-[14px]">
                  {chapter.growth}
                </p>
              </motion.div>
            )}
          </div>
        )}

        {chapter.persona && (
          <div className="mt-5 grid max-w-4xl items-center gap-4 lg:grid-cols-2 lg:gap-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              {chapter.portrait && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={chapter.portrait}
                  alt="Yusuf Rahman"
                  loading="lazy"
                  width={104}
                  height={104}
                  className="h-20 w-20 shrink-0 rounded-full object-cover shadow-lg ring-1 ring-[var(--fg)]/20 sm:h-24 sm:w-24"
                  style={{ objectPosition: "center 22%" }}
                />
              )}
              <ul className="space-y-2">
                {chapter.persona.map((p, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-2.5 text-[13px] leading-relaxed text-readable-subtle text-[var(--fg)]/85 sm:text-[13.5px]"
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ ...SPRING_SNAPPY, delay: 0.4 + i * 0.07 }}
                  >
                    <span className="shrink-0" style={{ color: accent }}>
                      ▸
                    </span>
                    <span>{p}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            {chapter.gallery && <Gallery items={chapter.gallery} />}
          </div>
        )}
      </div>
    </section>
  );
}

export function Overlay() {
  return (
    <>
      <main className="relative z-10">
        {CHAPTERS.map((chapter, i) => (
          <Section key={chapter.id} chapter={chapter} index={i} />
        ))}
      </main>
      <ScrollHint />
    </>
  );
}
